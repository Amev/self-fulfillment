import { Spin } from 'antd';

export default function ContentSpiner() {
  return (
    <div className='flex flex-col items-center justify-center grow'>
      <Spin />
    </div>
  );
}
