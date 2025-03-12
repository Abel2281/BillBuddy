import React, { useState } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("You");
  const [participants, setParticipants] = useState("");

  const handleAddBill = (e) => {
    e.preventDefault();
    const newBill = { description, amount, paidBy, participants: participants.split(",") };
    setBills([...bills, newBill]);
    setDescription("");
    setAmount("");
    setParticipants("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-600 via-cyan-800 to-navy-900 text-gray-800">
      <header className="bg-teal-800 text-white p-4 shadow-md sticky top-0">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">BillBuddy</h1>
          <div>
            <span className="mr-4">Welcome, User</span>
            <button onClick={handleLogout} className="text-sm hover:underline">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-green-100 p-4 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-lg font-semibold">You Are Owed</h3>
            <p className="text-2xl">$50.00</p>
          </motion.div>
          <motion.div
            className="bg-red-100 p-4 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-lg font-semibold">You Owe</h3>
            <p className="text-2xl">$20.00</p>
          </motion.div>
          <motion.div
            className="bg-blue-100 p-4 rounded-lg shadow hover:shadow-xl hover:-translate-y-1 transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-lg font-semibold">Net Balance</h3>
            <p className="text-2xl">+$30.00</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow mb-6 hover:shadow-xl transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{  duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Add a New Bill</h2>
          <form onSubmit={handleAddBill}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                required
                whileHover={{ scale: 1.02 }}
              />
              <motion.input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                required
                whileHover={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                placeholder="Paid By"
                className="p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                required
                whileHover={{ scale: 1.02 }}
              />
              <motion.input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Participants (comma-separated)"
                className="p-3 border rounded-lg hover:border-indigo-400 transition duration-200"
                required
                whileHover={{ scale: 1.02 }}
              />
            </div>
            <div className="flex justify-center mt-4">
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
        </motion.div>

        {/* Bill List */}
        <motion.div
          className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Your Bills</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Paid By</th>
                <th className="p-3">Participants</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <motion.tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="p-3">{bill.description}</td>
                  <td className="p-3">${bill.amount}</td>
                  <td className="p-3">{bill.paidBy}</td>
                  <td className="p-3">{bill.participants.join(", ")}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;