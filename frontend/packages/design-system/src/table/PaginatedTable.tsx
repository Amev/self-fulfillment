import { SearchOutlined } from '@ant-design/icons';
import {
  Pagination,
  Table as ATable,
  TableProps as ATableProps,
  Form,
} from 'antd';
import { PaginateData } from 'common-types/model';
import { Button } from '../button/Button';
import { Input } from '../input/Input';

interface PaginatedTableProps
  extends Omit<ATableProps<any>, 'rowKey' | 'pagination' | 'dataSource'> {
  items: PaginateData<any>;
  loading: boolean;
  onChangePage: (page: number) => void;
  onChangeQuery: (value: { searchQuery: string }) => void;
  searchAvailable?: boolean;
  searchPlaceholder?: string;
}
export function PaginatedTable({
  items,
  loading,
  onChangePage,
  onChangeQuery,
  searchAvailable = false,
  searchPlaceholder = undefined,
  ...props
}: PaginatedTableProps) {
  return (
    <div className='flex flex-col justify-between space-y-2 grow'>
      {searchAvailable && (
        <Form
          className='self-end'
          name='search-form'
          onFinish={onChangeQuery}
        >
          <div className='flex flex-row space-x-2'>
            <Form.Item name='searchQuery'>
              <Input
                size='large'
                placeholder={searchPlaceholder}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType='submit'>
                <SearchOutlined />
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
      <ATable
        {...props}
        rowKey='id'
        pagination={false}
        dataSource={items.data}
        loading={loading}
      />
      <Pagination
        className='self-end'
        total={items.paginator.count}
        onChange={onChangePage}
        current={items.paginator.current}
        pageSize={items.paginator.pageSize}
      />
    </div>
  );
}
