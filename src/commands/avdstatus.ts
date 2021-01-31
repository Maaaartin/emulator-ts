import Promise from 'bluebird';
import ParseCommand from '../parsecommand';

export default class AvdStatusCommand extends ParseCommand {
    protected parse(value: string) {
        const regExp = /^virtual device is ([\s\S]*?)$\r\n/gm;
        const match = regExp.exec(value);
        if (match) {
            return match[1];
        }
    }

    execute(): Promise<'running' | 'stopped'> {
        return super.execute(`avd status`);
    }
}