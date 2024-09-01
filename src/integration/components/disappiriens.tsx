import { useAppSelector } from '../store/hooks';
import { selectCheck } from '../store/selectors';

export default function Disappiriens() {
  const sessionData = useAppSelector(selectCheck);
  if (sessionData.type !== 'disappiriens') return undefined;
  return (
    <div style={{ width: '800px' }}>
      <h1 className="text-center text-danger">Проверка провалена!</h1>
      {sessionData.data.session.checkType === 'number' && (
        <h3 className="text-center">
          Никто не назвал число{' '}
          {sessionData.data.session.currentValue as number}
        </h3>
      )}
      {sessionData.data.session.checkType === 'cubes' && (
        <h3 className="text-center">
          Только {sessionData.data.winPercent}% из вас прошли проверку
        </h3>
      )}
    </div>
  );
}