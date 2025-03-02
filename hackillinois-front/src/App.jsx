// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage.jsx";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Tracker from "./components/Tracker"; // New Tracker import
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 🔐 Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracker" element={<Tracker />} />
        </Route>

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
