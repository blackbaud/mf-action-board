import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

import { ConfigService } from '../../app/config.service';
import { VSTS_REPOS } from './vsts-repos';
import { ActionItem, VstsPullRequest, VstsBuild, VstsRelease } from '../../domain/action-item';

@Injectable()
export class VstsService {
  ACCOUNT = 'blackbaud';
  COLLECTION = 'DefaultCollection';
  VERSION = '2.0';
  PREVIEW_VERSION = '4.0-preview.3';
  PROJECT = 'Products';
  ROOTURL = `https://${this.ACCOUNT}.VisualStudio.com/${this.COLLECTION}/${this.PROJECT}`;
  PREVIEW_URL = `https://${this.ACCOUNT}.vsrm.VisualStudio.com/${this.PROJECT}`;

  constructor(private http: Http, private configService: ConfigService) {
  }

  getActionItems(): Promise<ActionItem[]> {
    const promises = [this.getFailedBuilds(), this.getPullRequests(), this.getFailedReleases()];
    return Promise.all(promises).then(items => [].concat.apply([], items));
  }

  getFailedBuilds(): Promise<ActionItem[]> {
    return this.getBuilds()
      .then(builds => builds.filter(this.isFailedBuild))
      .then(failedBuildInfo => failedBuildInfo.map(info => new VstsBuild(info)));
  }

  getFailedReleases(): Promise<ActionItem[]> {
    return this.getReleases()
      .then(releases => releases.filter(this.isFailedRelease))
      .then(failedReleaseInfo => failedReleaseInfo.map(info => new VstsRelease(info)));
  }

  private isFailedBuild(info: any): boolean {
    return info !== undefined && info.result !== 'succeeded';
  }

  private isFailedRelease(info: any): boolean {
    if (info === undefined) {
      return false;
    }
    const failed_envs = info.environments.some(env => env.status !== 'succeeded' && env.status !== 'canceled');
    const pending_approvals = info.environments
      .some(env => env.preDeployApprovals
        .some(approval => approval.status === 'pending'));

    return failed_envs || pending_approvals;
  }

  getBuilds(): Promise<any> {
    return this.getBuildIds()
      .then(ids => ids.filter(id => id !== null))
      .then(ids => {
        const promises = ids.map(this.getLastMasterBuild.bind(this));
        return Promise.all(promises).then(builds => [].concat.apply([], builds));
      });
  }

  getReleases(): Promise<any> {
    return this.getReleaseDefinitionIds()
      .then(definition_ids => definition_ids.filter(id => id !== null))
      .then(definition_ids => {
        const promises = definition_ids.map(this.getLatestReleaseId.bind(this));
        return Promise.all(promises).then(release_ids => [].concat.apply([], release_ids));
      })
      .then(release_ids => release_ids.filter(id => id !== null))
      .then(release_ids => {
        const promises = release_ids.map(this.getRelease.bind(this));
        return Promise.all(promises).then(releases => [].concat.apply([], releases));
      });
  }

  getRelease(release_id: number): Promise<any> {
    return this.http.get(this.releaseUrl(release_id), this.requestOptions)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  getLastMasterBuild(definition_id: number): Promise<any> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    return this.http.get(this.buildsUrl(definition_id), this.requestOptions)
      .toPromise()
      .then(response => response.json().value)
      .then(builds => builds.filter(build => build.sourceBranch === 'refs/heads/master'))
      // this assumes that the response in reverse chronological order,
      // which isn't explicitly stated in the docs, but seems empirically true.
      .then(builds => builds[0])
      .catch(this.handleError);
  }

  getBuildIds(): Promise<number[]> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    const buildList = this.repos.build ?  this.repos.build : this.repos;
    const promises: Promise<number>[] = buildList.map(repo => {
      return this.http.get(this.buildDefinitionsUrl(repo), this.requestOptions)
        .toPromise()
        .then(response => response.json())
        .then(response => (response.count === 1) ? response.value[0].id : null)
        .catch(this.handleError);
    });
    return Promise.all(promises);
  }

  getPullRequests(): Promise<ActionItem[]> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    const repoList = this.repos.repo ?  this.repos.repo : this.repos;
    const promises: Promise<VstsPullRequest[]>[] = repoList.map(repo => {
      return this.http.get(this.prUrl(repo), this.requestOptions)
        .toPromise()
        .then(response => response.json().value.map((item => new VstsPullRequest(item))))
        .catch(this.handleError);
    });
    return Promise.all(promises).then(prPromiseResults => [].concat.apply([], prPromiseResults));
  }

  getReleaseDefinitionIds(): Promise<number[]> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    const releaseList = this.repos.release ?  this.repos.release : this.repos;
    const promises: Promise<VstsPullRequest[]>[] = releaseList.map(repo => {
      return this.http.get(this.releaseDefinitionsUrl(repo), this.requestOptions)
        .toPromise()
        .then(response => response.json())
        .then(response => this.getReleaseDefinitionByRepo(repo, response))
        .catch(this.handleError);
      });
    return Promise.all(promises).then(prPromiseResults => [].concat.apply([], prPromiseResults));
  }

  getReleaseDefinitionByRepo(repo: string, definitions) {
    if (definitions.count === 0) {
      return null;
    } else {
      const definition = definitions.value.find(response => response.name === repo);
      return definition ? definition.id : null;
    }
  }

  getLatestReleaseId(definition_id: number): Promise<number> {
    if (!this.configService.vsts.isConfigured()) {
      return this.handleError('Ignoring VSTS calls since not configured');
    }
    return this.http.get(this.releasesUrl(definition_id), this.requestOptions)
      .toPromise()
      .then(response => response.json())
      .then(response => (response.count >= 1) ? response.value[0].id : null)
      .catch(this.handleError);
  }

  private get requestOptions(): RequestOptions {
    const username = this.configService.vsts.username;
    const token = this.configService.vsts.token;
    const authToken = window.btoa(`${username}:${token}`);
    const headers = new Headers({'Authorization': `Basic ${authToken}`});
    return new RequestOptions({headers: headers});
  }

  private get repos() {
    return VSTS_REPOS[this.configService.vsts.team];
  }

  private handleError(error: any, errorResult = {}): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve(errorResult);
  }

  private last_month() {
    return moment().subtract(1, 'month');
  }

  private prUrl(repo): string {
    return `${this.ROOTURL}/_apis/git/repositories/${repo}/pullRequests?api-version=${this.VERSION}`;
  }

  private buildDefinitionsUrl(repo): string {
    return `${this.ROOTURL}/_apis/build/definitions/?api-version=${this.VERSION}&name=${repo}`;
  }

  private buildsUrl(definition_id: number): string {
    const root = `${this.ROOTURL}/_apis/build/builds/?api-version=${this.VERSION}`;
    return `${root}&definitions=${definition_id}&minFinishTime=${this.last_month().format()}`;
  }

  private releaseDefinitionsUrl(repo): string {
    return `${this.PREVIEW_URL}/_apis/release/definitions/?api-version=${this.PREVIEW_VERSION}&searchText=${repo}`;
  }

  private releasesUrl(definition_id: number): string {
    return `${this.PREVIEW_URL}/_apis/release/releases/?api-version=${this.PREVIEW_VERSION}&definitionId=${definition_id}`;
  }

  private releaseUrl(release_id: number): string {
    return `${this.PREVIEW_URL}/_apis/release/releases/${release_id}?api-version=${this.PREVIEW_VERSION}`;
  }
}
