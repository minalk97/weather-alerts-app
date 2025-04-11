import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchWeatherAlertData,
  fetchAlertsByZone,
} from "../services/WeatherAPI";
import { WeatherAlert } from "../types/WeatherAlert";
import { sortAlerts } from "../SortAlerts.ts";
import { filterAlerts } from "../FilterAlerts.ts";

type AlertContextType = {
  alerts: WeatherAlert[];
  stateAlerts: WeatherAlert[];
  zoneAlerts: WeatherAlert[];
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  selectedSeverity: string;
  setSelectedSeverity: (severity: string) => void;
  selectedUrgency: string;
  setSelectedUrgency: (urgency: string) => void;
  sortBy: string;
  setSortBy: (sortField: string) => void;
  sortDirection: string;
  setSortDirection: (direction: string) => void;
  loadingAlerts: boolean;
  isError: boolean;
  error: unknown;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("sent");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  const {
    isLoading: loadingStateAlerts,
    isError,
    data: stateAlerts,
    error,
  } = useQuery({
    queryKey: ["weatherAlert", selectedState],
    queryFn: () => fetchWeatherAlertData(selectedState),
  });

  // Fetch alerts when a zone is selected
  const { data: zoneAlerts, isLoading: loadingZoneAlerts } = useQuery({
    queryKey: ["alerts", selectedZone],
    queryFn: () => fetchAlertsByZone(selectedZone),
    enabled: !!selectedZone,
  });

  const loadingAlerts: boolean = selectedZone
    ? loadingZoneAlerts
    : loadingStateAlerts;

  useEffect(() => {
    const fetchedAlerts = selectedZone ? zoneAlerts : stateAlerts;

    if (!fetchedAlerts) {
      setAlerts([]);
      return;
    }

    const filteredAlerts = filterAlerts(
      fetchedAlerts,
      selectedSeverity,
      selectedUrgency,
    );

    setAlerts(sortAlerts(filteredAlerts, sortBy, sortDirection));
  }, [
    selectedSeverity,
    selectedUrgency,
    selectedZone,
    sortBy,
    sortDirection,
    stateAlerts,
    zoneAlerts,
  ]);

  const contextValue: AlertContextType = {
    alerts,
    stateAlerts,
    zoneAlerts,
    selectedState,
    setSelectedState,
    selectedZone,
    setSelectedZone,
    selectedSeverity,
    setSelectedSeverity,
    selectedUrgency,
    setSelectedUrgency,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    loadingAlerts,
    isError,
    error,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
    </AlertContext.Provider>
  );
};

const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};

export { useAlertContext, AlertProvider };
