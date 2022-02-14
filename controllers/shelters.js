import Shelter from "../models/Shelter.js";
import Bunny from "../models/Bunny.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import geocode from "../utils/geocode.js";
import compareDistance from "../utils/compareDistance.js";
import distance from "../utils/distance.js";
import User from "../models/User.js";

//--------- GET ALL SHELTERS ------------------
export const getAllShelters = asyncHandler(async (req, res) => {
  const shelters = await Shelter.find();
  const total = await Shelter.count();
  res.json({ total: total, shelters: shelters });
});

//--------- GET SHELTERS NEAR BY --------------
export const getSheltersNearBy = asyncHandler(async (req, res) => {
  let {
    query: { zip },
  } = req;

  zip = parseInt(zip);

  // GEOCODE REQUEST ZIP
  const dataReq = await geocode(zip).then((data) => {
    return data;
  });

  // CALCULATE DISTANCE BETWEEN REQUEST ZIP AND SHELTERS
  let distArr = [];
  await Shelter.find().then((data2) => {
    data2.forEach((element) => {
      const dist = distance(dataReq, element);
      const newDistObj = {
        start: zip,
        end: element.shelter_zip,
        distance: dist,
      };
      distArr.push(newDistObj);
    });
  });
  // SORT ASCENDING DISTANCE
  distArr.sort(compareDistance);

  let shelterArr = [];
  for (let i = 0; i < distArr.length; i++) {
    let found = await Shelter.find({ shelter_zip: [distArr[i].end] });

    found[0].distance = distArr[i].distance;

    shelterArr.push({ shelter: found[0], distance: found[0].distance });
  }

  const total = await Shelter.count();
  res.json({ total: total, shelters: shelterArr });
});

//--------- GET SPECIFIC SHELTER --------------
export const getSpecificShelter = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const shelter = await Shelter.find({ _id: id });
  res.json(shelter);
});

//--------- GET MY SHELTER --------------------
export const getMyShelter = asyncHandler(async (req, res) => {
  const {
    query: { user: _id },
  } = req;

  const user = await User.find({ _id });
  const shelter = await Shelter.find({ shelter_name: user[0].shelter_name });

  res.json({ shelter: shelter });
});

//--------- GET SHELTER PROFILEPAGE ------------
export const getShelterProfilepage = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;

  const shelter = await Shelter.find({ _id: id });
  res.json({ shelter: shelter });
});

//--------- CREATE NEW SHELTER ----------------
export const createShelter = asyncHandler(async (req, res) => {
  const { body } = req; // LATER ADD VALIDATION WITH JOI
  console.log(body);
  let location;
  await geocode(body.shelter_zip).then((data) => {
    location = data;
  });
  const shelterData = { ...body, ...location };
  const newShelter = await Shelter.create(shelterData);
  res.status(201).json(newShelter);
});

//--------- DELETE SHELTER --------------------
export const deleteShelter = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const deletedCount = await Shelter.deleteOne({ _id: id });
  res.json(deletedCount);
});

//--------- UPDATE SHELTER --------------------
export const updateShelter = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const { body } = req;
  const updatedShelter = await Shelter.updateOne({ _id: id }, body);
  res.json(updatedShelter);
});

//--------- BUNNIES FROM SPECIFIC SHELTER ---
export const getAllFromShelter = asyncHandler(async (req, res) => {
  const {
    query: { name },
  } = req;
  const allBunnies = await Bunny.find({ shelter_name: name });

  res.json({ name: name, allBunnies: allBunnies });
});

//--------- BUNNIES FROM SPECIFIC SHELTER PROFILE ---
export const getAllFromShelterProfile = asyncHandler(async (req, res) => {
  const {
    query: { id },
  } = req;

  const shelter = await Shelter.find({ _id: id });

  const allBunnies = await Bunny.find({
    shelter_name: shelter[0].shelter_name,
  });

  res.json({ name: "hello", allBunnies: allBunnies });
});
