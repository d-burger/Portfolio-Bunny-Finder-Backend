import { Router } from "express";
import {
  createBunny,
  deleteBunny,
  getAllBunnies,
  getSpecificBunny,
  updateBunny,
  deleteOwnBunny,
  createOwnBunny,
} from "../controllers/bunnies.js";
import verifyToken from "../middlewares/verifyToken.js";

const bunniesRouter = Router();

bunniesRouter.route("/").get(getAllBunnies);
bunniesRouter.route("/:id").get(getSpecificBunny);

// bunniesRouter
//   .route("/:id")
//   .delete(deleteBunny)
//   .put(updateBunny);
// bunniesRouter.route("/").post(createBunny);
// bunniesRouter.route("/hinzufuegen").post(createOwnBunny);
// bunniesRouter.route("/loeschen").post(deleteOwnBunny);

export default bunniesRouter;
