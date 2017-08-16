import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ActionItemsComponent } from '../action-items/action-items.component';
import {FormsModule} from '@angular/forms';
import {GithubService} from '../github/services/github.service';
import {ActionItem} from '../domain/action-item';
import {JenkinsService} from '../jenkins/services/jenkins.service';
import {ConfigService} from '../config/config.service';
import {GithubConfig} from '../domain/github-config';
import {NotificationsService} from '../notifications/services/notifications.service';
import {Observable} from "rxjs/Observable";

describe('AppComponent', () => {
  beforeEach(async(() => {
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
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Action Item Dashboard');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Action Item Dashboard');
  }));
});

class FakeGithubService {
  getActionItems(): Promise<ActionItem[]> {
    const actionItems: ActionItem[] = [];
    return Promise.resolve(actionItems);
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
    return new Observable().toPromise();
  }

  getActionItems(): Promise<ActionItem[]> {
    return Promise.resolve([]);
  }
}

class FakeConfigService {
  githubConfig = new GithubConfig();
  public boardUpdating = { isIt: false };
  public getConfig(): GithubConfig {
    return {
      team: 'bros',
      teamId: '1010101',
      userName: 'dude bro',
      token: 'goober'
    };
  }

  public isConfigured() {
    return false;
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
