import styles from "/styles/Education.module.scss";

import axios from "axios";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Head from "next/head";
import EducationBlock from "../../components/education";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import Update from "@mui/icons-material/Update";
import { useState } from "react";

export default function Education({ details, urn, token, requestFromStudent }) {
  const [cards, setCards] = useState(details);

  function submit() {
    axios
      .post("/api/earlier-education", cards, {
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

  function addCard() {
    setCards((old) => {
      return [
        ...old,
        {
          board: "",
          mark: "",
          medium: "",
          place_of_study: "",
          urn,
          year: "",
        },
      ];
    });
  }

  function deleteCard(index) {
    setCards((old) => {
      delete old[index];
      return old.filter((item) => item);
    });
  }

  return (
    <>
      <Head>
        <title>Earlier Education</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Earlier Education</h1>
      {requestFromStudent && (
        <Button
          variant="contained"
          className={styles.addBtn}
          onClick={addCard}
          startIcon={<Add />}
        >
          Add Another
        </Button>
      )}
      <div className={styles.container}>
        {cards.map((edu, i) => (
          <EducationBlock
            key={i}
            data={edu}
            onClick={() => deleteCard(i)}
            setCards={setCards}
            index={i}
            requestFromStudent={requestFromStudent}
          />
        ))}
      </div>
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

export async function getServerSideProps(context) {
  let token = context.req.cookies.token;
  if (!token) {
    return redirect("Please login to continue");
  }
  try {
    let requestFromStudent = true;
    if (context.query.urn) {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/earlier-education?urn=${context.query.urn}`,
        { headers: { Authorization: token } }
      );
      requestFromStudent = false;
    } else {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/earlier-education`,
        { headers: { Authorization: token } }
      );
    }

    if (data.status === 400) {
      return redirect(data.message);
    }

    return {
      props: {
        details: data.data,
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
