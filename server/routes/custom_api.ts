import { request as Req } from "express";
import { response as Res } from "express";
const router = require("express").Router();
const Schema = require("../models/schema");
const CustomApiSchema=require("../models/Custom_api");
import mongoose from "mongoose";

const { authencateToken } = require("../middleware/auth");
const { createDynamicModel } = require("../middleware/mongo");
const { checkmodel } = require("../middleware/mongo");
const { getModel } = require("../middleware/mongo");
const { deletemodal } = require("../middleware/mongo");


router.post(
  "/get_individualapi",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
       const _id=req.body._id;
       const result=await CustomApiSchema.findOne({_id});
       const result1=[result];
      return res.status(200).json({ message: [result]});
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/update_it",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
       const {_id,user_id,...othervalue}=req.body.data[0];
       console.log("other");
       console.log(othervalue);
       const result = await CustomApiSchema.updateOne({ _id }, { $set: othervalue });
      return res.status(200).json({ message: result});
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/get_individualapi_schema",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
       const _id=req.body._id;
       const result=await CustomApiSchema.findOne({_id});
       const result1=await Schema.findOne({collection_name:`${result.database_name}_${req.body.user_id}_${req.body.projectId}s`});
      return res.status(200).json({ message: result1.schema});
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/create_api",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
       const data=req.body;
       const new_data=await CustomApiSchema(data);
       const result= await new_data.save();  
      return res.status(200).json({ message: result._id });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/get_api",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
       const user_id=req.body.user_id;
       const result=await CustomApiSchema.find({user_id},{name:1});
       console.log(result);
      return res.status(200).json({ message: result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/findall_database",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const _id = req.body.user_id;
      const projectId=req.body.projectId;
      const result: any = [];
      await new Promise(async(resolve: any, reject: any) => {
        mongoose.connection.db
          .listCollections()
          .toArray(async(err: any, collections: any) => {
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
                console.log(collection.name);
                const result1 = await Schema.findOne({
                  collection_name: collection.name,
                });
                if (result1 != null) {
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
            }
            resolve();
          });
      });
      return res.status(200).json({ message: result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/delete_it",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
    const _id = req.body._id;
    const finding = await CustomApiSchema.findOne({_id})
    if(!finding){
      res.status(400).json({message:"Cann't find this schema"});
    }
     const result = await CustomApiSchema.deleteOne({ _id });
    return res.status(200).json({ message: result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);

//general api for custom apis
router.post(
  "/url/:endpoint",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const endpoint= req.params.endpoint;
      const finding = await CustomApiSchema.findOne({
        endpoint
      });
      if(!finding?.active){
        return res.status(401).json({message:"API is not active right now or Invaild Endpoint"});
      }
      //filter what to return;
      const returnValue:any = {};
      await new Promise(async(resolve: any, reject: any) => {
        finding.return.forEach((field: any) => {
          returnValue[field] = 1;
        });
        resolve();
      });

      //special filters in mongodb ;
      const matchingValue: any = [];
      if(finding.filter.length>0){
       await new Promise(async (resolve: any, reject: any) => {
        finding?.filter.map((val: any) => {
          //->equal to ones;
          if (val.operation == "Equal to") {
            matchingValue[matchingValue.length] = {
              [val.name]: val.value,
            };
          }
          else if(val.operation=="Not Equal to"){
            matchingValue[matchingValue.length]={
              [val.name]:{$ne:val.value}
            }
          }
          else if(val.operation=="Sub String Present"){
            matchingValue[matchingValue.length] = {
              [val.name]: { $regex: val.value },
            };
          }
          else if(val.operation=="More than"){
            matchingValue[matchingValue.length] = {
              [val.name]: { $gt: val.value },
            };
          }
          else if(val.operation=="Less than"){
            matchingValue[matchingValue.length] = {
              [val.name]: { $lt: val.value },
            };
          }
        });
         resolve();
       });
      }
      console.log("matching value");
      console.log(matchingValue);
      
      //getting to the database;
      const collection_name=`${finding?.database_name}_${req.body.user_id}_${req.body.projectId}s`;
      const Model=await getModel(collection_name);

      const result = await Model.aggregate([
        {
          $project: returnValue,
        },
        ...(matchingValue.length > 0
          ? [
              {
                $match: {
                  $and: matchingValue,
                },
              },
            ]
          : []),
      ]);
      
      
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);

module.exports = router;
