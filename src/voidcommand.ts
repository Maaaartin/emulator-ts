import EmulatorCommand from "./command";

export default class VoidCommand extends EmulatorCommand {
    execute(arg: string) {
        return super.execute(arg).thenReturn();
    }
}