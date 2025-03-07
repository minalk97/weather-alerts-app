import { FC } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Typography, Button } from "@mui/material";
import { useAlertContext } from "../context/AlertsContext.tsx";

const Header: FC = () => {
  const {
    setSelectedState,
    setSelectedZone,
    setSelectedSeverity,
    setSelectedUrgency,
    setSortBy,
    setSortDirection,
  } = useAlertContext();

  const clearFilters = (
    setSelectedState: (state: string) => void,
    setSelectedZone: (zone: string) => void,
    setSelectedSeverity: (severity: string) => void,
    setSelectedUrgency: (urgency: string) => void,
    setSortBy: (sortField: string) => void,
    setSortDirection: (direction: string) => void,
  ): void => {
    setSelectedState("");
    setSelectedZone("");
    setSelectedSeverity("");
    setSelectedUrgency("");
    setSortBy("sent");
    setSortDirection("desc");
  };

  const handleClick = (): void => {
    clearFilters(
      setSelectedState,
      setSelectedZone,
      setSelectedSeverity,
      setSelectedUrgency,
      setSortBy,
      setSortDirection,
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#649bda",
        padding: "8px",
        color: "white",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <Button
        onClick={handleClick}
        sx={{ textTransform: "none", fontSize: "inherit", color: "inherit" }}
      >
        <Typography variant="h4" fontWeight="bold">
          Weather Alerts
        </Typography>
        <WarningAmberIcon sx={{ marginLeft: "8px" }} />
      </Button>
    </Box>
  );
};

export default Header;
