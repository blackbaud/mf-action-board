// this is an hardcoded constant to map a team to the VSTS repos they 'own'.
// this is because VSTS does not have a concept of a team owning a repo. :shrug:
export const VSTS_REPOS = {
  'micro-cervezas': [
    'common-test',
    'common-retry',
    'bluemoon-admin-login',
    'bluemoon-config-server',
    'java-project-builder',
    'skyux-routes-long',
    'social-donation-receiver',
    'facebook-api-client',
    'common-logging',
    'bb-java-base-docker-image',
    'skyux-lib-form',
    'skyux-lib-button-group',
    'skyux-spa-donation-forms',
    'identity-token',
    'skyux-spa-reactive-demo',
    'skyux-spa-donor-form',
    'donor-form-synth-monitor'
  ],
  'we-are-batman': [
    'actions-adapter',
    'azure-scheduler-sdk',
    'common-provider-pact',
    'constituent-adapter',
    'workflow-designer',
    'skyux-lib-action-form',
    'skyux-lib-browser-cache',
    'skyux-spa-apply-workflows',
    'skyux-spa-workflow-designer-docs',
    'skyux-spa-workflows',
    'skyux-spa-workflows-supportal'
  ],
  'brady-bunch': [
    'bb-permissions-marketing-social',
    'bluemoon-local-router',
    'skyux-lib-common-ui-test',
    'skyux-spa-social',
    'skyux-spa-social-smoke-tests',
    'social-metrics',
    'social-metrics-database',
    'social-posting'
  ],
  'highlander': [
    'donation-form-int-tests',
    'donation-form-reporting',
    'donation-form-reporting-database',
    'donation-form-layout',
    'common-async',
    'form-consent',
    'transactor'
  ],
  'voltron' : [
    'installment-engine',
    'installment-engine-int-tests',
    'skyux-spa-installment-scheduler',
    'skyux-spa-installment-engine-supportal',
    'common-payments-client'
  ],
  'cerebro' : [
    'receipt-manager',
    'transaction-batcher',
    'receipter',
    'email-adapter',
    'skyux-spa-receipt-manager'
  ]
};
