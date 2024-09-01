import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TwitchAuthorizationInfo } from '../../types';

const initialState: TwitchAuthorizationInfo = {
  authorized: false,
  sessionWelcome: false,
  keepAlive: false,
  nickname: '',
};

export const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    updateAuthorization: (
      state,
      action: PayloadAction<Partial<TwitchAuthorizationInfo>>,
    ) => {
      const newState = { ...state, ...action.payload };

      if (action.payload.sessionWelcome) {
        newState.authorized = true;
      }
      if (action.payload.keepAlive) {
        newState.authorized = true;
        newState.sessionWelcome = true;
      }

      return newState;
    },
  },
});

export const { updateAuthorization } = authorizationSlice.actions;

export default authorizationSlice.reducer;
