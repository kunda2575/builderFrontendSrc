
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

// inventory Entry
getInventories : `${host}/api/inventory`,
material:`${host}/api/inventory/materialMaster`,
unitType : `${host}/api/inventory/unitTypes`,
vendor : `${host}/api/inventory/vendor`,
create :`${host}/api/inventory`,

};

