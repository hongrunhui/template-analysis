/*!
 * template.js v0.7.1 (https://github.com/yanhaijing/template.js)
 * API https://github.com/yanhaijing/template.js/blob/master/doc/api.md
 * Copyright 2015 yanhaijing. All Rights Reserved
 * Licensed under MIT (https://github.com/yanhaijing/template.js/blob/master/MIT-LICENSE.txt)
 */
;(function(root, factory) {
    var template = factory(root);
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('template', function() {
            return template;
        });
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = template;
    } else {
        // Browser globals
        var _template = root.template;

        template.noConflict = function() {
            if (root.template === template) {
                root.template = _template;
            }

            return template;
        };
        root.template = template;
    }
}(this, function(root) {
    'use strict';
    var o = {
        sTag: '<%',//开始标签
        eTag: '%>',//结束标签
        compress: false,//是否压缩html
        escape: true, //默认输出是否进行HTML转义
        error: function (e) {}//错误回调
    };
    var functionMap = {}; //内部函数对象
    //修饰器前缀
    var modifierMap = {
        '': function (param) {return nothing(param)},
        'h': function (param) {return encodeHTML(param)},
        'u': function (param) {return encodeURI(param)}
    };

    var toString = {}.toString;
    var slice = [].slice;
    function type(x) {
        if(x === null){
            return 'null';
        }

        var t= typeof x;

        if(t !== 'object'){
            return t;
        }

        var c = toString.call(x).slice(8, -1).toLowerCase();
        if(c !== 'object'){
            return c;
        }

        if(x.constructor==Object){
            return c;
        }

        return 'unkonw';
    }

    function isObject(obj) {
        return type(obj) === 'object';
    }
    function isFunction(fn) {
        return type(fn) === 'function';
    }
    function isString(str) {
        return type(str) === 'string';
    }
    function extend() {
        var target = arguments[0] || {};
        var arrs = slice.call(arguments, 1);
        var len = arrs.length;
     
        for (var i = 0; i < len; i++) {
            var arr = arrs[i];
            for (var name in arr) {
                target[name] = arr[name];
            }
     
        }
        return target;
    }
    function clone() {
        var args = slice.call(arguments);
        return extend.apply(null, [{}].concat(args));
    }
    function nothing(param) {
        return param;
    }
    function encodeHTML(source) {
        return String(source)
            ._replace(/&/g,'&amp;')
            ._replace(/</g,'&lt;')
            ._replace(/>/g,'&gt;')
            ._replace(/\\/g,'&#92;')
            ._replace(/"/g,'&quot;')
            ._replace(/'/g,'&#39;');
    }
    function compress(html) {
        return html._replace(/\s+/g, ' ')._replace(/<!--[\w\W]*?-->/g, '');
    }
    function consoleAdapter(cmd, msg) {
        typeof console !== 'undefined' && console[cmd] && console[cmd](msg);
    }
    function handelError(e) {
        var message = 'template.js error\n\n';

        for (var key in e) {
            message += '<' + key + '>\n' + e[key] + '\n\n';
        }
        message += '<message>\n' + e.message + '\n\n';
        consoleAdapter('error', message);

        o.error(e);
        function error() {
            return 'template.js error';
        }
        error.toString = function () {
            return '__code__ = "template.js error"';
        }
        return error;
    }
    function parse(tpl, opt) {
        var code = '';
        var sTag = opt.sTag;
        var eTag = opt.eTag;
        var escape = opt.escape;
        function parsehtml(line) {
            // 单双引号转义，换行符替换为空格
            line = line._replace(/('|")/g, '\\$1')._replace(/\n/g, ' ');
            return ';__code__ += ("' + line + '")\n';
        }
        function parsejs(line) {              
            //var reg = /^(:?)(.*?)=(.*)$/;
            var reg = /^(?:=|(:.*?)=)(.*)$/
            var html;
            var arr;
            var modifier;

            // = := :*=
            // :h=123 [':h=123', 'h', '123']
            if (arr = reg._exec(line)) {
                html = arr[2]; // 输出
                if (Boolean(arr[1])) {
                    // :开头
                    modifier = arr[1].slice(1);
                } else {
                    // = 开头
                    modifier = escape ? 'h' : '';
                }

                return ';__code__ += __modifierMap__["' + modifier + '"](typeof (' + html + ') !== "undefined" ? (' + html + ') : "")\n';
            }
            
            //原生js
            return ';' + line + '\n';
        }

        var tokens = tpl.split(sTag);

        for (var i = 0, len = tokens.length; i < len; i++) {
            var token = tokens[i].split(eTag);

            if (token.length === 1) {
                code += parsehtml(token[0]);
            } else {
                code += parsejs(token[0], true);
                if (token[1]) {
                    code += parsehtml(token[1]);
                }
            }
        }

        return code;
    }
    function compiler(tpl, opt) {
        var mainCode = parse(tpl, opt);

        var headerCode = '\n' + 
        '    var html = (function (__data__, __modifierMap__) {\n' + 
        '        var __str__ = "", __code__ = "";\n' + 
        '        for(var key in __data__) {\n' + 
        '            __str__+=("var " + key + "=__data__[\'" + key + "\'];");\n' + 
        '        }\n' + 
        '        eval(__str__);\n\n';

        var footerCode = '\n' + 
        '        ;return __code__;\n' + 
        '    }(__data__, __modifierMap__));\n' + 
        '    return html;\n';

        var code = headerCode + mainCode + footerCode;
        code = code._replace(/[\r]/g, ' '); // ie 7 8 会报错，不知道为什么
        try {
            var Render = new _Function('__data__', '__modifierMap__', code); 
            Render.toString = function () {
                return mainCode;
            }
            return Render;
        } catch(e) {
            e.temp = 'function anonymous(__data__, __modifierMap__) {' + code + '}';
            throw e;
        }  
    }
    function compile(tpl, opt) {
        opt = clone(o, opt);

        try {
            var Render = compiler(tpl, opt);
        } catch(e) {
            e.name = 'CompileError';
            e.tpl = tpl;
            e.render = e.temp;
            delete e.temp;
            return handelError(e);
        }

        function render(data) {
            data = clone(functionMap, data);
            try {
                var html = Render(data, modifierMap);
                html = opt.compress ? compress(html) : html;
                return html;
            } catch(e) {
                e.name = 'RenderError';
                e.tpl = tpl;
                e.render = Render.toString();
                return handelError(e)();
            }            
        }

        render.toString = function () {
            return Render.toString();
        };
        return render;
    }
    function template(tpl, data) {
        if (typeof tpl !== 'string') {
            return '';
        }

        var fn = compile(tpl);
        if (!isObject(data)) {
            return fn;
        }

        return fn(data);
    }

    template.config = function (option) {
        if (isObject(option)) {
            o = extend(o, option);
        }
        return clone(o);
    };

    template.registerFunction = function(name, fn) {
        if (!isString(name)) {
            return clone(functionMap);
        }
        if (!isFunction(fn)) {
            return functionMap[name];
        }

        return functionMap[name] = fn;
    }
    template.unregisterFunction = function (name) {
        if (!isString(name)) {
            return false;
        }
        delete functionMap[name];
        return true;
    }

    template.registerModifier = function(name, fn) {
        if (!isString(name)) {
            return clone(modifierMap);
        }
        if (!isFunction(fn)) {
            return modifierMap[name];
        }

        return modifierMap[name] = fn;
    }
    template.unregisterModifier = function (name) {
        if (!isString(name)) {
            return false;
        }
        delete modifierMap[name];
        return true;
    }

    template.__encodeHTML = encodeHTML;
    template.__compress = compress;
    template.__handelError = handelError;
    template.__compile = compile;
    template.version = '0.7.1';
    return template;
}));
window.__DATA__  = [];
String.prototype._replace = function(re, cb) {
    var start = new Date().getTime();
    var result = this.replace(re, cb);
    var end = new Date().getTime();
    var info = {
        string: this.toString(),
        result: result,
        re: re.toString(),
        cb: cb,
        time: end - start,
        type: 'replace',
        change: this.toString() !== result.toString()
    };
    __DATA__.push(info);
    return result;
}
Array.prototype._join = function(str) {
    var result = this.join(str);
    var info = {
        string: this,
        result: result,
        re: str,
        type: 'join',
        change: this.toString() !== result.toString()
    };
    __DATA__.push(info);
    return result;
};
String.prototype._split = function(re) {
    var result = this.split(re);
    var info = {
        string: this.toString(),
        result: result,
        re: re,
        type: 'split',
        change: this.toString() !== result.toString()
    };
    __DATA__.push(info);
    return result;
};
function string(obj){
    if (obj && obj.toString) {
        return obj.toString();
    }
    else {
        return obj;
    }
}
String.prototype._match = function(re) {
    var result = this.match(re);
    var info = {
        string: string(this),
        result: result,
        re: re,
        type: 'match',
        change: string(this) !== string(result)
    };
    __DATA__.push(info);
    return result;
};
RegExp.prototype._exec = function(str) {
    var result = this.exec(str);
    var info = {
        string: string(str),
        result: result,
        re: string(this),
        type: 'exec',
        change: string(this) !== string(result)
    };
    __DATA__.push(info);
    return result;
};
function _Function() {
    var args = arguments;
    var body = args[args.length - 1];
    var result;
    if (args.length === 1) {
        result = new Function(body);
    }
    else if (args.length === 2) {
        result = new Function(args[0], body);
    }
    else if (args.length === 3) {
        result = new Function(args[0], args[1], body);
    }
    else {
        result = new Function(args[0], body);
    }
    var info = {
        args: args,
        body: body,
        result: result,
        type: 'Function'
    };
    __DATA__.push(info);
    return result;
}