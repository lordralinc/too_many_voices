import {
  CheckDifficulty,
  CheckType,
  SettingsCubesType,
} from '../renderer/types';

export interface TwitchDeviceResponse {
  device_code: string;
  expires_in: number;
  interval: number;
  user_code: string;
  verification_uri: string;
}
export interface TwitchDeviceTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string[];
  token_type?: string;

  status?: number;
  message?: string;
}

export interface RunSessionRequest {
  title: string;
  checkType: CheckType;
  checkDifficulty: CheckDifficulty;
  delay: number;
  value: number | SettingsCubesType;
  currentValue: number | undefined | null;
}
