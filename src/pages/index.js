import React from 'react';
import { useAuthState } from '../context/auth';

export default function index() {
  const { isAuthenticated } = useAuthState();
  return isAuthenticated ? 'hello user' : 'hello guest';
}
