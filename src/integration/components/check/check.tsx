import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectCheck } from '../../store/selectors';
import { IPCCheckRunEvent } from '../../../main/ipc';
import { SettingsCubesType } from '../../../renderer/types';
import ProgressBar from './progress-bar';

export function Session({ session }: { session: IPCCheckRunEvent }) {
  return (
    <div>
      <h2>{session.title}</h2>
      {session.checkType === 'number' ? (
        <p>Напиши в чате число от 1 до {session.value as number}</p>
      ) : (
        <p>
          Напиши в чате команду <strong>!roll</strong> (сложность{' '}
          {(session.value as SettingsCubesType).value})
        </p>
      )}
    </div>
  );
}

export default function Check() {
  const currentData = useAppSelector(selectCheck);

  if (currentData.type === 'none') {
    return undefined;
  }
  if (currentData.type === 'run') {
    return <Session session={currentData.data} />;
  }

  if (currentData.type === 'congratulations') {
    return undefined;
  }
  if (currentData.type === 'disappiriens') {
    return undefined;
  }

  return (
    <>
      <Session session={currentData.data.session} />
      {currentData.type === 'tick' && (
        <>
          <div className="d-flex">
            <ProgressBar
              current={currentData.data.delay}
              max={currentData.data.session.delay}
              width={300}
            />
            <span>{currentData.data.delay} сек.</span>
          </div>
          {currentData.data.session.checkType === 'cubes' && (
            <div className="d-flex">
              <ProgressBar
                current={currentData.data.currentPercent!}
                max={
                  (currentData.data.session.value as SettingsCubesType).percent
                }
                width={300}
              />
              <span>{currentData.data.currentPercent}%</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
