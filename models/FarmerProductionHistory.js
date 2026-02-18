const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;

const farmerProductionHistorySchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerDetail",
    required: true,
  },
  farmName: {
    type: String,
    required: true,
  },
  farmLatitude: {
    type: String,
  },
  farmLongitude: {
    type: String,
  },
  portionNumber: {
    type: String,
  },
  portionName: {
    type: String,
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
  },
  // metroDistrict: {
  //   type: String,
  //   default: null,
  // },
  metroDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
  },
  // farmMuncipalRegion: {
  //   type: String,
  //   default: null,
  // },
  farmMuncipalRegion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
  },
  wardNumber: {
    type: String,
    default: null,
  },
  townVillage: {
    type: String,
    default: null,
  },
  projectLegalEntityName: {
    type: String,
    default: null,
  },
  businessEntityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  totalMembersInEnitity: {
    type: "number",
    default: null,
  },
  totalFarmSize: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  liveStock: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  liveStockOther: { type: String, default: null },
  horticulture: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  horticultureProduction: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  horticultureOther: { type: String, default: null },
  fieldCrops: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  fieldCropsProduction: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  fieldCropsOther: { type: String, default: null },
  forestry: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  forestryProduction: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  forestryOther: { type: String, default: null },
  aquaculture: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  aquacultureOther: { type: String, default: null },
  seaFishing: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  seaFishingOther: { type: String, default: null },
  gameFarming: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  gameFarmingOther: { type: String, default: null },
  marketingChannelTypeFormal: {
    type: Boolean,
    default: null,
  },
  marketingChannelTypeInformal: {
    type: Boolean,
    default: null,
  },
  practiseAgroProcessing: {
    type: Boolean,
    default: true,
  },
  primaryAgroProcessing: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  primaryAgroProcessingOther: { type: String, default: null },
  secondaryAgroProcessing: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  secondaryAgroProcessingOther: { type: String, default: null },
  advancedAgroProcessing: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  advancedAgroProcessingOther: { type: String, default: null },
  practiseAgroProcessingManual: {
    type: Boolean,
    default: true,
  },
  provinceObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  metroDistrictObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  farmMuncipalRegionObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  businessEntityTypeObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
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
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  createdByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  updatedByObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  gpsLocation: {
    type: String,
    default: "",
  },
  referenceNumber: {
    type: String,
    default: "",
  },
});

const FarmerProductionHistory = mongoose.model(
  "farmer_production_history",
  farmerProductionHistorySchema
);

function validateFarmerProduction(farmerProduction) {
  var schema = {
    farmName: Joi.string().required(),
  };
  return Joi.validate(farmerProduction, schema);
}

exports.farmerProductionHistorySchema = farmerProductionHistorySchema;
exports.FarmerProductionHistory = FarmerProductionHistory;
exports.validate = validateFarmerProduction;
module.exports = mongoose.model(
  "farmer_production_history",
  farmerProductionHistorySchema
);
