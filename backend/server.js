import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import billRoutes from "./routes/bills.js";
import userRoutes from "./routes/users.js"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/bills", billRoutes);
app.use("/api", userRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});