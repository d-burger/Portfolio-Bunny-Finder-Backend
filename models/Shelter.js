import mongoose from "mongoose";
const { Schema, model } = mongoose;

const shelterSchema = new Schema({
  shelter_name: {
    type: String,
    required: true,
  },
  shelter_address: {
    type: String,
    required: true,
  },
  shelter_zip: {
    type: String,
    required: true,
  },
  shelter_image: {
    type: String,
    required: true,
  },
  shelter_descr: {
    type: String,
    required: true,
  },
  shelter_link: {
    type: String,
    required: true,
  },
  shelter_lat: {
    type: String,
    required: true,
  },
  shelter_lon: {
    type: String,
    required: true,
  },
});

const Shelter = model("Shelter", shelterSchema, "Shelters"); // MODEL BASED ON A SCHEMA
export default Shelter;
