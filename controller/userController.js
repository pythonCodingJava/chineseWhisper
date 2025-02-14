const mongoose = require("mongoose");
const model = require("../model/userModel");
const validator = require("email-validator");
const { generateToken } = require("../services/services");
const index = require("../index");

module.exports.register = async (req, res, next) => {
  try {
    const { Username, Password } = req.body;
    if (await model.findOne({ Username: Username })) {
      console.log("exists");
      return res.json({ message: "Username exists", status: "ui" });
    }
    // if (await model.findOne({ email: email })) {
    //   console.log("exists");
    //   return res.json({ message: "email exists", status: "ei" });
    // }
    // if (!validator.validate(email) || !email.includes("nitkkr.ac.in")) {
    //   console.log("email doesnt exist");
    //   return res.json({ message: "Invalid email", status: "ee" });
    // }
    console.log(`${Username} added`);
    let User = new model();
    User.Username = Username;
    User.setPassword(Password);
    User.save();
    return res.json({ message: "User added successfully", status: "success" });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { Username, Password } = req.body;
    const user = await model.findOne({ Username: Username });
    if (user == null) {
      return res.status(400).send({ message: "User not found" });
    } else {
      if (!user.validPassword(Password)) {
        return res.status(400).send({ message: "Incorrect Password" });
      }
    }

    res.cookie('uid',generateToken({Username:user._id}), {
      httpOnly:true,
      secure:true,
      sameSite:'none',
    });

    return res.status(201).send(
      JSON.stringify({
        id:user._id,
        Username: user.Username,
        email: user.email,
        comments: user.comments,
        liked:user.likedForums,
        likedcmt:user.likedComments,
        notifications:user.notifications
      })
    );
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req,res,next) =>{
  try{
    index.io.socketsLeave(req.body.user)
    res.clearCookie('uid');
    res.sendStatus(201);
  }catch(e){
    res.status(402).json({message:"Couldnt log out"})
    next(e);
  }
}
