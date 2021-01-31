import Promise from 'bluebird';
import Connection from "./connection";
import Parser from "./parser";

export default class EmulatorCommand {
    protected connection: Connection;
    protected parser: Parser;
    protected timeout?: number;
    constructor(connection: Connection, parser: Parser) {
        this.connection = connection;
        this.parser = parser;
    }

    setTimeout(ms: number) {
        this.timeout = ms;
        return this;
    }

    execute(...args: any[]): Promise<any> {
        let handler;
        return new Promise<string>((resolve, reject) => {
            let response = '';
            let err;
            if (this.timeout) {
                this.connection.setTimeout(this.timeout, () => {
                    reject(new Error(response.trim()));
                });
            }
            this.connection.on('data', handler = (data) => {
                const dataStr = data.toString();
                if (/OK/.test(dataStr.slice(dataStr.length - 4, dataStr.length - 2))) {
                    response = response.concat(dataStr);
                    return resolve(response);
                }
                else if (err = this.parser.checkError(dataStr)) {
                    return reject(err);
                }
                else {
                    return response = response.concat(dataStr);
                }
            });
            this.connection.write(`${args.join(' ')}`);
        })
            .finally(() => {
                this.connection.removeListener('data', handler);
                this.connection.end();
            });
    }
}