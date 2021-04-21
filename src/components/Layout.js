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
          {isAuthenticated ? (
            <>
              <span>hello {user?.name}</span>
              <button onClick={() => logout()}>logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              <Link href="/ask">Ask A Question</Link>
            </>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 px-6">{children}</main>
    </>
  );
}
