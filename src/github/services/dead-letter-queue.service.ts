import {Injectable} from '@angular/core';
import {ConfigService} from '../../app/config.service';
import {Http} from '@angular/http';
import {ActionItem, ActionItemService, DeadLetterQueue} from '../../domain/action-item';
import {DEAD_LETTER_QUEUES, QueueConfiguration} from './dead-letter-queues';

export interface DeadLetterQueueReport {
  service: string;
  scs: string;
  zone: string;
  populated: boolean;
}

@Injectable()
export class DeadLetterQueueService implements ActionItemService {
  constructor(private http: Http,
              private configService: ConfigService) {}

  getActionItems(): Promise<ActionItem[]> {
    return Promise.all([
      this.populatedQueues
    ]).then(items => [].concat.apply([], items));
  }

  private get populatedQueues(): Promise<DeadLetterQueue[]> {
    const items = this.queues.map((config: QueueConfiguration) => {
      return {
        service: config.service,
        scs: config.scs,
        zone: config.zones[1]
      };
    }).map((report: DeadLetterQueueReport) => {
      return new DeadLetterQueue(report);
    });
    return Promise.resolve(items);
  }

  private get queues(): QueueConfiguration[] {
    return DEAD_LETTER_QUEUES[this.configService.vsts.team];
  }

  private mashPromisesTogether( func: () => Promise<any>): Promise<any[]> {
    return Promise.all([
      func
    ]).then(items => [].concat.apply([], items));
  }
}
