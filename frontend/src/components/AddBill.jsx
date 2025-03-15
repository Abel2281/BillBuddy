import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const AddBill = ({ setIsAuthenticated }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [participants, setParticipants] = useState([]);
  const [debtUpdate, setDebtUpdate] = useState({ youOwe: 0, youAreOwed: 0 });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let currentUser = "You"; // Fallback value
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUser = decoded.username; 
    } catch (err) {
      console.error("Invalid token:", err);
      setError("Invalid authentication token");
    }
  }

  // Fetch available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableUsers(response.data.map(user => user.username));
        if (response.data.length > 0) setPaidBy(response.data[0].username);
      } catch (err) {
        setError("Failed to fetch users");
        console.error(err);
        setAvailableUsers(["You", "Alice", "Bob", "Charlie"]);
        setPaidBy("You");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    updateDebt(participants);
  }, [amount, paidBy, participants]);

  const handleParticipantChange = (user) => {
    const updatedParticipants = participants.includes(user)
      ? participants.filter((p) => p !== user)
      : [...participants, user];
    setParticipants(updatedParticipants);
  };

  const updateDebt = (selectedParticipants) => {
    if (!amount || !paidBy || selectedParticipants.length === 0) {
      setDebtUpdate({ youOwe: 0, youAreOwed: 0 });
      return;
    }
    const splitAmount = parseFloat(amount) / selectedParticipants.length;
    let youOwe = 0;
    let youAreOwed = 0;

    if (paidBy === currentUser) {
      youAreOwed = splitAmount * (selectedParticipants.length - (selectedParticipants.includes(currentUser) ? 1 : 0));
    } else if (selectedParticipants.includes(currentUser)) {
      youOwe = splitAmount;
    }

    setDebtUpdate({ youOwe, youAreOwed });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/bills",
        {
          description,
          amount: parseFloat(amount),
          paidByUsername: paidBy,
          splitBetweenUsernames: participants,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add bill");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-600 via-cyan-800 to-navy-900 text-gray-800">
      <header className="bg-teal-800 text-white p-4 shadow-md sticky top-0">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">BillBuddy</h1>
          <div>
            <Link to="/dashboard" className="mr-4 text-sm hover:underline">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="text-sm hover:underline">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <motion.p
            className="text-red-500 text-sm mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        <motion.section
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add a New Bill</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                  placeholder="e.g., Dinner"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                  placeholder="e.g., 50.00"
                  step="0.01"
                  required
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Paid By
                </label>
                <select
                  id="paidBy"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                  required
                >
                  <option value="" disabled>Select payer</option>
                  {availableUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <label key={user} className="flex items-center">
                      <input
                        type="checkbox"
                        value={user}
                        checked={participants.includes(user)}
                        onChange={() => handleParticipantChange(user)}
                        className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      {user}
                    </label>
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-800">You Owe</h3>
                <p className="text-lg text-blue-600">${debtUpdate.youOwe.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-green-800">You Are Owed</h3>
                <p className="text-lg text-green-600">${debtUpdate.youAreOwed.toFixed(2)}</p>
              </div>
            </motion.div>
            <div className="flex justify-center">
              <motion.button
                type="submit"
                className="w-1/2 bg-indigo-600 text-white p-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Bill
              </motion.button>
            </div>
          </form>
        </motion.section>
      </main>
    </div>
  );
};

export default AddBill;