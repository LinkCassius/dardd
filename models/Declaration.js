const Joi = require("joi");
const mongoose = require("mongoose");

const declarationSchema = new mongoose.Schema({
  farmerDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerDetail"
  },
  farmerSignature: {
    type: Image,
    required: true
  },
  farmerDeclarationDate: {
    type: Date
  },
  enumeratorName: {
    type: String,
    required: true
  },
  enumeratorEmail: {
    type: String
  },
  enumeratorMobile: {
    type: String
  },
  enumeratorDeclarationDate: {
    type: Date
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date
  },
  deleted: {
    type: Date
  }
});

const Declaration = mongoose.model("Declaration", declarationSchema);

function validateDeclaration(declaration) {
  const schema = {
    enumeratorName: Joi.string().required()
  };
  return Joi.validate(declaration, schema);
}

exports.declarationSchema = declarationSchema;
exports.Declaration = Declaration;
exports.validate = validateDeclaration;
