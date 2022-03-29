import login from "/backend/login";
import nextConnect from "next-connect";

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method Not Allowed` });
  },
});

apiRoute.post(async (req, res) => {
  let { urn, password, isStudent } = req.body;
  let result = await login(urn, password, isStudent);
  return res.json(result);
});

export default apiRoute;
