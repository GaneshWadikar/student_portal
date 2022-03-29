import encryptor from "./enc.js";
import { con } from "./db.js";

async function basicInfo(token, query) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, urn] = tokenDecr.split("&&");
    if (tokenOf !== "student" && tokenOf !== "teacher") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }
    if (tokenOf === "teacher" && query.urn) {
      urn = query.urn;
    }

    let [rows, fields] = await con
      .promise()
      .execute("SELECT urn,name,profile_pic FROM information WHERE urn = ?", [
        urn,
      ]);

    if (rows.length === 0) {
      return { message: "Invalid or Expired Token", status: 400 };
    }
    return rows[0];
  } catch (e) {
    return { message: e.sqlMessage, status: 500 };
  }
}

export default basicInfo;
