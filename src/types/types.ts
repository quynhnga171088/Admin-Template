/* Chapter Start */
export type IChapterModalState = { open: false, mode?: string } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; chapter: IChapter };

export type ILessonModalState =
  | { open: false; mode?: string }
  | { open: true; mode: 'create'; chapterId: number }
  | { open: true; mode: 'edit'; chapterId: number; lesson: ILesson };

export type ISectionType = 'VIDEO' | 'TEXT';
export type ISectionStatus = 'DRAFT' | 'PUBLISHED';
/* Chapter End */

export type IRole = 'TEACHER' | 'ADMIN' | 'STUDENT';
export type IUserStatus = 'ACTIVE' | 'BLOCKED';

export type ICourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type IRegistrationStatus = 'APPROVED' | 'REJECTED' | 'PENDING';

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
  id: number;
  title: string;
  slug: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  price: number;
  status: ICourseStatus;
  teacher: ITeacherCourse;
  createdAt: string;
  publishedAt?: string;
  enrollmentCount?: number;
  lessons: ILesson[];
  categoryId?: number;
  categoryName?: string;
  levelId?: number;
  levelName?: string;
}

export interface ICourseDetail extends ICourseItem {
  description?: string
}

export interface ICategoryCreateRequest {
  categoryName: string;
  description?: string;
  avatar?: string;
}

export interface ICategory {
  id: number;
  categoryName: string;
  description?: string;
  avatar?: string;
  createdDate: string;
}

export interface ILevel {
  id: number;
  levelName: string;
  description?: string;
  categoryId: number;
  createdDate: string;
}

export interface ICourseCreateRequest {
  title: string
  shortDescription?: string
  description?: string
  thumbnailUrl?: string
  price: number
  status: ICourseStatus
  categoryId: number | null
  levelId: number | null
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
  courseDraft: ICourseItem | null;
  clearAll: () => void;
  setCourseDraft: (setCourseDraft: ICourseItem) => void;
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
  status: IUserStatus;
  phone: string;
  createdAt: string;
  avatarUrl?: string;
}

export type IUser = IAdminUser;

export type INewTeacher = {
  email: string;
  fullName: string;
  password: string;
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
  imgUrl?: string;
  label: string;
  value: string | number;
  className?: string | null | undefined
}

/* For Registration Management */
export interface IPaymentProofResponse {
  id: number;
  imageUrl: string;
  note: string;
  createdAt: string;
}

export interface IRegistrationContent {
  id: 2,
  courseId: 18,
  courseTitle: string;
  courseShortDescription: string;
  courseThumbnailUrl: string;
  coursePrice: number;
  studentId: number;
  studentName: string;
  studentPhone: string;
  studentEmail: string;
  studentAvatar: string;
  status: IRegistrationStatus;
  note: string | null;
  reviewedAt: string;
  createdAt: string;
  updatedAt: string;
  progressPercent: number | null;
  completedLessons: number | null;
  totalLessons: number | null;
  paymentProof: IPaymentProofResponse | null;
}

export interface IRecentEnrollment {
  id: number;
  courseId: number;
  courseTitle: string;
  status: IRegistrationStatus;
  createdAt: string;
}

export interface IUserDetail {
  user: IUser,
  recentEnrollments: IRecentEnrollment[]
}

export interface IUpdateUserInfoRequest {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ISetting {
  key: string;
  value: string;
  description: string;
}

export interface ISettingUpdateRequest {
  value: string;
}

export interface IBankInfo {
  id: number
  bankName: string
  accountNumber: string
  accountName: string
  branch?: string
  transferTemplate?: string
  qrImageUrl?: string
  updatedAt: string
}

export interface IUpdateBankInfoRequest {
  bankName: string
  accountNumber: string
  accountName: string
  branch?: string
  transferTemplate?: string
  qrImageUrl?: string
}

export interface IVietQRBank {
  id: number
  name: string
  code: string
  bin: string
  shortName: string
  logo: string
  transferSupported: number
  lookupSupported: number
}
