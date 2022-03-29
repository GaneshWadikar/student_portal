import styles from "/styles/Academics.module.scss";

import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Delete from "@mui/icons-material/Delete";
import Subject from "./academic_subject";
import TextField from "@mui/material/TextField";

export default function Education({
  semester,
  data,
  setCards,
  setSems,
  setSem,
  requestFromStudent,
}) {
  const emptySubject = {
    subject_name: "",
    ise_1: "",
    ise_2: "",
    mse: "",
    ese: "",
  };

  function addSubject() {
    setCards((old) => {
      old[semester].subjects.push(emptySubject);
      return { ...old };
    });
  }

  function deleteSem() {
    setCards((old) => {
      delete old[semester];
      return { ...old };
    });
    setSems((old) => {
      old = [...old, semester];
      old.sort();
      setSem(old[0]);
      return [...old];
    });
  }

  function handleChange(e) {
    if (!requestFromStudent) return;
    setCards((old) => {
      old[semester].remark = e.target.value;
      return { ...old };
    });
  }

  return (
    <div className="tile padding-20 flex-column">
      <h3 className="text-center">Semester {semester}</h3>
      {data.subjects.map((subject, i) => (
        <Subject
          data={subject}
          key={i}
          setCards={setCards}
          semester={semester}
          index={i}
          requestFromStudent={requestFromStudent}
        />
      ))}
      {data.subjects.length > 0 && (
        <div className={styles.subject_box}>
          <TextField
            label="Semester Remark"
            value={data.remark}
            multiline
            minRows={3}
            onChange={handleChange}
          />
        </div>
      )}
      {requestFromStudent && (
        <div style={buttons}>
          <Button
            variant="contained"
            color="success"
            className="grid-box-span"
            startIcon={<Add />}
            onClick={addSubject}
          >
            Add Subject
          </Button>
          <Button
            variant="contained"
            color="error"
            className="grid-box-span"
            onClick={deleteSem}
            startIcon={<Delete />}
          >
            delete semester
          </Button>
        </div>
      )}
    </div>
  );
}

const buttons = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  justifyContent: "center",
};
