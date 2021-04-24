//1.login form for name, email, password

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';
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
  };
  return (
    <Layout>
      <h2 className="page-title">login to your account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
        <input
          className="input-field"
          type="email"
          {...register('email')}
          placeholder="Enter your email"
        />
        {errors.email && <span className="input-error">{errors.email?.message}</span>}

        <input
          className="input-field"
          type="password"
          {...register('password')}
          placeholder="Enter your password"
        />
        {errors.password && <span className="input-error">{errors.password?.message}</span>}

        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading' : 'Login'}
        </button>
      </form>
    </Layout>
  );
}
