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

var ContractSchema = new mongoose.Schema({
  contractName: {
    type: "string",
    required: true,
    //unique: true,
  },

  contractNumber: {
    type: "string",
    required: true,
    //unique: true,
  },
  projectNumber: {
    type: "string",
    required: true,
  },

  startDate: {
    type: "number",
    required: true,
  },

  endDate: {
    type: "number",
    //required: true,
  },

  serviceProvider: {
    type: "string" 
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_serviceproviders",
    default: null,
  },

  contractDetail: {
    type: "string",
  },

  contractValue: {
    type: "number",
    required: true,
  },
  contractType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },

  variationApproved: {
    type: "string",
  },
  extension: {
    type: "string",
  },

  contractStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
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
  penalty: {
    type: Boolean,
    default: false,
  },
  remarks: {
    type: "string",
  },
  contractStatus_ApprValue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  contractStatus_LastUpdated: {
    type: "number",
    default: null,
  },

  contractStatus_ApprStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  contractStatus_ApprSequence: {
    type: "string",
    default: null,
  },
  endDate_ApprValue: {
    type: "number",
    default: null,
  },
  endDate_LastUpdated: {
    type: "number",
    default: null,
  },
  endDate_ApprStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  endDate_ApprSequence: {
    type: "string",
    default: null,
  },
  isRetentionApplicable: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedDate: { type: "number", default: null },
});

module.exports = mongoose.model("contracts", ContractSchema);
