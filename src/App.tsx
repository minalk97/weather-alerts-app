import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "@tanstack/react-query";
import stateNames from "./MapStateToCode.ts";
import AlertsTable from "./components/Table.tsx";
import Header from "./components/Header.tsx";

interface Zone {
  id: string;
  name: string;
}

function App() {
  const [alerts, setAlerts] = useState([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [expanded, setExpanded] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState("sent");
  const [sortDirection, setSortDirection] = useState("desc");

  // Severity levels for filtering
  const severityLevels = ["Extreme", "Severe", "Moderate", "Minor", "Unknown"];

  // Urgency levels for filtering
  const urgencyLevels = ["Immediate", "Expected", "Future", "Past", "Unknown"];

  // Sort options
  const sortOptions = [
    { value: "sent-desc", label: "Newest First" },
    { value: "sent-asc", label: "Oldest First" },
    { value: "severity-desc", label: "Severity (High to Low)" },
    { value: "severity-asc", label: "Severity (Low to High)" },
    { value: "expires-asc", label: "Expiring Soon" },
  ];

  const {
    isLoading: loadingStateAlerts,
    isError,
    data: stateAlerts,
    error,
  } = useQuery({
    queryKey: ["weatherAlert", selectedState],
    queryFn: () => fetchWeatherAlertData(selectedState),
    staleTime: 0,
    retry: 3,
  });

  // Fetch alerts when a zone is selected
  const { data: zoneAlerts, isLoading: loadingZoneAlerts } = useQuery({
    queryKey: ["alerts", selectedZone],
    queryFn: () => fetchAlertsByZone(selectedZone),
    enabled: !!selectedZone,
  });

  useEffect(() => {
    const rawAlerts = selectedZone ? zoneAlerts : stateAlerts;
    if (!rawAlerts) {
      setAlerts([]); // Reset if no data
      return;
    }

    // 🔹 Step 1: Remove Test Messages
    let processedAlerts = rawAlerts.filter(
      (alert) => alert.properties.status !== "Test",
    );

    // 🔹 Step 2: Apply Severity Filter
    if (selectedSeverity) {
      processedAlerts = processedAlerts.filter(
        (alert) => alert.properties.severity === selectedSeverity,
      );
    }

    if (selectedUrgency) {
      processedAlerts = processedAlerts.filter(
        (alert) => alert.properties.urgency === selectedUrgency,
      );
    }

    // 🔹 Step 3: Apply Sorting
    processedAlerts.sort((a, b) => {
      // Severity order mapping
      const severityOrder = {
        Extreme: 4,
        Severe: 3,
        Moderate: 2,
        Minor: 1,
        Unknown: 0,
      };

      if (sortBy === "sent" || sortBy === "effective" || sortBy === "expires") {
        //Date comparison
        const aValue = a.properties[sortBy]
          ? new Date(a.properties[sortBy]).getTime()
          : 0;
        const bValue = b.properties[sortBy]
          ? new Date(b.properties[sortBy]).getTime()
          : 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (sortBy === "severity") {
        // Severity comparison
        const aValue = severityOrder[a.properties.severity] || 0;
        const bValue = severityOrder[b.properties.severity] || 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        // Default string comparison
        const aValue = String(a.properties[sortBy] || "").toLowerCase();
        const bValue = String(b.properties[sortBy] || "").toLowerCase();
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    setAlerts(processedAlerts);
  }, [
    stateAlerts,
    zoneAlerts,
    selectedZone,
    selectedSeverity,
    selectedUrgency,
    sortBy,
    sortDirection,
  ]);

  // Function to handle sort change
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [field, direction] = value.split("-");
    setSortBy(field);
    setSortDirection(direction);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedState("");
    setSelectedZone("");
    setSelectedSeverity("");
    setSelectedUrgency("");
  };

  const fetchWeatherAlertData = async (selectedState: string) => {
    const url = selectedState
      ? `https://api.weather.gov/alerts?area=${selectedState}` // State-specific API
      : "https://api.weather.gov/alerts/active";
    const response = await axios.get(url);
    return response.data.features;
  };

  // Fetch zones for a selected state
  const fetchZonesByState = async (selectedState) => {
    const response = await axios.get(
      `https://api.weather.gov/zones?area=${selectedState}`,
    );
    return response.data.features.map((zone) => ({
      id: zone.properties.id,
      name: zone.properties.name,
    }));
  };

  // Fetch alerts for a selected zone
  const fetchAlertsByZone = async (zoneId) => {
    const response = await axios.get(
      `https://api.weather.gov/alerts/active/zone/${zoneId}`,
    );
    return response.data.features;
  };

  // Fetch zones when a state is selected
  const { data: zones, isLoading: loadingZones } = useQuery({
    queryKey: ["zones", selectedState],
    queryFn: () => fetchZonesByState(selectedState),
    enabled: !!selectedState,
  });

  const loadingAlerts = selectedZone ? loadingZoneAlerts : loadingStateAlerts;

  return (
    <>
      <Header />
      <Box sx={{ p: 3, maxWidth: "90vw", mx: "auto" }}>
        <Card
          sx={{
            p: 1,
            my: 4,
            boxShadow: 3,
            mx: "auto",
            width: "70vw",
          }}
        >
          <CardContent>
            {/*<div*/}
            {/*  style={{*/}
            {/*    display: "flex",*/}
            {/*    padding: "4px",*/}
            {/*    margin: "4px",*/}
            {/*  }}*/}
            {/*>*/}
            <Accordion
              expanded={expanded}
              onChange={() => setExpanded(!expanded)}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {/* 🔹 Accordion Header */}
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ backgroundColor: "#f0f0f0", borderRadius: "8px" }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Filters</Typography>
              </AccordionSummary>

              {/* 🔹 Accordion Content (Filters) */}
              <AccordionDetails>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2, // Spacing between dropdowns
                    flexWrap: "wrap",
                  }}
                >
                  <FormControl
                    fullWidth
                    sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}
                  >
                    <InputLabel id="select-state-label">State</InputLabel>
                    <Select
                      labelId="select-state-label"
                      label="State"
                      id="select-state"
                      value={selectedState}
                      onChange={(e) => {
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
                      {Object.entries(stateNames).map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

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
                      {zones
                        ?.sort((a, b) => a - b)
                        .map((zone) => (
                          <MenuItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2, // Spacing between dropdowns
                    flexWrap: "wrap",
                    mt: 2, // Add margin-top for spacing
                  }}
                >
                  {/*<div style={{ display: "flex", padding: "4px", margin: "4px" }}>*/}
                  <FormControl
                    fullWidth
                    sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}
                  >
                    <InputLabel id="select-state-label">Severity</InputLabel>
                    <Select
                      labelId="select-state-label"
                      label="Severity"
                      id="select-state"
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300, // Set height limit
                            width: 200, // Set proper width
                          },
                        },
                      }}
                    >
                      {severityLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    fullWidth
                    sx={{ flex: "1 1 45%", minWidth: "200px", mr: 2 }}
                  >
                    <InputLabel id="select-state-label">Urgency</InputLabel>
                    <Select
                      labelId="select-state-label"
                      label="Urgency"
                      id="select-state"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300, // Set height limit
                            width: 200, // Set proper width
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
                </Box>
              </AccordionDetails>
            </Accordion>
            {/*</div>*/}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{
                  display: "flex",
                  padding: "4px",
                  margin: "4px",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "#333", mr: 1 }}
                >
                  Sort by:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
                  <Select
                    value={`${sortBy}-${sortDirection}`}
                    onChange={handleSortChange}
                    displayEmpty
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Button
                onClick={clearFilters}
                sx={{
                  color: "#007BFF",
                  border: "1px solid blue",
                  cursor: "pointer",

                  padding: 1,
                  fontSize: "14px",
                  "&:hover": { textDecoration: "none", color: "#0056b3" },
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <AlertsTable
          alerts={alerts}
          isLoading={loadingAlerts}
          isError={isError}
          error={error}
        />
      </Box>
    </>
  );
}

export default App;
