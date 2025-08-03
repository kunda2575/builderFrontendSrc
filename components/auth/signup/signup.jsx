import { postData } from '../../../api/api';
import { config } from '../../../api/config';
import './signup.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchData } from '../../../api/apiHandler';
import { updateUser } from '../../../api/updateApis/userMasterApi';
const Signup = ({ userToEdit, setUserToEdit, onCancelEdit, updateData }) => {
    const navigate = useNavigate();

    // Form Fields
    const [fullname, setfullname] = useState("");
    const [mobilenumber, setmobilenumber] = useState("");
    const [project, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Errors and UI
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch project list on mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetchData(config.getProject);
                setProjects(res.data);
            } catch (err) {
                console.error("Error fetching project", err);
            }
        };

        fetchProjects();
    }, []);

    // Populate form for edit
    useEffect(() => {
        if (userToEdit) {
            setfullname(userToEdit.fullname || "");
            setmobilenumber(userToEdit.mobilenumber || "");
            setEmail(userToEdit.email || "");
            setProfile(userToEdit.profile || "");

            // Ensure correct projectId is set
            const pid =
                userToEdit.projectId ||
                userToEdit.projects?.[0]?.UserProjects?.projectId ||
                userToEdit.projects?.[0]?.id ||
                "";

            setSelectedProjectId(pid.toString());
            setPassword(""); // Don't populate for security
            setConfirmPassword("");
        }
    }, [userToEdit]);

    const handleCancelEdit = () => {
        setUserToEdit(null); // This clears the form and exits edit mode
    };
const resetForm = () => {
  setfullname("");
  setmobilenumber("");
  setEmail("");
  setProfile("");
  setPassword("");
  setConfirmPassword("");
  setSelectedProjectId("");
  setError(null);
};

    const handleRegister = async () => {
        if (!fullname || !mobilenumber || !email || !password || !confirmPassword || !selectedProjectId || !profile) {
            toast.error("All fields are required!");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Invalid email format.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(mobilenumber)) {
            toast.error("Invalid mobile number.");
            return;
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            toast.error("Password must be strong.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true); // 🔄 Start spinner

            if (!userToEdit) {
                const checkRes = await fetch(`${config.emailExist}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const checkData = await checkRes.json();

                if (checkData.exists) {
                    toast.error(checkData.message || "Email already registered");
                    setLoading(false);
                    return;
                }

                const registeredData = await postData(config.register, {
                    fullname,
                    mobilenumber,
                    email,
                    profile,
                    password,
                    project: [Number(selectedProjectId)],
                });

                if (registeredData?.success) {
                    toast.success("Registered successfully");
                    resetForm();
                     updateData(); 
                } else {
                    setError(registeredData.error || "Registration failed");
                }
            } else {
                const updatedData = await updateUser(userToEdit.userId, {
                    fullname,
                    mobilenumber,
                    email,
                    profile,
                    password,
                    project: Number(selectedProjectId)
                });

                if (updatedData?.success) {
                    toast.success("User updated successfully");
                    setUserToEdit(null);
                    resetForm();
                     updateData(); 
                } else {
                    toast.error(updatedData?.message || "Update failed");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong during registration/update");
        } finally {
            setLoading(false); // ✅ Stop spinner
        }
    };


    return (
        <div className="d-flex align-items-center min-vh-100">
            <div className="container">
                <div className='mb-2'>
                    <Link className="text-decoration-none text-primary" to="/updateData">
                        <i className="pi pi-arrow-left"></i> Back
                    </Link>
                </div>
                <div className="row">
                    <div className="col-lg-6 m-auto">
                        <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="col-lg-12 pt-4 pb-4 p-2 d-flex flex-column justify-content-center bg-light position-relative">
                                <h3 className="text-center text-dark fw-bold mb-3">
                                    {userToEdit ? "Edit User" : "Create Your Account"}
                                </h3>

                                <form>
                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Full Name</div>
                                        <div className="col-lg-7 m-auto">
                                            <input className="form-control" value={fullname} onChange={(e) => setfullname(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Email Id</div>
                                        <div className="col-lg-7 m-auto">
                                            <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Mobile Number</div>
                                        <div className="col-lg-7 m-auto">
                                            <input className="form-control" value={mobilenumber} onChange={(e) => setmobilenumber(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Project</div>
                                        <div className="col-lg-7 m-auto">
                                            <select
                                                className="form-control"
                                                value={selectedProjectId}
                                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Project --</option>
                                                {project.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.projectName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Profile</div>
                                        <div className="col-lg-7 m-auto">
                                            <select
                                                className="form-select"
                                                value={profile}
                                                onChange={(e) => setProfile(e.target.value)}
                                                required
                                            >
                                                <option value="" hidden></option>
                                                <option value="user">User</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Password</div>
                                        <div className="col-lg-7 m-auto position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <i
                                                className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} position-absolute`}
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: "pointer", right: "20px", top: "50%", transform: "translateY(-50%)" }}
                                            ></i>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">Confirm Password</div>
                                        <div className="col-lg-7 m-auto position-relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <i
                                                className={`pi ${showConfirmPassword ? "pi-eye-slash" : "pi-eye"} position-absolute`}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ cursor: "pointer", right: "20px", top: "50%", transform: "translateY(-50%)" }}
                                            ></i>
                                        </div>
                                    </div>

                                    <div className="text-center col-10 m-auto">
                                        <button
                                            type="button"
                                            className="btn btn-primary w-100"
                                            onClick={handleRegister}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    {userToEdit ? "Updating..." : "Creating..."}
                                                </>
                                            ) : (
                                                userToEdit ? "Update User" : "Sign Up"
                                            )}
                                        </button>


                                        {userToEdit && (
                                            <>
                                                {/* Add your cancel handler here */}


                                                <button
                                                    type="button"
                                                    className="btn btn-secondary w-100 mt-2"
                                                    onClick={onCancelEdit}
                                                >
                                                    Cancel Edit
                                                </button>

                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>


                </div>
            </div >
        </div >
    );
};

export default Signup;
