import ParseCommand from "../parsecommand";
import Promise from 'bluebird';

export default class PingCommand extends ParseCommand {
    protected parse(value: string): boolean {
        if (/alive/.test(value)) {
            return true;
        }
        else return false;
    }
    execute(): Promise<boolean> {
        return super.execute('ping');
    }
}