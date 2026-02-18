const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

/**
 * @swagger
 * definitions:
 *  Cnd:
 *    type: object
 *    properties:
 *      cndName:
 *        type: string
 *      cndCode:
 *        type: string
 *      cndGroup:
 *        type: string
 *      desc:
 *        type: string
 *      status:
 *        type: number
 *      priority:
 *        type: number
 *      parent:
 *        type: string
 *      createdDate:
 *        type: number
 *      updatedDate:
 *        type: number
 *      deleted:
 *        type: number
 *
 */

var ProgramSchema = new mongoose.Schema({
  cndName: {
    type: "string",
    required: true,
  },

  cndCode: {
    type: "string",
    required: true,
  },

  cndGroup: {
    type: "string",
    required: true,
  },

  desc: {
    columnName: "description",
    type: "string",
  },

  deleteddate: {
    type: Date,
  },
  status: {
    type: "string",
    default: "",
  },

  priority: {
    type: "number",
    default: 0,
  },

  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  checked: {
    type: String,
  },
  expanded: {
    type: String,
  },
  label: {
    type: String,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  children: [],
});

module.exports = mongoose.model("programs", ProgramSchema);
