const express = require("express");
//const { UserHistory } = require("../models/UserHistory");
const { User } = require("../models/User");
const Activites = require("../models/Activities");
const publicIp = require("public-ip");

const historyfunction = async (
  userid,
  activityName, //user activity
  activityType, //view/insert/delete/update
  module, //table
  section, //front -end list /add/update
  url,
  oldValues,
  newValues
) => {
  try {
    const user = await User.findById(userid);
   // console.log("user history: ", user);
    async function getIp() {
      return await publicIp.v4();
    }
    (async () => {
      let ipAddress = await getIp();

      let userhistory = new Activites({
        userName: user.firstName + " " + user.lastName,
        user: user,
        activityName: activityName,
        activityType: activityType,
        module: module,
        section: section,
        url: url,
        oldValues: oldValues,
        newValues: newValues,
        ipAddress: ipAddress,
        activityDate: new Date().getTime(),
      });
      userhistory = await userhistory.save();
    })();
  } catch (error) {
    console.log(error);
  }
};
module.exports = historyfunction;
