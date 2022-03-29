import encryptor from "./enc.js";
import { con } from "./db.js";

async function getData(token, query) {
  try {
    let token_text = await encryptor.decrypt(token);
    if (token_text !== "valid admin account") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    let [teachers] = await con.promise().query("SELECT trn,name FROM teacher");

    let [students] = await con
      .promise()
      .query("SELECT urn,name FROM information");

    let [connection] = await con
      .promise()
      .query("SELECT urn,trn FROM mentor_batch");

    return { teachers, students, connection };
  } catch (e) {
    return { message: e.sqlMessage, status: 500 };
  }
}

export default getData;
