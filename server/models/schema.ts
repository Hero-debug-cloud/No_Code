import mongoose,{ Schema, model, Document } from "mongoose";

const StoreSchema = new mongoose.Schema({
  collection_name: {
    type: String,
  },
  schema: {
    type: [Schema.Types.Mixed],
  },
  required_field: {
    type: Array,
    default: [""],
    required: false,
  },
});

module.exports = mongoose.model("StoreSchema", StoreSchema);
