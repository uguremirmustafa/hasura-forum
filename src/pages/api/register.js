export default async (req, res) => {
  const { name, email, password } = req.body;

  //1.Lookup user from Hasura by email
  const user = { name };
  //2.if user found return error

  //3.Hash the password

  //4.Create the user

  //5.Create a JWT
  const token = 'usertoken';
  //6.return JWT as token + user
  res.status(200).json({ token, ...user });
};
