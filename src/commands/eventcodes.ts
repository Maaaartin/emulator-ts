import { EventType } from "..";
import ParseCommand from "../parsecommand";
import Promise from 'bluebird';

export default class EventCodesCommand extends ParseCommand {
    protected parse(value: string) {
        const codes = [];
        if (/no/.test(value)) return codes;
        const regExp = /^((?![a-z])([\s\S]*?)_([\s\S]*?))$\r\n/gm;
        let match
        while (match = regExp.exec(value)) {
            codes.push(match[1].trim());
        }
        return codes;
    }
    execute(type: EventType): Promise<string[]> {
        return super.execute(`event codes ${type}`);
    }
}