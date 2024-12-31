import { QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from '@/components/app/toast'

function errorHandler(errorMsg: string) {
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = 'react-query-toast' // 중복된 토스트가 표시되지 않는지 확인할 수 있도록 토스트에 Id를 지정한다.

  if (!toast.isActive(id)) {
    const action = 'fetch' // useQury 에러인지, useMutation 에러인지에 따라서 이 값을 변화시켜준다.
    const title = `could not ${action} data: ${
      errorMsg ?? 'error connecting to server'
    }`
    toast({ id, title, status: 'error', variant: 'subtle', isClosable: true })
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      errorHandler(error.message)
    },
  }),
})
