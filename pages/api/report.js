import nextConnect from "next-connect";
import report from "/backend/report";

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

  let resp = await report(token,req.query.urn);
  return res.json(resp);
});

export default apiRoute;