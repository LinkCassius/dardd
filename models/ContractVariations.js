const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ContractVariationSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contracts",
    default: null,
  },

  subject: {
    type: "string",
    required: true,
  },

  // unit: {
  //   type: "number",
  //   required: true,
  // },
  // rate: {
  //   type: "number",
  //   required: true,
  // },

  amount: {
    type: "number",
    required: true,
  },

  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },

  supportingDoc: {
    type: "string",
  },
  approverRemarks: {
    type: "string",
    default: null,
  },
  approvalStatus: {
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
  approvalSequence: {
    type: "string",
    default: null,
  },

  docCollection: {
    type: "string",
    default: null,
  },
});

module.exports = mongoose.model("contract_variations", ContractVariationSchema);
