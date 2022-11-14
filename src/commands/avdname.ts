import Promise from "bluebird";
import ParseCommand from "../parsecommand";

export default class AvdNameCommand extends ParseCommand {
  protected parse(value: string) {
    const regExp = /^([\s\S]*?)$\r\n/gm;
    const match = regExp.exec(value);
    if (match) {
      return match[1];
    }
  }

  execute(): Promise<string> {
    return super.execute(`avd name`);
  }
}
