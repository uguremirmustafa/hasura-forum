import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';
import Link from 'next/link';
import { routes } from './Routes';
export default function Layout({ children }) {
  const { isAuthenticated, user } = useAuthState();
  const { logout } = useAuthDispatch();
  const links = routes.map((r) => (
    <Link href={r.path}>
      <a className="nav-btn">{r.label}</a>
    </Link>
  ));
  return (
    <>
      <header className="bg-white shadow-sm capitalise">
        <div className="max-w-4xl mx-auto p-4 md:flex justify-between">
          <div>{links}</div>
          <div>
            {isAuthenticated ? (
              <>
                <a className="nav-btn-secondary" onClick={() => logout()}>
                  Logout / {user?.name}
                </a>
              </>
            ) : (
              <>
                <Link href="/login">
                  <a className="nav-btn-secondary">Login</a>
                </Link>
                <Link href="/register">
                  <a className="nav-btn-secondary">Register</a>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-4 px-4">{children}</main>
    </>
  );
}
