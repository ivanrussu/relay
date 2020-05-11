const db = require('./database/DB')
const HttpRequest = require('./HttpRequest')

class ApiKey {
    static getByClientId(client_id) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM api_keys WHERE client_id = $client_id", {
                $client_id: client_id
            }, (err, row) => {
                if (!row) {
                    reject(`ApiKey ${client_id} not found`);
                    return;
                }
                resolve(new ApiKey(row.id, row.webhook, row.api_key, row.client_id, row.description));
            });
        })
    }

    static getByApiKey(api_key) {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM api_keys WHERE api_key = $api_key", {
                $api_key: api_key
            }, (err, row) => {
                if (!row) {
                    reject("ApiKey not found");
                    return;
                }
                resolve(new ApiKey(row.id, row.webhook, row.api_key, row.client_id, row.description));
            });
        })
    }

    constructor(id, webhook, api_key, client_id, description) {
        this.id = id;
        this.webhook = webhook;
        this.api_key = api_key;
        this.client_id = client_id;
        this.description = description;
    }

    send(event, data) {
        let request =  HttpRequest.make()
            .endpoint(this.webhook)
            .method('POST')
            .data({
                api_key: this.api_key,
                event,
                data
            });
        console.log({request})
        return request.send();
    }

    save() {
        let params = {
            $api_key: this.api_key,
            $webhook: this.webhook,
            $client_id: this.client_id,
            $description: this.description,
        };
        let query = ``;

        if (this.id) {
            query = `
                UPDATE api_keys
                SET api_key     = $api_key,
                    webhook     = $webhook,
                    client_id   = $client_id,
                    description = $description
                WHERE id = $id
            `;

            params.$id = id;
        } else {
            query = `INSERT INTO api_keys (api_key, webhook, client_id, description)
                     VALUES ($api_key, $webhook, $client_id, $description)`;
        }

        return new Promise((resolve, reject) => {
            db.run(query, params, (err) => {
                if (err) {
                    reject("Cannot save ApiKey");
                    return;
                }

                ApiKey.getByClientId(this.client_id).then((apiKey) => {
                    this.api_key = apiKey.api_key;
                    this.description = apiKey.description;
                    this.webhook = apiKey.webhook;
                    this.client_id = apiKey.client_id;
                    this.id = apiKey.id;
                    resolve();
                }, () => {
                    reject("Cannot save ApiKey")
                });
            });
        });
    }
}

module.exports = ApiKey;
