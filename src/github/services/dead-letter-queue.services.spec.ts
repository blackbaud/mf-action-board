import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ConfigService} from '../../app/config.service';
import {DeadLetterQueueService} from './dead-letter-queue.service';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ACTION_PRIORITY_IGNORE, ACTION_PRIORITY_NOW} from '../../domain/action-item';
import {Observable} from 'rxjs/Observable';
import {BBAuth} from '@blackbaud/auth-client';

describe('dead letter queue service', () => {

  const TEAM_NAME = 'test-team-name';
  const SERVICE_NAME = 'srvce';
  const SCS_CODE = 'scs';
  const DEPLOYMENT_ZONE = 'murika';

  let service: DeadLetterQueueService;
  let http: HttpClient;

  beforeEach(() => {
   const fakeConfigSvc = {
      vsts: {
        team: TEAM_NAME
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
    spyOn(service, 'getAllConfigurations').and.returnValue({
      [TEAM_NAME]: [{
        service: SERVICE_NAME,
        scs: SCS_CODE,
        zones: [DEPLOYMENT_ZONE]
      }]
    });

    http = TestBed.get(HttpClient);
  });

  it('should get zero queues when none are found populated', fakeAsync(() => {
    spyOn(http, 'get').and.returnValue(of({ positive_report: false }));

    const items = service.getActionItems();
    tick();

    items.then(queues => {
      expect(queues.length).toBe(0);
    });
  }));

  it('should return queues found as populated with the priority set to the highest', fakeAsync(() => {
    spyOn(http, 'get').and.returnValue(of({ positive_report: true }));

    const items = service.getActionItems();
    tick();

    items.then(queues => {
      expect(queues.length).toBe(1);
      expect(queues.pop().priority).toBe(ACTION_PRIORITY_NOW);
    });
  }));

  it('should return queues for failed api calls with the priority set to the lowest', fakeAsync(() => {
    spyOn(http, 'get').and.returnValue(Observable.throw('something dun messed up hard...'));

    const items = service.getActionItems();
    tick();

    items.then(queues => {
      expect(queues.length).toBe(1);
      expect(queues.pop().priority).toBe(ACTION_PRIORITY_IGNORE);
    });
  }));

  // I don't want to be testing this library but it's crucial to make sure this doesn't break if we upgrade the version later
  it('should get properly generated urls from BB Auth', (done) => {
    BBAuth.getUrl(
      `1bb://${SCS_CODE}-${SERVICE_NAME}/dlq/status`,
      { zone: DEPLOYMENT_ZONE })
      .then((url: string) => {
        expect(url).toBe(`https://${SCS_CODE}-${DEPLOYMENT_ZONE}.app.blackbaud.net/${SERVICE_NAME}/dlq/status`);
        done();
    });
  });
});
