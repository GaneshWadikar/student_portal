import encryptor from "./enc.js";
import { con } from "./db.js";

export { getPersonalInfo, setPersonalInfo };

async function getPersonalInfo(token, query) {
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
      .execute("SELECT * FROM information WHERE urn = ?", [urn]);
    if (rows.length === 0) {
      return {
        message: "Invalid or Expired Token",
        status: 400,
      };
    }

    let row = rows[0];
    console.log("In Backend",row)
    return row;
  } catch (e) {
    console.log(e);
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}

async function setPersonalInfo(token, data) {
  try {
    let tokenDecr = await encryptor.decrypt(token);
    let [tokenOf, urn] = tokenDecr.split("&&");
    if (tokenOf !== "student") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    let validatedData = validate(data);
    let [query, values] = makeQuery(validatedData);

    query = `
      UPDATE information SET
      ${query}
      WHERE urn = '${urn}'`;
    await con.promise().execute(query, values);

    return { message: "Data Updated Successfully", status: 201 };
  } catch (e) {
    return {
      message: e.sqlMessage,
      status: 500,
    };
  }
}

function makeQuery(data) {
  delete data.urn;
  let string = "";
  let values = [];
  for (let column in data) {
    string += ` ${column}=?,`;
    values.push(data[column]);
  }
  return [string.slice(0, string.length - 1), values];
}

function validate(data) {
  const validated = {};
  for (let column in data) {
    if (rowsInDB.includes(column)) {
      validated[column] = data[column];
    }
  }
  return validated;
}

const rowsInDB = [
  "urn",
  "name",
  "division",
  "roll",
  "branch",
  "guardian_name",
  "guardian_occupation",
  "seat_allocation",
  "dob",
  "blood_group",
  "mother_tongue",
  "year_of_admission",
  "aadhar_number",
  "staying_with",
  "address",
  "mobile_number",
  "guardian_mobile_number",
  "email",
  "hobby",
  "strength",
  "special_achievement",
  "profile_pic",
];
