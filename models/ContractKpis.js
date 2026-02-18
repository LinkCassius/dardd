const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  ContractKpis:
//  *    type: object
//  *    properties:
//  *      Value:
//  *        type: string
//  *      createdDate:
//  *        type: number
//  *      updatedDate:
//  *        type: number
//  *
//  */

var ContractKPISchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contracts",
  },

  kpiId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kpi",
  },
  value: {
    type: "string",
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
});

module.exports = mongoose.model("contract_kpis", ContractKPISchema);
