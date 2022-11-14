# emulator-ts

Node.js implementation of Emulator console: https://developer.android.com/studio/run/emulator-console.

##Installation

```bash
yarn add emulator-ts
```

##API

#### emulator static methods

##### EmulatorClient.readToken()

```ts
EmulatorClient.readToken()
    .then((token: string) => console.log(output)));
```

Reads the emulator authentication token.

- Returns: `Promise<string>`

##### EmulatorClient.readTokenSync()

```ts
const token = EmulatorClient.readTokenSync();
```

Synchronous read token method.

- Returns: `string`

##### EmulatorClient.listEmulators()

```ts
EmulatorClient.listEmulators()
    .then((ports: number[]) => console.log(ports)));
```

Gets array of ports used by emulators.

- Returns: `Promise<number[]>`

##### EmulatorClient.map<R>(mapper: (client: EmulatorClient) => R, token: string)

```ts
EmulatorClient.map((client: EmulatorClient) => {
  // client....
});
```

Maps through all active emulators.

- Returns: `Promise<R[]>`

- **EmulatorClient(options: SocketConnectOpts & { token?: string })**

* **options** socket connect options

```ts
import { EmulatorClient } from "emulator-ts";
const emulator = new EmulatorClient("token", { port: 5554 });
```

Port of the emulator can be found by [adb-ts](https://www.npmjs.com/package/adb-ts)

```ts
import { AdbClient } from "adb-ts";
const adb = new AdbClient({ bin: "path-to-adb.exe" });
adb.listDevice().then((devices) => {
  // emulator id contains port number
});
```

#### emulator methods

##### emulator.write(cmd: string)

```ts
emulator.write('avd status')
    .then((output: string) => console.log(output)));
```

Allows to execute any command, resolves with string output.

- Returns: `Promise<string>`

##### emulator.ping()

```ts
emulator.ping()
    .then(() => null));
```

Pings the emulator port. If resolves, emulator is alive. Analogous to `ping`.

- Returns: `Promise<void>`

##### emulator.automationRecord(name: string, cwd?: string)

```ts
emulator.automationRecord('some-file-name')
    .then(() => null));
```

Start recording a macro of device state changes to the given file. Analogous to `automation record <filename>`.

- Returns: `Promise<void>`

##### emulator.automationStopRecord()

```ts
emulator.automationStopRecord()
    .then(() => null));
```

Stops the current recording. Analogous to `automation stop-record`.

- Returns: `Promise<void>`

##### emulator.automationPlay(name: string, cwd?: string)

```ts
emulator.automationPlay('some-file-name')
    .then(() => null));
```

Start playing back the macro from the given file. Analogous to `automation play <filename>`.

- Returns: `Promise<void>`

##### emulator.automationStopPlay()

```ts
emulator.automationStopPlay()
    .then(() => null));
```

Stops the current macro playback. Analogous to `automation stop-play`.

- Returns: `Promise<void>`

##### emulator.powerDisplay()

```ts
emulator.powerDisplay().then((props: PowerDisplay) => console.log(props));
```

Displays battery and charger state. `PowerDisplay` is on object with properties `ac`, `status`, `present`, `health` and `capacity`. Analogous to `power display`.

- Returns: `Promise<PowerDisplay>`

##### emulator.powerAc(status: 'on' | 'off')

```ts
emulator.powerAc('on')
    .then(() => null));
```

Allows you to set the AC charging state to `on` or `off`. Analogous to `power ac <status>`.

- Returns: `Promise<void>`

##### emulator.powerStatus(status: 'unknown' | 'charging' | 'discharging' | 'not-charging' | 'full')

```ts
emulator.powerStatus('not-charging')
    .then(() => null));
```

Allows you to set battery status. Analogous to `power status <status>`.

- Returns: `Promise<void>`

##### emulator.powerPresent(state: boolean)

```ts
emulator.powerPresent(true)
    .then(() => null));
```

Allows you to set battery present state to `true` or `false`. Analogous to `power present <state>`.

- Returns: `Promise<void>`

##### emulator.powerHealth(state: 'unknown' | 'good' | 'overheat' | 'dead' | 'overvoltage' | 'failure')

```ts
emulator.powerHealth('failure')
    .then(() => null));
```

Allows you to set battery health state. Analogous to `power health <state>`.

- Returns: `Promise<void>`

##### emulator.powerCapacity(capacity: number)

```ts
emulator.powerCapacity(80)
    .then(() => null));
```

Allows you to set battery capacity to a value `0 - 100`. Analogous to `power capacity <capacity>`.

- Returns: `Promise<void>`

##### emulator.redirAdd(protocol: NetProtocol, hostPort: number, guestPort: number)

```ts
// will allow any packets sent to the host's TCP port 5000 to be routed to TCP port 6000 of the emulated device
emulator.redirAdd('tcp', 5000, 6000)
    .then(() => null));
```

Adds a new port redirection. Analogous to `redir add <protocol>:<hostport>:<guestport>`.

- Returns: `Promise<void>`

##### emulator.redirDel(protocol: NetProtocol, hostPort: number)

```ts
emulator.redirAdd('tcp', 5000, 6000)
    .then(() => null));
```

Removes a port redirecion that was created with `redirAdd()`. Analogous to `redir del <protocol>:<hostport>`.

- Returns: `Promise<void>`

##### emulator.redirList()

```ts
emulator.redirList()
    .then((redirs: RedirObject[]) => console.log(redirs)));
```

Lists current port redirections. `RedirObject` is a type with properties `protocol`, `hostPort` and `guestPort`. Analogous to `redir del <protocol>:<hostport>`.

- Returns: `Promise<void>`

##### emulator.sms(phoneNr: number | string, message: string)

```ts
emulator.sms(123456, 'some text')
    .then(() => null));
```

Allows to simulate a new inbound sms message. Analogous to `sms send <phonenumber> <text>`.

- Returns: `Promise<void>`

##### emulator.eventCodes(type: EventType)

```ts
emulator.eventCodes('EV_KEY')
    .then((codes: string[]) => console.log(codes)));
```

`event codes <type>` lists all `<code>` string aliases for a given event `<type>`.

- Returns: `Promise<string[]>`

##### emulator.eventSend(type: 'EV_KEY' | 'EV_REL' | 'EV_ABS' | 'EV_SW' | EventType | string, code: Ev_KeyCode | Ev_RelCode | Ev_AbsCode | Ev_SwCode | string, value?: 0 | 1 | string)

```ts
emulator.eventSend('EV_KEY', 'KEY_A')
    .then(() => null));
```

Allows to send one or more hardware events
to the Android kernel. You can use text names or integers for `<type>` and `<code>`. Analogous to `event send <key>:<code>:<value>`.

- Returns: `Promise<void>`

##### emulator.eventMouse(x: number, y: number, device = 0, bntState = 1)

```ts
emulator.eventMouse(100, 0)
    .then(() => null));
```

Allows to genenarate a mouse event
at x, y with the given buttonstate using the given device.
Where device:
0 = touch screen
1 = trackball
And buttonstate is a mask where:
0 = No buttons
1 = Left button
2 = Right button
4 = Middle button
8 = Wheel up
16 = Wheel down.
All values are integers.
Analogous to `event mouse <x> <y> <device> <buttonstate>`.

- Returns: `Promise<void>`

##### emulator.sensorStatus()

```ts
emulator.sensorStatus()
    .then((status: Record<string, "enabled" | "disabled">) => console.log(status)));
```

Lists all sensors and their status.
Analogous to `sensor status`.

- Returns: `Promise<Record<string, "enabled" | "disabled">>`

##### emulator.sensorGet(name: string)

```ts
emulator.sensorGet('temperature')
    .then((values: number[]) => console.log(values)));
```

Returns the values of a given sensor. Analogous to `sensor get <sensorname>`.

- Returns: `Promise<number[]>`

##### emulator.sensorSet(name: string, valueA: number, valueB?: number, valueC?: number)

```ts
emulator.sensorSet('temperature', 1, 0, 0)
    .then(() => null));
```

Sets the values of a given sensor. Analogous to `sensor get <sensorname> <value-a>[:<value-b>[:<value-c>]]`.

- Returns: `Promise<void>`

##### emulator.physicsRecordGt(name: string, cwd?: string)

```ts
emulator.physicsRecordGt('some-file-name')
    .then(() => null));
```

Start recording of ground truth to the given file. Analogous to `physics record-gt <filename>`.

- Returns: `Promise<void>`

##### emulator.physicsStop()

```ts
emulator.physicsStop()
    .then(() => null));
```

Stops the current recording of ground truth. Analogous to `physics stop`.

- Returns: `Promise<void>`

##### emulator.geoFix(longitude: number, latitude: number, altitude?: number, satellites?: number, velocity?: number)

```ts
emulator.geoFix(80, 90)
    .then(() => null));
```

Allows you to send a simple GPS fix to the emulated system.
The parameters are:
`<longitude>` longitude, in decimal degrees
`<latitude>` latitude, in decimal degrees
`<altitude>` optional altitude in meters
`<satellites>` number of satellites being tracked (1-12)
`<velocity>` optional velocity in knots
Analogous to `geo fix <longitude> <latitude> [<altitude> [<satellites> [<velocity>]]]`.

- Returns: `Promise<void>`

##### emulator.geoGnss(...values: string[])

```ts
emulator.geoGnss('TimeNanos', 'FullBiasNanos', 'BiasNanos')
    .then(() => null));
```

Sends a GNSS sentence to the emulated device.
`<sentence>` has fields separated by `,` and it starts with 8 fields
for clock data, 1 field for measurement count, and followed by
count \* 9 (each measurement data has 9 fields).
The parameters are:
`<longitude>` longitude, in decimal degrees
`<latitude>` latitude, in decimal degrees
`<altitude>` optional altitude in meters
`<satellites>` number of satellites being tracked (1-12)
`<velocity>` optional velocity in knots
Analogous to `geo gnss <sentence>`.

- Returns: `Promise<void>`

##### emulator.gsmList()

```ts
emulator.gsmList()
    .then((list: GsmListObject[]) => null));
```

Lists all inbound and outbound calls and their state. `GsmObject` is an object with properties `type`, `phoneNr` and `status`.
Analogous to `gsm list`.

- Returns: `Promise<GsmListObject[]>`

##### emulator.gsmCall(phoneNr: string | number)

```ts
emulator.call(123456)
    .then(() => null));
```

Allows you to simulate a new inbound call. Analogous to `gsm call <phonenumber>`.

- Returns: `Promise<void>`

##### emulator.gsmBusy(phoneNr: string | number)

```ts
emulator.gsmBusy(123456)
    .then(() => null));
```

Closes an outbound call, reporting
the remote phone as busy. Only possible if the call is `waiting`. Analogous to `gsm busy <phonenumber>`.`

- Returns: `Promise<void>`

##### emulator.gsmHold(phoneNr: string | number)

```ts
emulator.gsmHold(123456)
    .then(() => null));
