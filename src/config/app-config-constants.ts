// It is not advised to make this constant very frequent
// since Github rate limits requests
export const ACTION_ITEM_POLLING_INTERVAL_IN_MS = 30000;

export const GITHUB_PR_SLA_MS = 14400000;
export const JENKINS_ACTION_ITEM_SLA_MS = 43200000;
export const JENKINS_JOB_BUILDING_COLOR = 'red_anime';
export const JENKINS_ENV = [
  'https://jenkins-oscf-dev.blackbaudcloud.com/',
  'https://jenkins-oscf-releases.blackbaudcloud.com/'
];
