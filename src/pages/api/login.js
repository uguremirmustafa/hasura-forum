export default async (req, res) => {
  const { email, password } = req.body;

  //1.Lookup user from Hasura
  const user = { name: 'ugur' };
  //2.if no user found return error

  //3.do the passswords match?

  //4.Create a JWT
  const token = 'abc';
  //5.return JWT as token + user
  res.status(200).json({ token, ...user });
};
