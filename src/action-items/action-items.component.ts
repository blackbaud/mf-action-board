import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';
import { GithubService } from '../github/services/github.service';
import { JenkinsService } from '../jenkins/services/jenkins.service';
import * as moment from 'moment';
import { GithubConfig } from '../domain/github-config';
import { ACTION_ITEM_POLLING_INTERVAL_IN_MS } from '../config/app-config-constants';
import { ConfigService } from '../config/config.service';

@Component({
  selector: 'action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent implements OnInit {
  actionItems: ActionItem[] = [];
  showEmptyBoardCongrats = false;
  githubConfig: GithubConfig = this.configService.githubConfig;
  pollIntervalHandle;
  isConfiguring: boolean;
  private configActionItems: ActionItem[] = this.loadConfigActionItems();

  constructor(private githubService: GithubService,
              private jenkinsService: JenkinsService,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.setUpNoties();
    this.configService.loadConfigFromStorage();
    if (this.configService.isConfigured()) {
      this.isConfiguring = false;
      this.loadActionItems();
    } else {
      this.isConfiguring = true;
      this.loadConfig();
    }
  }

  private setUpNoties() {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        const notification = new Notification('Welcome to MF Action Board!', {
          dir: 'auto',
          lang: 'en',
          icon: '../assets/angular-logo.png'
        });
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    });
  }

  private loadActionItems() {
    if (this.configService.isConfigured()) {
      this.jenkinsService.loadRepos().then(() => {
        this.getActionItemsList();
        this.pollIntervalHandle = setInterval(() => {
          this.getActionItemsList();
        }, ACTION_ITEM_POLLING_INTERVAL_IN_MS);
      });
    }
  }

  getActionItemsList(): void {
    Promise.all([this.githubService.getActionItems(), this.jenkinsService.getActionItems()]).then(
      actionItems => {
        const oldActionItems = this.actionItems;
        this.actionItems = this.sortByPriorityAndOpenDuration(Array.prototype.concat.apply([], actionItems));
        const newActionItems = this.getNewActionItems(oldActionItems, this.actionItems);
        this.notifyNewActionItems(newActionItems);
        this.checkIfShouldDisplayEmptyBoardCongrats();
      }
    );
  }

  private getNewActionItems(oldActionItems: ActionItem[], nextActionItems: ActionItem[]) {
    const oldActionItemMap = oldActionItems.reduce((map, actionItem) => {
      map[actionItem.name] = actionItem;
      return map;
    }, {});
    const newActionItems = nextActionItems.filter((actionItem) => {
      return !oldActionItemMap.hasOwnProperty(actionItem.name);
    });
    return newActionItems;
  }

  private notifyNewActionItems(newActionItems: ActionItem[]): void {
    newActionItems.forEach((actionItem) => {
      this.notify(actionItem);
    });
  }

  private notify(actionItem: ActionItem): void {
    const options = { dir: 'auto', lang: 'en' };
    if (actionItem.source === 'github') {
      options['icon'] = '../assets/pull-request.png';
    } else if (actionItem.source === 'jenkins') {
      options['icon'] = '../assets/jenkins-failed-build-icon.png';
    }
    const notification = new Notification(actionItem.name, options);
    setTimeout(() => {
      notification.close();
    }, 5000);
    notification.onclick = (event) => {
      event.preventDefault();
      window.open(actionItem.url, '_blank');
    };
  }

  private loadConfig() {
    this.actionItems = this.configActionItems;
  }

  private loadConfigActionItems(): ActionItem[] {
    const configActionItems = [];
    configActionItems.push(this.createConfigActionItem('GitHub Team Name', 'team'));
    configActionItems.push(this.createConfigActionItem('GitHub Team ID', 'teamId'));
    configActionItems.push(this.createConfigActionItem('GitHub User Name', 'userName'));
    configActionItems.push(this.createConfigActionItem('GitHub Token', 'token'));
    return configActionItems;
  }

  private createConfigActionItem(name: string, model: string): ActionItem {
    const configActionItem = new ActionItem();
    configActionItem.name = name;
    configActionItem.created = moment.now();
    configActionItem.priority = 0;
    configActionItem.source = 'config';
    configActionItem.type = 'Open PR';
    configActionItem.model = model;
    return configActionItem;
  }

  saveConfig() {
    this.configService.saveConfig();
    if (this.configService.isConfigured()) {
      this.isConfiguring = false;
    }
    this.loadActionItems();
  }

  changeConfig() {
    this.isConfiguring = true;
    window.clearInterval(this.pollIntervalHandle);
    this.loadConfig();
  }

  getDisplaySaveConfigButton() {
    return this.isConfiguring;
  }

  getDisplayChangeConfigButton() {
    return !this.isConfiguring;
  }

  isConfigured() {
    return this.configService.isConfigured();
  }

  getTeamUsingBoard() {
    return this.configService.getConfig().team;
  }

  getTimeElapsed(time) {
    return moment(time).fromNow();
  }

  shouldShowEmptyBoardCongrats() {
    return this.showEmptyBoardCongrats;
  }

  sortByPriorityAndOpenDuration(actionItems: ActionItem[]): ActionItem[] {
    const red = actionItems.filter(function (a) {
      return a.priority === 1;
    });

    const orange = actionItems.filter(function (a) {
      return a.priority === 2;
    });

    const yellow = actionItems.filter(function (a) {
      return a.priority === 3;
    });

    const grey = actionItems.filter(function (a) {
      return a.priority === 4;
    });

    return red.sort(this.sortByOpenDuration)
      .concat(orange.sort(this.sortByOpenDuration))
      .concat(yellow.sort(this.sortByOpenDuration))
      .concat(grey.sort(this.sortByOpenDuration));
  }

  sortByOpenDuration(a, b) {
    if (a.created > b.created) {
      return 1;
    } else if (a.created < b.created) {
      return -1;
    } else {
      return 0;
    }
  }

  private checkIfShouldDisplayEmptyBoardCongrats() {
    this.showEmptyBoardCongrats = this.actionItems.length === 0;
  }
}
