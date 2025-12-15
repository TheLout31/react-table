import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function CustomToast({ severity = "info", message, onClose }) {
  return (
    <Snackbar
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        variant="filled"
        severity={severity}
        onClose={onClose}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
