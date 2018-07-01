import {Injectable} from '@angular/core';

/**
 * This is a service to abstract away the setInterval-based way of polling. This eases testing.
 * TODO: move some sort of observable-based polling
 */
@Injectable()
export class PollingService {
  public startPoll(interval: number, func: () => void) {
    setInterval(func, interval);
  }
}
