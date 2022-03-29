import styles from "/styles/Problems.module.scss";

import axios from "axios";
import Button from "@mui/material/Button";
import Head from "next/head";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import ProblemsCard from "../../components/problems_card";
import Update from "@mui/icons-material/Update";
import { useState } from "react";

export default function Education({ details, token, requestFromStudent }) {
  const [sem, setSem] = useState(1);
  const [cards, setCards] = useState(details);

  function submit() {
    axios
      .post("/api/problems", filter(cards), {
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

  return (
    <>
      <Head>
        <title>Problem Faced</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Problem Faced</h1>
      <div className={styles.btnBox}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Button variant="contained" onClick={() => setSem(i)} key={i}>
            Semester {i}
          </Button>
        ))}
      </div>
      <div className={styles.container}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProblemsCard
            key={i}
            index={i}
            sem={sem}
            cards={cards}
            setCards={setCards}
            requestFromStudent={requestFromStudent}
          />
        ))}
      </div>

      {requestFromStudent && (
        <div className={styles.largeBox}>
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

export async function getServerSideProps(context) {
  let token = context.req.cookies.token;
  if (!token) {
    return redirect("Please login to continue");
  }
  try {
    let requestFromStudent = true;
    if (context.query.urn) {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/problems?urn=${context.query.urn}`,
        { headers: { Authorization: token } }
      );
      requestFromStudent = false;
    } else {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/problems`,
        { headers: { Authorization: token } }
      );
    }

    if (data.status === 400) {
      return redirect(data.message);
    }

    return {
      props: {
        details: addMissing(data),
        requestFromStudent,
        token,
      },
    };
  } catch (e) {
    console.log(e);
    return redirect("Invalid or Expired Authorization Token");
  }
}

function addMissing(data) {
  for (let sem of [1, 2, 3, 4, 5, 6, 7, 8]) {
    if (!data[sem]) {
      data[sem] = {
        attendance: "",
        problems: [1, 1, 1, 1, 1, 1, 1, 1],
      };
    }
  }
  return data;
}

function redirect(reason) {
  return {
    redirect: {
      destination: `/login?reason=${reason}`,
      permanent: false,
    },
  };
}

function filter(cards) {
  let result = [];
  for (let sem in cards) {
    if (is_not_empty(cards[sem])) {
      result.push({
        attendance: cards[sem].attendance,
        sem,
        p1: cards[sem].problems[0],
        p2: cards[sem].problems[1],
        p3: cards[sem].problems[2],
        p4: cards[sem].problems[3],
        p5: cards[sem].problems[4],
        p6: cards[sem].problems[5],
        p7: cards[sem].problems[6],
        p8: cards[sem].problems[7],
      });
    }
  }
  return result;
}

function is_not_empty(card) {
  if (card.attendance != "") return true;
  for (let problem of card.problems) {
    if (problem != 1) return true;
  }
  return false;
}
