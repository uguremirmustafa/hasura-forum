import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Link from 'next/link';
export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();
  return (
    <>
      <header className="bg-white py-6 shadow-sm capitalise">
        <div className="max-w-4xl mx-auto px-6 flex justify-between">
          <div>
            <Link href="/">
              <a className="mr-2">Home</a>
            </Link>

            <Link href="/ask">
              <a>Ask A Question</a>
            </Link>
          </div>
          <div>
            <Link href="/answered">
              <a>Answered Posts</a>
            </Link>
            <Link href="/today">
              <a>Today's Posts</a>
            </Link>
            {isAuthenticated ? (
              <>
                <button className="ml-2" onClick={() => logout()}>
                  Logout
                </button>
                <span className="ml-2">{user?.name}</span>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-6 px-6">{children}</main>
    </>
  );
}
