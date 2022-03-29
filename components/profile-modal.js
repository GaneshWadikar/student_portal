import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProfileModal({
  dialogOpen,
  setDialogOpen,
  profile_pic,
  urn,
}) {
  const [src, setSrc] = useState(profile_pic);
  const [name, setName] = useState("");
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const handleClose = () => {
    setDialogOpen(false);
  };

  function focus() {
    fileRef.current.click();
  }

  useEffect(() => {
    if (fileRef.current) {
      fileRef.current.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const objectUrl = URL.createObjectURL(file);
        setSrc(objectUrl);
        setName(file.name);
      });
    }
  }, [dialogOpen]);

  function encodeImageFileAsURL(element) {
    return new Promise((resolve, reject) => {
      var file = element.files[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleUpload() {
    formRef.current.submit();
  }

  return (
    <Dialog
      open={dialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="description"
    >
      <DialogTitle>Update Profile Photo</DialogTitle>
      <DialogContent>
        <div className="img-preview">
          <Image src={src} layout="fill" objectFit="cover" alt="" />
        </div>
        <form
          action="/api/change-profile"
          style={{ display: "none" }}
          method="post"
          encType="multipart/form-data"
          ref={formRef}
        >
          <input type="text" name="urn" value={urn} readOnly />
          <input type="file" accept="image/*" name="image" ref={fileRef} />
        </form>

        <TextField
          label="Select File"
          variant="outlined"
          value={name}
          onFocus={focus}
          onClick={focus}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpload}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
}
