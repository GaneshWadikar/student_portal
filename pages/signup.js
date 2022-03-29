import styles from "/styles/Login.module.scss";

import axios from "axios";
import Button from "@mui/material/Button";
import Head from "next/head";
import Link from "next/link";
import PersonAddAlt from "@mui/icons-material/PersonAddAlt";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SignUP() {
  const [name, setName] = useState("");
  const [urn, setUrn] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [iam, setIam] = useState("student");
  const [showText, setShowText] = useState("URN");
  const [isError, setIsError] = useState(false);
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

  function handlePassword(e) {
    setConfPassword((old) => {
      let { value } = e.target;
      if (password === value) setIsError(false);
      else setIsError(true);
      return value;
    });
  }

  function submit() {
    if (name.trim() === "") {
      return alert("Name cannot be empty!");
    } else if (urn.trim() === "") {
      return alert(`${showText} cannot be empty`);
    } else if (password.trim() === "") {
      return alert("Password cannot be empty!");
    } else if (password !== confPassword) {
      return alert("Passwords not matched!");
    } else {
      let body = {
        name,
        urn,
        password,
        isStudent: iam === "student" ? true : false,
      };
      axios.post("/api/signup", body).then(({ data }) => {
        if (data.status == 201) {
          alert("Account created successfully");
          router.replace("/login");
        } else {
          alert("User with this urn already exists");
        }
      });
    }
  }

  return (
    <>
      <Head>
        <title>Create New Account</title>
      </Head>
      <div className="full-center">
        <div className={`tile ${styles.container}`}>
          <TextField
            label="Name"
            variant="outlined"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={confPassword}
            onChange={handlePassword}
            error={isError}
            helperText={isError ? "passwords not matched!" : ""}
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
          <Button
            variant="contained"
            onClick={submit}
            startIcon={<PersonAddAlt />}
          >
            Sign UP
          </Button>
          <hr />
          <Link href="/login" passHref>
            <p className={styles.link}>Login</p>
          </Link>
        </div>
      </div>
    </>
  );
}
