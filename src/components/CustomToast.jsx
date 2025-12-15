import Alert from "@mui/material/Alert";

export default function CustomToast({ severity, message }) {
  return (
    <Alert variant="filled" severity={severity}>
      {message}
    </Alert>
  );
}
