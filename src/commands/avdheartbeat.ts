import Promise from "bluebird";
import ParseCommand from "../parsecommand";

export default class AvdHearbeatCommand extends ParseCommand {
  protected parse(value: string) {
    const regExp = /^heartbeat: ([\s\S]*?)$\r\n/gm;
    const match = regExp.exec(value);
    if (match) {
      return Number(match[1]);
    }
  }

  execute(): Promise<number> {
    return super.execute(`avd heartbeat`);
  }
}
