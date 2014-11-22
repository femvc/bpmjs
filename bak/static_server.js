'use strict';
var mime = {

    // File Ext 
    lookupExtension: function (ext) {
        return this.TYPES[ext.toLowerCase()] || 'text/plain';
    },

    // File Type
    TYPES: {
        ".3gp": "video/3gpp",
        ".a": "application/octet-stream",
        ".ai": "application/postscript",
        ".aif": "audio/x-aiff",
        ".aiff": "audio/x-aiff",
        ".asc": "application/pgp-signature",
        ".asf": "video/x-ms-asf",
        ".asm": "text/x-asm",
        ".asx": "video/x-ms-asf",
        ".atom": "application/atom+xml",
        ".au": "audio/basic",
        ".avi": "video/x-msvideo",
        ".bat": "application/x-msdownload",
        ".bin": "application/octet-stream",
        ".bmp": "image/bmp",
        ".bz2": "application/x-bzip2",
        ".c": "text/x-c",
        ".cab": "application/vnd.ms-cab-compressed",
        ".cc": "text/x-c",
        ".chm": "application/vnd.ms-htmlhelp",
        ".class": "application/octet-stream",
        ".com": "application/x-msdownload",
        ".conf": "text/plain",
        ".cpp": "text/x-c",
        ".crt": "application/x-x509-ca-cert",
        ".css": "text/css",
        ".csv": "text/csv",
        ".cxx": "text/x-c",
        ".deb": "application/x-debian-package",
        ".der": "application/x-x509-ca-cert",
        ".diff": "text/x-diff",
        ".djv": "image/vnd.djvu",
        ".djvu": "image/vnd.djvu",
        ".dll": "application/x-msdownload",
        ".dmg": "application/octet-stream",
        ".doc": "application/msword",
        ".dot": "application/msword",
        ".dtd": "application/xml-dtd",
        ".dvi": "application/x-dvi",
        ".ear": "application/java-archive",
        ".eml": "message/rfc822",
        ".eps": "application/postscript",
        ".exe": "application/x-msdownload",
        ".f": "text/x-fortran",
        ".f77": "text/x-fortran",
        ".f90": "text/x-fortran",
        ".flv": "video/x-flv",
        ".for": "text/x-fortran",
        ".gem": "application/octet-stream",
        ".gemspec": "text/x-script.ruby",
        ".gif": "image/gif",
        ".gz": "application/x-gzip",
        ".h": "text/x-c",
        ".hh": "text/x-c",
        ".htm": "text/html",
        ".html": "text/html",
        ".ico": "image/vnd.microsoft.icon",
        ".ics": "text/calendar",
        ".ifb": "text/calendar",
        ".iso": "application/octet-stream",
        ".jar": "application/java-archive",
        ".java": "text/x-java-source",
        ".jnlp": "application/x-java-jnlp-file",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".js": "application/javascript;charset=utf-8",
        ".json": "application/json",
        ".log": "text/plain;charset=utf-8",
        ".m3u": "audio/x-mpegurl",
        ".m4v": "video/mp4",
        ".man": "text/troff",
        ".mathml": "application/mathml+xml",
        ".mbox": "application/mbox",
        ".mdoc": "text/troff",
        ".me": "text/troff",
        ".mid": "audio/midi",
        ".midi": "audio/midi",
        ".mime": "message/rfc822",
        ".mml": "application/mathml+xml",
        ".mng": "video/x-mng",
        ".mov": "video/quicktime",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".mp4v": "video/mp4",
        ".mpeg": "video/mpeg",
        ".mpg": "video/mpeg",
        ".ms": "text/troff",
        ".msi": "application/x-msdownload",
        ".odp": "application/vnd.oasis.opendocument.presentation",
        ".ods": "application/vnd.oasis.opendocument.spreadsheet",
        ".odt": "application/vnd.oasis.opendocument.text",
        ".ogg": "application/ogg",
        ".p": "text/x-pascal",
        ".pas": "text/x-pascal",
        ".pbm": "image/x-portable-bitmap",
        ".pdf": "application/pdf",
        ".pem": "application/x-x509-ca-cert",
        ".pgm": "image/x-portable-graymap",
        ".pgp": "application/pgp-encrypted",
        ".pkg": "application/octet-stream",
        ".pl": "text/x-script.perl",
        ".plist": "text/xml",
        ".ipa": "application/octet-stream",
        ".pm": "text/x-script.perl-module",
        ".png": "image/png",
        ".pnm": "image/x-portable-anymap",
        ".ppm": "image/x-portable-pixmap",
        ".pps": "application/vnd.ms-powerpoint",
        ".ppt": "application/vnd.ms-powerpoint",
        ".ps": "application/postscript",
        ".psd": "image/vnd.adobe.photoshop",
        ".py": "text/x-script.python",
        ".qt": "video/quicktime",
        ".ra": "audio/x-pn-realaudio",
        ".rake": "text/x-script.ruby",
        ".ram": "audio/x-pn-realaudio",
        ".rar": "application/x-rar-compressed",
        ".rb": "text/x-script.ruby",
        ".rdf": "application/rdf+xml",
        ".roff": "text/troff",
        ".rpm": "application/x-redhat-package-manager",
        ".rss": "application/rss+xml",
        ".rtf": "application/rtf",
        ".ru": "text/x-script.ruby",
        ".s": "text/x-asm",
        ".sgm": "text/sgml",
        ".sgml": "text/sgml",
        ".sh": "application/x-sh",
        ".sig": "application/pgp-signature",
        ".snd": "audio/basic",
        ".so": "application/octet-stream",
        ".svg": "image/svg+xml",
        ".svgz": "image/svg+xml",
        ".swf": "application/x-shockwave-flash",
        ".t": "text/troff",
        ".tar": "application/x-tar",
        ".tbz": "application/x-bzip-compressed-tar",
        ".tcl": "application/x-tcl",
        ".tex": "application/x-tex",
        ".texi": "application/x-texinfo",
        ".texinfo": "application/x-texinfo",
        ".text": "text/plain",
        ".tif": "image/tiff",
        ".tiff": "image/tiff",
        ".torrent": "application/x-bittorrent",
        ".tr": "text/troff",
        ".txt": "text/plain",
        ".vcf": "text/x-vcard",
        ".vcs": "text/x-vcalendar",
        ".vrml": "model/vrml",
        ".war": "application/java-archive",
        ".wav": "audio/x-wav",
        ".wma": "audio/x-ms-wma",
        ".wmv": "video/x-ms-wmv",
        ".wmx": "video/x-ms-wmx",
        ".wrl": "model/vrml",
        ".wsdl": "application/wsdl+xml",
        ".xbm": "image/x-xbitmap",
        ".xhtml": "application/xhtml+xml",
        ".xls": "application/vnd.ms-excel",
        ".xml": "application/xml",
        ".xpm": "image/x-xpixmap",
        ".xsl": "application/xml",
        ".xslt": "application/xslt+xml",
        ".yaml": "text/yaml",
        ".yml": "text/yaml",
        ".zip": "application/zip"
    }
};

