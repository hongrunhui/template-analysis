export default function() {
    window.__DATA__  = [];
    var __METHODS__ = {
        replace: String.prototype.replace,
        join: Array.prototype.join,
        split: String.prototype.split,
        match: String.prototype.match,
        exec: RegExp.prototype.exec,
        Function: Function
    }
    String.prototype.replace = function(re, cb) {
        var start = new Date().getTime();
        var result = __METHODS__.replace.call(this, re, cb);
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
    // Array.prototype.join = function(str) {
    //     var result = __METHODS__.join.call(this, str);
    //     var info = {
    //         string: this,
    //         result: result,
    //         re: str,
    //         type: 'join',
    //         change: this.toString() !== result.toString()
    //     };
    //     __DATA__.push(info);
    //     return result;
    // };
    // String.prototype.split = function(re) {
    //     this.result = this.result || __METHODS__.split.call(this, re);
    //     var info = {
    //         string: this.toString(),
    //         result: this.result,
    //         re: re,
    //         type: 'split',
    //         change: this.toString() !== this.result.toString()
    //     };
    //     __DATA__.push(info);
    //     return this.result;
    // };
    // function string(obj){
    //     if (obj && obj.toString) {
    //         return obj.toString();
    //     }
    //     else {
    //         return obj;
    //     }
    // }
    // String.prototype.match = function(re) {
    //     this.result = this.result || __METHODS__.match.call(this, re);
    //     var info = {
    //         string: string(this),
    //         result: this.result,
    //         re: re,
    //         type: 'match',
    //         change: string(this) !== string(this.result)
    //     };
    //     __DATA__.push(info);
    //     return this.result;
    // };
    // RegExp.prototype.exec = function(str) {
    //     this.result = this.result || __METHODS__.exec.call(this, str);
    //     var info = {
    //         string: string(str),
    //         result: this.result,
    //         re: string(this),
    //         type: 'exec',
    //         change: string(this) !== string(this.result)
    //     };
    //     __DATA__.push(info);
    //     return this.result;
    // };
    window.Function =  function() {
        var args = arguments;
        var body = args[args.length - 1];
        this.result = this.result || __METHODS__.Function.apply(null, arguments);
        var info = {
            args: args,
            body: body,
            result: this.result,
            type: 'Function'
        };
        __DATA__.push(info);
        return this.result;
    }
};
