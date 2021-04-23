import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Link from 'next/link';
export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();
  return (
    <>
      <header className="bg-white py-6 shadow-sm">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/">
            <a className="mr-2">Home</a>
          </Link>
          <Link href="/ask">
            <a>Ask A Question</a>
          </Link>
          {isAuthenticated ? (
            <>
              <span className="px-4">{user?.name}</span>
              <button onClick={() => logout()}>logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 px-6">{children}</main>
    </>
  );
}
