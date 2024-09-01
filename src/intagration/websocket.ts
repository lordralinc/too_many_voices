import {
  IPCCheckCongratulationsEvent,
  IPCCheckDisappiriensEvent,
  IPCCheckEndEvent,
  IPCCheckRunEvent,
  IPCCheckTickEvent,
  IPCTwitchMessageEvent,
} from '../main/ipc';
import { TypedEvent } from './typed-event';

class WebScoketEmiter {
  connection: WebSocket | null = null;

  checkStart: TypedEvent<IPCCheckRunEvent>;
  checkTick: TypedEvent<IPCCheckTickEvent>;
  checkEnd: TypedEvent<IPCCheckEndEvent>;
  checkCongratulations: TypedEvent<IPCCheckCongratulationsEvent>;
  checkDisappiriens: TypedEvent<IPCCheckDisappiriensEvent>;
  twitchMessage: TypedEvent<IPCTwitchMessageEvent>;

  onMessageListener: (ev: MessageEvent) => void;
  onCloseListener: (ev: CloseEvent) => void;
  onOpenListener: (ev: Event) => void;
  onErrorListener: (ev: Event) => void;

  requireClose: boolean = false;

  constructor() {
    this.checkStart = new TypedEvent<IPCCheckRunEvent>();
    this.checkTick = new TypedEvent<IPCCheckTickEvent>();
    this.checkEnd = new TypedEvent<IPCCheckEndEvent>();
    this.checkCongratulations = new TypedEvent<IPCCheckCongratulationsEvent>();
    this.checkDisappiriens = new TypedEvent<IPCCheckDisappiriensEvent>();
    this.twitchMessage = new TypedEvent<IPCTwitchMessageEvent>();

    this.onMessageListener = this.onMessage.bind(this);
    this.onCloseListener = this.onClose.bind(this);
    this.onOpenListener = this.onOpen.bind(this);
    this.onErrorListener = this.onError.bind(this);

    this.initConnection();
  }

  initConnection() {
    this.requireClose = false;
    this.connection = new WebSocket('ws://localhost:3000/ws');
    this.connection.binaryType = 'arraybuffer';
    this.connection.addEventListener('message', this.onMessageListener);
    this.connection.addEventListener('close', this.onCloseListener);
    this.connection.addEventListener('open', this.onOpenListener);
    this.connection.addEventListener('error', this.onErrorListener);
  }

  close() {
    this.requireClose = true;
    this.connection?.removeEventListener('message', this.onMessageListener);
    this.connection?.removeEventListener('close', this.onCloseListener);
    this.connection?.removeEventListener('open', this.onOpenListener);
    this.connection?.removeEventListener('error', this.onErrorListener);

    this.connection?.close(1000, 'normal close');
  }

  onMessage(message: MessageEvent) {
    const jsonData = JSON.parse(new TextDecoder().decode(message.data));
    console.log('Received:', jsonData);
    switch (jsonData.event) {
      case 'check:run':
        this.checkStart.emit(jsonData.data);
        break;
      case 'check:tick':
        this.checkTick.emit(jsonData.data);
        break;
      case 'check:end':
        this.checkEnd.emit(jsonData.data);
        break;
      case 'twitch:message':
        this.twitchMessage.emit(jsonData.data);
        break;
      case 'check:disappiriens':
        this.checkDisappiriens.emit(jsonData.data);
        break;
      case 'check:congratulations':
        this.checkCongratulations.emit(jsonData.data);
        break;
      default:
        console.warn('Unknonw ws event', jsonData);
    }
  }

  onClose(ev: CloseEvent) {
    console.warn('Websocket close', ev);
    if (this.requireClose) return;
    if (!ev.wasClean) this.initConnection();
  }

  onOpen(ev: Event) {
    console.log('Websocket open', ev);
    this.requireClose = false;
  }
  onError(ev: Event) {
    console.error('WebSocket error', ev);
  }
}

export default WebScoketEmiter;
