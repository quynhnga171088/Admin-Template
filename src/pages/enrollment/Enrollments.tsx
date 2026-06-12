import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { userStore } from '@/stores/user.store';
import type { IUserState, IPagination, IRegistrationContent } from '@/types/types';
import { getColorByState, getColorByStateEnrollment, getFormatVNCurrency, getPagination } from '@/util/util';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { modalStore } from '@/stores/modal.store';
import { enrollmentsFetcher } from '@/pages/enrollment/enrollments.service';
import {
  COURSE_DEFAULT_IMAGE,
  DATE_TIME_FORMAT,
  AVATAR_DEFAULT,
  QUERY_CONFIG,
  SCREENS_PATH
} from '@/config/constant';
import '@/pages/enrollment/Enrollments.scss';

const Enrollments = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const search = userStore((state: IUserState) => state.search);

  const setAction = userStore((state: IUserState) => state.setAction);

  const action = userStore((state: IUserState) => state.action);

  const pagination: IPagination = getPagination(new URLSearchParams(location.search));
  console.log('pagination', pagination);
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.enrollments.list(pagination),
    queryFn: () => enrollmentsFetcher(pagination),
    staleTime: QUERY_CONFIG.STALE_TIME * 60 * 1000 // 5 minutes
  });

  const enrollments = data?.content ?? [];

  const paginationData: IPagination = {
    ...pagination,
    last: data?.last ?? true,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 1
  };

  /* Sync loading state with modalStore (spinner global) */
  const setProcessing = modalStore(state => state.setProcessing);
  useEffect(() => {
    setProcessing(isLoading);
  }, [isLoading, setProcessing]);

  useEffect(() => {
    if (action) {
      navigate(`${location.pathname}?search=${search}`);
      setAction(false);
    }
  }, [action, navigate, location.pathname, search, setAction]);

  return (
    <div className="grid grid-cols-12 gap-4 enrollments-list">
      <div className="col-span-12">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <div className="card-header-title">Enrollments</div>
            <button type="button" className="btn btn-sm btn-primary ml-auto" onClick={() => navigate(SCREENS_PATH.COURSE_ADD_NEW)}>
              <i className="fa-regular fa-plus" /> Add Course
            </button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-24 gap-4 enrollment-item sources-item-label enrollment-item-label">
              <div className="col-span-8 md:col-span-7 lg:col-span-6 xl:col-span-5 2xl:col-span-4 flex items-center card-header-title">Student</div>
              <div className="col-span-11 md:col-span-10 lg:col-span-8 xl:col-span-7 2xl:col-span-7 items-center card-header-title">Course</div>
              <div className="col-span-4 md:col-span-4 lg:col-span-3 xl:col-span-2 2xl:col-span-2 items-center card-header-title">Status</div>
            </div>
            {enrollments.length === 0 && !isLoading && (
              <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">No enrollment found.</div>
            )}
            {enrollments.map((enrollment: IRegistrationContent) => (
              <div key={enrollment.id} className="grid grid-cols-24 gap-4 enrollment-item cursor-pointer">
                <div className="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-1 flex items-center">
                  <div className="enrollment-item-avatar" style={{ backgroundImage: `url(${enrollment.studentAvatar || AVATAR_DEFAULT})` }} />
                </div>
                <div className="col-span-6 md:col-span-5 lg:col-span-4 xl:col-span-3 2xl:col-span-3 courses-item-full-name flex items-center">
                  <div className="w-full!">
                    <div className="enrollment-item-full-name truncate" title={enrollment.studentName}>{enrollment.studentName}</div>
                    <div className="enrollment-item-user-email truncate" title={enrollment.studentEmail}>{enrollment.studentEmail}</div>
                  </div>
                </div>
                <div className="col-span-5 md:col-span-4 lg:col-span-3 xl:col-span-2 2xl:col-span-2 flex items-center">
                  <div className="enrollment-item-bg-img" style={{ backgroundImage: `url(${enrollment.courseThumbnailUrl || COURSE_DEFAULT_IMAGE})` }} />
                </div>
                <div className="col-span-6 md:col-span-6 lg:col-span-5 xl:col-span-5 2xl:col-span-5 enrollment-item-des-common">
                  <div className="enrollment-item-title mb-1! truncate">{enrollment.courseTitle}</div>
                  <div className="enrollment-item-description truncate text-sm text-gray-500">{enrollment.courseShortDescription}</div>
                </div>
                <div className="col-span-4 md:col-span-4 lg:col-span-3 xl:col-span-2 2xl:col-span-2 flex items-center cursor-pointer">
                  <div className={`enrollment-item-status ${getColorByStateEnrollment(enrollment.status)}`}>{enrollment.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enrollments;
export { Enrollments as Component };
