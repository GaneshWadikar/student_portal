import encryptor from "./enc.js";
import { con } from "./db.js";

export { getProblems, setProblems };

async function getProblems(token, query) {
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
      .execute("SELECT * FROM problems WHERE urn = ?", [urn]);

    let pretty = {};
    for (let row of rows) {
      let { sem, attendance, p1, p2, p3, p4, p5, p6, p7, p8 } = row;
      pretty[sem] = {
        attendance,
        problems: [p1, p2, p3, p4, p5, p6, p7, p8],
      };
    }

    return pretty;
  } catch (e) {
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}

async function setProblems(token, data) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, urn] = tokenDecr.split("&&");
    if (tokenOf !== "student") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    await con.promise().execute("DELETE FROM problems WHERE urn = ?", [urn]);

    for (let card of data) {
      await con
        .promise()
        .execute(
          "INSERT INTO problems (urn,sem,attendance,p1,p2,p3,p4,p5,p6,p7,p8) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
          [
            urn,
            card.sem,
            card.attendance,
            card.p1,
            card.p2,
            card.p3,
            card.p4,
            card.p5,
            card.p6,
            card.p7,
            card.p8,
          ]
        );
    }

    return { message: "Data Updated Successfully", status: 201 };
  } catch (e) {
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}
