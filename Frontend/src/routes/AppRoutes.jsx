import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgetPassword from '../pages/ForgetPassword';
import DashBoard from '../pages/DashBoard';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/forgot-password' element={<ForgetPassword/>} />
        <Route path='/dashboard' element={<DashBoard/>} />
      </Routes> 
    </BrowserRouter>
  )
}

export default AppRoutes
