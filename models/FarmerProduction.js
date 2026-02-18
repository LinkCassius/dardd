const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;
/**
 * @swagger
 * definitions:
 *  FarmerProduction:
 *    type: object
 *    properties:
 *      farmerId:
 *        type: object
 *      farmName:
 *        type: string
 *      farmLatitude:
 *        type: string
 *      farmLongitude:
 *        type: string
 *      portionNumber:
 *        type: string
 *      portionName:
 *        type: string
 *      province:
 *        type: object
 *      metroDistrict:
 *        type: object
 *      farmMuncipalRegion:
 *        type: object
 *      wardNumber:
 *        type: string
 *      townVillage:
 *        type: string
 *      projectLegalEntityName:
 *        type: string
 *      businessEntityType:
 *        type: object
 *      totalMembersInEnitity:
 *        type: string
 *      totalFarmSize:
 *        type: object
 *      liveStock:
 *        type: object
 *      liveStockOther:
 *        type: string
 *      horticulture:
 *        type: object
 *      horticultureProduction:
 *        type: object
 *      horticultureOther:
 *        type: string
 *      fieldCrops:
 *        type: object
 *      fieldCropsProduction:
 *        type: object
 *      fieldCropsOther:
 *        type: string
 *      forestry:
 *        type: object
 *      forestryProduction:
 *        type: object
 *      forestryOther:
 *        type: string
 *      aquaculture:
 *        type: object
 *      aquacultureOther:
 *        type: string
 *      seaFishing:
 *        type: object
 *      seaFishingOther:
 *        type: string
 *      gameFarming:
 *        type: object
 *      gameFarmingOther:
 *        type: string
 *      marketingChannelTypeFormal:
 *        type: boolean
 *      marketingChannelTypeInformal:
 *        type: boolean
 *      practiseAgroProcessing:
 *        type: boolean
 *      primaryAgroProcessing:
 *        type: object
 *      primaryAgroProcessingOther:
 *        type: string
 *      secondaryAgroProcessing:
 *        type: object
 *      secondaryAgroProcessingOther:
 *        type: string
 *      advancedAgroProcessing:
 *        type: object
 *      advancedAgroProcessingOther:
 *        type: string
 *      practiseAgroProcessingManual:
 *        type: string
 *      provinceObj:
 *        type: object
 *      metroDistrictObj:
 *        type: object
 *      farmMuncipalRegionObj:
 *        type: object
 *      businessEntityTypeObj:
 *        type: object
 *      createdDate:
 *        type: date
 *      updatedDate:
 *        type: date
 *
 */

const farmerProductionSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerDetail",
    required: true,
  },
  farmName: {
    type: String,
  },
  farmLatitude: {
    type: String,
  },
  farmLongitude: {
    type: String,
  },
  farmLatitudeManual: {
    type: String,
  },
  farmLongitudeManual: {
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
  metroDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
  },
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
  gpsLocation: {
    type: String,
    default: "",
  },
  referenceNumber: {
    type: String,
    default: "",
  },
});

const FarmerProduction = mongoose.model(
  "farmer_production",
  farmerProductionSchema
);

function validateFarmerProduction(farmerProduction) {
  var schema = {
    farmName: Joi.string().required(),
  };
  return Joi.validate(farmerProduction, schema);
}

exports.farmerProductionSchema = farmerProductionSchema;
exports.FarmerProduction = FarmerProduction;
exports.validate = validateFarmerProduction;
module.exports = mongoose.model("farmer_production", farmerProductionSchema);
