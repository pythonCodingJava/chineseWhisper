const user = require("../model/userModel");
const index = require("../index");

module.exports.notifyUser = async (userid, notification) => {
  const dudeToNotify = await user.findOne({ _id: userid });

  for (let i = dudeToNotify.notifications.length - 1; i >= 0; i--) {
    const item = dudeToNotify.notifications[i];
    if (
      item.id.toString() == notification.id.toString() ||
      new Date().getDate() - item.date.getDate() >= 3
    ) {
      dudeToNotify.notifications.splice(i, 1);
    }
  }

  dudeToNotify.notifications.push({ ...notification, date: new Date() });

  dudeToNotify.notifications.sort(function (a, b) {
    return b.date - a.date;
  });

  index.io
    .in(userid.toString())
    .emit("notify", { ...notification, date: new Date() });
  await dudeToNotify.save();
};