```

Changes the state of a call to `held`. this is only possible
if the call in the `waiting` or `active` state. Analogous to `gsm hold <phonenumber>`.

- Returns: `Promise<void>`

##### emulator.gsmAccept(phoneNr: string | number)

```ts
emulator.gsmAccept(123456)
    .then(() => null));
```

Changes the state of a call to `active`. This is only possible
if the call is in the `waiting` or `held` state. Analogous to `gsm accept <phonenumber>`.

- Returns: `Promise<void>`

##### emulator.gsmCancel(phoneNr: string | number)

```ts
emulator.gsmCancel(123456)
    .then(() => null));
```

Allows you to simulate the end of an inbound or outbound call. Analogous to `gsm cancel <phonenumber>`.

- Returns: `Promise<void>`

##### emulator.gsmData(state: GsmState)

```ts
emulator.gsmState('home')
    .then(() => null));
```

Allows you to change the state of your GPRS connection
valid values for `<state>` are the following:

`unregistered` no network available
`home` on local network, non-roaming
`roaming` on roaming network
`searching` searching networks
`denied` emergency calls only
`off` same as 'unregistered'
`on` same as 'home'
Analogous to `gsm data <state>`.

- Returns: `Promise<void>`

##### emulator.gsmMeter(state: 'on' | 'off')

```ts
emulator.gsmMeter('on')
    .then(() => null));
