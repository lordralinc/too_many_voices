import {
  CheckDifficulty,
  CheckDifficultyToName,
  Cubes,
  CubesList,
  SettingsCubesType,
  SettingsTDItem,
} from '../../types';

export default function CubesItem({
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
