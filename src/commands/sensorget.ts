import Promise from "bluebird";
import ParseCommand from "../parsecommand";

export default class SensorGetCommand extends ParseCommand {
  protected parse(value: string) {
    const regExp = /^([\s\S]*?) = ([\s\S]*?):([\s\S]*?):([\s\S]*?)$\r\n/gm;
    const match = regExp.exec(value);
    if (match) return match.slice(2, 5).map((nr) => Number(nr));
  }

  execute(name: string): Promise<number[]> {
    return super.execute(`sensor get ${name}`);
  }
}
