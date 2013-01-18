# Sssslow

[Cuzillion](http://stevesouders.com/cuzillion/) was either down or acting strangely, because it was timing out for 30s or more instead of using the params I was sending in. Sssslow here simulates what I was using Cuzillion for: referencing external scripts that wait N-seconds to load.

## Basic Usage

Start your server:

```bash
> node server.js 11111   # the port number to listen on
```

Now load a resource. This request will "sleep" for one second (1000 millis) and ask the user agent not to cache results.

```bash
> curl -si "http://localhost:11111/latency-1000/foo.js"

HTTP/1.1 200 OK
Date: Fri, 18 Jan 2013 20:33:56 GMT
Content-Type: application/javascript
Content-Length: 0
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Cache-Control: no-cache, must-revalidate
Vary: Accept-Encoding
```

This request will not sleep, but will allow the response to be cached for 1 year (22917600000 millis).

```bash
> curl -si "http://localhost:11111/ttl-22917600000/foo.js"

HTTP/1.1 200 OK
Date: Fri, 18 Jan 2013 20:33:33 GMT
Content-Type: application/javascript
Content-Length: 0
Expires: Sun, 19 Jan 2014 02:33:33 GMT
Cache-Control: max-age=31557600
Vary: Accept-Encoding
```

This request will sleep for 500 millis and will allow the response to be cached for one day (86400000 millis).

```bash
> curl -si "http://localhost:11111/latency-500/ttl-86400000/foo.js"

HTTP/1.1 200 OK
Date: Fri, 18 Jan 2013 20:32:40 GMT
Content-Type: application/javascript
Content-Length: 0
Expires: Sat, 19 Jan 2013 20:32:41 GMT
Cache-Control: max-age=86400
Vary: Accept-Encoding
```

Sssslow recognizes files of type `css`, `js`, and `json`. All other types will respond as `text/plain`. The `filename.ext` must come at the end of the script path.

