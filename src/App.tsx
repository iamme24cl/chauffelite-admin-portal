import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DriversPage from "./pages/Drivers";
import VehiclesPage from "./pages/VehiclesPage";
import RidesPage from "./pages/RidesPage";
import CompanySettingsPage from "./pages/CompanySettings";

function App() { 
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
      ) : (
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {/* Placeholder for future pages */}
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/rides" element={<RidesPage />} /> 
          <Route path="/settings" element={<CompanySettingsPage />}/>
          <Route path="/*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
