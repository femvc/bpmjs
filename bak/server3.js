'use strict';

var fstream = require('fstream');
var fs = require('fs');
var path = require('path');




var formidable = require('formidable'),
    http = require('http');
http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') { // parse a file upload     
        var form = new formidable.IncomingForm();
        form.uploadDir = 'dir';
        form.parse(req, function (err, fields, files) {
            if (files && files.upload) {
                fstream.Reader({
                    'path': path.resolve(files.upload.path)
                })
                    .pipe(fstream.Writer({
                        'path': path.resolve(files.upload.name)
                    }))
                    .on('close', function () {
                        // delete tmp file
                        fs.unlink(path.resolve(files.upload.path));
                        res.end(' uploaded');
                    });
            }
            else {
                res.end(' uploaded none');
            }
        });
        return;
    } // show a file upload form   
    else {
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.end(
            ['<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="utf-8" />',
            '<title>简单的html5 File测试 for pic2base64</title>',
            '<style>',
            '</style>',
            '<script>',
            'window.onload = function(){',
            '    var input = document.getElementById("demo_input");',
            '    var result= document.getElementById("result");',
            '    var img_area = document.getElementById("img_area");',
            '    if ( typeof(FileReader) === "undefined" ){',
            '        result.innerHTML = "抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！";',
            '        input.setAttribute( "disabled","disabled" );',
            '    } ',
            '    else {',
            '        input.addEventListener( "change", readFile, false );',
            '    }',
            '};',
            'function readFile(){',
            '    var file = this.files[0];',
            '    var reader = new FileReader();',
            '    reader.readAsDataURL(file);',
            '    reader.onload = function(e){',
            '        document.getElementById("img2").src = reader.result;',
            '    }',
            '}',
            '</script>',
            '</head>',
            '<body>',
            '<input type="file" value="sdgsdg" id="demo_input" />',
            '<textarea id="result"></textarea>',
            '<button onclick="alert(document.getElementById(\'img2\').src)">',
            'ss</button><img id="img2" />',
            '</body>',
            '</html>'].join('\n')
        );
    }
}).listen(8300);

console.log('Server is listen at http://localhost:8200');