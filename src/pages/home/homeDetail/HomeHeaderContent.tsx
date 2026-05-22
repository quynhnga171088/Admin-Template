import '@/pages/home/Home.scss';

export interface IData {
  totalStudents: number;
  totalTeachers: number;
  totalPublishedCourses: number;
  totalDraftCourses: number;
  totalArchivedCourses: number;
  totalEnrollmentsPending: number;
  totalEnrollmentsApproved: number;
  totalEnrollmentsRejected: number;
  totalLessonsCompleted: number;
  topCourses: any[];
}
const HomeHeaderContent = ({ data }: { data: IData | any }) => {
  if (!data || (data.data && data.data.status === 500)) return null;
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 mt-1!">
        <div className="card mb-1!">
          <div className="card-body">
            <div className="flex items-center">
              <div className="shrink-0 overview-avatar text-info-500">
                <i className="fa-thin fa-users-class text-[25px] text-white" />
              </div>
              <div className="grow ml-2.5!">
                <div className="text-xl font-semibold">
                  {data.totalStudents.toLocaleString()}
                </div>
                <div className="block h-10.5">Total Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 mt-1!">
        <div className="card mb-1!">
          <div className="card-body">
            <div className="flex items-center">
              <div className="shrink-0 overview-avatar text-success-500">
                <i className="fa-thin fa-book text-[25px] text-white" />
              </div>
              <div className="grow  ml-2.5!">
                <div className="text-xl font-semibold">
                  {(
                    data.totalPublishedCourses +
                    data.totalDraftCourses +
                    data.totalArchivedCourses
                  ).toLocaleString()}
                </div>
                <div className="block h-10.5">Total Published Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 mt-1!">
        <div className="card mb-1!">
          <div className="card-body">
            <div className="flex items-center">
              <div className="shrink-0 overview-avatar text-info-500">
                <i className="fa-thin fa-clipboard-list-check text-[25px] text-white" />
              </div>
              <div className="grow  ml-2.5!">
                <div className="text-xl font-semibold">
                  {data.totalEnrollmentsApproved.toLocaleString()}
                </div>
                <div className="block h-10.5">Total Approved Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 mt-1!">
        <div className="card mb-1!">
          <div className="card-body">
            <div className="flex items-center">
              <div className="shrink-0 overview-avatar text-warning-500">
                <i className="fa-thin fa-clock-desk text-[25px] text-white" />
              </div>
              <div className="grow ml-2.5!">
                <div className="text-xl font-semibold">
                  {data.totalEnrollmentsPending}
                </div>
                <div className="block h-10.5">Total Enrollment Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 mt-1!">
        <div className="card mb-1!">
          <div className="card-body">
            <div className="flex items-center">
              <div className="shrink-0 overview-avatar text-success-500">
                <i className="fa-thin fa-box-circle-check text-[25px] text-white" />
              </div>
              <div className="grow ml-2.5!">
                <div className="text-xl font-semibold">{data.totalTeachers}</div>
                <div className="block h-10.5">Total Enrollment Approved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-2 2xl:col-span-2 mt-1!">
        <div className="card mb-1!">
          <div className="card-body">
            <div className="flex items-center">
              <div className="shrink-0 overview-avatar text-success-500">
                <i className="fa-thin fa-ballot-check text-[25px] text-white" />
              </div>
              <div className="grow ml-2.5!">
                <div className="text-xl font-semibold">{data.totalLessonsCompleted}</div>
                <div className="block h-10.5">Total Lessons Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeaderContent;
