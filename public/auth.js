// auth.js - Handles connections to Ably based on the chosen authentication type

// For connections made to the server by the user
let ably = null;

// Separate channel that is used to retrieve messages from the server in real-time
// so that the app can output the status of connections in the client
let serverAbly = new Ably.Realtime({ authUrl: "/tokenrequest/nolog" });
let serverChannel = serverAbly.channels.get("serverChannel");
serverChannel.subscribe("server", (serverMessage) => {
  writeStatus(serverMessage.data.myText);
});

// *** Basic Auth with API Key and Secret. Client retrieves this from .env file stored on server.
async function doBasicAuth() {
  clearStatus();
  writeStatus("Attempting to retrieve API key secret from auth server");

  try {
    let response = await fetch("/basic");
    let data = await response.json();
    console.log(data);

    writeStatus(
      `Received your API key from auth server: ${data.apiKey.substr(1, 12)}...`
    );
    ably = new Ably.Realtime({ key: data.apiKey });
    ably.connection.on((stateChange) => {
      onStateChange("Connection", stateChange);
    });
  } catch (error) {
    writeStatus(`Error retrieving your key from auth server: ${error}`);
  }
}

// ** Auth with TokenRequest, signed by the server and issued to the client.
async function doAblyTokenRequestWithAuthURL() {
  clearStatus();
  writeStatus("Requesting TokenDetails object from auth server");

  ably = new Ably.Realtime({ authUrl: "/tokenrequest" });
  ably.connection.on((stateChange) => {
    onStateChange("Connection", stateChange);
  });
}

// ** Client calls this endpoint to retrieve token directly.
async function doAblyTokenWithAuthURL() {
  clearStatus();
  writeStatus("Requesting token from auth server");

  ably = new Ably.Realtime({ authUrl: "/token" });
  ably.connection.on((stateChange) => {
    onStateChange("Connection", stateChange);
  });
}

// ** Auth with Ably JWT and authUrl
async function doJwtAuth() {
  clearStatus();
  writeStatus("Requesting JWT from auth server...");

  ably = new Ably.Realtime({ authUrl: "/ably-jwt" });
  ably.connection.on((stateChange) => {
    onStateChange("Connection", stateChange);
  });
}

// ** Auth with Ably JWT and callback
async function doJwtWithCallback() {
  clearStatus();
  writeStatus(`Requesting JWT authentication from server via callback...`);
  ably = new Ably.Realtime({
    authCallback: async ({}, callback) => {
      try {
        const response = await fetch("/ably-jwt");
        const data = await response.json();
        console.log(data);
        callback(null, data);
      } catch (error) {
        writeStatus("Error performing JWT authentication via callback...");
        callback(error, null);
      }
    },
  });
  ably.connection.on((stateChange) => {
    onStateChange("Connection", stateChange);
  });
}

async function doTokenRequestWithCallback() {
  clearStatus();
  writeStatus(
    `Attempting TokenRequest authentication from server via callback...`
  );
  ably = new Ably.Realtime({
    authCallback: async ({}, callback) => {
      try {
        const response = await fetch("/tokenrequest");
        const data = await response.json();
        callback(null, data);
      } catch (error) {
        writeStatus(
          "Error performing TokenRequest authentication via callback..."
        );
        callback(error, null);
      }
    },
  });
  ably.connection.on((stateChange) => {
    onStateChange("Connection", stateChange);
  });
}

async function doTokenWithCallback() {
  clearStatus();
  writeStatus(`Attempting Token authentication from server via callback...`);
  ably = new Ably.Realtime({
    authCallback: async ({}, callback) => {
      try {
        const response = await fetch("/token");
        const data = await response.json();
        callback(null, data);
      } catch (error) {
        writeStatus("Error performing Token authentication via callback...");
        callback(error, null);
      }
    },
  });
  ably.connection.on((stateChange) => {
    onStateChange("Connection", stateChange);
  });
}

// Disconnect when done with a specific example
function closeConnection() {
  ably.connection.close();
  ably = null;
}
