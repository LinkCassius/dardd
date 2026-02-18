const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;
/**
 * @swagger
 * definitions:
 *  FarmerDetail:
 *    type: object
 *    properties:
 *      surname:
 *        type: string
 *      name:
 *        type: string
 *      email:
 *        type: string
 *      identityNumber:
 *        type: string
 *      contactNumber:
 *        type: string
 *      nationality:
 *        type: object
 *      farmerType:
 *        type:string
 *      residentialAddress:
 *        type: string
 *      residentialPostalcode:
 *        type: string
 *      postalAddress:
 *        type: string
 *      postalcode:
 *        type: string
 *      farmingExperience:
 *        type: string
 *      farmingExperienceYears:
 *        type: number
 *      ageGroups:
 *        type: object
 *      gender:
 *        type: string
 *      populationGroup:
 *        type: object
 *      populationGroupOther:
 *        type: string
 *      homeLanguage:
 *        type: object
 *      homeLanguageOther:
 *        type: string
 *      education:
 *        type: object
 *      educationOther:
 *        type: string
 *      operationType:
 *        type: string
 *      isOwner:
 *        type: boolean
 *      ownershipType:
 *        type: object
 *      otherOwnerShip:
 *        type: string
 *      landAquisition:
 *        type: object
 *      landAquisitionOther:
 *        type: string
 *      programmeRedistribution:
 *        type: object
 *      programmeRedistributionOther:
 *        type: string
 *      noOfEmployees:
 *        type: object
 *      parmanentEmployment:
 *        type: object
 *      seasonalEmployment:
 *        type: object
 *      contractEmployment:
 *        type: object
 *      nationalityObj:
 *        type: object
 *      ageGroupsObj:
 *        type: object
 *      populationGroupObj:
 *        type: object
 *      homeLanguageObj:
 *        type: object
 *      educationObj:
 *        type: object
 *      ownershipTypeObj:
 *        type: object
 *      landAquisitionObj:
 *        type: object
 *      programmeRedistributionObj:
 *        type: object
 *
 */

var FarmerDetailSchema = new mongoose.Schema({
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
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdDate: {
    type: "number",
    default: new Date().setHours(0, 0, 0, 0),
  },
  updatedDate: {
    type: "number",
    default: new Date().setHours(0, 0, 0, 0),
  },
  createdByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  updatedByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  regionObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  status: {
    type: String,
    default: "",
  },
  deletedDate: {
    type: Date,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  approverStatus: {
    type: "string",
    default: "",
  },
  remarks: {
    type: "string",
    default: "",
  },
  referenceNumber: {
    type: String,
    default: "",
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("farmer_details", FarmerDetailSchema);
