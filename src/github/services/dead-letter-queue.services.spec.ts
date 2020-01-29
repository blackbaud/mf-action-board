import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ConfigService} from '../../app/config.service';
import {DeadLetterQueueService} from './dead-letter-queue.service';
import {of} from 'rxjs/observable/of';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ACTION_PRIORITY_IGNORE, ACTION_PRIORITY_NOW} from '../../domain/action-item';
import {Observable} from 'rxjs/Observable';

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
    spyOn(service, 'getAllConfigurations').and.returnValue({
      'test-team-name': [{
        service: TEAM_SVC,
        scs: TEAM_SCS,
        zones: [SVC_ZONE]
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
});
