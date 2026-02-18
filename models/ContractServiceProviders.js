const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ContractServiceProviderSchema = new mongoose.Schema({
  serviceProviderFirmName: {
    type: "string",
    default: null,
  },
  contactPersonName: {
    type: "string",
    default: null,
  },
  contactNumber: {
    type: "string",
    default: null,
  },
  email: {
    type: "string",
    default: null,
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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deletedDate: { type: "number", default: null },
});

module.exports = mongoose.model(
  "contract_serviceproviders",
  ContractServiceProviderSchema
);
