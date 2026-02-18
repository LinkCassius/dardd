const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ContractDimensionSchema = new mongoose.Schema({
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contracts",
    default: null
  },

  dimension: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cnds",
    default: null
  },

  status: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.active
  },

  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted
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
    default: new Date().getTime()
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime()
  }
});

module.exports = mongoose.model("contract_dimensions", ContractDimensionSchema);
