import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaUserCircle } from 'react-icons/fa';

const schema = yup.object().shape({
  message: yup.string().required(),
});
export default function PostForm({ onSubmit }) {
  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  return (
    <div className="flex gap-4">
      <div>
        <FaUserCircle size="32px" color="#05b396" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
        <div>
          <textarea
            {...register('message')}
            placeholder="reply to thread"
            rows={5}
            className="w-full p-4 bg-gray-100 rounded-md"
          />
          {errors.message && <span>{errors.message?.message}</span>}
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-white font-bold p-2 rounded w-40"
          >
            {isSubmitting ? 'submitting' : 'reply'}
          </button>
        </div>{' '}
      </form>
    </div>
  );
}
