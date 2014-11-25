'use strict';

var fstream = require('fstream');
var fs = require('fs');
var path = require('path');

var formidable = require('formidable');
var http = require('http');

var bpm = {};
bpm.util = require('./bpm_util').util;

var merge = require('./merge');

var tar = require('tar');
var zlib = require('zlib');

var args = process.argv.splice(2);

var uglify = require('uglify-js');
var cleanCSS = new require('clean-css')({
    noAdvanced: true
});

var exec = require('child_process').exec;

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
                        var str = ext === 'css' ? cleanCSS.minify(data) : uglify.minify(data, {
                            fromString: true
                        }).code;
                        fs.writeFileSync(min, str, 'utf8');
                    }
                }
            }
        }
    });
}


http.createServer(function (req, res) {
    var url = String(req.url);
    console.log(url);
    var msg;

    req.query = req.query || {};
    var list = url.split('?');
    list.shift();
    list = list.join('&').replace(/\&+/g, '&').split('&');
    var str;
    for (var i = 0, len = list.length; i < len; i++) {
        str = list[i].split('=');
        if (str[0]) {
            req.query[str[0]] = str[1];
        }
    }
    res.setHeader('content-type', 'text/javascript;charset=utf8');

    req.query.file = ((String(req.url) + '??').split('??')[1] + '?').replace(/\s/g, '').split('?')[0];

    if ((url + '?').indexOf('/bpm_api/download?') === 0) {
        var mod_name = String(url.split('?mod_name=')[1]).toLowerCase();
        str = mod_name.split('@');
        var name = str[0];
        var version = str[1];

        var cb = function () {
            var mod_src = path.resolve(
                __dirname + '/tarball/' + String(mod_name).replace('.tar.gz', '') + '.tar.gz');

            fs.exists(mod_src, function (exists) {
                if (!exists) {
                    msg = mod_name + ' not exists.';
                    console.log(msg);
                    res.writeHead(404, {
                        'hui_mod': 'none'
                    });

                    return res.end(msg);
                }
                console.log(mod_name + ' exists.');
                fs.readFile(mod_src, 'binary', function (err, file) {
                    var contentType = 'application/x-gzip';
                    res.writeHead(200, {
                        'Content-Type': contentType,
                        'Content-Length': Buffer.byteLength(file, 'binary'),
                        'Content-disposition': 'attachment; filename=' + mod_name + '.tar.gz;',
                        'hui_mod': 'exists',
                        'Server': 'NodeJs(' + process.version + ')'
                    });
                    res.write(file, 'binary');
                    res.end();
                });
            });
        };

        if (!version) {
            version = '0.0.0.tar.gz';
            fs.readdir(path.resolve(__dirname + '/tarball'), function (error, files) {
                for (var i in files) {
                    str = files[i].split('@');
                    if (str[0] === name && bpm.util.versionCompare(str[1], version)) {
                        version = str[1];
                        mod_name = files[i];
                    }
                }

                cb();
            });
        }
        else {
            cb();
        }
    }
    else if ((url + '?').indexOf('/bpm_api/get_dep??') === 0) {
        merge.getDep(req.query.file, function (result) {
            var html = JSON.stringify(result);
            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.end(req.query.callback ? req.query.callback + '(' + html + ')' : html);

        });
    }
    else if ((url + '?').indexOf('/bpm_api/unpublish?') === 0) {
        var mod_name = String(url.split('?mod_name=')[1]).toLowerCase();
        var tarball_path = path.resolve(__dirname + '/tarball/' + mod_name + '.tar.gz');
        fs.exists(tarball_path, function (exists) {
            if (exists) {
                fs.appendFile(path.resolve(__dirname + '/packlist.txt'), '\r\n,"' + mod_name + '": false', function (err) {
                    if (err) throw err;
                    fs.rename(
                        tarball_path,
                        tarball_path.replace('.tar.gz', '_' + (new Date().getTime()) + '.tar.gz'),
                        function (err) {
                            if (err) throw err;
                            exec('cd ' + process.cwd(), function (err, out) {
                                exec('rm -rf ' + path.resolve(__dirname + '/hui_modules/' + mod_name), function (err, out) {
                                    var msg = 'unpublish ' + mod_name + ' success.';
                                    console.log(msg);
                                    res.writeHead(200, {
                                        'hui_mod': 'success'
                                    });
                                    res.end(msg);
                                });
                            });

                        });

                });
            }
            else {
                var msg = mod_name + ' not exist.';
                console.log(msg);
                res.writeHead(200, {
                    'hui_mod': mod_name + ' not exist.'
                });
                res.end(msg);
            }
        });
    }
    else if (url === '/bpm_api/publish') {
        var pkgjson;
        var jsonObj;
        var mod_name;

        var form = new formidable.IncomingForm();
        form.uploadDir = path.resolve(__dirname + '/dir');
        form.parse(req, function (err, fields, files) {
            try {
                pkgjson = JSON.parse(fields.package_json);
            }
            catch (e) {
                msg = 'package.json format illegal.';
                console.log(msg);
                res.end(msg);
                return;
            }

            fs.readFile(path.resolve(__dirname + '/packlist.txt'), function (err, data) {
                if (err) throw err;
                jsonObj = JSON.parse(data + '}');
                mod_name = bpm.util.encode(String(String(pkgjson.name).toLowerCase() + '@' + pkgjson.version).toLowerCase());

                if (jsonObj[mod_name]) {
                    msg = mod_name + ' already exists, \'unpublish ' + mod_name + '\' or change package.json.';
                    console.log(msg);
                    res.writeHead(502, {
                        'hui_mod': 'exists'
                    });
                    res.end(msg);
                }
                else {
                    res.writeHead(200, {
                        'hui_mod': 'success'
                    });
                    fs.appendFile(path.resolve(__dirname + '/packlist.txt'), '\r\n,"' + mod_name + '": ' + JSON.stringify(pkgjson), function (err) {
                        if (err) throw err;
                        msg = '';
                        console.log(msg);
                        res.write(msg);
                    });

                    if (files && files.tarball) {
                        console.log('================');
                        console.log(files.tarball.path);
                        fstream
                            .Reader({
                                'path': path.resolve(files.tarball.path)
                            })
                            .pipe(fstream.Writer({
                                'path': path.resolve(__dirname + '/tarball/' + mod_name + '.tar.gz')
                            }))
                            .on('close', function () {
                                // extract tarball
                                var filePath = path.resolve(files.tarball.path);
                                fstream.Reader(filePath)
                                    .on('error', function (err) {
                                        console.log(err);
                                    })
                                    .pipe(zlib.Gunzip())
                                    .pipe(tar.Extract({
                                        path: path.resolve(__dirname + '/hui_modules/' + mod_name),
                                        strip: 1
                                    }))
                                    .on('end', function () {
                                        console.log(mod_name + ' extract success.\n');
                                        // delete tmp file
                                        fs.unlink(filePath);

                                        var pwd = path.resolve(__dirname + '/hui_modules/' + mod_name);
                                        listDir(pwd);

                                        console.log('publish success.');
                                        res.end('publish success.');
                                    });

                            });
                    }
                    else {
                        res.end(' uploaded fail');
                    }
                }
            });


        });
        return;
    }
    // else if (url === '/bpm_api/post') {
    //     res.writeHead(200, {
    //         'content-type': 'text/html'
    //     });
    //     res.end(
    //         '<form action="/publish" enctype="multipart/form-data" ' +
    //         'method="post">' +
    //         '<input type="text" name="fname" value="sdsdasd"><br>' +
    //         '<input type="file" name="tarball" multiple="multiple"><br>' +
    //         '<input type="submit" value="Publish">' +
    //         '</form>'
    //     );

    // }
    else if ((url + '??').indexOf('/bpm_api/hui_modules??') === 0) {
        merge.getDep(req.query.file, function (result) {
            var i = req.query.file.split('@')[0];
            if (result[i]) {
                // req.url = '/bpm_api/js/??' + result[m].name + '@' + result[m].version + '/' + result[m].main;
                // merge.js(req, res);
                var toUrl = '//bpmjs.org/js/??' + result[i].name + '@' + result[i].version + '/' +
                    (req.query.debug ? result[i].main : result[i].main.substr(0, result[i].main.length - 2) + 'min.js');
                res.writeHead(301, {
                    'Location': toUrl
                });
                res.end();
            }
            else {
                res.end('//Not exist.');
            }
        });
    }
    // else if ((url + '??').indexOf('/bpm_api/js/??') === 0) {
    //     merge.js(req, res);
    // }
    else if ((url + '??').indexOf('/bpm_api/combo??') === 0) {
        merge.getDep(req.query.file, function (result) {
            var str = [],
                m;
            for (var i in result) {
                if (result[i]) {
                    m = result[i].name + '@' + result[i].version + '/' + (req.query.debug ?
                        result[i].main :
                        result[i].main.substr(0, result[i].main.length - 2) + 'min.js');
                    if (String(result[i].name).split('@')[0] !== 'hui') {
                        str.push(m);
                    }
                    else {
                        str.unshift(m);
                    }
                }
            }
            // req.url = '/bpm_api/combo??' + str.join(',') + '?' + url.split('?').pop();
            // console.log(req.url);
            // merge.js(req, res);
            var toUrl = '//bpmjs.org/js/??' + str.join(',') + '?' + url.split('?').pop();
            res.writeHead(301, {
                'Location': toUrl
            });
            res.end();
        });
    }
    // else if ((url + '??').indexOf('/bpm_api/css??') === 0) {
    //     merge.css(req, res);
    // }
    //  if (url === '/bpm_api/package')
    else {
        fs.readFile(path.resolve(__dirname + '/packlist.txt'), function (err, data) {
            if (err) throw err;
            var jsonObj = JSON.parse(data + '}');

            var html = ['<h1>Package list</h1><ul>'];
            var tpl = '<li><b>#{0}:</b> YES</li>';
            for (var i in jsonObj) {
                if (i && jsonObj[i]) {
                    html.push(bpm.util.format(tpl, i));
                }
            }

            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.end(html.join('\n'));

        });
    }

}).listen(8100);

console.log('Server is listen at http://localhost:8100');