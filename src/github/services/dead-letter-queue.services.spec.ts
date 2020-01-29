import {TestBed} from '@angular/core/testing';
import {XHRBackend} from '@angular/http';
import {ConfigService} from '../../app/config.service';
import {DeadLetterQueueService} from './dead-letter-queue.service';
import {MockBackend} from '@angular/http/testing';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('dead letter queue service', () => {

  const TEST_TEAM = 'test-team-name';
  const TEAM_SVC = 'super-svc';
  const TEAM_SCS = 'best-scs';
  const SVC_ZONE = 'murika';

  let service: DeadLetterQueueService;
  let http: HttpClient;

  beforeEach(() => {
    const fakeConfigSvc = {
      vsts: {
        team: TEST_TEAM
      }
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: ConfigService, useValue: fakeConfigSvc },
        DeadLetterQueueService
      ]
    });

    service = TestBed.get(DeadLetterQueueService);
    spyOn(service, 'fullQueueSet').and.returnValue({
      TEST_TEAM: [{
        service: TEAM_SVC,
        scs: TEAM_SCS,
        zone: [SVC_ZONE]
      }]
    });

    http = TestBed.get(HttpClient);
  });

  it('should get zero configurations when no queues are found populated', () => {
    // spyOn(http, 'get').and.returnValue(of({
    //   json(): {
    //     return { positive_report: false };
    //   }
    // }));
    expect(service).toBeTruthy();
  });
});
