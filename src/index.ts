export { default as EmulatorClient } from './client';
export { default as Parser } from './parser';

export type SimpleType = string | boolean | number | null | undefined;
export function stringToType(value: string): SimpleType {
    const num = Number(value);
    if (isNaN(num) || value === '') {
        switch (value) {
            case '':
                return undefined;
            case 'true':
                return true;
            case 'false':
                return false;
            case 'null':
                return null;
            default:
                return value
        }
    }
    else {
        return num;
    }
}

export type PowerStatus = 'unknown' | 'charging' | 'discharging' | 'not-charging' | 'full';

export type PowerDisplay = {
    ac: 'online' | 'offline';
    status: string;
    present: boolean;
    health: string;
    capacity: number;
}

export type NetProtocol = 'tcp' | 'udp';
export type RedirObject = {
    protocol: NetProtocol;
    hostPort: number;
    guestPort: number;
}
export type EventType = 'EV_SYN' | 'EV_KEY' | 'EV_REL' | 'EV_ABS' | 'EV_MSC' | 'EV_SW' | 'EV_LED' | 'EV_SND' | 'EV_REP' | 'EV_FF' | 'EV_PWR' | 'EV_FF_STATUS' | 'EV_MAX';

export type GsmListObject = {
    type: 'outbound' | 'inbound',
    phoneNr: string,
    status: 'active' | 'incoming' | 'held' | 'ringing' | 'waiting'
};


export type GsmState = 'unregistered' | 'home' | 'roaming' | 'searching' | 'denied' | 'off' | 'on';
export type SnapshotObject = {
    id?: number,
    tag: string;
    size: string;
    date: Date;
    vmClock: string;
}

export type ScreenRecordOptions = {
    width?: number;
    height?: number;
    bitRate?: number;
    timeLimit?: number;
    fsp?: number;
}

export const EmulatorPorts = Array.from(Array(32).keys()).map((value, index) => {
    return index + 5554;
});
