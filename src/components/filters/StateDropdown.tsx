import { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import stateNames from "../../MapStateToCode.ts";
import { useAlertContext } from "../../context/AlertsContext.tsx";

export const StateDropdown: FC = () => {
  const { selectedState, setSelectedState, setSelectedZone } =
    useAlertContext();

  return (
    <FormControl fullWidth sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}>
      <InputLabel id="select-state-label">State</InputLabel>
      <Select
        labelId="select-state-label"
        label="State"
        id="select-state"
        value={selectedState}
        onChange={(e: SelectChangeEvent) => {
          setSelectedState(e.target.value);
          setSelectedZone("");
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300, // Set height limit
              width: 200, // Set proper width
            },
          },
        }}
      >
        {Object.entries(stateNames).map(([code, name]: [string, string]) => (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
