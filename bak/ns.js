'use strict';

var exec = require('child_process').exec;
var child = exec('bpm install hui_button', function (err, stdout, stderr) {
    if (err) throw err;
    else console.log(stdout);
});