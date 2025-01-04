import { Pagination, List as AList, ListProps as AListProps } from 'antd';
import { PaginateData } from 'common-types/model';

interface PaginatedListProps
  extends Omit<AListProps<any>, 'rowKey' | 'pagination' | 'dataSource'> {
  items: PaginateData<any>;
  loading: boolean;
  onChangePage: (page: number) => void;
}
export function PaginatedList({
  items,
  loading,
  onChangePage,
  ...props
}: PaginatedListProps) {
  return (
    <div className='flex flex-col justify-between grow space-y-2'>
      <AList
        {...props}
        rowKey='id'
        pagination={false}
        dataSource={items.data}
        loading={loading}
      />
      <Pagination
        total={items.paginator.count}
        onChange={onChangePage}
        current={items.paginator.current}
        pageSize={items.paginator.pageSize}
      />
    </div>
  );
}
