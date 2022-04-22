#!/usr/bin/env node

"use strict";

const { create } = require("http-server-plus");
const { genSelfSignedCert } = require("@xen-orchestra/self-signed");
const { pipeline } = require("stream");
const { request, ServerResponse } = require("http");
const fromCallback = require("promise-toolbox/fromCallback");
const fromEvent = require("promise-toolbox/fromEvent");
const net = require("net");

const { parseBasicAuth } = require("./parseBasicAuth.js");

const log = require("@xen-orchestra/log").createLogger("proxy");

require("@xen-orchestra/log/configure").catchGlobalErrors(log);

const { debug, warn } = log;

const IGNORED_HEADERS = new Set([
  // https://datatracker.ietf.org/doc/html/rfc2616#section-13.5.1
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",

  // don't forward original host
  "host",
]);

async function handleAuthentication(authenticate, req, res, next) {
  if (authenticate !== undefined) {
    const auth = parseBasicAuth(req.headers["proxy-authorization"]);

    // https://datatracker.ietf.org/doc/html/rfc7235#section-3.2
    if (auth === undefined || !(await authenticate(auth))) {
      res.statusCode = "407";
      res.setHeader("proxy-authenticate", 'Basic realm="proxy"');
      return res.end("Proxy Authentication Required");
    }
  }
  return next();
}

const authenticate = ({ name, pass }) => name === "root" && pass === "root";

async function main() {
  const server = create(async function (req, res) {
    const { url } = req;

    if (url.startsWith("/") || url.startsWith("https:")) {
      res.statusCode = 404;
      return res.end("Not Found");
    }

    debug("HTTP proxy", { url });

    try {
      await handleAuthentication(authenticate, req, res, async () => {
        const { headers } = req;
        const pHeaders = {};
        for (const key of Object.keys(headers)) {
          if (!IGNORED_HEADERS.has(key)) {
            pHeaders[key] = headers[key];
          }
        }

        const pReq = request(url, { headers: pHeaders, method: req.method });
        fromCallback(pipeline, req, pReq).catch(warn);

        const pRes = await fromEvent(pReq, "response");
        res.writeHead(pRes.statusCode, pRes.statusMessage, pRes.headers);
        await fromCallback(pipeline, pRes, res);
      });
    } catch (error) {
      res.statusCode = 500;
      res.end("Internal Server Error");
      warn(error);
    }
  });
  server.on("connect", function (req, clientSocket, head) {
    const { url } = req;

    debug("CONNECT proxy", { url });

    // https://github.com/TooTallNate/proxy/blob/d677ef31fd4ca9f7e868b34c18b9cb22b0ff69da/proxy.js#L391-L398
    const res = new ServerResponse(req);
    res.assignSocket(clientSocket);

    handleAuthentication(authenticate, req, res, () => {
      const { port, hostname } = new URL("http://" + req.url);
      const serverSocket = net.connect(port || 80, hostname, function () {
        clientSocket.write("HTTP/1.1 200 Connection Established\r\n\r\n");
        serverSocket.write(head);
        fromCallback(pipeline, clientSocket, serverSocket).catch(warn);
        fromCallback(pipeline, serverSocket, clientSocket).catch(warn);
      });
    }).catch(warn);
  });

  console.log(
    "listening on",
    await Promise.all([
      server.listen({ port: 3128 }),
      server.listen({ port: 3129, ...(await genSelfSignedCert()) }),
    ])
  );

  await fromEvent(server, "close");
}
main(process.argv.slice(2)).catch(console.error.bind(console, "FATAL"));
