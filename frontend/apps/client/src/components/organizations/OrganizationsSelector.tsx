import { SettingOutlined } from '@ant-design/icons';
import cx from 'classnames';
import { useOnClickOutside } from 'common-hooks';
import { Organization } from 'common-types/model';
import { Avatar, Skeleton, Button } from 'design-system';
import { MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateOrganizationMutation } from 'stores/organizations/organizationsApi';

interface OrganizationsSelectorProps {
  isLoading: boolean;
  organizations?: Organization[];
}

export default function OrganizationsSelector({
  isLoading,
  organizations = [],
}: OrganizationsSelectorProps) {
  const { t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { organizationID } = useParams();
  const [createOrganization] = useCreateOrganizationMutation();
  const organization = useMemo(
    () =>
      organizations.find((orga) => {
        return orga.info.id === organizationID;
      }) || (organizations ? organizations[0] : null),
    [organizationID, organizations],
  );

  const onCreateDefaultOrganization = useCallback(() => {
    createOrganization({ name: 'test' });
  }, [createOrganization]);

  const onShowDropdown = useCallback(() => {
    setShowDropdown(true);
  }, []);
  const onHideDropdown = useCallback(() => {
    setShowDropdown(false);
  }, []);
  useOnClickOutside(dropdownRef, onHideDropdown);

  const currentOrg = organization && (
    <OrganizationItemDropdown
      selected
      organization={organization}
      hideDropdown={onHideDropdown}
    />
  );

  const othersOrgs = organizations
    .filter((org) => org.info.id !== organization?.info.id)
    .map((org) => (
      <OrganizationItemDropdown
        key={org.info.id}
        organization={org}
        hideDropdown={onHideDropdown}
      />
    ));

  if (isLoading) {
    return (
      <Skeleton.Avatar
        active
        size={96}
        shape='square'
      />
    );
  }

  return (
    <div className='relative'>
      <Button
        className='cursor-pointer '
        onClick={onShowDropdown}
        type='text'
      >
        <Avatar
          alt={organization?.info.name.charAt(0)}
          src={organization?.info.logo}
          size='large'
        >
          {organization?.info.name.charAt(0)}
        </Avatar>
      </Button>
      <div
        className={cx('z-10 bg-white rounded-md absolute top-10 left-0 ', {
          hidden: !showDropdown,
        })}
        ref={dropdownRef}
      >
        {currentOrg}
        {othersOrgs}
        <div className='text-center'>
          <Button
            type='text'
            onClick={onCreateDefaultOrganization}
          >
            {t('organization.create')}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface OrganizationItemDropdownProps {
  selected?: boolean;
  organization: Organization;
  hideDropdown: () => void;
}
function OrganizationItemDropdown({
  selected = false,
  organization,
  hideDropdown,
}: OrganizationItemDropdownProps) {
  const navigate = useNavigate();
  const handleChange = useCallback(() => {
    hideDropdown();
    navigate(`/organizations/${organization.info.id}`);
  }, [hideDropdown, navigate, organization.info.id]);

  const handleSettings = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      hideDropdown();
      navigate(`/organizations/${organization.info.id}/settings`);
    },
    [hideDropdown, navigate, organization.info.id],
  );

  return (
    <div
      key={organization.info.id}
      className='relative'
    >
      <Button
        type='text'
        className='flex flex-row w-64 !h-16 justify-between items-center rounded-md'
        onClick={handleChange}
      >
        <div className='flex flex-grow gap-x-2'>
          <Avatar
            alt={organization?.info.name.charAt(0)}
            src={organization.info.logo}
            size='large'
          >
            {organization?.info.name.charAt(0)}
          </Avatar>
          <span className={`self-center ${selected ? 'font-bold' : ''}`}>
            {organization.info.name}
          </span>
        </div>
      </Button>
      <div className='absolute top-4 right-2'>
        <Button
          onClick={handleSettings}
          icon={<SettingOutlined />}
        />
      </div>
    </div>
  );
}
