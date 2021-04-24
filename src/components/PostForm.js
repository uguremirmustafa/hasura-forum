import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaUserCircle } from 'react-icons/fa';
import ReactMde from 'react-mde';
import Markdown from 'react-markdown';
const schema = yup.object().shape({
  message: yup.string().required(),
});
export default function PostForm({ onSubmit }) {
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

  return (
    <div className="flex gap-4">
      <div className="hidden md:block">
        <FaUserCircle size="32px" color="#05b396" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-full w-full">
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

        <button type="submit" disabled={isSubmitting} className="submit-btn mt-4">
          {isSubmitting ? 'submitting' : 'reply'}
        </button>
      </form>
    </div>
  );
}
