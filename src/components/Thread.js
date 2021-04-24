import React from 'react';
import { formatRelative } from 'date-fns';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { GiPin } from 'react-icons/gi';
const today = new Date();
export default function Thread({ title, id, posts, posts_aggregate, category, pinned }) {
  const { count } = posts_aggregate.aggregate;
  const [lastPost] = posts;
  const timeAgo = formatRelative(Date.parse(lastPost.created_at), today, {
    weekStartsOn: 1,
  });
  const hasReplies = posts.length > 1;

  return (
    <div
      className="py-4 flex gap-3 items-start px-2 border border-gray-300 rounded-sm mb-4 bg-gray-50"
      key={id}
    >
      <div className="pt-2 grid place-items-center gap-4">
        <FaUserCircle size="32px" color="#05b396" />
        {pinned && (
          <span className="p-1 bg-red-100 rounded-full">
            <GiPin color="#f16d70" size="12px" />
          </span>
        )}
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-bold">
          <Link href={`/thread/${id}`}>
            <a className="flex items-center gap-4 hover:text-gray-700">{title}</a>
          </Link>
        </h3>
        <p className="text-sm pt-2 flex items-center text-gray-600">
          <span className="mr-2">
            <FaUserCircle size="16px" color="#c3cee3" />
          </span>
          <span className="pr-1 font-bold">{lastPost.author.name}</span>
          {hasReplies ? 'replied' : 'posted'}
          {` `}
          {category && (
            <>
              {' '}
              in
              <Link href={`/category/${category.id}`}>
                <a className="mx-1 text-green-500 hover:text-green-400">{category.name}</a>
              </Link>
            </>
          )}
        </p>
        <span className="text-xs pt-2 flex items-center text-gray-600">{timeAgo}</span>
      </div>
    </div>
  );
}
