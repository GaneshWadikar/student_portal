import styles from "/styles/Login.module.scss";

import axios from "axios";
import Button from "@mui/material/Button";
import Head from "next/head";
import Login from "@mui/icons-material/Login";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  function submit() {
    if (username.trim() === "") {
      return alert(`username cannot be empty`);
    } else if (password.trim() === "") {
      return alert("Password cannot be empty");
    } else {
      let body = {
        username,
        password,
      };
      axios.post("/api/admin_login", body).then(({ data }) => {
        if (data.status === 200) {
          sessionStorage.setItem("token", data.token);
          router.push("/admin");
        } else {
          return alert(data.message);
        }
      });
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login</title>
      </Head>
      <div className="full-center">
        <div className={`tile ${styles.container}`}>
          <TextField
            label="UserName"
            variant="outlined"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={submit} startIcon={<Login />}>
            Login
          </Button>
        </div>
      </div>
    </>
  );
}
