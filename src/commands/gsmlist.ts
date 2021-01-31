import Promise from 'bluebird';
import { GsmListObject } from '..';
import ParseCommand from '../parsecommand';

export default class GsmListCommand extends ParseCommand {
    protected parse(value: string) {
        const list = [];
        const regExp = /^([\s\S]*?) (to|from)([\s\S]*?): ([\s\S]*?)$\r\n/gm;
        let match;
        while (match = regExp.exec(value)) {
            list.push({
                type: match[1],
                phoneNr: match[3].trim(),
                status: match[4]
            });
        }
        return list;
    }

    execute(): Promise<GsmListObject[]> {
        return super.execute(`gsm list`);
    }
}