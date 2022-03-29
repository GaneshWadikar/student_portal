import nextConnect from "next-connect";
import {setBatch,deleteBatch} from "/backend/set_batch";

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method Not Allowed` });
  },
});

apiRoute.post(async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  let result = await setBatch(token, req.body);
  return res.json(result);
});

apiRoute.delete(async (req, res) => {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  let result = await deleteBatch(token, req.body.teacher);
  return res.json(result);
});

export default apiRoute;
