import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import LandingPage from "./page/Landing";
import Dashboard from "./page/Dashboard";
import ProtectedRoute from "./routes/protectedRoute";
import PublicRoute from "./routes/publicRoute";
import ProfilePage from "./page/Profile"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PublicRoute/>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setting" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
