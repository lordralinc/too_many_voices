import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAuthorization } from '../../store/selectors';
import { updateAuthorization } from '../../store/slices/authorization-slice';
import { IPCTwitchSessionWelcomeEvent } from '../../../main/ipc';

export default function TwitchAuthorizationComponent() {
  const authorizeTwitch = () => {
    window.electron.ipcRenderer.sendMessage('twitch:authorize-request');
  };

  const info = useAppSelector(selectAuthorization);
  const dispatch = useAppDispatch();

  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('twitch:set-token', () => {
        dispatch(updateAuthorization({ authorized: true }));
      }),
    [dispatch],
  );

  React.useEffect(
    () =>
      window.electron.ipcRenderer.on(
        'twitch:session-welcome',
        (it: IPCTwitchSessionWelcomeEvent) => {
          dispatch(
            updateAuthorization({
              sessionWelcome: true,
              nickname: it.nickname as string,
            }),
          );
        },
      ),
    [dispatch],
  );
  React.useEffect(() => {
    let keepAlive: any;
    window.electron.ipcRenderer.on(
      'twitch:session-keep-alive',
      (it: IPCTwitchSessionWelcomeEvent) => {
        clearTimeout(keepAlive);
        keepAlive = setTimeout(
          () =>
            dispatch(
              updateAuthorization({ authorized: true, keepAlive: false }),
            ),
          11_000,
        );
        dispatch(
          updateAuthorization({
            keepAlive: true,
            nickname: it.nickname as string,
          }),
        );
      },
    );
  }, [dispatch]);

  return (
    <>
      <h5 className="text-center">Авторизация</h5>
      <div className="col-12">
        {info.sessionWelcome ? (
          <div className="d-flex align-content-center justify-content-center">
            Вы успешно авторизовались как {info.nickname}
          </div>
        ) : info.authorized ? (
          <div className="d-flex align-content-center justify-content-center">
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              style={{ margin: '10px' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            Подключение к чату Twitch{' '}
          </div>
        ) : (
          'Вы еще не авторизовались'
        )}
      </div>
      {!info.authorized && (
        <div className="col-12">
          <button
            className="btn btn-primary w-100"
            type="button"
            onClick={authorizeTwitch}
          >
            Авторизоваться в Twitch
          </button>
        </div>
      )}
    </>
  );
}
