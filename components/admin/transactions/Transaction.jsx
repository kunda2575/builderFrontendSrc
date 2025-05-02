import React from 'react'
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const navigate = useNavigate();


  const allData = [
    { name: "Leads ", path: "/leadsTable" },
    { name: "Stock Availabillity ", path: "/stockAvailability" },
    { name: "Expenditure ", path: "/expenditure" },
    { name: "Inventory Entry ", path: "/inventoryEntry" },
    { name: "Material issue ", path: "/materialIssue" },
    { name: "Project Debits ", path: "/projectDebits" },
    { name: "Project Credits ", path: "/projectCredits" },
    { name: "Project Schedule ", path: "/projectSchedule" },
    { name: "Customer Payments ", path: "/customerPayments" },
    { name: "Data Master ", path: "/dataMaster" },
   

  ];


  return (
    <div className="container mt-4">
      <div className="card justify-content-center w-50 m-auto">
        <div className="card-body rounded" style={{boxShadow : '0px 0px 15px black'}}>

          <h2 className="mb-4 text-center text-primary"> Transaction Data</h2>

          <div className="row">
            {
              allData.map((item, index) => {         

                return (
                  <div key={index} className="col-lg-6 mb-3">

                    <button
                      className="btn btn-success master-data rounded-0 w-100"
                      onClick={() => navigate(item.path)}
                    >
                      {item.name}
                    </button>

                  </div>)
              })
            }
          </div>
        </div>
      </div>

    </div>

  )};
export default Transaction
