import express from "express";
import cors from "cors";
import { userRegistration } from "../authentication/register";
import { userLogin, userLogout } from "../authentication/login";
import { autoLogin } from "../authentication/autologin";
import cookieParser from "cookie-parser";
import { getItineraries, getItinerary, deleteItinerary } from "../services/listitineraries";
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
app.get("/itineraries", getItineraries);
app.get("/itineraries/:user_id/:id", getItinerary);
app.delete("/itineraries/:id", deleteItinerary);
export default app;
