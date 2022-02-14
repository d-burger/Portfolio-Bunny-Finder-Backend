import mongoose from "mongoose";

//-------------- CONNECT TO DATABASE -------------
try {
  const client = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Connected to MongoDB @ ${client.connection.host}.`);
} catch {
  console.log(error);
}
