const Joi = require("joi");
const mongoose = require("mongoose");

var MeansOfVerificationSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  status: {
    type: "string",
    default: "",
  },
  priority: {
    type: "number",
    default: 0,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  deleteddate: {
    type: Date,
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

module.exports = mongoose.model("performance_mov", MeansOfVerificationSchema);
