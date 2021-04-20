import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { hasuraAdminClient } from '../../lib/hasura-admin-client';
import { gql } from 'graphql-request';

const GetUserByEmail = gql`
  query GetUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      name
      email
      password
    }
  }
`;

export default async (req, res) => {
  const { email, password: rawPassword } = req.body;

  //1.Lookup user from Hasura
  const {
    users: [foundUser],
  } = await hasuraAdminClient.request(GetUserByEmail, {
    email,
  });
  //2.if user found return error
  if (!foundUser) return res.status(400).json({ message: 'Invalid email/password' });

  const { password, ...user } = foundUser;

  //3.do the passswords match?
  const passwordMatch = await bcrypt.compare(rawPassword, password);

  if (!passwordMatch) return res.status(400).json({ message: 'Invalid email/password' });

  //5.Create a JWT
  const token = jwt.sign(
    {
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['user', 'guest'],
        'x-hasura-default-role': 'user',
        'x-hasura-user-id': user.id,
      },
    },
    process.env.HASURA_GRAPHQL_JWT_SECRET,
    {
      subject: user.id,
    }
  );
  //5.return JWT as token + user
  res.status(200).json({ token, ...user });
};
