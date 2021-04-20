import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { hasuraAdminClient } from '../../lib/hasura-admin-client';
import { gql } from 'graphql-request';

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
    }
  }
`;

const InsertUser = gql`
  mutation InsertUser($name: String!, $email: String!, $password: String!) {
    insert_users_one(object: { name: $name, email: $email, password: $password }) {
      id
      name
      email
    }
  }
`;

export default async (req, res) => {
  const { name, email, password: rawPassword } = req.body;

  //1.Lookup user from Hasura by email
  // const user = { name };

  const {
    users: [foundUser],
  } = await hasuraAdminClient.request(GetUserByEmail, {
    email,
  });
  //2.if user found return error
  if (foundUser)
    return res
      .status(400)
      .json({ message: 'Unable to create account with the email provided. Try another.' });
  //3.Hash the password
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash(rawPassword, salt);
  //4.Create the user on hasura

  const { insert_users_one } = await hasuraAdminClient.request(InsertUser, {
    name,
    email,
    password,
  });

  //5.Create a JWT
  const token = jwt.sign(
    {
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user', 'guest'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': insert_users_one.id,
      },
    },
    process.env.HASURA_GRAPHQL_JWT_SECRET,
    {
      subject: insert_users_one.id,
    }
  );
  //6.return JWT as token + user
  res.status(201).json({ token, ...insert_users_one });
};
