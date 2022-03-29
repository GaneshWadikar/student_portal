import encryptor from "./enc.js";
import { con } from "./db.js";

async function login(urn, password, isStudent) {
  try {
    if (isStudent) {
      let [rows, fields] = await con
        .promise()
        .query(`SELECT urn,password FROM student WHERE urn = ${urn}`);
      if (rows.length === 0) {
        return { message: "Student not found", status: 404 };
      }

      if (await encryptor.comapare(password, rows[0].password)) {
        return {
          message: "Logged in Successfully",
          status: 200,
          token: await encryptor.encrypt(`student&&${urn}`),
        };
      } else {
        return { message: "Incorrect Password", status: 400 };
      }
    } else {
      let [rows, fields] = await con
        .promise()
        .query(`SELECT trn,password FROM teacher WHERE trn = ${urn}`);
      if (rows.length === 0) {
        return { message: "Teacher not found", status: 404 };
      }

      if (await encryptor.comapare(password, rows[0].password)) {
        return {
          message: "Logged in Successfully",
          status: 200,
          token: await encryptor.encrypt(`teacher&&${urn}`),
        };
      } else {
        return { message: "Incorrect Password", status: 400 };
      }
    }
  } catch (e) {
    return { message: e.sqlMessage, status: 400 };
  }
}

export default login;
