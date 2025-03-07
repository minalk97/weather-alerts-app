import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#649bda",
        padding: "8px",
        color: "white",
        width: "100vw", // Full viewport width
        position: "fixed", // Fix it at the top
        top: 0,
        left: 0,
        zIndex: 1000, // Ensure it stays on top
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Weather Alerts
      </Typography>
      <WarningAmberIcon sx={{ marginLeft: "8px" }} />
    </Box>
  );
};

export default Header;
