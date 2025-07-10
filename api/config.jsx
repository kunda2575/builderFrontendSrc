
// export const host = "https://buildrviewbackend.onrender.com";    // server api


export const host = "http://localhost:2026"        // local api

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
  getLeads: `${host}/api/leads`,                           // GET all leads
  getLeadStage: `${host}/api/leads/leadStage`,                // GET lead stages
  getLeadSource: `${host}/api/leads/leadSource`,              // GET lead sources
  createLead: `${host}/api/leads`,                         // POST (create a new lead)
  updateLead: (id) => `${host}/api/leads/${id}`,           // PUT (update a lead by ID)
  deleteLead: (id) => `${host}/api/leads/${id}`,           // DELETE (delete a lead by ID)
  getLeadById: (id) => `${host}/api/leads/${id}`,     // GET single stock by ID
  // TEAM MEMBERS
  getTeamMember: `${host}/api/leads/teamMember`,         // GET  team members

  
  // Stock Availability
  getStocks: `${host}/api/stocks`,                       // GET all with filters/pagination
  getStockById: (id) => `${host}/api/stocks/${id}`,     // GET single stock by ID
  createStock: `${host}/api/stocks`,                    // POST (create new stock)
  updateStock: (id) => `${host}/api/stocks/${id}`,      // PUT (update stock by ID)
  deleteStock: (id) => `${host}/api/stocks/${id}`,      // DELETE (delete stock by ID)

  material: `${host}/api/stocks/materialMaster`,        // GET material master data
  unitType: `${host}/api/stocks/unitTypes`,             // GET unit type data


  // Inventory Entry
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



  
  
  // Expenditure CRUD
  getExpenditures:         `${host}/api/expenditure`,            // GET all (with filters/pagination)
  createExpenditure:       `${host}/api/expenditure`,            // POST
  updateExpenditure:       (id) => `${host}/api/expenditure/${id}`,// PUT
  deleteExpenditure:       (id) => `${host}/api/expenditure/${id}`,// DELETE
  
  // Master-data endpoints for dropdowns
  getVendorNameEx:           `${host}/api/expenditure/vendor`,
  getExpenseHeadEx:          `${host}/api/expenditure/expense`,
  getPaymentModeEx:          `${host}/api/expenditure/paymentMode`,
  getPaymentBankEx:          `${host}/api/expenditure/paymentBank`,
  getExpenditureById:      (id) => `${host}/api/expenditure/${id}`,// GET single
  

  

  // projectCredits

  getProjectCredits:         `${host}/api/projectCredit`,            // GET all (with filters/pagination)
  createProjectCredits:       `${host}/api/projectCredit`,            // POST
  updateProjectCredits:       (id) => `${host}/api/projectCredit/${id}`,// PUT
  deleteProjectCredits:       (id) => `${host}/api/projectCredit/${id}`,// DELETE
  
  // Master-data endpoints for dropdowns
  getSource:           `${host}/api/projectCredit/source`,
  getPurpose:          `${host}/api/projectCredit/purpose`,
  getPaymentModePc:          `${host}/api/projectCredit/paymentMode`,
  getDepositeBankPc:          `${host}/api/projectCredit/depositeBank`,
  
  getProjectCreditsById:      (id) => `${host}/api/projectCredit/${id}`,// GET single
  
  
  
  // ProjectDebit CRUD
  getProjectDebits:         `${host}/api/projectDebit`,            // GET all (with filters/pagination)
  createProjectDebit:       `${host}/api/projectDebit`,            // POST
  updateProjectDebit:       (id) => `${host}/api/projectDebit/${id}`,// PUT
  deleteProjectDebit:       (id) => `${host}/api/projectDebit/${id}`,// DELETE
  
  // Master-data endpoints for dropdowns
  getVendorNamePd:           `${host}/api/projectDebit/vendor`,
  getPayToPd:          `${host}/api/projectDebit/payTo`,
  getPaymentModePd:          `${host}/api/projectDebit/paymentMode`,
  getPaymentBankPd:          `${host}/api/projectDebit/paymentBank`,
  getProjectDebitById:      (id) => `${host}/api/projectDebit/${id}`,// GET single
  

  
  // CustomerPayment CRUD
  getCustomerPayments:         `${host}/api/customerPayments`,            // GET all (with filters/pagination)
  createCustomerPayment:       `${host}/api/customerPayments`,            // POST
  updateCustomerPayment:       (id) => `${host}/api/customerPayments/${id}`,// PUT
  deleteCustomerPayment:       (id) => `${host}/api/customerPayments/${id}`,// DELETE
  
  // Master-data endpoints for dropdowns
  getPaymentTypeCp:           `${host}/api/customerPayments/paymentType`,
  getVerifiedByCp:          `${host}/api/customerPayments/verifiedBy`,
  getPaymentModeCp:          `${host}/api/customerPayments/paymentMode`,
  getFundingBankCp:          `${host}/api/customerPayments/fundingBank`,
  getCustomerCp:          `${host}/api/customerPayments/customer`,
  getCustomerPaymentById:      (id) => `${host}/api/customerPayments/${id}`,// GET single
  


  // Other unrelated endpoints should have their own unique names

};

