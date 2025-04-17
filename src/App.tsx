import { FC } from "react";
import { Card, CardContent, Box } from "@mui/material";
import { AlertsTable } from "./components/alertsTable/Table";
import Header from "./components/Header";
import { AlertProvider } from "./context/AlertsContext";
import { Filters } from "./components/filters/Filters";
import { ClearFilters } from "./components/filters/ClearFilters";
import { SortAlerts } from "./components/Sorting/SortAlerts";
import Footer from "./components/Footer.tsx";
import styled from "styled-components";

const StyledBox = styled(Box)`
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    flex-direction: column;
  }
`;

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
            <StyledBox>
              <SortAlerts />
              <ClearFilters />
            </StyledBox>
          </CardContent>
        </Card>

        <AlertsTable />
      </Box>
      <Footer />
    </AlertProvider>
  );
};

export default App;
