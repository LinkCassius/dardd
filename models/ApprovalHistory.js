const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ApprovalHistorySchema = new mongoose.Schema({
  approvalArea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "approval_areas",
    default: null,
  },

  applicationId: {
    //this id can be from variation, milestone collections etc.
    type: "string",
  },
  approvalLevel: {
    //as User/as Role
    type: "string",
    default: null,
  },
  approverId: {
    //id of the user who approves
    type: "string",
    default: null,
  },
  approvalType: {
    //similar to approval area - variation, milestone, contract status etc but codes
    type: "string",
    default: null,
  },
  sequence: {
    type: "number",
    default: null,
  },
  approvalStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  approverRemarks: {
    type: "string",
    default: null,
  },
  approvalDate: {
    type: "number",
    default: new Date().getTime(),
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
  applicationObject: {
    type: Object,
    default: null,
  },
});

module.exports = mongoose.model("approval_history", ApprovalHistorySchema);
