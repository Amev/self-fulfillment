import { useTranslation } from 'react-i18next';

interface GoogleProps {
  redirectURI: string;
}

export default function Google({ redirectURI }: GoogleProps) {
  const { t } = useTranslation();
  const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirect = window.location.origin;
  const response = 'code';
  const scope = 'openid profile email';

  const state = encodeURI(
    JSON.stringify({
      provider: 'google',
      redirectURI,
    }),
  );

  return (
    <div className='w-full text-center'>
      <a
        href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirect}&response_type=${response}&scope=${scope}&state=${state}`}
      >
        <button className='w-full h-10 leading-6 font-semibold !text-base rounded-full border border-[rgba(0,0,0,0.25)] hover:border-black flex items-center justify-center mb-2'>
          <img
            className='block w-4 h-4 mr-2'
            src='/google-icon.webp'
            alt='google-icon'
          />
          {t('sign-in.providers.google.title')}
        </button>
      </a>
    </div>
  );
}
