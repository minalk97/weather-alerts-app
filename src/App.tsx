import { FC } from "react";
import { Card, CardContent, Box } from "@mui/material";
import { AlertsTable } from "./components/alertsTable/Table";
import Header from "./components/Header";
import { AlertProvider } from "./context/AlertsContext";
import { Filters } from "./components/filters/Filters";
import { ClearFilters } from "./components/filters/ClearFilters";
import { SortAlerts } from "./components/Sorting/SortAlerts";
import Footer from "./components/Footer.tsx";

const App: FC = () => {
  return (
    <AlertProvider>
      <Header />
      <Box sx={{ p: 3, maxWidth: "90vw", mx: "auto" }}>
        <Card
          sx={{
            mt: 7,
            mb: 4,
            boxShadow: 3,
            mx: "auto",
            width: "70vw",
          }}
        >
          <CardContent>
            <Filters />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <SortAlerts />
              <ClearFilters />
            </div>
          </CardContent>
        </Card>

        <AlertsTable />
      </Box>
      <Footer />
    </AlertProvider>
  );
};

export default App;
