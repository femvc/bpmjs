var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    util = require('util');


fs.readdir(__dirname, function (error, files) {
    console.log(files);
});