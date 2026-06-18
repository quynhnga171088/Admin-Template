import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import {
  coursesFetcher,
  deleteCourse
} from './courses.services';
import type {
  ICourseItem,
  IPagination,
  IUserState
} from '@/types/types';
import {
  getPagination,
  getColorByState,
  getFormatVNCurrency
} from '@/util/util.tsx';
import { queryKeys } from '@/lib/queryKeys';
import '@/pages/courses/CoursesList.scss';
import {
  DATE_TIME_FORMAT,
  AVATAR_DEFAULT,
  SCREENS_PATH,
  QUERY_CONFIG
} from '@/config/constant';
import Pagination from '@/components/ui/Pagination';
import { userStore } from '@/stores/user.store';
import { modalStore } from '@/stores/modal.store';
import { useShallow } from 'zustand/react/shallow';

const CoursesList = () => {

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

  const pagination: IPagination = getPagination(new URLSearchParams(location.search));

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.courses.list(pagination),
    queryFn: () => coursesFetcher(pagination),
    staleTime: QUERY_CONFIG.STALE_TIME * 60 * 1000 // 5 minutes
  });

  const courses = data?.content ?? [];
  const paginationData: IPagination = {
    ...pagination,
    last: data?.last ?? true,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 1
  };

  const confirmDeleteAction = (course: ICourseItem) => {
    setMessage(`Do you want to delete the course: ${course.title}?`);
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
    <div className="grid grid-cols-12 gap-4 courses-list">
      <div className="col-span-12">
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <div className="card-header-title">Courses</div>
            <button
              type="button"
              className="btn btn-sm btn-primary ml-auto"
              onClick={() => navigate(SCREENS_PATH.COURSE_ADD_NEW)}
            >
              <i className="fa-regular fa-plus" /> Add Course
            </button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-24 gap-4 courses-item sources-item-label">
              <div className="col-span-9 md:col-span-8 lg:col-span-7 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">User</div>
              <div className="col-span-7 md:col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2 flex items-center card-header-title">Thumbnail</div>
              <div className="col-span-4 md:col-span-6 lg:col-span-9 xl:col-span-8 2xl:col-span-9 flex items-center card-header-title">Title & short description</div>
              <div className="col-span-4 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 flex items-center card-header-title">Status</div>
              <div className="hidden xl:flex 2xl:flex xl:col-span-3 2xl:col-span-3 items-center card-header-title">Create Date</div>
              <div className="hidden xl:flex 2xl:flex xl:col-span-2 2xl:col-span-2 items-center card-header-title">Price</div>
              <div className="hidden xl:flex 2xl:flex xl:col-span-2 2xl:col-span-3 items-center card-header-title">Action</div>
            </div>
            {courses.length === 0 && !isLoading &&
              <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">
                No courses found.
              </div>}
            {courses.map((course: ICourseItem) => (
              <div key={course.id} className="grid grid-cols-24 gap-4 courses-item cursor-pointer" onClick={() => navigate(SCREENS_PATH.COURSE_PREVIEW(course.id))}>
                <div className="col-span-9 md:col-span-8 lg:col-span-7 xl:col-span-4 2xl:col-span-4 courses-item-full-name flex items-center cursor-pointer">
                  <img className="img-fluid" src={course.teacher.avatarUrl || AVATAR_DEFAULT} alt={course.teacher.fullName} />

                  <span className="ml-2!">{course.teacher.fullName}</span>
                </div>
                <div className="col-span-7 md:col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2 cursor-pointer">
                  <div
                    className="courses-item-bg-img"
                    style={{
                      backgroundImage: `url(${course.thumbnailUrl || '/public/images/image-default-course-item.jpg'})`
                    }}
                  />
                </div>
                <div className="col-span-4 md:col-span-6 lg:col-span-9 xl:col-span-8 2xl:col-span-9 courses-item-des-common cursor-pointer">
                  <div className="courses-item-title mb-1! truncate">{course.title}</div>
                  <div className="courses-item-description truncate text-sm text-gray-500">
                    {course.shortDescription}
                  </div>
                </div>
                <div className="col-span-4 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 flex items-center cursor-pointer">
                  <div className={`course-item-status ${getColorByState(course.status)}`}>
                    {course.status}
                  </div>
                </div>
                <div className="hidden xl:flex 2xl:flex xl:col-span-3 2xl:col-span-3 items-center card-header-title">
                  {course.createdAt ? dayjs(course.createdAt).format(DATE_TIME_FORMAT) : 'N/A'}
                </div>
                <div className="hidden xl:flex 2xl:flex xl:col-span-2 2xl:col-span-2 items-center card-header-title">
                  {course.price ? getFormatVNCurrency(course.price) : <span className="course-free">Free</span> }
                </div>
                <div
                  className="hidden xl:flex 2xl:flex xl:col-span-2 2xl:col-span-3 items-center card-header-title text-right courses-item-action"
                  onClick={e => e.stopPropagation()}
                >
                  <Link className="btn btn-light-info btn-icon btn-sm ml-0.5! no-underline" title="Chapters" to={SCREENS_PATH.COURSE_CHAPTERS(course.id)}>
                    <i className="fa-regular fa-layer-group text-sm" aria-hidden="true" />
                  </Link>
                  <Link className="btn btn-light-warning btn-icon btn-sm ml-0.5! no-underline" title="Edit" to={SCREENS_PATH.COURSE_EDIT(course.id)}>
                    <i className="fa-regular fa-pen text-sm" aria-hidden="true" />
                  </Link>
                  <button className="btn btn-light-danger btn-icon btn-sm ml-0.5! no-underline" title="Delete" onClick={() => confirmDeleteAction(course)}>
                    <i className="fa-regular fa-trash text-sm" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination pagination={paginationData} />
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
export { CoursesList as Component };
