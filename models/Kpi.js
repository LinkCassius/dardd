const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  KPIs:
//  *    type: object
//  *    properties:
//  *      kpiCode:
//  *        type: string
//  *      kpiDescription:
//  *        type: string
//  *      kpiTarget:
//  *        type: string
//  *      kpiCompliance:
//  *        type: string
//  *      createdDate:
//  *        type: number
//  *      updatedDate:
//  *        type: number
//  *      deleted:
//  *        type: number
//  *
//  */

var KpiSchema = new mongoose.Schema({
  kpiCode: {
    type: "string",
    required: true,
  },

  kpiDescription: {
    type: "string",
  },

  kpiTarget: {
    type: "string",
    required: true,
  },

  kpiComplianceMin: {
    type: "string",
    required: true,
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
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

module.exports = mongoose.model("kpi", KpiSchema);
