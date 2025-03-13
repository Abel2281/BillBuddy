import React, { useState } from "react";
import axios from "axios";
import {motion} from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Still prevents page reload
    // try {
    //   const response = await axios.post("http://localhost:5000/api/auth/login", {
    //     username,
    //     password,
    //   });
    //   // Assuming the API returns a token
    //   localStorage.setItem("token", response.data.token); // Store JWT
    //   console.log("Login successful:", response.data);
    //   // Redirect to dashboard or another page
    //   window.location.href = "/dashboard";
    // } catch (err) {
    //   console.error("Login failed:", err);
    //   setError("Invalid username or password"); // Display error to user
    // }
    if (username === "test" && password === "1234") {
        localStorage.setItem("token", "dummy-token-123"); 
        console.log("Login successful");
        window.location.href = "/dashboard"; 
      } else{
        setError("Invalid username or password");
        console.error("Login failed: Invalid credentials");
      }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-950">
      <motion.div 
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all hover:scale-105 hover:shadow-2xl hover:-translate-y-1 "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2 
            className="text-3xl font-bold text-center text-gray-800 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to BillBuddy
        </motion.h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <motion.input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-indigo-400"
              placeholder="Enter your username"
              required
              whileHover={{ scale: 1.02 }}
              transition={{  duration: 0.2 }}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 hover:border-indigo-400"
              placeholder="Enter your password"
              required
              whileHover={{ scale: 1.02 }}
              transition={{  duration: 0.2 }}
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Login
          </motion.button>

          <div className="mt-4 text-center">
            <motion.p 
                className="text-sm text-gray-600"   
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
              Don't have an account?{" "}
              <a href="/register" className="text-indigo-600 font-medium hover:underline">
                Register
              </a>
            </motion.p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;