import { RedirObject } from "..";
import Promise from 'bluebird';
import ParseCommand from "../parsecommand";

export default class RedirListCommand extends ParseCommand {
    protected parse(value: string) {
        let match;
        const redirs: RedirObject[] = [];
        const regExp = /^([\s\S]*?):([\s\S]*?)  => ([\s\S]*?)$\r\n/gm;
        while (match = regExp.exec(value)) {
            redirs.push({
                protocol: match[1],
                hostPort: Number(match[2]),
                guestPort: Number(match[3])
            });
        }
        return redirs;
    }

    execute(): Promise<RedirObject[]> {
        return super.execute('redir list');
    }
}