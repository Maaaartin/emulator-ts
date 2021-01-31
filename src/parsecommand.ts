import EmulatorCommand from "./command";
import Promise from 'bluebird';

export default abstract class ParseCommand extends EmulatorCommand {
    protected abstract parse(value: string): any;
    execute(...args: any[]): Promise<any> {
        return super.execute(args)
            .then((value) => {
                return this.parse(value);
            });
    }
}