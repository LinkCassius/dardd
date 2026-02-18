const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;
// /**
//  * @swagger
//  * definitions:
//  *  LiveStockDetails:
//  *    type: object
//  *    properties:
//  *      commodityType:
//  *        type: object
//  *      projectOrCooperativeName:
//  *        type: String
//  *      cooperativeRegNo:
//  *        type: String
//  *      reprasentativeName:
//  *        type: String
//  *      reprasentativeIdNo:
//  *        type: String
//  *      telephone:
//  *        type: String
//  *      cell:
//  *        type: String
//  *      fax:
//  *        type: String
//  *      physicalOrBussinessAddress:
//  *        type: String
//  *      postalAddress:
//  *        type: String
//  *      district:
//  *        type: String
//  *      localMunicipality:
//  *        type: String
//  *      areaName:
//  *        type: String
//  *      wardNo:
//  *        type: object
//  *      gpsCoordinates:
//  *        type: String
//  *      typeOfFarm:
//  *        type: object
//  *      periodOfLeaseInYears:
//  *        type: String
//  *      landSize:
//  *        type: String
//  *      naturalGrazing:
//  *        type: String
//  *      plantedPasture:
//  *        type: String
//  *      Arable:
//  *        type: String
//  *      plantations:
//  *        type: String
//  *      liveStockBrandMark:
//  *        type: Boolean
//  *      noOfBenficiariesInCoopOrProject:
//  *        type: String
//  *      men:
//  *        type: String
//  *      women:
//  *        type: String
//  *      youth:
//  *        type: String
//  *      peopleLivingInDisability:
//  *        type: String
//  *      boundaryFence:
//  *        type: Boolean
//  *      grazingCamps:
//  *        type: Boolean
//  *      waterSourcesRiver:
//  *        type: Boolean
//  *      streams:
//  *        type: Boolean
//  *      windmill:
//  *        type:Boolean
//  *      borehole:
//  *        type:Boolean
//  *      handlingFacilitiesKraals:
//  *        type:Boolean
//  *      crushPens:
//  *        type:Boolean
//  *      dippingFacilities:
//  *        type:Boolean
//  *      noOfCattles:
//  *        type:String
//  *      noOfBreedingBulls:
//  *        type:String
//  *      noOfSteers:
//  *        type:String
//  *      noOfCowsOrHeifers:
//  *        type:String
//  *      noOfGoats:
//  *        type:String
//  *      noOfBucks:
//  *        type:String
//  *      noOfDoes:
//  *        type:String
//  *      noOfSheeps:
//  *        type:String
//  *      noOfRams:
//  *        type:String
//  *      noOfEwes:
//  *        type:String
//  *      noOfPigs:
//  *        type:String
//  *      noOfBoars:
//  *        type:String
//  *      noOfSows:
//  *        type:String
//  *      applicantOrReprasentativeName:
//  *        type:String
//  *      agriculturalAdviserName:
//  *        type:String
//  *      agriculturalMunicipalManagerName:
//  *        type:String
//  *      userId:
//  *        type: String
//  */

var LiveStockDetailsSchema = new mongoose.Schema({
  commodityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  projectOrCooperativeName: {
    type: String,
    required: true,
  },
  cooperativeRegNo: {
    type: String,
    required: true,
  },
  reprasentativeName: {
    type: String,
    required: true,
  },
  reprasentativeIdNo: {
    type: String,
    default: null,
  },
  telephone: {
    type: String,
    required: true,
  },
  cell: {
    type: String,
    default: null,
  },
  fax: {
    type: String,
    default: null,
  },
  physicalOrBussinessAddress: {
    type: String,
    default: null,
  },
  postalAddress: {
    type: String,
    default: null,
  },
  district: {
    type: String,
    default: null,
  },
  localMunicipality: {
    type: String,
    default: null,
  },
  areaName: {
    type: String,
    default: null,
  },
  wardNo: {
    type: String,
    default: null,
  },
  gpsCoordinates: {
    type: String,
    default: null,
  },
  typeOfFarm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  periodOfLeaseInYears: {
    type: String,
    default: null,
  },
  landType: {
    type: mongoose.Schema.Types.Mixed,
    default: false,
  },
  liveStockBrandMark: {
    type: Boolean,
    default: false,
  },
  beneficiaries: {
    type: mongoose.Schema.Types.Mixed,
    default: false,
  },
  infrastructure: {
    type: mongoose.Schema.Types.Mixed,
    default: false,
  },
  stockOnTheFarm: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  applicantOrReprasentativeName: {
    type: String,
    default: null,
  },
  agriculturalAdviserName: {
    type: String,
    default: null,
  },
  agriculturalMunicipalManagerName: {
    type: String,
    default: null,
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  finYear: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("LiveStock_Details", LiveStockDetailsSchema);
