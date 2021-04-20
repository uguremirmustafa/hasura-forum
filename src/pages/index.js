import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Link from 'next/link';
export default function index() {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();
  return isAuthenticated ? (
    <>
      <p>hello {user?.name}</p>
      <button onClick={() => logout()}>logout</button>
    </>
  ) : (
    <>
      <Link href="/login">login</Link>
      <Link href="/register">register</Link>
    </>
  );
}
