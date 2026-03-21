import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgetPassword from "../pages/ForgetPassword";
import DashBoard from "../pages/DashBoard";
import ProtectedRoute from "./ProtectedRoutes";
import CreateGroups from "../pages/CreateGroups";
import Groups from "../pages/Groups";
import GroupForm from "../pages/GroupForm";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/create-group" element={<CreateGroups />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/edit-group/:id" element={<GroupForm />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
