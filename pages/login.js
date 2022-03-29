import styles from "/styles/Login.module.scss";

import axios from "axios";
import Button from "@mui/material/Button";
import Head from "next/head";
import Link from "next/link";
import Login from "@mui/icons-material/Login";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const [urn, setUrn] = useState("");
  const [password, setPassword] = useState("");
  const [iam, setIam] = useState("student");
  const [showText, setShowText] = useState("URN");

  const router = useRouter();

  function handleChange(e) {
    let { value } = e.target;
    if (value == "student") {
      setShowText("URN");
      setIam("student");
    } else {
      setShowText("TRN");
      setIam("teacher");
    }
  }

  function submit() {
    if (urn.trim() === "") {
      return alert(`${showText} cannot be empty`);
    } else if (password.trim() === "") {
      return alert("Password cannot be empty");
    } else {
      let body = {
        urn,
        password,
        isStudent: iam === "student" ? true : false,
      };
      axios.post("/api/login", body).then(({ data }) => {
        if (data.status === 200) {
          let date = new Date();
          date.setDate(date.getDate() + 2);
          document.cookie = `token=${
            data.token
          };expires=${date.toGMTString()};path=/`;
          if (iam === "student") {
            router.push("/student");
          } else {
            router.push("/teacher");
          }
        } else {
          return alert(data.message);
        }
      });
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="full-center">
        <div className={`tile ${styles.container}`}>
          <TextField
            label={showText}
            variant="outlined"
            type="number"
            value={urn}
            onChange={(e) => setUrn(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ToggleButtonGroup
            color="primary"
            value={iam}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="student" variant="contained">
              Student
            </ToggleButton>
            <ToggleButton value="teacher" variant="contained">
              Teacher
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" onClick={submit} startIcon={<Login />}>
            Login
          </Button>
          <hr />
          <Link href="/signup" passHref>
            <p className={styles.link}>Create new Account</p>
          </Link>
        </div>
      </div>
    </>
  );
}
