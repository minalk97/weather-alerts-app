import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchWeatherAlertData,
  fetchAlertsByZone,
} from "../services/WeatherAPI";
import { WeatherAlert, WeatherAlertProperties } from "../types/WeatherAlert";

type SeverityOrder = {
  [key in WeatherAlertProperties["severity"]]: number;
} & {
  Unknown: number;
};

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

// 🔹 Create Context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
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

  const rawAlerts = selectedZone ? zoneAlerts : stateAlerts;

  useEffect(() => {
    if (!rawAlerts) {
      setAlerts([]); // Reset if no data
      return;
    }

    let processedAlerts = rawAlerts.filter(
      (alert: WeatherAlert) => alert.properties.status !== "Test",
    );

    if (selectedSeverity) {
      processedAlerts = processedAlerts.filter(
        (alert: WeatherAlert) => alert.properties.severity === selectedSeverity,
      );
    }
    if (selectedUrgency) {
      processedAlerts = processedAlerts.filter(
        (alert: WeatherAlert) => alert.properties.urgency === selectedUrgency,
      );
    }

    const severityOrder: SeverityOrder = {
      Extreme: 4,
      Severe: 3,
      Moderate: 2,
      Minor: 1,
      Unknown: 0,
    };

    processedAlerts.sort((a: WeatherAlert, b: WeatherAlert) => {
      if (["sent", "effective", "expires"].includes(sortBy)) {
        const dateA = new Date(a.properties[sortBy] as string).getTime();
        const dateB = new Date(b.properties[sortBy] as string).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "severity") {
        const severityA = severityOrder[a.properties.severity] || 0;
        const severityB = severityOrder[b.properties.severity] || 0;
        return sortDirection === "asc"
          ? severityA - severityB
          : severityB - severityA;
      } else {
        const valueA = String(a.properties[sortBy] || "");
        const valueB = String(b.properties[sortBy] || "");
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

    setAlerts(processedAlerts);
  }, [
    rawAlerts,
    selectedZone,
    selectedSeverity,
    selectedUrgency,
    sortBy,
    sortDirection,
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

export const useAlertContext = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};
