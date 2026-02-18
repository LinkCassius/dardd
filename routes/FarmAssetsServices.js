var mongoose = require("mongoose");
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var FarmAssetsServices = require("../models/FarmAssetsServices");
var FarmAssetsServicesHistory = require("../models/FarmAssetsServicesHistory");
var FarmerProduction = require("../models/FarmerProduction");
var Cnds = require("../models/Cnds");
const loghistory = require("./userhistory");
var FarmerDetail = require("../models/FarmerDetail");
const auth = require("../middleware/auth");
var approvalHistory = require("./ApprovalHistoryFunc");

/**
 * @swagger
 * /api/farmerAssetsServices:
 *   post:
 *     tags:
 *       - Add/Update - Farmer Assets and Services Details
 *     description: Returns a object of Farmer Assets and Services Details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: farmerId
 *         description: objectId of farmer
 *         in: formData
 *         required: true
 *       - name: fixedStructures
 *         description: fixed Structures object
 *         in: formData
 *       - name: fixedStructureOther
 *         description: fixed Structures of farm, if not in given options
 *         in: formData
 *         type: string
 *       - name: irrigationSystems
 *         description: irrigation Systems object
 *         in: formData
 *       - name: irrigationSystemOther
 *         description: irrigation Systems of farm, if choose other
 *         in: formData
 *         type: string
 *       - name: waterInfrastructure
 *         description: water Infrastructure Systems object
 *         in: formData
 *       - name: waterInfrastructureOther
 *         description: water infrastructure Systems of farm, if choose other
 *         in: formData
 *         type: string
 *       - name: machineryVehicles
 *         description: machinery Vehicles of farm
 *         in: formData
 *       - name: machineryVehicleOther
 *         description: machinery Vehicles of farm, if choose other
 *         in: formData
 *         type: string
 *       - name: implementsEquipment
 *         description: implements/ Equipment of farm
 *         in: formData
 *       - name: implementsEquipmentOther
 *         description: implements/ Equipment of farm, if choose other
 *         in: formData
 *         type: string
 *       - name: otherAssets
 *         description: other Assets of farm
 *         in: formData
 *       - name: otherAssetsOther
 *         description: other Assets of farm, if choose other
 *         in: formData
 *         type: string
 *       - name: isAccessToDipTank
 *         description: Is dip tank accessible
 *         in: formData
 *         type: boolean
 *       - name: dipTankValue
 *         description: value of dip tank
 *         in: formData
 *         type: string
 *       - name: dipTankType
 *         description: type of dip tank
 *         in: formData
 *         type: string
 *       - name: govtSupport
 *         description: govt support object
 *         in: formData
 *       - name: govtSupportOther
 *         description: Other govt support
 *         in: formData
 *         type: string
 *       - name: haveExtensionServices
 *         description: Getting Extension Services Y/N
 *         in: formData
 *         type: boolean
 *       - name: extensionServiceType
 *         description: type of extension Service
 *         in: formData
 *         type: string
 *       - name: haveVeterinaryServices
 *         description: Getting Veterinary Services Y/N
 *         in: formData
 *         type: boolean
 *       - name: veterinaryServiceType
 *         description: type of veterinary Service
 *         in: formData
 *         type: string
 *       - name: earlyWarningInfo
 *         description: early Warning Info
 *         in: formData
 *         type: boolean
 *       - name: agriEconomicInfo
 *         description: agri Economic Info
 *         in: formData
 *         type: boolean
 *       - name: training
 *         description: training taken
 *         in: formData
 *         type: boolean
 *       - name: annualTurnover
 *         description: annual Turnover id
 *         in: formData
 *         type: string
 *       - name: preferredcommunication
 *         description: preferredcommunication id
 *         in: formData
 *         type: string
 *       - name: hasCropInsurance
 *         description: hasCropInsurance
 *         in: formData
 *         type: boolean
 *       - name: insuranceCompanyName
 *         description: insuranceCompanyName
 *         in: formData
 *         type: string
 *       - name: insuranceType
 *         description: insuranceType
 *         in: formData
 *         type: string
 *       - name: docCollection
 *         description: docCollection
 *         in: formData
 *         type: string
 *       - name: signature
 *         description: signature
 *         in: formData
 *         type: string
 *       - name: annualTurnoverObj
 *         description: annualTurnoverObj
 *         in: formData
 *       - name: preferredcommunicationObj
 *         description: preferredcommunicationObj
 *         in: formData
 *     responses:
 *       200:
 *         description: An Object of Farmer Assets & Services
 *         schema:
 *            $ref: '#/definitions/FarmerAssetServices'
 */

