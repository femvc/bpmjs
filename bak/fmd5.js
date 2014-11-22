'use strict';

var fs = require('fs');
var crypto = require('crypto');

fs.readFile('./packlist.txt', function (err, data) {
    if (err) throw err;

    var md5 = crypto.createHash('md5');
    console.log(md5.update('foo'));
    console.log(md5.digest('hex'));
});