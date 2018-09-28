// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function () {
	"use strict";

	var doT = {
		name: "doT",
		version: "1.1.1",
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	"it",
			strip:		true,
			append:		true,
			selfcontained: false,
			doNotSkipEncoded: false
		},
		template: undefined, //fn, compile template
		compile:  undefined, //fn, for express
		log: true
	}, _globals;

	doT.encodeHTMLSource = function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString()._replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	};

	_globals = (function(){ return this || (0,eval)("this"); }());

	/* istanbul ignore else */
	if (typeof module !== "undefined" && module.exports) {
		module.exports = doT;
	} else if (typeof define === "function" && define.amd) {
		define(function(){return doT;});
	} else {
		_globals.doT = doT;
	}

	var startend = {
		append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
		split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === "string") ? block : block.toString())
		._replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf("def.") === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ":") {
					if (c.defineParams) value._replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new _Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return "";
		})
		._replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code._replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param)._replace(/'|\\/g, "_");
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text._replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new _Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code._replace(/\\('|\\)/g, "$1")._replace(/[\r\t\n]/g, " ");
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str._replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
					._replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
			._replace(/'|\\/g, "\\$&")
			._replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			._replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			})
			._replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			._replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			._replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			._replace(/\n/g, "\\n")._replace(/\t/g, '\\t')._replace(/\r/g, "\\r")
			._replace(/(\s|;|\}|^|\{)out\+='';/g, '$1')._replace(/\+''/g, "");
			//._replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode) {
			if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
			str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
				+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
				+ str;
		}
		try {
			return new _Function(c.varname, str);
		} catch (e) {
			/* istanbul ignore else */
			if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());
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