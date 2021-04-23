import React from 'react';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import { gql, hasuraUserClient } from '../../lib/hasura-user-client';
import { useRouter } from 'next/router';
import ThreadList from '../../components/ThreadList';

const GetCategoryIds = gql`
  query GetCategoryIds {
    categories {
      id
    }
  }
`;

const GetCategoryById = gql`
  query GetCategoryById($id: uuid!) {
    categories_by_pk(id: $id) {
      id
      name
      threads(order_by: { pinned: desc, posts_aggregate: { max: { created_at: desc } } }) {
        id
        title
        answered
        locked
        pinned
        author {
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
  }
`;

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const hasura = hasuraUserClient();
  const initialData = await hasura.request(GetCategoryById, { id });
  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};
export const getStaticPaths = async () => {
  const hasura = hasuraUserClient();
  const { categories } = await hasura.request(GetCategoryIds);
  return {
    paths: categories.map(({ id }) => ({ params: { id } })),
    fallback: true,
  };
};

export default function CategoryPage({ initialData }) {
  const hasura = hasuraUserClient();
  const router = useRouter();

  const { id, isFallback } = router.query;

  const { data } = useSWR([GetCategoryById, id], (query, id) => hasura.request(query, { id }), {
    initialData,
    revalidateOnMount: true,
  });

  if (!isFallback && !data) return <Layout>No such thread found</Layout>;
  if (isFallback) return <Layout>Loading thread</Layout>;
  return (
    <Layout>
      <h2 className="text-2xl font-bold">{data.categories_by_pk.name}</h2>
      <ThreadList threads={data.categories_by_pk.threads} />
    </Layout>
  );
}
