import encryptor from "./enc.js";
import { con } from "./db.js";

export { getSuggestions, setSuggestions };

async function getSuggestions(token, query) {
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
      .execute("SELECT * FROM suggestion WHERE urn = ?", [urn]);

    return { data: rows, urn };
  } catch (e) {
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}

async function setSuggestions(token, data) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, ] = tokenDecr.split("&&");

    if (tokenOf !== "teacher") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }


    await con.promise().execute("DELETE FROM suggestion WHERE urn = ?", [data.urn]);

    for (let card of data.data) {
      await con
        .promise()
        .execute("INSERT INTO suggestion (urn,sem,suggestion) VALUES(?,?,?)", [
          data.urn,
          card.sem,
          card.suggestion,
        ]);
    }
    return { message: "Data Updated Successfully", status: 201 };
  } catch (e) {
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}
