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
  call_failed: boolean;
}

@Injectable()
export class DeadLetterQueueService {

  constructor(private http: Http,
              private configService: ConfigService) {}

  getActionItems(): Promise<ActionItem[]> {
    return Promise.all(this.deadLetterQueueReports)
      .then(reports =>
        reports.filter(report => report.populated || report.call_failed)
          .map(populatedReport => new DeadLetterQueue(populatedReport)));
  }

  private get deadLetterQueueReports(): Promise<DeadLetterQueueReport>[] {
    let iterator = 0;
    let tempReportData: DeadLetterQueueReport;
    return this.queuesToCheck.map(requestData => {
      return requestData.then(data => {
        tempReportData = data;
        return this.http.get(data.url, {}).toPromise();
      });
    }).map(restCall => restCall.then(response => {
      console.log('== success ==');
      console.log(response);
      return this.convertToReport(tempReportData, iterator++ % 3 === 0);
    }).catch(error => {
      console.log('== failure ==');
      console.log(error);
      return this.convertToReport(tempReportData, false, true);
    }));
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

  private convertToReport(requestInputs: DeadLetterQueueReport,
                          foundDlqMessages = false,
                          restCallFailed = false): Promise<DeadLetterQueueReport> {
    return Promise.resolve({
      service: requestInputs.service,
      scs: requestInputs.scs,
      zone: requestInputs.zone,
      url: requestInputs.url,
      call_failed: restCallFailed,
      populated: foundDlqMessages
    });
  }

  private get queuesConfigurations(): QueueConfiguration[] {
    return DEAD_LETTER_QUEUES[this.configService.vsts.team];
  }
}
