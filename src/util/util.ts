import { type IPagination, PaginationDefault } from '@/types/types.ts';
import {
  ENROLLMENT_STATE,
  STATE
} from '@/config/constant';

export const getPagination = (params: URLSearchParams): IPagination => {
  return params ? {
    ...PaginationDefault,
    page: params.get('page') ? Number(params.get('page')) : PaginationDefault.page,
    size: params.get('size') ? Number(params.get('size')) : PaginationDefault.size,
    search: params.get('search') ?? '',
    status: params.get('status') ? (params.get('status') || '').toUpperCase() : ''
  } : PaginationDefault;
};

export const getColorByState = (state: string): string => {
  return state ? state === STATE.DRAFT ? 'warning' : state === STATE.PUBLISHED ? 'success' : state === STATE.ARCHIVED ? 'info' : 'info' : 'info';
};

export const getColorByStateEnrollment = (state: string): string => {
  return state ? state === ENROLLMENT_STATE.PENDING ?
    'pending' : state === ENROLLMENT_STATE.APPROVED ?
      'approved' : state === ENROLLMENT_STATE.REJECTED ?
        'danger' : 'danger' : 'danger';
};

export const getFormatVNCurrency = (price: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
}).format(price);
