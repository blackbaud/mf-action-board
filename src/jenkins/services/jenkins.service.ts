import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { JobDetails } from '../../domain/jobDetails';
import { ActionItem, Build, JenkinsBuild } from '../../domain/action-item';

import {
  JENKINS_JOB_BUILDING_COLOR, JENKINS_ENV
} from '../../config/app-config-constants';
import { ConfigService } from '../../app/config.service';

@Injectable()
export class JenkinsService {

  constructor(private http: Http, private configService: ConfigService) {}

  getActionItems(): Promise<ActionItem[]> {
    const envPromises = [];
    const newActionItems: Build[] = [];
    JENKINS_ENV.forEach((url) => {
      const promise = this.http.get(
        url + 'api/json?tree=jobs[name,color,inQueue,lastCompletedBuild[number,timestamp,result,url],lastBuild[number,timestamp,estimatedDuration]]',
        this.configService.options)
        .toPromise()
        .then((response) => this.processJobs(response, newActionItems))
        .catch(this.handleError);
      envPromises.push(promise);
    });
    return new Promise<ActionItem[]>((resolve) => {
      Promise.all(envPromises).then(() => {
        resolve(newActionItems);
      });
    });
  }

  private processJobs(response, newActionItems) {
    const jobs = response.json().jobs;
    jobs.forEach((job) => this.addNewActionItem(job, newActionItems));
  }

  private addNewActionItem(job, newActionItems) {
    const lastCompletedBuild = job.lastCompletedBuild;
    const jobDetails = new JobDetails();
    if (lastCompletedBuild) {
      if (this.includeJob(job)) {
        const jobStatus = lastCompletedBuild.result;
        jobDetails.result = jobStatus;
        jobDetails.jobName = job.name;
        jobDetails.timestampLastCompletedBuild = lastCompletedBuild.timestamp;
        jobDetails.building = this.isBuilding(job);
        jobDetails.url = lastCompletedBuild.url;
        const lastBuild = job.lastBuild;
        jobDetails.estimatedDuration = lastBuild.estimatedDuration;
        if (lastBuild && jobDetails.building) {
          jobDetails.timestampCurrentBuild = lastBuild.timestamp;
        }
        newActionItems.push(new JenkinsBuild(jobDetails));
      }
    }
  }

  private isBuilding(job) {
    return job.inQueue || job.color === JENKINS_JOB_BUILDING_COLOR;
  }

  // check to see if it is in the watch list from configuration
  private isInWatchList(jobName) {
    return this.configService.github.watchList && this.configService.github.watchList.split(', ').includes(jobName);
  }

  private includeJob(job) {
    const jobName = job.name;
    const jobType = jobName.substring(jobName.indexOf('_') + 1, jobName.length);
    const repoNameFromJob = this.determineRepoName(jobName);
    return jobType !== 'release'
      && jobType !== 'promote'
      && job.color !== 'disabled'
      && (this.configService.repos[repoNameFromJob] || this.isInWatchList(repoNameFromJob))
      // hardcoded exclusion of two builds that  @micro-dev has tickets to go fix.
      && jobName !== 'notifications-component_int-apps-test'
      && jobName !== 'notifications-component_dev-apps-test-nightly'
      && (job.lastCompletedBuild.result === 'FAILURE' || job.lastCompletedBuild.result === 'UNSTABLE');
  }

  private determineRepoName(jobName: any) {
    let repoName;
    if (jobName.startsWith('luminate-online')) {
      repoName = 'luminate-online';
    } else {
      repoName = jobName.substring(0, jobName.indexOf('_'));
    }
    return repoName;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve();
  }

  private buildTypeString(jobDetails: JobDetails): string {
    return 'Jenkins Build ' + (jobDetails.building ? ' - building' : ' - ' + jobDetails.result);
  }

  private evaluateBuildPercentage(jobDetails: JobDetails): number {
    if (jobDetails.building) {
      const elapsedDuration = Date.now() - parseInt(jobDetails.timestampCurrentBuild, 10);
      return Math.max(5, Math.floor((elapsedDuration * 100) / parseInt(jobDetails.estimatedDuration, 10)));
    } else {
      return null;
    }
  }
}
