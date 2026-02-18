const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ApprovalSetupSchema = new mongoose.Schema({
  approvalArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "approval_areas",
    default: null,
  },
  approvalLevel: {
    //User/Role
    type: "string",
    required: true,
    default: null,
  },
  approverId: {
    //user id/role id/...
    type: "string",
    default: null,
  },
  approvalType: {
    //similar to approval area - variation, milestone, contract status etc
    type: "string",
    default: null,
  },
  sequence: {
    type: "number",
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
});

module.exports = mongoose.model("approval_setup", ApprovalSetupSchema);
