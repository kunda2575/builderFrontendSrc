import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/login/AuthContext";
import updateDataImage from "../../../assets/auth/build.jpg"
const UpdateData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const allData = [
    { name: "Lead Stage", path: "/leadStage" },
    { name: "Lead Source", path: "/leadsource" },
    { name: "Team Members", path: "/teamMembers" },
    { name: "Vendor Master", path: "/vendorMaster" },
    { name: "Material Master", path: "/materialMaster" },
    { name: "Customer Master", path: "/customerMaster" },
    { name: "User Master", path: "/userMaster" },
    { name: "Roles Master", path: "/rolesMaster" },
    // { name: "Builder Master", path: "/builderMaster" },
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
    { name: "Fund Purpose", path: "/fundPurpose" },
    { name: "Documents Upload", path: "/documents" },
  ];

  const filteredData =
    user?.profile === "Admin"
      ? allData.filter(
          (item) =>
            !["Builder Master","Bank Master","Block Master", "User Master","Roles Master","Fund Purpose", "Project Master","Fund Source"].includes(item.name)
        )
      : allData;

  return (
    <div className="container-fluid  no-scroll py-5 px-3">
      <div className="row w-100 d-flex flex-column flex-lg-row">
        {/* <div className="col-lg-7"></div> */}
        {/* ✅ Image section */}
        <div className="col-lg-7 d-flex justify-content-center align-items-center mb-4 mt-5 mb-lg-0">
          <img
            src={updateDataImage}
            alt="Hero"
            style={{ maxWidth: "100%", height: "60vh", objectFit: "contain" }}
          />
        </div>

        <div className="col-lg-5 d-flex flex-column justify-content-center bg-white">
          <div className="card">
            <div className="card-body rounded" style={{ boxShadow: "0px 0px 15px black" }}>
              <h2 className="mb-4 text-center text-primary">Masters Data</h2>

              {/* ✅ Scrollable section */}
              <div
                className="row justify-content-center"
                style={{ maxHeight: "60vh", overflowY: "auto" }}
              >
                {filteredData
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item, index) => (
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
  );
};

export default UpdateData;
