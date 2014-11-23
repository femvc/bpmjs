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
            if (files && files.upload && 'png,txt'.indexOf(files.upload.name.split('.').pop()) > -1) {
                fstream.Reader({
                    'path': path.resolve(files.upload.path)
                })
                    .pipe(fstream.Writer({
                        'path': path.resolve(files.upload.name)
                    }))
                    .on('close', function () {
                        // delete tmp file
                        fs.unlink(path.resolve(files.upload.path));
                        console.log(files.upload.name + ' uploaded.');
                        res.end(files.upload.name + ' uploaded.');
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
            '<button style="position:absolute;left:50px;top:150px;" onclick="window.location.reload()">aaaa</button><form action="/upload" enctype="multipart/form-data" ' +
            'method="post">' +
            '<input type="file" name="upload" multiple="multiple"><br>' +
            '<input type="submit" value="Upload">' +
            '</form>'
        );
    }
}).listen(80);

console.log('Server is listen at http://localhost:80');