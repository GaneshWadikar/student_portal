import styles from "/styles/Problems.module.scss";

import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";

export default function ProblemsCard({
  index,
  sem,
  cards,
  setCards,
  requestFromStudent,
}) {
  let style = { display: sem == index ? "flex" : "none" };

  function handleRateChange(i, newValue) {
    if (!requestFromStudent) return;
    setCards((old) => {
      old[index].problems[i] = newValue;
      return { ...old };
    });
  }

  function handleAttendanceChange(e) {
    if (!requestFromStudent) return;
    setCards((old) => {
      old[index].attendance = e.target.value;
      return { ...old };
    });
  }

  return (
    <div className="tile flex-column" style={style}>
      <h2>Semester {index}</h2>
      <div className={styles.problemsContainer}>
        {problems.map((problem, i) => {
          return (
            <div className={styles.problem} key={i}>
              <p>{problem} </p>
              <Rating
                value={cards[index].problems[i]}
                onChange={(event, newValue) => handleRateChange(i, newValue)}
                icon={<CircleIcon fontSize="inherit" />}
                emptyIcon={<CircleOutlinedIcon fontSize="inherit" />}
                max={3}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          width: "100%",
          marginTop: "10px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <TextField
          id="outlined-textarea"
          label="Other Problems"
          minRows={4}
          multiline
          style={{ width: "100%", maxWidth: "300px" }}
        />
        <TextField
          label="Attendance (in Percentage)"
          value={cards[index].attendance}
          onChange={handleAttendanceChange}
          style={{ width: "100%", maxWidth: "300px" }}
        />
      </div>
      <div style={{ width: "100%", marginTop: "10px" }}></div>
    </div>
  );
}

const problems = [
  "Does not understand the subject",
  "Exam Fear",
  "Communication Skills",
  "Feels Depressed/ Anxious/ Angry",
  "Addiction",
  "Confidence Level",
  "Procastination ( Delay in Studies )",
  "Stage Daring",
];
