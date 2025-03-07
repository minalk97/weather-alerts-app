import { Box, CircularProgress } from "@mui/material";

export const LoadingComponent = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <CircularProgress size={50} />
  </Box>
);
