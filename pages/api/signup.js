import nextConnect from "next-connect";
import register from "/backend/register";

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method Not Allowed` });
  },
});

apiRoute.post(async (req, res) => {
  let { name, urn, password, isStudent } = req.body;
  let result = await register(name, urn, password, isStudent);
  return res.json(result);
});

export default apiRoute;
