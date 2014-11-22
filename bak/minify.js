'use strict';
/*
 * GET home page.
 */
var fs = require('fs'),
    path = require('path'),
    uglify = require('uglify-js'),
    cleanCSS = new require('clean-css')({
        noAdvanced: true
    });

var args = process.argv.splice(2);
//压缩js
// var minify = function (code) {
//     return uglify.minify(code, {
//         fromString: true
//     });
// };
//压缩css
var minicss = function (source) {
    return cleanCSS.minify(source);
    // return cleanCSS.process(code);
};

function listDir(loc) {
    fs.readdir(loc, function (error, files) {
        for (var i in files) {
            var val = path.join(loc, files[i]);
            var stat = fs.statSync(val);
            if (stat.isDirectory(val)) {
                if (files[i] !== 'hui_modules') {
                    listDir(val);
                }
            }
            else {
                var list = val.split('.');
                var ext = list.pop();
                if (ext === 'js' || ext === 'css') {
                    var min = list.join('.') + '.min.' + ext;
                    if ((!fs.existsSync(min) || args[0] === '-f') && list[list.length - 1] !== 'min') {
                        var data = fs.readFileSync(val, 'utf8');
                        var str = ext === 'css' ? minicss(data) : uglify.minify(data, {
                            fromString: true
                        }).code;
                        fs.writeFileSync(min, str, 'utf8');
                    }
                }
            }
        }
    });
}

var mod_name = 'hui_panel';
listDir(path.resolve(process.cwd() + '/hui_modules/' + mod_name));


// uglify.minify(code, {fromString: true}).code
// console.log(uglify.minify('   var         a = 123, b        = 456;', {
//     fromString: true
// }).code);