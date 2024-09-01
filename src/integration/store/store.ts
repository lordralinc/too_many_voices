import { configureStore } from '@reduxjs/toolkit';
import chatMessagesSliceReducer from '../../shared/store/slices/messages-slice';
import checkSliceReducer from '../../shared/store/slices/check-slice';

export const store = configureStore({
  reducer: {
    chatMessages: chatMessagesSliceReducer,
    check: checkSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
