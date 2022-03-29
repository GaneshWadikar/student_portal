import styles from "/styles/Suggestion.module.scss";

import TextField from "@mui/material/TextField";

export default function SuggestionCard({
  sem,
  cards,
  setCards,
  requestFromStudent,
}) {
  function handleChange(e) {
    setCards((old) => {
      old[sem].suggestion = e.target.value;
      return [...old];
    });
  }

  return (
    <div className={`tile ${styles.tab}`}>
      <TextField
        label={`Semester ${sem + 1}`}
        multiline
        rows={4}
        style={{ width: "100%" }}
        value={cards[sem].suggestion}
        onChange={handleChange}
        InputProps={{
          readOnly: requestFromStudent,
        }}
      />
    </div>
  );
}
