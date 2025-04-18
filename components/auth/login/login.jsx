import './login.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../../../api/api';
import { config } from '../../../api/config';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

import loginimage from '/src/assets/auth/loginImage.jpg';
import logo from '/src/assets/auth/builderView.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ From context

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const loginHandler = async (e) => {
    e.preventDefault();
    setDisabled(true);
  
    try {
      const loginPayload = {
        email: identifier.includes("@") ? identifier : "",
        mobilenumber: /^\d+$/.test(identifier) ? identifier : "",
        username: !identifier.includes("@") && !/^\d+$/.test(identifier) ? identifier : "",
        password,
      };
  
      const userDetails = await postData(config.login, loginPayload);
      // console.log("🧪 Raw API Response:", userDetails);
  
      const token = userDetails?.token;
      const user = userDetails?.user;
      const success = userDetails?.success;
  
      if ((success === true || success === "Login successful") && token) {
        login(token);
        localStorage.setItem("fullname", user?.fullname || "User");
        localStorage.setItem("profile", user?.profile || "");
  
        toast.success(`Hi! ${user?.fullname || "User"}`, { autoClose: 3000 });
  
        setIdentifier("");
        setPassword("");
        navigate("/");
      } else {
        console.warn("❌ Login condition failed. Response:", userDetails);
        toast.error(userDetails?.message || "Invalid login details", { autoClose: 3000 });
      }
  
    } catch (err) {
      console.error("🚨 Login failed:", err);
      toast.error("Login Failed: " + (err?.message || "Something went wrong"), { autoClose: 3000 });
    } finally {
      setDisabled(false);
    }
  
    return false;
  };
      

  return (
    <div className="container min-vh-100 d-flex  align-items-center justify-content-center py-4">
      <div className="row shadow-lg rounded login-container d-flex flex-column flex-lg-row">

        {/* Left Section */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center p-4 bg-primary text-white login-left">
          <h2 className="fw-bold">Welcome Back!</h2>
          <p>Sign in to access your account</p>
          <img src={loginimage} alt="Login Illustration" className="img-fluid mt-3 login-image rounded" />
          <Link to="/" className="btn btn-light btn-sm mt-4">Go to Home</Link>
        </div>

        {/* Right Section - Login Form */}
        <div className="col-lg-6 d-flex flex-column justify-content-center bg-white p-4 login-right">
          <div className='text-center'>
            <img src={logo} alt="logo" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
          </div>

          <h4 className="text-center fw-bold">Login</h4>
          <p className="text-center text-muted mb-3">Enter your credentials to continue.</p>

          <form onSubmit={loginHandler} autoComplete="off">
            {/* Identifier Input */}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-0 border-bottom border-2 border-dark rounded-0 text-danger">
                  <i className="pi pi-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 border-bottom border-2 border-dark shadow-none rounded-0"
                  placeholder="Enter Email / Mobile / Username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-0 border-bottom border-2 border-dark rounded-0 text-dark">
                  <i className="pi pi-lock"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-0 border-bottom border-2 shadow-none border-dark rounded-0"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-white border-0 border-bottom border-2 border-dark rounded-0 text-dark"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"}`}></i>
                </span>
              </div>
            </div>

            {/* Login Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary btn-sm w-100" disabled={disabled}>
                {disabled ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Help Links */}
          <div className="text-center text-muted mt-4">
            <p>Forgot your password? <Link to="/forgotpassword" className="text-primary fw-bold">Reset it here</Link></p>
            <p>New here? <Link to="/signup" className="text-primary fw-bold">Create an account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
