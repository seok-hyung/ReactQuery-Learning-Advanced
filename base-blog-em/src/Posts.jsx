import { useState, useEffect } from 'react'
import { fetchPosts, deletePost, updatePost } from './api'
import { PostDetail } from './PostDetail'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

const maxPostPage = 10

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: postId => deletePost(postId),
  })

  const updateMutation = useMutation({
    mutationFn: postId => updatePost(postId),
  })

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage),
      })
    }
    // 이 prefetchQuery에서 사용되는 쿼리키는 useQuery에서 사용된 것과 타입이 같아야 한다.
    // 왜냐하면 리액트쿼리가 캐시에 이미 데이터가 있는지 확인할때 여기를 확인해야하기 때문이다.
  }, [currentPage, queryClient])
  // 이걸 언제 실행해야할까??
  // 다음 페이지 버튼의 클릭 이벤트에서 이걸 실행하는 것은 좋지 않다.
  // 왜냐하면 상태 업데이트는 비동기적이라 이 업데이트가 이미 적용되었는지 정확히 알 수 없기 때문이다.
  // 현재 페이지가 무엇인지 확실히 알 수 있는 알맞은 방법이 없다.
  // 그래서, 현재 페이지가 변경될떄마다 useEffect를 사용할 것이다.

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  })
  if (isLoading) {
    return <h3>Loading...</h3>
  }
  if (isError) {
    return (
      <>
        <h3>Oops</h3>
        <p>{error.toString()}</p>
      </>
    )
  }
  return (
    <>
      <ul>
        {data.map(post => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset()
              updateMutation.reset()
              setSelectedPost(post)
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage(previousValue => previousValue - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage(previousValue => previousValue + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          deleteMutation={deleteMutation}
          updateMutation={updateMutation}
        />
      )}
    </>
  )
}
