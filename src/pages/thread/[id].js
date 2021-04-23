import React from 'react';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import { gql, hasuraUserClient } from '../../lib/hasura-user-client';
import { useRouter } from 'next/router';
import PostList from '../../components/PostList';
import PostForm from '../../components/PostForm';

const GetThreadIds = gql`
  {
    threads {
      id
    }
  }
`;

const GetThreadById = gql`
  query GetThreadById($id: uuid!) {
    threads_by_pk(id: $id) {
      id
      title
      locked
      posts(order_by: { created_at: asc }) {
        id
        message
        created_at
        author {
          name
        }
      }
    }
  }
`;

const InsertPost = gql`
  mutation InsertPost($threadId: uuid!, $message: String!) {
    insert_posts_one(object: { thread_id: $threadId, message: $message }) {
      id
      message
      created_at
      author {
        name
      }
    }
  }
`;

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const hasura = hasuraUserClient();
  const { threads_by_pk: initialData } = await hasura.request(GetThreadById, { id });

  return {
    props: {
      initialData,
    },
    revalidate: 1,
  };
};
export const getStaticPaths = async () => {
  const hasura = hasuraUserClient();
  const { threads } = await hasura.request(GetThreadIds);
  return {
    paths: threads.map(({ id }) => ({ params: { id } })),
    fallback: false,
  };
};

export default function ThreadPage({ initialData }) {
  const hasura = hasuraUserClient();
  const router = useRouter();

  const { id } = router.query;

  const { data, mutate } = useSWR(
    [GetThreadById, id],
    (query, id) => hasura.request(query, { id }),
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  const handlePost = async ({ message }) => {
    try {
      const { insert_posts_one } = await hasura.request(InsertPost, { threadId: id, message });

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: [...data.threads_by_pk.posts, insert_posts_one],
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold">{data.threads_by_pk?.title}</h2>
      <PostList posts={data.threads_by_pk?.posts} />
      {data.threads_by_pk?.locked ? 'this thread is locked' : <PostForm onSubmit={handlePost} />}
    </Layout>
  );
}
