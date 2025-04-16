import { FC } from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#649bda",
        color: "white",
        py: 4,
        px: 2,
        mt: 8,
      }}
    >
      <Box maxWidth="md" sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="body1" sx={{ marginRight: "5px" }}>
          Data Source:
        </Typography>
        <Typography variant="body1">
          Weather alerts and data are provided by the{" "}
          <Link
            href="https://www.weather.gov/documentation/services-web-api#"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="primary"
          >
            National Weather Service Web API
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
