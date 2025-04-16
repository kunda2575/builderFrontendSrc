import React from 'react'
import { Link } from 'react-router-dom'

import loginimage from '/src/assets/auth/loginImage.jpg';

const Home = () => {

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div className="row shadow-lg rounded login-container d-flex flex-column flex-lg-row">

        {/* Left Section */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center text-center p-4 bg-primary text-white login-left">
          <h2 className="fw-bold">Welcome To Buildrview</h2>
          
          <img src={loginimage} alt="Login Illustration" className="img-fluid mt-3 login-image rounded" />
          <Link to="/" className="btn btn-light btn-sm mt-4">Go to Home</Link>
        </div>

        {/* Right Section - Login Form */}
        <div className="col-lg-6 d-flex flex-column justify-content-center bg-white p-4 login-right">
        <Link  to="/updateData"> <button className='btn btn-success w-100 mt-5'>  update data </button> </Link> 
        <Link  to="/transaction"> <button className='btn btn-success w-100 mt-5'>  Transaction data </button> </Link>
      </div>
      </div>
    </div>
  );



}

export default Home