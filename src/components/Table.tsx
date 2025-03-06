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

export default function AlertsTable(props) {
  const { alerts } = props;

  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Paginate the alerts
  const paginatedAlerts = alerts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const whatPattern = /WHAT\.\.\.(.*?)(\n\*|$)/s;
  const impactsPattern = /IMPACTS\.\.\.(.*?)(\n\*|$)/s;

  function formatEventTimeWithTimezoneAbbreviation(
    startISO: string,
    endISO: string,
  ) {
    const startDate = new Date(startISO);
    const endDate = new Date(endISO);

    // Format the date as "Mar 6"
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    });

    // Format the time with the required time zones
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "America/Denver", // MST/MDT
    });

    // Extract time zone abbreviations
    const timezoneAbbr = new Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    })
      .format(startDate)
      .split(" ")[1];

    // Get formatted values
    const formattedDate = dateFormatter.format(startDate);
    const startTime = timeFormatter.format(startDate);
    const endTime = timeFormatter.format(endDate);

    // Construct the output string with time zone abbreviations
    return `${formattedDate}, ${startTime} ${timezoneAbbr} – ${endTime} ${timezoneAbbr}`;
  }

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
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#616161",
                }}
              >
                Alert Type
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#616161",
                }}
              >
                Effective Period
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#616161",
                }}
              >
                Affected Areas
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#616161",
                }}
              >
                Key Conditions
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#616161",
                }}
              >
                Impacts
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#616161",
                }}
              >
                Precautions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert, index) => {
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
                  <>
                    <TableRow
                      key={id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {event}
                      </TableCell>
                      <TableCell>
                        {formatEventTimeWithTimezoneAbbreviation(
                          effective,
                          expires,
                        )}
                      </TableCell>
                      <TableCell>{region}</TableCell>
                      <TableCell>{what}</TableCell>
                      <TableCell>{impacts}</TableCell>
                      <TableCell>{instruction}</TableCell>
                    </TableRow>
                  </>
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
                  No active alerts match your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={alerts.length} // Total number of rows
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[3, 5, 10]} // Options for rows per page
        sx={{ mt: 2 }}
      />
    </>
  );
}
