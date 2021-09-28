import Promise from "bluebird";
import fs from "fs";
import { Socket, SocketConnectOpts } from "net";
import Path from "path";
import userHome from "user-home";
import {
  EmulatorPorts,
  EventType,
  GsmState,
  NetProtocol,
  PowerDisplay,
  PowerStatus,
  ScreenRecordOptions,
} from ".";
import EmulatorCommand from "./command";
import AvdHearbeatCommand from "./commands/avdheartbeat";
import AvdNameCommand from "./commands/avdname";
import AvdSnapshotListCommand from "./commands/avdsnapshotlist";
import AvdStatusCommand from "./commands/avdstatus";
import EventCodesCommand from "./commands/eventcodes";
import GsmListCommand from "./commands/gsmlist";
import GsmStatusCommand from "./commands/gsmstatus";
import NetworkStatusCommand from "./commands/networkstatus";
import PingCommand from "./commands/pingcommand";
import PowerDisplayCommand from "./commands/powedisplay";
import RedirListCommand from "./commands/redirlist";
import ScreenrecordWebrtcStartCommand from "./commands/screenrecordwebrtc";
import SensorGetCommand from "./commands/sensorget";
import SensorStatusCommand from "./commands/sensorstatus";
import Connection from "./connection";
import { Ev_AbsCode, Ev_KeyCode, Ev_RelCode, Ev_SwCode } from "./emulatorcode";
import Parser from "./parser";
import VoidCommand from "./voidcommand";
import VoidQueueCommand from "./voidiqueuecommand";

export default class EmulatorClient {
  private connectOpt: SocketConnectOpts;
  private token: string;
  private parser: Parser;
  constructor(token: string, options: SocketConnectOpts) {
    this.token = token;
    this.connectOpt = options;
    this.parser = new Parser();
  }

  static readTokenSync() {
    return fs
      .readFileSync(Path.join(userHome, ".emulator_console_auth_token"))
      .toString();
  }

