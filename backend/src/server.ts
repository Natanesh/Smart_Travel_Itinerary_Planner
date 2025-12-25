import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRegistration } from "./authentication/register";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.post("/register", userRegistration);
app.listen(PORT, (err) => {
  try {
    console.log(`Server running on the port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
