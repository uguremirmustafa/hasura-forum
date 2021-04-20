//1.login form for name, email, password

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  const { login } = useAuthDispatch();
  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  const onSubmit = async ({ email, password }) => {
    try {
      await login({ email, password });
      router.push('/');
    } catch (error) {
      setError('email', {
        type: 'manual',
        message: error.message,
      });
    }
    //2.send POST request to /api/register
    //3.if there is an error, return the error
    //4.if successfull, redirect to the root
  };
  return (
    <>
      <h2>login to your account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <input type="email" {...register('email')} placeholder="enter your email" />
          {errors.email && <span>{errors.email?.message}</span>}
        </div>
        <div>
          <input type="password" {...register('password')} placeholder="enter your password" />
          {errors.password && <span>{errors.password?.message}</span>}
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            login
          </button>
        </div>
      </form>
    </>
  );
}
