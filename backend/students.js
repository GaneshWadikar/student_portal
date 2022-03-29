import encryptor from "./enc.js";
import { con } from "./db.js";

export default async function getStudents(token) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, urn] = tokenDecr.split("&&");
    if (tokenOf !== "teacher") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    // let [urns] = await con
    //   .promise()
    //   .execute("SELECT urn FROM mentor_batch WHERE trn=?", [urn]);

    // urns = urns.map((urn) => urn.urn.toString());

    // console.log(con.format("SELECT urn,roll,name,profile_pic FROM information WHERE urn in (?)", [urns]))

    let [teacher] = await con
      .promise()
      .execute("SELECT * FROM teacher WHERE trn=?", [urn]);
    teacher = teacher[0];

    let [rows] = await con.promise().execute(
      `SELECT urn,roll,name,profile_pic 
        FROM information 
        WHERE urn in (
          SELECT urn FROM mentor_batch WHERE trn=?
        )`,
      [urn]
    );
    return { teacher, students: rows };
  } catch (e) {
    // console.log(e);
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}
