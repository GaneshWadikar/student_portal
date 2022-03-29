import encryptor from "./enc.js";
import { con } from "./db.js";

async function setBatch(token,data) {
  try {
    let token_text = await encryptor.decrypt(token);
    if (token_text !== "valid admin account") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }

    let [rows] = await con.promise().execute('SELECT * FROM mentor_batch WHERE trn=?',[data.teacher]);

    if(rows.length > 0) {
      return {
        message: "Batch for these teacher is already present.",
        status: 400,
      };
    }

    for(let student of data.students) {
      await con.promise().execute('INSERT INTO mentor_batch(trn,urn) VALUES (?,?)',[data.teacher,student]);
    }

    return {status: 204, message: "Data Inserted successfully"}
  } catch (e) {
    console.log(e);
    return { message: e.sqlMessage, status: 500 };
  }
}

async function deleteBatch(token,teacher) {
  let token_text = await encryptor.decrypt(token);
    if (token_text !== "valid admin account") {
      return {
        message: "Invalid Token",
        status: 400,
      };
    }
    await con.promise().execute('DELETE FROM `mentor_batch` WHERE trn=?',[teacher]);
    
    return {status: 200, message: "Data Deleted successfully"}
}

export {setBatch,deleteBatch} ;