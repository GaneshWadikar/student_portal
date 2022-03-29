import styles from "/styles/Report.module.scss";

import axios from "axios";
import Fab from "@mui/material/Fab";
import Head from "next/head";
import Image from "next/image";
import jsPDF from "jspdf";
import PrintIcon from "@mui/icons-material/Print";

import * as htmlToImage from "html-to-image";

export default function Report({ data }) {
  let { info, performance } = data;
  function printPDF() {
    const page = document.getElementById("page");

    htmlToImage.toPng(page, { quality: 1 }).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = `${info.urn}.jpeg`;
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${info.urn}.pdf`);
    });
  }
  return (
    <>
      <Head>
        <title>Report | {info.name} </title>
      </Head>
      <div style={{ position: "fixed", bottom: "50px", right: "50px" }}>
        <Fab color="primary" aria-label="add" onClick={printPDF}>
          <PrintIcon />
        </Fab>
      </div>
      <div className={styles.page} id="page">
        <div className={styles.image}>
          <Image
            src={info.profile_pic}
            alt="Profile Picture"
            width={200}
            height={200}
          />
        </div>
        <div className={styles.title}>
          <h2>Personal Information</h2>
        </div>

        <div className={styles.container}>
          <div>
            <p>URN:</p>
            <p>{info.urn}</p>
          </div>
          <div>
            <p>Roll Number:</p>
            <p>{info.roll}</p>
          </div>
          <div>
            <p>Name:</p>
            <p>{info.name}</p>
          </div>
          <div>
            <p>Guardian Name:</p>
            <p>{info.guardian_name}</p>
          </div>
          <div>
            <p>Mobile Number:</p>
            <p>{info.mobile_number}</p>
          </div>
          <div>
            <p>Guardian Mobile Number:</p>
            <p>{info.guardian_mobile_number}</p>
          </div>
          <div>
            <p>Guardian Occupation:</p>
            <p>{info.guardian_occupation}</p>
          </div>
          <div>
            <p>Branch:</p>
            <p>{info.branch}</p>
          </div>
          <div>
            <p>Division:</p>
            <p>{info.division}</p>
          </div>
          <div>
            <p>Blood Group :</p>
            <p>{info.blood_group}</p>
          </div>

          <div>
            <p>Date of Birth:</p>
            <p>{info.dob}</p>
          </div>
          <div>
            <p>Mother Tongue:</p>
            <p>{info.mother_tongue}</p>
          </div>
          <div>
            <p>Aadhar Number:</p>
            <p>{info.aadhar_number}</p>
          </div>
          <div>
            <p>Email:</p>
            <p>{info.email}</p>
          </div>
          <div>
            <p>Year of Admission:</p>
            <p>{info.year_of_admission}</p>
          </div>
          <div>
            <p>Seat Allocation:</p>
            <p>{info.seat_allocation == 1 ? "Management" : "CAP Round"}</p>
          </div>
          <div>
            <p>Staying With:</p>
            <p>
              {info.staying_with == 1
                ? "Parents"
                : info.staying_with == 2
                ? "Guardian"
                : "Hostel"}
            </p>
          </div>
          <div>
            <p>Address:</p>
            <p>{info.address}</p>
          </div>
          <div>
            <p>Hobby:</p>
            <p>{info.hobby}</p>
          </div>
          <div>
            <p>Strength:</p>
            <p>{info.strength}</p>
          </div>
          <div>
            <p>Special Achievements:</p>
            <p>{info.special_achievement}</p>
          </div>
        </div>
        <div className={styles.title}>
          <h2>Academic Performance</h2>
        </div>
        <div className={styles.tables}>{renderTables(performance)}</div>
      </div>
    </>
  );
}

function renderTables(performance) {
  const tables = [];
  let flag = true;

  for (let sem in performance) {
    flag = false;
    let subjects = performance[sem];
    tables.push(
      <div className={styles.table}>
        <h3>Semester {sem}</h3>
        <table>
          <thead>
            <tr>
              <th>SUBJECT</th>
              <th>ISE 1</th>
              <th>MSE</th>
              <th>ISE 2</th>
              <th>ESE</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => (
              <tr key={`${sem}-${i}`}>
                <td>{subject.subject_name}</td>
                <td>{subject.ise_1}</td>
                <td>{subject.mse}</td>
                <td>{subject.ise_2}</td>
                <td>{subject.ese}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (flag) {
    return <div>No Academic Performance added</div>;
  }
  return tables;
}

export async function getServerSideProps(context) {
  let token = context.req.cookies.token;
  if (!token) {
    return redirect("Authorization Token Unavailable");
  }
  try {
    let { data } = await axios.get(
      `http://${context.req.headers.host}/api/report?urn=${context.query.urn}`,
      { headers: { Authorization: token } }
    );

    if (data.status === 400) {
      return redirect(data.message);
    }

    return {
      props: {
        data,
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
