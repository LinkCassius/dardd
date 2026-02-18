const express = require("express");

var { User } = require("../models/User");

const UserHierarchyFunction = async (supervisor, childArray) => {
  try {
    const getChildren = await User.find({ supervisor: supervisor }, { _id: 1 });
    if (getChildren) {
      for (let i = 0; i < getChildren.length; i++) {
        let obj = {};
        obj._id = getChildren[i]._id;
        obj.district = getChildren[i].metroDistrictObj
          ? getChildren[i].metroDistrictObj._id
          : "";
        obj.municipality = getChildren[i].municipalRegionObj
          ? getChildren[i].municipalRegionObj._id
          : "";
        childArray.push(obj);
        await UserHierarchyFunction(getChildren[i]._id, childArray);
      }
    }
  } catch (error) {
    console.log("user hierarchy function : ", error);
  }
};
module.exports = UserHierarchyFunction;
