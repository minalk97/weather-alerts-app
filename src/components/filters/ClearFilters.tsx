import { FC } from "react";
import { Button } from "@mui/material";
import { useAlertContext } from "../../context/AlertsContext.tsx";

export const ClearFilters: FC = () => {
  const {
    setSelectedState,
    setSelectedZone,
    setSelectedSeverity,
    setSelectedUrgency,
  } = useAlertContext();

  const clearFilters = (
    setSelectedState: (state: string) => void,
    setSelectedZone: (zone: string) => void,
    setSelectedSeverity: (severity: string) => void,
    setSelectedUrgency: (urgency: string) => void,
  ) => {
    setSelectedState("");
    setSelectedZone("");
    setSelectedSeverity("");
    setSelectedUrgency("");
  };

  const handleClick = (): void => {
    clearFilters(
      setSelectedState,
      setSelectedZone,
      setSelectedSeverity,
      setSelectedUrgency,
    );
  };

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      sx={{
        backgroundColor: "#649bda",
        color: "white",
        mt: 2,
        "&:hover": { backgroundColor: "#508ac7" },
      }}
    >
      Clear Filters
    </Button>
  );
};
