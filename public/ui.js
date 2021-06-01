// ui.js - Handles user input and display of results

let selectedAuthType = "basic";
let status = "";

const btnConnect = document.querySelector("#connect");
const btnSubscribe = document.querySelector("#subscribe");
const btnExecute = document.querySelector("#execute");
const btnDisconnect = document.querySelector("#disconnect");

// handle connect button
btnConnect.onclick = function () {
  // clear status output
  clearStatus();
  writeStatus("Ready");

  const rbs = document.querySelectorAll('input[name="auth"]');
  let selectedValue;
  for (const rb of rbs) {
    if (rb.checked) {
      selectedValue = rb.value;
      break;
    }
  }
  selectedAuthType = selectedValue;

  switch (selectedAuthType) {
    case "basic":
      doBasicAuth();
      break;
    case "tokenreq":
      doAblyTokenRequestWithAuthURL();
      break;
    case "token":
      doAblyTokenWithAuthURL();
      break;
    case "ably-jwt":
      doJwtAuth();
      break;
    case "tokenreq-callback":
      doTokenRequestWithCallback();
      break;
    case "token-callback":
      doTokenWithCallback("");
      break;
    case "jwt-callback":
      doJwtWithCallback();
      break;
  }
};

btnSubscribe.onclick = function () {
  if ((ably !== null) & (ably !== undefined)) {
    createAndSubscribeToChannel(ably);
    clearMessages();
  } else {
    writeStatus("*Cannot subscribe to channels - not connected*");
  }
};

btnExecute.onclick = function () {
  clearMessages();
  if ((ably !== null) & (ably !== undefined)) {
    publishToChannel(ably);
  } else {
    writeStatus("*Not connected*");
  }
};

btnDisconnect.onclick = function () {
  if ((ably !== null) & (ably !== undefined)) {
    closeConnection(ably);
    clearMessages();
  } else {
    writeStatus("*Cannot disconnect - not connected*");
  }
};

function writeStatus(message) {
  status += message + "<br/>";
  document.getElementById("statusMessage").innerHTML = status;
}

function clearStatus() {
  status = "";
  document.getElementById("statusMessage").innerHTML = status;
}

function clearMessages() {
  document.getElementById("alert-message").innerHTML = "EMPTY";
  document.getElementById("update-message").innerHTML = "EMPTY";
}
