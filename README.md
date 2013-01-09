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
Content-Type: application/javascript
Content-Length: 0
Expires: Thu, 01 Jan 1970 00:00:00 GMT
Cache-Control: no-cache, must-revalidate
Date: Wed, 09 Jan 2013 21:57:38 GMT
Connection: keep-alive
```

This request will not sleep, but will allow the response to be cached for 1 year (22917600000 millis).

```bash
> curl -si "http://localhost:11111/ttl-22917600000/foo.js"

HTTP/1.1 200 OK
Content-Type: application/javascript
Content-Length: 0
Expires: Wed, 02 Oct 2013 04:00:06 GMT
Cache-Control: max-age=22917600
Date: Wed, 09 Jan 2013 22:00:06 GMT
Connection: keep-alive
```

This request will sleep for 500 millis and will allow the response to be cached for one day (86400000 millis).

```bash
> curl -si "http://localhost:11111/latency-500/ttl-86400000/foo.js"

HTTP/1.1 200 OK
Content-Type: application/javascript
Content-Length: 0
Expires: Wed, 02 Oct 2013 04:00:06 GMT
Cache-Control: max-age=22917600
Date: Wed, 09 Jan 2013 22:00:06 GMT
Connection: keep-alive
```

Sssslow recognizes files of type `css`, `js`, and `json`. All other types will respond as `text/plain`. The `filename.ext` must come at the end of the script path.

