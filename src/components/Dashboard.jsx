import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const newBill = location.state?.newBill;
  const [bills, setBills] = useState([
    { id: 1, description: "Dinner", amount: 60, paidBy: "You", splitBetween: ["Alice", "Bob"], date: "2025-03-10", isPaid: false },
    { id: 2, description: "Rent", amount: 1200, paidBy: "Alice", splitBetween: ["You", "Bob"], date: "2025-03-01", isPaid: false },
    ...(newBill ? [newBill] : []),
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const togglePaidStatus = (billId) => {
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === billId ? { ...bill, isPaid: !bill.isPaid } : bill
      )
    );
  };

  const calculateDebt = () => {
    let youOwe = 0;
    let youAreOwed = 0;

    bills.forEach((bill) => {
      if (bill.isPaid) return;
      const splitAmount = bill.amount / bill.splitBetween.length;

      if (bill.paidBy === "You") {
        youAreOwed += splitAmount * (bill.splitBetween.length - (bill.splitBetween.includes("You") ? 1 : 0));
      } else if (bill.splitBetween.includes("You")) {
        youOwe += splitAmount;
      }
    });

    return { youOwe, youAreOwed };
  };

  const { youOwe, youAreOwed } = calculateDebt();

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-600 via-cyan-800 to-navy-900 text-gray-800">
      <header className="bg-teal-800 text-white p-4 shadow-md sticky top-0">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">BillBuddy</h1>
          <div>
            <Link to="/add-bill" className="mr-4 text-sm hover:underline">
              Add Bill
            </Link>
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
            className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-red-700">You Owe</h3>
            <p className="text-3xl font-bold text-red-600">${youOwe.toFixed(2)}</p>
          </motion.div>
        </motion.section>

        <motion.section
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Bill List</h2>
          <div className="w-full">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 font-semibold min-w-0">Description</th>
                  <th className="p-3 font-semibold min-w-0">Amount</th>
                  <th className="p-3 font-semibold min-w-0">Paid By</th>
                  <th className="p-3 font-semibold min-w-0">Split Between</th>
                  <th className="p-3 font-semibold min-w-0">Date</th>
                  <th className="p-3 font-semibold min-w-0">Status</th>
                  <th className="p-3 font-semibold min-w-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <motion.tr
                    key={bill.id}
                    className={`border-t hover:bg-gray-50 transition duration-200 ${bill.isPaid ? "line-through text-gray-500" : ""}`}
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
                    <td className="p-3 truncate">{bill.isPaid ? "Paid" : "Pending"}</td>
                    <td className="p-3">
                      <motion.button
                        onClick={() => togglePaidStatus(bill.id)}
                        className={`px-2 py-1 rounded text-white text-sm ${bill.isPaid ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {bill.isPaid ? "Undo" : "Mark Paid"}
                      </motion.button>
                    </td>
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