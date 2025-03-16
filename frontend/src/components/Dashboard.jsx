import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = ({ setIsAuthenticated }) => {
  const [bills, setBills] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data.username);
      } catch (err) {
        setError("Failed to fetch current user");
        console.error(err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/bills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBills(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch bills");
      }
    };
    fetchBills();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const togglePaidStatus = async (billId) => {
    try {
      const bill = bills.find((b) => b._id === billId);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/bills/${billId}`,
        { isPaid: !bill.isPaid },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBills(bills.map((b) => (b._id === billId ? response.data : b)));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update bill");
    }
  };

  const calculateDebt = () => {
    if (!currentUser) return { youOwe: 0, youAreOwed: 0 };

    let totalOwed = 0;
    let totalOwe = 0;

    bills.forEach((bill) => {
      const splitAmount = bill.amount / bill.splitBetween.length;
      const isCurrentUserPaidBy = bill.paidBy.username === currentUser;
      const isCurrentUserInSplit = bill.splitBetween.some(
        (user) => user.username === currentUser
      );

      if (!bill.isPaid) {
        if (isCurrentUserPaidBy) {
          totalOwed +=
            splitAmount *
            (bill.splitBetween.length - (isCurrentUserInSplit ? 1 : 0));
        }
        if (isCurrentUserInSplit && !isCurrentUserPaidBy) {
          totalOwe += splitAmount;
        }
      }
    });

    return {
      youOwe: totalOwe,
      youAreOwed: totalOwed,
    };
  };

  const { youOwe, youAreOwed } = useMemo(calculateDebt, [bills, currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-600 via-cyan-800 to-navy-900 text-gray-800">
      <header className="bg-teal-800 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-full sm:max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold">BillBuddy</h1>
          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-4">
            <Link to="/add-bill" className="text-sm hover:underline">
              Add Bill
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm hover:underline"
            >
              Logout
            </button>
          </div>
          {/* Mobile Hamburger Menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            className="sm:hidden absolute top-16 right-4 bg-teal-700 text-white rounded-lg shadow-lg p-4 w-40 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              to="/add-bill"
              className="block py-2 text-sm hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Add Bill
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="block py-2 text-sm hover:underline w-full text-left"
            >
              Logout
            </button>
          </motion.div>
        )}
      </header>

      <main className="max-w-full sm:max-w-6xl mx-auto p-4 sm:p-6">
        {error && (
          <motion.p
            className="text-red-500 text-sm mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-green-100 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-green-800">You Are Owed</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">${youAreOwed.toFixed(2)}</p>
          </motion.div>
          <motion.div
            className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-base sm:text-lg font-semibold text-red-700">You Owe</h3>
            <p className="text-2xl sm:text-3xl font-bold text-red-600">${youOwe.toFixed(2)}</p>
          </motion.div>
        </motion.section>

        <motion.section
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Bill List</h2>

          {/* Table for larger screens */}
          <div className="hidden sm:block w-full overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 font-semibold">Description</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Paid By</th>
                  <th className="p-3 font-semibold">Split Between</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <motion.tr
                      key={bill._id}
                      className={`border-t hover:bg-gray-50 transition duration-200 ${
                        bill.isPaid ? "line-through text-gray-500" : ""
                      }`}
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="p-3 truncate">{bill.description}</td>
                      <td className="p-3 truncate">${bill.amount.toFixed(2)}</td>
                      <td className="p-3 truncate">{bill.paidBy?.username}</td>
                      <td className="p-3 truncate">
                        {bill.splitBetween.map((user) => user.username).join(", ")}
                      </td>
                      <td className="p-3 truncate">
                        {new Date(bill.date).toISOString().split("T")[0]}
                      </td>
                      <td className="p-3 truncate">{bill.isPaid ? "Paid" : "Pending"}</td>
                      <td className="p-3">
                        <motion.button
                          onClick={() => togglePaidStatus(bill._id)}
                          className={`px-2 py-1 rounded text-white text-sm ${
                            bill.isPaid
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {bill.isPaid ? "Undo" : "Mark Paid"}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card layout for mobile */}
          <div className="block sm:hidden space-y-4">
            {bills.length === 0 ? (
              <p className="text-center text-gray-500">No bills found.</p>
            ) : (
              bills.map((bill) => (
                <motion.div
                  key={bill._id}
                  className={`bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 ${
                    bill.isPaid ? "line-through text-gray-500" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col space-y-2">
                    <div>
                      <span className="font-semibold">Description: </span>
                      <span className="truncate">{bill.description}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Amount: </span>
                      <span>${bill.amount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Paid By: </span>
                      <span>{bill.paidBy?.username}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Split Between: </span>
                      <span className="truncate">
                        {bill.splitBetween.map((user) => user.username).join(", ")}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Date: </span>
                      <span>{new Date(bill.date).toISOString().split("T")[0]}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Status: </span>
                      <span>{bill.isPaid ? "Paid" : "Pending"}</span>
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        onClick={() => togglePaidStatus(bill._id)}
                        className={`px-2 py-1 rounded text-white text-sm ${
                          bill.isPaid
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {bill.isPaid ? "Undo" : "Mark Paid"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;