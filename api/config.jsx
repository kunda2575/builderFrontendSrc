
// export const host = "https://buildrviewbackend.onrender.com";


export const host ="http://localhost:2026"

export const config = {
  host: `${host}`,

  // AUTH
  login: `${host}/user/login`,
  register: `${host}/user/register`,
  forgotPassword: `${host}/user/forgot-password`,
  resetPassword: `${host}/user/reset-password`,
  sendOtp: `${host}/user/send-otp`,
  verifyOtp: `${host}/user/verify-otp`,

  // LEADS
  getLeads: `${host}/api/leads`,
  leadStage: `${host}/api/leads/leadStage`,
  leadSource: `${host}/api/leads/leadSource`,
  // TEAM MEMBERS
  teamMember: `${host}/api/leads/teamMember`,

  // stockAvaliblity 

  getStocks :`${host}/api/stocks`,
  material:`${host}/api/stocks/materialMaster`,
  unitType : `${host}/api/stocks/unitTypes`,
  create :`${host}/api/stocks`,



  // Inventory Entry
  getInventories: `${host}/api/inventory`,
  inventoryMaterial: `${host}/api/inventory/materialMaster`, // renamed from "material"
  inventoryUnitType: `${host}/api/inventory/unitTypes`,      // renamed from "unitType"
  inventoryVendor: `${host}/api/inventory/vendor`,
  createInventory: `${host}/api/inventory`,                  // renamed from "create"

  // Other unrelated endpoints should have their own unique names

};

