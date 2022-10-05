import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Post } from '../types/Post'

// should be ENV variable
const API_URL = 'https://jsonplaceholder.typicode.com'

// could be customizable if needed
const PAGE_SIZE = 20

export const useFetchPosts = () => {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<Post[]>(
    ['posts'],
    async ({ pageParam = 0 }) => {
      const res = await axios.get(`${API_URL}/posts?_start=${pageParam * PAGE_SIZE}&_limit=${PAGE_SIZE}`)
      return res.data
    },
    {
      getNextPageParam: (_, allPages) => {
        if (allPages[allPages.length - 1].length === 0) {
          return undefined
        }
        return allPages.length
      }
    },
  )

  return {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  }
}