import InfiniteScroll from 'react-infinite-scroller'
import { Person } from './Person'
import { useInfiniteQuery } from '@tanstack/react-query'

const initialUrl = 'https://swapi.dev/api/people/'
const fetchUrl = async url => {
  const response = await fetch(url)
  return response.json()
}

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['sw-people'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: lastPage => {
      return lastPage.next || undefined
    },
  })

  if (isFetching) {
    return <div className="loading">Loading...</div>
  }
  if (isError) {
    return <div>Error! {error.toString()} </div>
  }

  return (
    <InfiniteScroll
      loadMore={() => {
        if (!isFetching) {
          fetchNextPage()
        }
      }}
      hasMore={hasNextPage}
    >
      {data.pages.map(pageData => {
        return pageData.results.map(person => {
          return (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          )
        })
      })}
    </InfiniteScroll>
  )
}
