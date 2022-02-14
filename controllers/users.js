import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { registerValidation, loginValidation } from "../joi/schemas.js";

//--------- REGISTER ------------------------
export const register = asyncHandler(async (req, res) => {
  const { body } = req;
  const {
    body: {
      first_name,
      last_name,
      username,
      password,
      email,
      shelter_name,
      registration_date,
    },
  } = req;

  // VALIDATE DATA BEFORE NEW USER
  const { error } = registerValidation(body);
  if (error) throw new ErrorResponse(error.details[0].message, 400);

  // CHECK IF USER ALREADY EXISTS
  const emailExists = await User.findOne({ email: email });
  const usernameExists = await User.findOne({ username: username });
  if (emailExists || usernameExists)
    throw new ErrorResponse("User already exists.", 403);

  // HASH PASSWORD
  const salt = await bcrypt.genSalt(10); // await because it might take some time
  const hashedPassword = await bcrypt.hash(password, salt);

  // CREATE NEW USER
  const newUser = await User.create({
    first_name,
    last_name,
    username,
    password: hashedPassword,
    email,
    shelter_name,
    registration_date,
  });
  res.status(201).json({ id: newUser._id });
});

//--------- LOGIN ---------------------------
export const login = asyncHandler(async (req, res) => {
  const {
    body: { email, password },
  } = req;

  console.log("LOGGING IN");
  // VALIDATE LOGIN DATA
  const { error } = loginValidation({ email, password });
  if (error) throw new ErrorResponse(error.details[0].message, 400);

  // CHECK IF USER ALREADY EXISTS
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("User does not exist.", 404);

  // CHECK IF PASSWORD IS CORRECT
  const { _id, username, password: hash } = user;
  const validPass = await bcrypt.compare(password, hash);
  if (!validPass) throw new ErrorResponse("Invalid password.", 401);

  // CREATE & ASSIGN A TOKEN AND SET CLIENT COOKIES
  const token = jwt.sign({ _id, username }, process.env.TOKEN_SECRET, {
    expiresIn: "6000000",
  });
  res.cookie("accessToken", token, {
    maxAge: 6000000,
  });

  const refreshToken = jwt.sign(
    { _id, username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "604800000" }
  );

  res.cookie("refreshToken", refreshToken, {
    maxAge: 604800000,

    // path: "/api/users/login",
    // path: "/api/users/token",
  });

  // UPDATE USER ACCESS & REFRESH TOKEN IN DB
  const updatedUser = await User.updateOne(
    { _id: _id },
    { refresh_token: refreshToken, access_token: token }
  );
  console.log("Kurz vorm Ende beim Login ");
  res.json({ token: token, refreshToken: refreshToken, id: _id });
});

//--------- REFRESH TOKEN --------------------
export const newAccessToken = asyncHandler(async (req, res) => {
  const {
    cookies: { refreshToken },
  } = req;
  if (!refreshToken) throw new ErrorResponse("Missing refresh token.", 401);

  const tokenFound = await User.findOne({ refresh_token: refreshToken });
  if (!tokenFound) throw new ErrorResponse("Missing refresh token in DB.", 403);

  // VERIFY REFRESH TOKEN & CREATE NEW ACCESS TOKEN
  const { _id, username } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const token = jwt.sign({ _id, username }, process.env.TOKEN_SECRET, {
    expiresIn: "15s",
  });

  // UPDATE ACCESS TOKEN IN DB
  const updatedUser = await User.updateOne(
    { _id: _id },
    { access_token: token }
  );

  res.cookie("accessToken", token, {
    maxAge: 6000000,
  });

  res.json({ token: token });
});

//--------- LOGOUT --------------------------
export const logout = asyncHandler(async (req, res) => {
  const {
    cookies: { accessToken },
  } = req;
  if (!accessToken) throw new ErrorResponse("Missing cookie.", 400);

  const { _id } = await User.findOne({ access_token: accessToken });
  if (!_id) throw new ErrorResponse("Cookie not found in DB", 400);

  // DELETE USER REFRESH TOKEN IN DB
  const updatedUser = await User.updateOne(
    { _id: _id },
    { refresh_token: null, access_token: null }
  );

  // SET CLIENT COOKIES TO EMPTY STRING
  res.cookie("accessToken", "", {
    maxAge: 50,
  });

  res.cookie("refreshToken", "", {
    maxAge: 50,

    // path: "/api/users/token",
  });

  res.json({ action: "Logged out." });
});

//--------- CHECK ACCESS TOKEN ---------------
export const checkAccessTokenRefresh = asyncHandler(async (req, res) => {
  const {
    cookies: { accessToken },
  } = req;
  console.log(req.cookies);
  console.log("COOOKIES");
  console.log("CHECKING ACCES TOKEN");
  if (!accessToken) throw new ErrorResponse("Please log in.", 401);
  // VERIFY TOKEN
  const { _id } = jwt.verify(accessToken, process.env.TOKEN_SECRET);
  // FIND USER DATA USING _id AND PASSING IT ALONG
  const user = await User.findById(_id); // WHY THIS CHECK?
  if (!user) throw new ErrorResponse("User does not exist", 404);
  console.log("kurz vorm Ende beim Check Access Token");
  res.json({ loggedIn: true, id: _id });
});
