import React from 'react';
import { formatRelative } from 'date-fns';
import { FaUserCircle } from 'react-icons/fa';
import Markdown from 'react-markdown';
import Reactions from './Reactions';

const today = new Date();
export default function Post({ id, message, created_at, author, actions, likes_aggregate, likes }) {
  const timeAgo = formatRelative(Date.parse(created_at), today, {
    weekStartsOn: 1,
  });

  return (
    <div className="flex gap-4 py-4">
      <div>
        <FaUserCircle size="32px" color="#05b396" />
      </div>
      <div className="flex-1 border-b">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{author.name}</span>
          <span className="text-xs">{timeAgo}</span>
        </div>
        <div>
          <Markdown children={message} />
        </div>
        <Reactions {...actions} postId={id} likes_aggregate={likes_aggregate} likes={likes} />
      </div>
    </div>
  );
}
