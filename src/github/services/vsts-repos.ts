// this is an hardcoded constant to map a team to the VSTS repos they 'own'.
// this is because VSTS does not have a concept of a team owning a repo. :shrug:
export const VSTS_REPOS = {
  'micro-cervezas': [
    'bluemoon-admin-login',
    'bluemoon-config-server',
    'skyux-routes-long',
    'bb-java-base-docker-image',
    'skyux-lib-form',
    'skyux-lib-button-group',
    'identity-token',
    'skyux-spa-constituent-forms',
    'skyux-spa-constituent-form-submission',
    'constituent-forms',
    'constituent-form-submission',
    'skyux-lib-constituent-form'
  ],
  'we-are-batman': [
    'actions-adapter',
    'azure-scheduler-sdk',
    'common-provider-pact',
    'constituent-adapter',
    'wfd-designer',
    'wfd-actions-adapter',
    'wfd-constituent-adapter',
    'workflow-designer',
    'wfd-email-adapter',
    'workflow-designer-prod-tester',
    'skyux-lib-action-form',
    'skyux-lib-browser-cache',
    'skyux-spa-apply-workflows',
    'skyux-spa-workflow-designer-docs',
    'skyux-spa-workflows',
    'skyux-spa-workflows-supportal',
    'skyux-lib-dlq-management'
  ],
  'animaniacs': [
    'bb-permissions-marketing-social',
    'skyux-spa-social',
    'skyux-spa-social-supportal',
    'skyux-spa-social-synth-tests',
    'social-metrics',
    'social-metrics-database',
    'social-posting',
    'rlp-rlshp-svc',
    'skyux-lib-relationship-form'
  ],
  'highlander': {
    'repo': [
      'donation-form-int-tests',
      'donation-form-reporting',
      'donation-form-reporting-database',
      'donation-form-layout',
      'email-adapter',
      'transactor',
      'form-consent',
      'environment-form-config',
      'donor-form-synth-monitor',
      'skyux-spa-donation-forms-supportal',
      'skyux-spa-donation-forms',
      'skyux-spa-donation-form-designer',
      'skyux-spa-donor-form',
      'skyux-lib-form'
    ],
    'build': [
      'donation-form-int-tests',
      'donation-form-reporting',
      'donation-form-reporting-database',
      'donation-form-layout',
      'email-adapter',
      'transactor',
      'form-consent',
      'environment-form-config',
      'donor-form-synth-monitor',
      'skyux-spa-donation-forms-supportal',
      'skyux-spa-donation-forms',
      'skyux-spa-donation-form-designer',
      'skyux-spa-donor-form',
      'skyux-lib-form'
    ],
    'release': [
      'fms-efcfg-v2',
      'fms-cnsnt-v2',
      'fms-txntr-v2',
      'fms-rport-v2',
      'fms-lyout-v2',
      'fms-emadp-v2',
      'skyux-spa-donation-forms-supportal',
      'skyux-spa-donation-forms',
      'skyux-spa-donation-form-designer',
      'skyux-spa-donor-form'
    ],
  },
  'voltron' : [
    'installment-engine',
    'installment-engine-int-tests',
    'skyux-spa-installment-scheduler',
    'skyux-spa-installment-engine-supportal',
    'java-client-payments',
    'recurring-gift-schedule-formatter'
  ],
  'cerebro' : [
    'receipt-manager',
    'transaction-batcher',
    'email-adapter',
    'skyux-spa-receipt-manager'
  ],
  'illuminati' : [
    'social-donation-receiver',
    'facebook-api-client'
  ]
};
