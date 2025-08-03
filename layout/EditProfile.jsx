import { postData } from '../api/api';
import { putData } from '../api/apiHandler';
import { config } from '../api/config';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import signupLogo from "/src/assets/auth/builderView.jpg";
import signup from "/src/assets/auth/signup.jpg";
import { useParams } from 'react-router-dom';

const EditProfile = () => {

    const navigate = useNavigate();
    const { userId } = useParams();
    const location = useLocation();
    const state = location.state || {};
    // const [userId, setUserId] = useState(null);

    const [fullname, setfullname] = useState("");
    const [mobilenumber, setmobilenumber] = useState("");
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [mode, setMode] = useState("create");

    const [allProjects, setAllProjects] = useState([]); // renamed for clarity
    const [projectId, setProjectId] = useState("");
    const [projectName, setProjectName] = useState("");

    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const [freezeTimer, setFreezeTimer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const otpRequestInProgress = useRef(false);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        let timer;
        if (otpSent && timeLeft > 0 && !otpVerified && !freezeTimer) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [otpSent, timeLeft, otpVerified, freezeTimer]);

    const resolvedUserId = state?.userData?.userId || userId;


    useEffect(() => {
        if (state.mode === "edit" && state.userData) {
            const {
                fullname,
                mobilenumber,
                email,
                profile,
                password,
                projectId,
                projectName
            } = state.userData;

            setfullname(fullname || '');
            setmobilenumber(mobilenumber || '');
            setEmail(email || '');
            setProfile(profile || '');
            setPassword(password || '');
            setConfirmPassword(password || '');
            setProjectId(projectId || '');
            setProjectName(projectName || '');
            setMode("edit");

            console.log("🟢 Loaded edit profile data:", { resolvedUserId });
        }
    }, [state]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetchData(config.getProject);
                setAllProjects(res.data || []);
            } catch (err) {
                console.error("Error fetching project", err);
            }
        };

        fetchProjects();
    }, []);

    console.log("userId from URL:", userId);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };
    const sendOtp = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email");
            return;
        }

        setIsOtpSending(true);
        setOtp("");
        setOtpSent(false);
        setOtpVerified(false);
        setTimeLeft(6 * 60);
        otpRequestInProgress.current = true;

        try {
            const response = await fetch(config.sendOtp, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data) {
                toast.success("OTP sent to your email");
                setOtpSent(true);
                setShowOtpModal(true);
            } else {
                toast.error(data?.message || "OTP send failed");
            }

        } catch (error) {
            console.error("OTP Send Error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsOtpSending(false);
            otpRequestInProgress.current = false;
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        setIsVerifying(true);

        try {
            const otpResponse = await postData(config.verifyOtp, { email, otp });

            if (!otpResponse?.success) {
                toast.error("Invalid or expired OTP");
                return;
            }

            toast.success("OTP Verified Successfully");
            setOtpVerified(true);
            setFreezeTimer(true);
            setShowOtpModal(false);

            // If in edit mode, update the profile after OTP is verified
            if (mode === "edit") {
                const resolvedUserId = state?.userData?.userId || userId;

                if (!resolvedUserId) {
                    toast.error("User ID not found. Cannot update profile.");
                    return;
                }

                const response = await putData(`${config.updateUsers}/${resolvedUserId}`, {
                    userId: resolvedUserId,
                    fullname,
                    mobilenumber,
                    email,
                    profile: state?.userData?.profile || profile,
                    project: Number(state?.userData?.projectId || projectId), // ✅ send under 'project'
                    password,
                });



                if (response.success) {
                    toast.success("Profile updated successfully! Redirecting to login...");
                    localStorage.removeItem('loginToken');
                    localStorage.removeItem('fullname');
                    localStorage.removeItem('profile');

                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);
                }

            }
            setOtpVerified(true);
            setFreezeTimer(true);

            navigate("/login");
            setShowOtpModal(false);
        } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = otp.split("");
        newOtp[index] = value;
        setOtp(newOtp.join(""));
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const moveToNextField = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <div className="d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="row">

                    <div className="col-lg-10 m-auto">

                        <div className="row g-0 shadow-lg rounded-4 overflow-huserIdden">

                            <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-dark">
                                <img src={signup} alt="Signup" className="img-fluuserId w-100 h-100 object-fit-cover" style={{ opacity: 0.8 }} />
                            </div>
                            <div className="col-lg-6 pt-4 pb-4 p-2 d-flex flex-column justify-content-center bg-light position-relative">

                                <div className=' text-center'>
                                    <img
                                        src={signupLogo}
                                        alt="logo"
                                        style={{ wuserIdth: '90px', height: '90px', borderRadius: '8px' }}
                                    />
                                </div>
                                <h3 className="text-center text-dark fw-bold mb-3">
                                    {mode === 'edit' ? 'Edit Profile' : 'Create Your Account'}
                                </h3>

                                <form >
                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">
                                            Full Name
                                        </div>
                                        <div className="col-lg-7 m-auto">
                                            <input className="form-control " value={fullname} onChange={(e) => setfullname(e.target.value)} required />
                                        </div>
                                    </div>



                                    <div className="row  mb-3">
                                        <div className="col-lg-4  m-auto ">
                                            Email Id
                                        </div>
                                        <div className="m-auto col-lg-7 ">
                                            <input className="form-control " value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="row mb-3 ">
                                        <div className="col-lg-4 m-auto">
                                            mobile Number
                                        </div>
                                        <div className="m-auto col-lg-7 ">
                                            <input className="form-control " value={mobilenumber} onChange={(e) => setmobilenumber(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="row mb-3 ">
                                        <div className="col-lg-4 m-auto">
                                            Profile
                                        </div>
                                        <div className="m-auto col-lg-7 ">
                                            <select
                                                className="form-select"
                                                value={profile}
                                                onChange={(e) => setProfile(e.target.value)}
                                                disabled={mode === "edit"} // ✅ disable in edit mode
                                                required
                                            >
                                                <option hidden value="">-- Select Role --</option>
                                                <option value="user">User</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Super Admin">Super Admin</option>
                                            </select>

                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">
                                            Project
                                        </div>
                                        <div className="col-lg-7 m-auto">
                                            {mode === "edit" ? (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={projectName}
                                                    disabled
                                                />
                                            ) : (
                                                <select
                                                    className="form-select"
                                                    value={projectId}
                                                    onChange={(e) => setProjectId(e.target.value)}
                                                    required
                                                >
                                                    <option hidden value="">-- Select Project --</option>
                                                    {allProjects.map((project) => (
                                                        <option key={project.id} value={project.id}>
                                                            {project.projectName}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">
                                            Password
                                        </div>
                                        <div className="col-lg-7 m-auto position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required={mode !== 'edit'}
                                            />

                                            <i
                                                className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} position-absolute`}
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ cursor: "pointer", right: "20px", top: "50%", transform: "translateY(-50%)", position: "absolute" }}
                                            ></i>
                                        </div>
                                    </div>



                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">
                                            Confirm Password
                                        </div>
                                        <div className="col-lg-7 m-auto position-relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="form-control "
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <i
                                                className={`pi ${showConfirmPassword ? "pi-eye-slash" : "pi-eye"} position-absolute`}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ cursor: "pointer", right: "20px", top: "50%", transform: "translateY(-50%)", position: "absolute" }}
                                            ></i>
                                        </div>
                                    </div>


                                    <div className="text-center col-10 m-auto">
                                        <button
                                            type="button"
                                            className='btn btn-primary w-100'
                                            onClick={sendOtp}

                                            disabled={isOtpSending}
                                        >
                                            {mode === 'edit'
                                                ? isOtpSending ? "Sending OTP..." : "Send OTP to Update"
                                                : isOtpSending ? "Sending OTP..." : "Sign Up"}

                                        </button>

                                    </div>
                                </form>

                                {/* <div className="text-center mt-3">
                                    <Link to="/login" className="text-decoration-none text-secondary fw-medium">Already have an account? <b className='text-primary ms-2'> Login </b></Link>
                                </div> */}
                                {error && <p className="text-danger text-center mt-3">{error}</p>}
                            </div>
                        </div>
                    </div>
                    <Dialog
                        visible={showOtpModal}
                        onHide={() => setShowOtpModal(false)}
                        header="Enter OTP"
                        modal
                        // style={{ width: "500px",  maxHeight: "280px" }}
                        footer={() => (
                            <div className="d-flex justify-content-end gap-3 ">
                                <Button
                                    label="Close"
                                    icon="pi pi-times"
                                    className="btn btn-dark btn-sm"
                                    onClick={() => setShowOtpModal(false)}

                                />
                                <Button
                                    label={isVerifying ? 'Verifying...' : 'Verify'}
                                    icon={isVerifying ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                                    size="small"
                                    className="btn btn-success btn-sm"
                                    onClick={() => verifyOtp(otp)}
                                    disabled={isVerifying || otp.length !== 6 || otp.split('').some(digit => !digit)}
                                />

                            </div>
                        )}
                    >
                        <div className="p-fluid text-center">
                            <div className="mb-3">
                                <label className="form-label">Enter OTP</label>
                                <div className="d-flex justify-content-center gap-2">
                                    {[...Array(6)].map((_, index) => (
                                        <InputText
                                            key={index}
                                            id={`otp-${index}`}  // Unique ID for each box
                                            value={otp[index] || ""}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => moveToNextField(index, e)} // Listen for backspace
                                            maxLength={1}
                                            className="p-inputtext text-center"
                                            style={{ width: "40px", height: "40px", fontSize: "18px" }}
                                        />

                                    ))}

                                </div>
                            </div>

                            <p className="text-danger">Time left: {formatTime(timeLeft)}</p>
                            {timeLeft === 0 && !otpVerified && (
                                <Button label="Resend OTP" className="p-button-primary w-100 mb-3 btn btn-primary btn-sm" onClick={sendOtp} />
                            )}
                        </div>
                    </Dialog>



                </div>
            </div >
        </div >
    );
};

export default EditProfile;
