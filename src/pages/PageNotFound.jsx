import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#111b21",
        color: "#fff",
        textAlign: "center",
        px: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "#25D366" }} />
      <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="success"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFound;
