import encryptor from "./enc.js";
import { con } from "./db.js";

export { getAcademics, setAcademics };

async function getAcademics(token,query) {
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
    let [sems] = await con
      .promise()
      .execute("SELECT * FROM performance WHERE urn = ? ORDER BY 'sem'", [urn]);
    let result = {};
    for (let row of sems) {
      result[row.sem] = { remark: row.remark, subjects: [] };
      let { urn, ...rest } = row;
    }
    let [subjects] = await con
      .promise()
      .execute("SELECT * FROM performance_subject WHERE urn = ?", [urn]);
    for (let row of subjects) {
      let { urn, sem, ...rest } = row;
      result[sem].subjects.push(rest);
    }
    return result;
  } catch (e) {
    console.error(e);
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}

async function setAcademics(token, data) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, urn] = tokenDecr.split("&&");
    if (tokenOf !== "student") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    await con.promise().execute("DELETE FROM performance WHERE urn=?", [urn]);
    await con
      .promise()
      .execute("DELETE FROM performance_subject WHERE urn=?", [urn]);

    for (let sem in data) {
      await con
        .promise()
        .execute("INSERT INTO performance(urn, sem,remark) VALUES (?,?,?)", [
          urn,
          sem,
          data[sem].remark,
        ]);
    }

    for (let sem in data) {
      for (let subject of data[sem].subjects) {
        await con
          .promise()
          .execute(
            "INSERT INTO performance_subject(urn, sem,subject_name,ise_1,ise_2,mse,ese) VALUES (?,?,?,?,?,?,?)",
            [
              urn,
              sem,
              subject.subject_name,
              subject.ise_1,
              subject.ise_2,
              subject.mse,
              subject.ese,
            ]
          );
      }
    }

    return { message: "Data Updated Successfully", status: 201 };
  } catch (e) {
    console.log(e);
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}
