const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ApprovalAreaSchema = new mongoose.Schema({
  approvalAreaCode: {
    type: "string",
    required: true,
    unique: true,
  },
  approvalAreaName: {
    type: "string",
    required: true,
    unique: true,
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

module.exports = mongoose.model("approval_areas", ApprovalAreaSchema);
