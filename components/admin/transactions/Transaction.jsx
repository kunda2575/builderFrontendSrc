import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../auth/login/AuthContext'; // ✅ Import useAuth
import transactionImage from "../../../assets/auth/build.jpg"
const Transaction = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Get current user

  const allData = [
    { name: "Leads", path: "/leadsTable" },
    { name: "Stock Availabillity", path: "/stockAvailabilityTable" },
    { name: "Material Issue", path: "/materialIssueTable" },
    { name: "Inventory Entry", path: "/inventoryEntryTable" },
    { name: "Expenditure", path: "/expenditureTable" },
    { name: "Project Debits", path: "/projectDebitTable" },
    { name: "Project Credits", path: "/projectCreditTable" },
    { name: "Customer Payments", path: "/customerPaymentsTable" },
  ];

  // ✅ Filter "Project Credits" if admin
  const filteredData = user?.profile === "Admin"
    ? allData.filter(item => item.name !== "Project Credits")
    : allData;

  return (




   <div className="container-fluid  no-scroll py-5 px-3">
      <div className="row w-100 d-flex flex-column flex-lg-row">

        {/* <div className="col-lg-8"></div> */}
  <div className="col-lg-8 d-flex justify-content-center align-items-center mb-4 mt-5 mb-lg-0">
                  <img
                    src={transactionImage}
                    alt="Hero"
                    style={{ maxWidth: "100%", height: "60vh", objectFit: "contain" }}
                  />
                </div>
        <div className="col-lg-4 d-flex flex-column justify-content-center bg-white">


          <div className="container mt-4">
            <div className="card justify-content-center ">
              <div className="card-body rounded" style={{ boxShadow: '0px 0px 15px black' }}>
                <h2 className="mb-4 text-center text-primary">Transaction Data</h2>

                <div className="row">
                  {filteredData.map((item, index) => (
                    <div key={index} className="col-lg-6 mb-3">
                      <button
                        className="btn btn-success master-data rounded-0 w-100"
                        onClick={() => navigate(item.path)}
                      >
                        {item.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



  );
};

export default Transaction;
