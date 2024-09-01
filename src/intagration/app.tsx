import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import React from 'react';
import WebScoketEmiter from './websocket';
import { IPCCheckRunEvent, IPCTwitchMessageEvent } from '../main/ipc';
import { IPCTwitchMessageEventWithId } from './types';
import makeId from './utils';

export default function App() {
  const [chatMessages, setChatMessages] = React.useState<
    IPCTwitchMessageEventWithId[]
  >([]);
  const [currentSession, setCurrentSession] = React.useState<
    IPCCheckRunEvent | undefined
  >();

  React.useEffect(() => {
    const websocketEmmiter = new WebScoketEmiter();

    websocketEmmiter.twitchMessage.on((it) =>
      setChatMessages((messages) => {
        return [...messages, { ...it, id: makeId(16) }];
      }),
    );

    websocketEmmiter.checkStart.on((it) => setCurrentSession(it));
    websocketEmmiter.checkTick.on((it) => setCurrentSession(it.session));
    websocketEmmiter.checkEnd.on((it) => setCurrentSession(it.session));

    return () => websocketEmmiter.close();
  }, []);

  return (
    <>
      <div>{currentSession ? JSON.stringify(currentSession) : ''}</div>
      <div>{currentSession ? JSON.stringify(currentSession) : ''}</div>
      <div>{currentSession ? JSON.stringify(currentSession) : ''}</div>
    </>
  );
}
