import InfiniteScroll from 'react-infinite-scroller'
import { Species } from './Species'
import { useInfiniteQuery } from '@tanstack/react-query'

const baseUrl = 'https://swapi-node.vercel.app'
const initialUrl = baseUrl + '/api/species'
const fetchUrl = async url => {
  const response = await fetch(url)
  return response.json()
}

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: lastPage => {
      return lastPage.next ? baseUrl + lastPage.next : undefined
    },
  })

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }
  if (isError) {
    return <div>Error! {error.toString()} </div>
  }

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        loadMore={() => {
          if (!isFetching) fetchNextPage()
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map(pageData => {
          return pageData.results.map(species => {
            return (
              <Species
                key={species.fields.name}
                name={species.fields.name}
                language={species.fields.language}
                averageLifespan={species.fields.average_lifespan}
              />
            )
          })
        })}
      </InfiniteScroll>
    </>
  )
}