```

Allows you to change the meterness of your mobile data plan.
Analogous to `gsm data <on|off>`.

- Returns: `Promise<void>`

##### emulator.gsmVoice(state: GsmState)

```ts
emulator.gsmVoice('on')
    .then(() => null));
```

Allows you to change the state of your GPRS connection.
Analogous to `gsm voice <state>`.

- Returns: `Promise<void>`

##### emulator.gsmStatus()

```ts
emulator.gsmStatus()
    .then((status: Record<string, GsmState>) => console.log(status)));
```

Displays the current state of the GSM emulation.
Analogous to `gsm status`.

- Returns: `Promise<Record<string, GsmState>>`
  c

##### emulator.gsmSignal(rssi: number, ber?: number)

```ts
emulator.gsmSignal(30, 6)
    .then(() => null));
```

Changes the reported strength and error rate on next (15s) update.
rssi range is 0..31 and 99 for `unknown`,
ber range is 0..7 percent and 99 for `unknown`.
Analogous to `gsm signal <rssi> [<ber>]`.

- Returns: `Promise<void>`

##### emulator.gsmSignalProfile(strength: 0 | 1 | 2 | 3 | 4)

```ts
emulator.gsmSignalProfile(3)
    .then(() => null));
```

Changes the reported strength on next (15s) update.
Analogous to `gsm signal-profile <strength>`.

- Returns: `Promise<void>`

##### emulator.cdmaSsource(source: 'nv' | 'ruim')

```ts
emulator.cdmaSsource('nv')
    .then(() => null));
