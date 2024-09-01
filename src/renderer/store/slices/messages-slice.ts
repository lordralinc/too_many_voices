import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPCTwitchMessageEvent } from '../../../main/ipc';

export interface IPCTwitchMessageEventWithType extends IPCTwitchMessageEvent {
  type: 'generated' | 'natural';
}
export interface MessagesState {
  values: IPCTwitchMessageEventWithType[];
}

const initialState = { values: [] } as MessagesState;
const LIMIT = 11;

export const messagesSlice = createSlice({
  name: 'chatMessages',
  initialState,
  reducers: {
    addGeneratedMessage: (
      state,
      action: PayloadAction<IPCTwitchMessageEvent>,
    ) => {
      const newItems: IPCTwitchMessageEventWithType[] = [
        ...state.values,
        { ...action.payload, type: 'generated' },
      ];
      if (newItems.length > LIMIT) {
        newItems.shift();
      }
      state.values = newItems;
    },
    addNaturalMessage: (
      state,
      action: PayloadAction<IPCTwitchMessageEvent>,
    ) => {
      const newItems: IPCTwitchMessageEventWithType[] = [
        ...state.values,
        { ...action.payload, type: 'natural' },
      ];
      if (newItems.length > LIMIT) {
        newItems.shift();
      }
      state.values = newItems;
    },
  },
});

export const { addGeneratedMessage, addNaturalMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
