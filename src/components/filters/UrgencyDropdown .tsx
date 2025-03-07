import { FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAlertContext } from "../../context/AlertsContext.tsx";

export const UrgencyDropdown: FC = () => {
  const { selectedUrgency, setSelectedUrgency } = useAlertContext();
  // Urgency levels for filtering
  const urgencyLevels = ["Immediate", "Expected", "Future", "Past", "Unknown"];

  return (
    <FormControl fullWidth sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}>
      <InputLabel id="select-state-label">Urgency</InputLabel>
      <Select
        labelId="select-state-label"
        label="Urgency"
        id="select-state"
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              width: 200,
            },
          },
        }}
        value={selectedUrgency}
        onChange={(e) => setSelectedUrgency(e.target.value)}
      >
        {urgencyLevels.map((level) => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
