const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;

var FarmerDetailHistorySchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerDetail",
    required: true,
  },
  farmerType: { type: String, default: null },
  surname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  identityNumber: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    default: null,
  },
  nationality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  email: {
    type: String,
  },
  residentialAddress: {
    type: String,
    default: null,
  },
  residentialPostalcode: {
    type: String,
    default: null,
  },
  postalAddress: {
    type: String,
    default: null,
  },
  postalcode: {
    type: String,
    default: null,
  },
  farmingExperience: {
    type: String,
    default: null,
  },
  farmingExperienceYears: {
    type: Number,
    default: null,
  },
  ageGroups: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    default: "Male",
  },
  populationGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  populationGroupOther: {
    type: String,
    default: null,
  },
  homeLanguage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  homeLanguageOther: {
    type: String,
    default: null,
  },
  education: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  educationOther: {
    type: String,
    default: null,
  },
  operationType: {
    type: String,
    default: null,
  },
  isOwner: {
    type: Boolean,
    default: true,
  },
  ownershipType: {
    type: String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  otherOwnerShip: {
    type: String,
    default: null,
  },
  landAquisition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  landAquisitionOther: {
    type: String,
    default: null,
  },
  programmeRedistribution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  programmeRedistributionOther: {
    type: String,
    default: null,
  },
  /* Object will be saved here with key as name and Value as count */
  noOfEmployees: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  parmanentEmployment: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  seasonalEmployment: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  contractEmployment: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nationalityObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  ageGroupsObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  populationGroupObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  homeLanguageObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  educationObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  ownershipTypeObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  landAquisitionObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  programmeRedistributionObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  isDisabled: { type: Boolean, default: false },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedByObj: {
    type: mongoose.Schema.Types.Mixed,
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
  regionObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  referenceNumber: {
    type: String,
    default: "",
  },
  approverStatus: {
    type: "string",
    default: "",
  },
  remarks: {
    type: "string",
    default: "",
  },
});

module.exports = mongoose.model(
  "farmer_details_history",
  FarmerDetailHistorySchema
);
