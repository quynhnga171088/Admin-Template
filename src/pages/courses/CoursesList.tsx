import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';

import { getCourses } from './courses.services.ts';
import type {
  ICoursesState,
  ICourseItem,
  IPagination,
  IUserState
} from '@/types/types.ts';
import { getPagination, getColorByState } from '@/util/util.ts';
import { coursesStore } from '@/stores/courses.store.ts';
import '@/pages/courses/CoursesList.scss';
import { DATE_TIME_FORMAT, SCREENS_PATH } from '@/config/constant';
import Pagination from '@/components/ui/Pagination.tsx';
import { userStore } from '@/stores/user.store.ts';

const CoursesList = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const search = userStore((state: IUserState) => state.search);

  const setAction = userStore((state: IUserState) => state.setAction);

  const action = userStore((state: IUserState) => state.action);

  const courses = coursesStore((state: ICoursesState) => state.courses);

  const pagination = coursesStore((state: ICoursesState) => state.pagination);

  useEffect(() => {
    const params: URLSearchParams = new URLSearchParams(location.search);

    const pagination: IPagination = getPagination(params);

    getCourses(pagination).then(() => setAction(false));
  }, [location.search]);

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
              <div className="hidden xl:flex 2xl:flex xl:col-span-3 2xl:col-span-3 items-center card-header-title">
                Action
              </div>
            </div>
            {courses.map((course: ICourseItem) => (
              <div key={course.id} className="grid grid-cols-24 gap-4 courses-item">
                <div className="col-span-9 md:col-span-8 lg:col-span-7 xl:col-span-4 2xl:col-span-4 courses-item-full-name flex items-center cursor-pointer">
                  <img
                    className="img-fluid logo logo-lg h-12.5"
                    src={course.teacher.avatarUrl}
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
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </div>
                <div className="hidden xl:flex 2xl:flex xl:col-span-3 2xl:col-span-3 items-center card-header-title courses-item-action">
                  <Link className="btn btn-light-info btn-icon btn-sm no-underline" type="button" title="Chapters" to={SCREENS_PATH.COURSE_CHAPTERS(course.id)}>
                    <i className="fa-regular fa-layer-group text-sm" aria-hidden="true" />
                  </Link>
                  <Link className="btn btn-light-warning btn-icon btn-sm ml-[2px]! no-underline" type="button" title="Edit" to={SCREENS_PATH.COURSE_EDIT(course.id)}>
                    <i className="fa-regular fa-pen text-sm" aria-hidden="true" />
                  </Link>
                  <button className="btn btn-light-danger btn-icon btn-sm ml-[2px]! no-underline" type="button" title="Delete">
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
