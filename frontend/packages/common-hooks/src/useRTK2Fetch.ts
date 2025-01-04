// eslint-disable-next-line import/no-unresolved
import { TypedUseQueryHookResult } from '@reduxjs/toolkit/dist/query/react';
import { PaginateCursor, PaginateData } from 'common-types/model';
import { useCallback, useMemo, useState } from 'react';

export function useRTK2Fetch<T>(
  useGetDataQuery: (cursor: PaginateCursor) => TypedUseQueryHookResult<
    PaginateData<T>,
    {
      pageSize: number;
      page: number;
      query: string;
    },
    any,
    any
  >,
  defaultPage: number = 1,
  pageSize: number = 20,
  defaultQuery: string = '',
): [
  PaginateData<T>,
  boolean,
  (index: number) => void,
  (value: { searchQuery: string }) => void,
] {
  const [page, setPage] = useState(defaultPage);
  const [query, setQuery] = useState(defaultQuery);
  const onChangePage = useCallback((index: number) => {
    setPage(index);
  }, []);

  const onChangeQuery = useCallback(
    (value: { searchQuery: string }) => {
      setPage(defaultPage);
      setQuery(value.searchQuery);
    },
    [defaultPage],
  );

  const emptyPaginator = useMemo(
    () => ({
      paginator: {
        count: 0,
        pageSize,
        current: defaultPage,
      },
      data: [],
    }),
    [pageSize, defaultPage],
  );

  const { data: paginateData, isLoading } = useGetDataQuery({
    pageSize,
    page,
    query,
  });

  return [
    paginateData || emptyPaginator,
    isLoading,
    onChangePage,
    onChangeQuery,
  ];
}
