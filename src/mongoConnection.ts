import mongoose from "mongoose";

const url =
  "mongodb+srv://userBosi:ryfAwtPiPoxstV8t@cluster0.wqqph.mongodb.net/test?retryWrites=true&w=majority";

export const connectToDataBase = () => {
  mongoose.connect(
    url,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    () => {
      console.log("connect to database");
    }
  );
};
