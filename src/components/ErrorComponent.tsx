import { FC } from "react";
import { Box, Typography } from "@mui/material";

type propsType = {
  error: unknown;
};
export const ErrorComponent: FC<propsType> = (props) => {
  const { error } = props;
  return (
    <Box sx={{ textAlign: "center", color: "red", mt: 2 }}>
      <Typography variant="h6">{String(error)}</Typography>
    </Box>
  );
};
