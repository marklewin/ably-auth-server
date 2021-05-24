// publish.js

const Ably = new require("ably");
const apiKey = process.env.ABLY_API_KEY;
const ably = new Ably.Realtime({ key: apiKey });
const channel = ably.channels.get("clock");

setInterval(() => {
  const d = new Date();
  const h = pad(d.getHours(), 2);
  const m = pad(d.getMinutes(), 2);
  const s = pad(d.getSeconds(), 2);
  const today = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
  channel.publish("ticktock", { time: `${h}:${m}:${s}`, date: today });
}, 1000);

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
