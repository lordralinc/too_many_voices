import { useAppSelector } from '../store/hooks';
import { selectGeneratedMessages } from '../store/selectors';

export default function Chat() {
  const messages = useAppSelector(selectGeneratedMessages);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong style={{ color: message.color }}>{message.nickname}: </strong>{' '}
          <span>{message.value}</span>
        </div>
      ))}
    </div>
  );
}
