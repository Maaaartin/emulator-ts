import ParseCommand from "../parsecommand";
import Promise from 'bluebird';

export default class ScreenrecordWebrtcStartCommand extends ParseCommand {
    protected parse(value: string) {
        const regExp = /^([\s\S]*?)$\r\n/gm;
        const match = regExp.exec(value)
        if (match) {
            return match[1];
        }
    }

    execute(fps: number): Promise<string> {
        return super.execute(`screenrecord webrtc start ${fps}`)
    }
}