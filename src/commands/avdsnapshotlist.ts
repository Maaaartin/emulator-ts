import Promise from 'bluebird';
import { SnapshotObject } from '..';
import ParseCommand from '../parsecommand';

export default class AvdSnapshotListCommand extends ParseCommand {
    protected parse(value: string) {
        const props: SnapshotObject[] = [];
        const regExp = /^(--|\d{1,2})        ([\s\S]*?)(\d+\.\d{1}[\s\S]) ([\s\S]*?)   ([\s\S]*?)$\r\n/gm;
        let match
        while (match = regExp.exec(value)) {
            props.push({
                id: match[1] === '--' ? undefined : match[1],
                tag: match[2].trim(),
                size: match[3],
                date: new Date(match[4]),
                vmClock: match[5]
            });
        }
        return props;
    }

    execute(): Promise<SnapshotObject[]> {
        return super.execute(`avd snapshot list`);
    }
}