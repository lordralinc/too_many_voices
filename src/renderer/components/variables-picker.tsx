import { CheckType, Cubes, CubesList, SettingsCubesType } from '../types';

export default function VariablesPicker({
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
