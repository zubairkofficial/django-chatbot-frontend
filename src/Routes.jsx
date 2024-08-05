import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Screens/Auth/Login";
import UserLayout from "./Screens/User/UserLayout";
import Dashboard from "./Screens/User/Dashboard";
import UploadFiles from "./Screens/User/UploadFiles";
import { SettingsPage } from "./Screens/User/SettingsPage";

const AppRoutes = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="/user/dashboard" exact element={<Dashboard />} />
          <Route path="/user/file_upload" exact element={<UploadFiles />} />
          <Route path="/user/settings" exact element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
