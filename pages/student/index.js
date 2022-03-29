import styles from "/styles/Student.module.scss";

import axios from "axios";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Badge from "@mui/icons-material/Badge";
import Button from "@mui/material/Button";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Logout from "@mui/icons-material/Logout";
import ProfileModal from "/components/profile-modal";
import QuestionMark from "@mui/icons-material/QuestionMark";
import School from "@mui/icons-material/School";
import SentimentVeryDissatisfied from "@mui/icons-material/SentimentVeryDissatisfied";
import Timeline from "@mui/icons-material/Timeline";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Student({ data, requestFromStudent }) {
  let { urn, name, profile_pic } = data;
  const [dialogOpen, setDialogOpen] = useState(false);

  function openDialog() {
    if (requestFromStudent) setDialogOpen(true);
  }

  const router = useRouter();

  function logout() {
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <ProfileModal
        dialogOpen={dialogOpen}
        urn={urn}
        setDialogOpen={setDialogOpen}
        profile_pic={profile_pic}
      />
      <div className={styles.page}>
        <div
          className={styles.img}
          onClick={openDialog}
          style={{ cursor: requestFromStudent ? "pointer" : "" }}
        >
          <Image
            src={profile_pic}
            layout="fill"
            objectFit="cover"
            alt="Profile Photo"
            priority
          />
        </div>
        <h1 className={styles.center}>{name}</h1>
        <h3 className={styles.center}>{urn}</h3>
        <div className={styles.container}>
          <Link
            href={{
              pathname: "/student/personal_info",
              query: requestFromStudent ? {} : { urn },
            }}
            passHref
          >
            <Button
              className={styles.button}
              variant="contained"
              startIcon={<Badge />}
            >
              Personal Information
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/student/earlier_education",
              query: requestFromStudent ? {} : { urn },
            }}
            passHref
          >
            <Button
              className={styles.button}
              variant="contained"
              startIcon={<School />}
            >
              Earlier Education
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/student/suggestions",
              query: requestFromStudent ? {} : { urn },
            }}
            passHref
          >
            <Button
              className={styles.button}
              variant="contained"
              startIcon={<QuestionMark />}
            >
              Suggestions
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/student/academic_performance",
              query: requestFromStudent ? {} : { urn },
            }}
            passHref
          >
            <Button
              className={styles.button}
              variant="contained"
              startIcon={<Timeline />}
            >
              Academic Performance
            </Button>
          </Link>
          <Link
            href={{
              pathname: "/student/problem_faced",
              query: requestFromStudent ? {} : { urn },
            }}
            passHref
          >
            <Button
              className={styles.button}
              variant="contained"
              startIcon={<SentimentVeryDissatisfied />}
            >
              Problems Faced
            </Button>
          </Link>
          {requestFromStudent ? (
            <Button
              className={styles.button}
              variant="contained"
              startIcon={<Logout />}
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <Link
              href={{
                pathname: "/teacher/report",
                query: { urn },
              }}
              passHref
            >
              <Button
                className={styles.button}
                variant="contained"
                startIcon={<AssessmentIcon />}
              >
                Report
              </Button>
            </Link>
          )}
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
    let requestFromStudent = true;
    if (context.query.urn) {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/basic-info?urn=${context.query.urn}`,
        { headers: { Authorization: token } }
      );
      requestFromStudent = false;
    } else {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/basic-info`,
        { headers: { Authorization: token } }
      );
    }

    if (data.status === 400) {
      return redirect(data.message);
    }

    return {
      props: {
        data,
        requestFromStudent,
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
