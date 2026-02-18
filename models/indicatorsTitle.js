const mongoose = require("mongoose");

var IndicatorTitleSchema = new mongoose.Schema({
  indicatorTitle: {
    type: "string",
    default: "",
    required: true,
  },
  dimensions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  ],
  programNames: [
    {
      type: mongoose.Schema.Types.String,
      default: "",
    },
  ],
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  deleteddate: {
    type: Date,
  },
  status: {
    type: "string",
    default: "",
  },
  editFlag: {
    type: Boolean,
    default: true,
  },
  programme: { type: mongoose.Schema.Types.ObjectId, default: null },
  programmeNo: { type: String, default: "" },
  programmeName: { type: String, default: "" },
  subProgramme: { type: mongoose.Schema.Types.ObjectId, default: null },
  subProgrammeNo: { type: String, default: "" },
  subProgrammeName: { type: String, default: "" },
  movArray: { type: Array, default: [] },
  outcome: { type: String, default: "" },
  outputs: { type: String, default: "" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("indicatorTitles", IndicatorTitleSchema);
