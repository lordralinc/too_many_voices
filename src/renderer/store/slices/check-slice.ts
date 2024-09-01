import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IPCCheckCongratulationsEvent,
  IPCCheckDisappiriensEvent,
  IPCCheckEndEvent,
  IPCCheckRunEvent,
  IPCCheckTickEvent,
} from '../../../main/ipc';

export type CurrentCheckState =
  | { type: 'none'; data: undefined }
  | {
      type: 'run';
      data: IPCCheckRunEvent;
    }
  | {
      type: 'tick';
      data: IPCCheckTickEvent;
    }
  | {
      type: 'end';
      data: IPCCheckEndEvent;
    }
  | {
      type: 'congratulations';
      data: IPCCheckCongratulationsEvent;
    }
  | {
      type: 'disappiriens';
      data: IPCCheckDisappiriensEvent;
    };

const initialState = { type: 'none', data: undefined } as CurrentCheckState;

export const ckeckSlice = createSlice({
  name: 'check',
  initialState,
  reducers: {
    setRun(state, action: PayloadAction<IPCCheckRunEvent>) {
      state.type = 'run';
      state.data = action.payload;
    },
    setTick(state, action: PayloadAction<IPCCheckTickEvent>) {
      state.type = 'tick';
      state.data = action.payload;
    },
    setEnd(state, action: PayloadAction<IPCCheckEndEvent>) {
      state.type = 'end';
      state.data = action.payload;
    },
    setCongratulations(
      state,
      action: PayloadAction<IPCCheckCongratulationsEvent>,
    ) {
      state.type = 'congratulations';
      state.data = action.payload;
    },
    setDisappiriens(state, action: PayloadAction<IPCCheckDisappiriensEvent>) {
      state.type = 'disappiriens';
      state.data = action.payload;
    },
  },
});

export const { setRun, setTick, setEnd, setCongratulations, setDisappiriens } =
  ckeckSlice.actions;

export default ckeckSlice.reducer;
