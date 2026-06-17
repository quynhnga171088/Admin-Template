import type {
  IUser,
  IPagination,
  IPageResponse
} from '@/types/types';
import { usersApi } from '@/lib/api/users.api';

/**
 *  Pure queryFn — use queryFn for useQuery in component
 */
export const usersFetcher: (pagination: IPagination) => Promise<IPageResponse<IUser>>
  = (pagination: IPagination) => usersApi.getUsers(pagination).then(res => res.data);
