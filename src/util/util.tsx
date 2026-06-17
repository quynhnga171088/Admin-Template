import { type IPagination, type IRole, type IUserStatus, PaginationDefault } from '@/types/types.ts';
import {
  ENROLLMENT_STATE,
  USER_STATUS,
  STATE,
  ROLES
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

export const getNameByRole = (role: IRole) => {
  return role ? role === ROLES.STUDENT ?
    <span className="user-student-status user-role-content flex items-center">
      <i className="fa-regular fa-graduation-cap mr-1!"/>Student
    </span> : role === ROLES.TEACHER ?
      <span className="user-teacher-status user-role-content flex items-center">
        <i className="fa-regular fa-person-chalkboard mr-1!"/>Teach
      </span> : role === ROLES.ADMIN ?
        <span className="user-admin-status user-role-content flex items-center">
          <i className="fa-regular fa-gear mr-1!"/>Admin
        </span> : 'Other' : 'Other';
};

export const getStatusUser = (status: IUserStatus) => {
  return status ? status === USER_STATUS.ACTIVE ?
    <span className="user-active-status user-role-content flex items-center">
      <i className="fa-regular fa-check mr-1!"/>Active
    </span> : status === USER_STATUS.BLOCKED ?
      <span className="user-blocked-status user-role-content flex items-center">
        <i className="fa-regular fa-ban mr-1!"/>Blocked
      </span>
      : 'Other' : 'Other';
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
