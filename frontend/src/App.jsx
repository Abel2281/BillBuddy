import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AddBill from "./components/AddBill.jsx";
import Loading from "./components/Loading.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        await new Promise((resolve) => setTimeout(resolve, 4200));
        if (token) {
          const response = await axios.get("http://localhost:5000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.username) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false); 
            localStorage.removeItem("token");
          }
        } else {
          setIsAuthenticated(false); 
        }
      } catch (err) {
        console.error("Auth verification failed:", err);
        setIsAuthenticated(false);
        localStorage.removeItem("token"); 
      } finally {
        setIsLoading(false); 
      }
    };
    verifyAuth();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-bill"
          element={
            isAuthenticated ? (
              <AddBill setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;