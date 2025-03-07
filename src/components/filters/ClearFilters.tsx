import { FC, Dispatch, SetStateAction } from "react";
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
    setSelectedState: Dispatch<SetStateAction<string>>,
    setSelectedZone: Dispatch<SetStateAction<string>>,
    setSelectedSeverity: Dispatch<SetStateAction<string>>,
    setSelectedUrgency: Dispatch<SetStateAction<string>>,
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
