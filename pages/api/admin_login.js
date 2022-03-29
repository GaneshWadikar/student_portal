import login from "/backend/admin_login";
import nextConnect from "next-connect";

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method Not Allowed` });
  },
});

apiRoute.post(async (req, res) => {
  let { username, password } = req.body;
  let result = await login(username, password);
  return res.json(result);
});

export default apiRoute;
