import express from "express";
const { request: Req } = require("express");
const { response: Res } = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

const port = process.env.PORT || 9000;


//importig routing routes;
const auth = require("./routes/authentication");
const user_database = require("./routes/users_database");
const access_database = require("./routes/access_database");
const database = require("./routes/database");
const crud = require("./routes/crud");
const custom_api=require("./routes/custom_api");
const projects=require("./routes/Projects");
const cors = require("cors");

//middleware;
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_LINK,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err: { err: Error }) => {
    if (err) console.log(err);
    else console.log("Connected to MongoDB");
  }
);

app.get("/", (req: typeof Req, res: typeof Res) => {
  return res.status(200).json("hero");
});


app.use("/auth", auth);
app.use("/user_database", user_database);
app.use("/access", access_database);
app.use("/database", database);
app.use("/crud", crud);
app.use("/custom_api", custom_api);
app.use("/projects", projects);

app.listen(port, () => {
  console.log(`Server is live at ${port} !!`);
});