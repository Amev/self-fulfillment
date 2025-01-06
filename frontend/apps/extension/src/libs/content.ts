import { PING_INTERVAL } from 'common-types';

let intervalID;

clearInterval(intervalID);

try {
  chrome.runtime.sendMessage({
    action: 'startSession',
    timestamp: Date.now(),
  });
} catch {
  /* empty */
}

intervalID = setInterval(() => {
  if (!document.hidden) {
    try {
      chrome.runtime.sendMessage({
        action: 'sessionPing',
        timestamp: Date.now(),
      });
    } catch {
      /* empty */
    }
  }
}, PING_INTERVAL);
