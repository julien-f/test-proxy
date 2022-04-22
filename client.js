#!/usr/bin/env node

"use strict";

const ProxyAgent = require("proxy-agent");
const hrp = require("http-request-plus");

// eslint-disable-next-line n/no-deprecated-api
const { parse } = require("url");

async function main() {
  const AGENTS = {
    HTTP: new ProxyAgent("http://root:root@localhost:3128"),
    HTTPS: new ProxyAgent({
      ...parse("https://root:root@localhost:3129"),
      rejectUnauthorized: false,
    }),
  };
  const URLS = {
    HTTP: "http://example.net/",
    HTTPS: "https://example.net/",
  };

  for (const [urlLabel, url] of Object.entries(URLS)) {
    for (const [agentLabel, agent] of Object.entries(AGENTS)) {
      console.log("--- accessing %s URL via %s agent", urlLabel, agentLabel);
      const response = await hrp(url, { agent, bypassStatusCheck: true });
      response.resume();

      console.log(
        response.statusCode,
        response.statusMessage,
        response.headers
      );
      console.log();
    }
  }
}
main(process.argv.slice(2)).catch(console.error.bind(console, "FATAL"));
