import React from 'react';

import { PostItem } from '../components/PostItem'
import { Post } from '../types/Post'

interface Props {
  posts: Post[]
}

export const PostList = ({ posts }: Props): JSX.Element | null => {
  return (
    <div className="bg-white rounded-lg shadow">
      <ul className="divide-y divide-gray-100">
        {posts.map((post) => {
          return (
            <PostItem
              key={post.id}
              title={post.title}
              body={post.body}
            />
          )
        })}
      </ul>
    </div>
  )
}