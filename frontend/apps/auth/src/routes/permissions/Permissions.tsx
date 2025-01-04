import { Site, SITES } from 'common-types';
import { Switch } from 'design-system';
import { useCallback, useEffect, useState } from 'react';

export default function Permissions() {
  const [activePermissions, setActivePermissions] = useState<
    Record<Site, boolean>
  >(
    Object.keys(SITES).reduce(
      (acc, name) => {
        acc[name as Site] = false;
        return acc;
      },
      {} as Record<Site, boolean>,
    ),
  );
  const [loadingPermissions, setLoadingPermissions] = useState<
    Record<Site, boolean>
  >(
    Object.keys(SITES).reduce(
      (acc, name) => {
        acc[name as Site] = false;
        return acc;
      },
      {} as Record<Site, boolean>,
    ),
  );
  const onChangePermission = useCallback(
    (siteName: Site, siteURL: string) => (checked: boolean) => {
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
              loading={loadingPermissions[siteName as Site]}
              value={activePermissions[siteName as Site]}
              onChange={onChangePermission(siteName as Site, siteURL)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
