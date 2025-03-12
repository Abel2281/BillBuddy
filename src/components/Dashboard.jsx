import React, { useState } from "react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [bills, setBills] = useState([
    { id: 1, description: "Dinner", amount: 60, paidBy: "You", splitBetween: ["Alice", "Bob"], date: "2025-03-10" },
    { id: 2, description: "Rent", amount: 1200, paidBy: "Alice", splitBetween: ["You", "Bob"], date: "2025-03-01" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Dummy debt calculation (replace with real logic later)
  const [youOwe,setyouOwe] = useState(400); 
  const [youAreOwed,setyouAreOwed] = useState(20); 

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
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-green-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-green-800">You Are Owed</h3>
            <p className="text-3xl font-bold text-green-600">${youAreOwed.toFixed(2)}</p>
          </motion.div>
          <motion.div
            className="bg-red-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-red-800">You Owe</h3>
            <p className="text-3xl font-bold text-red-700">${youOwe.toFixed(2)}</p>
          </motion.div>
        </motion.section>

        <motion.section
          className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bill List</h2>
          <div className="w-full">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-blue-200 text-gray-700">
                  <th className="p-3 font-semibold min-w-0">Description</th>
                  <th className="p-3 font-semibold min-w-0">Amount</th>
                  <th className="p-3 font-semibold min-w-0">Paid By</th>
                  <th className="p-3 font-semibold min-w-0">Split Between</th>
                  <th className="p-3 font-semibold min-w-0">Date</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <motion.tr
                    key={bill.id}
                    className="border-t hover:bg-violet-100 transition duration-200"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="p-3 truncate">{bill.description}</td>
                    <td className="p-3 truncate">${bill.amount.toFixed(2)}</td>
                    <td className="p-3 truncate">{bill.paidBy}</td>
                    <td className="p-3 truncate">{bill.splitBetween.join(", ")}</td>
                    <td className="p-3 truncate">{bill.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;