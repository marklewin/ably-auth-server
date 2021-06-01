// util.js - Miscellaneous client-side utility functions

function getRandomString(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

function onStateChange(type, stateChange) {
  writeStatus(`New ${type} state is <strong>${stateChange.current}</strong>`);
  if (stateChange.reason) {
    writeStatus(
      `${type} state change reason:<br/><pre class=reason>
              ${stateChange.reason.toString()}</pre>`
    );
  }
}
