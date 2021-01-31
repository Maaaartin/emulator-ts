import ParseCommand from "../parsecommand";
import Promise from 'bluebird';

export default class SensorStatusCommand extends ParseCommand {
    protected parse(value: string) {
        let match;
        const props = {};
        const regExp = /^([\s\S]*?): ([\s\S]*?).$\r\n/gm;
        while (match = regExp.exec(value)) {
            props[match[1]] = match[2];
        }
        return props;
    }

    execute(): Promise<Record<string, 'enabled' | 'disabled'>> {
        return super.execute('sensor status')
    }
}