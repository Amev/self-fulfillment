import { Avatar, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import { User } from 'common-types';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useUploadAvatarMutation } from 'stores/user/profileApi';

interface AvatarUploadProps {
  user: User;
}

export default function AvatarUpload({ user }: AvatarUploadProps) {
  const { t } = useTranslation();
  const [uploadAvatar, { isLoading: avatarLoading }] =
    useUploadAvatarMutation();

  // To prevent antd from trying to upload the file
  const customRequest = useCallback(() => {}, []);
  const onUpload = useCallback(
    (file: RcFile) => {
      uploadAvatar({ userID: user.id, avatar: file });
    },
    [uploadAvatar, user.id],
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
        alt={`${user?.firstName?.charAt(0) || ''} ${
          user?.lastName || t('profile.basic-informations.avatar.default')
        }`}
        shape='circle'
        src={user?.avatar || undefined}
        size={64}
      >
        {`${user?.firstName?.charAt(0) || ''}${
          user?.lastName?.charAt(0) || ''
        }` || t('profile.basic-informations.avatar.default')}
      </Avatar>
    </Upload>
  );
}
