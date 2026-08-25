import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../Loaders/ToastContext";
import WaitingLoader from "../Loaders/WaitingLoader";
import "react-toastify/dist/ReactToastify.css";
import signupImage from "../Asset/images/signupImage.jpg";
import { authService } from "../services/Admin/authService";
import { handleApiError } from "../utils/handleApiError";
import { toast } from "react-toastify";

const SignupPage = () => {
  const navigate = useNavigate();
  const { notifySuccess, startWaitingLoader, stopWaitingLoader } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Input validation handlers
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    // Validate all fields before submit
    const validEmail = validateEmail(formData.email);
    const validPassword = validatePassword(formData.password);
    if (!validEmail || !validPassword) return;
    startWaitingLoader();

    try {
      const res = await authService.create(formData);
      if (res.status === 201) {
        stopWaitingLoader();
        notifySuccess(res.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(handleApiError(error));
      stopWaitingLoader();
      // notifyError(error.response.data.responseMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-500 to-[orange] ">
      <WaitingLoader />
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-row-reverse">
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center">
          <div className="w-full h-full">
            <img
              src={signupImage}
              alt="Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Create an account
            </h2>
            <p className="text-sm text-gray-800 mb-6">
              Start your shopping adventure with us!
            </p>

            <form action="submit" onSubmit={handleSignup}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-800"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  autoComplete="username"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border-b border-orange-100 outline-none sm:text-sm text-gray-800 "
                  placeholder="Enter your Username"
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-800"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  autoComplete="email"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border-b border-orange-100 outline-none sm:text-sm text-gray-800 "
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border-b border-orange-100 outline-none sm:text-sm text-gray-800"
                    placeholder="Enter your password"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full bg-[#e74c3c] text-white py-2 px-4 rounded-lg hover:bg-[#ce6233] transition-all duration-400 cursor-pointer font-semibold"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <p className="mt-6 text-sm text-center text-gray-800">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-orange-500 hover:underline font-medium "
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