  static readToken(cb?: (err: Error, value: string) => void) {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(
        Path.join(userHome, ".emulator_console_auth_token"),
        (err, data) => {
          if (err) return reject(err);
          else return resolve(data.toString());
        }
      );
    }).nodeify(cb);
  }

  static listEmulators(cb?: (err: Error, value: number[]) => void) {
    return Promise.map(EmulatorPorts, (port) => {
      return new Promise((resolve) => {
        const socket = new Socket();
        socket.setTimeout(50, () => {
          resolve();
          socket.end();
        });
        socket.once("data", (data) => {
          const dataStr = data.toString();
          if (
            /OK/.test(dataStr.slice(dataStr.length - 4, dataStr.length - 2))
          ) {
            resolve(port);
          } else {
            resolve();
          }
          socket.end();
        });
        socket.once("error", (err) => {
          resolve();
          socket.end();
        });
        socket.connect(port);
      });
    })
      .then((ports) => {
        return ports.filter((port) => port) as number[];
      })
      .nodeify(cb);
  }

  static map<R>(mapper: (client: EmulatorClient) => R, token: string) {
    return EmulatorClient.listEmulators().then((ports) => {
      Promise.map(ports, (port) => {
        return mapper(new EmulatorClient(token, { port }));
      });
    });
  }

  private connection() {
    return new Promise<Connection>((resolve, reject) => {
      const stream = new Connection(this.token, this.parser, this.connectOpt);
      stream.on("auth", () => {
        resolve(stream);
      });
      stream.on("error", reject);
    });
  }

  write(
    cmd: string,
    cb?: (err: Error, value: string) => void
  ): Promise<string> {
    return this.connection()
      .then((conn) => {
        return new EmulatorCommand(conn, this.parser).execute(cmd);
      })
      .nodeify(cb);
  }

  ping() {
    return this.connection().then((conn) => {
      return new PingCommand(conn, this.parser).execute();
    });
  }

  automationRecord(name: string, cwd?: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `automation record ${cwd ? Path.join(cwd, name) : name}`
      );
    });
  }

  automationStopRecord() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `automation stop-record`
      );
    });
  }

  automationPlay(name: string, cwd?: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `automation play ${cwd ? Path.join(cwd, name) : name}`
      );
    });
  }

  automationStopPlay() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`automation stop-play`);
    });
  }

  powerDisplay(): Promise<PowerDisplay> {
    return this.connection().then((conn) => {
      return new PowerDisplayCommand(conn, this.parser).execute();
    });
  }

  powerAc(status: "on" | "off") {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`power ac ${status}`);
    });
  }

  powerStatus(status: PowerStatus) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `power status ${status}`
      );
    });
  }

  powerPresent(state: boolean) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `power present ${state}`
      );
    });
  }

  powerHealth(
    state: "unknown" | "good" | "overheat" | "dead" | "overvoltage" | "failure"
  ) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `power health ${state}`
      );
    });
  }

  powerCapacity(capacity: number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `power capacity ${capacity}`
      );
    });
  }

  redirAdd(protocol: NetProtocol, hostPort: number, guestPort: number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `redir add ${protocol}:${hostPort}:${guestPort}`
      );
    });
  }

  redirDel(protocol: NetProtocol, hostPort: number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `redir del ${protocol}:${hostPort}`
      );
    });
  }

  redirList() {
    return this.connection().then((conn) => {
      return new RedirListCommand(conn, this.parser).execute();
    });
  }

  sms(phoneNr: number | string, message: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `sms send ${phoneNr} ${message}`
      );
    });
  }

  eventCodes(type: EventType) {
    return this.connection().then((conn) => {
      return new EventCodesCommand(conn, this.parser).execute(type);
    });
  }

  eventSend(
    type: "EV_KEY",
    code: Ev_KeyCode,
    value: 0 | 1 | string
  ): Promise<void>;
  eventSend(
    type: "EV_REL",
    code: Ev_RelCode,
    value: 0 | 1 | string
  ): Promise<void>;
  eventSend(
    type: "EV_ABS",
    code: Ev_AbsCode,
    value: 0 | 1 | string
  ): Promise<void>;
  eventSend(
    type: "EV_SW",
    code: Ev_SwCode,
    value: 0 | 1 | string
  ): Promise<void>;
  eventSend(
    type: EventType,
    code: string | number,
    value: 0 | 1 | string
  ): Promise<void>;
  eventSend(
    type: string | number,
    code: string | number,
    value: 0 | 1 | string
  ): Promise<void>;
  eventSend(type: string | number, code: string, value: 0 | 1 | string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `event send ${type}:${code}:${value}`
      );
    });
  }

  eventMouse(x: number, y: number, device = 0, bntState = 1) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `event mouse ${x} ${y} ${device} ${bntState}`
      );
    });
  }

  sensorStatus() {
    return this.connection().then((conn) => {
      return new SensorStatusCommand(conn, this.parser).execute();
    });
  }

  sensorGet(name: string) {
    return this.connection().then((conn) => {
      return new SensorGetCommand(conn, this.parser).execute(name);
    });
  }

  sensorSet(name: string, valueA: number, valueB?: number, valueC?: number) {
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .addArg(valueB, ":")
        .addArg(valueC, ":")
        .execute(`sensor set ${name} ${valueA}`);
    });
  }

  physicsRecordGt(name: string, cwd?: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `physics record-gt ${cwd ? Path.join(cwd, name) : name}`
      );
    });
  }

  physicsStop() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`physics stop`);
    });
  }

  geoNmea(sentence: string, ...params: string[]) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `geo nmea ${sentence}, ${params.join(",")}`
      );
    });
  }

  geoFix(
    longitude: number,
    latitude: number,
    altitude?: number,
    satelites?: number,
    velocity?: number
  ) {
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .addArg(altitude, " ")
        .addArg(satelites, " ")
        .addArg(velocity, " ")
        .execute(`geo fix ${longitude} ${latitude}`);
    });
  }

  geoGnss(...values: string[]) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `geo gnss ${values.join(",")}`
      );
    });
  }

  gsmList() {
    return this.connection().then((conn) => {
      return new GsmListCommand(conn, this.parser).execute();
    });
  }

  gsmCall(phoneNr: string | number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`gsm call ${phoneNr}`);
    });
  }

  gsmBusy(phoneNr: string | number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`gsm busy ${phoneNr}`);
    });
  }

  gsmHold(phoneNr: string | number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`gsm hold ${phoneNr}`);
    });
  }

  gsmAccept(phoneNr: string | number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `gsm accept ${phoneNr}`
      );
    });
  }

  gsmCancel(phoneNr: string | number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `gsm cancel ${phoneNr}`
      );
    });
  }

  gsmData(state: GsmState) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`gsm data ${state}`);
    });
  }

  gsmMeter(state: "on" | "off") {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`gsm meter ${state}`);
    });
  }

  gsmVoice(state: GsmState) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`gsm voice ${state}`);
    });
  }

  gsmStatus() {
    return this.connection().then((conn) => {
      return new GsmStatusCommand(conn, this.parser).execute();
    });
  }

  gsmSignal(rssi: number, ber?: number) {
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .addArg(ber, " ")
        .execute(`gsm signal ${rssi}`);
    });
  }

  gsmSignalProfile(strength: 0 | 1 | 2 | 3 | 4) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `gsm signal-profile ${strength}`
      );
    });
  }

  cdmaSsource(source: "nv" | "ruim") {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `cdma ssource ${source}`
      );
    });
  }

  cdmaPrlVersion(version: string | number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `cdma prl_version ${version}`
      );
    });
  }

  crash() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`crash`);
    });
  }

  crashOnExit() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`crash-on-exit`);
    });
  }

  kill() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`kill`);
    });
  }

  restart() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`restart`);
    });
  }

  networkStatus() {
    return this.connection().then((conn) => {
      return new NetworkStatusCommand(conn, this.parser).execute();
    });
  }

  networkSpeed(up: number, down: number): Promise<void>;
  networkSpeed(
    speed:
      | "gsm"
      | "hscsd"
      | "gprs"
      | "edge"
      | "umts"
      | "hsdpa"
      | "lte"
      | "evdo"
      | "full"
  ): Promise<void>;
  networkSpeed(speed: number): Promise<void>;
  networkSpeed(speed: any, param?: any) {
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .addArg(param, ":")
        .execute(`network speed ${speed}`);
    });
  }

  networkDelay(min: number, max: number): Promise<void>;
  networkDelay(delay: "gprs" | "edge" | "umts" | "none"): Promise<void>;
  networkDelay(delay: number): Promise<void>;
  networkDelay(delay: any, param?: any) {
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .addArg(param, ":")
        .execute(`network delay ${delay}`);
    });
  }

  networkCaptureStart(name: string, cwd?: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `network capture start ${cwd ? Path.join(cwd, name) : name}`
      );
    });
  }

  networkCaptureStop() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`network capture stop`);
    });
  }

  avdStop() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`avd stop`);
    });
  }

  avdStart() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`avd start`);
    });
  }

  avdStatus() {
    return this.connection().then((conn) => {
      return new AvdStatusCommand(conn, this.parser).execute();
    });
  }

  avdHeartbeat() {
    return this.connection().then((conn) => {
      return new AvdHearbeatCommand(conn, this.parser).execute();
    });
  }

  avdRewindaudio() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`avd rewindaudio`);
    });
  }

  avdName() {
    return this.connection().then((conn) => {
      return new AvdNameCommand(conn, this.parser).execute();
    });
  }

  avdSnapshotList() {
    return this.connection().then((conn) => {
      return new AvdSnapshotListCommand(conn, this.parser).execute();
    });
  }

  avdSnaphotSave(name: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `avd snapshot save ${name}`
      );
    });
  }

  avdSnaphotLoad(name: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `avd snapshot load ${name}`
      );
    });
  }

  avdSnaphotDelete(name: string) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `avd snapshot delete ${name}`
      );
    });
  }

  avdSnaphotRemap(autoSave: 0 | 1) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `avd snapshot remap ${autoSave}`
      );
    });
  }

  fingerTouch(id: number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`finger touch ${id}`);
    });
  }

  fingerRemove() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`finger remove`);
    });
  }

  debug(...tags: string[]) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `debug ${tags.join(",")}`
      );
    });
  }

  rotate() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`rotate`);
    });
  }

  screenrecordStart(
    name: string,
    options?: ScreenRecordOptions & { cwd?: string }
  ) {
    options = options || {};
    const { cwd, height, width, bitRate, timeLimit, fsp } = options;
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .setTimeout(100)
        .addArg(
          height !== undefined && width !== undefined
            ? `--size ${width}x${height}`
            : undefined,
          " "
        )
        .addArg(
          bitRate !== undefined ? `--bit-rate ${bitRate}` : undefined,
          " "
        )
        .addArg(
          timeLimit !== undefined ? `--time-limit ${timeLimit}` : undefined,
          " "
        )
        .addArg(fsp !== undefined ? `--fps ${fsp}` : undefined, " ")
        .addArg(`${cwd ? Path.join(cwd, name) : name}.webm`, " ")
        .execute(`screenrecord start`);
    });
  }

  screenrecordStop() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`screenrecord stop`);
    });
  }

  screenrecordScreenshot(dirName: string, displayId = 0) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `screenrecord screenshot --display ${displayId} ${dirName}`
      );
    });
  }

  screenrecordWebrtcStart(fps = 60) {
    return this.connection().then((conn) => {
      return new ScreenrecordWebrtcStartCommand(conn, this.parser).execute(fps);
    });
  }

  screenrecordWebrtcStop() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `screenrecord webrtc stop`
      );
    });
  }

  fold() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).setTimeout(100).execute(`fold`);
    });
  }

  unfold() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser)
        .setTimeout(100)
        .execute(`unfold`);
    });
  }

  multidisplayAdd(
    id: number,
    width: number,
    height: number,
    dpi: number,
    flag = 0
  ) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `multidisplay add ${id} ${width} ${height} ${dpi} ${flag}`
      );
    });
  }

  multidisplayDel(id: number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(
        `multidisplay del ${id}`
      );
    });
  }

  grpc(port: number) {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`grpc ${port}`);
    });
  }

  startExtendedWindow() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`startExtendedWindow`);
    });
  }

  quitExtendedWindow() {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`quitExtendedWindow`);
    });
  }

  setUiTheme(theme: "light" | "dark") {
    return this.connection().then((conn) => {
      return new VoidCommand(conn, this.parser).execute(`setUiTheme ${theme}`);
    });
  }

  iceboxTrack(pid: number, maxSnapshots?: number) {
    return this.connection().then((conn) => {
      return new VoidQueueCommand(conn, this.parser)
        .addArg(maxSnapshots, " ")
        .execute(`icebox track ${pid}`);
    });
  }
}
