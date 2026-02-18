const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  Interaction:
//  *    type: object
//  *    properties:
//  *      farmerId:
//  *        type: object
//  *      userId:
//  *        type: object
//  *      activity:
//  *        type: string
//  *      programmeClassification:
//  *        type: object
//  *      typeOfAssistance:
//  *        type: object
//  *      docCollection:
//  *        type: string
//  *      queryReportBack:
//  *        type: string
//  *      followUpRequired:
//  *        type: boolean
//  *      followUpComments:
//  *        type: string
//  *      clientRating:
//  *        type: string
//  *      clientComments:
//  *        type: string
//  *      createdDate:
//  *        type: date
//  *      updatedDate:
//  *        type: date
//  *      deleted:
//  *        type: number
//  *
//  */

var InteractionSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "farmer_details",
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  activity: {
    type: String,
    enum: ["Field Activity", "Office Activity", ""],
    default: "",
  },
  programmeClassification: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  typeOfAssistance: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  docCollection: {
    type: "string",
    default: null,
  },
  queryReportBack: {
    type: "string",
    default: null,
  },
  followUpRequired: {
    type: Boolean,
    default: null,
  },
  followUpDate: { type: "number", default: null },
  followUpComments: {
    type: "string",
    default: null,
  },
  clientRating: {
    type: String,
    enum: ["Very Bad", "Bad", "Good", "Very Good", "Excellent", ""],
    default: "",
  },
  clientComments: {
    type: "string",
    default: null,
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  status: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.active,
  },

  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  clientSignature: {
    type: "string",
    default: "",
  },
});

module.exports = mongoose.model("interaction", InteractionSchema);
