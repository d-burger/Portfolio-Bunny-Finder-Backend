import mongoose from "mongoose";
const { Schema, model } = mongoose;

const bunnySchema = new Schema({
  bunny_name: {
    type: String,
    required: true,
  },
  bunny_age: {
    type: String,
    required: true,
  },
  bunny_image: {
    type: String,
    required: true,
  },
  shelter_name: {
    type: String,
    required: true,
  },
  shelter_zip: {
    type: String,
    required: true,
  },
  shelter_address: {
    type: String,
    required: true,
  },
  shelter_link: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    default: "0",
  },
});

const Bunny = model("Bunny", bunnySchema, "Bunnies"); // MODEL BASED ON A SCHEMA
export default Bunny;
