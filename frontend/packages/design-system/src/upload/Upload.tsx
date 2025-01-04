import { UploadOutlined } from '@ant-design/icons';
import { Upload as AntdUpload } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import { ReactNode, useCallback } from 'react';
import { Button } from '../button/Button';

interface ActivityUploadProps {
  onUpload: (file: RcFile) => void;
  loading: boolean;
  children: ReactNode;
  multiple?: boolean;
  maxCount?: number;
}

export function Upload({
  onUpload,
  loading,
  children,
  multiple = false,
  maxCount = 1,
}: ActivityUploadProps) {
  // To prevent antd from trying to upload the file
  const customRequest = useCallback(() => {}, []);

  return (
    <AntdUpload
      multiple={multiple}
      maxCount={maxCount}
      beforeUpload={onUpload}
      showUploadList={false}
      customRequest={customRequest}
      accept='image/x-png,image/jpeg'
      className='cursor-pointer'
      disabled={loading}
    >
      <Button icon={<UploadOutlined />}>{children}</Button>
    </AntdUpload>
  );
}
