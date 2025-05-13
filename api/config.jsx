// export const host = "https://buildrviewbackend.onrender.com";
export const host = `http://localhost:2026`;

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
  getInventoryById: (id) => `${host}/api/inventory/${id}`,
  getMaterialMaster_Inventory: `${host}/api/inventory/materialMaster`,
  getUnitTypes_Inventory: `${host}/api/inventory/unitTypes`,
  getVendors_Inventory: `${host}/api/inventory/vendor`,
  createInventory: `${host}/api/inventory`,
  updateInventory: (id) => `${host}/api/inventory/${id}`,
  deleteInventory: (id) => `${host}/api/inventory/${id}`,

  // MATERIAL ISSUE
  getMaterialIssues: `${host}/api/materialIssue`,
  getMaterialIssueById: (id) => `${host}/api/materialIssue/${id}`,
  createMaterialIssue: `${host}/api/materialIssue`,
  updateMaterialIssue: (id) =>`${host}/api/materialIssue/${id}`,
  deleteMaterialIssue: (id) => `${host}/api/materialIssue/${id}`,
  getMaterialMaster_Issue: `${host}/api/materialIssue/materialMaster`,
  getUnitTypes_Issue: `${host}/api/materialIssue/unitTypes`,

  // EXPENDITURE
  getExpenditures: `${host}/api/expenditure`,                              // GET all with filters/pagination
  getExpenditureById: (id) => `${host}/api/expenditure/${id}`,            // GET single expenditure by ID
  createExpenditure: `${host}/api/expenditure`,                           // POST (create new expenditure)
  updateExpenditure: (id) => `${host}/api/expenditure/${id}`,             // PUT (update expenditure by ID)
  deleteExpenditure: (id) => `${host}/api/expenditure/${id}`,             // DELETE (delete expenditure by ID)
  getExpenditureCategories: `${host}/api/expenditure/categories`,         // GET expenditure category options
};
