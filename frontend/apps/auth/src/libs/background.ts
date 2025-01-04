import { Site, SITES } from 'common-types';
import { v4 as uuidv4 } from 'uuid';

interface Session {
  site: Site;
  start: number;
  end?: number;
  id: string;
}

type SessionStorage = Record<number, Session>;

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set({
      currentSessions: {} as SessionStorage,
      oldSessions: {} as Session[],
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
  const site = Object.entries(SITES).find(([, siteURL]) =>
    tab.url?.includes(siteURL),
  );
  let { currentSessions, oldSessions } = await chrome.storage.local.get({
    currentSessions: {} as SessionStorage,
    oldSessions: [] as Session[],
  });
  const session = (currentSessions as SessionStorage)[tabId];

  if (!Array.isArray(oldSessions)) {
    oldSessions = [];
  }
  if (currentSessions !== Object(currentSessions)) {
    currentSessions = {};
  }

  if (tab.active && site) {
    if (session && session.site !== site[0]) {
      oldSessions.push({
        ...session,
        end: Date.now(),
      });
    }

    if (!session || session.site !== site[0]) {
      currentSessions[tabId] = {
        site: site[0],
        start: Date.now(),
        id: uuidv4(),
      };
    }
  } else if (session && !session.end) {
    oldSessions.push({
      ...session,
      end: Date.now(),
    });
    delete currentSessions[tabId];
  }

  chrome.storage.local.set({
    currentSessions,
    oldSessions,
  });
});
