import {AbstractConfigServiceIface} from '../app/config.service';
import {VstsConfig} from '../domain/vsts-config';
import {GithubConfig} from '../domain/github-config';
import {Injectable} from '@angular/core';

@Injectable()
export class FakeConfigService extends AbstractConfigServiceIface {
  constructor(public github: GithubConfig, public vsts: VstsConfig) {
    super();
  }

  saveConfig(): void {
  }
}
