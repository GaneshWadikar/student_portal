import encryptor from "./enc.js";
import { con } from "./db.js";

async function register(name, urn, password, isStudent) {
  let hashedPass = await encryptor.hash(password);
  try {
    if (isStudent) {
      await con
        .promise()
        .execute("INSERT INTO student (urn,password) VALUES (?,?)", [
          urn,
          hashedPass,
        ]);
      await con
        .promise()
        .execute(
          "INSERT INTO information (urn,name,profile_pic) VALUES (?,?,'/profiles/default.png')",
          [urn, name]
        );
    } else {
      await con
        .promise()
        .execute("INSERT INTO teacher (trn,password,name) VALUES (?,?,?)", [
          urn,
          hashedPass,
          name,
        ]);
    }
    return { message: "Data Inserted Successfully", status: 201 };
  } catch (e) {
    return { message: e.sqlMessage, status: 400 };
  }
}

export default register;
