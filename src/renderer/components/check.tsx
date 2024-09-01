import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCheck } from '../store/selectors';
import {
  IPCCheckCongratulationsEvent,
  IPCCheckDisappiriensEvent,
  IPCCheckEndEvent,
  IPCCheckRunEvent,
  IPCCheckTickEvent,
} from '../../main/ipc';
import {
  setCongratulations,
  setDisappiriens,
  setEnd,
  setRun,
  setTick,
} from '../../shared/store/slices/check-slice';
import { CheckDifficultyToName, SettingsCubesType } from '../types';
import { getPlural } from '../../shared/utils';

export function NumberSessionInfo({
  value,
  currentValue,
}: {
  value: number;
  currentValue: number;
}) {
  return (
    <>
      <div className="info-row">
        <strong>Сложность:</strong>
        <span>1-{value}</span>
      </div>
      <div className="info-row">
        <strong>Загаданное число:</strong>
        <span>{currentValue}</span>
      </div>
    </>
  );
}
export function CubesSessionInfo({ value }: { value: SettingsCubesType }) {
  return (
    <>
      <div className="info-row">
        <strong>Кости:</strong>
        <span>
          {value.cubeCount}d{value.useCube}
        </span>
      </div>
      <div className="info-row">
        <strong>Сложность броска:</strong>
        <span>{value.value}</span>
      </div>
      <div className="info-row">
        <strong>Процент, для прохождения проверки:</strong>
        <span>{value.percent}%</span>
      </div>
    </>
  );
}
export function SessionInfo({ data }: { data: IPCCheckRunEvent }) {
  return (
    <div className="info-row-container">
      <div className="info-row">
        <strong>Заголовок:</strong>
        <span>{data.title}</span>
      </div>
      <div className="info-row">
        <strong>Тип проверки:</strong>
        <span>
          {data.checkType === 'number' ? 'Угадай число' : 'Брось кубы'}
        </span>
      </div>
      <div className="info-row">
        <strong>Сложность:</strong>
        <span>{CheckDifficultyToName[data.checkDifficulty]}</span>
      </div>
      <div className="info-row">
        <strong>Задержка:</strong>
        <span>{data.delay}</span>
      </div>
      {data.checkType === 'number' ? (
        <NumberSessionInfo
          value={data.value as number}
          currentValue={data.currentValue as number}
        />
      ) : (
        <CubesSessionInfo value={data.value as SettingsCubesType} />
      )}
    </div>
  );
}
export function CheckTickComponent({ data }: { data: IPCCheckTickEvent }) {
  return (
    <>
      <div className="col-12">
        <SessionInfo data={data.session} />
      </div>
      <div className="col-12">
        <div className="info-row-container">
          <div className="info-row">
            <strong>Прогресс</strong>
            <span>
              {data.delay}/{data.session.delay} сек.
            </span>
          </div>
          {data.session.checkType === 'cubes' && (
            <div className="info-row">
              <strong>Процент прошедших проверку</strong>
              <span>
                {data.currentPercent}/
                {(data.session.value as SettingsCubesType).percent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export function CheckEndComponent({ data }: { data: IPCCheckEndEvent }) {
  return (
    <>
      <div className="col-12">
        <SessionInfo data={data.session} />
      </div>
      <div className="col-12">
        <div className="info-row-container">
          <div className="info-row">
            <strong>Прогресс:</strong>
            <span>закончена</span>
          </div>
        </div>
      </div>
    </>
  );
}
export function CheckCongratulationsComponent({
  data,
}: {
  data: IPCCheckCongratulationsEvent;
}) {
  return (
    <>
      <div className="col-12">
        <SessionInfo data={data.session} />
      </div>
      <div className="col-12">
        <div className="info-row-container">
          <div className="info-row">
            <strong>Прогресс:</strong>
            <span>закончена</span>
          </div>
          <div className="info-row">
            <strong>Результат:</strong>
            <span style={{ color: 'green' }}>пройдена</span>
          </div>
          {data.session.checkType === 'number' ? (
            <div className="info-row">
              <strong>Угадал число</strong>
              <span>
                {data.nickname} за {data.tryCount}{' '}
                {getPlural(data.tryCount!, ['попытку', 'поптыки', 'попыток'])}
              </span>
            </div>
          ) : (
            <>
              <div className="info-row">
                <strong>Процент прошедших проверку:</strong>
                <span>
                  {data.winPercent}/
                  {(data.session.value as SettingsCubesType).percent}%
                </span>
              </div>
              <div className="info-row">
                <strong>Критических удач:</strong>
                <span>{data.criticalValues?.win}</span>
              </div>
              <div className="info-row">
                <strong>Критических неудач:</strong>
                <span>{data.criticalValues?.lose}</span>
              </div>
              <div className="info-row">
                <strong>Попыток:</strong>
                <span>{Object.keys(data.data).length}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export function CheckDisappiriensComponent({
  data,
}: {
  data: IPCCheckDisappiriensEvent;
}) {
  return (
    <>
      <div className="col-12">
        <SessionInfo data={data.session} />
      </div>
      <div className="col-12">
        <div className="info-row-container">
          <div className="info-row">
            <strong>Прогресс:</strong>
            <span>закончена</span>
          </div>
          <div className="info-row">
            <strong>Результат:</strong>
            <span style={{ color: 'red' }}>провалена</span>
          </div>
          {data.session.checkType === 'number' ? (
            <div className="info-row">
              <strong>Попыток</strong>
              <span>{data.tryCount}</span>
            </div>
          ) : (
            <>
              <div className="info-row">
                <strong>Процент прошедших проверку:</strong>
                <span>
                  {data.winPercent}/
                  {(data.session.value as SettingsCubesType).percent}%
                </span>
              </div>
              <div className="info-row">
                <strong>Критических удач:</strong>
                <span>{data.criticalValues?.win}</span>
              </div>
              <div className="info-row">
                <strong>Критических неудач:</strong>
                <span>{data.criticalValues?.lose}</span>
              </div>
              <div className="info-row">
                <strong>Попыток:</strong>
                <span>{Object.keys(data.data).length}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default function CheckComponent() {
  const check = useAppSelector(selectCheck);
  const dispatch = useAppDispatch();

  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('check:run', (it) =>
        dispatch(setRun(it as IPCCheckRunEvent)),
      ),
    [dispatch],
  );
  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('check:tick', (it) =>
        dispatch(setTick(it as IPCCheckTickEvent)),
      ),
    [dispatch],
  );
  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('check:end', (it) =>
        dispatch(setEnd(it as IPCCheckEndEvent)),
      ),
    [dispatch],
  );
  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('check:congratulations', (it) =>
        dispatch(setCongratulations(it as IPCCheckCongratulationsEvent)),
      ),
    [dispatch],
  );
  React.useEffect(
    () =>
      window.electron.ipcRenderer.on('check:disappiriens', (it) =>
        dispatch(setDisappiriens(it as IPCCheckDisappiriensEvent)),
      ),
    [dispatch],
  );

  if (check.type === 'none') {
    return <div />;
  }

  return (
    <div className="row visual-block">
      <div className="col-12">
        <h3 className="text-center">Результаты проверки</h3>
      </div>
      <div className="col-12">
        {check.type === 'run' && <SessionInfo data={check.data} />}
        {check.type === 'tick' && <CheckTickComponent data={check.data} />}
        {check.type === 'end' && <CheckEndComponent data={check.data} />}
        {check.type === 'congratulations' && (
          <CheckCongratulationsComponent data={check.data} />
        )}
        {check.type === 'disappiriens' && (
          <CheckDisappiriensComponent data={check.data} />
        )}
      </div>
    </div>
  );
}
