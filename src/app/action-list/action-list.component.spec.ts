import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {GithubService} from '../../github/services/github.service';
import {JenkinsService} from '../../jenkins/services/jenkins.service';
import {VstsService} from '../../github/services/vsts.service';
import {ConfigService} from '../config.service';
import {NotificationsService} from '../../notifications/services/notifications.service';
import {FakeJenkinsService} from '../../testing/FakeJenkinsService';
import {FakeNotificationsService} from '../../testing/FakeNotificationsService';
import {FakeConfigService} from '../../testing/fake-config.service';
import {GithubConfig} from '../../domain/github-config';
import {ActionListComponent} from './action-list.component';
import {ActionItem, GitHubPullRequest, PullRequest} from '../../domain/action-item';
import {PullRequestComponent} from '../pull-request/pull-request.component';
import {BuildComponent} from '../build/build.component';
import {RageFaceComponent} from '../rage-face/rage-face.component';
import {SprintLitComponent} from '../sprint-lit/sprint-lit.component';
import {VstsConfig} from '../../domain/vsts-config';
import {DebugElement} from '@angular/core';
import {PollingService} from '../polling.service';

// TODO put the common test configs in a common place
const githubConfig: GithubConfig = {
  team: 'bros',
  teamId: '1010101',
  userName: 'dude bro',
  token: 'goober',
  watchList: '',
  isConfigured: () => true
};

const vstsConfig: VstsConfig = {
  team: 'bros',
  token: 'token',
  username: 'dude bro',
  isConfigured: () => true
};

const githubPr = {
  labels: [{name: 'a random label'}],
  createdAt: 1502982366420,
  url: 'https://www.github.com/blackbaud/testRepo/issues',
  html_url: 'https://www.github.com/blackbaud/testRepo',
  title: 'Baby\'s first PR!'
};

const emptyVstsSvc = {
  getActionItems: () => {
    return Promise.resolve([] as ActionItem[]);
  }
};

const githubSvcWithData = {
  loadRepos: () => {
    return Promise.resolve({});
  },

  getActionItems: () => {
    return Promise.resolve([new GitHubPullRequest(githubPr)] as ActionItem[]);
  }
};

const emptyGithubSvc = {
  loadRepos: () => {
    return Promise.resolve({});
  },

  getActionItems: () => {
    return Promise.resolve([] as ActionItem[]);
  }
};

describe('ActionListComponent', () => {
  let fixture: ComponentFixture<ActionListComponent>;
  let component: ActionListComponent;
  let debugElement: DebugElement;

  const elements = {
    list: () => {
      return debugElement.nativeElement.querySelector('.action-item-list');
    },
    items: () => {
      return debugElement.nativeElement.querySelectorAll('.action-item-text');
    },
    item: (index: number) => {
      return elements.items()[0];
    },
    sprintLit: () => {
      return debugElement.nativeElement.querySelector('#sprint-lit');
    },
    team: () => {
      return debugElement.nativeElement.querySelector('#team-name');
    }
  };

  const teamNameTest = () => {
    it('should show team name', fakeAsync(() => {
      expect(elements.team().textContent).toContain(githubConfig.team);
    }));
  };

  describe('when there are action items', () => {
    beforeEach(async(() => {
      testBed(githubSvcWithData, emptyVstsSvc).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ActionListComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    beforeEach(fakeAsync(() => {
      // render the component, which kicks off service promises
      fixture.detectChanges();
      // wait for initial promises to resolve
      tick();
      // refresh dom with promise results
      fixture.detectChanges();
    }));

    it('should show list of items returned', fakeAsync(() => {
      expect(elements.list()).not.toBeNull();
      expect(elements.items().length).toBe(1);
      expect(elements.item(1).textContent).toContain(githubPr.title);
    }));

    teamNameTest();
  });

  describe('when there are no action items', () => {
    beforeEach(async(() => {
      testBed(emptyGithubSvc, emptyVstsSvc).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ActionListComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });

    beforeEach(fakeAsync(() => {
      // render the component, which kicks off service promises
      fixture.detectChanges();
      // wait for initial promises to resolve
      tick();
      // refresh dom with promise results
      fixture.detectChanges();
    }));

    it('should not show list of items', () => {
      expect(elements.list()).toBeNull();
    });

    it('should show sprint is lit', () => {
      expect(elements.sprintLit()).not.toBeNull();
    });

    teamNameTest();
  });
});

function testBed(githubSvc: { loadRepos: () => void, getActionItems: () => Promise<PullRequest[]> },
                 vstsSvc: { getActionItems: () => Promise<PullRequest[]> }): typeof TestBed {
  const doNothingPollingService = {
    startPoll: (interval: number, func: () => void) => {
    }
  };
  return TestBed.configureTestingModule({
    imports: [FormsModule],
    declarations: [
      ActionListComponent,
      BuildComponent,
      PullRequestComponent,
      RageFaceComponent,
      SprintLitComponent
    ],
    providers: [
      {provide: GithubService, useValue: githubSvc},
      {provide: VstsService, useValue: vstsSvc},
      {provide: JenkinsService, useClass: FakeJenkinsService},
      {provide: GithubConfig, useValue: githubConfig},
      {provide: VstsConfig, useValue: vstsConfig},
      {provide: ConfigService, useClass: FakeConfigService},
      {provide: PollingService, useValue: doNothingPollingService},
      {provide: NotificationsService, useClass: FakeNotificationsService}
    ]
  });
}
