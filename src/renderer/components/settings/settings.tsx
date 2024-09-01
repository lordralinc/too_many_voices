import CubesSettings from './cubes/settings';
import NumberSettings from './number/settings';

export default function SettingsComponent() {
  return (
    <div className="row visual-block">
      <NumberSettings />
      <CubesSettings />
    </div>
  );
}
