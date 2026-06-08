/* Chapter Start */
export type IChapterModalState = { open: false, mode?: string } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; chapter: IChapter };

export type ILessonModalState =
  | { open: false; mode?: string }
  | { open: true; mode: 'create'; chapterId: number }
  | { open: true; mode: 'edit'; chapterId: number; lesson: ILesson };

export type ISectionType = 'VIDEO' | 'TEXT';
export type ISectionStatus = 'DRAFT' | 'PUBLISHED';
/* Chapter End */

export type IRole = 'TEACHER' | 'ADMIN';

export type ICourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IUploadResponse {
  fileKey: string
  fileUrl: string
  fileName: string
  contentType: string
  size: number
}

export interface ITeacherCourse {
  id: number;
  fullName: string;
  avatarUrl?: string;
}

export interface IUserState {
  search: string;
  action: boolean;
  setAction: (action: boolean) => void;
  setSearch: (search: string) => void;
}

export interface IPageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export const PaginationDefault: IPagination = {
  search: '',
  page: 0,
  status: '',
  size: 5,
  last: true,
  totalElements: 0,
  totalPages: 1
};

export interface IPagination {
  last: boolean;
  totalElements: number;
  totalPages: number;
  search?: string;
  status?: string;
  page?: number;
  size?: number
}

export interface ICourseItem {
  id: number
  title: string
  slug: string
  shortDescription?: string
  thumbnailUrl?: string
  price: number
  status: ICourseStatus
  teacher: ITeacherCourse
  lessonCount: number
  createdAt: string
  enrollmentCount?: number
}

export interface ICourseDetail extends ICourseItem {
  description?: string
}

export interface ICourseCreateRequest {
  title: string
  shortDescription?: string
  description?: string
  thumbnailUrl?: string
  price: number
  status: ICourseStatus
}

export type ICourseUpdateRequest = Partial<ICourseCreateRequest>

/* Section Start */
export interface ISection {
  id: number;
  lessonId: number;
  title: string;
  description?: string;
  type: ISectionType;
  status: ISectionStatus;
  videoUrl?: string;
  textContent?: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateSectionRequest {
  title: string;
  description?: string;
  type: ISectionType;
  status?: ISectionStatus;
  videoUrl?: string;
  textContent?: string;
}

export type IUpdateSectionRequest = Partial<ICreateSectionRequest>;

export interface IReorderSectionsRequest {
  items: { sectionId: number; orderIndex: number }[];
}
/* Section End */

/* Lesson Start */
export interface ILessonForm {
  title: string;
  description: string;
  avatarUrl: string;
}

export const lessonFormInit: ILessonForm = {
  title: '',
  description: '',
  avatarUrl: ''
};

export interface ILesson {
  id: number;
  chapterId: number;
  title: string;
  description?: string;
  avatarUrl?: string;
  orderIndex: number;
  sections: ISection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateLessonRequest {
  title: string;
  description?: string;
  avatarUrl?: string;
}

export type IUpdateLessonRequest = Partial<ICreateLessonRequest>;

export interface IReorderLessonsRequest {
  items: { lessonId: number; orderIndex: number }[];
}
/* Lesson End */

/* Chapter Start */

export interface IChapter {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  avatarUrl?: string;
  orderIndex: number;
  lessons: ILesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateChapterRequest {
  title: string;
  description?: string;
  avatarUrl?: string;
}

export interface IUpdateChapterRequest {
  title?: string;
  description?: string;
  avatarUrl?: string;
}

export interface IReorderChaptersRequest {
  items: { chapterId: number; orderIndex: number }[];
}

export interface ICoursesState {
  courses: ICourseItem[];
  courseDraft: ICourseItem | null;
  pagination: IPagination;
  clearAll: () => void;
  setCourses: (courses: ICourseItem[]) => void;
  setCourseDraft: (setCourseDraft: ICourseItem) => void;
  setPagination: (pagination: IPagination) => void;
  setPaginationByFieldName: (fieldName: keyof IPagination, fieldValue: any) => void;
  setCourseDraftByFieldName: (fieldName: keyof ICourseItem, fieldValue: any) => void;
}

export interface IRegisterForm {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface IAuthForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface IAdminUser {
  id: number;
  email: string;
  fullName: string;
  role: IRole;
  phone: string;
  avatarUrl?: string;
}

export interface IAuthResponse {
  accessToken: string
  refreshToken: string
  user: IAdminUser
}

export interface IRegisterState {
  errorMessage: string | null;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  password: string | null;
  avatarUrl?: string | null;
  confirmPassword: string | null;
  setPhone: (phone: string | null) => void;
  setFullName: (fullName: string | null) => void;
  setEmail: (email: string | null) => void;
  setPassword: (password: string | null) => void;
  setAvatarUrl: (avatarUrl: string | null) => void;
  setConfirmPassword: (confirmPassword: string | null) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  reset: () => void;
}

export interface IAuthState {
  user: IAdminUser | null;
  accessToken: string | null;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setAuthentication: (isAuthenticated: boolean) => void;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: IAdminUser | null) => void;
  setAuth: (user: IAdminUser, accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
}

/* ------------------- Report Api Interface Start ----------------------*/
export interface ITopCourseItem {
  courseId: number
  title: string
  slug: string
  thumbnailUrl: string | null
  enrollmentCount: number
}

/** Matches backend `OverviewReportResponse` (JSON field names) */
export interface IOverviewReport {
  totalStudents: number
  totalTeachers: number
  totalPublishedCourses: number
  totalDraftCourses: number
  totalArchivedCourses: number
  totalEnrollmentsPending: number
  totalEnrollmentsApproved: number
  totalEnrollmentsRejected: number
  totalLessonsCompleted: number
  topCourses: ITopCourseItem[]
}

export interface IMonthlyCountItem {
  year: number
  month: number
  count: number
}

export interface ILessonCompletionStat {
  lessonId: number
  lessonTitle: string
  completedCount: number
  totalEnrolled: number
}

export interface ICourseReport {
  courseId: number
  courseTitle: string
  totalEnrolled: number
  approvedEnrollments: number
  monthlyTrend: IMonthlyCountItem[]
  lessonStats: ILessonCompletionStat[]
}

export interface IStudentCourseProgress {
  courseId: number
  courseTitle: string
  enrollmentStatus: string
  progressPercent: number
  completedLessons: number
  totalLessons: number
}

export interface IStudentReport {
  studentId: number
  studentName: string
  studentEmail: string
  courses: IStudentCourseProgress[]
}

/* For Dropdown controls */
export interface IDropdownOption {
  icon?: string;
  label: string;
  value: string | number;
  className?: string | null | undefined
}
