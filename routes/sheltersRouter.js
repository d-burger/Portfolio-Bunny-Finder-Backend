import { Router } from "express";
import {
  createShelter,
  deleteShelter,
  getAllShelters,
  getSpecificShelter,
  updateShelter,
  getAllFromShelter,
  getSheltersNearBy,
  getMyShelter,
  getShelterProfilepage,
  getAllFromShelterProfile,
} from "../controllers/shelters.js";
import verifyToken from "../middlewares/verifyToken.js";

const sheltersRouter = Router();

sheltersRouter.route("/Umkreis").get(getSheltersNearBy);
sheltersRouter.route("/kaninchen").get(getAllFromShelter);
sheltersRouter.route("/profilkaninchen").get(getAllFromShelterProfile);
sheltersRouter.route("/:id").get(getShelterProfilepage);
sheltersRouter.route("/").get(getAllShelters);
// sheltersRouter.route("/meintierheim").get(getMyShelter);
// sheltersRouter.route("/").get(verifyToken, getAllShelters).post(createShelter);
// sheltersRouter.route("/").post(createShelter);
// sheltersRouter.route("/:id").delete(deleteShelter).put(updateShelter);

export default sheltersRouter;
