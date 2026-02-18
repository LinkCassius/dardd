const Joi = require("joi");
const mongoose = require("mongoose");

// /**
//  * @swagger
//  * definitions:
//  *  UserWidget:
//  *    type: object
//  *    properties:
//  *      user:
//  *        type: object
//  *      widgetID:
//  *        type: object
//  *
//  */

const userwidgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  widgetID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Widgets",
    required: true,
  },
  createddate: {
    type: "number",
    default: new Date().getTime(),
  },
  updateddate: {
    type: "number",
    default: new Date().getTime(),
  },
});

const UserWidgets = mongoose.model("UserWidgets", userwidgetSchema);

function validateUserWidget(UserWidgets) {
  const schema = {
    widgetID: Joi.array().required(),
  };
  return Joi.validate(UserWidgets, schema);
}

exports.userwidgetSchema = userwidgetSchema;
exports.UserWidgets = UserWidgets;
exports.validateUserWidget = validateUserWidget;
