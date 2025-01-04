import { useState } from 'react';

export default function Home() {
  const [currentSessions, _setCurrentSessions] = useState();
  const [oldSessions, _setOldSessions] = useState();

  return (
    <div className='w-full flex flex-col gap-4'>
      <div>{JSON.stringify(currentSessions)}</div>
      <div>{JSON.stringify(oldSessions)}</div>
    </div>
  );
}
