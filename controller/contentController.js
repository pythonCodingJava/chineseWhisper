const mongoose = require("mongoose");
const model = require("../model/forumModel");
const user = require("../model/userModel");
const cmnt = require("../model/commentModel");

module.exports.getAll = async (req, res, next) => {
  try {
    let arg = { $lt: req.body.date };
    if(req.body.type == -1) arg = { $gte: new Date(req.body.date) }
    let data = await model
      .find({ createdAt: arg })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({path:"createdBy", select:"Username"});

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

    if (likingUser.likedForums.includes(forum._id)) {
      forum.likes--;
      likingUser.likedForums.splice(
        likingUser.likedForums.indexOf(forum._id),
        1
      );
    } else {
      forum.likes++;
      likingUser.likedForums.push(forum);
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
      .populate("createdBy")
      .populate({
        path: "comments",
        options: { sort: { date: -1 } },
        populate: { path: "from", select: "Username" },
      });
    res.status(201).send(JSON.stringify(forum));
  } catch (e) {
    next(e);
  }
};

module.exports.getComments = async (req, res, next) => {
  try {
    const cmt = await cmnt
      .findOne({ _id: req.body._id })
      .populate({
        path: "replies",
        options: { sort: { date: -1 } },
        populate: { path: "from", select: "Username" },
      });

    res.send(JSON.stringify(cmt.replies));
  } catch (e) {
    next(e);
  }
};

module.exports.likeCmt = async (req, res, next) => {
  try {
    const cmt = await cmnt.findOne({ _id: req.body.id });
    const likingUser = await user.findOne({ Username: req.body.user });

    if (likingUser.likedComments.includes(cmt._id)) {
      cmt.likes--;
      likingUser.likedComments.splice(
        likingUser.likedComments.indexOf(cmt._id),
        1
      );
    } else {
      cmt.likes++;
      likingUser.likedComments.push(cmt);
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
    const cmt = new cmnt({
      body: data.body,
      from: from._id,
      tier: data.tier,
      date:new Date(),
      to: data.to,
    });
    cmt.save().then((comment) => {
      res.status(201).send(JSON.stringify({ id: comment._id }));
    });

    if (data.replyTo) {
      const replied = await cmnt.findOne({ _id: data.replyTo });
      replied.replies.push(cmt);
      replied.save();
    } else {
      const post = await model.findOne({ _id: data.to });
      post.comments.push(cmt);
      post.save();
    }
  } catch (e) {
    next(e);
  }
};
