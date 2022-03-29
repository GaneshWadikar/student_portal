import multer from "multer";
import nextConnect from "next-connect";
import { con } from "/backend/db";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/profiles/");
    },
    filename: (req, file, cb) => {
      let filename = `${req.body.urn}.png`;
      cb(null, filename);
    },
  }),
});

const apiRoute = nextConnect({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method Not Allowed` });
  },
});

const uploadMiddleware = upload.single("image");

apiRoute.use(uploadMiddleware);

apiRoute.post(async (req, res) => {
  await con
    .promise()
    .execute(`UPDATE information SET profile_pic=? WHERE urn=?`, [
      `/profiles/${req.body.urn}.png`,
      req.body.urn,
    ]);
  return res.end("<h1>Profile Picture Updated Successfully</h1><a href='/student'>Go Back</a>");
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
