import { FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAlertContext } from "../../context/AlertsContext.tsx";
import { fetchZonesByState } from "../../services/WeatherAPI.ts";

type zoneType = {
  id: string;
  name: "string";
};
export const ZoneDropdown: FC = () => {
  const { selectedState, selectedZone, setSelectedZone } = useAlertContext();

  // Fetch zones when a state is selected
  const { data: zones, isLoading: loadingZones } = useQuery({
    queryKey: ["zones", selectedState],
    queryFn: () => fetchZonesByState(selectedState),
    enabled: !!selectedState,
  });

  return (
    <FormControl
      fullWidth
      disabled={!selectedState || loadingZones || !zones?.length}
      sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}
    >
      <InputLabel id="select-zone-label">Zone</InputLabel>
      <Select
        labelId="select-zone-label"
        label="Zone"
        id="select-zone"
        value={selectedZone}
        onChange={(e) => {
          setSelectedZone(e.target.value);
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
        {zones?.map((zone: zoneType) => (
          <MenuItem key={zone.id} value={zone.id}>
            {zone.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
