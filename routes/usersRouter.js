import { Router } from "express";
import {
  login,
  logout,
  newAccessToken,
  register,
  checkAccessTokenRefresh,
} from "../controllers/users.js";

const usersRouter = Router();

// usersRouter.route("/register").post(register);
// usersRouter.route("/login").post(login);
// usersRouter.route("/token").post(newAccessToken);
// usersRouter.route("/logout").delete(logout);
// usersRouter.route("/accesstoken").get(checkAccessTokenRefresh);

export default usersRouter;
