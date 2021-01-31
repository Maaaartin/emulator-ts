import Promise from 'bluebird';
import ParseCommand from '../parsecommand';

export default class NetworkStatusCommand extends ParseCommand {
    protected parse(value: string) {
        const regExp = /^  ([\s\S]*?): ([\s\S]*?)$\r\n/gm;
        let match;
        const res = {};
        while (match = regExp.exec(value)) {
            res[match[1].replace(' ', '_').toUpperCase()] = match[2].trim();
        }
        return res;
    }

    execute(): Promise<Record<string, string>> {
        return super.execute(`network status`);
    }
}