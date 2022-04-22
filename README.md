```
> ./server.js &
> ./client.js
--- accessing HTTP URL via HTTP agent
2022-04-22T15:06:33.980Z proxy DEBUG HTTP proxy { url: 'http://example.net/' }
200 OK {
  age: '481261',
  'cache-control': 'max-age=604800',
  'content-type': 'text/html; charset=UTF-8',
  date: 'Fri, 22 Apr 2022 15:06:34 GMT',
  etag: '"3147526947+ident"',
  expires: 'Fri, 29 Apr 2022 15:06:34 GMT',
  'last-modified': 'Thu, 17 Oct 2019 07:18:26 GMT',
  server: 'ECS (bsa/EB17)',
  vary: 'Accept-Encoding',
  'x-cache': 'HIT',
  'content-length': '1256',
  connection: 'close'
}

--- accessing HTTP URL via HTTPS agent
2022-04-22T15:06:34.207Z proxy DEBUG HTTP proxy { url: 'http://example.net/' }
200 OK {
  age: '468250',
  'cache-control': 'max-age=604800',
  'content-type': 'text/html; charset=UTF-8',
  date: 'Fri, 22 Apr 2022 15:06:34 GMT',
  etag: '"3147526947+ident"',
  expires: 'Fri, 29 Apr 2022 15:06:34 GMT',
  'last-modified': 'Thu, 17 Oct 2019 07:18:26 GMT',
  server: 'ECS (bsa/EB20)',
  vary: 'Accept-Encoding',
  'x-cache': 'HIT',
  'content-length': '1256',
  connection: 'close'
}

--- accessing HTTPS URL via HTTP agent
2022-04-22T15:06:34.370Z proxy DEBUG CONNECT proxy { url: 'example.net:443' }
200 OK {
  age: '58215',
  'cache-control': 'max-age=604800',
  'content-type': 'text/html; charset=UTF-8',
  date: 'Fri, 22 Apr 2022 15:06:34 GMT',
  etag: '"3147526947+gzip+ident"',
  expires: 'Fri, 29 Apr 2022 15:06:34 GMT',
  'last-modified': 'Thu, 17 Oct 2019 07:18:26 GMT',
  server: 'ECS (bsa/EB15)',
  vary: 'Accept-Encoding',
  'x-cache': 'HIT',
  'content-length': '1256',
  connection: 'close'
}

--- accessing HTTPS URL via HTTPS agent
2022-04-22T15:06:34.701Z proxy DEBUG CONNECT proxy { url: 'example.net:443' }
200 OK {
  'accept-ranges': 'bytes',
  age: '475936',
  'cache-control': 'max-age=604800',
  'content-type': 'text/html; charset=UTF-8',
  date: 'Fri, 22 Apr 2022 15:06:34 GMT',
  etag: '"3147526947"',
  expires: 'Fri, 29 Apr 2022 15:06:34 GMT',
  'last-modified': 'Thu, 17 Oct 2019 07:18:26 GMT',
  server: 'ECS (bsa/EB16)',
  vary: 'Accept-Encoding',
  'x-cache': 'HIT',
  'content-length': '1256',
  connection: 'close'
}

```
