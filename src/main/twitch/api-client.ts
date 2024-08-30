import WebSocket from 'ws';
import {
  IGetAuth,
  TwitchDeviceResponse,
  TwitchDeviceTokenResponse,
} from './types';

export default class APIClient {
  private token: string;

  protected EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';

  protected SCOPES = ['user:bot', 'user:read:chat', 'user:write:chat'];

  constructor(private clientId: string) {
    this.clientId = clientId;
    this.token = '';
  }

  setToken(token: string) {
    this.token = token;
  }

  async getAuth(): Promise<IGetAuth> {
    if (!this.token) throw new Error('No token');
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      method: 'GET',
      headers: {
        Authorization: `OAuth ${this.token}`,
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data);
    }

    return (await response.json()) as IGetAuth;
  }

  async sendChatMessage(
    message: string,
    broadcasterId: string,
    senderId: string,
  ) {
    if (!this.token) throw new Error('No token');
    const response = await fetch('https://api.twitch.tv/helix/chat/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Client-Id': this.clientId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // eslint-disable-next-line camelcase
        broadcaster_id: broadcasterId,
        // eslint-disable-next-line camelcase
        sender_id: senderId,
        message,
      }),
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data);
    }
  }

  async diviceLogin(): Promise<TwitchDeviceResponse> {
    const connectFormData = new FormData();
    connectFormData.append('client_id', this.clientId);
    connectFormData.append('scopes', this.SCOPES.join(' '));
    const response = await fetch('https://id.twitch.tv/oauth2/device', {
      method: 'POST',
      body: connectFormData,
    });
    return (await response.json()) as TwitchDeviceResponse;
  }

  waitForDeviceLogin(
    data: TwitchDeviceResponse,
  ): Promise<TwitchDeviceTokenResponse> {
    const getTokenFormData = new FormData();
    getTokenFormData.append('client_id', this.clientId);
    getTokenFormData.append('scopes', this.SCOPES.join(' '));
    getTokenFormData.append('device_code', data.device_code);
    getTokenFormData.append(
      'grant_type',
      'urn:ietf:params:oauth:grant-type:device_code',
    );

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        fetch('https://id.twitch.tv/oauth2/token', {
          method: 'POST',
          body: getTokenFormData,
        })
          .then((resp) => resp.json())
          .then((resp: TwitchDeviceTokenResponse) => {
            if (resp.access_token) {
              resolve(resp);
              clearInterval(interval);
            }
            return resp;
          })
          .catch(reject);
      }, 3_000);
    });
  }

  async refreshTwitchToken(
    twitchRefreshToken: string,
  ): Promise<TwitchDeviceTokenResponse> {
    const refreshData = new FormData();
    refreshData.append('client_id', this.clientId);
    refreshData.append('grant_type', 'refresh_token');
    refreshData.append('refresh_token', twitchRefreshToken);
    const data = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: refreshData,
    });
    return data.json();
  }

  async registerEventSubListeners(
    sessionId: string,
    broadcasterUserId: string,
    userId: string,
  ) {
    if (!this.token) throw new Error('No token available');
    const response = await fetch(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'channel.chat.message',
          version: '1',
          condition: {
            broadcaster_user_id: broadcasterUserId,
            user_id: userId,
          },
          transport: {
            method: 'websocket',
            session_id: sessionId,
          },
        }),
      },
    );

    if (response.status !== 202) {
      const data = await response.json();
      throw new Error(data);
    }
    return response.json();
  }

  websocket() {
    if (!this.token) throw new Error('No token available');
    return new WebSocket(this.EVENTSUB_WEBSOCKET_URL);
  }
}
