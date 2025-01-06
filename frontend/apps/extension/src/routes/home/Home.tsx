import { Button, Card, Statistic } from 'antd';
import { Session, SessionStorage, SITES } from 'common-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [pendingSessions, setCurrentSessions] = useState<SessionStorage>({});
  const [closedSessions, setOldSessions] = useState<Session[]>([]);
  const loadSessions = useCallback(async () => {
    let {
      pendingSessions: newCurrentSessions,
      closedSessions: newOldSessions,
    } = await chrome.storage.sync.get({
      pendingSessions: {} as SessionStorage,
      closedSessions: [] as Session[],
    });

    if (!Array.isArray(newOldSessions)) {
      newOldSessions = [];
    }
    if (newCurrentSessions !== Object(newCurrentSessions)) {
      newCurrentSessions = {};
    }

    setCurrentSessions(newCurrentSessions as SessionStorage);
    setOldSessions(newOldSessions as Session[]);
  }, []);
  const mergedSessions = useMemo(() => {
    return Object.keys(SITES).map((siteName) => {
      const sessions = [
        ...Object.values(pendingSessions).filter(
          ({ site }) => site === siteName,
        ),
        ...closedSessions.filter(({ site }) => site === siteName),
      ];
      if (sessions.length === 0) {
        return {
          siteName,
          sessions: [],
        };
      }

      sessions.sort((a, b) => a.start - b.start);
      const result: Session[] = [sessions[0]];
      console.log(sessions);
      sessions.forEach((session) => {
        const currentSession = result[result.length - 1];

        console.log(currentSession.id);
        console.log(
          `Current session start: ${new Date(currentSession.start).toLocaleTimeString()}`,
        );
        console.log(
          `Current session end: ${new Date(currentSession.end).toLocaleTimeString()}`,
        );
        console.log(session.id);
        console.log(
          `Session start: ${new Date(session.start).toLocaleTimeString()}`,
        );
        console.log(
          `Session end: ${new Date(session.end).toLocaleTimeString()}`,
        );
        if (session.start > currentSession.end) {
          console.log('Push');
          result.push(session);
        } else {
          console.log(
            `Replace by ${session.end > currentSession.end ? 'session end' : 'current end'}`,
          );
          result[result.length - 1].end = Math.max(
            session.end,
            currentSession.end,
          );
        }
      });

      return {
        siteName,
        sessions: result.map((session) => ({
          ...session,
          duration: (session.end - session.start) / (60 * 1000),
        })),
      };
    });
  }, [closedSessions, pendingSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  console.log(pendingSessions, closedSessions, mergedSessions);

  return (
    <div className='w-full flex flex-col gap-4 px-6 py-4'>
      <h1 className='text-xl'>{t('home.title')}</h1>
      {mergedSessions.map(({ siteName, sessions }) => {
        const duration = sessions.reduce(
          (acc, session) => acc + session.duration,
          0,
        );

        return (
          <Card
            bordered={false}
            key={siteName}
          >
            <Statistic
              title={siteName}
              value={`${Math.round(duration)} min`}
            />
          </Card>
        );
      })}
      <div className='w-20 mx-auto'>
        <Button onClick={loadSessions}>Refresh</Button>
      </div>
    </div>
  );
}
