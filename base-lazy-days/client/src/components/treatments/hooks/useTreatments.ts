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
    // staleTime: 600000, // 10분
    // gcTime: 900000, // 15분 (staleTime이 gcTime보다 큰건 말이 안됨)
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  })
  return data
}

// 캐시를 채우는 것이므로 아무것도 반환하지 않을 것이다.
// prefetch는 일회성 작업이다. 단지 데이터를 가져와서 캐시에 저장하고, useQuery처럼 모니터링은 하지 않습니다.
export function usePrefetchTreatments(): void {
  const queryClient = useQueryClient()
  queryClient.prefetchQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    // staleTime: 600000, // 10분
    // gcTime: 900000, // 15분 (staleTime이 gcTime보다 큰건 말이 안됨)
  })
}

// Apoointments와 같이 명시적으로 재정의하는 경우를 제외하고 모든 쿼리에 이를 적용해야 한다.
