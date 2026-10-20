import { queryOptions } from '@tanstack/react-query';
import { getCms } from './cms.functions';
export const cmsQuery = queryOptions({ queryKey: ['cms'], queryFn: () => getCms(), staleTime: 60_000 });
