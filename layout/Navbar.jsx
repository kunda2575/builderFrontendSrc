import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Avatar } from 'primereact/avatar';

import logo from "/src/assets/auth/build.jpg"



import "./nav.css"

const Navbar = () => {
  const navigate = useNavigate();
  const loginToken = localStorage.getItem('loginToken');
  const fullname = localStorage.getItem('fullname');
  const profile = localStorage.getItem('profile');

  const [property, setProperty] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setProperty({ id: '123' });
    }, 1000);
  }, []);

  const signOut = () => {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('fullname');
    localStorage.removeItem('profile');
    toast.success('Logout Successfully!');
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-sm navbar-dark  shadow-sm sticky-top"
      style={{ backgroundColor: 'black' }} // Light Blue
    >
      <div className="container-fluid">
        <div className=''>
          <img
            src={logo}
            alt="logo"
            style={{ width: '50px', height: '50px', borderRadius: '8px', verticalAlign: 'center' }}
            className='me-2'
          />
        </div>
        <Link to="/" className="navbar-brand fs-4 text-white">
          BUILDRVIEW
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav ms-auto align-items-end">
           <li className="nav-item ">
              <Link to="/" className="nav-link text-dark fw-semibold ">
                Home
              </Link>
            </li>
 


            {/* Avatar Profile Dropdown */}
            <li className="nav-item dropdown ms-3">
              <div className="dropdown">
                <button
                  className="btn  nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Avatar
                    label={fullname ? fullname.charAt(0).toUpperCase() : 'P'}
                    size="small"
                    shape="circle"
                    style={{ backgroundColor: '#0d6efd', color: '#fff' }}
                  />
                  <span className="fw-semibold">{fullname || 'Profile'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  {loginToken && (
                    <li>
                      <button className="dropdown-item " onClick={signOut}>
                        <i className="pi pi-sign-out me-2"></i> Sign Out
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
