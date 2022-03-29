import styles from "/styles/Academics.module.scss";

import axios from "axios";
import AcademicBlock from "../../components/academic";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Head from "next/head";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Update from "@mui/icons-material/Update";
import { useState } from "react";

export default function AcademicPerformance({
  academics,
  token,
  requestFromStudent,
}) {
  const [cards, setCards] = useState(academics);

  let [sems, setSems] = useState(remainSems(Object.keys(academics)));
  let [sem, setSem] = useState(sems.length > 0 ? sems[0] : "");

  function submit() {
    axios
      .post("/api/academics", cards, {
        headers: { Authorization: token },
      })
      .then(({ data }) => {
        if (data.status === 201) {
          alert("Data Updated Successfully!");
        } else {
          alert("Failed to update data! Please try again");
        }
      })
      .catch((e) => console.log(e));
  }

  function addSemester() {
    setCards((old) => {
      old[sem] = { subjects: [], remark: "" };
      return { ...old };
    });
    setSems((old) => {
      let newSet = old.filter((item) => item != sem);
      setSem(newSet.length > 0 ? newSet[0] : "");
      return newSet;
    });
  }

  function populateCards() {
    let result = [];
    for (let item in cards) {
      result.push(
        <AcademicBlock
          semester={item}
          data={cards[item]}
          key={item}
          setCards={setCards}
          setSems={setSems}
          setSem={setSem}
          requestFromStudent={requestFromStudent}
        />
      );
    }
    return result;
  }

  return (
    <>
      <Head>
        <title>Academic Performance</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Academic Performance</h1>
      {requestFromStudent && sems.length > 0 && (
        <div className={styles.addBox}>
          <FormControl>
            <InputLabel id="select-sem">Semester</InputLabel>
            <Select
              labelId="select-sem"
              value={sem}
              label="Semester"
              size="small"
              onChange={(e) => setSem(e.target.value)}
            >
              {sems.map((sem) => (
                <MenuItem value={sem} key={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Add />} onClick={addSemester}>
            Add
          </Button>
        </div>
      )}
      <div className={styles.container}>{populateCards()}</div>
      {requestFromStudent && (
        <div className={styles.box}>
          <Button variant="contained" onClick={submit} startIcon={<Update />}>
            Update
          </Button>
          <Link href="/student" passHref>
            <Button
              variant="contained"
              color="success"
              startIcon={<KeyboardBackspaceIcon />}
            >
              Back
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

function remainSems(sems) {
  let remain = [];
  for (let i = 1; i <= 8; i++) {
    !sems.includes(i.toString()) && remain.push(i);
  }
  return remain;
}

export async function getServerSideProps(context) {
  let token = context.req.cookies.token;
  if (!token) {
    return redirect("Please login to continue");
  }
  try {
    let requestFromStudent = true;
    if (context.query.urn) {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/academics?urn=${context.query.urn}`,
        { headers: { Authorization: token } }
      );
      requestFromStudent = false;
    } else {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/academics`,
        { headers: { Authorization: token } }
      );
    }

    if (data.status === 400) {
      return redirect(data.message);
    }

    return {
      props: {
        academics: data,
        requestFromStudent,
        token,
      },
    };
  } catch (e) {
    console.log(e);
    return redirect("Invalid or Expired Authorization Token");
  }
}

function redirect(reason) {
  return {
    redirect: {
      destination: `/login?reason=${reason}`,
      permanent: false,
    },
  };
}
