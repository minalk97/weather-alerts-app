import { useState } from "react";

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
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styled from "styled-components";

import ReadMore from "./ReadMore.tsx";
import { LoadingComponent } from "./Loading.tsx";
import { ErrorComponent } from "./ErrorComponent.tsx";

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  text-transform: uppercase;
  color: "#616161";
`;

export default function AlertsTable(props) {
  const { alerts, isLoading, isError, error } = props;

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
  ) => {
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

    const timezoneAbbr = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    })
      .format(startDate)
      .split(" ")[1];

    const formattedDate = dateFormatter.format(startDate);
    const startTime = timeFormatter.format(startDate);
    const endTime = timeFormatter.format(endDate);

    return `${formattedDate}, ${startTime} ${timezoneAbbr} – ${endTime} ${timezoneAbbr}`;
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "Extreme":
        return [...Array(2)].map(() => (
          <PriorityHighIcon sx={{ color: "red", fontSize: 24 }} />
        ));
      case "Severe":
        return <PriorityHighIcon sx={{ color: "red", fontSize: 24 }} />;
      case "Moderate":
        return <WarningAmberIcon sx={{ color: "orange", fontSize: 24 }} />;
      case "Minor":
        return <InfoOutlinedIcon sx={{ color: "#009CFF", fontSize: 24 }} />;
      default:
        return null;
    }
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
            {!isLoading && !isError && paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert) => {
                const { properties } = alert;
                const {
                  id,
                  areaDesc: region,
                  event,
                  effective,
                  expires,
                  severity,
                  description,
                  instruction,
                } = properties;

                const whatMatch = description.match(whatPattern);
                const what = whatMatch ? whatMatch[1].trim() : "";

                const impactsMatch = description.match(impactsPattern);
                const impacts = impactsMatch ? impactsMatch[1].trim() : "";

                return (
                  <TableRow
                    key={id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <div>{getSeverityIcon(severity)}</div> {event}
                    </TableCell>
                    <TableCell>
                      {formatEventTimeWithTimezoneAbbreviation(
                        effective,
                        expires,
                      )}
                    </TableCell>
                    <TableCell>
                      {region ? <ReadMore text={region} maxLength={80} /> : "-"}
                    </TableCell>
                    <TableCell>
                      {what ? <ReadMore text={what} maxLength={80} /> : "-"}
                    </TableCell>
                    <TableCell>
                      {impacts ? (
                        <ReadMore text={impacts} maxLength={80} />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {instruction ? (
                        <ReadMore text={instruction} maxLength={80} />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
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
                  {isLoading ? (
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
}
