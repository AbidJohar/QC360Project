import { Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default App;
