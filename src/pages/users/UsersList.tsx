import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  AVATAR_DEFAULT,
  QUERY_CONFIG,
  DATE_FORMAT, DATE_TIME_FORMAT,
} from '@/config/constant';
import type {
  IUser,
  IUserState,
  INewTeacher,
  IPagination
} from '@/types/types';
import { modalStore } from '@/stores/modal.store';
import { useShallow } from 'zustand/react/shallow';
import {
  getNameByRole,
  getPagination,
  getStatusUser
} from '@/util/util';
import { queryKeys } from '@/lib/queryKeys';
import { queryClient } from '@/lib/queryClient';
import {
  usersFetcher,
  deleteTeacher,
  createTeacher,
  updateTeacher
} from '@/pages/users/users.services';
import '@/pages/users/UsersList.scss';
import dayjs from 'dayjs';
import Pagination from '@/components/ui/Pagination';
import AddTeacherModal from '@/components/ui/user/AddTeacherModal';
import UpdateUserModal from '@/components/ui/user/UpdateUserModal';
import { userStore } from '@/stores/user.store';


const UsersList = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const search = userStore((state: IUserState) => state.search);
  const setSearch = userStore((state: IUserState) => state.setSearch);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get('search') ?? '';
    if (currentSearch === search) return;
    params.set('search', search);
    params.set('page', '0');
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }, [location.pathname, location.search, navigate, search]);

  const confirmDeleteUser = (user: IUser) => {
    setMessage(`Do you want to delete this user: ${user.fullName}?`);
    setEnableCancelButton(true);
    setEnableOkButton(true);
    setTitle('Confirm');
    setCallback(() =>
      deleteTeacher(user.id)
        .then(async () => {
          await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
          const params = new URLSearchParams(location.search);
          params.set('page', '0');
          params.set('search', search);
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

  const handleUpdateUser = async (data: { fullName: string; role: IUser['role']; status: IUser['status'] }) => {
    if (!editUser) return;
    setSubmitting(true);
    try {
      await updateTeacher(editUser.id, { ...editUser, ...data });
      setEditUser(null);
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      setTitle('Success');
      setMessage('User information has been updated successfully!');
      setEnableCancelButton(false);
      setEnableOkButton(true);
      setCallback(() => () => {});
      setOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTeacher = async (data: INewTeacher) => {
    setSubmitting(true);
    try {
      await createTeacher(data);
      setAddTeacherOpen(false);
      await queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      setSearch(''); // reset search để user mới tạo hiển thị
      setTitle('Success');
      setMessage('New teacher has been added successfully!');
      setEnableCancelButton(false);
      setEnableOkButton(true);
      setCallback(() => () => {});
      setOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 users-list">
      <div className="col-span-12">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <div className="card-header-title">User Management</div>
            <button type="button" className="btn btn-sm btn-primary ml-auto" onClick={() => setAddTeacherOpen(true)}>
              <i className="fa-regular fa-plus" /> Add New Teacher
            </button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-24 gap-4 user-item user-item-label">
              <div className="col-span-9 md:col-span-9        lg:col-span-7 xl:col-span-7 2xl:col-span-7 flex items-center card-header-title">Avatar</div>
              <div className="col-span-5 md:col-span-5        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">Role</div>
              <div className="col-span-4 md:col-span-4        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">Status</div>
              <div className="hidden lg:flex xl:flex 2xl:flex lg:col-span-4 xl:col-span-3 2xl:col-span-3 items-center card-header-title">Create Date</div>
              <div className="hidden         xl:flex 2xl:flex               xl:col-span-3 2xl:col-span-3 items-center card-header-title">Phone Number</div>
              <div className="col-span-6 md:col-span-6        lg:col-span-5 xl:col-span-3 2xl:col-span-3 flex items-center card-header-title">Action</div>
            </div>
            {users.length === 0 && !isLoading && <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">No user found.</div>}
            {users.map((user: IUser) => (
              <div key={user.id} className="grid grid-cols-24 gap-4 user-item cursor-pointer">
                <div className="col-span-9 md:col-span-9        lg:col-span-7 xl:col-span-7 2xl:col-span-7 user-item-full-name flex items-center cursor-pointer">
                  <div className="user-item-avatar" style={{ backgroundImage: `url(${user.avatarUrl || AVATAR_DEFAULT})` }} title={user.fullName} />
                  <div className="user-item-user-info">
                    <div className="user-item-full-name truncate" title={user.fullName}>
                      {user.fullName}
                    </div>
                    <div className="enrollment-item-user-email truncate" title={user.email}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="col-span-5 md:col-span-5        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">{getNameByRole(user.role)}</div>
                <div className="col-span-4 md:col-span-4        lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center cursor-pointer">{getStatusUser(user.status)}</div>
                <div className="hidden lg:flex xl:flex 2xl:flex lg:col-span-4 xl:col-span-3 2xl:col-span-3 items-center cursor-pointer truncate">
                  {user.createdAt && dayjs(user.createdAt).format(DATE_TIME_FORMAT)}
                </div>
                <div className="hidden         xl:flex 2xl:flex               xl:col-span-3 2xl:col-span-3 items-center cursor-pointer">
                  {user.phone ? user.phone : 'N/A'}
                </div>
                <div className="col-span-6 md:col-span-6        lg:col-span-5 xl:col-span-3 2xl:col-span-3 flex items-center cursor-pointer">
                  <button className="btn btn-light-warning btn-icon btn-sm mr-2!" title="Update user info" onClick={() => setEditUser(user)}>
                    <i className="fa-thin fa-edit" />
                  </button>
                  <button className="btn btn-light-danger btn-icon btn-sm" title="Delete this user" onClick={() => confirmDeleteUser(user)}>
                    <i className="fa-thin fa-xmark-octagon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination pagination={paginationData} />
        </div>
      </div>

      {addTeacherOpen && <AddTeacherModal submitting={submitting} onClose={() => setAddTeacherOpen(false)} onSave={handleCreateTeacher} />}

      {editUser && <UpdateUserModal user={editUser} submitting={submitting} onClose={() => setEditUser(null)} onSave={handleUpdateUser} />}
    </div>
  );
};

export default UsersList;
export { UsersList as Component };
