import { GithubConfig } from '../domain/github-config';
import { VstsConfig } from '../domain/vsts-config';

export const TEST_GITHUB_CONFIG: GithubConfig = {
  team: 'bros',
  teamId: '1010101',
  userName: 'dude bro',
  token: 'goober',
  watchList: '',
  isConfigured: () => true
};

export const TEST_VSTS_CONFIG: VstsConfig = {
  team: 'bros',
  token: 'token',
  username: 'dude bro',
  isConfigured: () => true
};

export const TEST_GITHUB_PR: any = {
  labels: [{name: 'a random label'}],
  createdAt: 1502982366420,
  url: 'https://www.github.com/blackbaud/testRepo/issues',
  html_url: 'https://www.github.com/blackbaud/testRepo',
  title: 'Baby\'s first PR!'
};
