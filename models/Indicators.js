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

var IndicatorSchema = new mongoose.Schema({
  indicatorTitle: {
    type: "string",
    required: true
  },
  target: {
    type: "string",
    required: true
  },

  startDate: {
    type: "number",
    required: true
  },

  endDate: {
    type: "number",
    required: true
  },

  reportingCycle: {
    type: String,
    required: true
  },

  meansOfVerification: {
    type: "string"
  },
  responsibleRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserGroup",
    required: true,
  },
  responsibleUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime()
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime()
  },
  dimensions: [{
    type: mongoose.Schema.Types.ObjectId,
    default: null
  }],
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
  editFlag: {
    type: Boolean,
    default: true
  },
  cycleValue: {
    type: String,
    required: true
  },
  outcome: {
    type: String,
    required: true
  },
  outputs: {
    type: String,
    required: true
  },
  isTargetCummulative: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("indicators", IndicatorSchema);
