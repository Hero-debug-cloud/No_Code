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

const Project=require("../models/Projects");

router.post(
  "/delete",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const _id=req.body._id;
      const result = await Project.deleteOne({_id });
      return res.status(200).json({ message:result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/update",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const _id=req.body._id;
      const value=req.body.value;
      const result = await Project.updateOne({ _id },{name:value});
      return res.status(200).json({ message:result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/read",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const user_id=req.body.user_id;
      const result=await Project.find({user_id})
      return res.status(200).json({ message:result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);
router.post(
  "/create",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    try {
      const name = req.body.name;
  
      const newProject=new Project({
        user_id:req.body.user_id,
        name
      })
      const result=await newProject.save();
      return res.status(200).json({ message: result });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);


module.exports = router;
