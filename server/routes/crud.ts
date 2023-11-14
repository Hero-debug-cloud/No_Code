import { request as Req } from "express";
import { response as Res } from "express";
const router = require("express").Router();
const Schema = require("../models/schema");
import mongoose from "mongoose";

const { authencateToken } = require("../middleware/auth");
const { createDynamicModel } = require("../middleware/mongo");
const { checkmodel } = require("../middleware/mongo");
const { getModel } = require("../middleware/mongo");
const { deletemodal } = require("../middleware/mongo");
const { checking } = require("../middleware/schema_check");


router.post(
  "/insert",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const field = req.body.field;
      const strict = req.body.strict;
      const name = req.body.name;

      const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;

      //getting schema;
      const check = await checkmodel(collection_name);

      if (!check) {
        return res.status(400).json({
          message: "Database is not created",
        });
      }
      // the above statement will make sure that schema is Present
      //getting schema;
      const check1 = await checkmodel(collection_name);

      if (!check1) {
        return res.status(400).json({
          message: "Database is not created",
        });
      }
      const user_model = await getModel(collection_name);

      const data = await Schema.findOne({ collection_name });

      const check2 = await checking(field, data.schema, strict);

      const newfield: any = {};

      if (check2 == 0)
        return res.status(400).json({
          message: "Field and Schema doesn't match, Please Update the Schema",
        });
      else if (check2 == -1) {
        //passing only checked ones;
        await new Promise(async (resolve: any, reject: any) => {
          Object.entries(field).forEach(([key, value], index) => {
            console.log(key, data.schema[0].field_name[index]);
            if (data.schema[0].field_name.includes(key)) {
              newfield[key] = value;
            }
          });
          resolve();
        });
      }

      const newdata = new user_model(check2 == -1 ? newfield : field);
      newdata.save();

      return res.status(200).json({ message: "Inserted Successfully" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  "/findall",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const name = req.body.name;
    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
    //getting schema;
    const checking = await checkmodel(collection_name);

    if (!checking) {
      return res.status(400).json({
        message: "Database is not created",
      });
    }
    const model = await getModel(collection_name);
    const result = await model.find({});
    return res.status(200).json({ message: result });
  }
);
router.post(
  "/deleteone",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const name = req.body.name;
      const _id = req.body._id;
      const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
      //getting schema;
      const checking = await checkmodel(collection_name);

      if (!checking) {
        return res.status(400).json({
          message: "Database is not created",
        });
      }
      const model = await getModel(collection_name);
      const result = await model.deleteOne({ _id });
      return res.status(200).json({ message: result });
    } catch (err: any) {
      res.status(400).json("error " + err);
    }
  }
);
router.post(
  "/updateone",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const name = req.body.name;
    const value = req.body.value;
    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
    const { _id, ...otherValues }: any = value;
    //getting schema;
    const checking = await checkmodel(collection_name);

    if (!checking) {
      return res.status(400).json({
        message: "Database is not created",
      });
    }
    const model = await getModel(collection_name);
    const result = await model.updateOne({ _id }, { $set: otherValues });
    return res.status(200).json({ message: result });
  }
);

module.exports = router;
