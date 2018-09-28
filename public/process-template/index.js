// 替换源代码中的原生函数，现在用不到了，因为重写了原生的
const fs = require('fs');
const path = require('path');
const dirName = 'template-engine';
const baseDir = path.resolve('./', dirName);
const outDir = path.resolve('./', 'template');
function exits(p, type) {
    fs.stat(p, (err, dir) => {
        if (err) {
            if (type === 'dir') {
                fs.mkdirSync(p);
            }
            else {
                fs.writeFileSync(p, '');
            }
        }
    });
}
exits(outDir, 'dir');
const tplDir = fs.readdirSync(baseDir);
const _replace = fs.readFileSync(path.resolve('./', '_replace.js'), 'utf-8');
tplDir.forEach(item => {
    console.log(item);
    parse(item);
});

function parse(fileName) {
    let file = path.resolve(baseDir, fileName);
    const content = fs.readFileSync(file, 'utf-8');
    let varName = 'HELLO';
    let index = 0;
    let res = content
    .replace(/replace\(/g, '_replace(')
    .replace(/([\)|\s])\.split\(/g, '$1\._split(')
    .replace(/\.join\(/g, '\._join(')
    .replace(/\.match\(/g, '\._match(')
    .replace(/\.exec\(/g, '\._exec(')
    .replace(/new Function\(/g, 'new _Function(');
    fs.writeFileSync(path.resolve(outDir, '_' + fileName), res);
    fs.appendFileSync(path.resolve(outDir, '_' + fileName), _replace);
}