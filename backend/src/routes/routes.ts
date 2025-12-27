import express from "express";
import cors from "cors";
import { userRegistration } from "../authentication/register";
import { userLogin, userLogout } from "../authentication/login";
import { autoLogin } from "../authentication/autologin";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.get("/", autoLogin);
app.post("/register", userRegistration);
app.post("/login", userLogin);
app.post("/logout", userLogout);
export default app;
