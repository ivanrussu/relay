let express = require('express')
let Socket = require('./Socket');
let ApiKey = require('./ApiKey');
const bodyParser = require('body-parser')

class Server {
    constructor(port) {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));

        let server = this.app.listen(port, () => console.log('Server listening on port ' + port));
        this.socket = new Socket(server);

        this.initAPI();
    }

    initAPI() {
        this.app.post('/api/v1/broadcast', async (req, res) => {
            try {
                let {api_key, channel, data} = req.body;

                if (!api_key || !channel || !data) {
                    throw new Error("Requred field is empty");
                }

                let apiKey = await ApiKey.getByApiKey(api_key);

                res.sendStatus(200);
                this.socket.broadcast(apiKey, channel, data);
            } catch (e) {
                res.sendStatus(400);
                res.send(JSON.stringify({
                    error: e.message
                }));
            }
        });
    }
}

module.exports = Server;
