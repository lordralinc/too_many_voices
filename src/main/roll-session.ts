import { RunSessionRequest } from './types';
import ipc, { IPCChannels } from './ipc';
import { SettingsCubesType } from '../renderer/types';

export default class RollSession {
  initSession: RunSessionRequest;

  dataContent: { [key: string]: number[] };

  tries: { [key: string]: number };

  interval: ReturnType<typeof setInterval> | null;

  constructor(data: RunSessionRequest) {
    this.initSession = data;
    this.dataContent = {};
    this.tries = {};
    this.interval = null;
  }

  getCurrentPercent(): number {
    if (this.initSession.checkType === 'number') return 0;
    const cubesData = this.initSession.value as SettingsCubesType;

    let successCount = 0;
    let allCount = 0;

    Object.keys(this.dataContent).forEach((key) => {
      const value = this.dataContent[key];
      if (value.reduce((a, b) => a + b, 0) >= cubesData.value) {
        successCount += 1;
      }
      allCount += 1;
    });

    const returnValue = Math.round(successCount / (allCount / 100)) || 0;

    return Number.isNaN(returnValue) ? 0 : returnValue;
  }

  onEnd(
    reason: 'endOfTime' | 'success',
    successNickname: string | undefined = undefined,
  ) {
    ipc.emit(IPCChannels.CheckEnd, {
      session: this.initSession,
      data: this.dataContent,
    });
    if (reason === 'success' && successNickname) {
      ipc.emit(IPCChannels.CheckCongratulations, {
        session: this.initSession,
        data: this.dataContent,
        nickname: successNickname,
        tryCount: this.tries[successNickname],
      });
      return;
    }

    if (reason === 'endOfTime' && this.initSession.checkType === 'number') {
      ipc.emit(IPCChannels.CheckDisappiriens, {
        session: this.initSession,
        data: this.dataContent,
        tryCount: Object.keys(this.tries)
          .map((key) => this.tries[key])
          .reduce((a, b) => a + b, 0),
      });
      return;
    }

    const cubesData = this.initSession.value as SettingsCubesType;

    let successCount = 0;
    let allCount = 0;
    const criticalValues: { win: number; lose: number } = { win: 0, lose: 0 };

    Object.keys(this.dataContent).forEach((key) => {
      const value = this.dataContent[key];

      if (value.every((v) => v === parseInt(cubesData.useCube, 10))) {
        criticalValues.win += 1;
      }
      if (value.every((v) => v === 1)) {
        criticalValues.lose += 1;
      }

      if (value.reduce((a, b) => a + b, 0) >= cubesData.value) {
        successCount += 1;
      }
      allCount += 1;
    });

    const percent = Math.round(successCount / (allCount / 100));
    if (percent >= cubesData.percent) {
      ipc.emit(IPCChannels.CheckCongratulations, {
        session: this.initSession,
        data: this.dataContent,
        criticalValues,
        winPercent: percent,
      });
    } else {
      ipc.emit(IPCChannels.CheckDisappiriens, {
        session: this.initSession,
        data: this.dataContent,
        criticalValues,
        winPercent: percent,
      });
    }
  }

  listen() {
    let { delay } = this.initSession;
    const interval = setInterval(() => {
      ipc.emit(IPCChannels.CheckTick, {
        session: this.initSession,
        data: this.dataContent,
        delay,
        currentPercent: this.getCurrentPercent(),
      });
      delay -= 1;
      if (delay < 0) {
        this.onEnd('endOfTime');
        clearInterval(interval);
      }
    }, 1_000);
    ipc.on(IPCChannels.CheckStore, (data) => {
      this.dataContent[data.nickname] = data.value;
      this.tries[data.nickname] = (this.tries[data.nickname] || 0) + 1;
    });
    ipc.on(IPCChannels.CheckValue, (data) => {
      this.tries[data.nickname] = (this.tries[data.nickname] || 0) + 1;

      if (this.initSession.checkType === 'number') {
        if (this.initSession.currentValue === data.value) {
          clearInterval(interval);
          this.onEnd('success', data.nickname);
        }
      }
    });
  }
}
