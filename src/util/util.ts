import { type IPagination, PaginationDefault } from '@/types/types.ts';
import { STATE } from '@/config/constant';

export const getPagination = (params: URLSearchParams): IPagination => {
  return params ? {
    ...PaginationDefault,
    page: params.get('page') ? Number(params.get('page')) : PaginationDefault.page,
    size: params.get('size') ? Number(params.get('size')) : PaginationDefault.size,
    search: params.get('search') ?? '',
    status: params.get('status') ?? ''
  } : PaginationDefault;
};

export const getColorByState = (state: string): string => {
  return state ? state === STATE.DRAFT ? 'warning' : state === STATE.PUBLISHED ? 'success' : state === STATE.ARCHIVED ? 'info' : 'info' : 'info';
};
