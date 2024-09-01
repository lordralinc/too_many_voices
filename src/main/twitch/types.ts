export interface IGetAuth {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: string;
  expires_in: number;
}
export interface TwitchDeviceResponse {
  device_code: string;
  expires_in: number;
  interval: number;
  user_code: string;
  verification_uri: string;
}
export interface TwitchDeviceTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export interface TwitchWebsocketEventMetadata {
  message_id: string;
  message_type: string;
  subscription_type?: string;
  message_timestamp: string;
}

export interface TwitchWebsocketEventSession {
  session: {
    id: string;
    status: string;
    connected_at: string;
    keepalive_timeout_seconds: number;
    reconnect_url: string | null;
    recovery_url: string | null;
  };
}

export interface TwitchWebsocketEvent<Payload = any> {
  metadata: TwitchWebsocketEventMetadata;
  payload: Payload;
}

export interface TwitchWebsocketEventMessage {
  event: {
    message_id: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    chatter_user_login: string;
    chatter_user_name: string;
    message: { text: string };
    color: string;
  };
}
