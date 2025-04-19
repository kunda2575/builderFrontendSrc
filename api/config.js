 export const host = "https://buildrviewbackend.onrender.com";

export const config = {
  host: `${host}`,

  // AUTH
  login: `${host}/user/login`,
  register: `${host}/user/register`,
  forgotPassword: `${host}/user/forgot-password`,
  resetPassword: `${host}/user/reset-password`,
  sendOtp: `${host}/user/send-otp`,
  verifyOtp: `${host}/user/verify-otp`,
};
