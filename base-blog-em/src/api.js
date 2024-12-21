export async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  )
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: 'DELETE' }
  )
  return response.json()
}

export async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  )
  return response.json()
}
