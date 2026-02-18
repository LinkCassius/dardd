const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  Bank:
//  *    type: object
//  *    properties:
//  *      name:
//  *        type: string
//  *      address:
//  *        type: string
//  *      parent:
//  *        type: string
//  *      createdDate:
//  *        type: number
//  *      updatedDate:
//  *        type: number
//  *      deleted:
//  *        type: number
//  *
//  */

var BankSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
    unique: true,
  },
  address: {
    type: "string",
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Banks",
    default: null,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },
});

module.exports = mongoose.model("banks", BankSchema);
