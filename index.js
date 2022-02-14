//-------------- IMPORT ----------------------
import "./dotenv/config.js";
import cors from "cors";
import express from "express";
import bunniesRouter from "./routes/bunniesRouter.js";
import cookieParser from "cookie-parser";
import "./db/mongoose.js";
import sheltersRouter from "./routes/sheltersRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import usersRouter from "./routes/usersRouter.js";

//--------------------------------------------

const app = express();
const port = process.env.PORT || 5000;

//------------ MIDDLEWARES -------------------
const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

//------------ ROUTE MIDDLEWARES -------------
app.use("/api/kaninchen", bunniesRouter);
app.use("/api/tierheime", sheltersRouter);
// app.use("/api/users", usersRouter);

//------------ ERROR HANDLING ----------------
app.use(errorHandler);

//------------ START SERVER ------------------
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
