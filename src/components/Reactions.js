import React from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { useAuthState } from '../context/auth';
export default function Reactions({ likes_aggregate, handleLike, handleUnlike, postId, likes }) {
  const { user } = useAuthState();
  const {
    aggregate: { count },
  } = likes_aggregate;

  let liked = likes.find((l) => l.user_id === user?.id);

  const like = () => handleLike({ postId });
  const unlike = (id) => handleUnlike({ id });

  return (
    <div className="flex justify-between">
      <div
        className={`py-2 flex items-center text-xl ${liked ? 'text-green-500' : 'text-gray-700'}`}
      >
        <button
          onClick={!liked ? like : () => unlike(liked.id)}
          className={`${
            liked
              ? 'hover:bg-red-200 hover:text-red-500'
              : 'hover:bg-green-200 hover:text-green-500'
          } rounded-full md:p-2`}
        >
          <AiOutlineLike />
        </button>
        {count > 0 && (
          <span className="text-xs ml-1">
            {count} {count > 1 ? 'likes' : 'like'}
          </span>
        )}
      </div>
    </div>
  );
}
