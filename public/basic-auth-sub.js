// basic-auth-sub.js

function doBasicAuth() {
  console.log("basic auth");
  fetch("/basic-auth")
    .then((response) => response.json())
    .then((data) => {
      const ably = new Ably.Realtime({ key: data.apiKey });
      const channel1 = ably.channels.get("channel-1");
      const channel2 = ably.channels.get("channel-2");
      channel1.subscribe((msg) => {
        console.log(msg);
        document.getElementById("ch1-field1").innerHTML = msg.data.field1;
        document.getElementById("ch1-field2").innerHTML = msg.data.field2;
      });
      channel2.subscribe((msg) => {
        console.log(msg);
        document.getElementById("ch2-field1").innerHTML = msg.data.field1;
        document.getElementById("ch2-field2").innerHTML = msg.data.field2;
      });
      channel1.publish("channel-1", {
        field1: "1 random stuff",
        field2: "1 more random stuff",
      });
      channel2.publish("channel-2", {
        field1: "2 random stuff",
        field2: "2 more random stuff",
      });
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}
