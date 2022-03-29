import encryptor from "./enc.js";
import { con } from "./db.js";

export default async function report(token, urn) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, trn] = tokenDecr.split("&&");
    if (tokenOf !== "teacher") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    let [info] = await con.promise().execute(
      ` SELECT * 
        FROM information 
        WHERE urn = ?`,
      [urn]
    );
    if (info.length == 0) {
      return {
        message: "Student Not Found",
        status: 404,
      };
    }
    info = info[0];

    let [performance] = await con.promise().execute(
      ` SELECT * 
        FROM performance_subject 
        WHERE urn = ?`,
      [urn]
    );
    let temp = {};
    for (let subject of performance) {
      let { sem, ...rest } = subject;
      if (temp[sem]) {
        temp[sem].push(rest);
      } else {
        temp[sem] = [rest];
      }
    }
    performance = temp;

    return { info,performance };
  } catch (e) {
    console.log(e)
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}
