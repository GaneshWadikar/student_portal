import styles from "/styles/Academics.module.scss";

import Button from "@mui/material/Button";
import Close from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

export default function Subject({
  data,
  setCards,
  semester,
  index,
  requestFromStudent,
}) {
  function removeSubject() {
    setCards((old) => {
      let subjects = old[semester].subjects;
      subjects.splice(index, 1);
      old[semester].subjects = subjects;
      return { ...old };
    });
  }

  function handleChange(e) {
    if (!requestFromStudent) return;
    const { name, value } = e.target;
    setCards((old) => {
      old[semester].subjects[index] = {
        ...old[semester].subjects[index],
        [name]: value,
      };
      return { ...old };
    });
  }

  return (
    <div className={styles.subject_box}>
      <TextField
        label="Subject Name"
        size="small"
        name="subject_name"
        onChange={handleChange}
        value={data.subject_name}
      />
      <TextField
        label="ISE 1 Marks"
        type="number"
        name="ise_1"
        size="small"
        onChange={handleChange}
        value={data.ise_1}
      />
      <TextField
        label="MSE Marks"
        type="number"
        name="mse"
        size="small"
        onChange={handleChange}
        value={data.mse}
      />
      <TextField
        label="ISE 2 Marks"
        type="number"
        size="small"
        name="ise_2"
        onChange={handleChange}
        value={data.ise_2}
      />
      <TextField
        label="ESE Marks"
        type="number"
        size="small"
        name="ese"
        onChange={handleChange}
        value={data.ese}
      />
      {requestFromStudent && (
        <Button
          variant="contained"
          color="error"
          className="grid-box-span"
          style={{ height: "40px" }}
          startIcon={<Close />}
          onClick={removeSubject}
        >
          Remove
        </Button>
      )}
    </div>
  );
}
