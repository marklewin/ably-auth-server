// server.js

require("dotenv").config();
//require("./publish");

const { request, response } = require("express");
const express = require("express");
const app = express();

// make all the files in 'public' available
app.use(express.static("public"));

// load the home page, inde.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/basic", (request, response) => {
  response.sendFile(__dirname + "/views/basic-auth.html");
});

// send the api key from .env to the client
app.get("/basic-auth", (request, response) => {
  response.json({ apiKey: process.env.ABLY_API_KEY });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});
