import { SiteName, SITES } from 'common-types';
import { Switch } from 'design-system';
import { useCallback, useEffect, useState } from 'react';

export default function Permissions() {
  const [activePermissions, setActivePermissions] = useState<
    Record<SiteName, boolean>
  >(
    Object.keys(SITES).reduce(
      (acc, name) => {
        acc[name as SiteName] = false;
        return acc;
      },
      {} as Record<SiteName, boolean>,
    ),
  );
  const [loadingPermissions, setLoadingPermissions] = useState<
    Record<SiteName, boolean>
  >(
    Object.keys(SITES).reduce(
      (acc, name) => {
        acc[name as SiteName] = false;
        return acc;
      },
      {} as Record<SiteName, boolean>,
    ),
  );
  const onChangePermission = useCallback(
    (siteName: SiteName, siteURL: string) => (checked: boolean) => {
      if (checked) {
        setLoadingPermissions((prevActivePermissions) => ({
          ...prevActivePermissions,
          [siteName]: true,
        }));
        chrome.permissions.request({ origins: [siteURL] }, (granted) => {
          setActivePermissions((prevActivePermissions) => ({
            ...prevActivePermissions,
            [siteName]: granted,
          }));
          setLoadingPermissions((prevActivePermissions) => ({
            ...prevActivePermissions,
            [siteName]: false,
          }));
        });
      } else {
        setLoadingPermissions((prevActivePermissions) => ({
          ...prevActivePermissions,
          [siteName]: true,
        }));
        chrome.permissions.remove({ origins: [siteURL] }, (removed) => {
          setActivePermissions((prevActivePermissions) => ({
            ...prevActivePermissions,
            [siteName]: !removed,
          }));
          setLoadingPermissions((prevActivePermissions) => ({
            ...prevActivePermissions,
            [siteName]: false,
          }));
        });
      }
    },
    [],
  );

  useEffect(() => {
    Object.entries(SITES).forEach(([siteName, siteURL]) => {
      setLoadingPermissions((prevActivePermissions) => ({
        ...prevActivePermissions,
        [siteName]: true,
      }));
      chrome.permissions.contains({ origins: [siteURL] }, (result) => {
        setActivePermissions((prevActivePermissions) => ({
          ...prevActivePermissions,
          [siteName]: result,
        }));
        setLoadingPermissions((prevActivePermissions) => ({
          ...prevActivePermissions,
          [siteName]: false,
        }));
      });
    });
  }, []);

  return (
    <div className='w-full'>
      <h1>Permissions</h1>
      <div className='flex flex-col gap-2'>
        {Object.entries(SITES).map(([siteName, siteURL]) => (
          <div
            className='flex flex-row items-center justify-between'
            key={siteName}
          >
            <span>{siteName}</span>
            <Switch
              loading={loadingPermissions[siteName as SiteName]}
              value={activePermissions[siteName as SiteName]}
              onChange={onChangePermission(siteName as SiteName, siteURL)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
