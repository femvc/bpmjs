'use strict';
var fs = require('fs');
var formData = require('form-data');

var form = new formData();

form.append('upload', fs.createReadStream(__dirname + '/dir/1.txt'));

form.submit({
    host: 'localhost',
    port: '8200',
    path: '/upload'
}, function (err, res) {
    console.log(res.statusCode);
    if (err) {
        return console.error('upload failed:', err);
    }
    // res – response object (http.IncomingMessage)  //
    res.resume(); // for node-0.10.x
});