/***
 * @author flyingzl,femvc
 * @date 2013-08-27
 * A static file server base on Node.js
 */

var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    util = require('util');

//www root
var root = __dirname,
    //host="192.168.1.129", 
    host = "0.0.0.0",
    port = "8888";


if (!fs.existsSync(root)) {
    util.error(root + "folder not exist.");
    process.exit();
}

// List the file in folder
function listDirectory(parentDirectory, req, res) {
    fs.readdir(parentDirectory, function (error, files) {
        var body = formatBody(parentDirectory, files);
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8",
            "Content-Length": Buffer.byteLength(body, 'utf8'),
            "Server": "NodeJs(" + process.version + ")"
        });
        res.write(body, 'utf8');
        res.end();
    });

}

// Show file content
function showFile(filename, req, res) {
    fs.readFile(filename, 'binary', function (err, file) {
        var contentType = mime.lookupExtension(path.extname(filename));
        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": Buffer.byteLength(file, 'binary'),
            "Server": "NodeJs(" + process.version + ")"
        });
        res.write(file, "binary");
        res.end();
    })
}

// <ul><li></li><li></li></ul>
function formatBody(parent, files) {
    var res = [],
        length = files.length;
    res.push("<!doctype>");
    res.push("<html>");
    res.push("<head>");
    res.push("<meta http-equiv='Content-Type' content='text/html;charset=utf-8'></meta>")
    res.push("<title>Node.js File static server</title>");
    res.push("</head>");
    res.push("<body width='100%'>");
    res.push("<ul>")
    files.forEach(function (val, index) {
        var stat = fs.statSync(path.join(parent, val));
        if (stat.isDirectory(val)) {
            val = path.basename(val) + "/";
        }
        else {
            if (val == 'server.js') {
                return;
            }
            val = path.basename(val);
        }
        res.push("<li><a href='" + val + "'>" + val + "</a></li>");
    });
    res.push("</ul>");
    res.push("<div style='position:relative;width:98%;bottom:5px;height:25px;background:gray'>");
    res.push("<div style='margin:0 auto;height:100%;line-height:25px;text-align:center'>Powered By Node.js</div>");
    res.push("</div>")
    res.push("</body>");
    return res.join("");
}

// 404 error
function write404(req, res) {
    var body = "File not exist :-(";
    res.writeHead(404, {
        "Content-Type": "text/html;charset=utf-8",
        "Content-Length": Buffer.byteLength(body, 'utf8'),
        "Server": "NodeJs(" + process.version + ")"
    });
    res.write(body);
    res.end();
}

// Create server
http.createServer(function (req, res) {
    // Replace %20 to space, otherwise Node.js can not find the file
    var pathname = url.parse(req.url).pathname.replace(/%20/g, ' '),
        re = /(%[0-9A-Fa-f]{2}){3}/g;
    // to utf-8 code
    pathname = pathname.replace(re, function (word) {
        var buffer = new Buffer(3),
            array = word.split('%');
        array.splice(0, 1);
        array.forEach(function (val, index) {
            buffer[index] = parseInt('0x' + val, 16);
        });
        return buffer.toString('utf8');
    });
    if (pathname == '/') {
        listDirectory(root, req, res);
    }
    else {
        var filename = path.join(root, pathname);
        fs.exists(filename, function (exists) {
            if (!exists) {
                util.error('Can not find ' + filename);
                write404(req, res);
            }
            else {
                fs.stat(filename, function (err, stat) {
                    if (stat.isFile()) {
                        showFile(filename, req, res);
                    }
                    else if (stat.isDirectory()) {
                        listDirectory(filename, req, res);
                    }
                });
            }
        });
    }


}).listen(port, host);

util.debug("Start server @ http://" + host + ":" + port)