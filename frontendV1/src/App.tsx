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
import Reports from "./pages/reports/Reports";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ForbiddenPage from "./pages/ForbiddenPage";



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
        <Route path="/companies" element={<ProtectedRoute requiredResource="companies" requiredAction="view"><CompaniesPage /></ProtectedRoute>} />
        <Route path="/fields" element={<ProtectedRoute requiredResource="fields" requiredAction="view"><FieldsPage /></ProtectedRoute>} />
        <Route path="/wells" element={<ProtectedRoute requiredResource="wells" requiredAction="view"><WellsPage /></ProtectedRoute>} />
        <Route path="/measurements" element={<ProtectedRoute requiredResource="measurements" requiredAction="view"><MeasurementsPage /></ProtectedRoute>} />
        <Route path="/production" element={<ProtectedRoute requiredResource="production" requiredAction="view"><ProductionPage /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute requiredResource="maintenance" requiredAction="view"><MaintenancePage /></ProtectedRoute>} />
        <Route path="/interventions" element={<ProtectedRoute requiredResource="interventions" requiredAction="view"><InterventionPage /></ProtectedRoute>} />
        <Route path="/well-tests" element={<ProtectedRoute requiredResource="well_tests" requiredAction="view"><WellTestPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute requiredResource="reports" requiredAction="view"><Reports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}