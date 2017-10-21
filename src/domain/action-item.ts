import { GITHUB_PR_SLA_MS, JENKINS_ACTION_ITEM_SLA_MS } from '../config/app-config-constants';
import { DO_NOT_MERGE_LABEL_NAME } from '../github/services/github.constants';
import { JobDetails } from './jobDetails';

export class BaseActionItem {
  url: string;
  name: string;
  created: number;
  priority: number;
  source: string;
  model: string;
}

export abstract class PullRequest extends BaseActionItem {
  do_not_merge: boolean;

  static calcPriority(created: number, do_not_merge: boolean): number {
      const timeElapsed = Date.now() - created;
      if (do_not_merge === true) {
        return 4;
      } else if (timeElapsed >= GITHUB_PR_SLA_MS) {
        return 1;
      } else if (timeElapsed >= (GITHUB_PR_SLA_MS / 2)) {
        return 2;
      } else {
        return 3;
      }
  }
}

export class GitHubPullRequest extends PullRequest {
  constructor(prInfo: any) {
    super();
    const repo = prInfo.url.match('/blackbaud/(.*)/issues')[1];
    this.name = `${repo}: ${prInfo.title}`;
    this.source = 'pr';
    this.created = new Date(prInfo.created_at).getTime();
    this.url = prInfo.html_url;
    this.do_not_merge = prInfo.labels.map(l => l.name).includes(DO_NOT_MERGE_LABEL_NAME);
    this.priority = PullRequest.calcPriority(this.created, this.do_not_merge);
  }
}

export class VstsPullRequest extends PullRequest {
  ACCOUNT = 'blackbaud';
  COLLECTION = 'DefaultCollection';
  VERSION = '2.0';
  PROJECT = 'Products';
  ROOTURL = `https://${this.ACCOUNT}.VisualStudio.com/${this.COLLECTION}/${this.PROJECT}`;

  constructor(prInfo: any) {
    super();
    const repo = prInfo.repository.name;
    this.name = `${repo}: ${prInfo.title}`;
    this.source = 'pr';
    this.created = new Date(prInfo.creationDate).getTime();
    this.url = `${this.ROOTURL}/_git/${repo}/pullrequest/${prInfo.pullRequestId}`;
    this.do_not_merge = false;
    this.priority = PullRequest.calcPriority(this.created, this.do_not_merge);
  }
}

export class Build extends BaseActionItem {
  building: boolean;
  buildPercentage: number;

  private static calcBuildPercentage(building: boolean, timestampCurrentBuild: string, estimatedDuration: string): number {
    if (building) {
      const elapsedDuration = Date.now() - parseInt(timestampCurrentBuild, 10);
      return Math.max(5, Math.floor((elapsedDuration * 100) / parseInt(estimatedDuration, 10)));
    } else {
      return null;
    }
  }

  private static calcPriority(created: number): number {
    const timeElapsed = Date.now() - created;
    if (timeElapsed >= JENKINS_ACTION_ITEM_SLA_MS) {
      return 1;
    } else if (timeElapsed >= (JENKINS_ACTION_ITEM_SLA_MS / 2)) {
      return 2;
    } else {
      return 3;
    }
  }

  constructor(jobDetails: JobDetails) {
    super();
    this.name = jobDetails.jobName;
    this.source = 'jenkins';
    this.created = new Date(jobDetails.timestampLastCompletedBuild).getTime();
    this.url = jobDetails.url;
    this.building = jobDetails.building;
    this.buildPercentage = Build.calcBuildPercentage(this.building, jobDetails.timestampCurrentBuild, jobDetails.estimatedDuration);
    this.priority = Build.calcPriority(this.created);
  }
}

export type ActionItem = PullRequest | Build | BaseActionItem;
