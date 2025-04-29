import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Placeholder for future pages */}
          <Route path="/drivers" element={<div>Drivers</div>} />
          <Route path="/vehicles" element={<div>Vehicles</div>} />
          <Route path="/rides" element={<div>Rides</div>} /> 
          <Route path="/settings" element={<div>Settings</div>}/>
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
