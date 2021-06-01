// server.js - Provides the different authentication endpoints

require("dotenv").config();

const { request, response } = require("express");
const express = require("express");
const Ably = require("ably");
const jwt = require("jsonwebtoken");
const { prettyPrintJson } = require("pretty-print-json");

let ably = null;
let channel = null;

// Adjust these values in .env
const tokenParams = {
  clientId: process.env.CLIENT_ID,
  ttl: process.env.TOKEN_EXPIRY_MSEC,
};

const app = express();

// make all the files in 'public' available
app.use(express.static("public"));

// load the home page, index.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the api key from .env to the client
app.get("/basic", (request, response) => {
  const apiKeySecret = process.env.ABLY_API_KEY;
  console.log(apiKeySecret);
  response.json({ apiKey: apiKeySecret });
});

// *** Generate a TokenRequest and send it to the client.
// The optional "mute" param, if set to "nolog" prevents the connection that the app uses
// beind the scenes to pass server messages to the client from logging its connection status
app.get("/tokenrequest/:mute?", (request, response) => {
  ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  ably.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    if (err) {
      response
        .status(500)
        .send("Error retrieving TokenRequest: " + JSON.stringify(err));
    } else {
      if (request.params.mute !== "nolog") {
        const serverLog = `${prettyPrintJson.toHtml(tokenRequest)}`;
        console.log(tokenRequest);
        sendServerStatus(serverLog);
      }

      response.setHeader("Content-Type", "application/json");
      response.send(JSON.stringify(tokenRequest));
    }
  });
});

// *** Generate a token and send it to the client
app.get("/token", (request, response) => {
  ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  ably.auth.requestToken(tokenParams, (err, token) => {
    if (err) {
      response
        .status(500)
        .send("Error requesting token: " + JSON.stringify(err));
    } else {
      const serverLog = `${prettyPrintJson.toHtml(token)}`;
      console.log(token);
      sendServerStatus(serverLog);
      response.setHeader("Content-Type", "application/json");
      response.send(JSON.stringify(token));
    }
  });
});

// ** Generate an Ably JWT and send it to the client
app.get("/ably-jwt", (request, response) => {
  const appId = getAppId(process.env.ABLY_API_KEY);
  const keyId = getKeyId(process.env.ABLY_API_KEY);
  const keySecret = getSecret(process.env.ABLY_API_KEY);

  const jwtPayload = {
    "x-ably-capability": JSON.stringify({ "*": ["publish", "subscribe"] }),
    "x-ably-clientId": "ably-auth-demo",
  };
  const jwtOptions = {
    expiresIn: process.env.TOKEN_EXPIRY_MSEC,
    keyid: `${appId}.${keyId}`,
  };

  jwt.sign(jwtPayload, keySecret, jwtOptions, function (err, jwt) {
    if (err) {
      response.status(500).send("Error requesting JWT: " + JSON.stringify(err));
    } else {
      const serverLog = `<pre class=reason>${jwt}</pre>`;
      sendServerStatus(serverLog);
      response.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      response.setHeader("Content-Type", "application/json");
      response.send(JSON.stringify(jwt));
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});

function getAppId(apiKeySecret) {
  return apiKeySecret.substr(0, apiKeySecret.indexOf("."));
}

function getKeyId(apiKeySecret) {
  return apiKeySecret.substring(
    apiKeySecret.lastIndexOf(".") + 1,
    apiKeySecret.lastIndexOf(":")
  );
}

function getSecret(apiKeySecret) {
  return apiKeySecret.split(":")[1];
}

function sendServerStatus(message) {
  let serverChannel = ably.channels.get("serverChannel");
  serverChannel.publish("server", {
    myText: message,
  });
}
