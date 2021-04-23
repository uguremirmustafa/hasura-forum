import React from 'react';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import { gql, hasuraUserClient } from '../../lib/hasura-user-client';
import { useRouter } from 'next/router';
import PostList from '../../components/PostList';
import PostForm from '../../components/PostForm';
import { useAuthState, useAuthDispatch } from '../../context/auth';
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
    fallback: true,
  };
};

export default function ThreadPage({ initialData }) {
  const { isAuthenticated } = useAuthState();

  const hasura = hasuraUserClient();
  const router = useRouter();

  const { id, isFallback } = router.query;

  const { data, mutate } = useSWR(
    [GetThreadById, id],
    (query, id) => hasura.request(query, { id }),
    {
      initialData,
      revalidateOnMount: true,
    }
  );

  if (!isFallback && !data) return <p>No such thread found</p>;

  const handlePost = async ({ message }, { target }) => {
    console.log(target);
    try {
      const { insert_posts_one } = await hasura.request(InsertPost, { threadId: id, message });

      mutate({
        ...data,
        threads_by_pk: {
          ...data.threads_by_pk,
          posts: [...data.threads_by_pk.posts, insert_posts_one],
        },
      });

      target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  if (isFallback) return <Layout>Loading thread</Layout>;
  return (
    <Layout>
      <h2 className="text-2xl font-bold">{data.threads_by_pk?.title}</h2>
      <PostList posts={data.threads_by_pk?.posts} />
      {isAuthenticated && !data.threads_by_pk?.locked && <PostForm onSubmit={handlePost} />}
    </Layout>
  );
}
