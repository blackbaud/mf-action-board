const USA = 'p-usa01';
const CANADA = 'p-can01';
const EUROPE = 'p-eur01';
const AUSTRALIA = 'p-aus01';

export interface QueueConfiguration {
  service: string;
  scs: string;
  zones: string[];
}

export const DEAD_LETTER_QUEUES = {
  'we-are-batman': [
    {
      service: 'wfdsn',
      scs: 'wfd',
      zones: [USA, CANADA, EUROPE, AUSTRALIA]
    }
    // ,
    // {
    //   service: 'actns',
    //   scs: 'wfd',
    //   zones: [USA, CANADA, EUROPE, AUSTRALIA]
    // },
    // {
    //   service: 'email',
    //   scs: 'wfd',
    //   zones: [USA, CANADA, EUROPE, AUSTRALIA]
    // }
  ]
};
