import { Spin } from 'antd';

export default function ContentSpiner() {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <Spin size='large' />
    </div>
  );
}