```

Allows you to specify where to read the subscription from
nv: Read subscription from non-volatile RAM
ruim: Read subscription from RUIM
Analogous to `cdma ssource <ssource>`.

- Returns: `Promise<void>`

##### emulator.cdmaPrlVersion(version: string | number)

```ts
emulator.cdmaPrlVersion(2)
    .then(() => null));
```

Dumps the current PRL version.
Analogous to `cdma prl_version <version>`.

- Returns: `Promise<void>`

##### emulator.crash()

```ts
emulator.crash()
    .then(() => null));
```

Crash the emulator instance.
Analogous to `crash`.

- Returns: `Promise<void>`

##### emulator.crashOnExit()

```ts
emulator.crashOnExit()
    .then(() => null));
```

Simulate crash on exit for the emulator instance.
Analogous to `crash-on-exit`.

- Returns: `Promise<void>`

##### emulator.kill()

```ts
emulator.kill()
    .then(() => null));
```

Kill the emulator instance.
Analogous to `kill`.

- Returns: `Promise<void>`

##### emulator.restart()

```ts
emulator.restart()
    .then(() => null));
```

Restarts the emulator instance.
Analogous to `restart`.

- Returns: `Promise<void>`

##### emulator.networkStatus()

```ts
emulator.networkStatus()
    .then((status: Record<string, string>) => console.log(status)));
```

Dumps network status.
Analogous to `network status`.

- Returns: `Promise<Record<string, string>>`

##### emulator.networkDelay(min: number, max: number)

##### emulator.networkDelay(delay: 'gprs' | 'edge' | 'umts' | 'none' | number)

```ts
emulator.networkDelay(100 , 200)
    .then(() => null));
```

Allows you to dynamically change the latency of the emulated
network on the device.
Analogous to `network delay <latency>`.

- Returns: `Promise<void>`

##### emulator.networkCaptureStart(name: string, cwd?: string)

```ts
emulator.networkCaptureStart('some-file-name')
    .then(() => null));
```

Starts a new capture of network packets
into a specific `<file>`. This will stop any capture already in progress.
the capture file can later be analyzed by tools like WireShark. It uses
the libpcap file format.
Analogous to `network capture start <file>`.

- Returns: `Promise<void>`

##### emulator.networkCaptureStop(name: string, cwd?: string)

```ts
emulator.networkCaptureStop('some-file-name')
    .then(() => null));
```

Stops a currently running packet capture, if any.
you can start one with 'network capture start `<file>`.
Analogous to `network capture stop`.

- Returns: `Promise<void>`

##### emulator.avdStop()

```ts
emulator.avdStop()
    .then(() => null));
```

Stops the virtual device immediately.
Analogous to `avd stop`.

- Returns: `Promise<void>`

##### emulator.avdStart()

```ts
emulator.avdStart()
    .then(() => null));
```

Will start or continue the virtual device.
Analogous to `avd start`.

- Returns: `Promise<void>`

##### emulator.avdStatus()

```ts
emulator.avdStatus()
    .then((status: "running" | "stopped") => console.log(status)));
