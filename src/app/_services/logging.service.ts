import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {}

  log(message: any): void {
    if (isDevMode()) {
      console.log(message);
    }
  }

  warn(message: any): void {
    if (isDevMode()) {
      console.warn(message);
    }
  }

  error(message: any): void {
    if (isDevMode()) {
      console.error(message);
    }
  }
}
