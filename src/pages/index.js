import React from 'react';
import { useAuthState, useAuthDispatch } from '../context/auth';

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
            email: 'ugur@gmail.com',
            password: 'ugur1234',
          })
        }
      >
        login
      </button>
      <button
        onClick={() =>
          register({
            name: 'messi',
            email: 'ugur@gmail.com',
            password: 'ugur1234',
          })
        }
      >
        register
      </button>
    </>
  );
}
