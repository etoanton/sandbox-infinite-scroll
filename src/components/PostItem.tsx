import React from 'react';

import { Post } from '../types/Post'

interface Props {
  title: Post['title']
  body: Post['body']
}

export const PostItem = ({ title, body }: Props): JSX.Element => {
  return (
    <li className="p-10 hover:bg-blue-600 hover:text-blue-200">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p>{body}</p>
    </li>
  )
}