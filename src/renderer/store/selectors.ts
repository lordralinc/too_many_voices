import { RootState } from './store';

export const selectSettings = (state: RootState) => state.settings;
export const selectChatMessages = (state: RootState) =>
  state.chatMessages.values;
export const selectAuthorization = (state: RootState) => state.authorization;
export const selectCheck = (state: RootState) => state.check;
