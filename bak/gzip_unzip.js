'use strict';
var fstream = require('fstream'),
    tar = require('tar'),
    zlib = require('zlib');

var inFileName = 'compressed_folder' + Math.random() + '.tar.gz';
// var inFileName = 'compressed_folder.tar.gz';

fstream.Reader({
    'path': 'dir',
    'type': 'Directory'
})
    .pipe(tar.Pack())
    .pipe(zlib.Gzip())
    .pipe(fstream.Writer({
        'path': inFileName
    }))
    .on('close', function () {
        console.log(inFileName + ' gzip done');

        fstream.Reader(inFileName)
            .pipe(zlib.Gunzip())
            .pipe(tar.Extract({
                path: 'extract' + inFileName
            }))
            .on('end', function () {
                console.log(inFileName + ' gunzip done\n');
            });
    });