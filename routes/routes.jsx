// src/routes/AppRoutes.js
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "../components/auth/login/login";
import Signup from "../components/auth/signup/signup";
import ForgotPassword from "../components/auth/forgotPassword/forgotPassword";
import Home from "../home/Home";
import LeadStage from "../components/admin/masters/BlockMaster";
import UpdateData from "../components/admin/UpdateData";


import ProtectedRoute from "./privateRoutes";
import Transaction from "../components/admin/Transaction";
import BlockMaster from "../components/admin/masters/BlockMaster";
import BuilderMaster from "../components/admin/masters/BuilderMaster";
import BankMaster from "../components/admin/masters/BankMaster";

import NotFound from "../components/NotFound";
import CustomerMaster from "../components/admin/masters/CustomerMaster";

const AppRoutes = () => (
  <Routes>
    {/* Private Route */}
    {/* <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }
    /> */}
 <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    
    <Route path="/updateData" element={<UpdateData />} />
    <Route path="/transaction" element={<Transaction/>} />
    <Route path="/forgotPassword" element={<ForgotPassword />} />

          {/* master routes */}
    <Route path="/blockMaster" element={<BlockMaster/>} />
    <Route path="/builderMaster" element={<BuilderMaster/>}/>
    <Route path="/bankMaster" element={<BankMaster/>}/>
    <Route path="/customerMaster" element={<CustomerMaster/>} />




  
<Route path="*" element={<NotFound/>} />

  </Routes>
);

export default AppRoutes;
