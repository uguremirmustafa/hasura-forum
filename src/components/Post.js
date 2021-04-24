import React from 'react';
import { formatRelative } from 'date-fns';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import Markdown from 'react-markdown';
import Reactions from './Reactions';
import { useAuthState } from '../context/auth';

const today = new Date();
export default function Post({ id, message, created_at, author, actions, likes_aggregate, likes }) {
  const timeAgo = formatRelative(Date.parse(created_at), today, {
    weekStartsOn: 1,
  });
  const { user, isAuthenticated } = useAuthState();
  const { handleDeletePost } = actions;
  const isOwner = isAuthenticated && author.id === user.id;
  const deletePost = () => handleDeletePost({ id });
  return (
    <div className="flex gap-4 py-4 border border-gray-300 rounded-sm mb-4 px-2 bg-gray-50">
      <div>
        <FaUserCircle size="32px" color="#05b396" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between border-b pb-1 mb-2">
          <span className="text-sm font-semibold">{author.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{timeAgo}</span>
            {isOwner && (
              <button onClick={deletePost}>
                <AiOutlineDelete />
              </button>
            )}
          </div>
        </div>
        <div>
          <Markdown children={message} />
        </div>
        <div className="mt-4">
          <Reactions
            {...actions}
            postId={id}
            likes_aggregate={likes_aggregate}
            likes={likes}
            authorId={author.id}
          />
        </div>
      </div>
    </div>
  );
}
