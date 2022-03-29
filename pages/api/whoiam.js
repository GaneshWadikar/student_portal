import encryptor from "/backend/enc";

export default async function Handler(req, res) {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  let tokenDecr = await encryptor.decrypt(token);
  let [tokenOf,] = tokenDecr.split("&&");
  return res.json({iam: tokenOf==='student'?'student':'teacher',status: 200});
}