import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer'

import { Post } from '../types/Post'
import { SortDirection } from '../types/Sort'
import { useFetchPosts } from '../hooks/useFetchPosts'
import { PostList } from '../components/PostList'
import { SearchBar } from '../components/SearchBar'

function compareFn(a: string, b: string) {
  const str1 = a.toLowerCase()
  const str2 = b.toLowerCase()
  if (str1 < str2) {
    return -1
  }
  if (str1 > str2) {
    return 1
  }
  return 0
}

const PostListView = (): JSX.Element | null => {
  const [searchPhrase, setSearchPhrase] = useState('')
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC)
  const { ref, inView } = useInView()
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useFetchPosts()

  const handleToggleSortDirection = useCallback(() => {
    setSortDirection(value => {
      if (value === SortDirection.ASC) {
        return SortDirection.DESC
      }
      return SortDirection.ASC
    })
  }, [])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  const posts = useMemo<Post[]>(() => {
    let flatList = data
      ? data.pages
        .reduce((acc, page) => {
          return acc.concat(page)
        }, [])
        // questionable functionality 🤔 
        // every time new data chunk loaded we reorder entire list
        .sort((a: Post, b: Post) => {
          if (sortDirection === SortDirection.ASC) {
            return compareFn(a.title, b.title)
          } else {
            return -compareFn(a.title, b.title)
          }
        })
      : []

    if (searchPhrase) {
      flatList = flatList.filter(post => post.title.includes(searchPhrase))
    }

    return flatList
  }, [data, searchPhrase, sortDirection])

  if (status === 'loading') {
    return <p>Loading....</p>
  }

  if (!data) {
    return <p>No posts found</p>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="py-4 grid grid-cols-12 gap-4">
        <div className="col-span-10">
          <SearchBar onChange={setSearchPhrase} />
        </div>
        <button
          className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handleToggleSortDirection}
        >
          Toggle sort direction
        </button>
      </div>
        
      <PostList posts={posts} />

      <div className="py-4 text-center">
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load Posts'
            : 'There are no other posts yet'}
        </button>
      </div>
    </div>
  )
}

export default PostListView