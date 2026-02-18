const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ContractPaymentSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contracts",
    default: null,
  },
  milestone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_milestones",
    default: null,
  },

  // isRetention: {
  //   type: "string",
  //   required: true,
  // },

  // retentionPercentage: {
  //   type: "number",
  //   required: true,
  // },
  amount: {
    type: "number",
  },

  transRefno: {
    type: "string",
  },
  supportingDoc: {
    type: "string",
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
  approvalStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  approvalSequence: {
    type: "string",
    default: null,
  },
  docCollection: {
    type: "string",
    default: null,
  },
  paymentDate: {
    type: "number",
    required: true,
  }
});

module.exports = mongoose.model("contract_payments", ContractPaymentSchema);
