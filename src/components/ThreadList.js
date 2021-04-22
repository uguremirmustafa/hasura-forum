import React from 'react';
import Thread from './Thread';
export default function ThreadList({ threads }) {
  if (!threads) return null;
  return (
    <div className="py-6 md:py-12">
      {threads.map((thread) => (
        <Thread key={thread.id} {...thread} />
      ))}
    </div>
  );
}
