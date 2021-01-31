import EventEmitter from "events";
import { Socket, SocketConnectOpts } from "net";
import Parser from "./parser";

export default class Connection extends EventEmitter {
    private socket: Socket;
    private parser: Parser;
    constructor(token: string, parser: Parser, options: SocketConnectOpts) {
        super();
        this.socket = new Socket();
        this.parser = parser;
        this.authorize(token, options);
        this.once('auth', () => {
            this.socket.on('data', (data) => {
                this.emit('data', data);
            });
        });
        this.socket.on('error', (err) => {
            this.emit('error', err);;
        });
    }

    setTimeout(ms: number, cb: VoidFunction) {
        this.socket.setTimeout(ms, cb);
    }

    public write(data: string, cb?: WritableStreamErrorCallback) {
        this.socket.write(`${data}\r\n`, cb);
    }

    private authorize(token: string, options: SocketConnectOpts) {
        let handler;
        this.socket.once('connect', () => {
            this.write(`auth ${token}`);
        });
        this.socket.on('data', handler = ((data) => {
            const dataStr = data.toString();
            const okRegExp = /type 'help'/;
            if (okRegExp.test(dataStr)) {
                this.socket.removeListener('data', handler);
                this.emit('auth');
            }
            else {
                const err = this.parser.checkError(data);
                if (err) {
                    this.socket.removeListener('data', handler);
                    this.emit('error', err);
                }
            }
        }).bind(this));
        this.socket.connect(options);
    }

    on(event: 'timeout', listener: VoidFunction): this;
    on(event: 'data', listener: (data: Buffer) => void): this;
    on(event: 'auth', listener: VoidFunction): this;
    on(event: 'end', listener: VoidFunction): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    end() {
        this.socket.end(() => {
            this.emit('end');
            this.socket.removeAllListeners();
            this.removeAllListeners();
        });
    }
}