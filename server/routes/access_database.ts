import { request as Req } from "express";
import { response as Res } from "express";
const router = require("express").Router();
const Schema = require("../models/schema");

const { authencateToken } = require("../middleware/auth");
const { createDynamicModel } = require("../middleware/mongo");
const { checkmodel } = require("../middleware/mongo");
const { getModel } = require("../middleware/mongo");
const { deletemodal } = require("../middleware/mongo");


router.post(
  "/findall",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const name=req.body.name;
    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
    const model = await getModel(collection_name);
    const result=await model.find({});
    return res.status(200).json({ message: result });
  }
);
router.post(
  "/deleteone",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const name=req.body.name;
    const _id=req.body._id;
    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
    const model = await getModel(collection_name);
    const result=await model.deleteOne({_id});
    return res.status(200).json({ message: result });
  }
);
router.post(
  "/updateone",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const name=req.body.name;
    const value=req.body.value;
    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
    const { _id, ...otherValues }: any = value;
    const model = await getModel(collection_name);
    const result = await model.updateOne(
      {_id},
      { $set: otherValues }
    );
    return res.status(200).json({ message: result });
  }
);

module.exports = router;