import encryptor from "./enc.js";
import { con } from "./db.js";

async function login(username, password) {
  try {
    let [rows, fields] = await con
      .promise()
      .query(`SELECT password FROM admin WHERE username = '${username}'`);
    if (rows.length === 0) {
      return { message: "Admin account not found", status: 404 };
    }
    if (password === rows[0].password) {
      return {
        message: "Logged in Successfully",
        status: 200,
        token: await encryptor.encrypt(`valid admin account`),
      };
    } else {
      return { message: "Incorrect Password", status: 400 };
    }
  } catch (e) {
    return { message: e.sqlMessage, status: 400 };
  }
}

export default login;
