import { Injectable } from '@angular/core';
import { GithubConfig } from '../domain/github-config';
import { VstsConfig } from '../domain/vsts-config';
import { CONFIG } from './app.constants';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

export abstract class AbstractConfigServiceIface {
  private static VSTS = 'vsts';
  private static GITHUB = 'github';
  github: GithubConfig;
  vsts: VstsConfig;

  public setConfigValue(type: string, key: string, value: string) {
    if (type === AbstractConfigServiceIface.VSTS) {
      this.vsts[key] = value;
    } else {
      this.github[key] = value;
    }
  }

  public getConfigValue(type: string, key: string): string {
    if (type === AbstractConfigServiceIface.VSTS) {
      return this.vsts[key];
    } else {
      return this.github[key];
    }
  }

  getVstsConfigValue(key) {
    return this.getConfigValue(AbstractConfigServiceIface.VSTS, key);
  }

  getGitHubConfigValue(key) {
    return this.getConfigValue(AbstractConfigServiceIface.GITHUB, key);
  }

  setVstsConfigValue(key, value) {
    this.setConfigValue(AbstractConfigServiceIface.VSTS, key, value);
  }

  setGitHubConfigValue(key, value) {
    this.setConfigValue(AbstractConfigServiceIface.GITHUB, key, value);
  }

  public isConfigured() {
    return this.github.isConfigured() || this.vsts.isConfigured();
  }

  public abstract saveConfig(): void;
}

@Injectable()
export class ConfigService extends AbstractConfigServiceIface {
  public github: GithubConfig;
  public vsts: VstsConfig;
  public repos;
  public options: RequestOptions;

  constructor() {
    super();
    this.github = new GithubConfig();
    this.vsts = new VstsConfig();
    this.loadConfigFromStorage();
  }

  private loadConfigFromStorage(): void {
    this.github.team = localStorage.getItem(CONFIG.GITHUB.TEAM);
    this.github.teamId = localStorage.getItem(CONFIG.GITHUB.TEAM_ID);
    this.github.userName = localStorage.getItem(CONFIG.GITHUB.USERNAME);
    this.github.token = localStorage.getItem(CONFIG.GITHUB.TOKEN);
    this.github.watchList = localStorage.getItem(CONFIG.GITHUB.WATCH_LIST);
    this.vsts.username = localStorage.getItem(CONFIG.VSTS.USERNAME);
    this.vsts.token = localStorage.getItem(CONFIG.VSTS.TOKEN);
    this.vsts.team = localStorage.getItem(CONFIG.VSTS.TEAM);
    this.options = new RequestOptions({
      headers: new Headers({'Authorization': 'Basic ' + window.btoa(this.github.userName + ':' + this.github.token)})
    });
  }

  public saveConfig(): void {
    if (this.github.team) {
      localStorage.setItem(CONFIG.GITHUB.TEAM, this.github.team);
    }
    if (this.github.teamId) {
      localStorage.setItem(CONFIG.GITHUB.TEAM_ID, this.github.teamId);
    }
    if (this.github.userName) {
      localStorage.setItem(CONFIG.GITHUB.USERNAME, this.github.userName);
    }
    if (this.github.token) {
      localStorage.setItem(CONFIG.GITHUB.TOKEN, this.github.token);
    }
    if (this.github.watchList) {
      localStorage.setItem(CONFIG.GITHUB.WATCH_LIST, this.github.watchList);
    }
    if (this.vsts.username) {
      localStorage.setItem(CONFIG.VSTS.USERNAME, this.vsts.username);
    }
    if (this.vsts.token) {
      localStorage.setItem(CONFIG.VSTS.TOKEN, this.vsts.token);
    }
    if (this.vsts.team) {
      localStorage.setItem(CONFIG.VSTS.TEAM, this.vsts.team);
    }
  }

}
