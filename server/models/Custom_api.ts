import mongoose from "mongoose";

type filter_type={
  name:String,
  operation:String,
  value:String
}
const Custom_Schema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  name: {
    type: String,
  },
  endpoint: {
    type: String,
  },
  database_name: {
    type: String,
  },
  type: {
    type: String,
  },
  active: {
    type: Boolean,
    default:false
  },
  return: {
    type: Array,
    default: [],
    required: false,
  },
  filter: {
    type: [
      // {
      //   name: String,
      //   operation: String,
      //   value: String || Boolean,
      // },
    ],
    default: [],
    required: false,
  },
});

module.exports = mongoose.model("CustomApiSchema", Custom_Schema);
