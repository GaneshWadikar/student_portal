import encryptor from "./enc.js";
import { con } from "./db.js";

export { getEducation, setEducation };

async function getEducation(token, query) {
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
      .execute("SELECT * FROM earlier_education WHERE urn = ?", [urn]);
    return {
      message: "success",
      data: rows,
      urn: urn,
    };
  } catch (e) {
    console.log(e);
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}

async function setEducation(token, data) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, urn] = tokenDecr.split("&&");
    if (tokenOf !== "student") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    await con
      .promise()
      .execute("DELETE FROM earlier_education WHERE urn=?", [urn]);

    for (let card of data) {
      await con
        .promise()
        .execute(
          "INSERT INTO earlier_education(urn, board,year, mark, medium, place_of_study) VALUES (?,?,?,?,?,?)",
          [
            urn,
            card.board,
            card.year,
            card.mark,
            card.medium,
            card.place_of_study,
          ]
        );
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
