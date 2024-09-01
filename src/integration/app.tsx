import './style.css';
import React from 'react';
import Chat from './components/chat';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectCheck, selectShowScreen } from './store/selectors';
import Check from './components/check/check';
import WebScoketEmiter from './websocket';
import {
  setCongratulations,
  setDisappiriens,
  setEnd,
  setNone,
  setRun,
  setTick,
} from '../shared/store/slices/check-slice';
import { addGeneratedMessage } from '../shared/store/slices/messages-slice';
import Congratulations from './components/congratulations';
import Disappiriens from './components/disappiriens';

export default function App() {
  const currentSession = useAppSelector(selectCheck);
  const showScreen = useAppSelector(selectShowScreen);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const websocket = new WebScoketEmiter();

    websocket.checkStart.on((it) => dispatch(setRun(it)));
    websocket.checkTick.on((it) => dispatch(setTick(it)));
    websocket.checkEnd.on((it) => dispatch(setEnd(it)));
    websocket.checkDisappiriens.on((it) => {
      dispatch(setDisappiriens(it));
      setTimeout(() => dispatch(setNone()), 10_000);
    });
    websocket.checkCongratulations.on((it) => {
      dispatch(setCongratulations(it));
      setTimeout(() => dispatch(setNone()), 10_000);
    });
    websocket.twitchMessage.on((it) => dispatch(addGeneratedMessage(it)));

    return () => websocket.close();
  }, [dispatch]);

  if (currentSession.type === 'none') {
    return undefined;
  }
  return (
    <div className="container-fluid d-flex">
      {showScreen.showCheck && (
        <div style={{ width: '400px', height: '300px' }}>
          <Check />
        </div>
      )}
      {showScreen.showChat && (
        <div style={{ width: '400px', height: '300px' }}>
          <h2 className="text-center">Чат</h2>
          <Chat />
        </div>
      )}
      {showScreen.showCongratulations && <Congratulations />}
      {showScreen.showDisappiriens && <Disappiriens />}
    </div>
  );
}
