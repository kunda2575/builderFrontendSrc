import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Avatar } from 'primereact/avatar';

import logo from "/src/assets/auth/build.jpg";
import { config } from "../api/config";
import { fetchData } from "../api/apiHandler";

import "./nav.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const loginToken = localStorage.getItem('loginToken');
  const fullname = localStorage.getItem('fullname');

  const fetchUser = async () => {
    try {
      const res = await fetchData(config.getUser);
      console.log("User fetched:", res.data);
      setUser(res.data.user); // ✅ nested user object
    } catch (error) {
      toast.error("Failed to fetch user details.");
      console.error("Fetch user error:", error);
    }
  };

  useEffect(() => {
    if (loginToken) {
      fetchUser();
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('loginToken');
    localStorage.removeItem('fullname');
    localStorage.removeItem('profile');

    localStorage.removeItem('selectedProject');
    toast.success('Logout Successfully!');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark shadow-sm sticky-top" style={{ backgroundColor: 'black' }}>
      <div className="container-fluid">
        <img
          src={logo}
          alt="logo"
          style={{ width: '50px', height: '50px', borderRadius: '8px' }}
          className='me-2'
        />
        <Link to="/" className="navbar-brand fs-4 text-white">BUILDRVIEW</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mynavbar">
          <ul className="navbar-nav ms-auto align-items-end">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white fw-semibold">Home</Link>
            </li>

            {/* Profile Dropdown */}
            <li className="nav-item dropdown ms-3">

              <button
                className="btn nav-link dropdown-toggle d-flex align-items-center gap-2 text-white"
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
                {user?.username && (
                  <li className="dropdown-item text-muted">
                    <strong>User Name: {user.username}</strong>
                  </li>
                )}
                {user?.email && (
                  <li className="dropdown-item text-muted">
                    Email: {user.email}
                  </li>
                )}
                {user?.profile && (
                  <li className="dropdown-item text-muted">
                    Profile: {user.profile}
                  </li>
                )}
                {user?.projects?.length > 0 && (
                  <li className="dropdown-item text-muted">
                    Project: {user.projects[0]?.projectName}
                  </li>
                )}

                {/* {user?.password && (
                  <li className="dropdown-item text-muted">
                    Password: {user.password}
                  </li>
                )} */}

                <li><hr className="dropdown-divider" /></li>

                {/* ✅ Conditional Edit Profile link to avoid crash */}
                {user && (
                  <Link
                    to={`/edit-profile/${user.userId}`}
                    state={{
                      mode: "edit",
                      userData: {
                        fullname: user.fullname,
                        mobilenumber: user.mobilenumber,
                        email: user.email,
                        profile: user.profile,
                        // password: user.password,
                        projectId: user.projects?.[0]?.UserProjects?.projectId || "",
                        projectName: user.projects?.[0]?.projectName || "",
                        userId: user.userId
                      }
                    }}
                     style={{ textDecoration: "none" }} // 👈 removes underline from Link
                  >

                    <i className="pi pi-user-edit me-2"></i> Edit Profile
                  </Link>
                )}

                {/* Sign Out Button */}
                {loginToken && (
                  <li>
                    <button className="dropdown-item" onClick={signOut}>
                      <i className="pi pi-sign-out me-2"></i> Sign Out
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
