import { postData } from '../../../api/api';
import { config } from '../../../api/config';
import './signup.css';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import signupLogo from "/src/assets/auth/builderView.jpg"

import signup from "/src/assets/auth/signup.jpg"

const Signup = () => {
    // Navigation
    const navigate = useNavigate();

    // Form Fields
    const [fullname, setfullname] = useState("")
    const [mobilenumber, setmobilenumber] = useState("");

    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // OTP Handling
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);

    // OTP Timer
    const [freezeTimer, setFreezeTimer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    // Errors
    const [error, setError] = useState(null);

    // UI Controls
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Ref to prevent multiple OTP requests
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

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };


const sendOtp = async () => {
    if (otpRequestInProgress.current) return;

    if (!fullname || !mobilenumber || !email || !password || !confirmPassword) {
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

    setIsOtpSending(true);
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setTimeLeft(6 * 60);
    otpRequestInProgress.current = true;

    try {
        const response = await fetch(config.sendOtp, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Backend already sends "Email already registered"
            throw new Error(data.error || "Failed to send OTP");
        }

        toast.success("OTP sent to your email");
        setOtpSent(true);
        setShowOtpModal(true);

    } catch (error) {
        console.error("OTP Send Error:", error);
        toast.error(error.message || "Something went wrong");
    } finally {
        setIsOtpSending(false);
        otpRequestInProgress.current = false;
    }
};

    // const debouncedSendOtp = debounce(sendOtp, 5000); // 2 seconds delay


    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        setIsVerifying(true); // ⛔ Disable the button & show spinner

        try {
            const otpResponse = await postData(config.verifyOtp, { email, otp });

            if (!otpResponse?.success) {
                toast.error("Invalid or expired OTP");
                return;
            }

            const registeredData = await postData(config.register, {
                fullname, mobilenumber, email, profile, password
            });

            if (registeredData?.success) {
                toast.success("Register successfully");
            } else {
                setError(registeredData.error);
            }

            setOtpVerified(true);
            setFreezeTimer(true);
            toast.success("Otp verified Successfully!");
            navigate("/login");
            setShowOtpModal(false);

        } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error("Something went wrong!");
        } finally {
            setIsVerifying(false); // ✅ Re-enable if retry is allowed (optional)
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; // Only allow digits

        const newOtp = otp.split(""); // Convert string to array
        newOtp[index] = value;
        setOtp(newOtp.join("")); // Convert back to string

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus(); // Move forward
        }
    };

    const moveToNextField = (index, event) => {
        if (event.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus(); // Move backward
        }
    };

    return (
        <div className="d-flex align-items-center min-vh-100">
            <div className="container">
                <div className="row">

                    <div className="col-lg-10 m-auto">

                        <div className="row g-0 shadow-lg rounded-4 overflow-hidden">

                            <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-dark">
                                <img src={signup} alt="Signup" className="img-fluid w-100 h-100 object-fit-cover" style={{ opacity: 0.8 }} />
                            </div>
                            <div className="col-lg-6 pt-4 pb-4 p-2 d-flex flex-column justify-content-center bg-light position-relative">

                                <div className=' text-center'>
                                    <img
                                        src={signupLogo}
                                        alt="logo"
                                        style={{ width: '90px', height: '90px', borderRadius: '8px' }}
                                    />
                                </div>

                                <h3 className="text-center text-dark fw-bold mb-3">Create Your Account</h3>
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
                                                required
                                            >
                                                <option value="" disabled hidden></option>
                                                <option value="user">User</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Super Admin">Super Admin</option>

                                            </select>
                                        </div>
                                    </div>


                                    <div className="row mb-3">
                                        <div className="col-lg-4 m-auto">
                                            Password
                                        </div>
                                        <div className="col-lg-7 m-auto position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control "
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
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
                                            {isOtpSending ? "Sending OTP..." : "Sign Up"}
                                        </button>

                                    </div>
                                </form>

                                <div className="text-center mt-3">
                                    <Link to="/login" className="text-decoration-none text-secondary fw-medium">Already have an account? <b className='text-primary ms-2'> Login </b></Link>
                                </div>
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

export default Signup;
