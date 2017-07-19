import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActionItem } from '../domain/action-item';
import { GithubService } from '../github/services/github.service';
import { JenkinsService } from '../jenkins/services/jenkins.service';
import * as moment from 'moment';
import { GithubConfig } from '../domain/github-config';
import { MF_GITHUB_TEAM, MF_GITHUB_TEAM_ID, MF_GITHUB_TOKEN, MF_GITHUB_USERNAME } from '../config/app-config-constants';

@Component({
    selector: 'action-items',
    templateUrl: './action-items.component.html',
    styleUrls: ['./action-items.component.css']
})
export class ActionItemsComponent implements OnInit {
    actionItems: ActionItem[];
    githubConfig: GithubConfig;
    pollIntervalHandle;
    private configActionItems: ActionItem[] = this.loadConfigActionItems();

    constructor(private githubService: GithubService, private jenkinsService: JenkinsService) {
      this.githubConfig = new GithubConfig();
    }

    ngOnInit() {
      this.loadConfigFromStorage();
      this.init();
    }

  private init() {
    if (this.isConfigured()) {
      this.jenkinsService.loadRepos().then(() => {
        this.getActionItemsList();
        this.pollIntervalHandle = setInterval(() => {
          this.getActionItemsList();
        }, 30000);
      });
    } else {
      this.actionItems = this.configActionItems;
    }
  }

  private isConfigured() {
      return this.githubConfig.team !== null
        && this.githubConfig.teamId !== null
        && this.githubConfig.userName !== null
        && this.githubConfig.token !== null;
    }

  private loadConfigFromStorage() {
    this.githubConfig.team = localStorage.getItem(MF_GITHUB_TEAM);
    this.githubConfig.teamId = localStorage.getItem(MF_GITHUB_TEAM_ID);
    this.githubConfig.userName = localStorage.getItem(MF_GITHUB_USERNAME);
    this.githubConfig.token = localStorage.getItem(MF_GITHUB_TOKEN);
  }

    private loadConfigActionItems(): ActionItem[] {
      const configActionItems = [];
      const githubTeamActionItem = new ActionItem();
      githubTeamActionItem.name = 'GitHub Team Name:';
      githubTeamActionItem.created = moment.now();
      githubTeamActionItem.priority = 0;
      githubTeamActionItem.source = 'config';
      githubTeamActionItem.type = 'Open PR';
      githubTeamActionItem.model = 'team';
      configActionItems.push(githubTeamActionItem);
      const githubTeamIdActionItem = new ActionItem();
      githubTeamIdActionItem.name = 'GitHub Team ID:';
      githubTeamIdActionItem.created = moment.now();
      githubTeamIdActionItem.priority = 0;
      githubTeamIdActionItem.source = 'config';
      githubTeamIdActionItem.type = 'Open PR';
      githubTeamIdActionItem.model = 'teamId';
      configActionItems.push(githubTeamIdActionItem);
      const githubUsernameActionItem = new ActionItem();
      githubUsernameActionItem.name = 'GitHub User Name:';
      githubUsernameActionItem.created = moment.now();
      githubUsernameActionItem.priority = 0;
      githubUsernameActionItem.source = 'config';
      githubUsernameActionItem.type = 'Open PR';
      githubUsernameActionItem.model = 'userName';
      configActionItems.push(githubUsernameActionItem);
      const githubTokenActionItem = new ActionItem();
      githubTokenActionItem.name = 'GitHub Token:';
      githubTokenActionItem.created = moment.now();
      githubTokenActionItem.priority = 0;
      githubTokenActionItem.source = 'config';
      githubTokenActionItem.type = 'Open PR';
      githubTokenActionItem.model = 'token';
      configActionItems.push(githubTokenActionItem);
      return configActionItems;
    }

    saveConfig() {
      if (this.githubConfig.team) {
        localStorage.setItem(MF_GITHUB_TEAM, this.githubConfig.team);
      }
      if (this.githubConfig.teamId) {
        localStorage.setItem(MF_GITHUB_TEAM_ID, this.githubConfig.teamId);
      }
      if (this.githubConfig.userName) {
        localStorage.setItem(MF_GITHUB_USERNAME, this.githubConfig.userName);
      }
      if (this.githubConfig.token) {
        localStorage.setItem(MF_GITHUB_TOKEN, this.githubConfig.token);
      }
      this.init();
    }

    resetConfig() {
      window.clearInterval(this.pollIntervalHandle);
      this.githubConfig.team = null;
      this.githubConfig.teamId = null;
      this.githubConfig.userName = null;
      this.githubConfig.token = null;
      localStorage.clear();
      this.init();
    }

    getActionItemsList(): void {
        Promise.all([this.githubService.getActionItems(), this.jenkinsService.getActionItems()]).then(
            actionItems => {
                this.actionItems = this.sortByPriorityAndOpenDuration(Array.prototype.concat.apply([], actionItems));
            }
        );
    }

    getTimeElapsed(time) {
        return moment(time).fromNow();
    }

    sortByPriorityAndOpenDuration(actionItems: ActionItem[]): ActionItem[] {
        const red = actionItems.filter(function(a) {
            return a.priority === 1;
        });

        const yellow = actionItems.filter(function(a) {
            return a.priority === 2;
        });

        const green = actionItems.filter(function(a) {
            return a.priority === 3;
        });

        return red.sort(this.sortByOpenDuration)
            .concat(yellow.sort(this.sortByOpenDuration))
            .concat(green.sort(this.sortByOpenDuration));
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
}
