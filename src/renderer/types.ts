export type CheckType = 'number' | 'cubes';
export type CheckDifficulty = 'easy2' | 'easy' | 'medium' | 'hard' | 'hard2';
export const CheckTypeList: CheckType[] = ['number', 'cubes'];
export const CheckDifficultyList: CheckDifficulty[] = [
  'easy2',
  'easy',
  'medium',
  'hard',
  'hard2',
];
export const CheckDifficultyToName: { [key in CheckDifficulty]: string } = {
  easy2: 'Легче легкого',
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
  hard2: 'Невозможно',
};
export type Cubes = '4' | '6' | '8' | '10' | '12' | '20' | '100';
export const CubesList = ['4', '6', '8', '10', '12', '20', '100'];
export interface SettingsCubesType {
  cubeCount: number;
  useCube: Cubes;
  percent: number;
  value: number;
}
export interface SettingsTDItem {
  delay: number;
  value: number | SettingsCubesType;
}

export type SettingsDItem = { [key in CheckDifficulty]: SettingsTDItem };

export type Settings = {
  [key in CheckType]: SettingsDItem;
};

export interface TwitchAuthorizationInfo {
  authorized: boolean;
  sessionWelcome: boolean;
  keepAlive: boolean;
  nickname: string;
}
