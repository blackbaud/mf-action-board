import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ActionItemsComponent } from '../action-items/action-items.component';
import {FormsModule} from '@angular/forms';
import {GithubService} from '../github/services/github.service';
import {ActionItem} from '../domain/action-item';
import {JenkinsService} from '../jenkins/services/jenkins.service';
import {ConfigService} from '../config/config.service';
import {GithubConfig} from '../domain/github-config';
import {NotificationsService} from '../notifications/services/notifications.service';

const actionItemTextClass = '.action-item-text';
let compiled;
let fixture;
let isConfigured = false;
const gitHubConfig = {
  team: 'bros',
  teamId: '1010101',
  userName: 'dude bro',
  token: 'goober'
};

let componentElements = {
  actionItemLabelsList: () => { return compiled.querySelectorAll(actionItemTextClass); },
  actionItemLabels: (actionItemIndex: number) => { return componentElements.actionItemLabelsList()[actionItemIndex].textContent; },
  applicationTitle: () => { return compiled.querySelector('h1'); },
  teamName: () => { return compiled.querySelector('#teamUsingBoard').textContent; }
};

describe('Action Items', () => {
  describe('without configuration', () => {
    beforeEach(async(() => {
      compiled = createComponent();
    }));
    it('should render title', async(() => {
      expect(componentElements.applicationTitle().textContent).toContain('Action Item Dashboard');
    }));

    it('should show the configuration action items', async(() => {
      expect(componentElements.actionItemLabels(0)).toContain('GitHub Team Name');
      expect(componentElements.actionItemLabels(1)).toContain('GitHub Team ID');
      expect(componentElements.actionItemLabels(2)).toContain('GitHub User Name');
      expect(componentElements.actionItemLabels(3)).toContain('GitHub Token');
    }));
  });

  describe('with configuration', () => {
    beforeEach((async() => {
      isConfigured = true;
      compiled = createComponent();
    }));

    it('should render title', fakeAsync(() => {
      tick();
      expect(componentElements.applicationTitle().textContent).toContain('Action Item Dashboard');
    }));

    it('should not show configuration items', fakeAsync(() => {
      tick();
      expect(componentElements.actionItemLabelsList().length).toBe(0);
    }));

    it('should show team name', fakeAsync(() => {
      tick();
      expect(componentElements.teamName()).toContain(gitHubConfig.team);
    }));
  });
});

function createComponent() {
  TestBed.configureTestingModule({
    imports:      [ FormsModule ],
    declarations: [
      AppComponent,
      ActionItemsComponent
    ],
    providers: [
      { provide: GithubService, useClass: FakeGithubService},
      { provide: JenkinsService, useClass: FakeJenkinsService},
      { provide: ConfigService, useClass: FakeConfigService},
      { provide: NotificationsService, useClass: FakeNotificationsService}
    ]
  }).compileComponents();
  fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  return fixture.debugElement.nativeElement;
}

class FakeGithubService {
  getActionItems(): Promise<ActionItem[]> {
    return Promise.resolve([]);
  }

  private convertToActionItem(pr: any): ActionItem {
    return new ActionItem;
  }

  private determineDoNotMergeLabel(pr: any): boolean {
    return false;
  }

  private handleError(error: any): Promise<any> {
    return Promise.resolve({});
  }
}

export class FakeJenkinsService {
  loadRepos() {
    return Promise.resolve();
  }

  getActionItems(): Promise<ActionItem[]> {
    return Promise.resolve([]);
  }
}

class FakeConfigService {
  githubConfig = new GithubConfig();
  public boardUpdating = { isIt: false };
  public getConfig(): GithubConfig {
    return gitHubConfig;
  }

  public isConfigured() {
    return isConfigured;
  }

  public loadConfigFromStorage(): void {
  }

  public saveConfig(): void {
  }

  public checkForRefresh() {
  }

  private isTimeToRefreshPage(appLastModified: Date, lastModifiedHeader: Date) {
    return false;
  }
}

export class FakeNotificationsService {
  public setUpNoties() {
  }

  private closeNotification(notification: Notification) {
  }

  public notifyNewActionItems(newActionItems: ActionItem[]): void {
  }

  public notify(actionItem: ActionItem): void {
  }
}
