/* eslint-disable no-undef */
/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export class Logger {
  static logMessage(level: string, tag: string, ...args: unknown[]): void {
    // @ts-ignore
    console[level as keyof Console](
      `[${new Date().toLocaleTimeString()}] | ${tag} > `,
      ...args,
    );
  }

  static debug(tag: string, ...args: unknown[]) {
    return Logger.logMessage('debug', tag, ...args);
  }

  static log(tag: string, ...args: unknown[]) {
    return Logger.logMessage('log', tag, ...args);
  }

  static info(tag: string, ...args: unknown[]) {
    return Logger.logMessage('info', tag, ...args);
  }

  static warn(tag: string, ...args: unknown[]) {
    return Logger.logMessage('warn', tag, ...args);
  }

  static error(tag: string, ...args: unknown[]) {
    return Logger.logMessage('error', tag, ...args);
  }

  static hideData<T = object>(item: T, hideItems: (keyof T)[]): T {
    const newItem = { ...item };

    hideItems.forEach((hitem) => {
      if (newItem[hitem]) {
        newItem[hitem] = '***' as T[keyof T];
      }
    });

    return newItem;
  }
}