/************FARMER Assets/Services API************************* */
router.post("/api/farmerAssetsServices", auth, async function (req, res) {
  if (!req.body.farmerId) {
    return res
      .status(400)
      .json({ success: false, responseCode: 400, msg: "farmerId is required" });
  } else {
    if (req.body.farmerId) {
      FarmAssetsServices.findOne(
        {
          farmerId: req.body.farmerId,
        },
        function (err, farmerAssetServices) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!farmerAssetServices) {
            /** ADD New Assets and Services **/
            if (!req.body.deviceType) req.body.deviceType = "web";

            let proObj =
              req.body.deviceType !== "web"
                ? {
                    farmerId: req.body.farmerId,
                    fixedStructures: JSON.parse(req.body.fixedStructures),
                    fixedStructureOther: req.body.fixedStructureOther,
                    irrigationSystems: JSON.parse(req.body.irrigationSystems),
                    irrigationSystemOther: req.body.irrigationSystemOther,
                    waterInfrastructure: JSON.parse(
                      req.body.waterInfrastructure
                    ),
                    waterInfrastructureOther: req.body.waterInfrastructureOther,
                    machineryVehicles: JSON.parse(req.body.machineryVehicles),
                    machineryVehicleOther: req.body.machineryVehicleOther,
                    implementsEquipment: JSON.parse(
                      req.body.implementsEquipment
                    ),
                    implementsEquipmentOther: req.body.implementsEquipmentOther,
                    otherAssets: JSON.parse(req.body.otherAssets),
                    otherAssetsOther: req.body.otherAssetsOther,
                    isAccessToDipTank: req.body.isAccessToDipTank,
                    dipTankValue: req.body.dipTankValue,
                    dipTankType: req.body.dipTankType,
                    haveExtensionServices: req.body.haveExtensionServices,
                    extensionServiceType: req.body.extensionServiceType,
                    haveVeterinaryServices: req.body.haveVeterinaryServices,
                    veterinaryServiceType: req.body.veterinaryServiceType,
                    earlyWarningInfo: req.body.earlyWarningInfo,
                    agriEconomicInfo: req.body.agriEconomicInfo,
                    training: req.body.training,
                    annualTurnover: req.body.annualTurnover,
                    preferredcommunication: req.body.preferredcommunication,
                    govtSupport: JSON.parse(req.body.govtSupport),
                    govtSupportOther: req.body.govtSupportOther,

                    hasCropInsurance: req.body.hasCropInsurance,
                    insuranceCompanyName: req.body.insuranceCompanyName,
                    insuranceType: req.body.insuranceType,
                    bankAccountNumber: req.body.bankAccountNumber,
                    bankAccountName: req.body.bankAccountName,
                    bank: req.body.bank,
                    bankBranch: req.body.bankBranch,

                    docCollection: req.body.docCollection,
                    signature: req.body.signature,

                    annualTurnoverObj: req.body.annualTurnoverObj
                      ? JSON.parse(req.body.annualTurnoverObj)
                      : null,
                    preferredcommunicationObj: req.body
                      .preferredcommunicationObj
                      ? JSON.parse(req.body.preferredcommunicationObj)
                      : null,

                    createdDate: new Date().setHours(0, 0, 0, 0),
                    approverStatus: req.body.approverStatus,
                    remarks: req.body.remarks,
                    supervisor: req.body.supervisor
                      ? req.body.supervisor
                      : null,
                    createdBy: req.user._id,
                    createdByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                  }
                : {
                    farmerId: req.body.farmerId,
                    fixedStructures: req.body.fixedStructures,
                    fixedStructureOther: req.body.fixedStructureOther,
                    irrigationSystems: req.body.irrigationSystems,
                    irrigationSystemOther: req.body.irrigationSystemOther,
                    waterInfrastructure: req.body.waterInfrastructure,
                    waterInfrastructureOther: req.body.waterInfrastructureOther,
                    machineryVehicles: req.body.machineryVehicles,
                    machineryVehicleOther: req.body.machineryVehicleOther,
                    implementsEquipment: req.body.implementsEquipment,
                    implementsEquipmentOther: req.body.implementsEquipmentOther,
                    otherAssets: req.body.otherAssets,
                    otherAssetsOther: req.body.otherAssetsOther,
                    isAccessToDipTank: req.body.isAccessToDipTank,
                    dipTankValue: req.body.dipTankValue,
                    dipTankType: req.body.dipTankType,
                    haveExtensionServices: req.body.haveExtensionServices,
                    extensionServiceType: req.body.extensionServiceType,
                    haveVeterinaryServices: req.body.haveVeterinaryServices,
                    veterinaryServiceType: req.body.veterinaryServiceType,
                    earlyWarningInfo: req.body.earlyWarningInfo,
                    agriEconomicInfo: req.body.agriEconomicInfo,
                    training: req.body.training,
                    annualTurnover: req.body.annualTurnover,
                    preferredcommunication: req.body.preferredcommunication,
                    govtSupport: req.body.govtSupport,
                    govtSupportOther: req.body.govtSupportOther,

                    hasCropInsurance: req.body.hasCropInsurance,
                    insuranceCompanyName: req.body.insuranceCompanyName,
                    insuranceType: req.body.insuranceType,
                    bankAccountNumber: req.body.bankAccountNumber,
                    bankAccountName: req.body.bankAccountName,
                    bank: req.body.bank,
                    bankBranch: req.body.bankBranch,
                    docCollection: req.body.docCollection,
                    signature: req.body.signature,

                    annualTurnoverObj: req.body.annualTurnoverObj,
                    preferredcommunicationObj:
                      req.body.preferredcommunicationObj,

                    createdDate: new Date().setHours(0, 0, 0, 0),
                    approverStatus: "Approved", //req.body.approverStatus,
                    remarks: "auto approved", //req.body.remarks,
                    supervisor: req.body.supervisor
                      ? req.body.supervisor
                      : null,
                    createdBy: req.user._id,
                    createdByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                  };

            let newFarmerPro = new FarmAssetsServices(proObj);

            newFarmerPro.save(async function (err) {
              console.log("errors", err);
              if (err) {
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "Some thing is wrong.",
                  error: err.errors,
                });
              }

              //code added on 14-Jul-2021, to update approval status in Farmer Detail
              await FarmerDetail.updateOne(
                {
                  _id: req.body.farmerId,
                },
                {
                  $set: {
                    approverStatus:
                      req.body.deviceType !== "web"
                        ? req.body.approverStatus
                        : "Approved",
                    remarks:
                      req.body.deviceType !== "web"
                        ? req.body.remarks
                        : "auto approval",
                    supervisor: req.body.supervisor
                      ? req.body.supervisor
                      : null,
                  },
                }
              );

              //code added on 17-Jun-2021, get region from prod table and update in assets table
              let getProd = await FarmerProduction.findOne(
                {
                  farmerId: req.body.farmerId,
                },
                {
                  provinceObj: 1,
                  metroDistrictObj: 1,
                  farmMuncipalRegionObj: 1,
                }
              );
              if (getProd) {
                let prodObj = {
                  //provinceObj: getProd.provinceObj,
                  metroDistrictObj: getProd.metroDistrictObj,
                  farmMuncipalRegionObj: getProd.farmMuncipalRegionObj,
                };

                //update asset table
                await FarmAssetsServices.updateOne(
                  {
                    farmerId: req.body.farmerId,
                  },
                  { $set: { regionObj: prodObj } }
                );
              }

              var result = JSON.parse(JSON.stringify(newFarmerPro));
              if (req.user._id)
                loghistory(
                  req.user._id,
                  "Farmer Assets Services Add",
                  "Add",
                  "farmer_assets_services",
                  "Add Assets and Services",
                  req.get("referer"),
                  null,
                  result
                );

              ///
              //farmer Registration - insert record in approval history table
              // if (
              //   req.body.approverStatus &&
              //   req.body.approverStatus == "Pending"
              // ) {
              //below code commented on 17-June-2021 as approval is not in web
              /*
              let getFarmer = await FarmerDetail.findOne(
                {
                  _id: req.body.farmerId,
                },
                { _id: 1, name: 1, identityNumber: 1 }
              );
              if (getFarmer) {
                var applicationObj = {
                  name: getFarmer.name,
                  identityNumber: getFarmer.identityNumber,
                  farmerId: req.body.farmerId,
                  createdBy: req.user._id,
                };

                approvalHistory(
                  "5faa9ca05ef7f80df40621fd",
                  req.body.farmerId,
                  req.body.approvalLevel ? req.body.approvalLevel : null,
                  "FR",
                  1,
                  applicationObj
                );
              }
              */
              //}
              ///

              res.status(200).json({
                success: true,
                responseCode: 200,
                msg: "Farmer details saved successfully.",
                result: result,
              });
            });
          } else {
            var oldObj = {
              farmerId: farmerAssetServices.farmerId,
              fixedStructures: farmerAssetServices.fixedStructures,
              fixedStructureOther: farmerAssetServices.fixedStructureOther,
              irrigationSystems: farmerAssetServices.irrigationSystems,
              irrigationSystemOther: farmerAssetServices.irrigationSystemOther,
              waterInfrastructure: farmerAssetServices.waterInfrastructure,
              waterInfrastructureOther:
                farmerAssetServices.waterInfrastructureOther,
              machineryVehicles: farmerAssetServices.machineryVehicles,
              machineryVehicleOther: farmerAssetServices.machineryVehicleOther,
              implementsEquipment: farmerAssetServices.implementsEquipment,
              implementsEquipmentOther:
                farmerAssetServices.implementsEquipmentOther,
              otherAssets: farmerAssetServices.otherAssets,
              otherAssetsOther: farmerAssetServices.otherAssetsOther,
              isAccessToDipTank: farmerAssetServices.isAccessToDipTank,
              dipTankValue: farmerAssetServices.dipTankValue,
              dipTankType: farmerAssetServices.dipTankType,
              haveExtensionServices: farmerAssetServices.haveExtensionServices,
              extensionServiceType: farmerAssetServices.extensionServiceType,
              haveVeterinaryServices:
                farmerAssetServices.haveVeterinaryServices,
              veterinaryServiceType: farmerAssetServices.veterinaryServiceType,
              earlyWarningInfo: farmerAssetServices.earlyWarningInfo,
              agriEconomicInfo: farmerAssetServices.agriEconomicInfo,
              training: farmerAssetServices.training,
              annualTurnover: farmerAssetServices.annualTurnover,
              preferredcommunication:
                farmerAssetServices.preferredcommunication,
              govtSupport: farmerAssetServices.govtSupport,
              govtSupportOther: farmerAssetServices.govtSupportOther,
              hasCropInsurance: farmerAssetServices.hasCropInsurance,
              insuranceCompanyName: farmerAssetServices.insuranceCompanyName,
              insuranceType: farmerAssetServices.insuranceType,
              bankAccountNumber: farmerAssetServices.bankAccountNumber,
              bankAccountName: farmerAssetServices.bankAccountName,
              bank: farmerAssetServices.bank,
              bankBranch: farmerAssetServices.bankBranch,
              docCollection: farmerAssetServices.docCollection,
              signature: farmerAssetServices.signature,
              annualTurnoverObj: farmerAssetServices.annualTurnoverObj,
              preferredcommunicationObj:
                farmerAssetServices.preferredcommunicationObj,

              createdDate: new Date().getTime(),
              approverStatus: farmerAssetServices.approverStatus,
              remarks: farmerAssetServices.remarks,
              supervisor: farmerAssetServices.supervisor,
              createdBy: farmerAssetServices.createdBy,

              createdByObj: farmerAssetServices.createdByObj,
            };

            let oldFarmerAssets = new FarmAssetsServicesHistory(oldObj);
            oldFarmerAssets.save(function (err) {
              console.log("errors", err);
              if (err) {
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "Some thing is wrong.",
                  error: err.errors,
                });
              }
              var result = JSON.parse(JSON.stringify(oldObj));
            });

            if (!req.body.deviceType) req.body.deviceType = "web";

            let updateObj =
              req.body.deviceType !== "web"
                ? {
                    fixedStructures: req.body.fixedStructures
                      ? JSON.parse(req.body.fixedStructures)
                      : farmerAssetServices.fixedStructures,
                    fixedStructureOther: req.body.fixedStructureOther
                      ? req.body.fixedStructureOther
                      : farmerAssetServices.fixedStructureOther,
                    irrigationSystems: req.body.irrigationSystems
                      ? JSON.parse(req.body.irrigationSystems)
                      : farmerAssetServices.irrigationSystems,
                    irrigationSystemOther: req.body.irrigationSystemOther
                      ? req.body.irrigationSystemOther
                      : farmerAssetServices.irrigationSystemOther,
                    waterInfrastructure: req.body.waterInfrastructure
                      ? JSON.parse(req.body.waterInfrastructure)
                      : farmerAssetServices.waterInfrastructure,
                    waterInfrastructureOther: req.body.waterInfrastructureOther
                      ? req.body.waterInfrastructureOther
                      : farmerAssetServices.waterInfrastructureOther,
                    machineryVehicles: req.body.machineryVehicles
                      ? JSON.parse(req.body.machineryVehicles)
                      : farmerAssetServices.machineryVehicles,
                    machineryVehicleOther: req.body.machineryVehicleOther
                      ? req.body.machineryVehicleOther
                      : farmerAssetServices.machineryVehicleOther,
                    implementsEquipment: req.body.implementsEquipment
                      ? JSON.parse(req.body.implementsEquipment)
                      : farmerAssetServices.implementsEquipment,
                    implementsEquipmentOther: req.body.implementsEquipmentOther
                      ? req.body.implementsEquipmentOther
                      : farmerAssetServices.implementsEquipmentOther,
                    otherAssets: req.body.otherAssets
                      ? JSON.parse(req.body.otherAssets)
                      : farmerAssetServices.otherAssets,
                    otherAssetsOther: req.body.otherAssetsOther
                      ? req.body.otherAssetsOther
                      : farmerAssetServices.otherAssetsOther,
                    isAccessToDipTank: req.body.isAccessToDipTank
                      ? req.body.isAccessToDipTank
                      : farmerAssetServices.isAccessToDipTank,
                    dipTankValue: req.body.dipTankValue
                      ? req.body.dipTankValue
                      : farmerAssetServices.dipTankValue,
                    dipTankType: req.body.dipTankType
                      ? req.body.dipTankType
                      : farmerAssetServices.dipTankType,
                    haveExtensionServices: req.body.haveExtensionServices
                      ? req.body.haveExtensionServices
                      : farmerAssetServices.haveExtensionServices,
                    extensionServiceType: req.body.extensionServiceType
                      ? req.body.extensionServiceType
                      : farmerAssetServices.extensionServiceType,
                    haveVeterinaryServices: req.body.haveVeterinaryServices
                      ? req.body.haveVeterinaryServices
                      : farmerAssetServices.haveVeterinaryServices,
                    veterinaryServiceType: req.body.veterinaryServiceType
                      ? req.body.veterinaryServiceType
                      : farmerAssetServices.veterinaryServiceType,
                    earlyWarningInfo: req.body.earlyWarningInfo
                      ? req.body.earlyWarningInfo
                      : farmerAssetServices.earlyWarningInfo,
                    agriEconomicInfo: req.body.agriEconomicInfo
                      ? req.body.agriEconomicInfo
                      : farmerAssetServices.agriEconomicInfo,
                    training: req.body.training
                      ? req.body.training
                      : farmerAssetServices.training,
                    annualTurnover: req.body.annualTurnover
                      ? req.body.annualTurnover
                      : farmerAssetServices.annualTurnover,
                    preferredcommunication: req.body.preferredcommunication
                      ? req.body.preferredcommunication
                      : farmerAssetServices.preferredcommunication,
                    govtSupport: req.body.govtSupport
                      ? JSON.parse(req.body.govtSupport)
                      : farmerAssetServices.govtSupport,

                    govtSupportOther: req.body.govtSupportOther
                      ? req.body.govtSupportOther
                      : farmerAssetServices.govtSupportOther,

                    hasCropInsurance: req.body.hasCropInsurance,
                    // ? req.body.hasCropInsurance
                    // : farmerAssetServices.hasCropInsurance,
                    insuranceCompanyName: req.body.insuranceCompanyName
                      ? req.body.insuranceCompanyName
                      : farmerAssetServices.insuranceCompanyName,
                    insuranceType: req.body.insuranceType
                      ? req.body.insuranceType
                      : farmerAssetServices.insuranceType,
                    bankAccountNumber: req.body.bankAccountNumber
                      ? req.body.bankAccountNumber
                      : farmerAssetServices.bankAccountNumber,
                    bankAccountName: req.body.bankAccountName
                      ? req.body.bankAccountName
                      : farmerAssetServices.bankAccountName,
                    bank: req.body.bank
                      ? req.body.bank
                      : farmerAssetServices.bank,
                    bankBranch: req.body.bankBranch
                      ? req.body.bankBranch
                      : farmerAssetServices.bankBranch,
                    docCollection: req.body.docCollection
                      ? req.body.docCollection
                      : farmerAssetServices.docCollection,
                    signature: req.body.signature
                      ? req.body.signature
                      : farmerAssetServices.signature,

                    annualTurnoverObj: req.body.annualTurnoverObj
                      ? JSON.parse(req.body.annualTurnoverObj)
                      : farmerAssetServices.annualTurnoverObj,
                    preferredcommunicationObj: req.body
                      .preferredcommunicationObj
                      ? JSON.parse(req.body.preferredcommunicationObj)
                      : farmerAssetServices.preferredcommunicationObj,

                    updatedDate: new Date().setHours(0, 0, 0, 0),
                    approverStatus: req.body.approverStatus
                      ? req.body.approverStatus
                      : farmerAssetServices.approverStatus,
                    supervisor: req.body.supervisor
                      ? req.body.supervisor
                      : farmerAssetServices.supervisor,
                    remarks: req.body.remarks
                      ? req.body.remarks
                      : farmerAssetServices.remarks,
                    updatedBy: req.user._id,
                    updatedByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                  }
                : {
                    fixedStructures: req.body.fixedStructures
                      ? req.body.fixedStructures
                      : farmerAssetServices.fixedStructures,
                    fixedStructureOther: req.body.fixedStructureOther
                      ? req.body.fixedStructureOther
                      : farmerAssetServices.fixedStructureOther,
                    irrigationSystems: req.body.irrigationSystems
                      ? req.body.irrigationSystems
                      : farmerAssetServices.irrigationSystems,
                    irrigationSystemOther: req.body.irrigationSystemOther
                      ? req.body.irrigationSystemOther
                      : farmerAssetServices.irrigationSystemOther,
                    waterInfrastructure: req.body.waterInfrastructure
                      ? req.body.waterInfrastructure
                      : farmerAssetServices.waterInfrastructure,
                    waterInfrastructureOther: req.body.waterInfrastructureOther
                      ? req.body.waterInfrastructureOther
                      : farmerAssetServices.waterInfrastructureOther,
                    machineryVehicles: req.body.machineryVehicles
                      ? req.body.machineryVehicles
                      : farmerAssetServices.machineryVehicles,
                    machineryVehicleOther: req.body.machineryVehicleOther
                      ? req.body.machineryVehicleOther
                      : farmerAssetServices.machineryVehicleOther,
                    implementsEquipment: req.body.implementsEquipment
                      ? req.body.implementsEquipment
                      : farmerAssetServices.implementsEquipment,
                    implementsEquipmentOther: req.body.implementsEquipmentOther
                      ? req.body.implementsEquipmentOther
                      : farmerAssetServices.implementsEquipmentOther,
                    otherAssets: req.body.otherAssets
                      ? req.body.otherAssets
                      : farmerAssetServices.otherAssets,
                    otherAssetsOther: req.body.otherAssetsOther
                      ? req.body.otherAssetsOther
                      : farmerAssetServices.otherAssetsOther,
                    isAccessToDipTank: req.body.isAccessToDipTank
                      ? req.body.isAccessToDipTank
                      : farmerAssetServices.isAccessToDipTank,
                    dipTankValue: req.body.dipTankValue
                      ? req.body.dipTankValue
                      : farmerAssetServices.dipTankValue,
                    dipTankType: req.body.dipTankType
                      ? req.body.dipTankType
                      : farmerAssetServices.dipTankType,
                    haveExtensionServices: req.body.haveExtensionServices
                      ? req.body.haveExtensionServices
                      : farmerAssetServices.haveExtensionServices,
                    extensionServiceType: req.body.extensionServiceType
                      ? req.body.extensionServiceType
                      : farmerAssetServices.extensionServiceType,
                    haveVeterinaryServices: req.body.haveVeterinaryServices
                      ? req.body.haveVeterinaryServices
                      : farmerAssetServices.haveVeterinaryServices,
                    veterinaryServiceType: req.body.veterinaryServiceType
                      ? req.body.veterinaryServiceType
                      : farmerAssetServices.veterinaryServiceType,
                    earlyWarningInfo: req.body.earlyWarningInfo
                      ? req.body.earlyWarningInfo
                      : farmerAssetServices.earlyWarningInfo,
                    agriEconomicInfo: req.body.agriEconomicInfo
                      ? req.body.agriEconomicInfo
                      : farmerAssetServices.agriEconomicInfo,
                    training: req.body.training
                      ? req.body.training
                      : farmerAssetServices.training,
                    annualTurnover: req.body.annualTurnover
                      ? req.body.annualTurnover
                      : farmerAssetServices.annualTurnover,
                    preferredcommunication: req.body.preferredcommunication
                      ? req.body.preferredcommunication
                      : farmerAssetServices.preferredcommunication,
                    govtSupport: req.body.govtSupport
                      ? req.body.govtSupport
                      : farmerAssetServices.govtSupport,
                    govtSupportOther: req.body.govtSupportOther
                      ? req.body.govtSupportOther
                      : farmerAssetServices.govtSupportOther,
                    hasCropInsurance: req.body.hasCropInsurance
                      ? req.body.hasCropInsurance
                      : farmerAssetServices.hasCropInsurance,
                    insuranceCompanyName: req.body.insuranceCompanyName
                      ? req.body.insuranceCompanyName
                      : farmerAssetServices.insuranceCompanyName,
                    insuranceType: req.body.insuranceType
                      ? req.body.insuranceType
                      : farmerAssetServices.insuranceType,
                    bankAccountNumber: req.body.bankAccountNumber
                      ? req.body.bankAccountNumber
                      : farmerAssetServices.bankAccountNumber,
                    bankAccountName: req.body.bankAccountName
                      ? req.body.bankAccountName
                      : farmerAssetServices.bankAccountName,
                    bank: req.body.bank
                      ? req.body.bank
                      : farmerAssetServices.bank,
                    bankBranch: req.body.bankBranch
                      ? req.body.bankBranch
                      : farmerAssetServices.bankBranch,
                    docCollection: req.body.docCollection
                      ? req.body.docCollection
                      : farmerAssetServices.docCollection,
                    signature: req.body.signature
                      ? req.body.signature
                      : farmerAssetServices.signature,
                    annualTurnoverObj: req.body.annualTurnoverObj
                      ? req.body.annualTurnoverObj
                      : farmerAssetServices.annualTurnoverObj,
                    preferredcommunicationObj: req.body
                      .preferredcommunicationObj
                      ? req.body.preferredcommunicationObj
                      : farmerAssetServices.preferredcommunicationObj,

                    updatedDate: new Date().setHours(0, 0, 0, 0),
                    approverStatus: req.body.approverStatus
                      ? req.body.approverStatus
                      : farmerAssetServices.approverStatus,
                    remarks: req.body.remarks
                      ? req.body.remarks
                      : farmerAssetServices.remarks,
                    supervisor: req.body.supervisor
                      ? req.body.supervisor
                      : farmerAssetServices.supervisor,
                    updatedBy: req.user._id,
                    updatedByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                  };
            FarmAssetsServices.findOneAndUpdate(
              {
                farmerId: req.body.farmerId,
              },
              updateObj,
              { new: true },
              async function (err, result) {
                if (err) {
                  console.log("err", err);
                  return res.status(400).json({
                    success: false,
                    responseCode: 400,
                    msg: "Internal Server Error.",
                  });
                } else {
                  //code added on 14-Jul-2021, to update approval status in Farmer Detail
                  await FarmerDetail.updateOne(
                    {
                      _id: req.body.farmerId,
                    },
                    {
                      $set: {
                        approverStatus:
                          req.body.deviceType !== "web"
                            ? req.body.approverStatus
                            : "Approved",
                        remarks:
                          req.body.deviceType !== "web"
                            ? req.body.remarks
                            : "auto approval",
                        supervisor: req.body.supervisor
                          ? req.body.supervisor
                          : null,
                      },
                    }
                  );
                  //code added on 17-Jun-2021, get region from prod table and update in assets table
                  let getProd = await FarmerProduction.findOne(
                    {
                      farmerId: req.body.farmerId,
                    },
                    {
                      provinceObj: 1,
                      metroDistrictObj: 1,
                      farmMuncipalRegionObj: 1,
                    }
                  );
                  if (getProd) {
                    let prodObj = {
                      //provinceObj: getProd.provinceObj,
                      metroDistrictObj: getProd.metroDistrictObj,
                      farmMuncipalRegionObj: getProd.farmMuncipalRegionObj,
                    };

                    //update asset table
                    await FarmAssetsServices.updateOne(
                      {
                        farmerId: req.body.farmerId,
                      },
                      { $set: { regionObj: prodObj } }
                    );
                  }

                  var result = JSON.parse(JSON.stringify(result));

                  if (req.user._id)
                    loghistory(
                      req.user._id,
                      "Farmer Assets & Services Updated",
                      "Update",
                      "farmer_assets_services",
                      "Farmer Assets & Services edit",
                      req.get("referer"),
                      farmerAssetServices,
                      result
                    );

                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Farmer details updated successfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    }
  }
});

/**************END Farmer Production API*************/

router.get("/api/farmerAssetsList", auth, async function (req, res) {
  let dbquery = {};

  if (req.query.farmerId) {
    dbquery.farmerId = req.query.farmerId;
  }

  FarmAssetsServices.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      FarmAssetsServices.find(dbquery, {}).exec(function (err, info) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: "error",
          });
        } else {
          var resultx = JSON.parse(JSON.stringify(info));

          res.status(200).json({
            success: true,
            responseCode: 200,
            result: resultx,
            totalRecCount: totalCount,
            msg: "List fetching successfully",
          });
        }
      });
    });
});

router.get("/api/farmerAssetsHistory", auth, async function (req, res) {
  let dbquery = {};

  if (req.query.farmerId) {
    dbquery.farmerId = req.query.farmerId;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }

  FarmAssetsServicesHistory.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      FarmAssetsServicesHistory.find(dbquery, {}).exec(function (err, info) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: "error",
          });
        } else {
          res.status(200).json({
            success: true,
            responseCode: 200,
            result: info,
            totalRecCount: totalCount,
            msg: "List fetching successfully",
          });
        }
      });
    });
});

module.exports = router;
