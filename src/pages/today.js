import React from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import ThreadList from '../components/ThreadList';
import { hasuraUserClient, gql } from '../lib/hasura-user-client';
import { startOfToday, endOfToday } from 'date-fns';

const from = new Date(startOfToday()).toISOString();
const to = new Date(endOfToday()).toISOString();

const GetTodaysPosts = gql`
  query GetTodaysPosts($from: timestamptz!, $to: timestamptz!) {
    threads(
      where: { posts: { created_at: { _gte: $from, _lte: $to } } }
      order_by: { pinned: desc, posts_aggregate: { max: { created_at: desc } } }
    ) {
      id
      title
      answered
      locked
      pinned
      author {
        name
      }
      category {
        id
        name
      }
      posts(limit: 1, order_by: { created_at: desc }) {
        id
        author {
          name
        }
        message
        created_at
      }
      posts_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const getStaticProps = async () => {
  const hasura = hasuraUserClient();
  const initialData = await hasura.request(GetTodaysPosts, {
    from,
    to,
  });

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function TodaysPostsPage({ initialData, from, to }) {
  const hasura = hasuraUserClient();

  const { data, error } = useSWR(GetTodaysPosts, (query) => hasura.request(query, { from, to }), {
    initialData,
    revalidateOnMount: true,
  });
  return (
    <Layout>
      <h1 className="text-3xl">Today's Posts</h1>
      <ThreadList threads={data.threads} />
    </Layout>
  );
}
