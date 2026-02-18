const Joi = require("joi");
const mongoose = require("mongoose");
const iconPath = "images/widgets";

// /**
//  * @swagger
//  * definitions:
//  *  Widget:
//  *    type: object
//  *    properties:
//  *      name:
//  *        type: string
//  *      lastName:
//  *        type: string
//  *      description:
//  *        type: string
//  *      icon:
//  *        type: string
//  *      type:
//  *        type: string
//  *
//  */

const widgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,

    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  type: {
    type: String,
    default: "Tiles",
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

const Widgets = mongoose.model("Widgets", widgetSchema);

function validateWidget(Widgets) {
  const schema = {
    name: Joi.string().max(100).required(),
    description: Joi.string().required(),
    icon: Joi.string().allow(""),
    type: Joi.string().allow(""),
  };
  return Joi.validate(Widgets, schema);
}

exports.widgetSchema = widgetSchema;
exports.Widgets = Widgets;
exports.iconPath = iconPath;
exports.validate = validateWidget;
