import React from 'react'
import { Link } from 'react-router-dom'

import './home.css'

const Home = () => {

  return (
    <div className="container home d-flex align-items-center justify-content-center">
      <div className="row w-100 d-flex flex-column flex-lg-row">

        {/* Left Section */}
       <div className="col-lg-8">

       </div>
        {/* Right Section - Login Form */}
        <div className="col-lg-4 d-flex flex-column justify-content-center bg-white ">
        <Link  to="/updateData"> <button className='btn btn-success w-100 '>  Update Data </button> </Link> 
        <Link  to="/transaction"> <button className='btn btn-success w-100 mt-5'>  Transaction Data </button> </Link>
      </div>
      </div>
    </div>
  );



}

export default Home