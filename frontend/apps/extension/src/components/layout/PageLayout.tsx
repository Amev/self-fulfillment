import { ReactNode } from 'react';

export interface PageLayouProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayouProps) {
  return (
    <div className='flex flex-col items-center w-full max-w-sm p-8 mx-auto bg-white shadow-2xl rounded-3xl gap-y-8'>
      {children}
    </div>
  );
}
