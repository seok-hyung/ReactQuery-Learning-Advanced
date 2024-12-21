import { useState } from 'react'
import { fetchPosts, deletePost, updatePost } from './api'
import { PostDetail } from './PostDetail'
import { useQuery } from '@tanstack/react-query'

const maxPostPage = 10

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

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
            onClick={() => setSelectedPost(post)}
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
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
