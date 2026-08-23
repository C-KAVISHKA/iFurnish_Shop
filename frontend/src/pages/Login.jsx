import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import login from "../assets/login.jpg";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const { navigate, backendUrl, setToken, getUserCart } = useContext(ShopContext);
  // States: "Login" | "Sign Up"
  const [currState, setCurrState] = useState("Login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currState === "Sign Up") {
        const res = await fetch(`${backendUrl}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Registration Successful! Please sign in.");
          setCurrState("Login");
          setName("");
          setEmail("");
          setPassword("");
        } else {
          toast.error(data.message);
        }
      } else {
        const res = await fetch(`${backendUrl}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Login Successful");
          setToken(data.token);
          localStorage.setItem("token", data.token);
          if (getUserCart) {
            getUserCart(data.token);
          }
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Could not connect to server. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    toast.info("Please contact support to reset your password.");
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="fixed inset-0 w-full h-full z-50 bg-white overflow-y-auto">
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100/90 hover:bg-gray-200 text-gray-700 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 z-10 text-xs sm:text-sm"
      >
        <FaArrowLeft className="text-xs" />
        <span>
          Back to <span className="font-bold text-gray-900">iFurnish</span>
          <span className="font-bold text-secondary">Shop</span>
        </span>
      </button>
      <div className="flex min-h-full w-full">
        <div className="w-1/2 hidden md:block">
          <img src={login} alt="logo" className="object-cover w-full h-full min-h-screen" />
        </div>
        <div className="flex w-full md:w-1/2 items-center justify-center p-6 py-20 my-auto">
          <form
            onSubmit={onSubmitHandler}
            className="flex flex-col items-center w-full max-w-sm m-auto gap-y-4"
          >
            <div className="w-full mb-2 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">{currState}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {currState === "Login" ? "Welcome back! Please enter your details." : "Create your account to start shopping."}
              </p>
            </div>
            {currState === "Sign Up" && (
              <div className="w-full">
                <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-2.5 ring-1 ring-slate-900/10 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none text-xs sm:text-sm transition-all"
                  required
                />
              </div>
            )}
            <div className="w-full">
              <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                placeholder="Email Address"
                className="w-full px-4 py-2.5 ring-1 ring-slate-900/10 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none text-xs sm:text-sm transition-all"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-2.5 ring-1 ring-slate-900/10 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-secondary outline-none text-xs sm:text-sm transition-all"
                required
              />
            </div>
            <div className="w-full flex justify-between text-xs text-gray-500 mt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="hover:text-secondary underline"
              >
                Forgot your password?
              </button>
            </div>
            <button
              type="submit"
              className="btn-secondary w-full !py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all mt-2"
            >
              {currState === "Login" ? "Sign In" : "Create Account"}
            </button>
            <div className="w-full text-center text-xs text-gray-500 mt-2">
              {currState === "Login" ? (
                <p>
                  Don't have an account?{" "}
                  <span
                    onClick={() => setCurrState("Sign Up")}
                    className="text-secondary font-bold cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => setCurrState("Login")}
                    className="text-secondary font-bold cursor-pointer hover:underline"
                  >
                    Sign In
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
