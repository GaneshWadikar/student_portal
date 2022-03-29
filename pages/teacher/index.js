import styles from "/styles/Teacher.module.scss";

import axios from "axios";
import Button from "@mui/material/Button";
import Head from "next/head";
import Logout from "@mui/icons-material/Logout";
import StudentTab from "/components/StudentTab";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Teacher({ data }) {
  let { teacher, students } = data;
  const [cards, setCards] = useState(students);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // console.log(data);

  function logout() {
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  }

  function handleChange(e) {
    let { value } = e.target;
    setQuery(value);
    let newSet = [];
    if (Number(value)) {
      for (let student of data) {
        if (student.urn.toString().includes(value)) {
          newSet.push(student);
        }
      }
    } else {
      for (let student of data) {
        if (student.name.toLowerCase().includes(value.toLowerCase())) {
          newSet.push(student);
        }
      }
    }
    setCards(newSet);
  }

  return (
    <>
      <Head>
        <title>{teacher.name}</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.topBar}>
          <TextField
            variant="outlined"
            label="Search"
            value={query}
            onChange={handleChange}
          />
          <Button
            className={styles.button}
            variant="contained"
            startIcon={<Logout />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
        <div className={styles.container}>
          {cards.map((item) => (
            <StudentTab key={item.urn} data={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let token = context.req.cookies.token;
  if (!token) {
    return redirect("Authorization Token Unavailable");
  }
  try {
    let { data } = await axios.get(
      `http://${context.req.headers.host}/api/students`,
      { headers: { Authorization: token } }
    );

    if (data.status === 400) {
      return redirect(data.message);
    }
    // console.log(data)

    return {
      props: {
        data,
      },
    };
  } catch (e) {
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
