import styles from "/styles/Problems.module.scss";

import axios from "axios";
import Button from "@mui/material/Button";
import Card from "/components/suggestion-card";
import Head from "next/head";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import suggestionStyles from "/styles/Suggestion.module.scss";
import Update from "@mui/icons-material/Update";
import { useState } from "react";

export default function Suggestion({ data, requestFromStudent, urn, token }) {
  const [cards, setCards] = useState(data);

  function submit() {
    axios
      .post(
        "/api/suggestions",
        { data: filter(cards), urn },
        {
          headers: { Authorization: token },
        }
      )
      .then(({ data }) => {
        if (data.status === 201) {
          alert("Data Updated Successfully!");
        } else {
          console.log(data);
          alert("Failed to update data! Please try again");
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <>
      <Head>
        <title>Suggestions</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Suggestions</h1>

      <div className={styles.noteBox}>
        <p>Note: Teacher can refer to other teachers for more information.</p>
      </div>

      <div className={`${styles.container} ${suggestionStyles.container}`}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i, index) => (
          <Card
            key={index}
            sem={index}
            cards={cards}
            setCards={setCards}
            requestFromStudent={requestFromStudent}
          />
        ))}
      </div>

      <div className={styles.largeBox}>
        {!requestFromStudent && (
          <Button variant="contained" onClick={submit} startIcon={<Update />}>
            Update
          </Button>
        )}
        {requestFromStudent && (
          <Link href="/student" passHref>
            <Button
              variant="contained"
              color="success"
              startIcon={<KeyboardBackspaceIcon />}
            >
              Back
            </Button>
          </Link>
        )}
      </div>
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
        `http://${context.req.headers.host}/api/suggestions?urn=${context.query.urn}`,
        { headers: { Authorization: token } }
      );
      requestFromStudent = false;
    } else {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/suggestions`,
        { headers: { Authorization: token } }
      );
    }

    if (data.status === 400) {
      return redirect(data.message);
    }

    return {
      props: {
        data: addMissing(data.data),
        urn: data.urn,
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

function addMissing(data) {
  const sems = [1, 2, 3, 4, 5, 6, 7, 8];
  let inData = [];
  for (let item of data) {
    inData.push(parseInt(item.sem));
  }
  for (let sem of sems) {
    if (!inData.includes(sem)) {
      data.push({
        sem,
        suggestion: "",
      });
    }
  }
  return data;
}

function filter(cards) {
  let result = [];
  for (let card of cards) {
    if (card.suggestion !== "") {
      result.push(card);
    }
  }
  return result;
}
