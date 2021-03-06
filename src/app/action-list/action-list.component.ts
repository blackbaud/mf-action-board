import { Component, OnInit } from '@angular/core';
import { ACTION_PRIORITY_IGNORE, ACTION_PRIORITY_NEW, ACTION_PRIORITY_NOW, ACTION_PRIORITY_SOON, ActionItem} from '../../domain/action-item';
import { GithubService } from '../../github/services/github.service';
import { VstsService } from '../../github/services/vsts.service';
import { JenkinsService } from '../shared/services/jenkins.service';
import { ACTION_ITEM_POLLING_INTERVAL_IN_MS } from '../app.constants';
import { ConfigService } from '../config.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { PollingService } from '../polling.service';
import { DeadLetterQueueService } from '../../github/services/dead-letter-queue.service';

@Component({
  selector: 'mf-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
  actionItems: ActionItem[] = [];
  loading = false;
  lastCount = -1;

  constructor(private githubService: GithubService,
              private vstsService: VstsService,
              private jenkinsService: JenkinsService,
              private configService: ConfigService,
              private pollingService: PollingService,
              private notificationsService: NotificationsService,
              private deadLetterQueueService: DeadLetterQueueService) {
  }

  ngOnInit() {
    this.notificationsService.setUpNoties();
    this.loadActionItems();
  }

  private loadActionItems() {
    if (this.configService.isConfigured()) {
      this.loading = true;
      this.githubService.loadRepos().then(() => {
        this.getActionItemsList();
        this.pollingService.startPoll(ACTION_ITEM_POLLING_INTERVAL_IN_MS, this.getActionItemsList);
      });
    }
  }

  getActionItemsList = (): void => {
    this.loading = true;
    const promises: Promise<ActionItem[]>[] = [];
    if (this.configService.github.isConfigured()) {
      promises.push(this.githubService.getActionItems());
      promises.push(this.jenkinsService.getActionItems());
    }
    if (this.configService.vsts.isConfigured()) {
      promises.push(this.vstsService.getActionItems());
      promises.push(this.deadLetterQueueService.getActionItems());
    }
    Promise.all(promises).then(
      actionItems => {
        const oldActionItems = this.actionItems;
        this.actionItems = this.sortByPriorityAndOpenDuration(Array.prototype.concat.apply([], actionItems));
        const newActionItems = this.getNewActionItems(oldActionItems, this.actionItems);
        this.notificationsService.notifyNewActionItems(newActionItems);
        this.loading = false;
        this.lastCount = this.actionItems.length;
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

  get team() {
    return this.configService.vsts.team || this.configService.github.team || 'Unknown';
  }

  sortByPriorityAndOpenDuration(actionItems: ActionItem[]): ActionItem[] {
    const red = actionItems.filter((a) => {
      return a.priority === ACTION_PRIORITY_NOW;
    });

    const orange = actionItems.filter((a) => {
      return a.priority === ACTION_PRIORITY_SOON;
    });

    const yellow = actionItems.filter((a) => {
      return a.priority === ACTION_PRIORITY_NEW;
    });

    const grey = actionItems.filter((a) => {
      return a.priority === ACTION_PRIORITY_IGNORE;
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
}
