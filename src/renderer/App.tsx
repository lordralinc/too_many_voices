import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';
import React from 'react';
import {
  CheckDifficulty,
  CheckDifficultyList,
  CheckDifficultyToName,
  CheckType,
  SettingsCubesType,
} from './types';
import { getRandomInt } from './utils';
import VariablesPicker from './components/variables-picker';
import SettingsComponent from './components/settings/settings';
import { selectAuthorization, selectSettings } from './store/selectors';
import { useAppSelector } from './store/hooks';
import TwitchComponent from './components/twitch/twitch';
import CheckComponent from './components/check';

export default function App() {
  const settings = useAppSelector(selectSettings);

  const [title, setTitle] = React.useState('Проверка на ');
  const [checkType, setCheckType] = React.useState<CheckType>('number');
  const [checkDifficulty, setCheckDifficulty] =
    React.useState<CheckDifficulty>('medium');

  const [delay, setDelay] = React.useState<number>(
    settings.number.medium.delay,
  );
  const [value, setValue] = React.useState<number | SettingsCubesType>(
    settings.number.medium.value,
  );
  const [currentValue, setCurrentValue] = React.useState<number>(1);

  React.useEffect(() => {
    setDelay(settings[checkType][checkDifficulty].delay);
    if (checkType === 'number') {
      setValue(settings[checkType][checkDifficulty].value);
    } else {
      setValue(settings[checkType][checkDifficulty].value as SettingsCubesType);
    }
  }, [checkType, checkDifficulty, settings]);

  React.useEffect(() => {
    if (checkType === 'number') {
      setCurrentValue(getRandomInt(1, value as number));
    }
    if (checkType === 'cubes') {
      const v = value as SettingsCubesType;
      const minValue = v.cubeCount;
      const maxValue = v.cubeCount * parseInt(v.useCube, 10);
      setCurrentValue(getRandomInt(minValue, maxValue));
    }
  }, [checkType, settings, value]);

  const runCheck = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('check:run', {
      title,
      checkType,
      checkDifficulty,
      delay,
      value,
      currentValue,
    });
  }, [title, checkType, checkDifficulty, delay, value, currentValue]);

  const authorizationInfo = useAppSelector(selectAuthorization);

  return (
    <div className="container-fluid">
      <TwitchComponent />
      <CheckComponent />
      <div className="row visual-block">
        <div className="col-12">
          <h3 className="text-center">Запуск проверки</h3>
          <div className="form-floating mb-1">
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок проверки"
            />
            <label htmlFor="title">Заголовок проверки</label>
          </div>
          <div className="form-floating mb-1">
            <select
              className="form-select"
              id="check-difficulty"
              aria-label="Тип проверки"
              value={checkType}
              onChange={(e) => setCheckType(e.target.value as CheckType)}
            >
              <option value="number">Угадай число</option>
              <option value="cubes">Брось кубы</option>
            </select>
            <label htmlFor="check-difficulty">Тип проверки</label>
          </div>
          <div className="form-floating mb-1">
            <select
              className="form-select"
              id="check-difficulty"
              aria-label="Сложность проверки"
              value={checkDifficulty}
              onChange={(e) =>
                setCheckDifficulty(e.target.value as CheckDifficulty)
              }
            >
              {CheckDifficultyList.map((it) => (
                <option value={it} key={it}>
                  {CheckDifficultyToName[it]}
                </option>
              ))}
            </select>
            <label htmlFor="check-difficulty">Сложность проверки</label>
          </div>
          <VariablesPicker
            type={checkType}
            delay={delay}
            onChangeDelay={setDelay}
            value={value}
            onChangeValue={setValue}
            currentValue={currentValue}
            onChangeCurrentValue={setCurrentValue}
          />
          <div>
            <button
              className="btn btn-primary w-100"
              type="button"
              onClick={runCheck}
              disabled={
                !authorizationInfo.authorized ||
                !authorizationInfo.sessionWelcome ||
                !authorizationInfo.keepAlive
              }
            >
              Запустить проверку
            </button>
            {(!authorizationInfo.authorized ||
              !authorizationInfo.sessionWelcome ||
              !authorizationInfo.keepAlive) && (
              <>
                {!authorizationInfo.authorized && (
                  <div
                    className="text-small text-center"
                    style={{ color: 'red' }}
                  >
                    Вы не авторизованны. (Если авторизация не пройдена после
                    нажатия кнопки, перезапустите приложение)
                  </div>
                )}
                {!authorizationInfo.sessionWelcome && (
                  <div
                    className="text-small text-center"
                    style={{ color: 'red' }}
                  >
                    Не получено приглашение в сессию чата. (Если сессия не
                    доступна более 30 секунд, перезапустите приложение)
                  </div>
                )}
                {!authorizationInfo.keepAlive && (
                  <div
                    className="text-small text-center"
                    style={{ color: 'red' }}
                  >
                    Сессия чата Twitch не доступна. (Если сессия не доступна
                    более 30 секунд, перезапустите приложение)
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <SettingsComponent />
    </div>
  );
}
