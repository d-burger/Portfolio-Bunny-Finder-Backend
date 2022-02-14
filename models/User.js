import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
    maxlength: 1024,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  shelter_name: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    default: null,
  },
  refresh_token: {
    type: String,
    default: null,
  },
  registration_date: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema, "Users"); // MODEL BASED ON A SCHEMA
export default User;
