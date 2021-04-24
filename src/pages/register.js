//1.login form for name, email, password

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/Layout';
const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  const { register: createUser } = useAuthDispatch();
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

  const onSubmit = async ({ name, email, password }) => {
    try {
      await createUser({ name, email, password });
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
      <h2 className="page-title ">create an account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="form ">
        <input className="input-field" {...register('name')} placeholder="your name" />
        {errors.name && <span className="input-error">{errors.name?.message}</span>}

        <input
          className="input-field"
          type="email"
          {...register('email')}
          placeholder="your email"
        />
        {errors.email && <span className="input-error ">{errors.email?.message}</span>}

        <input
          className="input-field"
          type="password"
          {...register('password')}
          placeholder="choose a password"
        />
        {errors.password && <span className="input-error">{errors.password?.message}</span>}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Loading' : 'create an account'}
        </button>
      </form>
    </Layout>
  );
}
