const Joi = require("joi");
const mongoose = require("mongoose");

const screenCategorySchema = new mongoose.Schema({
  name: {
    type: String
  }
});

const ScreenCategory = mongoose.model("ScreenCategory", screenCategorySchema);

function validateScreenCategory(screencategory) {
  const schema = {
    name: Joi.string()
  };

  return Joi.validate(screencategory, schema);
}

exports.ScreenCategory = ScreenCategory;
exports.validate = validateScreenCategory;
exports.screenCategorySchema = screenCategorySchema;
