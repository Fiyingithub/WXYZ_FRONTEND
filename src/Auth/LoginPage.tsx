import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../Loaders/ToastContext";
import WaitingLoader from "../Loaders/WaitingLoader";

import loginImage from "../Asset/images/loginImage.jpg";
import logo from "../Asset/images/wxyz_logo.svg";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const LoginPage = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError, startWaitingLoader, stopWaitingLoader } =
    useToast();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    startWaitingLoader();

    try {
      const res = await axios.post(
        "https://oneworld-fq81.onrender.com/api/User/Login",
        formData,
      );
      notifySuccess(res.data.responseMessage);
      sessionStorage.setItem("user", JSON.stringify(res.data.data));
      navigate("/admin/dashboard");
      stopWaitingLoader();
    } catch (err) {
      console.log(err.response.data);
      stopWaitingLoader();
      notifyError(err.response.data.responseMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-500 to-[orange] ">
      <WaitingLoader />
      <div className="w-full max-w-4xl bg-white rounded-lg lg:shadow-lg overflow-hidden flex">
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 bg-gray-800 items-center justify-center">
          <div>
            <img
              src={loginImage}
              alt="Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center justify-center mb-6">
              <img src={logo} alt="logo" className="w-16" />
              <h2 className="text-xl font-bold text-gray-800 ">
                Welcome back!
              </h2>
              <p className="text-xs text-gray-800">Please enter your details</p>
            </div>

            <form action="submit" onSubmit={handleLogin}>
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
                  name="email"
                  autoComplete="email"
                  className="mt-1 block w-full px-4 py-2 bg-gray-50 border-b border-orange-100 outline-none sm:text-sm text-gray-800 "
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
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
                    autoComplete="current-password"
                    className="mt-1 block w-full px-4 py-2 bg-gray-50 border-b border-orange-100 sm:text-sm outline-none text-gray-800"
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
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-800"
                  >
                    Remember for 30 days
                  </label>
                </div>
                <Link
                  to="#"
                  className="text-sm text-orange-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-[#e74c3c] text-white py-2 px-4 rounded-lg hover:bg-[#ce6233] transition-all duration-400 cursor-pointer font-semibold"
              >
                Log In
              </button>
            </form>

            <p className="mt-6 text-sm text-center text-gray-800">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 hover:underline font-medium "
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
