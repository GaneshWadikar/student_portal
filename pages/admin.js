import styles from "/styles/Admin.module.scss";

import axios from "axios";
import Add from "@mui/icons-material/Add";
import Batch from "/components/batch";
import BatchUpdate from "/components/batch-update";
import Button from "@mui/material/Button";
import Head from "next/head";
import Logout from "@mui/icons-material/Logout";
import ManageBatch from "/components/batch-dialog";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Admin() {
  const router = useRouter();
  const [batchCreateOpen, setBatchCreateOpen] = useState(false);
  const [batchUpdateOpen, setBatchUpdateOpen] = useState(false);
  const [batchUpdateTeacher, setBatchUpdateTeacher] = useState("");
  const [data, setData] = useState({
    teachers: [],
    students: [],
    connection: [],
  });
  const [batches, setBatches] = useState({});

  function logout() {
    sessionStorage.clear();
    router.push("/admin_login");
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/admin_login");
    }
    axios
      .get("/api/all_data", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then(({ data }) => {
        setData(data);
        let temp = {};
        for (let batch of data.connection) {
          let name;
          for (let student of data.students) {
            if (student.urn == batch.urn) {
              name = student.name;
            }
          }
          if (temp[batch.trn]) {
            temp[batch.trn].students.push({ urn: batch.urn, name });
          } else {
            temp[batch.trn] = {
              students: [{ urn: batch.urn, name }],
            };
          }
        }
        setBatches(temp);
      })
      .catch((error) => console.log(error));
  }, [router]);

  function renderBatches() {
    let batchesArray = [];
    for (let teacher in batches) {
      batchesArray.push(
        <Batch
          teacher={teacher}
          key={teacher}
          students={batches[teacher].students}
          teachers={data.teachers}
          handleClick={handleBatchClick}
        />
      );
    }
    return batchesArray;
  }

  function handleBatchClick(teacher) {
    setBatchUpdateOpen(true);
    setBatchUpdateTeacher(teacher);
  }

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div className={styles.page}>
        <BatchUpdate
          open={batchUpdateOpen}
          setOpen={setBatchUpdateOpen}
          teachers={data.teachers}
          teacher={batchUpdateTeacher}
          batches={batches}
        />
        <ManageBatch
          open={batchCreateOpen}
          setOpen={setBatchCreateOpen}
          data={data}
        />
        <div className={styles.topRow}>
          <Button variant="contained" startIcon={<Logout />} onClick={logout}>
            Logout
          </Button>
        </div>
        <div className={styles.topRow}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setBatchCreateOpen(true)}
          >
            Add Batch
          </Button>
        </div>
        <div className={styles.container}>
          <h2>Allocated Batches</h2>
          <div className={styles.subContainer}>{renderBatches()}</div>
        </div>
      </div>
    </>
  );
}
