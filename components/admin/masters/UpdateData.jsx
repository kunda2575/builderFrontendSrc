import { useState } from "react";
import { useNavigate } from "react-router-dom";


const UpdateData = () => {
  const navigate = useNavigate();


  const allData = [
    { name: "Lead Stage", path: "/leadStage" },
    { name: "Lead Source", path: "/leadsource" },
    { name: "Team Members", path: "/teamMembers" },
    { name: "Vendor Master", path: "/vendorMaster" },
    { name: "Material Master", path: "/materialMaster" },
    { name: "Customer Master", path: "/customerMaster" },
    { name: "User Master", path: "/userMaster" },
    { name: "Roles Master", path: "/rolesMaster" },
    { name: "Builder Master", path: "/builderMaster" },
    { name: "Project Master", path: "/projectMaster" },
    { name: "Block Master", path: "/blockMaster" },
    { name: "Payment Mode Master", path: "/paymentModeMaster" },
    { name: "Payment Type Master", path: "/paymentTypeMaster" },
    { name: "Unit Type", path: "/unitType" },
    { name: "Employee Master", path: "/employeeMaster" },
    { name: "Expense Category Master", path: "/expenseCategoryMaster" },
    { name: "Department Master", path: "/departmentMaster" },
    { name: "Lost Reasons", path: "/lostReasons" },
    { name: "Bank Master", path: "/bankMaster" },
    { name: "Fund Source", path: "/fundSource" },
    { name: "Fund Purpose", path: "/fundPurpose" }

  ];


  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body rounded" style={{boxShadow : '0px 0px 15px black'}}>

          <h2 className="mb-4 text-center text-primary"> Masters Data </h2>

          <div className="row justify-content-center">
            {
              allData.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => {

                return (
                  <div key={index} className="col-lg-4 mb-3">

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

  );
};

export default UpdateData;