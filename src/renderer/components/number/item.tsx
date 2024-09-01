import React from 'react';
import {
  CheckDifficulty,
  CheckDifficultyToName,
  SettingsTDItem,
} from '../../types';

export default function NumberItem({
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
