const config = require("./config");
const Server = require("./Server");
const ApiKey = require("./ApiKey");
const Cli = require("./Cli");
const { v4: uuidv4 } = require('uuid');

let cli = new Cli();

cli.registerCommand('serve', () => {
    new Server(config.port || 3000);
});

cli.registerCommand('make api-key', async () => {
    let webhook = '';
    do {
        webhook = await cli.ask('Enter webhook URL (e.g. https://example.com/webhook)');
    } while (webhook === '');

    let description = await cli.ask('Enter description (optional)');
    let client_id = uuidv4();
    let api_key = uuidv4();

    let apiKey = new ApiKey(null, webhook, api_key, client_id, description);
    await apiKey.save();

    cli.print(`API key (It's secret): ${api_key}`);
    cli.print(`Connection link: ${config.url}?id=${client_id}`);
});

cli.process();
