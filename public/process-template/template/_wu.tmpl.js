/*!
 * @preserve https://github.com/wusfen/wu.tmpl.js
 */


/**
 * namespace
 */
var wu = wu || {};

(function(window) {
    /**
     * render function cache
     * {
     *     'tpl stirng':{
     *         vars: 'var v1 = _data_["v1"] ...',
     *         code: 'var _html_ = "" ... return _html_',
     *         render: function(){...}
     *     }
     * }
     */
    var cache = {};

    /**
     * render function body
     *
     * @example
     * `{{if name}}
     *     <span>{{ name }}</span>
     * {{/if}}`
     *
     * =>
     *
     * `
     * var _html_ = ""
     * if(name){
     * _html_ += "<span>"
     * _html_ += name
     * _html_ += "</span>"
     * }
     * return _html_
     * `
     *
     * @param {String} tpl - tpl string
     * @return {String}
     */
    function tplToCode(tpl) {
        var eachI = 0; // each 嵌套 for 下标须不同

        var code = tpl
            // 转义 <>
            ._replace(/&lt;/g, '<')._replace(/&gt;/g, '>')
            // html
            ._replace(/(^|%>|}})([\s\S]*?)({{|<%|$)/g, function($, $1, $2, $3) {
                // html => js string 转义 ' \ \n
                return $1 + '\n_html_+= "' + $2._replace(/\\/g, '\\\\')._replace(/"/g, '\\"')._replace(/\r?\n/g, '\\n') + '"\n' + $3
            })
            // <%= %>
            ._replace(/(<%=)([\s\S]*?)(%>)/g, '_html_+= ($2)\n') // <%= %>  [\s\S]允许换行
            // <% %>
            ._replace(/(<%)(?!=)([\s\S]*?)(%>)/g, '\n\t$2\n') // <% js code %>  (?!=)不要匹配到<%= %>
            // each
            ._replace(/{{each\s+((?:\S|\[.*?\]|\{.*?\})*)\s*(\S*)?\s*(\S*)?}}/g, function($, $1, $2, $3) {
                var $ii = '_ii_' + (eachI++);
                var each = 'for(var $ii=0; $ii<$1.length; $ii++){';
                each += $2 ? '\nvar $2 = $1[$ii];' : '\nvar $item = $1[$ii];';
                each += $3 ? '\nvar $3 = $ii;' : '';
                return each._replace(/\$1/g, $1)._replace(/\$2/g, $2)._replace(/\$3/g, $3)._replace(/\$ii/g, $ii)
            })
            ._replace(/{{\/each}}/g, '}')
            // if
            ._replace(/{{if\s+(.*?)}}/g, 'if($1){')
            ._replace(/{{else ?if (.*?)}}/g, '}else if($1){')
            ._replace(/{{else}}/g, '}else{')
            ._replace(/{{\/if}}/g, '}')
            // 表达式
            ._replace(/{{=?([\s\S]*?)}}/g, '_html_+=$1')
            // data-src
            ._replace(/ data-src=/g, ' src=')

        code = 'var _html_="";' + code + 'return _html_';
        return code;
    }


    /**
     * @example
     *
     * {a:1, b:2}
     *
     * =>
     *
     * `
     * var a = _data_['a']
     * var b = _data_['b']
     * `
     *
     * @param  {Object} data
     * @return {String}
     */
    function dataToVars(data) {
        var varArr = Object.keys(data || {}).sort();
        var vars = ''; // 把传来的data转成内部变量，不用with，提高性能
        while (varArr.length) {
            var v = varArr.shift();
            vars += 'var ' + v + '= _data_["' + v + '"]\n';
        }
        return vars;
    }


    /**
     * get tpl render function
     *
     * @param  {String} tpl - template string
     * @param  {Object} data - template arguments
     * @return {Function}      render function
     */
    function getRender(tpl, data) {
        cache[tpl] = cache[tpl] || {};
        var vars = dataToVars(data);

        if (cache[tpl].vars == vars) {
            return cache[tpl].render
        }

        var code = cache[tpl].code || tplToCode(tpl);
        var render = Function('_data_', vars + code);

        cache[tpl].vars = vars;
        cache[tpl].code = code;
        cache[tpl].render = render;

        return render;
    }



    /**
     * tmpl
     *
     * @param  {String} tpl - template string
     * @param  {Object} data - template arguments
     * @return {String|Function} -      data? 'render result' : renderFunction
     *                   renderFunction(data);
     */
    function tmpl(tpl, data) {
        var render = getRender(tpl, data);
        return arguments.length > 1 ? render(data) : function(data) {
            var render = getRender(tpl, data);
            return render(data);
        };
    };

    /**
     * api
     */
    wu.tmpl = tmpl;
    // require.js || sea.js
    if (typeof define == 'function') {
        define(function(require, exports, module){
            return module.exports = tmpl
        });
    }
    // node.js
    if (typeof module != 'undefined') {
        module.exports = tmpl;
    }


    /**
     * for browser auto render
     */
    if (!window.document) {
        return
    }

    /**
     * simple dom ready
     *
     * @param  {Function} fn - dom ready callback
     */
    function ready(fn) {

        window.addEventListener && addEventListener('DOMContentLoaded', function() {
            fn();
            fn.called = true;
        });

        var onloadOld = onload;
        onload = function() {
            !fn.called && fn();
            onloadOld && onloadOld();
        }
    }

    /**
     * get elements by attr name
     *
     * @param  {String} attrName - attr name
     * @return {Array}
     */
    function getElementsByAttrName(attrName) {
        if (document.querySelectorAll) {
            return document.querySelectorAll('[' + attrName + ']');
        } else {
            var els = document.getElementsByTagName('*');
            var result = [];
            for (var i = 0; i < els.length; i++) {
                if (els[i].getAttribute(attrName)) {
                    result.push(els[i]);
                }
            }
            return result;
        }
    }

    // hide wu-tmpl
    // [wu-tmpl]{visibility: hidden;}
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.innerHTML = '[wu-tmpl]{display:none}';
    head.appendChild(style);

    // wu-tmple elements
    var tmplElements = [];

    /**
     * auto render wu-tmpl on dom ready
     */
    ready(function() {

        tmplElements = getElementsByAttrName('wu-tmpl');
        for (var i = 0; i < tmplElements.length; i++) {
            + function() {
                var el = tmplElements[i];
                var optionsStr = el.getAttribute('wu-tmpl');
                var options;
                try {
                    options = optionsStr ? eval('(' + optionsStr + ')') : {};
                } catch (e) {
                    window.console && console.error(e.stack);
                    options = {};
                }
                el.tpl = el.innerHTML; // 保存模板
                el.innerHTML = '';

                el.name = options.name;
                el.data = options.data;
                el.render = function(data) {
                    this.innerHTML = wu.tmpl(this.tpl, data || this.data);
                    if (data) {
                        this.data = data;
                    }
                };

                if (options.render) {
                    el.render();
                }
            }();
        }

        setTimeout(function() {
            style.parentNode.removeChild(style);
        }, 41);
    });

    /**
     * rerender api
     *
     * @example
     * ```html
     * <script>
     * var data = {
     *     list: [
     *         '...'
     *     ]
     * }
     * </script>
     *
     * <ul id="list" wu-tmpl="{name:'list', data:data, render:true}">
     * {{each list item i}}
     *     <li>
     *         {{i+1}}: {{item.name}}
     *     </li>
     * {{/each}}
     * </ul>
     * ```
     *
     * 再渲染
     * ```javascript
     * wu.tmpl.render('list')
     *
     * // or
     * wu.tmpl.render(data)
     *
     * // or
     * var listEl = documents.getElementById('list')
     * wu.tmpl.render(listEl)
     * ```
     *
     * @param  {Undefined|String|Object|Element} name - Undefined:更新所有模板；String:模板名；Object:模板的参数对象；Element:模板元素
     * @param  {Undefined|Object} data - 模板的参数
     */
    wu.tmpl.render = function(name, data) {
        for (var i = 0; i < tmplElements.length; i++) {
            var el = tmplElements[i];
            console.log(el)
            if (!name || el.name == name || el.data == name || el == name) {
                el.render(data);
            }
        }
    };

    // export
    if (typeof module != 'undefined') {
        module.exports = tmpl
    }

})(window);
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