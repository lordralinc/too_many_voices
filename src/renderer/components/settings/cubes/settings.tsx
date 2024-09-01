import CubesItem from './item';
import { CheckDifficultyList, Settings } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSettings } from '../../../store/slices/settings-slice';
import { selectSettings } from '../../../store/selectors';

export default function CubesSettings() {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const updateSettings = (newSettings: Settings) => {
    dispatch(setSettings(newSettings));
  };
  return (
    <div className="col-12">
      <h3 className="text-center">
        Настройки проверки &laquo;брось кубы&raquo;
      </h3>
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
                  updateSettings({
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
  );
}
