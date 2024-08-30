import { ipcMain } from 'electron';
import {
  CheckDifficulty,
  CheckType,
  SettingsCubesType,
} from '../renderer/types';
import { Logger } from './util';

export const IPCChannels = {
  CheckRun: 'check:run',
  CheckTick: 'check:tick',
  CheckStore: 'check:store',
  CheckValue: 'check:value',
  CheckEnd: 'check:end',
  CheckCongratulations: 'check:congratulations',
  CheckDisappiriens: 'check:disappiriens',
  TwitchMessage: 'twitch:message',
  TwitchAuthorizeRequest: 'twitch:authorize-request',
  TwitchSetToken: 'twitch:set-token',
} as const;
export type IPCKey = (typeof IPCChannels)[keyof typeof IPCChannels];

export interface IPCCheckRunEvent {
  title: string;
  checkType: CheckType;
  checkDifficulty: CheckDifficulty;
  delay: number;
  value: number | SettingsCubesType;
  currentValue: number | undefined | null;
}
export interface IPCCheckTickEvent {
  session: IPCCheckRunEvent;
  data: { [key: string]: number[] };
  delay: number;
  currentPercent?: number;
}
export interface IPCCheckStoreEvent {
  nickname: string;
  value: number[];
}
export interface IPCCheckValueEvent {
  nickname: string;
  value: number;
}
export interface IPCCheckEndEvent {
  session: IPCCheckRunEvent;
  data: { [key: string]: number[] };
}
export interface IPCCheckCongratulationsEvent {
  session: IPCCheckRunEvent;
  data: { [key: string]: number[] };

  nickname?: string;
  tryCount?: number;

  criticalValues?: { win: number; lose: number };
  winPercent?: number;
}
export interface IPCCheckDisappiriensEvent {
  session: IPCCheckRunEvent;
  data: { [key: string]: number[] };
  tryCount?: number;

  criticalValues?: { win: number; lose: number };
  winPercent?: number;
}
export interface IPCTwitchMessageEvent {
  nickname: string;
  value: string;
}

export type IPCCallback<T = undefined> = (data: T) => void;
export type IPCOnResponse = () => void;

class IPC {
  // region LISTENERS
  on(
    channel: 'check:run',
    callback: IPCCallback<IPCCheckRunEvent>,
  ): IPCOnResponse;

  on(
    channel: 'check:tick',
    callback: IPCCallback<IPCCheckTickEvent>,
  ): IPCOnResponse;

  on(
    channel: 'check:store',
    callback: IPCCallback<IPCCheckStoreEvent>,
  ): IPCOnResponse;

  on(
    channel: 'check:value',
    callback: IPCCallback<IPCCheckValueEvent>,
  ): IPCOnResponse;

  on(
    channel: 'check:end',
    callback: IPCCallback<IPCCheckEndEvent>,
  ): IPCOnResponse;

  on(
    channel: 'check:congratulations',
    callback: IPCCallback<IPCCheckCongratulationsEvent>,
  ): IPCOnResponse;

  on(
    channel: 'check:disappiriens',
    callback: IPCCallback<IPCCheckDisappiriensEvent>,
  ): IPCOnResponse;

  on(
    channel: 'twitch:message',
    callback: IPCCallback<IPCTwitchMessageEvent>,
  ): IPCOnResponse;

  on(channel: 'twitch:set-token', callback: IPCCallback): IPCOnResponse;

  on(channel: 'twitch:authorize-request', callback: IPCCallback): IPCOnResponse;

  on(channel: IPCKey, callback: IPCCallback<unknown>): IPCOnResponse {
    const listener = (...args: unknown[]) => {
      Logger.debug('IPC', 'New event', channel, ...args);
      if (args.length === 1) {
        callback(args[0]);
      } else {
        callback(args[1]);
      }
    };
    ipcMain.on(channel, listener);
    return () => {
      ipcMain.off(channel, listener);
    };
  }

  onAll(callback: (channel: IPCKey, data: unknown) => void): IPCOnResponse {
    const offItems = Object.keys(IPCChannels).map((key) =>
      this.on(IPCChannels[key], (data) => callback(IPCChannels[key], data)),
    );
    return () => {
      offItems.forEach((off) => off());
    };
  }
  // endregion LISTENERS

  emit(channel: 'check:run', data: IPCCheckRunEvent): void;

  emit(channel: 'check:tick', data: IPCCheckTickEvent): void;

  emit(channel: 'check:store', data: IPCCheckStoreEvent): void;

  emit(channel: 'check:value', data: IPCCheckValueEvent): void;

  emit(channel: 'check:end', data: IPCCheckEndEvent): void;

  emit(
    channel: 'check:congratulations',
    data: IPCCheckCongratulationsEvent,
  ): void;

  emit(channel: 'check:disappiriens', data: IPCCheckDisappiriensEvent): void;

  emit(channel: 'twitch:message', data: IPCTwitchMessageEvent): void;

  emit(channel: 'twitch:set-token', data: undefined): void;

  emit(channel: 'twitch:authorize-request', data: undefined): void;

  emit(channel: string, data: unknown) {
    Logger.debug('IPC', 'Emmit data', channel, data);
    if (data) ipcMain.emit(channel, data);
    else ipcMain.emit(channel);
  }
}

export default new IPC();
