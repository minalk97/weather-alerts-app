import { Box, Typography } from "@mui/material";

export const ErrorComponent = (props) => {
  const { error } = props;
  return (
    <Box sx={{ textAlign: "center", color: "red", mt: 2 }}>
      <Typography variant="h6">{error}</Typography>
    </Box>
  );
};
