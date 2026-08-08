import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CompaniesPage from "./pages/companies/CompaniesPage";
import FieldsPage from "./pages/fields/FieldsPage";
import WellsPage from "./pages/wells/WellsPage";
import MeasurementsPage from "./pages/measurements/MeasurementsPage";
import ProductionPage from "./pages/production/ProductionPage";
import MaintenancePage from "./pages/maintenance/MaintenancePage";
import InterventionPage from "./pages/interventions/InterventionPage";
import WellTestPage from "./pages/well-tests/WellTestPage";



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/fields" element={<FieldsPage />} />
        <Route path="/wells" element={<WellsPage />} />
        <Route path="/measurements" element={<MeasurementsPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/interventions" element={<InterventionPage />} />
        <Route path="/well-tests" element={<WellTestPage />} />
      </Route>

      <Route path="/home" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}