```

Will indicate whether the virtual device is running or not.
Analogous to `avd status`.

- Returns: `Promise<"running" | "stopped">`

##### emulator.avdHeartbeat()

```ts
emulator.avdHeartbeat()
    .then((heartbeat: number) => console.log(heartbeat)));
```

Will report the number of heart beats from guest system running inside this avd.
Analogous to `avd heartbeat`.

- Returns: `Promise<number>`

##### emulator.avdRewindaudio()

```ts
emulator.avdRewindaudio()
    .then(() => null));
```

Sill rewind the input of audio to beginning(applicable only to wav audio driver).
Analogous to `avd rewindaudio`.

- Returns: `Promise<void>`

##### emulator.avdName()

```ts
emulator.avdName()
    .then((name: string) => console.log(name)));
```

Will return the name of this virtual device.
Analogous to `avd name`.

- Returns: `Promise<string>`

##### emulator.avdSnapshotList()

```ts
emulator.avdSnapshotList()
    .then((list: SnapshotObject[]) => console.log(list)));
```

Will show a list of all state snapshots that can be loaded. `SnapshotObject` is an object with properties `id`, `tag`, `size`, `date` and `vmClock`.
Analogous to `avd snapshot list`.

- Returns: `Promise<SnapshotObject[]>`

##### emulator.avdSnapshotSave(name: string)

```ts
emulator.avdSnapshotSave('some-name')
    .then(() => null));
```

Will save the current (run-time) state to a snapshot with the given name.
Analogous to `avd snapshot save <name>`.

- Returns: `Promise<void>`

##### emulator.avdSnaphotLoad(name: string)

```ts
emulator.avdSnaphotLoad('some-name')
    .then(() => null));
```

Will load the state snapshot of the given name.
Analogous to `avd snapshot load <name>`.

- Returns: `Promise<void>`

##### emulator.avdSnaphotDelete(name: string)

```ts
emulator.avdSnaphotDelete('some-name')
    .then(() => null));
```

Will delete the state snapshot with the given name.
Analogous to `avd snapshot delete <name>`.

- Returns: `Promise<void>`

##### emulator.avdSnaphotRemap(autoSave: 0 | 1)

```ts
emulator.avdSnaphotRemap(1)
    .then(() => null));
```

Will activate or shut off Quickboot auto-saving.
while the emulator is running.
`<auto-save>` value of 0: deactivate auto-save
`<auto-save>` value of 1: activate auto-save

- It is required that the current loaded snapshot be the Quickboot snapshot (default_boot).
- If auto-saving is currently active and gets deactivated, a snapshot will be saved
  to establish the last state.
- If the emulator is not currently auto-saving and a remap command is issued,
  the Quickboot snapshot will be reloaded with auto-saving enabled or disabled
  according to the value of the `<auto-save>` argument.
- This allows the user to set a checkpoint in the middle of running the emulator:
  by starting the emulator with auto-save enabled, then issuing 'avd snapshot remap 0'
  to disable auto-save and thus set the checkpoint. Subsequent 'avd snapshot remap 0'
  commands will then repeatedly rewind to that checkpoint.
  Issuing 'avd snapshot remap 1' after that will rewind again but activate auOK
  Analogous to `avd snapshot remap <auto-save>`.

* Returns: `Promise<void>`

##### emulator.fingerTouch(id: number)

```ts
emulator.fingerTouch(1)
    .then(() => null));
```

Touches finger print sensor with `<fingerid>`.
Analogous to `finger touch <fingerid>`.

- Returns: `Promise<void>`

##### emulator.fingerRemove()

```ts
emulator.fingerRemove()
    .then(() => null));
```

Remove finger from the fingerprint sensor.
Analogous to `finger touch remove`.

- Returns: `Promise<void>`

##### emulator.debug(...tags: string[])

```ts
emulator.debug('radio', 'image')
    .then(() => null));
```

Controls the emulator debug output tags.
Common tag: https://developer.android.com/studio/run/emulator-commandline#common.
Analogous to `debug <tags>`.

- Returns: `Promise<void>`

##### emulator.rotate()

```ts
emulator.rotate()
    .then(() => null));
