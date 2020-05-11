const readline = require('readline');

class Cli {
    constructor() {
        this.commands = new Map();
    }

    registerCommand(signature, callback) {
        this.commands.set(signature, callback);
    }

    ask(question) {
        return new Promise((resolve) => {
            let rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(question, (answer) => {
                answer = answer.trim();
                rl.close();
                resolve(answer)
            });
        });
    }

    print(data) {
        console.log(data);
    }

    process() {
        let args = process.argv.slice(2);
        args = args || [];
        let signature = args.join(' ');
        if (!this.commands.has(signature)) {
            this.print(`No such command ${args}`)
            return;
        }

        return this.commands.get(signature)();
    }
}

module.exports = Cli;
