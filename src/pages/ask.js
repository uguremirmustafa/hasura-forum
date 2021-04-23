import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { hasuraAdminClient } from '../lib/hasura-admin-client';
import { gql } from 'graphql-request';
import { hasuraUserClient } from '../lib/hasura-user-client';
import { useRouter } from 'next/router';
import ReactMde from 'react-mde';
import Markdown from 'react-markdown';

const InsertThread = gql`
  mutation InsertThread($categoryId: uuid!, $title: String!, $message: String!) {
    insert_threads_one(
      object: { category_id: $categoryId, title: $title, posts: { data: { message: $message } } }
    ) {
      id
    }
  }
`;

const schema = yup.object().shape({
  title: yup.string().required(),
  categoryId: yup.string().required(),
  message: yup.string().required(),
});
export default function AskPage({ categories }) {
  const router = useRouter();
  const hasura = hasuraUserClient();
  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [selectedTab, setSelectedTab] = useState('write');

  const onSubmit = async ({ categoryId, title, message }) => {
    try {
      const { insert_threads_one } = await hasura.request(InsertThread, {
        categoryId,
        title,
        message,
      });
      router.push(`/thread/${insert_threads_one.id}`);
    } catch (error) {}
  };
  return (
    <Layout>
      <h2 className="text-3xl">ask a question</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <select {...register('categoryId')}>
            {categories.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span>{errors.categoryId?.message}</span>}
        </div>
        <div>
          <input {...register('title')} placeholder="thread title" />
          {errors.title && <span>{errors.title?.message}</span>}
        </div>
        <div>
          <Controller
            control={control}
            name="message"
            defaultValue=""
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, isTouched, isDirty, error },
              formState,
            }) => (
              <ReactMde
                onChange={onChange}
                value={value}
                name={name}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(<Markdown children={markdown} />)
                }
              />
            )}
          />
          {errors.message && <span>{errors.message?.message}</span>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            Post
          </button>
        </div>{' '}
      </form>
    </Layout>
  );
}

const GetCategories = gql`
  {
    categories {
      name
      id
    }
  }
`;

export async function getStaticProps() {
  const { categories } = await hasuraAdminClient.request(GetCategories);

  return {
    props: { categories },
  };
}
