import { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  number: {
    easy2: { delay: 10, value: 10 },
    easy: { delay: 10, value: 50 },
    medium: { delay: 10, value: 100 },
    hard: { delay: 10, value: 200 },
    hard2: { delay: 10, value: 300 },
  },
  cubes: {
    easy2: {
      delay: 10,
      value: { cubeCount: 1, useCube: '20', percent: 25, value: 5 },
    },
    easy: {
      delay: 10,
      value: { cubeCount: 1, useCube: '20', percent: 25, value: 7 },
    },
    medium: {
      delay: 10,
      value: { cubeCount: 1, useCube: '20', percent: 50, value: 13 },
    },
    hard: {
      delay: 10,
      value: { cubeCount: 1, useCube: '20', percent: 50, value: 15 },
    },
    hard2: {
      delay: 10,
      value: { cubeCount: 1, useCube: '20', percent: 75, value: 18 },
    },
  },
};

export function loadSettings(): Settings {
  if (localStorage.getItem('settings')) {
    return JSON.parse(localStorage.getItem('settings')!) as Settings;
  }
  localStorage.setItem('settings', JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}
