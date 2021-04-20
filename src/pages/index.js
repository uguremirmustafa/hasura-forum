import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Link from 'next/link';
export default function index() {
  const { isAuthenticated, user } = useAuthState();
  const { login, register, logout } = useAuthDispatch();
  return isAuthenticated ? (
    <>
      <p>hello {user?.name}</p>
      <button onClick={() => logout()}>logout</button>
    </>
  ) : (
    <>
      <button
        onClick={() =>
          login({
            email: 'enes@gmail.com',
            password: 'enes1234',
          })
        }
      >
        login
      </button>
      <Link href="/register">register</Link>
    </>
  );
}
