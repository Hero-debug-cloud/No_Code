import { request as Req } from "express";
import { response as Res } from "express";
const router = require("express").Router();
const Schema = require("../models/schema");

const { authencateToken } = require("../middleware/auth");
const { createDynamicModel } = require("../middleware/mongo");
const { checkmodel } = require("../middleware/mongo");
const { getModel } = require("../middleware/mongo");
const { deletemodal } = require("../middleware/mongo");

//check if the user database is present or not;
router.post(
  "/checkuser",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;
    const result = await checkmodel(collection_name);
    return res.status(200).json({ message: result });
  }
);
router.post(
  "/deletecollection",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;
    const result = await deletemodal(collection_name);
    return res.status(200).json({ message: result });
  }
);

router.post(
  "/getschema",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;
    const Model = await getModel(collection_name);
    // await Model.drop();
    return res.status(200).json(Model);
  }
);

const adjust_schema = (schema: any) => {
  return new Promise((resolve: any, reject: any) => {
    const fieldNames = schema.map((field: any) => field.name);
    const fieldTypes = schema.map((field: any) => field.type);
    const result = {
      field_name: fieldNames,
      field_type: fieldTypes,
    };
    resolve(result);
  });
};

//create user database;
router.post(
  "/createuser",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;

    //creating the schema for the user of the users;
    await createDynamicModel(collection_name);

    return res.status(200).json({ message: "Created User Database!" });
  }
);
router.post(
  "/register",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const field = req.body.field;
    const schema = await adjust_schema(field);

    const collection_name = `users_${req.body.user_id}_${req.body.projectId}`;

    //store it in database to verify later one;
    try{
const newschema = new Schema({
  collection_name: `${collection_name}s`,
  schema: schema,
  required_field:["Password"]
});

await newschema.save();
return res
  .status(200)
  .json({ message: "Created User Database for the customer" });
    }catch(err:any){
      return res.status(400).json({message:err});
    }
  }
);
router.post(
  "/register_update",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
     const field = req.body.field; 
     const value = req.body.value;

     const updateObject:any = {};
     updateObject[field] = value;

     console.log(updateObject);

      const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;

      await Schema.updateOne(
        { collection_name:collection_name},
        { $set: updateObject }
      );
      return res.status(200).json({message:"updated Register"});
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);

module.exports = router;
