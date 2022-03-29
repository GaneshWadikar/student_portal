import nextConnect from "next-connect";
import { getEducation, setEducation } from "/backend/education";

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method Not Allowed` });
  },
});

apiRoute.get(async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }
  let resp = await getEducation(token, req.query);
  return res.json(resp);
});

apiRoute.post(async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }
  let resp = await setEducation(token, req.body);
  return res.json(resp);
});

export default apiRoute;
