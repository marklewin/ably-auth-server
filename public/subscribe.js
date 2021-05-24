// subscribe.js

fetch("/auth")
  .then((response) => response.json())
  .then((data) => {
    const ably = new Ably.Realtime({ key: data.apiKey });
    const channel = ably.channels.get("clock");
    channel.subscribe((msg) => {
      console.log(msg);
      document.getElementById("time").innerHTML = msg.data.time;
      document.getElementById("date").innerHTML = msg.data.date;
    });
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });
