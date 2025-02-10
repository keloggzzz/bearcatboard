import React from "react";

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useEffect, useState } from "react";
import api from "./api"; // Axios instance

function App() {
	console.log("here1");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
	
    useEffect(() => {
        async function checkAuth() {
            try {
                await api.get("/auth/user"); // Check if user is logged in
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        }
        checkAuth();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/auth/login" element={<Login />} />
                <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth/login" />} />
            </Routes>
        </Router>
    );
}

export default App;