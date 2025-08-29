import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Log the MongoDB URI
console.log("MongoDB URI:", process.env.MONGODB_URI);

//mongo connection
connectDB();


app.get("/", (req, res) => {
  res.json({ message: "Backend API running..." });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));