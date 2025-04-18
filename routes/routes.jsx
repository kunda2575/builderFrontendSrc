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
import DepartmentMaster from "../components/admin/masters/DepartmentMaster";

import NotFound from "../components/NotFound";
import CustomerMaster from "../components/admin/masters/CustomerMaster";
import EmployeeMaster from "../components/admin/masters/EmmployeeMaster";
import ExpenseCategoryMaster from "../components/admin/masters/ExpenseCategoryMaster";
import FundPurpose from "../components/admin/masters/FundPurpose";
import FundSource from "../components/admin/masters/FundSource";
import LeadSource from "../components/admin/masters/leadSource";

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
    <Route path="/departmentMaster" element={<DepartmentMaster/>} />
    <Route path="/employeeMaster" element={<EmployeeMaster/>}/>
    <Route path="/expenseCategoryMaster" element={<ExpenseCategoryMaster/>}/>
    <Route path="/fundPurpose" element={<FundPurpose/>}/>
    <Route path="/fundSource" element={<FundSource/>}/>
    <Route path="/leadsource" element={<LeadSource/>}/>




  
<Route path="*" element={<NotFound/>} />

  </Routes>
);

export default AppRoutes;
