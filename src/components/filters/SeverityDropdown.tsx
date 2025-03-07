import { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useAlertContext } from "../../context/AlertsContext.tsx";

export const SeverityDropdown: FC = () => {
  const { selectedSeverity, setSelectedSeverity } = useAlertContext();

  const severityLevels: string[] = [
    "Extreme",
    "Severe",
    "Moderate",
    "Minor",
    "Unknown",
  ];

  return (
    <FormControl fullWidth sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}>
      <InputLabel id="select-state-label">Severity</InputLabel>
      <Select
        labelId="select-state-label"
        label="Severity"
        id="select-state"
        value={selectedSeverity}
        onChange={(e: SelectChangeEvent) => setSelectedSeverity(e.target.value)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              width: 200,
            },
          },
        }}
      >
        {severityLevels.map((level: string) => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
