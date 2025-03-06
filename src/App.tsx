import { useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { MenuItem, Select, FormControl } from "@mui/material";
import stateNames from "./MapStateToCode.ts";
import AlertsTable from "./components/Table.tsx";

function App() {
  const [selectedState, setSelectedState] = useState("");

  const fetchWeatherAlertData = async (selectedState: string) => {
    const url = selectedState
      ? `https://api.weather.gov/alerts?area=${selectedState}` // State-specific API
      : "https://api.weather.gov/alerts/active";
    const response = await fetch(url);
    return response.json();
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["weatherAlert", selectedState],
    queryFn: () => fetchWeatherAlertData(selectedState),
    staleTime: 0,
    retry: 3,
  });

  if (isPending) return <p>Loading... Please wait ⏳</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { features: alerts = [] } = data || {};

  return (
    <>
      <Box sx={{ p: 3, maxWidth: "90vw", mx: "auto" }}>
        <Card
          sx={{
            p: 2,
            mb: 3,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              State
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {Object.entries(stateNames).map(([code, name]) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        <AlertsTable alerts={alerts} />
      </Box>
    </>
  );
}

export default App;
