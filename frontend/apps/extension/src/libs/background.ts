import {
  PING_INTERVAL,
  type Session,
  type SessionStorage,
  type SiteName,
  SITES,
  type SiteURL,
} from 'common-types';
import { v4 as uuidv4 } from 'uuid';

interface TabInfos {
  id: number;
  url?: string;
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.sync.set({
      pendingSessions: {} as SessionStorage,
      closedSessions: [] as Session[],
    });
  }
});

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (
    sender.tab &&
    sender.tab.id !== undefined &&
    sender.tab.url !== undefined
  ) {
    switch (request.action) {
      case 'startSession':
        startSession(
          {
            id: sender.tab.id,
            url: sender.tab.url,
          },
          request.timestamp,
        );
        break;
      case 'sessionPing':
        sessionPing(
          {
            id: sender.tab.id,
            url: sender.tab.url,
          },
          request.timestamp,
        );
        break;
      default:
        break;
    }
  }
});

async function startSession(
  { id: tabId, url = '.' }: TabInfos,
  timestamp: number = Date.now(),
) {
  console.log('Create session message…');
  const site = Object.entries(SITES).find(([, siteURL]) =>
    url.split('.')[1].includes(siteURL.split('.')[1]),
  ) as [SiteName, SiteURL] | undefined;

  if (!site) {
    return;
  }

  const { pendingSessions, closedSessions } = await getStorageSessions();
  const session = pendingSessions[tabId];

  if (!session) {
    pendingSessions[tabId] = {
      site: site[0],
      start: timestamp,
      end: timestamp,
      id: uuidv4(),
    };
  } else if (
    session.site !== site[0] ||
    timestamp - session.end > 1.2 * PING_INTERVAL
  ) {
    closedSessions.push({ ...session });
    pendingSessions[tabId] = {
      site: site[0],
      start: timestamp,
      end: timestamp,
      id: uuidv4(),
    };
  } else {
    pendingSessions[tabId].end = timestamp;
  }

  console.log(pendingSessions, closedSessions);
  chrome.storage.sync.set({
    pendingSessions,
    closedSessions,
  });
}

async function sessionPing(
  { id: tabId, url = '.' }: TabInfos,
  timestamp: number = Date.now(),
) {
  console.log('Receiving ping message…');
  const site = Object.entries(SITES).find(([, siteURL]) =>
    url.split('.')[1].includes(siteURL.split('.')[1]),
  ) as [SiteName, SiteURL] | undefined;

  if (!site) {
    return;
  }

  const { pendingSessions, closedSessions } = await getStorageSessions();
  const session = pendingSessions[tabId];

  if (!session) {
    pendingSessions[tabId] = {
      site: site[0],
      start: timestamp - PING_INTERVAL,
      end: timestamp,
      id: uuidv4(),
    };
  } else if (
    session.site !== site[0] ||
    timestamp - session.end > 1.2 * PING_INTERVAL
  ) {
    closedSessions.push({ ...session });
    pendingSessions[tabId] = {
      site: site[0],
      start: timestamp,
      end: timestamp,
      id: uuidv4(),
    };
  } else {
    pendingSessions[tabId].end = timestamp;
  }

  console.log(pendingSessions, closedSessions);
  chrome.storage.sync.set({
    pendingSessions,
    closedSessions,
  });
}

async function getStorageSessions() {
  let { pendingSessions, closedSessions } = await chrome.storage.sync.get({
    pendingSessions: {},
    closedSessions: [],
  });

  if (!Array.isArray(closedSessions)) {
    closedSessions = [];
  }
  if (pendingSessions !== Object(pendingSessions)) {
    pendingSessions = {};
  }

  console.log(pendingSessions, closedSessions);
  return { pendingSessions, closedSessions } as {
    pendingSessions: SessionStorage;
    closedSessions: Session[];
  };
}

const CHECK_PENDING_SESSIONS_ALARM = 'check-pending-sessions';

async function checkAlarmState() {
  const alarm = await chrome.alarms.get(CHECK_PENDING_SESSIONS_ALARM);

  if (!alarm) {
    await chrome.alarms.create(CHECK_PENDING_SESSIONS_ALARM, {
      periodInMinutes: 1,
      delayInMinutes: 1,
    });
  }
}

checkAlarmState();

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === CHECK_PENDING_SESSIONS_ALARM) {
    console.log('Checking pending sessions…');
    const { pendingSessions, closedSessions } = await getStorageSessions();

    Object.entries(pendingSessions).forEach(([tabId, pendingSession]) => {
      if (Date.now() - pendingSession.end > 2 * PING_INTERVAL) {
        closedSessions.push({ ...pendingSession });
        delete pendingSessions[parseInt(tabId, 10)];
      }
    });

    console.log(pendingSessions, closedSessions);
    chrome.storage.sync.set({
      pendingSessions,
      closedSessions,
    });
  }
});
