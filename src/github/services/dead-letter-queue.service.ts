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
    const items = this.populatedDeadLetterQueues.map((report) => {
      return new DeadLetterQueue(report);
    });

    return Promise.resolve(items);
  }

  private get populatedDeadLetterQueues(): DeadLetterQueueReport[] {
    return this.deadLetterQueueReports
      .filter((report: DeadLetterQueueReport) => {
        return report.populated;
      });
  }

  private get deadLetterQueueReports(): DeadLetterQueueReport[] {
    let iterator = 0;
    return this.queuesToCheck.map((requestData) => {
      // need to convert data into a url, make api request, translate response to report
      return {
        service: requestData.service,
        scs: requestData.scs,
        zone: requestData.zone,
        populated: iterator++ % 3 === 0
      };
    });
  }

  private get queuesToCheck() {
    return [].concat(...this.queuesConfigurations.map((config) => {
      return config.zones.map((zone) => {
        return {
          service: config.service,
          scs: config.scs,
          zone: zone
        };
      });
    }));
  }

  private get queuesConfigurations(): QueueConfiguration[] {
    return DEAD_LETTER_QUEUES[this.configService.vsts.team];
  }
}
