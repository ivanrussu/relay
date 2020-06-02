const ApiKey = require("./ApiKey");
const io = require('socket.io')

class Socket {
    constructor(server) {
        this.io = io(server);
        this.io.on('connection', async (socket) => {await this.handleConnection(socket)});
    }

    async handleSubscription(socket, data, apiKey) {
        let channels = data.channels || [];
        let payload = data.payload || {};

        if(channels.length === 0) {
            return;
        }

        let response = await apiKey.send('subscribe', {
            channels,
            payload
        });

        console.log({response});

        if(response.status !== 200) {
            throw new Error('A server rejects to subscribe you. Please contact your administrator');
        }

        channels.forEach((channel) => {
            let room = apiKey.client_id + '/' + channel;
            socket.join(room);
        });
    }

    async makeRequest(apiKey, data, callback) {
        let response = await apiKey.send('request', data);
        if (callback) {
            callback(response.data);
        }
    }

    async handleConnection(socket) {
        try {
            let client_id = socket.handshake.query.id;
            let apiKey = await ApiKey.getByClientId(client_id);

            socket.join(client_id, () => {
                apiKey.send('connected', apiKey, {});
            });

            socket.on('subscribe', async (data, callback) => {
                try {
                    await this.handleSubscription(socket, data, apiKey)

                    socket.on('request', (data, callback) => {
                        this.makeRequest(apiKey, data, callback);
                    });

                    if (callback) {
                        callback(true);
                    }
                } catch (e) {
                    if(callback) {
                        callback({
                            error: e.message
                        });
                    }
                }
            });
        } catch (e) {
            console.log("ERROR", e)
        }
    }

    broadcast(apiKey, channel, data) {
        let room = apiKey.client_id + '/' + channel;
        this.io.in(room).emit(channel, data);
    }
}

module.exports = Socket;
