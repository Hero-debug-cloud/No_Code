import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  user_id: {
    type: String
  },
  name:{
    type:String
  }
});

module.exports = mongoose.model("Project", ProjectSchema);
