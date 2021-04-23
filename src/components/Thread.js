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
    <div className="py-6 flex gap-4 items-center" key={id}>
      <div>
        <FaUserCircle size="32px" color="#05b396" />
      </div>
      <div className="divide-y">
        <h3 className="text-xl font-bold">
          <Link href={`/thread/${id}`}>
            <a className="flex items-center gap-4">
              {pinned && <GiPin color="#f16d70" />}
              {title}
            </a>
          </Link>
        </h3>
        <p className="text-sm pt-2 flex items-center text-gray-600">
          <span className="mr-2">
            <FaUserCircle size="16px" color="#c3cee3" />
          </span>
          {lastPost.author.name} {hasReplies ? 'replied' : 'posted'}
          {` `}
          {category && (
            <>
              {' '}
              in
              <Link href={`/category/${category.id}`}>
                <a className="mx-1 text-blue-500">{category.name}</a>
              </Link>
            </>
          )}
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
