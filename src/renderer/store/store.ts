import { configureStore } from '@reduxjs/toolkit';
import settingsSliceReducer from './slices/settings-slice';
import chatMessagesSliceReducer from './slices/messages-slice';
import authorizationSliceReducer from './slices/authorization-slice';
import checkSliceReducer from './slices/check-slice';

export const store = configureStore({
  reducer: {
    settings: settingsSliceReducer,
    chatMessages: chatMessagesSliceReducer,
    authorization: authorizationSliceReducer,
    check: checkSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
