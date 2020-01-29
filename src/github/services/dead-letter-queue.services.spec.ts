import {TestBed} from '@angular/core/testing';
import {Http, HttpModule, XHRBackend} from '@angular/http';
import {ConfigService} from '../../app/config.service';
import {DeadLetterQueueService} from './dead-letter-queue.service';
import {MockBackend} from '@angular/http/testing';

describe('dead letter queue service', () => {

  let service: DeadLetterQueueService;

  beforeEach(() => {
    const fakeConfigSvc = {
      vsts: {
        team: 'test-team-name'
      }
    };
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
        { provide: ConfigService, useValue: fakeConfigSvc },
        DeadLetterQueueService
      ]
    });

    service = TestBed.get(DeadLetterQueueService);

  });

  it('should get a service', () => {
    expect(service).toBeTruthy();
  });
});
