import axios from "axios";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function BatchDialog({ open, setOpen, data }) {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsRendered, setStudentsRendered] = useState([]);

  useEffect(() => {
    if (data && data.teachers && data.students) {
      let teachersArray = [];
      for (let teacher of data.teachers) {
        teachersArray.push(`${teacher.trn} ${teacher.name}`);
      }
      let studentsArray = [];
      for (let student of data.students) {
        studentsArray.push(`${student.urn} ${student.name}`);
      }

      setTeachers(teachersArray);
      setStudents(studentsArray);
      setStudentsRendered(studentsArray);
    }
  }, [data]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedStudents(typeof value === "string" ? value.split(",") : value);
  };

  function filterOptions(e) {
    let { value } = e.target;
    setStudentsRendered([
      ...selectedStudents,
      ...filteredOptions(students, value, selectedStudents),
    ]);
  }

  async function submit() {
    let data = {};
    data.teacher = selectedTeacher.split(" ")[0];
    let students = [];
    for (let student of selectedStudents) {
      students.push(student.split(" ")[0]);
    }
    data.students = students;
    let { data: newData } = await axios.post("/api/set-batch", data, {
      headers: { Authorization: sessionStorage.getItem("token") },
    });
    if (newData.status === 204) {
      alert("Batch Created Successfully!");
      window.location.reload();
    } else {
      console.log(newData);
      if (newData.status === 400) {
        alert(newData.message);
      } else {
        alert("Failed to update data! Please try again");
      }
    }
    reset();
  }

  function reset() {
    setSelectedStudents([]);
    setSelectedTeacher("");
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
      aria-labelledby="title"
      aria-describedby="description"
    >
      <DialogTitle id="title">Create New Batch</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="description" tabIndex={-1}>
          <FormControl fullWidth>
            <InputLabel id="select-label">Select Teacher</InputLabel>
            <Select
              labelId="select-label"
              value={selectedTeacher}
              label="Select Teacher"
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              {teachers.map((teacher) => (
                <MenuItem value={teacher} key={teacher}>
                  {teacher}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            onChange={filterOptions}
            variant="outlined"
            style={{ width: "100%", marginTop: "20px" }}
            label="Filter URN's"
          />
          <FormControl style={{ width: "100%", margin: "20px 0" }}>
            <InputLabel id="checkbox-label">Select Students</InputLabel>
            <Select
              labelId="checkbox-label"
              multiple
              value={selectedStudents}
              onChange={handleChange}
              input={<OutlinedInput label="Select Students" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {studentsRendered.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={selectedStudents.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={submit}>Add Batch</Button>
      </DialogActions>
    </Dialog>
  );
}

function filteredOptions(names, value, alreadyIn) {
  let opts = [];

  for (let name of names) {
    if (
      name.toLowerCase().includes(value.toLowerCase()) &&
      !alreadyIn.includes(name)
    ) {
      opts.push(name);
    }
  }
  return opts;
}
