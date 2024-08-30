import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import React from 'react';
import {
  CheckDifficulty,
  CheckDifficultyList,
  CheckDifficultyToName,
  CheckType,
  Cubes,
  CubesList,
  Settings,
  SettingsCubesType,
  SettingsTDItem,
} from './types';
import { getRandomInt, loadSettings } from './utils';

function NumberItem({
  difficulty,
  value,
  onValueChanged,
}: {
  difficulty: CheckDifficulty;
  value: SettingsTDItem;
  onValueChanged: (value: SettingsTDItem) => void;
}) {
  return (
    <tr>
      <td>{CheckDifficultyToName[difficulty]}</td>
      <td>
        <input
          type="number"
          className="form-control"
          value={value.delay}
          onChange={(e) =>
            onValueChanged({ ...value, delay: parseInt(e.target.value, 10) })
          }
        />
      </td>
      <td>
        <input
          type="number"
          className="form-control"
          value={value.value as number}
          onChange={(e) =>
            onValueChanged({ ...value, value: parseInt(e.target.value, 10) })
          }
        />
      </td>
    </tr>
  );
}
function CubesItem({
  difficulty,
  value,
  onValueChanged,
}: {
  difficulty: CheckDifficulty;
  value: SettingsTDItem;
  onValueChanged: (value: SettingsTDItem) => void;
}) {
  const v = value.value as SettingsCubesType;
  return (
    <tr>
      <td>{CheckDifficultyToName[difficulty]}</td>
      <td>
        <input
          type="number"
          value={value.delay}
          className="form-control"
          onChange={(e) =>
            onValueChanged({ ...value, delay: parseInt(e.target.value, 10) })
          }
        />
      </td>
      <td className="d-flex">
        <input
          type="number"
          value={v.cubeCount}
          min="1"
          step="1"
          onChange={(e) =>
            onValueChanged({
              ...value,
              value: { ...v, cubeCount: parseInt(e.target.value, 10) },
            })
          }
          className="form-control"
        />
        <span
          style={{ display: 'flex', alignItems: 'flex-end', margin: '2px' }}
        >
          D
        </span>
        <select
          value={v.useCube}
          className="form-select"
          onChange={(e) =>
            onValueChanged({
              ...value,
              value: { ...v, useCube: e.target.value as Cubes },
            })
          }
        >
          {CubesList.map((it) => (
            <option value={it} key={it}>
              {it}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="number"
          value={v.percent}
          onChange={(e) =>
            onValueChanged({
              ...value,
              value: { ...v, percent: parseInt(e.target.value, 10) },
            })
          }
          className="form-control"
        />
      </td>
      <td>
        <input
          type="number"
          value={v.value}
          onChange={(e) =>
            onValueChanged({
              ...value,
              value: { ...v, value: parseInt(e.target.value, 10) },
            })
          }
          className="form-control"
        />
      </td>
    </tr>
  );
}

function VariablesPicker({
  delay,
  value,
  type,
  currentValue,

  onChangeDelay,
  onChangeValue,
  onChangeCurrentValue,
}: {
  delay: number;
  value: number | SettingsCubesType;
  currentValue: number;
  type: CheckType;
  onChangeDelay: (value: number) => void;
  onChangeValue: (value: number | SettingsCubesType) => void;
  onChangeCurrentValue: (value: number) => void;
}) {
  if (type === 'number') {
    return (
      <div className="row g-3 mb-1">
        <div className="col">
          <div className="form-floating mb-1">
            <input
              type="number"
              className="form-control"
              id="title"
              placeholder="Время на решение"
              value={delay}
              onChange={(e) => onChangeDelay(parseInt(e.target.value, 10))}
            />
            <label htmlFor="title">Время на решение</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating mb-1">
            <input
              type="number"
              className="form-control"
              id="title"
              placeholder="Диапазон"
              value={value as number}
              onChange={(e) => onChangeValue(parseInt(e.target.value, 10))}
            />
            <label htmlFor="title">Диапазон</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating mb-1">
            <input
              type="number"
              className="form-control"
              id="title"
              placeholder="Искомое число"
              value={currentValue as number}
              onChange={(e) =>
                onChangeCurrentValue(parseInt(e.target.value, 10))
              }
            />
            <label htmlFor="title">Искомое число</label>
          </div>
        </div>
      </div>
    );
  }
  const v = value as SettingsCubesType;
  return (
    <div className="row g-3 mb-1">
      <div className="col">
        <div className="form-floating mb-1">
          <input
            type="number"
            className="form-control"
            id="title"
            placeholder="Время на решение"
            value={delay}
            onChange={(e) => onChangeDelay(parseInt(e.target.value, 10))}
          />
          <label htmlFor="title">Время на решение</label>
        </div>
      </div>
      <div className="col d-flex">
        <input
          type="number"
          value={v.cubeCount}
          onChange={(e) =>
            onChangeValue({ ...v, cubeCount: parseInt(e.target.value, 10) })
          }
          className="form-control"
        />
        <span
          style={{ display: 'flex', alignItems: 'flex-end', margin: '2px' }}
        >
          D
        </span>
        <select
          value={v.useCube}
          onChange={(e) =>
            onChangeValue({ ...v, useCube: e.target.value as Cubes })
          }
          className="form-select"
        >
          {CubesList.map((it) => (
            <option value={it} key={it}>
              {it}
            </option>
          ))}
        </select>
      </div>
      <div className="col">
        <div className="form-floating mb-1">
          <input
            type="number"
            className="form-control"
            id="title"
            placeholder="Процент"
            value={v.percent}
            onChange={(e) =>
              onChangeValue({ ...v, percent: parseInt(e.target.value, 10) })
            }
          />
          <label htmlFor="title">Процент</label>
        </div>
      </div>
      <div className="col">
        <div className="form-floating mb-1">
          <input
            type="number"
            className="form-control"
            id="title"
            placeholder="Значение"
            value={v.value}
            min={v.cubeCount}
            max={v.cubeCount * parseInt(v.useCube, 10)}
            onChange={(e) =>
              onChangeValue({ ...v, value: parseInt(e.target.value, 10) })
            }
          />
          <label htmlFor="title">Значение</label>
        </div>
      </div>
    </div>
  );
}

function Hello() {
  const [title, setTitle] = React.useState('Проверка на ');
  const [checkType, setCheckType] = React.useState<CheckType>('number');
  const [checkDifficulty, setCheckDifficulty] =
    React.useState<CheckDifficulty>('medium');

  const [settings, reactSetSettings] = React.useState<Settings>(loadSettings);

  const [delay, setDelay] = React.useState<number>(
    settings.number.medium.delay,
  );
  const [value, setValue] = React.useState<number | SettingsCubesType>(
    settings.number.medium.value,
  );
  const [currentValue, setCurrentValue] = React.useState<number>(1);

  const [isAuthorizaed, setIsAuthorizaed] = React.useState(false);

  React.useEffect(() => {
    return window.electron.ipcRenderer.on('twitch:set-token', () => {
      setIsAuthorizaed(true);
    });
  }, []);

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

  const setSettings = React.useCallback(
    (s: Settings) => {
      reactSetSettings(s);
      localStorage.setItem('settings', JSON.stringify(s));
    },
    [reactSetSettings],
  );

  const authorizeTwitch = () => {
    window.electron.ipcRenderer.sendMessage('twitch:authorize-request');
  };

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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h3>Авторизация</h3>
        </div>
        {isAuthorizaed ? (
          <div className="col-12">Вы авторизованы </div>
        ) : (
          <>
            <div className="col-12">Вы еще не авторизованы </div>
            <div className="col-12">
              <button
                className="btn btn-primary w-100"
                type="button"
                onClick={authorizeTwitch}
              >
                Авторизоваться в Twitch
              </button>
            </div>
          </>
        )}
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Запуск проверки</h3>
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
            >
              Запустить проверку
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3>Настройки проверки &laquo;угадай число&raquo;</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Сложность</th>
                <th scope="col">Время на решение</th>
                <th scope="col">Диапазон (1-указанное число включительно)</th>
              </tr>
            </thead>
            <tbody>
              {CheckDifficultyList.map((it) => {
                return (
                  <NumberItem
                    key={it}
                    difficulty={it}
                    value={settings.number[it]}
                    onValueChanged={(e) =>
                      setSettings({
                        ...settings,
                        number: { ...settings.number, [it]: e },
                      })
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12">
          <h3>Настройки проверки &laquo;брось кубы&raquo;</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Сложность</th>
                <th scope="col">Время на решение</th>
                <th scope="col">Кубы</th>
                <th scope="col">Процент</th>
                <th scope="col">Значение</th>
              </tr>
            </thead>
            <tbody>
              {CheckDifficultyList.map((it) => {
                return (
                  <CubesItem
                    key={it}
                    difficulty={it}
                    value={settings.cubes[it]}
                    onValueChanged={(e) =>
                      setSettings({
                        ...settings,
                        cubes: { ...settings.cubes, [it]: e },
                      })
                    }
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
