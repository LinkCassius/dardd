var mongoose = require("mongoose");
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var FarmerDetail = require("../models/FarmerDetail");
var FarmAssetsServices = require("../models/FarmAssetsServices");

var FarmerProduction = require("../models/FarmerProduction");
var FarmerProductionHistory = require("../models/FarmerProductionHistory");
var Cnds = require("../models/Cnds");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/farmerProduction:
 *   post:
 *     tags:
 *       - Add/Update - Farmer's Farm Production Details
 *     description: Returns a object of Farmer Production Details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: farmerId
 *         description: objectId of farmer
 *         in: formData
 *         required: true
 *       - name: farmName
 *         description: Farm Name of farmer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: farmLatitude
 *         description: Latitude of farm
 *         in: formData
 *         required: true
 *         type: string
 *       - name: farmLongitude
 *         description: Longitude of farm
 *         in: formData
 *         required: true
 *         type: string
 *       - name: portionNumber
 *         description: Portion Number of farm
 *         in: formData
 *         type: string
 *       - name: portionName
 *         description: Portion Name of farm
 *         in: formData
 *         type: string
 *       - name: province
 *         description: Province of farm
 *         in: formData
 *       - name: metroDistrict
 *         description: Metro or District of farm
 *         in: formData
 *       - name: farmMuncipalRegion
 *         description: Municipality region of farm
 *         in: formData
 *       - name: wardNumber
 *         description: Ward Number of farm
 *         in: formData
 *         type: string
 *       - name: townVillage
 *         description: Town or Village of farm
 *         in: formData
 *         type: string
 *       - name: projectLegalEntityName
 *         description: Project Or Legal Entity Name
 *         in: formData
 *         type: string
 *       - name: businessEntityType
 *         description: ID of Business Entity Type
 *         in: formData
 *       - name: totalMembersInEnitity
 *         description: Total Members in Entity
 *         in: formData
 *         type: string
 *       - name: totalFarmSize
 *         description: Total Arable, Grazing, Non-Arable
 *         in: formData
 *         type: object
 *       - name: liveStock
 *         description: Live Stock Object
 *         in: formData
 *       - name: liveStockOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: horticulture
 *         description: Horticulture Object
 *         in: formData
 *       - name: horticultureProduction
 *         description: horticulture Production Object
 *         in: formData
 *       - name: horticultureOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: fieldCrops
 *         description: FieldCrops Object
 *         in: formData
 *       - name: fieldCropsProduction
 *         description: fieldCrops Production Object
 *         in: formData
 *       - name: fieldCropsOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: forestry
 *         description: Forestry Object
 *         in: formData
 *       - name: forestryProduction
 *         description: forestry Production Object
 *         in: formData
 *       - name: forestryOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: aquaculture
 *         description: Aquaculture Object
 *         in: formData
 *       - name: aquacultureOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: seaFishing
 *         description: Sea Fishing Object
 *         in: formData
 *       - name: seaFishingOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: gameFarming
 *         description: Game Farming Object
 *         in: formData
 *       - name: gameFarmingOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: marketingChannelTypeFormal
 *         description: Formal Marketing Channel
 *         in: formData
 *         type: boolean
 *       - name: marketingChannelTypeInformal
 *         description: Informal Marketing Channel
 *         in: formData
 *         type: boolean
 *       - name: practiseAgroProcessing
 *         description: Practise AgroProcessing Activities (Y/N)
 *         in: formData
 *         type: string
 *       - name: primaryAgroProcessing
 *         description: AgroProcessing Object
 *         in: formData
 *       - name: primaryAgroProcessingOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: secondaryAgroProcessing
 *         description: secondaryAgroProcessing Object
 *         in: formData
 *       - name: secondaryAgroProcessingOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: advancedAgroProcessing
 *         description: advancedAgroProcessing Object
 *         in: formData
 *       - name: advancedAgroProcessingOther
 *         description: Other Specify
 *         in: formData
 *         type: string
 *       - name: practiseAgroProcessingManual
 *         description: practiseAgroProcessingManual Y/N
 *         in: formData
 *         type: string
 *       - name: provinceObj
 *         description: _id- dropdownID, cndName- dropdownText
 *         in: formData
 *       - name: metroDistrictObj
 *         description: _id- dropdownID, cndName- dropdownText
 *         in: formData
 *       - name: farmMuncipalRegionObj
 *         description: _id- dropdownID, cndName- dropdownText
 *         in: formData
 *       - name: businessEntityTypeObj
 *         description: _id- dropdownID, cndName- dropdownText
 *         in: formData
 *     responses:
 *       200:
 *         description: An Object of Farmer Farm
 *         schema:
 *            $ref: '#/definitions/FarmerProduction'
 */

