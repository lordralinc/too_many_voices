import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadSettings } from '../../utils';
import { Settings } from '../../types';

const initialState = loadSettings();

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Settings>) => {
      localStorage.setItem('settings', JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
