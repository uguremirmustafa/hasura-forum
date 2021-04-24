import React from 'react';
import Post from './Post';
export default function PostList({ posts, ...props }) {
  if (!posts) return null;
  return (
    <div className="py-6 md:py-12">
      {posts.map((post) => (
        <Post key={post.id} {...post} {...props} />
      ))}
    </div>
  );
}
