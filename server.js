var util = require('util'),
    http = require('http'),
    opts = process.argv.slice(2),
    port = parseInt(opts[0], 10) || 11111;

/*
 * [/latency-ms][/ttl-ms][/callback-name]/<whatever>.type
 *
 * Examples:
 * /latency-1000/ttl-0/myfile.js  # no caching
 * /latency-1000/myfile.js        # same as previous
 * /latency-500/ttl-3600000/style.css
 * /latency-500/callback-myFunc/foo.js # calls "myFunc()" in the output
 */

TypeMap = {
  "js":    "application/javascript",
  "json":  "application/json",
  "css":   "text/css",

  "gif":   "image/gif",
  "jpeg":  "image/jpeg",
  "jpg":   "image/jpeg",
  "png":   "image/png",

  "html":  "text/html",
  "plain": "text/plain"
};

function parseOpt(url, rex, defaultValue) {
  var matched = url.match(rex);
  return (matched && matched[1]) || defaultValue;
}

function parseRequestOptions(req) {
  var url = req.url;
  return {
    latency: parseInt(parseOpt(url, /latency-(\d+)/, 0), 10),
    ttl: parseInt(parseOpt(url, /ttl-(\d+)/, 0), 10),
    callback: parseOpt(url, /callback-([^\/]+)/),
    type: parseOpt(url, /.([^.]+)$/)
  };
}

function applyCacheTTL(ttl, header) {
  var expires = 0, cacheControl = "no-cache, must-revalidate";
  if (ttl > 0) {
    expires = +new Date + ttl;
    cacheControl = "max-age=" + (ttl/1000);
  }
  header["Expires"] = new Date(expires).toGMTString();
  header["Cache-Control"] = cacheControl;
  return header;
}

function makeBody(requestOpts) {
  return requestOpts.callback ? requestOpts.callback + "();" : "";
}

http.createServer().on('request', function (req, res) {
  util.log(req.url);
  var requestOpts = parseRequestOptions(req);
  setTimeout(function () {
    var body = makeBody(requestOpts),
        header = {
          "Content-Type": TypeMap[requestOpts.type] || TypeMap.plain,
          "Content-Length": body.length
        };

    res.writeHead(200, applyCacheTTL(requestOpts.ttl, header));
    res.end(body, "utf8");
  }, requestOpts.latency);
}).listen(port, function () {
  util.log("slow server started on 127.0.0.1:" + port);
});

process.on('uncaughtException', function (err) {
  util.log("UNCAUGHT ERROR:" + err);
});

