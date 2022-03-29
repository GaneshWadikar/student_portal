import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { DataGrid } from "@mui/x-data-grid";

export default function BatchUpdate({
  open,
  setOpen,
  teachers,
  teacher,
  batches,
}) {
  let teacherName;
  if (teachers)
    for (let teacherObj of teachers) {
      if (teacherObj.trn == teacher) {
        teacherName = teacherObj.name;
        break;
      }
    }

  const rows = batches[teacher]
    ? batches[teacher].students.map((student, i) => ({ id: i, ...student }))
    : [];

  // const height = rows.length * 110 < 600 ? rows.length * 110 : 500;
  // const height = 160;
  // 110
  const height = rows.length * 50 + 110 < 600 ?rows.length * 50 + 110 : 600;
  // const height = rows.length * 50 + 110

  async function Delete() {
    try {
      let { data } = await axios.delete("/api/set-batch", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
        data: {
          teacher,
        },
      });
      console.log(data);
      alert("Batch deleted successfully");
      window.location.reload();
    } catch (err) {
      alert("Error Occured!");
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      scroll="paper"
      aria-labelledby="title"
      aria-describedby="description"
    >
      <DialogTitle id="title">View/Edit Batch</DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="description" tabIndex={-1}>
          <p>
            <strong>Teacher:</strong> {teacherName}
          </p>
          <p>
            <strong>TRN:</strong> {teacher}
          </p>
        </DialogContentText>
        <div style={{ height, minWidth: "320px", Width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button color="error" onClick={Delete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const columns = [
  { field: "urn", headerName: "URN", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
];
