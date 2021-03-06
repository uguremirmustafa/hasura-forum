import React from 'react';
import useSWR from 'swr';
import Layout from '../components/Layout';
import ThreadList from '../components/ThreadList';
import { hasuraUserClient, gql } from '../lib/hasura-user-client';

const GetThreads = gql`
  {
    threads(order_by: { pinned: desc, posts_aggregate: { max: { created_at: desc } } }) {
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
  const initialData = await hasura.request(GetThreads);

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};

export default function IndexPage({ initialData }) {
  const hasura = hasuraUserClient();

  const { data } = useSWR(GetThreads, (query) => hasura.request(query), {
    initialData,
    revalidateOnMount: true,
  });
  return (
    <Layout>
      <h1 className="page-title">Welcome to NextJS-Graphql-Forum</h1>
      <ThreadList threads={data.threads} />
    </Layout>
  );
}
