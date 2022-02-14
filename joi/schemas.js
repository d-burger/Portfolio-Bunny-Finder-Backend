import Joi from "@hapi/joi";

//--------- REGISTER VALIDATION -------------------
export const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().min(6).max(50).required(),
    password: Joi.string().min(6).max(1024).required(),
    email: Joi.string().min(6).required().email(),
    shelter_name: Joi.string().required(),
  });
  return schema.validate(data);
};

//--------- LOGIN VALIDATION ----------------------
export const loginValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).max(1024).required(),
    email: Joi.string().min(6).required().email(),
  });
  return schema.validate(data);
};

//--------- SEARCH VALIDATION ---------------------
export const searchValidation = (data) => {
  const schema = Joi.object({
    zip: Joi.string().min(5).max(5).required(),
  });
  return schema.validate(data);
};
