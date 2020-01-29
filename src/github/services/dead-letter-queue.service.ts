import {Injectable} from '@angular/core';
import {ConfigService} from '../../app/config.service';
import {ActionItem, DeadLetterQueue} from '../../domain/action-item';
import {DEAD_LETTER_QUEUES, QueueConfiguration} from './dead-letter-queues';
import {BBAuth} from '@blackbaud/auth-client/';
import {HttpClient} from '@angular/common/http';

export interface DeadLetterQueueReport {
  service: string;
  scs: string;
  zone: string;
  populated: boolean;
  url: string;
  call_failed: boolean;
}

export interface StatusReport {
  positive_report: boolean;
}

@Injectable()
export class DeadLetterQueueService {

  constructor(private http: HttpClient,
              private configService: ConfigService) {}

  getActionItems(): Promise<ActionItem[]> {
    return Promise.all(this.deadLetterQueueReports)
      .then(reports =>
        reports.filter(report => report.populated || report.call_failed)
          .map(populatedReport => new DeadLetterQueue(populatedReport)));
  }

  private get deadLetterQueueReports(): Promise<DeadLetterQueueReport>[] {
    return this.queuesToCheck.map(requestData => {
      return requestData.then(data => {
        return {
          restCall: this.getStatusReport(data.url),
          requestData: data
        };
      });
    }).map(apiRequest => apiRequest.then(request => {
      return request.restCall.then(statusReport => {
        return this.convertToReport(request.requestData, statusReport.positive_report);
      }).catch(() => {
        return this.convertToReport(request.requestData, false, true);
      });
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

  private getStatusReport(url: string): Promise<StatusReport> {
    return this.http.get<StatusReport>(url).toPromise();
  }

  private get queuesConfigurations(): QueueConfiguration[] {
    return this.fullQueueSet[this.configService.vsts.team];
  }

  private get fullQueueSet() {
    return DEAD_LETTER_QUEUES;
  }
}
