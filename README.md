# Ably Authentication Server

This demo application shows you how to authenticate with Ably using various different methods. It comprises an authentication server and a client that enables you to choose which authentication method to use.

To run it:

1. Rename `sample.env` to `.env` and enter your API key secret.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the server.
4. Visit `https://localhost:8080` in your browser.
5. Select an authentication method and then click:
   - _Connect_: To authenticate with Ably using your chosen authentication method
   - _Subscribe_: To subscribe to `testChannel`
   - _Test_: To publish to `testChannel`
   - _Disconnect_: To terminate the connection
