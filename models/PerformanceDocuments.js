const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

var PerformanceDocumentSchema = new mongoose.Schema({
  performanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "performances",
  },
  name: {
    type: "string",
    required: true,
  },
  fileName: {
    type: "string",
    required: true,
  },
  fileType: {
    type: "string",
    required: false,
  },
  uploadDate: {
    type: "number",
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  apUser1HasDownload: {
    type: Boolean,
    default: false,
  },
  apUser2HasDownload: {
    type: Boolean,
    default: false,
  },
  apUser3HasDownload: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model(
  "performance_documents",
  PerformanceDocumentSchema
);
