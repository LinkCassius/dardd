const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

/**
 * @swagger
 * definitions:
 *  Contract:
 *    type: object
 *    properties:
 *      contractName:
 *        type: string
 *      startDate:
 *        type: number
 *      endDate:
 *        type: number
 *      serviceProvider:
 *        type: string
 *      contractDetail:
 *        type: string
 *      file:
 *        type: string
 *      status:
 *        type: number
 *      createdDate:
 *        type: number
 *      updatedDate:
 *        type: number
 *      deleted:
 *        type: number
 *
 */

var PerformanceMngSchema = new mongoose.Schema({
  startDate: {
    type: "number",
    required: true,
  },

  cycleValue: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  actualPerformance: {
    type: String,
    default: "",
    required: false,
  },
  indicatorTitle: {
    type: "string",
    required: true,
  },
  target: {
    type: "string",
    required: true,
  },

  responsibleRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserGroup",
    default: null,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  status: {
    type: String,
    default: "Pending",
  },
  approvalStatus: {
    type: String,
    default: "",
  },
  dimensions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  ],
  responsibleUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  reportingCycle: {
    type: String,
    required: true,
  },
  approverUser1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  approverUser2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  approverUser3: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  approverUser1Remarks: {
    type: String,
    default: "",
  },
  approverUser2Remarks: {
    type: String,
    default: "",
  },
  approverUser3Remarks: {
    type: String,
    default: "",
  },
  approverUser1Status: {
    type: String,
    default: "",
  },
  approverUser2Status: {
    type: String,
    default: "",
  },
  approverUser3Status: {
    type: String,
    default: "",
  },
  hasDocuments: {
    type: Boolean,
    default: false,
  },
  outcome: {
    type: String,
    required: true,
  },
  outputs: {
    type: String,
    required: true,
  },
  meansOfVerification: {
    type: "string",
  },
  intervention: {
    type: "string",
    default: "",
  },
  isTargetCummulative: {
    type: Boolean,
    default: false,
  },
  finYear: {
    type: "string",
    default: "",
  },
  deleteddate: {
    type: Date,
  },
  annualTarget: {
    type: "string",
    default: "",
  },
  movArray: { type: Array, default: [] },
  apUser1HasDownload: {
    type: Boolean,
    default: false,
  },
  apUser2HasDownload: {
    type: Boolean,
    default: false,
  },
  apUser3HasDownload: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("performance", PerformanceMngSchema);
