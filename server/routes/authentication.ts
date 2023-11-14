import { request as Req } from "express";
import { response as Res } from "express";
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = require("../models/schema");

const { authencateToken } = require("../middleware/auth");
const { createDynamicModel } = require("../middleware/mongo");
const { checkmodel } = require("../middleware/mongo");
const { getModel } = require("../middleware/mongo");

const { checking } = require("../middleware/schema_check");
//geting user id as user_id;

//user authentication;
router.post("/register_user", async (req: typeof Req, res: typeof Res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;
    const user = await User.findOne({ username: username });
    //to count no. of calls;
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(password, salt);
      const newuser = new User({
        firstname,
        lastname,
        email,
        username,
        password: newpassword,
      });
      await newuser.save((err: Error) => {
        if (err) return res.status(400).send(err);
        else {
          return res.status(200).json("Done");
        }
      });
    } else {
      return res.status(403).send("User Already Exists...");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
});

// customer User register;
router.post("/login_user", async (req: typeof Req, res: typeof Res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).send("Username Not found in the database");
    }
    const check_pass = await bcrypt.compare(password, user.password);
    if (!check_pass) {
      return res.status(401).send("Password Does not match...");
    }
    const token_content = {
      id: user._id,
    };
    const token = jwt.sign(token_content, process.env.ACCESS_TOKEN_SECRET, {
      // expiresIn: "1h",
    });

    //just sending jwt token in frontend;
    return res.status(200).send(token);

    //for storing jwt token in cookie;
    // return res.status(200).cookie("jwttoken", token).send("done bro");
  } catch (err) {
    return res.status(400).send(err);
  }
});

//customer User Login
router.post(
  "/custom_registeruser",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const field = req.body.field;
    const strict=req.body.strict;

    //find if password is there or not;
    if (field["Password"] == undefined) {
      return res
        .status(400)
        .json({ message: "password is missing in the field" });
    }

    const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;
    console.log(collection_name);

    //getting schema;
    const check = await checkmodel(collection_name);

    if (!check) {
      return res.status(400).json({
        message: "Database is not created of the user by the customer",
      });
    }
    // the above statement will make sure that schema is Present
    const user_model = await getModel(collection_name);

    const data = await Schema.findOne({ collection_name });

    const check2 = await checking(field, data.schema, strict);

    const newfield: any = {};

    if (check2 == 0)
      return res
        .status(400)
        .json({
          message:
            "Field and Schema doesn't match, Please Update the Schema from Authentication Section",
        });
    else if (check2 == -1) {
      //passing only checked ones;
      await new Promise(async (resolve: any, reject: any) => {
        Object.entries(field).forEach(([key, value],index) => {
          console.log(key, data.schema[0].field_name[index]);
          if (data.schema[0].field_name.includes(key)) {
            newfield[key] = value;
          }
        });
        resolve();
      });
    }

    try {
      //changing password;
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(check2==-1?newfield["Password"]:field["Password"], salt);

      if(check2==-1) newfield["Password"] = newpassword;
      else field["Password"] = newpassword;

      console.log(field);
      console.log(newfield);

      const newdata=new user_model(check2==-1?newfield:field);
      newdata.save();

      // await user_model.insertOne(field);
      // await user_model.insertOne(check2==-1?newfield:field);

      return res.status(200).json("Customer user is created!");
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);
router.post(
  "/custom_loginuser",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const field = req.body.field;
    const collection_name = `users_${req.body.user_id}_${req.body.projectId}s`;

    //find if password is there or not;
    if (field["Password"] == undefined) {
      return res
        .status(400)
        .json({ message: "Password is missing in the field" });
    }

    //getting schema;
    const check = await checkmodel(collection_name);

    if (!check) {
      return res.status(400).json({
        message: "Database is not created of the user by the customer",
      });
    }

    // the above statement will make sure that schema is Present
    const user_model = await getModel(collection_name);

    try {
      const { Password, ...otherValues }:any = field;

      //filter other values as well;
      const schema=await Schema.findOne({collection_name});
      const required_fields=schema.required_field;

      const new_otherfield:any={};
      await new Promise(async (resolve: any, reject: any) => {
         required_fields.forEach((val: any) => {
           if (otherValues.hasOwnProperty(val)) {
             new_otherfield[val] = otherValues[val];
           }
           else {
            // check if its a password or not;
            if(val=="Password") {}
            else new_otherfield[val] = undefined;
           }
         });
         resolve(1);
      });


      console.log(new_otherfield);
      
      const current_user = await user_model.findOne(new_otherfield);

      if (!current_user) {
        return res.status(400).json({ message: "fields are not matching!" });
      }

      const check_pass = await bcrypt.compare(Password, current_user.Password);
      if (!check_pass) {
        return res.status(400).send({ message: "Password Does not match..." });
      }

      //creating token for the user;
      const token_content = {
        id: current_user._id,
        collection_name: collection_name,
      };
      const token = jwt.sign(
        token_content,
        process.env.ACCESS_TOKEN_SECRET,
        {}
      );

      //just sending jwt token in frontend;
      return res.status(200).json({ token: token });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
);

router.post(
  "/getschema",
  authencateToken,
  async (req: typeof Req, res: typeof Res) => {
    const name = req.body.name;
    const collection_name = `${name}_${req.body.user_id}_${req.body.projectId}s`;
    try {
      const data = await Schema.findOne({ collection_name });
      return res.status(200).json({ message: data });
    } catch (err: any) {
      return res.status(400).json({ message: err });
    }
  }
);

module.exports = router;
