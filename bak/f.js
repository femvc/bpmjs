'use strict';

var fs = require('fs');

var bpm = {};
bpm.util = require('./bpm_util').util;


var mod_name = 'Button';
var version = '0.0.2';

fs.readFile('./packlist.txt', function (err, data) {
    if (err) throw err;
    var jsonObj = JSON.parse(data + '}');
    console.log(jsonObj);

    if (jsonObj[bpm.util.encode(String(mod_name).toLowerCase() + '@' + version)]) {
        console.log(mod_name + '@' + version + ' already exists, \'unpublish ' + mod_name + '@' + version + '\' or change package.json.');
    }
    else {
        fs.appendFile('./packlist.txt', '\n,"' + bpm.util.encode(String(mod_name).toLowerCase() + '@' + version) + '": "yes"', function (err) {
            if (err) throw err;
            console.log('The \'data to append\' was appended to file!');
        });
    }
});