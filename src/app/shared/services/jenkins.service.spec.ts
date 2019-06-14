import { TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { _throw } from 'rxjs/observable/throw';
import { ActionItem } from '../../../domain/action-item';
import { ConfigService } from '../../config.service';
import { JenkinsService } from './jenkins.service';

export type Spy<T> = { [Method in keyof T]: jasmine.Spy; };

describe('JenkinsService', () => {
  let svc: JenkinsService;
  let http: Spy<Http>;

  beforeEach(() => {
    http = jasmine.createSpyObj('Http', ['get']);
    TestBed.configureTestingModule({
      providers: [
        JenkinsService,
        ConfigService,
        {provide: Http, useValue: http}
      ]
    });
    svc = TestBed.get(JenkinsService);
  });

  it('should do stuff', async (done: DoneFn) => {
    http.get.and.returnValue(_throw('blah'));
    const actionItems: ActionItem[] = await svc.getActionItems();
    expect(actionItems.length).toBeGreaterThan(0);
    done();
  });
});