/************FARMER REGISTER/SIGNUP API************************* */
router.post("/api/farmerProduction", auth, async function (req, res) {
  if (!req.body.farmerId) {
    return res
      .status(400)
      .json({ success: false, responseCode: 400, msg: "farmerId is required" });
  } else {
    if (req.body.farmerId) {
      FarmerProduction.findOne(
        {
          farmerId: req.body.farmerId,
        },
        function (err, farmerProduction) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!farmerProduction) {
            /** ADD New Production **/
            if (!req.body.deviceType) req.body.deviceType = "web";

            let proObj =
              req.body.deviceType !== "web"
                ? {
                    farmerId: req.body.farmerId,
                    farmName: req.body.farmName,
                    farmLatitude: req.body.farmLatitude,
                    farmLongitude: req.body.farmLongitude,
                    portionNumber: req.body.portionNumber,
                    portionName: req.body.portionName,
                    province: req.body.province,
                    metroDistrict: req.body.metroDistrict,
                    farmMuncipalRegion: req.body.farmMuncipalRegion,
                    wardNumber: req.body.wardNumber,
                    townVillage: req.body.townVillage,
                    projectLegalEntityName: req.body.projectLegalEntityName,
                    businessEntityType: req.body.businessEntityType,
                    totalMembersInEnitity: req.body.totalMembersInEnitity,
                    totalFarmSize: JSON.parse(req.body.totalFarmSize),
                    liveStock: JSON.parse(req.body.liveStock),
                    liveStockOther: req.body.liveStockOther,
                    horticulture: JSON.parse(req.body.horticulture),
                    horticultureProduction: JSON.parse(
                      req.body.horticultureProduction
                    ),
                    fieldCrops: JSON.parse(req.body.fieldCrops),
                    fieldCropsProduction: JSON.parse(
                      req.body.fieldCropsProduction
                    ),
                    forestry: JSON.parse(req.body.forestry),
                    forestryProduction: JSON.parse(req.body.forestryProduction),
                    aquaculture: JSON.parse(req.body.aquaculture),
                    seaFishing: JSON.parse(req.body.seaFishing),
                    gameFarming: JSON.parse(req.body.gameFarming),
                    //marketingChannelType: req.body.marketingChannelType,
                    practiseAgroProcessing: req.body.practiseAgroProcessing,
                    primaryAgroProcessing: JSON.parse(
                      req.body.primaryAgroProcessing
                    ),
                    secondaryAgroProcessing: JSON.parse(
                      req.body.secondaryAgroProcessing
                    ),
                    advancedAgroProcessing: JSON.parse(
                      req.body.advancedAgroProcessing
                    ),
                    practiseAgroProcessingManual:
                      req.body.practiseAgroProcessingManual,

                    marketingChannelTypeFormal:
                      req.body.marketingChannelTypeFormal,
                    marketingChannelTypeInformal:
                      req.body.marketingChannelTypeInformal,

                    horticultureOther: req.body.horticultureOther,
                    fieldCropsOther: req.body.fieldCropsOther,
                    forestryOther: req.body.forestryOther,
                    aquacultureOther: req.body.aquacultureOther,
                    seaFishingOther: req.body.seaFishingOther,
                    gameFarmingOther: req.body.gameFarmingOther,
                    primaryAgroProcessingOther:
                      req.body.primaryAgroProcessingOther,
                    secondaryAgroProcessingOther:
                      req.body.secondaryAgroProcessingOther,
                    advancedAgroProcessingOther:
                      req.body.advancedAgroProcessingOther,

                    provinceObj: JSON.parse(req.body.provinceObj),
                    metroDistrictObj: JSON.parse(req.body.metroDistrictObj),
                    farmMuncipalRegionObj: JSON.parse(
                      req.body.farmMuncipalRegionObj
                    ),
                    businessEntityTypeObj: req.body.businessEntityTypeObj
                      ? JSON.parse(req.body.businessEntityTypeObj)
                      : {},
                    createdDate: new Date().setHours(0, 0, 0, 0),
                    createdByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                    gpsLocation: req.body.gpsLocation
                      ? req.body.gpsLocation
                      : "",
                  }
                : {
                    farmerId: req.body.farmerId,
                    farmName: req.body.farmName,
                    farmLatitude: req.body.farmLatitude,
                    farmLongitude: req.body.farmLongitude,
                    portionNumber: req.body.portionNumber,
                    portionName: req.body.portionName,
                    province: req.body.province,
                    metroDistrict: req.body.metroDistrict,
                    farmMuncipalRegion: req.body.farmMuncipalRegion,
                    wardNumber: req.body.wardNumber,
                    townVillage: req.body.townVillage,
                    projectLegalEntityName: req.body.projectLegalEntityName,
                    businessEntityType: req.body.businessEntityType,
                    totalMembersInEnitity: req.body.totalMembersInEnitity,
                    totalFarmSize: req.body.totalFarmSize,
                    liveStock: req.body.liveStock,
                    liveStockOther: req.body.liveStockOther,
                    horticulture: req.body.horticulture,
                    horticultureProduction: req.body.horticultureProduction,
                    fieldCrops: req.body.fieldCrops,
                    fieldCropsProduction: req.body.fieldCropsProduction,
                    forestry: req.body.forestry,
                    forestryProduction: req.body.forestryProduction,
                    aquaculture: req.body.aquaculture,
                    seaFishing: req.body.seaFishing,
                    gameFarming: req.body.gameFarming,
                    //marketingChannelType: req.body.marketingChannelType,
                    practiseAgroProcessing: req.body.practiseAgroProcessing,
                    primaryAgroProcessing: req.body.primaryAgroProcessing,
                    secondaryAgroProcessing: req.body.secondaryAgroProcessing,
                    advancedAgroProcessing: req.body.advancedAgroProcessing,
                    practiseAgroProcessingManual:
                      req.body.practiseAgroProcessingManual,
                    marketingChannelTypeFormal:
                      req.body.marketingChannelTypeFormal,
                    marketingChannelTypeInformal:
                      req.body.marketingChannelTypeInformal,

                    horticultureOther: req.body.horticultureOther,
                    fieldCropsOther: req.body.fieldCropsOther,
                    forestryOther: req.body.forestryOther,
                    aquacultureOther: req.body.aquacultureOther,
                    seaFishingOther: req.body.seaFishingOther,
                    gameFarmingOther: req.body.gameFarmingOther,
                    primaryAgroProcessingOther:
                      req.body.primaryAgroProcessingOther,
                    secondaryAgroProcessingOther:
                      req.body.secondaryAgroProcessingOther,
                    advancedAgroProcessingOther:
                      req.body.advancedAgroProcessingOther,

                    provinceObj: req.body.provinceObj,
                    metroDistrictObj: req.body.metroDistrictObj,
                    farmMuncipalRegionObj: req.body.farmMuncipalRegionObj,
                    businessEntityTypeObj: req.body.businessEntityTypeObj,
                    createdDate: new Date().setHours(0, 0, 0, 0),
                    createdByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                    gpsLocation: req.body.gpsLocation
                      ? req.body.gpsLocation
                      : "",
                  };
            let newFarmerPro = new FarmerProduction(proObj);
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

              //update farmer details for region field
              if (!req.body.deviceType) req.body.deviceType = "web";
              let region =
                req.body.deviceType !== "web"
                  ? {
                      //provinceObj: JSON.parse(req.body.provinceObj),
                      metroDistrictObj: JSON.parse(req.body.metroDistrictObj),
                      farmMuncipalRegionObj: JSON.parse(
                        req.body.farmMuncipalRegionObj
                      ),
                    }
                  : {
                      //provinceObj: req.body.provinceObj,
                      metroDistrictObj: req.body.metroDistrictObj,
                      farmMuncipalRegionObj: req.body.farmMuncipalRegionObj,
                    };

              await FarmerDetail.updateOne(
                {
                  _id: req.body.farmerId,
                },
                { $set: { regionObj: region } }
              );
              await FarmAssetsServices.updateOne(
                {
                  farmerId: req.body.farmerId,
                },
                { $set: { regionObj: region } }
              );

              var result = JSON.parse(JSON.stringify(newFarmerPro));
              if (req.user._id)
                loghistory(
                  req.user._id,
                  "Farmer Production Add",
                  "Add",
                  "farmer_productions",
                  "Add Farmer Production",
                  req.get("referer"),
                  null,
                  result
                );
              res.status(200).json({
                success: true,
                responseCode: 200,
                msg: req.body.farmName + " Saved Successfully.",
                result: result,
              });
            });
          } else {
            var oldObj = {
              farmerId: farmerProduction.farmerId,
              farmName: farmerProduction.farmName,
              farmLatitude: farmerProduction.farmLatitude,
              farmLongitude: farmerProduction.farmLongitude,
              portionNumber: farmerProduction.portionNumber,
              portionName: farmerProduction.portionName,
              province: farmerProduction.province,
              metroDistrict: farmerProduction.metroDistrict,
              farmMuncipalRegion: farmerProduction.farmMuncipalRegion,
              wardNumber: farmerProduction.wardNumber,
              townVillage: farmerProduction.townVillage,
              projectLegalEntityName: farmerProduction.projectLegalEntityName,
              businessEntityType: farmerProduction.businessEntityType,
              totalFarmSize: farmerProduction.totalFarmSize,
              liveStock: farmerProduction.liveStock,
              liveStockOther: farmerProduction.liveStockOther,
              horticulture: farmerProduction.horticulture,
              horticultureProduction: farmerProduction.horticultureProduction,
              fieldCrops: farmerProduction.fieldCrops,
              fieldCropsProduction: farmerProduction.fieldCropsProduction,
              forestry: farmerProduction.forestry,
              forestryProduction: farmerProduction.forestryProduction,
              aquaculture: farmerProduction.aquaculture,
              seaFishing: farmerProduction.seaFishing,
              gameFarming: farmerProduction.gameFarming,
              //marketingChannelType: farmerProduction.marketingChannelType,
              practiseAgroProcessing: farmerProduction.practiseAgroProcessing,
              primaryAgroProcessing: farmerProduction.primaryAgroProcessing,
              secondaryAgroProcessing: farmerProduction.secondaryAgroProcessing,
              advancedAgroProcessing: farmerProduction.advancedAgroProcessing,
              practiseAgroProcessingManual:
                farmerProduction.practiseAgroProcessingManual,

              marketingChannelTypeFormal:
                farmerProduction.marketingChannelTypeFormal,
              marketingChannelTypeInformal:
                farmerProduction.marketingChannelTypeInformal,
              ///
              horticultureOther: farmerProduction.horticultureOther,

              fieldCropsOther: farmerProduction.fieldCropsOther,

              forestryOther: farmerProduction.forestryOther,

              aquacultureOther: farmerProduction.aquacultureOther,

              seaFishingOther: farmerProduction.seaFishingOther,

              gameFarmingOther: farmerProduction.gameFarmingOther,

              primaryAgroProcessingOther:
                farmerProduction.primaryAgroProcessingOther,

              secondaryAgroProcessingOther:
                farmerProduction.secondaryAgroProcessingOther,

              advancedAgroProcessingOther:
                farmerProduction.advancedAgroProcessingOther,

              provinceObj: farmerProduction.provinceObj,
              metroDistrictObj: farmerProduction.metroDistrictObj,
              farmMuncipalRegionObj: farmerProduction.farmMuncipalRegionObj,
              businessEntityTypeObj: farmerProduction.businessEntityTypeObj,
              createdDate: new Date().getTime(),
              createdByObj: farmerProduction.createdByObj,
              gpsLocation: farmerProduction.gpsLocation,
            };

            let oldFarmerPro = new FarmerProductionHistory(oldObj);
            oldFarmerPro.save(function (err) {
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
                    farmName: req.body.farmName
                      ? req.body.farmName
                      : farmerProduction.farmName,
                    farmLatitude: req.body.farmLatitude
                      ? req.body.farmLatitude
                      : farmerProduction.farmLatitude,
                    farmLongitude: req.body.farmLongitude
                      ? req.body.farmLongitude
                      : farmerProduction.farmLongitude,
                    portionNumber: req.body.portionNumber
                      ? req.body.portionNumber
                      : farmerProduction.portionNumber,
                    portionName: req.body.portionName
                      ? req.body.portionName
                      : farmerProduction.portionName,
                    province: req.body.province
                      ? req.body.province
                      : farmerProduction.province,
                    metroDistrict: req.body.metroDistrict
                      ? req.body.metroDistrict
                      : farmerProduction.metroDistrict,
                    farmMuncipalRegion: req.body.farmMuncipalRegion
                      ? req.body.farmMuncipalRegion
                      : farmerProduction.farmMuncipalRegion,
                    wardNumber: req.body.wardNumber
                      ? req.body.wardNumber
                      : farmerProduction.wardNumber,
                    townVillage: req.body.townVillage
                      ? req.body.townVillage
                      : farmerProduction.townVillage,
                    projectLegalEntityName: req.body.projectLegalEntityName
                      ? req.body.projectLegalEntityName
                      : farmerProduction.projectLegalEntityName,
                    businessEntityType: req.body.businessEntityType
                      ? req.body.businessEntityType
                      : farmerProduction.businessEntityType,
                    totalFarmSize: req.body.totalFarmSize
                      ? JSON.parse(req.body.totalFarmSize)
                      : farmerProduction.totalFarmSize,
                    liveStock: req.body.liveStock
                      ? JSON.parse(req.body.liveStock)
                      : farmerProduction.liveStock,

                    horticulture: req.body.horticulture
                      ? JSON.parse(req.body.horticulture)
                      : farmerProduction.horticulture,
                    horticultureProduction: req.body.HorticultureProduction
                      ? JSON.parse(req.body.HorticultureProduction)
                      : farmerProduction.horticultureProduction,

                    fieldCrops: req.body.fieldCrops
                      ? JSON.parse(req.body.fieldCrops)
                      : farmerProduction.fieldCrops,
                    fieldCropsProduction: req.body.fieldCropsProduction
                      ? JSON.parse(req.body.fieldCropsProduction)
                      : farmerProduction.fieldCropsProduction,

                    forestry: req.body.forestry
                      ? JSON.parse(req.body.forestry)
                      : farmerProduction.forestry,
                    forestryProduction: req.body.forestryProduction
                      ? JSON.parse(req.body.forestryProduction)
                      : farmerProduction.forestryProduction,

                    aquaculture: req.body.aquaculture
                      ? JSON.parse(req.body.aquaculture)
                      : farmerProduction.aquaculture,

                    seaFishing: req.body.seaFishing
                      ? JSON.parse(req.body.seaFishing)
                      : farmerProduction.seaFishing,

                    gameFarming: req.body.gameFarming
                      ? JSON.parse(req.body.gameFarming)
                      : farmerProduction.gameFarming,

                    // marketingChannelType: req.body.marketingChannelType
                    //   ? req.body.marketingChannelType
                    //   : farmerProduction.marketingChannelType,
                    practiseAgroProcessing: req.body.practiseAgroProcessing
                      ? req.body.practiseAgroProcessing
                      : farmerProduction.practiseAgroProcessing,
                    primaryAgroProcessing: req.body.primaryAgroProcessing
                      ? JSON.parse(req.body.primaryAgroProcessing)
                      : farmerProduction.primaryAgroProcessing,

                    secondaryAgroProcessing: req.body.secondaryAgroProcessing
                      ? JSON.parse(req.body.secondaryAgroProcessing)
                      : farmerProduction.secondaryAgroProcessing,

                    advancedAgroProcessing: req.body.advancedAgroProcessing
                      ? JSON.parse(req.body.advancedAgroProcessing)
                      : farmerProduction.advancedAgroProcessing,

                    practiseAgroProcessingManual: req.body
                      .practiseAgroProcessingManual
                      ? req.body.practiseAgroProcessingManual
                      : farmerProduction.practiseAgroProcessingManual,

                    marketingChannelTypeFormal:
                      req.body.marketingChannelTypeFormal,
                    marketingChannelTypeInformal:
                      req.body.marketingChannelTypeInformal,
                    ///
                    liveStockOther: req.body.liveStockOther
                      ? req.body.liveStockOther
                      : farmerProduction.liveStockOther,

                    horticultureOther: req.body.horticultureOther
                      ? req.body.horticultureOther
                      : farmerProduction.horticultureOther,

                    fieldCropsOther: req.body.fieldCropsOther
                      ? req.body.fieldCropsOther
                      : farmerProduction.fieldCropsOther,

                    forestryOther: req.body.forestryOther
                      ? req.body.forestryOther
                      : farmerProduction.forestryOther,

                    aquacultureOther: req.body.aquacultureOther
                      ? req.body.aquacultureOther
                      : farmerProduction.aquacultureOther,

                    seaFishingOther: req.body.seaFishingOther
                      ? req.body.seaFishingOther
                      : farmerProduction.seaFishingOther,

                    gameFarmingOther: req.body.gameFarmingOther
                      ? req.body.gameFarmingOther
                      : farmerProduction.gameFarmingOther,

                    primaryAgroProcessingOther: req.body
                      .primaryAgroProcessingOther
                      ? req.body.primaryAgroProcessingOther
                      : farmerProduction.primaryAgroProcessingOther,

                    secondaryAgroProcessingOther: req.body
                      .secondaryAgroProcessingOther
                      ? req.body.secondaryAgroProcessingOther
                      : farmerProduction.secondaryAgroProcessingOther,

                    advancedAgroProcessingOther: req.body
                      .advancedAgroProcessingOther
                      ? req.body.advancedAgroProcessingOther
                      : farmerProduction.advancedAgroProcessingOther,

                    provinceObj: req.body.provinceObj
                      ? JSON.parse(req.body.provinceObj)
                      : farmerProduction.provinceObj,
                    metroDistrictObj: req.body.metroDistrictObj
                      ? JSON.parse(req.body.metroDistrictObj)
                      : farmerProduction.metroDistrictObj,
                    farmMuncipalRegionObj: req.body.farmMuncipalRegionObj
                      ? JSON.parse(req.body.farmMuncipalRegionObj)
                      : farmerProduction.farmMuncipalRegionObj,
                    businessEntityTypeObj: req.body.businessEntityTypeObj
                      ? JSON.parse(req.body.businessEntityTypeObj)
                      : farmerProduction.businessEntityTypeObj,
                    updatedDate: new Date().setHours(0, 0, 0, 0),
                    updatedByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                    gpsLocation: req.body.gpsLocation
                      ? req.body.gpsLocation
                      : farmerProduction.gpsLocation,
                  }
                : {
                    farmName: req.body.farmName
                      ? req.body.farmName
                      : farmerProduction.farmName,
                    farmLatitude: req.body.farmLatitude
                      ? req.body.farmLatitude
                      : farmerProduction.farmLatitude,
                    farmLongitude: req.body.farmLongitude
                      ? req.body.farmLongitude
                      : farmerProduction.farmLongitude,
                    portionNumber: req.body.portionNumber
                      ? req.body.portionNumber
                      : farmerProduction.portionNumber,
                    portionName: req.body.portionName
                      ? req.body.portionName
                      : farmerProduction.portionName,
                    province: req.body.province
                      ? req.body.province
                      : farmerProduction.province,
                    metroDistrict: req.body.metroDistrict
                      ? req.body.metroDistrict
                      : farmerProduction.metroDistrict,
                    farmMuncipalRegion: req.body.farmMuncipalRegion
                      ? req.body.farmMuncipalRegion
                      : farmerProduction.farmMuncipalRegion,
                    wardNumber: req.body.wardNumber
                      ? req.body.wardNumber
                      : farmerProduction.wardNumber,
                    townVillage: req.body.townVillage
                      ? req.body.townVillage
                      : farmerProduction.townVillage,
                    projectLegalEntityName: req.body.projectLegalEntityName
                      ? req.body.projectLegalEntityName
                      : farmerProduction.projectLegalEntityName,
                    businessEntityType: req.body.businessEntityType
                      ? req.body.businessEntityType
                      : farmerProduction.businessEntityType,
                    totalFarmSize: req.body.totalFarmSize
                      ? req.body.totalFarmSize
                      : farmerProduction.totalFarmSize,
                    liveStock: req.body.liveStock
                      ? req.body.liveStock
                      : farmerProduction.liveStock,
                    liveStockOther: req.body.liveStockOther
                      ? req.body.liveStockOther
                      : farmerProduction.liveStockOther,
                    horticulture: req.body.horticulture
                      ? req.body.horticulture
                      : farmerProduction.horticulture,
                    horticultureProduction: req.body.HorticultureProduction
                      ? req.body.HorticultureProduction
                      : farmerProduction.horticultureProduction,
                    fieldCrops: req.body.fieldCrops
                      ? req.body.fieldCrops
                      : farmerProduction.fieldCrops,
                    fieldCropsProduction: req.body.fieldCropsProduction
                      ? req.body.fieldCropsProduction
                      : farmerProduction.fieldCropsProduction,
                    forestry: req.body.forestry
                      ? req.body.forestry
                      : farmerProduction.forestry,
                    forestryProduction: req.body.forestryProduction
                      ? req.body.forestryProduction
                      : farmerProduction.forestryProduction,
                    aquaculture: req.body.aquaculture
                      ? req.body.aquaculture
                      : farmerProduction.aquaculture,
                    seaFishing: req.body.seaFishing
                      ? req.body.seaFishing
                      : farmerProduction.seaFishing,
                    gameFarming: req.body.gameFarming
                      ? req.body.gameFarming
                      : farmerProduction.gameFarming,
                    // marketingChannelType: req.body.marketingChannelType
                    //   ? req.body.marketingChannelType
                    //   : farmerProduction.marketingChannelType,
                    practiseAgroProcessing: req.body.practiseAgroProcessing
                      ? req.body.practiseAgroProcessing
                      : farmerProduction.practiseAgroProcessing,
                    primaryAgroProcessing: req.body.primaryAgroProcessing
                      ? req.body.primaryAgroProcessing
                      : farmerProduction.primaryAgroProcessing,

                    secondaryAgroProcessing: req.body.secondaryAgroProcessing
                      ? req.body.secondaryAgroProcessing
                      : farmerProduction.secondaryAgroProcessing,
                    advancedAgroProcessing: req.body.advancedAgroProcessing
                      ? req.body.advancedAgroProcessing
                      : farmerProduction.advancedAgroProcessing,
                    practiseAgroProcessingManual: req.body
                      .practiseAgroProcessingManual
                      ? req.body.practiseAgroProcessingManual
                      : farmerProduction.practiseAgroProcessingManual,

                    marketingChannelTypeFormal:
                      req.body.marketingChannelTypeFormal,
                    marketingChannelTypeInformal:
                      req.body.marketingChannelTypeInformal,
                    ///
                    horticultureOther: req.body.horticultureOther
                      ? req.body.horticultureOther
                      : farmerProduction.horticultureOther,

                    fieldCropsOther: req.body.fieldCropsOther
                      ? req.body.fieldCropsOther
                      : farmerProduction.fieldCropsOther,

                    forestryOther: req.body.forestryOther
                      ? req.body.forestryOther
                      : farmerProduction.forestryOther,

                    aquacultureOther: req.body.aquacultureOther
                      ? req.body.aquacultureOther
                      : farmerProduction.aquacultureOther,

                    seaFishingOther: req.body.seaFishingOther
                      ? req.body.seaFishingOther
                      : farmerProduction.seaFishingOther,

                    gameFarmingOther: req.body.gameFarmingOther
                      ? req.body.gameFarmingOther
                      : farmerProduction.gameFarmingOther,

                    primaryAgroProcessingOther: req.body
                      .primaryAgroProcessingOther
                      ? req.body.primaryAgroProcessingOther
                      : farmerProduction.primaryAgroProcessingOther,

                    secondaryAgroProcessingOther: req.body
                      .secondaryAgroProcessingOther
                      ? req.body.secondaryAgroProcessingOther
                      : farmerProduction.secondaryAgroProcessingOther,

                    advancedAgroProcessingOther: req.body
                      .advancedAgroProcessingOther
                      ? req.body.advancedAgroProcessingOther
                      : farmerProduction.advancedAgroProcessingOther,

                    provinceObj: req.body.provinceObj
                      ? req.body.provinceObj
                      : farmerProduction.provinceObj,
                    metroDistrictObj: req.body.metroDistrictObj
                      ? req.body.metroDistrictObj
                      : farmerProduction.metroDistrictObj,
                    farmMuncipalRegionObj: req.body.farmMuncipalRegionObj
                      ? req.body.farmMuncipalRegionObj
                      : farmerProduction.farmMuncipalRegionObj,
                    businessEntityTypeObj: req.body.businessEntityTypeObj
                      ? req.body.businessEntityTypeObj
                      : farmerProduction.businessEntityTypeObj,
                    updatedDate: new Date().setHours(0, 0, 0, 0),
                    updatedByObj: {
                      email: req.user.email,
                      name: req.user.firstName + " " + req.user.lastName,
                    },
                    gpsLocation: req.body.gpsLocation
                      ? req.body.gpsLocation
                      : farmerProduction.gpsLocation,
                  };

            FarmerProduction.findOneAndUpdate(
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
                  //update farmer details for region field
                  if (!req.body.deviceType) req.body.deviceType = "web";
                  let region =
                    req.body.deviceType !== "web"
                      ? {
                          // provinceObj: req.body.provinceObj
                          //   ? JSON.parse(req.body.provinceObj)
                          //   : farmerProduction.provinceObj,
                          metroDistrictObj: req.body.metroDistrictObj
                            ? JSON.parse(req.body.metroDistrictObj)
                            : farmerProduction.metroDistrictObj,
                          farmMuncipalRegionObj: req.body.farmMuncipalRegionObj
                            ? JSON.parse(req.body.farmMuncipalRegionObj)
                            : farmerProduction.farmMuncipalRegionObj,
                        }
                      : {
                          // provinceObj: req.body.provinceObj
                          //   ? req.body.provinceObj
                          //   : farmerProduction.provinceObj,
                          metroDistrictObj: req.body.metroDistrictObj
                            ? req.body.metroDistrictObj
                            : farmerProduction.metroDistrictObj,
                          farmMuncipalRegionObj: req.body.farmMuncipalRegionObj
                            ? req.body.farmMuncipalRegionObj
                            : farmerProduction.farmMuncipalRegionObj,
                        };

                  await FarmerDetail.updateOne(
                    {
                      _id: req.body.farmerId,
                    },
                    { $set: { regionObj: region } }
                  );

                  //if record exist, updates asset table also to maintain consistency
                  await FarmAssetsServices.updateOne(
                    {
                      farmerId: req.body.farmerId,
                    },
                    { $set: { regionObj: region } }
                  );

                  var result = JSON.parse(JSON.stringify(result));

                  if (req.user._id)
                    loghistory(
                      req.user._id,
                      "Farmer Production Updated",
                      "Update",
                      "farmer_productions",
                      "Farmer Production edit",
                      req.get("referer"),
                      farmerProduction,
                      result
                    );

                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: req.body.farmName + " Updated Successfully.",
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

router.get("/api/farmerProductionList", auth, async function (req, res) {
  let dbquery = {};

  if (req.query.farmerId) {
    dbquery.farmerId = req.query.farmerId;
  }

  FarmerProduction.find(dbquery)
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
      FarmerProduction.find(dbquery, {}).exec(function (err, info) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: "error",
          });
        } else {
          var results = [];

          //    var totalPages = Math.ceil(totalCount / size)
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

router.get("/api/farmerProductionHistory", auth, async function (req, res) {
  let dbquery = {};

  if (req.query.farmerId) {
    dbquery.farmerId = req.query.farmerId;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }

  FarmerProductionHistory.find(dbquery)
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
      FarmerProductionHistory.find(dbquery, {}).exec(function (err, info) {
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
