const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ContractMilstoneSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contracts",
    default: null,
  },

  milestoneName: {
    type: "string",
    required: true,
  },
  milestoneDetails: {
    type: "string",
    required: true,
  },

  startDate: {
    type: "number",
    required: true,
  },

  endDate: {
    type: "number",
    required: true,
  },
  milestoneValue: {
    type: "number",
    required: true,
  },
  Revision: {
    type: "string",
    default: null,
  },

  personResponsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
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
  milestoneStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  remarks: {
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
  retentionPercentage: {
    type: "number",
    required: true,
  },
  penalty: {
    type: Boolean,
    default: false,
  },
  docCollection: {
    type: "string",
    default: null,
  },
  isRetentionMilestone: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("contract_milestones", ContractMilstoneSchema);
