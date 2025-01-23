import mongoose, { Error } from "mongoose";

export const initDbConnection = async () => {
  return mongoose
    .connect(process.env.AUTH_DB_URL!)
    .then(() => console.log("Auth DB connected successfully!"))
    .catch((err: Error) => {
      throw err;
    });
};
