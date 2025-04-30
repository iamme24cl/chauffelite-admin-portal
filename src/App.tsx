import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() { 
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      {!user ? (
          <Route path="/*" element={<Login />} />
      ) : (
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          {/* Placeholder for future pages */}
          <Route path="/drivers" element={<div>Drivers</div>} />
          <Route path="/vehicles" element={<div>Vehicles</div>} />
          <Route path="/rides" element={<div>Rides</div>} /> 
          <Route path="/settings" element={<div>Settings</div>}/>
          <Route path="/*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
