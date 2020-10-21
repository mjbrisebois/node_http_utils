[![](https://img.shields.io/npm/v/@whi/http/latest?style=flat-square)](http://npmjs.com/package/@whi/http)

# HTTP Utilities
This module is intended to extend the built-in HTTP server and provide a user friendly HTTP client
wrapper around `node-fetch`.

[![](https://img.shields.io/github/issues-raw/mjbrisebois/node_http_utils?style=flat-square)](https://github.com/mjbrisebois/node_http_utils/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/node_http_utils?style=flat-square)](https://github.com/mjbrisebois/node_http_utils/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/node_http_utils?style=flat-square)](https://github.com/mjbrisebois/node_http_utils/pulls)

## Server
Create a server that defaults to static assets but can be configured to return dynamic responses.

```javascript
const http = require('@whi/http');

const http_server = new http.server();
const settings = { version: "1.0.0" };

http_server.serve_local_assets( "./public/", function ( req_path ) {
    if ( req_path === "/settings" ) {
        this.contentType("application/json");
        return JSON.stringify( settings );
    }
});

http_server.listen( 8080 );
```

## Client
HTTP client using `node-fetch`.

```javascript
const http = require('@whi/http');

const api = http.client.create(`http://localhost:8080`);
const resp = await api.get("/settings");

resp.version === "1.0.0";
```
