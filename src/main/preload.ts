// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IPCKey } from './ipc';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: IPCKey, ...args: any[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: IPCKey, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) => {
        console.log('New event', _event, args);
        func(...args);
      };
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: IPCKey, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
