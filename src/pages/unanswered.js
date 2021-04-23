import React from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import ThreadList from '../components/ThreadList';
import { hasuraUserClient, gql } from '../lib/hasura-user-client';

const GetUnAnsweredPosts = gql`
  query GetUnAnsweredPosts {
    threads(
      where: { answered: { _eq: false } }
      order_by: { pinned: desc, posts_aggregate: { max: { created_at: desc } } }
    ) {
      id
      title
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
  const initialData = await hasura.request(GetUnAnsweredPosts);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function AnsweredPostsPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data, error } = useSWR(GetUnAnsweredPosts, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true,
  });
  return (
    <Layout>
      <h1 className="text-3xl">Posts Waiting to be Answered</h1>
      <ThreadList threads={data.threads} />
    </Layout>
  );
}
