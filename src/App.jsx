import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Auth/Login";
import UserLayout from "./Screens/User/UserLayout";
import Dashboard from "./Screens/User/Dashboard";
import ProtectedRoute from "./protectedRoute.jsx";
import Register from "./Screens/Auth/Register.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"  element={<Login />}/>
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/user" element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
          }>
          <Route path="dashboard/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
