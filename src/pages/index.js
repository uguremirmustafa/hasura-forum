import React from 'react';
import Name from '../components/Name';
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
            email: 'enes@gmail.com',
            password: 'enes1234',
          })
        }
      >
        login
      </button>
      <button
        onClick={() =>
          register({
            name: 'enes',
            email: 'enes@gmail.com',
            password: 'enes1234',
          })
        }
      >
        register
      </button>
    </>
  );
}
