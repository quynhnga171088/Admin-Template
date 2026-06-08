import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';

import {
  getCourses,
  deleteCourse
} from './courses.services';
import type {
  ICoursesState,
  ICourseItem,
  IPagination,
  IUserState
} from '@/types/types';
import {
  getPagination,
  getColorByState,
  getFormatVNCurrency
} from '@/util/util';
import { coursesStore } from '@/stores/courses.store';
import '@/pages/courses/CoursesList.scss';
import {
  DATE_TIME_FORMAT,
  AVATAR_DEFAULT,
  SCREENS_PATH
} from '@/config/constant';
import Pagination from '@/components/ui/Pagination';
import { userStore } from '@/stores/user.store';
import { modalStore } from '@/stores/modal.store';

const CoursesList = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const [courseId, setCourseId] = useState<number | null>(null);

  const search = userStore((state: IUserState) => state.search);

  const setAction = userStore((state: IUserState) => state.setAction);

  const action = userStore((state: IUserState) => state.action);

  const courses = coursesStore((state: ICoursesState) => state.courses);

  const pagination = coursesStore((state: ICoursesState) => state.pagination);

  const setEnableCancelButton = modalStore(state => state.setEnableCancelButton);
  const setEnableOkButton = modalStore(state => state.setEnableOkButton);
  const setCallback = modalStore(state => state.setCallback);
  const setMessage = modalStore(state => state.setMessage);
  const setTitle = modalStore(state => state.setTitle);
  const setOpen = modalStore(state => state.setOpen);

  const confirmDeleteAction = (course: ICourseItem) => {
    setCourseId(course.id);
    setMessage(`Do you want to delete the course: ${course.title}?`);
    setEnableCancelButton(true);
    setEnableOkButton(true);
    setTitle('Confirm');
    setCallback(deleteCourseData);
    setOpen(true);
  };

  const deleteCourseData = () => {
    if (courseId) {
      deleteCourse(courseId)
        .then(() => {
          setCourseId(null);
        })
        .catch(() => {
          setMessage('Failed to delete course. Please try again later.');
          setTitle('Confirm');
          setEnableCancelButton(false);
          setEnableOkButton(true);
          setCallback(null);
          setOpen(true);
        });
    }
  };

  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams(location.search);

    const pagination: IPagination = getPagination(params);

    getCourses(pagination).then(() => setAction(false));
  }, [location.search, setAction]);

  useEffect(() => {
    if (action) {
      navigate(`${location.pathname}?search=${search}`);
    }
  }, [action]);

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
              <div className="col-span-9 md:col-span-8 lg:col-span-7 xl:col-span-4 2xl:col-span-4 flex items-center card-header-title">
                Avatar
              </div>
              <div className="col-span-7 md:col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2 flex items-center card-header-title">
                Thumbnail
              </div>
              <div className="col-span-4 md:col-span-6 lg:col-span-9 xl:col-span-8 2xl:col-span-9 flex items-center card-header-title">
                Title & shor description
              </div>
              <div className="col-span-4 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 flex items-center card-header-title">
                Status
              </div>
              <div className="hidden xl:flex 2xl:flex xl:col-span-3 2xl:col-span-3 items-center card-header-title">
                Create Date
              </div>
              <div className="hidden xl:flex 2xl:flex xl:col-span-2 2xl:col-span-2 items-center card-header-title">
                Price
              </div>
              <div className="hidden xl:flex 2xl:flex xl:col-span-2 2xl:col-span-3 items-center card-header-title">
                Action
              </div>
            </div>
            {!courses || courses.length === 0 ?
              <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">
                No courses found.
              </div>
              : ''}
            {courses.map((course: ICourseItem) => (
              <div key={course.id} className="grid grid-cols-24 gap-4 courses-item cursor-pointer" onClick={() => navigate(SCREENS_PATH.COURSE_PREVIEW(course.id))}>
                <div className="col-span-9 md:col-span-8 lg:col-span-7 xl:col-span-4 2xl:col-span-4 courses-item-full-name flex items-center cursor-pointer">
                  <img
                    className="img-fluid logo logo-lg h-12.5"
                    src={course.teacher.avatarUrl || AVATAR_DEFAULT}
                    alt={course.teacher.fullName}
                  />
                  {course.teacher.fullName}
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

          <Pagination pagination={pagination} />
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
export { CoursesList as Component };
