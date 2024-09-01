import { IPCTwitchMessageEventWithId } from './types';

export default function Chat({
  messages,
}: {
  messages: IPCTwitchMessageEventWithId[];
}) {
  return (
    <div>
      {messages.map(({ id, nickname, value }) => (
        <div key={id}>
          <strong>{nickname}: </strong> <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
