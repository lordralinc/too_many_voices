import { useAppSelector } from '../../store/hooks';
import { selectAuthorization } from '../../store/selectors';
import TwitchChatComponent from './chat';
import TwitchAuthorizationComponent from './authorization';

export default function TwitchComponent() {
  const info = useAppSelector(selectAuthorization);
  return (
    <div className="row visual-block">
      <h3 className="text-center">Twitch</h3>
      {info.sessionWelcome && (
        <div className="col-6">
          <TwitchChatComponent />
        </div>
      )}
      <div className={info.sessionWelcome ? 'col-6' : 'col-12'}>
        <TwitchAuthorizationComponent />
      </div>
    </div>
  );
}
