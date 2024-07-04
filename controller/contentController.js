const mongoose = require("mongoose");
const model = require("../model/forumModel");
const user = require("../model/userModel");
const cmnt = require("../model/commentModel");

module.exports.getAll = async (req, res, next) => {
  try {
    let arg = { $lt: req.body.date };
    if (req.body.type == -1) arg = { $gte: new Date(req.body.date) };
    let data = await model
      .find({ createdAt: arg })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: "createdBy", select: "Username" });

    let num = await model.countDocuments();

    res.send(JSON.stringify({ data: data, num: num }));
  } catch (err) {
    next(err);
  }
};

module.exports.like = async (req, res, next) => {
  try {
    const forum = await model.findOne({ _id: req.body.id });
    const likingUser = await user.findOne({ Username: req.body.user });

    if (forum.likes.includes(likingUser._id)) {
      forum.likes.splice(forum.likes.indexOf(likingUser._id), 1);
    } else {
      forum.likes.push(likingUser);
    }

    await likingUser.save();
    await forum.save();
  } catch (e) {
    next(e);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const person = await user
      .findOne({ Username: req.body.user })
      .then((person) => {
        const forum = new model({
          title: req.body.title,
          body: req.body.body,
          createdBy: person._id,
          createdAt: req.body.date,
        });
        forum.save();
      });

    res.sendStatus(201);
  } catch (e) {
    next(e);
  }
};

module.exports.getPost = async (req, res, next) => {
  try {
    const forum = await model
      .findOne({ _id: req.body.id })
      .populate("createdBy");
    // .populate({
    //   path: "comments",
    //   options: { sort: { date: -1 } },
    //   populate: { path: "from", select: "Username" },
    // });

    const comments = await cmnt
      .find({ to: forum })
      .sort({ date: -1 })
      .populate({ path: "from", select: "Username" });

    const data = {
      _id:forum._id,
      title: forum.title,
      body: forum.body,
      createdBy: forum.createdBy,
      createdAt: forum.createdAt,
      likes: forum.likes,
      comments: comments,
    };
    res.status(201).send(JSON.stringify(data));
  } catch (e) {
    next(e);
  }
};

module.exports.getComments = async (req, res, next) => {
  try {
    // const cmt = await cmnt.findOne({ _id: req.body._id }).populate({
    //   path: "replies",
    //   options: { sort: { date: -1 } },
    //   populate: { path: "from", select: "Username" },
    // });
    const replies = await cmnt
      .find({ to: req.body._id })
      .sort({ date: -1 })
      .limit(20)
      .populate({ path: "from", select: "Username" });

    res.send(JSON.stringify(replies));
  } catch (e) {
    next(e);
  }
};

module.exports.likeCmt = async (req, res, next) => {
  try {
    const cmt = await cmnt.findOne({ _id: req.body.id });
    const likingUser = await user.findOne({ Username: req.body.user });

    if (cmt.likes.includes(likingUser._id)) {
      cmt.likes.splice(
        cmt.likes.indexOf(likingUser._id),
        1
      );
    } else {
      cmt.likes.push(likingUser);
    }

    await likingUser.save();
    await cmt.save();
  } catch (e) {
    next(e);
  }
};

module.exports.comment = async (req, res, next) => {
  try {
    const data = req.body;
    const from = await user.findOne({ Username: data.user });
    
    let to = data.to;
    let postedTo = "Forum";
    if (data.replyTo) {
      postedTo = "Comment"
      to = data.replyTo;
    }

    const cmt = new cmnt({
      body: data.body,
      from: from._id,
      tier: data.tier,
      date: new Date(),
      to: to,
      postedFor:postedTo
    });
    cmt.save().then((comment) => {
      res.status(201).send(JSON.stringify({ id: comment._id }));
    });

    
  } catch (e) {
    next(e);
  }
};
