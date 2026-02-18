const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  ContractDeliverables:
//  *    type: object
//  *    properties:
//  *      milestoneName:
//  *        type: string
//  *      milestoneDetails:
//  *        type: string
//  *      startDate:
//  *        type: number
//  *      endDate:
//  *        type: number
//  *      supportDoc:
//  *        type: string
//  *      status:
//  *        type: number
//  *      flag:
//  *        type: number
//  *      createdDate:
//  *        type: number
//  *      updatedDate:
//  *        type: number
//  *      deleted:
//  *        type: number
//  *
//  */

var ContractDeliverableSchema = new mongoose.Schema({
  milestoneName: {
    type: "string",
    required: true,
  },

  milestoneDetails: {
    type: "string",
  },

  startDate: {
    type: "number",
    required: true,
  },

  endDate: {
    type: "number",
    required: true,
  },

  supportDoc: {
    columnName: "supportDoc",
    type: "string",
  },

  status: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.active,
  },

  flag: {
    type: "number",
  },

  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },

  /*createdBy: {
    columnName: "created_by",
    model: "Users"
  },

  updatedBy: {
    model: "Users"
  },
  */

  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },

  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contracts",
  },
});

module.exports = mongoose.model(
  "contract_deliverables",
  ContractDeliverableSchema
);
