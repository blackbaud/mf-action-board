import {Injectable} from '@angular/core';
import {ConfigService} from '../../app/config.service';
import {ActionItem, DeadLetterQueue} from '../../domain/action-item';
import {DEAD_LETTER_QUEUES, QueueConfiguration} from './dead-letter-queues';
import {BBAuth} from '@blackbaud/auth-client/';
import {Http} from '@angular/http';

export interface DeadLetterQueueReport {
  service: string;
  scs: string;
  zone: string;
  populated: boolean;
  url: string;
}

@Injectable()
export class DeadLetterQueueService {

  constructor(private http: Http,
              private configService: ConfigService) {}

  getActionItems(): Promise<ActionItem[]> {
    return Promise.all(this.deadLetterQueueReports)
      .then(reports =>
        reports.filter(report => report.populated)
          .map(populatedReport => new DeadLetterQueue(populatedReport)));
  }

  private get deadLetterQueueReports(): Promise<DeadLetterQueueReport>[] {
    let iterator = 0;
    return this.queuesToCheck.map(requestData => {
      return requestData.then(data => {
        return {
          service: data.service,
          scs: data.scs,
          zone: data.zone,
          url: data.url,
          populated: iterator++ % 3 === 0
        };
      });
    });
  }

  private get queuesToCheck(): Promise<DeadLetterQueueReport>[] {
    return [].concat(...this.queuesConfigurations.map((config) => {
      return config.zones.map(zone => {
        return BBAuth.getUrl(`1bb://${config.scs}-${config.service}/dlq/status`, {zone: zone})
            .then(url => {
              return {
                service: config.service,
                scs: config.scs,
                zone: zone,
                url: url
              };
            }
        );
      });
    }));
  }

  private get queuesConfigurations(): QueueConfiguration[] {
    return DEAD_LETTER_QUEUES[this.configService.vsts.team];
  }
}
