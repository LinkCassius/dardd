const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

/**
 * @swagger
 * definitions:
 *  UserGroup:
 *    type: object
 *    properties:
 *      groupName:
 *        type: string
 *      createdDate:
 *        type: number
 *      updatedDate:
 *        type: number
 *      deleted:
 *        type: number
 *
 */

const usergroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    unique: true,
  },
  permission: [],
  status: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.active
  },
  createdDate: {
    type: "number",
    default: new Date().getTime()
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime()
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted
  }
});

const UserGroup = mongoose.model("user_groups", usergroupSchema);

function validateUser(usergroup) {
  const schema = {
    name: Joi.string().required()
  };

  return Joi.validate(usergroup, schema);
}

exports.usergroupSchema = usergroupSchema;
exports.UserGroup = UserGroup;
exports.validate = validateUser;

module.exports = mongoose.model("user_groups", usergroupSchema);
