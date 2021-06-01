// pubsub.js - Creates channels, and handles Pub/Sub operations

let channel = null;

function createAndSubscribeToChannel(client) {
  writeStatus("Creating 'testChannel'...");
  channel = client.channels.get("testChannel");

  channel.on((stateChange) => {
    onStateChange("Channel", stateChange);
  });

  writeStatus("Subscribing to 'testChannel'...");
  channel.subscribe(["updates", "alerts"], (message) => {
    let messageText = message.data.myText;
    writeStatus(`Received <strong>${messageText}</strong> on testChannel...`);

    if (messageText.substr(0, messageText.indexOf(":")) === "alert") {
      document.getElementById("alert-message").innerHTML = messageText;
    } else if (messageText.substr(0, messageText.indexOf(":")) === "update") {
      document.getElementById("update-message").innerHTML = messageText;
    }
  });
}

function publishToChannel() {
  if (channel == null || channel == undefined) {
    writeStatus(`* Channel does not exist yet *`);
    return;
  }
  const msg1 = getRandomString(8);
  const msg2 = getRandomString(5);
  writeStatus(
    `Publishing <strong>${msg1}</strong> as <strong>update</strong>...`
  );
  channel.publish("updates", {
    myText: "update: " + msg1,
  });
  writeStatus(
    `Publishing <strong>${msg2}</strong> as <strong>alert</strong>...`
  );
  channel.publish("alerts", {
    myText: "alert: " + msg2,
  });
}
