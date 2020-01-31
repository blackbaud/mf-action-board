import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActionItem, GitHubPullRequest, PullRequest } from '../../domain/action-item';
import { GithubConfig } from '../../domain/github-config';
import { VstsConfig } from '../../domain/vsts-config';
import { GithubService } from '../../github/services/github.service';
import { VstsService } from '../../github/services/vsts.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { FakeConfigService } from '../../testing/fake-config.service';
import { FakeJenkinsService } from '../../testing/FakeJenkinsService';
import { FakeNotificationsService } from '../../testing/FakeNotificationsService';
import { BuildComponent } from '../build/build.component';
import { ConfigService } from '../config.service';
import { PollingService } from '../polling.service';
import { PullRequestComponent } from '../pull-request/pull-request.component';
import { RageFaceComponent } from '../rage-face/rage-face.component';
import { JenkinsService } from '../shared/services/jenkins.service';
import { SprintLitComponent } from '../sprint-lit/sprint-lit.component';
import { ActionListComponent } from './action-list.component';
import { TEST_GITHUB_CONFIG, TEST_GITHUB_PR, TEST_VSTS_CONFIG } from '../../testing/constants';
import { DeadLetterQueueComponent } from '../dead-letter-queue/dead-letter-queue.component';
import { DeadLetterQueueService } from '../../github/services/dead-letter-queue.service';

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
    return Promise.resolve([new GitHubPullRequest(TEST_GITHUB_PR)] as ActionItem[]);
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

const emptyDlqSvc = {
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
    it('should show team name', () => {
      expect(elements.team().textContent).toContain(TEST_GITHUB_CONFIG.team);
    });
  };

  describe('when there are action items', () => {
    beforeEach(() => {
      testBed(githubSvcWithData, emptyVstsSvc);
    });

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

    it('should show list of items returned', () => {
      expect(elements.list()).not.toBeNull();
      expect(elements.items().length).toBe(1);
      expect(elements.item(1).textContent).toContain(TEST_GITHUB_PR.title);
    });

    teamNameTest();
  });

  describe('when there are no action items', () => {
    beforeEach(() => {
      testBed(emptyGithubSvc, emptyVstsSvc);
    });

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
      DeadLetterQueueComponent,
      PullRequestComponent,
      RageFaceComponent,
      SprintLitComponent
    ],
    providers: [
      {provide: GithubService, useValue: githubSvc},
      {provide: VstsService, useValue: vstsSvc},
      {provide: JenkinsService, useClass: FakeJenkinsService},
      {provide: GithubConfig, useValue: TEST_GITHUB_CONFIG},
      {provide: VstsConfig, useValue: TEST_VSTS_CONFIG},
      {provide: ConfigService, useClass: FakeConfigService},
      {provide: PollingService, useValue: doNothingPollingService},
      {provide: NotificationsService, useClass: FakeNotificationsService},
      {provide: DeadLetterQueueService, useValue: emptyDlqSvc}
    ]
  });
}
