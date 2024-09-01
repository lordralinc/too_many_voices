import { IPCTwitchMessageEvent } from '../main/ipc';

export interface IPCTwitchMessageEventWithId extends IPCTwitchMessageEvent {
  id: string;
}
