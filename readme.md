# Relay

Relay transmits **POST messages** from server **throught websockets** ([socket.io](https://socket.io/) actually) to clients and
websockets messages throught POST back to server.

On the client side, it is a common problem of keeping data up-to-date. Sometimes, implementing websokets might be inconvenient due to technological stack or the lack of experience. With Relay you can send data from server to client with a familiar HTTP POST request.

 

## Quickstart

1. **Install Relay**

   ```bash
   git clone https://github.com/ivanrussu/relay
   cd ./relay
   npm install
   cp config.example.js config.js
   npm run serve
   ```
   

2. **Prepare a webhook**. Webhook is used to control subscriptions and getting information from Relay. Webhooks are called as form-data POST requests and contain `api_key`, `event` and `data` fields. `event` field  determines the type of a webhook. It might be `connected` which contains no data and triggers every time a client connects to your link (you will get your link in the next step). When a client is trying to subscribe to a channel `subscribe` event triggers, in this case `data` contains array of strings in `channels` field and any object in `payload`. For example, you can use `payload` to authenticate clients. The last type of webhooks is `request` with any object as `data`. It is called when a client makes a request to your server.

3. **Create an API Key**. API Key is used to authenticate requests between your server and Relay. To create one, use command `npm run make api-key`. Answer questions and you will obtain API key as well as the link. Keep the key safe. Share the link with frontend.

4. **Send a message**. Once the clients are ready to receive messages, simply make POST request like 

   ```bash
   curl --location --request POST 'https://relay.example.com/api/v1/broadcast' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "api_key": "YOUR_API_KEY",
       "channel": "notifications",
       "data": {
           "event": "new_message",
           "user_id": 700695,
           "message": "Hello, how are you?"
       }
   }'
   ```