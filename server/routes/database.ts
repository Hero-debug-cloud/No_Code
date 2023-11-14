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

router.post(
  "/getcollections",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try{
      const _id=req.body.user_id;
      const projectId=req.body.projectId;
      console.log(_id);
      const result:any=[];
      await new Promise((resolve: any, reject: any) => {
        mongoose.connection.db
          .listCollections()
          .toArray((err: any, collections: any) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            for (const collection of collections) {
              if (
                collection.name.includes(_id) &&
                collection.name.includes(projectId) &&
                !collection.name.includes("users")
              ) {
                let i = 0;
                while (
                  i < collection.name.length &&
                  collection.name[i] != _id[0]
                ) {
                  i++;
                }
                result.push(collection.name.slice(0, i-1));
              }
            }
            resolve();
          });
      });
      return res.status(200).json({message:result});
    }catch(err:any){
        return res.status(400).json({message:err});
    }
  }
);

router.post(
  "/createcollection",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try{
      const name=req.body.name;
    
      const collection_name=`${name}_${req.body.user_id}_${req.body.projectId}s`;
      const update=await createDynamicModel(collection_name);
      console.log(update);
      
      return res.status(200).json({message:"Created Collection"});
    }catch(err:any){
        return res.status(400).json({message:err});
    }
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
router.post(
  "/register_schema",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const field = req.body.field;
    const name=req.body.name;
    const required_field=req.body.required;
    const schema = await adjust_schema(field);

    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}`;

    //store it in database to verify later one;
    try {
      const newschema = new Schema({
        collection_name: `${collection_name}s`,
        schema: schema,
        required_field:required_field
      });

      await newschema.save();
      return res
        .status(200)
        .json({ message: "Created User Database for the customer" });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);


router.post(
  "/update_schema",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const field1 = req.body.field1;
      const value1 = req.body.value1;
      const field2 = req.body.field2;
      const value2 = req.body.value2;

      const name=req.body.name;

      const updateObject: any = {};
      updateObject[field1] = value1;
      updateObject[field2] = value2;

      console.log(updateObject);

      const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;

      const update= await Schema.updateOne(
        { collection_name: collection_name },
        { $set: updateObject }
      );
      console.log(update);
      return res.status(200).json({ message: "updated Register" });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/delete_schema",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
  
      const name=req.body.name;

      const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;

      const model=await getModel(collection_name);
      await model.collection.drop();
      return res.status(200).json({ message: "Deleted Collection" });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);

module.exports = router;