```

Rotates the screen clockwise by 90 degrees.
Analogous to `rotate`.

- Returns: `Promise<void>`

##### emulator.screenrecordStart(fileName: string)

- **options?: InstallOptions**:
  - **height?: number**
  - **width?: number**
  - **bitRate?: number**: default 4Mbps
  - **timeLimit?: boolean**: 0-180, default 180
  - **fps?: boolean**: max 60, default 24

```ts
emulator.screenrecordStart('some-file-name')
    .then(() => null));
```

Records the emulator's display to a .webm file.

- Returns: `Promise<void>`

##### emulator.screenrecordStop()

```ts
emulator.screenrecordStop()
    .then(() => null));
```

Stops the recording if one has already started.
Analogous to `screenrecord stop`.

- Returns: `Promise<void>`

##### emulator.screenrecordScreenshot(dirName: string, displayId = 0)

```ts
emulator.screenrecordScreenshot('some-dir')
    .then(() => null));
```

SetS display to take screenshot. Default is the device's main display ID = 0.
Analogous to `screenrecord screenshot --display [ID] <dirname>`.

- Returns: `Promise<void>`

##### emulator.screenrecordWebrtcStart(fps = 60)

```ts
emulator.screenrecordWebrtcStart(100)
    .then(() => null));
```

Starts the webrtc memory sharing.
Sharing will happen on only one handle and will be returned on start.
An option framerate can be provided, the default is fps=60.
Analogous to `screenrecord webrtc start <fps>`.

- Returns: `Promise<void>`

##### emulator.screenrecordWebrtcStop()

```ts
emulator.screenrecordWebrtcStop()
    .then(() => null));
```

Stops the webrtc memory sharing.
Analogous to `screenrecord webrtc stop`.

- Returns: `Promise<void>`

##### emulator.fold()

```ts
emulator.fold()
    .then(() => null));
```

Folds the device to display its smaller screen configuration (if the device is foldable and currently unfolded).

Analogous to `fold`.

- Returns: `Promise<void>`

##### emulator.unfold()

```ts
emulator.unfold()
    .then(() => null));
```

Unfolds the device to display its larger screen configuration (if the device is foldable and currently folded).

Analogous to `unfold`.

- Returns: `Promise<void>`

##### emulator.multidisplayAdd(id: number, width: number, height: number, dpi: number, flag = 0)

```ts
emulator.multidisplayAdd(1, 120, 800, 60)
    .then(() => null));
```

Adds a new or modify existing display, where:
`<display-id>` a number within [1, 10]
`<width>` display width
`<height>` display height
`<dpi>` display dpi
`<flag>` display flag, 0 for default flag

`multidisplay add 1 1200 800 240 0` will create/modify display 1 with dimension 1200x800, dpi 240 and the default flag.
Analogous to `multidisplay add <display-id>:<width>:<height>:<dpi>:<flag>`.

- Returns: `Promise<void>`

##### emulator.multidisplayDel(id: number)

```ts
emulator.multidisplayDel(1)
    .then(() => null));
```

Removes existing display.
Analogous to `multidisplay del <display-id>`.

- Returns: `Promise<void>`

##### emulator.grpc(port: number)

```ts
emulator.grpc(5889)
    .then(() => null));
```

Allows you to start the grpc endpoint at the given port.
Analogous to `grpc <port>`.

- Returns: `Promise<void>`

##### emulator.startExtendedWindow()

```ts
emulator.startExtendedWindow()
    .then(() => null));
```

Shows the extended window.
Analogous to `startExtendedWindow`.

- Returns: `Promise<void>`

##### emulator.quitExtendedWindow()

```ts
emulator.quitExtendedWindow()
    .then(() => null));
```

Quits the extended window.
Analogous to `quitExtendedWindow`.

- Returns: `Promise<void>`

##### emulator.setUiTheme(theme: 'light' | 'dark')

```ts
emulator.setUiTheme('dark')
    .then(() => null));
```

Sets emulator's UI theme to either light or dark.
Analogous to `setUiTheme <dark|light>`.

- Returns: `Promise<void>`

##### emulator.iceboxTrack(pid: number, maxSnapshots?: number)

```ts
emulator.iceboxTrack(2)
    .then(() => null));
```

Allows emulator to automatically take snapshot on uncaught exceptions, for test and debug purpose.
Analogous to `icebox track <pid> [max_snapshots]`.

- Returns: `Promise<void>`
