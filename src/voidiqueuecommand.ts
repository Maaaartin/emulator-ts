import EmulatorCommand from "./command";

export default class VoidQueueCommand extends EmulatorCommand {
  private queue: string[] = [];
  private escape(arg?: any, prefix?: string): string {
    switch (typeof arg) {
      case "undefined":
        return "";
      default:
        return prefix ? `${prefix}${arg}` : `${arg}`;
    }
  }

  addArg(cmd: any, delimiter?: string) {
    const arg = this.escape(cmd, delimiter);
    if (arg) this.queue.push(arg);
    return this;
  }

  execute(cmd: string) {
    return super.execute(`${cmd}${this.queue.join(" ")}`).thenReturn();
  }
}
