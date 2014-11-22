'use strict';

// Dependencies
var fs = require('fs');
var http = require('http');
var path = require('path');

// App variables
var file_url = 'http://127.0.0.1:8200/3.txt';
// Function to download file using HTTP.get
var download_file_httpget = function (file_url) {
    var options = {
        host: '127.0.0.1',
        port: 8200,
        'path': '/download'
    };

    var file_name = '3.txt';
    var file = fs.createWriteStream(path.resolve(__dirname + '/' + file_name));

    http.get(options, function (res) {
        res.on('data', function (data) {
            file.write(data);
        }).on('end', function () {
            file.end();
            console.log(file_name + ' downloaded ');
        });
    });
};

download_file_httpget(file_url);