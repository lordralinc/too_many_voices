import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectChatMessages } from '../../store/selectors';
import {
  addNaturalMessage,
  addGeneratedMessage,
} from '../../../shared/store/slices/messages-slice';
import { IPCTwitchMessageEvent } from '../../../main/ipc';

export default function TwitchChatComponent() {
  const messages = useAppSelector(selectChatMessages);
  const dispatch = useAppDispatch();

  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('twitch:message-without-info', (it) => {
        const message = it as IPCTwitchMessageEvent;
        dispatch(addNaturalMessage(message));
      }),
    [dispatch],
  );

  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('twitch:message', (it) => {
        const message = it as IPCTwitchMessageEvent;
        dispatch(addGeneratedMessage(message));
      }),
    [dispatch],
  );
  return (
    <>
      <h5 className="text-center">Чат</h5>
      {messages.map((it) => {
        return (
          <div key={`${it.id}_${it.type}_${it.nickname}`}>
            <strong style={{ color: it.color }}>
              {it.type === 'natural' ? (
                <i
                  className="bi bi-pencil-fill"
                  style={{ marginRight: '5px' }}
                />
              ) : (
                <i
                  className="bi bi-braces-asterisk"
                  style={{ marginRight: '5px' }}
                />
              )}
              {it.nickname}:{' '}
            </strong>
            <span>{it.value}</span>
          </div>
        );
      })}
    </>
  );
}
