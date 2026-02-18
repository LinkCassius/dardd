const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var ContractDocumentSchema = new mongoose.Schema({
  contractId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contracts"
  },
  name: {
    type: "string",
    required: true
  },
  docCollection: {
    type: "string"
  },
  uploadDate: {
    type: "number"
  },
  isFolder: {
    type: "string"
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_documents",
    default: null
  },
  refId: { type: "string", default: "" },
  refType: { type: "string", default: "" },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_tasks",
    default: null
  },
  variationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_variations",
    default: null
  },
  milestoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_milestones",
    default: null
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contract_payments",
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
  createdDate: {
    type: "number",
    default: new Date().getTime()
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime()
  }
});

module.exports = mongoose.model("contract_documents", ContractDocumentSchema);
