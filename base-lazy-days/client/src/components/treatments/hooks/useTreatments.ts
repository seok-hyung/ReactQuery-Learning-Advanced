import { queryClient } from '@/react-query/queryClient'
import type { Treatment } from '@shared/types'

import { axiosInstance } from '@/axiosInstance'
import { queryKeys } from '@/react-query/constants'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments')
  return data
}

export function useTreatments(): Treatment[] {
  const fallback: Treatment[] = []
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  })
  return data
}

// 캐시를 채우는 것이므로 아무것도 반환하지 않을 것이다.
export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient()
  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  })
}
