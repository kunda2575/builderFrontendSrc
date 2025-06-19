import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth/login/AuthContext';
import homeImage from "../assets/auth/build.jpg"
import './home.css';

const Home = () => {
  const { user } = useAuth();

  console.log("The user is", user); // ✅ should show object with profile

  return (
       <div className="container-fluid  no-scroll py-5 px-3">
      <div className="row w-100 d-flex flex-column flex-lg-row">

        {/* <div className="col-lg-8"></div> */}
         <div className="col-lg-8 d-flex justify-content-center align-items-center mb-4 mt-5 mb-lg-0">
                  <img
                    src={homeImage}
                    alt="Home"
                    style={{ maxWidth: "100%", height: "60vh", objectFit: "contain" }}
                  />
                </div>

        <div className="col-lg-4 d-flex flex-column justify-content-center bg-white">

          {/* Only show Update Data for Admin or Super Admin */}
          {(user?.profile === 'Admin' || user?.profile === 'Super Admin') && (
            <Link to="/updateData">
              <button className="btn btn-success w-100">Update Data</button>
            </Link>
          )}

          {/* Always show Transaction Data */}
          {user?.profile && (
            <Link to="/transaction">
              <button className="btn btn-success w-100 mt-4">Transaction Data</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
