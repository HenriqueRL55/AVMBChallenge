import React from "react";
import { Snackbar, Alert } from "@mui/material";

const AlertMessage = ({
  open,
  onClose,
  message,
  severity = "info",
  duration = 5000,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
