import Button from "@mui/material/Button";
import Delete from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";

export default function Education({
  data,
  onClick,
  setCards,
  index,
  requestFromStudent,
}) {
  function handleChange(name, value) {
    if(!requestFromStudent) return;
    setCards((old) => {
      old[index] = {
        ...old[index],
        [name]: value,
      };
      return [...old];
    });
  }
  return (
    <div className="grid-box tile padding-20">
      <TextField
        label="Percentage or Grade"
        value={data.mark}
        onChange={(e) => handleChange("mark", e.target.value)}
      />
      <TextField
        label="Passout Year"
        type="number"
        value={data.year}
        onChange={(e) => handleChange("year", e.target.value)}
      />
      <TextField
        label="Board"
        value={data.board}
        onChange={(e) => handleChange("board", e.target.value)}
      />
      <TextField
        label="Medium of Study"
        value={data.medium}
        onChange={(e) => handleChange("medium", e.target.value)}
      />
      <TextField
        label="Place of Study"
        value={data.place_of_study}
        onChange={(e) => handleChange("place_of_study", e.target.value)}
        multiline={true}
        minRows={3}
      />

      {requestFromStudent && (
        <Button
          variant="contained"
          color="error"
          className="grid-box-span"
          onClick={onClick}
          startIcon={<Delete />}
        >
          delete
        </Button>
      )}
    </div>
  );
}
