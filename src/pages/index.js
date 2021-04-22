import React from 'react';
import Layout from '../components/Layout';
import { hasuraUserClient } from '../lib/hasura-user-client';
export default function index() {
  return (
    <Layout>
      <p>hello</p>
    </Layout>
  );
}
