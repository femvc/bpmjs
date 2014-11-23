'use strict';
/*
 * GET home page.
 */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    iconv = require('iconv-lite'),
    UglifyJS = require('uglify-js'),
    cleanCSS = new require('clean-css')({
        noAdvanced: true
    }),
    BufferHelper = require('bufferhelper');

var bpm = {};
bpm.util = require('./bpm_util').util;

//压缩js
var minify = function (code) {
    return UglifyJS.minify(code, {
        fromString: true
    });
};
//压缩css
var minicss = function (source) {
    return cleanCSS.minify(source);
    // return cleanCSS.process(code);
};

//按照url获取文件内容
var getFile = function (url, callback) {
    var resultdata = '';
    // url = url.replace(/\.\.\//g, '').replace(/\.\//g, '').split('|');
    url = url.split('|');
    if (url[0].indexOf('http') === 0) {
        http.get(url[0], function (p_res) {
            var bfHelper = new BufferHelper();
            if (p_res.statusCode != 404) {
                p_res.on('data', function (chunk) {
                    bfHelper.concat(chunk);
                });
                p_res.on('end', function () {
                    resultdata = bfHelper.toBuffer();
                    resultdata = iconv.decode(resultdata, (url[1] || 'UTF8').toUpperCase());
                    resultdata = iconv.encode(resultdata, 'UTF8');
                    callback('/*path --' + url[0] + '*/\r\n' + resultdata, true);
                });
            }
            else {
                callback('/*Read Error --' + url[0] + '*/\r\n', false);
            }
        });
    }
    else {
        var m1 = url[0];
        console.log(m1);
        var parent = path.resolve(__dirname + '/hui_modules/');
        var root = path.resolve(new Array(parent.replace(/\\+/g, '/').split('/').length + 5).join('../'));
        var pwd = path.resolve(new Array(parent.replace(/\\+/g, '/').split('/').length + 5).join('../') + m1);
        var str = path.resolve(__dirname + '/hui_modules/' + pwd.replace(root, ''));
        console.log(str);
        resultdata = fs.readFile(str, function (err, data) {
            console.log(err);
            if (!err) {
                resultdata = iconv.encode(data, 'UTF8');
                callback('/*path --' + url[0] + '*/\r\n' + resultdata, true);
            }
            else {
                callback('/*Read Error -- ' + url[0] + ' => .' + str.replace(parent, '') + '*/\r\n', false);
            }
        });

    }
};
//合并文件
var mergeFile = function (query, type, callback) {
    var fsArray = query.file.split(',');
    var files = [],
        num;
    var cb = function (text) {
        num--;
        files = files.concat([text]);
        if (num < 1) {
            callback(String(query.debug) !== 'undefined' ? files.join('') :
                (type == 'js' ? minify(files.join('')).code :
                    minicss(files.join(''))));
        }
    };

    var exist = false;
    var fileMap = {};
    var fileList = [];

    for (var i = 0, len = fsArray.length; i < len; i++) {
        exist = exist || fsArray[i] === 'hui@0.0.1/hui.js';
        if (fsArray[i] !== 'hui@0.0.1/hui.js' && !fileMap[fsArray[i]]) {
            fileMap[fsArray[i]] = true;
            fileList.push(fsArray[i]);
        }
    }
    if (exist) {
        fileMap['hui@0.0.1/hui.js'] = true;
        fileList.unshift('hui@0.0.1/hui.js');
    }
    num = fileList.length;
    if (fileList.length) {
        getFile(fileList.shift(), function (text) {
            cb(text);
            for (var i = 0, len = fileList.length; i < len; i++) {
                if (query.host && fileList[i].indexOf('http') !== 0) {
                    fileList[i] = query.host + fileList[i];
                }
                getFile(fileList[i], cb);
            }
        });
    }
    else {
        cb('');
    }


};
//输出内容
var writeContent = function (req, res, type) {
    // url -> widget2@0.0.1/widget2.js
    // req.query.file -> widget2@0.0.1
    var url = (String(req.url) + '??').split('??')[1];
    var args = (url + '?').replace(/\s/g, '').split('?');
    req.query.file = args[0] || 'hui@0.0.1/hui.js';
    req.query.host = req.host;

    // res.setHeader('Content-Type', 'text/' + (type == 'js' ? 'plain' : 'css'));
    mergeFile(req.query, type, function (code) {
        res.end(code);
    });

};

exports.index = function (req, res) {
    res.end('Js minify And Css minify');
};

exports.js = function (req, res) {
    writeContent(req, res, 'js');
};

exports.css = function (req, res) {
    writeContent(req, res, 'css');
};


function getDep(str, cb) {
    fs.readFile(path.resolve(__dirname + '/packlist.txt'), function (err, data) {
        if (err) throw err;
        var jsonObj = JSON.parse(data + '}');

        //todo
        var list = [];
        str = str || '';
        // {"hui": "*", "hui_control": "*"}
        if (str && str.indexOf('{') === 0) {
            var mod_dep = JSON.parse(String(decodeURIComponent(str)).toLowerCase());
            for (var i in mod_dep) {
                list.push(i + '@' + mod_dep[i]);
            }
        }
        else {
            list = str.split(',');
        }

        var lastVersion = {};
        for (var i in jsonObj) {
            var d = jsonObj[i];
            var m = lastVersion[d.name];
            if (!m || bpm.util.versionCompare(d.version, m.version)) {
                lastVersion[d.name] = d;
            }
        }

        var all_dep = {};
        var result = [];

        while (list.length) {
            var mod = list.pop();
            var result = [];
            var name = mod.split('@')[0];
            var version = (mod + '@*').split('@')[1];
            var m = version === '' || version === '*' ? lastVersion[name] : jsonObj[mod];

            all_dep[name] = m;

            if (m && m.dependencies) {
                for (var i in m.dependencies) {
                    if (!all_dep[i]) {
                        result.push(i + '@' + m.dependencies[i]);
                    }
                }
            }

            list = list.concat(result);
        }
        if (cb) {
            cb(all_dep);
        }
        else return all_dep;
    });
}

exports.getDep = getDep;

//http://localhost:3000/js?file=http://x.libdd.com/farm1/a05baa/fde6509f/jquery.mousewheel-3.0.6.pack.js,http://x.libdd.com/farm1/08871e/95134743/jquery.fancybox-buttons.js
//http://localhost:3000/css?file=http://s.libdd.com/css/base/dd.$7205.css,http://s.libdd.com/css/app/tagpro.$7164.css