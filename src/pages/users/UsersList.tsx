import { useLocation, useNavigate } from 'react-router-dom';

import {
  AVATAR_DEFAULT,
  QUERY_CONFIG,
  SCREENS_PATH,
  DATE_FORMAT
} from '@/config/constant';
import { userStore } from '@/stores/user.store';
import type {
  IUser,
  IUserState,
  IPagination
} from '@/types/types';
import { modalStore } from '@/stores/modal.store';
import { useShallow } from 'zustand/react/shallow';
import {
  getNameByRole,
  getPagination,
  getStatusUser
} from '@/util/util';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { usersFetcher } from '@/pages/users/users.services';
import '@/pages/users/UsersList.scss';
import dayjs from 'dayjs';
import Pagination from '@/components/ui/Pagination.tsx';
import { deleteCourse } from '@/pages/courses/courses.services.ts';

const UsersList = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const search = userStore((state: IUserState) => state.search);
  const setAction = userStore((state: IUserState) => state.setAction);
  const action = userStore((state: IUserState) => state.action);

  const { setEnableCancelButton, setEnableOkButton, setCallback, setMessage, setTitle, setOpen } = modalStore(
    useShallow(state => ({
      setEnableCancelButton: state.setEnableCancelButton,
      setEnableOkButton: state.setEnableOkButton,
      setCallback: state.setCallback,
      setMessage: state.setMessage,
      setTitle: state.setTitle,
      setOpen: state.setOpen
    }))
  );

  const confirmBlockUser = (user: IUser) => {
    setMessage(`Do you want to block this user: ${course.title}?`);
    setEnableCancelButton(true);
    setEnableOkButton(true);
    setTitle('Confirm');
    setCallback(() =>
      deleteCourse(course.id)
        .then(() => {
          /* Return first page after change data content */
          const params = new URLSearchParams(location.search);
          params.set('page', '0');
          navigate(`${location.pathname}?${params.toString()}`);
        })
        .catch(() => {})
    );
    setOpen(true);
  };

  const pagination: IPagination = getPagination(new URLSearchParams(location.search));

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.users.list(pagination),
    queryFn: () => usersFetcher(pagination),
    staleTime: QUERY_CONFIG.STALE_TIME * 60 * 1000
  });

  const users = data?.content ?? [];

  const paginationData: IPagination = {
    ...pagination,
    last: data?.last ?? true,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 1
  };

  return (
    <div className="grid grid-cols-12 gap-4 users-list">
      <div className="col-span-12">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <div className="card-header-title">User Management</div>
            <button
              type="button"
              className="btn btn-sm btn-primary ml-auto"
              onClick={() => navigate(SCREENS_PATH.COURSE_ADD_NEW)}
            >
              <i className="fa-regular fa-plus" /> Add New Teacher
            </button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-24 gap-4 user-item user-item-label">
              <div className="col-span-9 md:col-span-9        lg:col-span-7 xl:col-span-7 2xl:col-span-7 flex items-center card-header-title">Avatar</div>
              <div className="col-span-5 md:col-span-5        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">Role</div>
              <div className="col-span-4 md:col-span-4        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">Status</div>
              <div className="hidden lg:flex xl:flex 2xl:flex lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">Create Date</div>
              <div className="col-span-6 md:col-span-6        lg:col-span-5 xl:col-span-5 2xl:col-span-5 flex items-center card-header-title">Action</div>
            </div>
            {users.length === 0 && !isLoading &&
              <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">
                No user found.
              </div>}
            {users.map((user: IUser) => (
              <div key={user.id} className="grid grid-cols-24 gap-4 user-item cursor-pointer">
                <div className="col-span-9 md:col-span-9        lg:col-span-7 xl:col-span-7 2xl:col-span-7 user-item-full-name flex items-center cursor-pointer">
                  <div
                    className="user-item-avatar"
                    style={{ backgroundImage: `url(${user.avatarUrl || AVATAR_DEFAULT})` }}
                    title={user.fullName}
                  />
                  <div className="user-item-user-info">
                    <div className="user-item-full-name truncate" title={user.fullName}>
                      {user.fullName}
                    </div>
                    <div className="enrollment-item-user-email truncate" title={user.email}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="col-span-5 md:col-span-5        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">
                  {getNameByRole(user.role)}
                </div>
                <div className="col-span-4 md:col-span-4        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center cursor-pointer">
                  {getStatusUser(user.status)}
                </div>
                <div className="hidden lg:flex xl:flex 2xl:flex lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center cursor-pointer">
                  {user.createdAt && dayjs(user.createdAt).format(DATE_FORMAT)}
                </div>
                <div className="col-span-6 md:col-span-6        lg:col-span-5 xl:col-span-5 2xl:col-span-5 flex items-center cursor-pointer">
                  <button className="btn btn-light-warning btn-icon btn-sm mr-2!" title="Update user info">
                    <i className="fa-thin fa-edit" />
                  </button>
                  <button className="btn btn-light-danger btn-icon btn-sm" title="Block this user">
                    <i className="fa-thin fa-ban" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination pagination={paginationData} />
        </div>
      </div>
    </div>);
};

export default UsersList;
export { UsersList as Component };
