import { PowerDisplay, stringToType } from "..";
import ParseCommand from "../parsecommand";
import Promise from "bluebird";

export default class PowerDisplayCommand extends ParseCommand {
  protected parse(value: string) {
    let match;
    const props = {};
    const regExp = /^([\s\S]*?): ([\s\S]*?)$\r\n/gm;
    while ((match = regExp.exec(value))) {
      props[match[1]] = stringToType(match[2].toLowerCase().replace(" ", "-"));
    }
    return props as PowerDisplay;
  }
  execute(): Promise<PowerDisplay> {
    return super.execute("power display");
  }
}
