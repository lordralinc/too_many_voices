import NumberItem from './item';
import { CheckDifficultyList, Settings } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectSettings } from '../../../store/selectors';
import { setSettings } from '../../../store/slices/settings-slice';

export default function NumberSettings() {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const updateSettings = (newSettings: Settings) => {
    dispatch(setSettings(newSettings));
  };

  return (
    <div className="col-12">
      <h3 className="text-center">
        Настройки проверки &laquo;угадай число&raquo;
      </h3>
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
                  updateSettings({
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
  );
}
