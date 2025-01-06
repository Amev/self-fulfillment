import { RcFile } from 'antd/lib/upload/interface';
import { OrganizationInfo } from 'common-types';
import { Avatar, Upload } from 'design-system';
import { useCallback } from 'react';
import { useUploadLogoMutation } from 'stores/organizations/organizationsApi';

interface LogoUploadProps {
  organizationInfo: OrganizationInfo;
}

export default function LogoUpload({ organizationInfo }: LogoUploadProps) {
  const [uploadedLogo, { isLoading: avatarLoading }] = useUploadLogoMutation();

  // To prevent antd from trying to upload the file
  const customRequest = useCallback(() => {}, []);
  const onUpload = useCallback(
    (file: RcFile) => {
      uploadedLogo({ id: organizationInfo.id, logo: file });
    },
    [uploadedLogo, organizationInfo.id],
  );

  return (
    <Upload
      name='file'
      multiple={false}
      maxCount={1}
      beforeUpload={onUpload}
      showUploadList={false}
      customRequest={customRequest}
      accept='image/x-png,image/jpeg'
      className='cursor-pointer'
      disabled={avatarLoading}
    >
      <Avatar
        alt={`${organizationInfo?.name?.charAt(0) || ''}`}
        shape='circle'
        src={organizationInfo?.logo || undefined}
        size={64}
      >
        {`${organizationInfo?.name?.charAt(0) || ''}`}
      </Avatar>
    </Upload>
  );
}
