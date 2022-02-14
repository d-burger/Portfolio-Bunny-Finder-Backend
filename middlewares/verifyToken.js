import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "./asyncHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const {
    cookies: { accessToken },
  } = req;
  if (!accessToken) throw new ErrorResponse("Please log in.", 401);

  // VERIFY TOKEN
  const { _id } = jwt.verify(accessToken, process.env.TOKEN_SECRET);

  // FIND USER DATA USING _id AND PASSING IT ALONG
  const user = await User.findById(_id); // WHY THIS CHECK?
  if (!user) throw new ErrorResponse("User does not exist", 404);
  req.user = user;
  next();
});

export default verifyToken;
