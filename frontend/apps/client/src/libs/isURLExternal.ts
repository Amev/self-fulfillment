const getHostFromUrl = (url: string): string => {
  return new URL(url).hostname.replace('www.', '');
};

const isAbsoluteUrl = (url: string): boolean => {
  const formatedUrl = url.toLowerCase();
  return formatedUrl.startsWith('http') || formatedUrl.startsWith('https');
};

export default function isUrlExternal(
  url: string = '',
  host: string = window.location.hostname,
): boolean {
  if (isAbsoluteUrl(url)) {
    const providedHost = getHostFromUrl(url);

    return providedHost !== host;
  }
  return false;
}
