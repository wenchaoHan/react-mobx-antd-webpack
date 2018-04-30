/* eslint-disable no-console */
const log = function consoleLog(...args) {
  if (process.env.NODE_ENV === 'dev') {
    console.log(...args);
  }
};

[
  'debug',
  'error',
  'info',
  'log',
  'warn',
  'dir',
  'dirxml',
  'table',
  'trace',
  'group',
  'groupCollapsed',
  'groupEnd',
  'clear',
  'count',
  'assert',
  'markTimeline',
  'profile',
  'profileEnd',
  'timeline',
  'timelineEnd',
  'time',
  'timeEnd',
  'timeStamp',
  'memory',
].forEach((key) => {
  log[key] = function targetLog(...args) {
    if (process.env.NODE_ENV === 'dev') {
      console[key](...args);
    }
  };
});

export default log;
