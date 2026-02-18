const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  Activity:
//  *    type: object
//  *    properties:
//  *      activityName:
//  *        type: string
//  *      activityType:
//  *        type: string
//  *      module:
//  *        type: string
//  *      section:
//  *        type: string
//  *      url:
//  *        type: string
//  *      desc:
//  *        type: string
//  *      activityDate:
//  *        type: number
//  *
//  */

var ActivitySchema = new mongoose.Schema({
  activityName: {
    type: "string",
    required: true,
  },

  activityType: {
    type: "string",
    enum: ["Login", "View", "Update", "Delete", "Add"],
    required: true,
  },

  module: {
    type: "string",
  },

  section: {
    type: "string",
  },

  url: {
    type: "string",
  },

  desc: {
    columnName: "desc",
    type: "string",
  },
  activityDate: {
    type: "number",
    default: new Date().getTime(),
  },
  oldValues: {
    type: Object,
    default: null,
  },
  newValues: {
    type: Object,
    default: null,
  },
  userName: {
    type: "string",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  ipAddress: {
    type: "string",
    default: null,
  },
});

module.exports = mongoose.model("activities", ActivitySchema);
