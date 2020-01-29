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
    console.log('== getActionItems');
    return Promise.all(this.deadLetterQueueReports)
      .then(reports =>
        reports.filter(report => report.populated || report.call_failed)
          .map(populatedReport => new DeadLetterQueue(populatedReport)));
  }

  private get deadLetterQueueReports(): Promise<DeadLetterQueueReport>[] {
    console.log('== deadLetterQueueReports');
    return this.queuesToCheck.map(requestData => {
      console.log('== mapping queues which needed checking');
      return requestData.then(data => {
        console.log('== converting to api request info');
        return {
          restCall: this.getStatusReport(data.url),
          requestData: data
        };
      });
    }).map(apiRequest => apiRequest.then(request => {
      console.log('== mapping the api');
      return request.restCall.then(statusReport => {
        console.log('== successful api call');
        return this.convertToReport(request.requestData, statusReport.positive_report);
      }).catch(() => {
        console.log('== failed api call');
        return this.convertToReport(request.requestData, false, true);
      });
    }));
  }

  private get queuesToCheck(): Promise<DeadLetterQueueReport>[] {
    console.log('== queuesToCheck');
    return [].concat(...this.queuesConfigurations.map((config) => {
      console.log('== mapping queuesConfigurations results');
      console.log(config);
      console.log(config.zones);
      return config.zones.map(zone => {
        console.log('== mapping zones');
        return BBAuth.getUrl(`1bb://${config.scs}-${config.service}/dlq/status`, {zone: zone})
            .then(url => {
              console.log('== returning from url generation');
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
    console.log('== convertToReport');
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
    console.log('== getStatusReport');
    return this.http.get<StatusReport>(url).toPromise();
  }

  private get queuesConfigurations(): QueueConfiguration[] {
    console.log('== queuesConfigurations');
    console.log(this.configService.vsts.team);
    const stuff = this.getAllConfigurations()[this.configService.vsts.team];
    console.log(stuff);
    return stuff;
  }

  getAllConfigurations() {
    return DEAD_LETTER_QUEUES;
  }
}
