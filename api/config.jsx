
// export const host = "https://buildrviewbackend.onrender.com";


export const host = "http://localhost:2026"

export const config = {
  host: `${host}`,

  // AUTH
  login: `${host}/user/login`,
  register: `${host}/user/register`,
  forgotPassword: `${host}/user/forgot-password`,
  resetPassword: `${host}/user/reset-password`,
  sendOtp: `${host}/user/send-otp`,
  verifyOtp: `${host}/user/verify-otp`,
  getUser: `${host}/user/getUser`,
  emailExist : `${host}/user/check-email`,
  
  updateUsers: `${host}/user/updateUser`,

  // LEADS
  getLeads: `${host}/api/leads`,
  getLeadStage: `${host}/api/leads/leadStage`,
  getLeadSource: `${host}/api/leads/leadSource`,
  createLead: `${host}/api/leads`,
  updateLead: (id) => `${host}/api/leads/${id}`,
  deleteLead: (id) => `${host}/api/leads/${id}`,
  getLeadById: (id) => `${host}/api/leads/${id}`,
  getTeamMember: `${host}/api/leads/teamMember`,

  // STOCK AVAILABILITY
  getStocks: `${host}/api/stocks`,
  getStockById: (id) => `${host}/api/stocks/${id}`,
  createStock: `${host}/api/stocks`,
  updateStock: (id) => `${host}/api/stocks/${id}`,
  deleteStock: (id) => `${host}/api/stocks/${id}`,
  getMaterialMaster_Stock: `${host}/api/stocks/materialMaster`,
  getUnitTypes_Stock: `${host}/api/stocks/unitTypes`,

  // INVENTORY ENTRY
  getInventories: `${host}/api/inventory`,
  getInventoriesById: (id) => `${host}/api/inventory/${id}`,               // GET all inventories
  getMaterial: `${host}/api/inventory/materialMaster`, // GET material master data
  getUnitType: `${host}/api/inventory/unitTypes`,    // GET unit types data
  getVendorName: `${host}/api/inventory/vendor`,        // GET vendor data
  createInventory: `${host}/api/inventory`,               // POST (create new inventory)
  updateInventory: (id) => `${host}/api/inventory/${id}`,  // PUT (update inventory by ID)
  deleteInventory: (id) => `${host}/api/inventory/${id}`,  // DELETE (delete inventory by ID)


  // Material Issue 
  getMaterialIsuues: `${host}/api/materialIssue`,                       // GET all with filters/pagination
  getMaterialIsuuesById: (id) => `${host}/api/materialIssue/${id}`,     // GET single material Issue by ID
  createMaterialIssue: `${host}/api/materialIssue`,                    // POST (create new material Issue)
  updateMaterialIssue: (id) => `${host}/api/materialIssue/${id}`,      // PUT (update material Issue by ID)
  deleteMaterialIssue: (id) => `${host}/api/materialIssue/${id}`,      // DELETE (delete material Issue by ID)

  material_Issue: `${host}/api/materialIssue/materialMaster`,        // GET material master data
  unitType_Issue: `${host}/api/materialIssue/unitTypes`,             // GET unit type data


  // Other unrelated endpoints should have their own unique names

};

