import axios from "axios";
import Button from "@mui/material/Button";
import Head from "next/head";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Update from "@mui/icons-material/Update";
import { useState } from "react";

export default function Info({ info, token, requestFromStudent }) {
  const [data, setData] = useState(info);

  function handleChange(e) {
    if (!requestFromStudent) return;
    let { name, value } = e.target;
    setData((old) => {
      return { ...old, [name]: value };
    });
  }

  function submit() {
    axios
      .post("/api/personal-info", data, { headers: { Authorization: token } })
      .then(({ data }) => {
        if (data.status === 201) {
          alert("Data Updated Successfully!");
        } else {
          alert("Failed to update data! Please try again");
        }
      });
  }

  return (
    <>
      <Head>
        <title>Personal Information</title>
      </Head>
      <h1 style={{ textAlign: "center" }}>Personal Information</h1>
      <div className="grid-box">
        {textualFields.map((field) => {
          return (
            <TextField
              label={field.label}
              variant="outlined"
              type={field.type}
              name={field.name}
              value={data[field.name]}
              onChange={handleChange}
              multiline={field.type === "textarea" ? true : false}
              minRows={field.type === "textarea" ? 3 : 1}
              key={field.name}
              InputProps={{
                readOnly: field.name === "urn" ? true : false,
              }}
            />
          );
        })}
        <FormControl component="fieldset">
          <FormLabel component="legend">Staying With/On</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="staying_with"
            value={data.staying_with}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="1" control={<Radio />} label="Parents" />
            <FormControlLabel value="2" control={<Radio />} label="Guardian" />
            <FormControlLabel value="3" control={<Radio />} label="Hostel" />
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">Admission From</FormLabel>
          <RadioGroup
            aria-label="seat_allocation"
            name="seat_allocation"
            value={data.seat_allocation}
            onChange={handleChange}
            row
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="Management Quota"
            />
            <FormControlLabel value="2" control={<Radio />} label="CAP Round" />
          </RadioGroup>
        </FormControl>
        {requestFromStudent && (
          <>
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
          </>
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
        `http://${context.req.headers.host}/api/personal-info?urn=${context.query.urn}`,
        { headers: { Authorization: token } }
      );
      requestFromStudent = false;
    } else {
      var { data } = await axios.get(
        `http://${context.req.headers.host}/api/personal-info`,
        { headers: { Authorization: token } }
      );
    }

    if (data.status === 400) {
      return redirect(data.message);
    }

    for (let column in data) {
      if (!data[column]) data[column] = "";
    }
    return {
      props: {
        info: data,
        requestFromStudent,
        token,
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

const textualFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
  },
  {
    name: "division",
    label: "Division",
    type: "text",
  },
  {
    name: "roll",
    label: "Roll Number",
    type: "number",
  },
  {
    name: "branch",
    label: "Branch",
    type: "text",
  },
  {
    name: "guardian_name",
    label: "Guardian Name",
    type: "text",
  },
  {
    name: "guardian_occupation",
    label: "Guardian Occupation",
    type: "text",
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
  },
  {
    name: "blood_group",
    label: "Blood Group",
    type: "text",
  },
  {
    name: "mother_tongue",
    label: "Mother Tongue",
    type: "text",
  },
  {
    name: "year_of_admission",
    label: "Year of Admission",
    type: "number",
  },
  {
    name: "aadhar_number",
    label: "Aadhar Number",
    type: "number",
  },
  {
    name: "mobile_number",
    label: "Mobile Number",
    type: "number",
  },
  {
    name: "guardian_mobile_number",
    label: "Guardian Number",
    type: "number",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
  },
  {
    name: "hobby",
    label: "Hobby",
    type: "textarea",
  },
  {
    name: "strength",
    label: "Strength",
    type: "textarea",
  },
  {
    name: "special_achievement",
    label: "Special Achievements",
    type: "textarea",
  },
];
