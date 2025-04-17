import React, { FC, useState } from "react";

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
  Box,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

const StyledBox = styled(Box)`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    flex-direction: column;
  }
`;

export const AlertsTable: FC = () => {
  const { alerts, loadingAlerts, isError, error } = useAlertContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
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

    const formattedStartDate: string = dateFormatter.format(startDate);
    const startTime: string = timeFormatter.format(startDate);
    const formattedEndDate: string = dateFormatter.format(endDate);
    const endTime: string = timeFormatter.format(endDate);

    return `${formattedStartDate}, ${startTime} – ${formattedEndDate}, ${endTime} ${timezoneAbbr}`;
  };

  return (
    <>
      <StyledBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
          Showing {paginatedAlerts.length} of {alerts.length} active alerts
        </Typography>

        <Box
          sx={{
            display: "flex",
          }}
        >
          <Typography
            variant="caption"
            gutterBottom
            sx={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <PriorityHighIcon sx={{ color: "red", fontSize: 24 }} />
              <PriorityHighIcon sx={{ color: "red", fontSize: 24 }} />
            </Box>
            Extreme
          </Typography>

          <Typography
            variant="caption"
            gutterBottom
            sx={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            }}
          >
            <PriorityHighIcon sx={{ color: "red", fontSize: 24 }} />
            <Typography variant="caption">Severe</Typography>
          </Typography>
          <Typography
            variant="caption"
            gutterBottom
            sx={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            }}
          >
            <WarningAmberIcon sx={{ color: "orange", fontSize: 24 }} /> Moderate
          </Typography>
          <Typography
            variant="caption"
            gutterBottom
            sx={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            }}
          >
            <InfoOutlinedIcon sx={{ color: "#009CFF", fontSize: 24 }} /> Minor
          </Typography>
        </Box>
      </StyledBox>
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
