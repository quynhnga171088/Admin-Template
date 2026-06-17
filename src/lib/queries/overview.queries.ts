import { useQuery } from '@tanstack/react-query';

import { reportApi } from '@/lib/api/report.api';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import type { IOverviewReport } from '@/types/types';

const overviewQueryOptions = {
  queryKey: queryKeys.overview.getOverview(),
  queryFn: () => reportApi.getOverview().then(res => res.data),
  staleTime: Infinity
};

/* Call in component */
export const useOverviewQuery = (enabled = true) => useQuery<IOverviewReport>({ ...overviewQueryOptions, enabled });

/* Call after login success or call before navigate to page use this data */
export const prefetchOverview = () => queryClient.prefetchQuery(overviewQueryOptions);

/* Call after update data to re-fetch data */
export const invalidateOverview = () => queryClient.invalidateQueries({ queryKey: queryKeys.overview.all });
