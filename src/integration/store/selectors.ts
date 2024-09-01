import { RootState } from './store';

export const selectChatMessages = (state: RootState) =>
  state.chatMessages.values;
export const selectGeneratedMessages = (state: RootState) =>
  state.chatMessages.values.filter((message) => message.type === 'generated');
export const selectCheck = (state: RootState) => state.check;
export const selectShowScreen = (state: RootState) => {
  const { type } = selectCheck(state);
  return {
    showChat: ['run', 'tick', 'end'].includes(type),
    showCheck: ['run', 'tick', 'end'].includes(type),
    showCongratulations: type === 'congratulations',
    showDisappiriens: type === 'disappiriens',
  };
};
