import { FC, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
} from "@mui/material";
import styled from "styled-components";

import { LoadingComponent } from "../Loading.tsx";
import { ErrorComponent } from "../ErrorComponent.tsx";
import { useAlertContext } from "../../context/AlertsContext.tsx";
import { AlertRow } from "./AlertRow.tsx";
import { WeatherAlert } from "../../types/WeatherAlert.ts";

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  text-transform: uppercase;
  color: "#616161";
`;

export const AlertsTable: FC = () => {
  const { alerts, loadingAlerts, isError, error } = useAlertContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAlerts = alerts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const whatPattern = /WHAT\.\.\.(.*?)(\n\*|$)/s;
  const impactsPattern = /IMPACTS\.\.\.(.*?)(\n\*|$)/s;

  const formatEventTimeWithTimezoneAbbreviation = (
    startISO: string,
    endISO: string,
  ): string => {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "America/Denver",
    });

    const timezoneAbbr: string = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    })
      .format(startDate)
      .split(" ")[1];

    const formattedDate: string = dateFormatter.format(startDate);
    const startTime: string = timeFormatter.format(startDate);
    const endTime: string = timeFormatter.format(endDate);

    return `${formattedDate}, ${startTime} ${timezoneAbbr} – ${endTime} ${timezoneAbbr}`;
  };

  return (
    <>
      <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
        Showing {paginatedAlerts.length} of {alerts.length} active alerts
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: "10px", border: "1px solid #E0E0E0", boxShadow: 0 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F5F5F5" }}>
              <StyledTableCell>Alert Type</StyledTableCell>
              <StyledTableCell>Effective Period</StyledTableCell>
              <StyledTableCell>Affected Areas</StyledTableCell>
              <StyledTableCell>Key Conditions</StyledTableCell>
              <StyledTableCell>Impacts</StyledTableCell>
              <StyledTableCell>Precautions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loadingAlerts && !isError && paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert: WeatherAlert) => (
                <AlertRow
                  alert={alert}
                  whatPattern={whatPattern}
                  impactsPattern={impactsPattern}
                  formatEventTimeWithTimezoneAbbreviation={
                    formatEventTimeWithTimezoneAbbreviation
                  }
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    textAlign: "center",
                    py: 2,
                    color: "#757575",
                    fontWeight: "bold",
                  }}
                >
                  {loadingAlerts ? (
                    <LoadingComponent />
                  ) : isError ? (
                    <ErrorComponent error={error} />
                  ) : (
                    "No active alerts match your criteria"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={alerts.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[3, 5, 10, 20]}
        sx={{ mt: 2 }}
      />
    </>
  );
};
