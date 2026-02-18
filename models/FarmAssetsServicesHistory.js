const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;

const farmAssetsServicesHistorySchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmerDetail",
  },
  fixedStructures: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  fixedStructureOther: { type: String, default: null },
  irrigationSystems: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  irrigationSystemOther: { type: String, default: null },
  waterInfrastructure: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  waterInfrastructureOther: { type: String, default: null },
  machineryVehicles: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  machineryVehicleOther: { type: String, default: null },
  implementsEquipment: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  implementsEquipmentOther: { type: String, default: null },
  otherAssets: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  otherAssetsOther: { type: String, default: null },
  isAccessToDipTank: {
    type: Boolean,
  },
  dipTankValue: {
    type: String,
    enum: ["Communal/Public Dip Tank", "Private Dip Tank", ""],
    default: "",
  },
  dipTankType: {
    type: String,
    enum: ["Small Stock", "Large Stock", ""],
    default: "",
  },
  govtSupport: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  govtSupportOther: { type: String, default: null },
  haveExtensionServices: {
    type: Boolean,
  },
  extensionServiceType: {
    type: String,
    default: null,
  },
  haveVeterinaryServices: {
    type: Boolean,
  },
  veterinaryServiceType: {
    type: String,
    default: null,
  },
  earlyWarningInfo: {
    type: Boolean,
  },
  agriEconomicInfo: {
    type: Boolean,
  },
  training: {
    type: Boolean,
  },
  annualTurnover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  preferredcommunication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  hasCropInsurance: {
    type: Boolean,
    default: null,
  },
  insuranceCompanyName: {
    type: String,
    default: null,
  },
  insuranceType: {
    type: String,
    default: null,
  },
  bankAccountNumber: {
    type: String,
    default: null,
  },
  bankAccountName: {
    type: String,
    default: null,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "banks",
    default: null,
  },
  bankBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "banks",
    default: null,
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },

  approvalStatus: {
    type: String,
    default: "",
  },

  comments: {
    type: String,
    default: "",
  },
  enumeratorName: {
    type: String,
    default: "",
  },
  enumeratorEmail: {
    type: String,
    default: "",
  },
  enumeratorDate: {
    type: String,
    default: "",
  },
  enumeratorMobile: {
    type: String,
    default: "",
  },
  docCollection: {
    type: "string",
    default: "",
  },
  signature: {
    type: "string",
    default: "",
  },
  annualTurnoverObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  preferredcommunicationObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
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

const FarmAssetsServicesHistory = mongoose.model(
  "FarmAssetsServicesHistory",
  farmAssetsServicesHistorySchema
);

function validateFarmAssetsServices(farmAssetsServices) {
  const schema = {
    FixedStructures: Joi.object().required(),
  };
  return Joi.validate(farmAssetsServices, schema);
}

exports.farmAssetsServicesHistorySchema = farmAssetsServicesHistorySchema;
exports.FarmAssetsServicesHistory = FarmAssetsServicesHistory;
exports.validate = validateFarmAssetsServices;
module.exports = mongoose.model(
  "farmer_assets_services_history",
  farmAssetsServicesHistorySchema
);
