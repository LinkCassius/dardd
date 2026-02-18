const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

/**
 * @swagger
 * definitions:
 *  FarmerInteraction:
 *    type: object
 *    properties:
 *      farmerId:
 *        type: object
 *      identityNumber:
 *        type: string
 *      supervisor:
 *        type: object
 *      serviceType:
 *        type: string
 *      serviceDate:
 *        type: date
 *      serviceDescription:
 *        type: string
 *      serviceSignature:
 *        type: string
 *      additionalServices:
 *        type: string
 *      proposals:
 *        type: boolean
 *      referralDetails:
 *        type: string
 *      commodity:
 *        type: object
 *      commodityOther:
 *        type: string
 *      extensionSignature:
 *        type: string
 *      managerSignature:
 *        type: string
 *      docCollection:
 *        type: string
 *      createdBy:
 *        type: object
 *      createdDate:
 *        type: date
 *      updatedDate:
 *        type: date
 *
 */

var farmerInteractionSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "farmer_details",
    default: null,
  },
  identityNumber: {
    type: String,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  serviceType: { type: "string", default: "" },
  serviceDate: { type: "number", default: null },
  serviceDescription: { type: "string", default: "" },
  serviceSignature: { type: "string", default: "" },
  additionalServices: {
    type: "string",
    default: "",
  },
  proposals: {
    type: "string",
    default: "",
  },
  referralDetails: {
    type: "string",
    default: "",
  },
  commodity: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  commodityOther: { type: String, default: null },
  extensionSignature: {
    type: "string",
    default: "",
  },
  managerSignature: {
    type: "string",
    default: "",
  },
  docCollection: {
    type: "string",
    default: "",
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

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },

  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },

  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  supervisorObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  updatedByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  farmerObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  approverStatus: {
    type: "string",
    default: "",
  },
  remarks: {
    type: "string",
    default: "",
  },
});

module.exports = mongoose.model("farmer_interaction", farmerInteractionSchema);
