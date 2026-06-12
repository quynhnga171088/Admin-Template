import type { IPageResponse, IPagination, IRegistrationContent } from '@/types/types';
import { enrollmentApi } from '@/lib/api/enrollment.api';

/** Pure queryFn — use queryFn for useQuery in component */
export const enrollmentsFetcher: (pagination: IPagination) => Promise<IPageResponse<IRegistrationContent>> =
  (pagination: IPagination) => enrollmentApi.getEnrollments(pagination).then(res => res.data);
