// src/routes/AppRoutes.js
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "../components/auth/login/login";
import Signup from "../components/auth/signup/signup";
import ForgotPassword from "../components/auth/forgotPassword/forgotPassword";
import Home from "../home/Home";

import UpdateData from "../components/admin/masters/UpdateData";


import ProtectedRoute from "./privateRoutes";
import Transaction from "../components/admin/transactions/Transaction";
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
import LeadStage from "../components/admin/masters/LeadStage";
import LostReason from "../components/admin/masters/LostReasons";
import MaterialMaster from "../components/admin/masters/MaterialMaster";
import PaymentMode from "../components/admin/masters/PaymentModeMaster";
import PaymentType from "../components/admin/masters/PaymentTypeMaster";
import ProjectMaster from "../components/admin/masters/ProjectMaster";
import RoleMaster from "../components/admin/masters/RolesMaster";
import TeamMemberMaster from "../components/admin/masters/TeamMemberMaster";
import VendorMaster from "../components/admin/masters/VendorMaster";
import UnitTypeMaster from "../components/admin/masters/UnitTypeMaster";
import UserMaster from "../components/admin/masters/UserMaster";

// Transaction Routes
import Leads from "../components/admin/transactions/LeadsForm";
import LeadsTable from "../components/admin/transactions/LeadsTable";
// import LeadsTableBoot from "../components/admin/transactions/LeadsTableBoot";
import MaterialForm from "../components/admin/transactions/StockAvaliabilityForm";
import StockAvailabilityTable from "../components/admin/transactions/StockAvaliabilityTable";
import InventoryEntryForm from "../components/admin/transactions/InventoryEntryForm";
import InventoryEntryTable from "../components/admin/transactions/InventoryEntryTable";
import MaterialIssueTable from "../components/admin/transactions/MaterialIssueTable";
import MaterialIssueForm from "../components/admin/transactions/MaterialIssueForm";
import ExpenditureForm from "../components/admin/transactions/ExpenditureForm";
// import ExpenditureTable from "../components/admin/transactions/ExpenditureTable";
import ProjectreditsForm from "../components/admin/transactions/ProjectCreditsForm";
import ProjectCreditsTable from "../components/admin/transactions/ProjectCreditsTable";
import ProjectDebitForm from "../components/admin/transactions/ProjectDebitForm";
import ProjectDebitTable from "../components/admin/transactions/ProjectDebitTable";
import ExpenditureTable from "../components/admin/transactions/ExpenditureTable";
import CustomerPaymentsForm from "../components/admin/transactions/CustomerPaymentsForm";
import CustomerPaymentsTable from "../components/admin/transactions/CustomerPaymentsTable";

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

    <Route path="/transaction" element={<Transaction />} />
    <Route path="/forgotPassword" element={<ForgotPassword />} />

    {/* master routes */}
    <Route path="/blockMaster" element={<BlockMaster />} />
    <Route path="/builderMaster" element={<BuilderMaster />} />
    <Route path="/bankMaster" element={<BankMaster />} />
    <Route path="/customerMaster" element={<CustomerMaster />} />
    <Route path="/departmentMaster" element={<DepartmentMaster />} />
    <Route path="/employeeMaster" element={<EmployeeMaster />} />
    <Route path="/expenseCategoryMaster" element={<ExpenseCategoryMaster />} />
    <Route path="/fundPurpose" element={<FundPurpose />} />
    <Route path="/fundSource" element={<FundSource />} />
    <Route path="/leadsource" element={<LeadSource />} />
    <Route path="/leadStage" element={<LeadStage />} />
    <Route path="/lostReasons" element={<LostReason />} />
    <Route path="/materialMaster" element={<MaterialMaster />} />
    <Route path="/paymentModeMaster" element={<PaymentMode />} />
    <Route path="/paymentTypeMaster" element={<PaymentType />} />
    <Route path="/projectMaster" element={<ProjectMaster />} />
    <Route path="/rolesMaster" element={<RoleMaster />} />
    <Route path="/teamMembers" element={<TeamMemberMaster />} />
    <Route path="/unitType" element={<UnitTypeMaster />} />
    <Route path="/vendorMaster" element={<VendorMaster />} />
    <Route path="/userMaster" element={<UserMaster />} />

    {/* transaction */}


    <Route path="/leads" element={<Leads />} />
    <Route path="/leadsTable" element={<LeadsTable />} />
    {/* <Route path="/leadsTableBoot" element={<LeadsTableBoot />} /> */}
    <Route path="/stockAvailabilityForm" element={<MaterialForm/>} />
    <Route path="/stockAvailabilityTable" element={< StockAvailabilityTable/>} />
    <Route path="/inventoryEntryForm" element={<InventoryEntryForm/>}/>
    <Route path="/inventoryEntryTable" element={<InventoryEntryTable/>}/>
    <Route path="/materialIssueForm" element={<MaterialIssueForm/>}/>
    <Route path="/materialIssueTable" element={<MaterialIssueTable/>}/>
    <Route path="/expenditureForm" element={<ExpenditureForm/>}/>
    <Route path="/expenditureTable" element={<ExpenditureTable/>}/>
    <Route path="/projectCreditForm" element={<ProjectreditsForm/>}/>
    <Route path="/projectCreditTable" element={<ProjectCreditsTable/>}/>
    <Route path="/projectDebitForm" element={<ProjectDebitForm/>}/>
    <Route path="/projectDebitTable" element={<ProjectDebitTable/>}/>
    <Route path="/customerPaymentsForm" element={<CustomerPaymentsForm/>}/>
    <Route path="/customerPaymentsTable" element={<CustomerPaymentsTable/>}/>



    <Route path="*" element={<NotFound />} />

  </Routes>
);

export default AppRoutes;
