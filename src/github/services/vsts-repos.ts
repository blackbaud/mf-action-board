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
    'skyux-spa-donation-forms',
    'identity-token',
    'skyux-spa-reactive-demo',
    'skyux-spa-donor-form'
  ],
  'we-are-batman': [
    'skyux-spa-workflows',
    'workflow-designer',
    'azure-scheduler-sdk',
    'common-provider-pact',
    'actions-adapter',
    'constituent-adapter',
    'skyux-spa-workflow-designer-docs',
    'skyux-lib-action-form',
    'skyux-lib-browser-cache'
  ],
  'brady-bunch': [
    'social-posting',
    'token-store',
    'skyux-lib-common-ui-test',
    'skyux-spa-social',
    'bluemoon-local-router',
    'social-posting-int-tests',
    'skyux-spa-social-smoke-tests'
  ],
  'highlander': [
    'forms-management',
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
    'common-pdf'
  ]
};
