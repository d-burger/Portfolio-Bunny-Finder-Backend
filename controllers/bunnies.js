import Bunny from "../models/Bunny.js";
import Shelter from "../models/Shelter.js";
import geocode from "../utils/geocode.js";
import distance from "../utils/distance.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { searchValidation } from "../joi/schemas.js";
import compareDistance from "../utils/compareDistance.js";

//--------- GET ALL BUNNIES -----------------
export const getAllBunnies = asyncHandler(async (req, res) => {
  const { body } = req;
  let {
    query: { zip, currentPage, postsPerPage },
  } = req;

  zip = parseInt(zip);
  currentPage = parseInt(currentPage);
  postsPerPage = parseInt(postsPerPage);

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

  // VARIABLES FOR PAGINATION
  let counter = 0; // COUNTS BUNNIES THAT ARE ADDED TO BUNNIESARR
  let bunniesArr = []; // SAVES ALL BUNNIES IN ASCENDING ORDER
  let limit; // LIMITS THE NUMBER OF BUNNIES FOUND IN DB

  let searchNumber = currentPage * postsPerPage; // PAGE SHOULD BE INCLUDED

  let bunArr = [];

  for (let i = 0; i < distArr.length; i++) {
    let amount = await Bunny.find({ shelter_zip: [distArr[i].end] }).count();
    limit = searchNumber - counter;

    if (amount >= searchNumber) {
      bunArr = await Bunny.find({
        shelter_zip: [distArr[i].end],
      }).limit(limit);
      for (let j = 0; j < bunArr.length; j++) {
        //------------------------------//
        bunArr[j].distance = distArr[i].distance;
        bunniesArr.push(bunArr[j]);
      }
      break;
    } else {
      if (amount + counter < searchNumber) {
        bunArr = await Bunny.find({
          shelter_zip: [distArr[i].end],
        }).limit(amount);
        for (let j = 0; j < bunArr.length; j++) {
          bunArr[j].distance = distArr[i].distance;
          bunniesArr.push(bunArr[j]);
        }
        counter = counter + amount;
      } else {
        let lastLimit = searchNumber - counter;
        bunArr = await Bunny.find({
          shelter_zip: [distArr[i].end],
        }).limit(lastLimit);
        for (let j = 0; j < bunArr.length; j++) {
          bunArr[j].distance = distArr[i].distance;
          bunniesArr.push(bunArr[j]);
        }
        break;
      }
    }
  }
  const total = await Bunny.count();
  const pages = Math.floor(total / postsPerPage);
  res.json({
    total: total,
    pages: pages,
    bunnies: bunniesArr.slice(
      bunniesArr.length - postsPerPage,
      bunniesArr.length
    ),
  });
});

//--------- GET SPECIFIC BUNNY --------------
export const getSpecificBunny = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const bunny = await Bunny.find({ _id: id });
  res.json(bunny);
});

//--------- CREATE NEW BUNNY ----------------
export const createBunny = asyncHandler(async (req, res) => {
  const { body } = req; // LATER ADD VALIDATION WITH JOI
  console.log(req.params);
  const {
    body: { distance },
  } = req;
  const newBunny = await Bunny.create(body, distance);
  res.status(201).json(newBunny);
});

//--------- CREATE OWN BUNNY ----------------
export const createOwnBunny = asyncHandler(async (req, res) => {
  const { body } = req; // LATER ADD VALIDATION WITH JOI
  console.log(body);
  const {
    body: { distance },
  } = req;
  const newBunny = await Bunny.create(body, distance);
  res.status(201).json(newBunny);
});

//--------- DELETE BUNNY --------------------
export const deleteBunny = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const deletedCount = await Bunny.deleteOne({ _id: id });
  res.json(deletedCount);
});

//--------- DELETE OWN BUNNY ----------------
export const deleteOwnBunny = asyncHandler(async (req, res) => {
  const {
    body: { _id },
  } = req;
  const deletedCount = await Bunny.deleteOne({ _id });
  console.log("Bunny deleted");
  res.json(deletedCount);
});

//--------- UPDATE BUNNY --------------------
export const updateBunny = asyncHandler(async (req, res) => {
  const {
    params: { id },
  } = req;
  const { body } = req;
  const updatedBunny = await Bunny.updateOne({ _id: id }, body);
  res.json(updatedBunny);
});
