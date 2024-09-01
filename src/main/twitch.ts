import fs from 'fs';
import path from 'node:path';
import { TWITCH_CLIENT_ID } from './const';
import APIClient from './twitch/api-client';
import {
  TwitchWebsocketEvent,
  TwitchWebsocketEventMessage,
  TwitchWebsocketEventSession,
} from './twitch/types';
import RollSession from './roll-session';
import { SettingsCubesType } from '../renderer/types';
import { getRandomInt } from '../renderer/utils';
import { Logger } from './util';
import ipc, { IPCChannels } from './ipc';

const configPath = path.join(
  process.env.APPDATA ||
    (process.platform === 'darwin'
      ? `${process.env.HOME}/Library/Preferences`
      : `${process.env.HOME}/.local/share`),
  'too-many-voices.json',
);

if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({}));
}

interface Config {
  twitchToken?: string;
  twitchRefreshToken?: string;
  twitchTokenExpires?: number;
}
export function setConfig(config: Config): void {
  Logger.debug(
    'CONFIG',
    'Write config',
    Logger.hideData(config, ['twitchRefreshToken', 'twitchToken']),
  );
  fs.writeFileSync(configPath, JSON.stringify(config));
}

export function getConfig(): Config {
  const file = fs.readFileSync(configPath);
  const data = JSON.parse(file.toString()) as Config;

  if (data.twitchTokenExpires) {
    if (data.twitchTokenExpires < Date.now()) {
      data.twitchToken = undefined;
      data.twitchTokenExpires = undefined;
      setConfig(data);
    }
  }
  Logger.debug(
    'CONFIG',
    'Get config',
    Logger.hideData(data, ['twitchRefreshToken', 'twitchToken']),
  );
  return data;
}

export async function subscribeToChat() {
  const cfg = getConfig();

  let currentSession: RollSession | null = null;

  ipc.on(IPCChannels.CheckRun, (data) => {
    currentSession = new RollSession(data);
    currentSession.listen();
  });
  ipc.on(IPCChannels.CheckEnd, () => {
    currentSession = null;
  });
  const apiClient = new APIClient(TWITCH_CLIENT_ID);
  apiClient.setToken(cfg.twitchToken!);
  const authData = await apiClient.getAuth();
  const ws = apiClient.websocket();
  ws.on('message', (msg: Buffer) => {
    const event: TwitchWebsocketEvent = JSON.parse(msg.toString());
    Logger.debug('TWITCH', `New event ${event.metadata.message_type}`, event);
    if (event.metadata.message_type === 'session_welcome') {
      const sessionId = (
        event as TwitchWebsocketEvent<TwitchWebsocketEventSession>
      ).payload.session.id;
      apiClient.registerEventSubListeners(
        sessionId,
        authData.user_id,
        authData.user_id,
      );
      apiClient.sendChatMessage(
        'TMV подключен к чату. GL HF',
        authData.user_id,
        authData.user_id,
      );
      ipc.emit(IPCChannels.TwitchSessionWelcome, { nickname: authData.login });
    }

    if (event.metadata.message_type === 'session_keepalive') {
      ipc.emit(IPCChannels.TwitchSessionKeepAlive, {
        nickname: authData.login,
      });
    }

    if (event.metadata.subscription_type === 'channel.chat.message') {
      const message =
        event as TwitchWebsocketEvent<TwitchWebsocketEventMessage>;
      ipc.emit(IPCChannels.TwitchMessageWithoutInfo, {
        nickname: message.payload.event.chatter_user_name,
        value: message.payload.event.message.text,
        color: message.payload.event.color,
        id: message.payload.event.message_id,
      });
      if (currentSession) {
        const session = currentSession as RollSession;
        if (session.initSession.checkType === 'number') {
          try {
            const value = parseInt(message.payload.event.message.text, 10);
            if (value > 1 && value <= (session.initSession.value as number)) {
              // @ts-ignore
              ipc.emit(IPCChannels.TwitchMessage, {
                nickname: message.payload.event.chatter_user_name,
                value,
                color: message.payload.event.color,
                id: message.payload.event.message_id,
              });
              ipc.emit(IPCChannels.CheckValue, {
                nickname: message.payload.event.chatter_user_name,
                value,
              });
            }
          } catch (err) {
            /* empty */
          }
        }
        if (session.initSession.checkType === 'cubes') {
          if (
            message.payload.event.message.text.toLowerCase().startsWith('!roll')
          ) {
            if (
              Object.keys(session.dataContent).includes(
                message.payload.event.chatter_user_name,
              )
            ) {
              return;
            }

            const v = session.initSession.value as SettingsCubesType;
            const max = parseInt(v.useCube, 10);
            const values = [];

            for (let index = 0; index < v.cubeCount; index += 1) {
              values.push(getRandomInt(1, max));
            }
            ipc.emit(IPCChannels.TwitchMessage, {
              nickname: message.payload.event.chatter_user_name,
              value: `${v.cubeCount}d${v.useCube} [${values.join(', ')}] = ${values.reduce((p, c) => p + c)}`,
              color: message.payload.event.color,
              id: message.payload.event.message_id,
            });
            ipc.emit(IPCChannels.CheckStore, {
              nickname: message.payload.event.chatter_user_name,
              value: values,
            });
          }
        }
      }
    }
  });
  Logger.debug('TWITCH', 'Subscribe to twitch websocket');
}
