import Promise from "bluebird";
import { GsmState } from "..";
import ParseCommand from "../parsecommand";

export default class GsmStatusCommand extends ParseCommand {
  protected parse(value: string) {
    const regExp = /^gsm ([\s\S]*?) state:([\s\S]*?)$\r\n/gm;
    let match;
    const res = {};
    while ((match = regExp.exec(value))) {
      res[match[1]] = match[2].trim();
    }
    return res;
  }

  execute(): Promise<Record<string, GsmState>> {
    return super.execute(`gsm status`);
  }
}
