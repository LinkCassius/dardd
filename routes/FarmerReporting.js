var mongoose = require("mongoose");
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var FarmerDetail = require("../models/FarmerDetail");
var FarmerDetailHistory = require("../models/FarmerDetailHistory");
var FarmerProduction = require("../models/FarmerProduction");
var FarmAssetsServices = require("../models/FarmAssetsServices");
var moment = require("moment");
var { User } = require("../models/User");
var Cnd = require("../models/Cnds");
const auth = require("../middleware/auth");
const fs = require("fs");

router.get("/api/farmerreporting", auth, async (req, res) => {
  let id = req.query.id;

  const farmerArr = await FarmerDetail.aggregate([
    {
      $match: {
        $and: [{ status: { $ne: "Deleted" } }],
      },
    },
    { $sort: { _id: -1 } },
    //{ $skip: 10 },
    //{ $limit: 50 },
    {
      $lookup: {
        from: "farmer_productions",
        localField: "_id",
        foreignField: "farmerId",
        as: "farmerProduction",
      },
    },
    {
      $lookup: {
        from: "farmer_assets_services",
        localField: "_id",
        foreignField: "farmerId",
        as: "farmerAssetsServices",
      },
    },
    {
      $project: {
        farmerType: 1,
        ownershipTypeObj: 1,
        landAquisitionObj: 1,
        ageGroupsObj: 1,
        gender: 1,
        populationGroupObj: 1,
        homeLanguageObj: 1,
        operationType: 1,
        programmeRedistributionObj: 1,
        isDisabled: 1,
        "farmerProduction.businessEntityTypeObj": 1,
        "farmerProduction.totalFarmSize": 1,
        "farmerProduction.liveStock": 1,
        "farmerProduction.aquaculture": 1,
        "farmerProduction.seaFishing": 1,
        "farmerProduction.gameFarming": 1,

        "farmerAssetsServices.annualTurnoverObj": 1,
        "farmerAssetsServices.fixedStructures": 1,
        "farmerAssetsServices.irrigationSystems": 1,
        "farmerAssetsServices.waterInfrastructure": 1,
        "farmerAssetsServices.machineryVehicles": 1,
        "farmerAssetsServices.implementsEquipment": 1,
        "farmerAssetsServices.otherAssets": 1,
        "farmerAssetsServices.isAccessToDipTank": 1,
        "farmerAssetsServices.dipTankValue": 1,
        "farmerAssetsServices.haveVeterinaryServices": 1,
        "farmerAssetsServices.veterinaryServiceType": 1,
        "farmerAssetsServices.govtSupport": 1,
      },
    },
  ]);

  let result = [];

  if (id == "0") {
    result.push(
      groupsDirectField_Without_Table(
        farmerArr,
        "farmerType",
        "FARMER CATEGORY",
        "Doughnut"
      )
    );

    result.push(
      groupsObj_With_Table_With_CndName(
        farmerArr,
        "farmerProduction",
        "businessEntityTypeObj",
        "REGISTERED ENTITY",
        "Bar"
      )
    );
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "ownershipTypeObj",
        "TYPE OF OWNERSHIP",
        "Bar"
      )
    );

    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "landAquisitionObj",
        "LAND AQUISITION",
        "Bar"
      )
    );

    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "ageGroupsObj",
        "FARMER AGE GROUPS",
        "Bar"
      )
    );

    result.push(
      groupsDirectField_Without_Table(farmerArr, "gender", "GENDER", "Pie")
    );

    result.push(
      groupsDirectField_Without_Table_YorN_Count(
        farmerArr,
        "isDisabled",
        "PWDs",
        "Pie"
      )
    );

    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "populationGroupObj",
        "POPULATION GROUP",
        "Bar"
      )
    );

    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "homeLanguageObj",
        "LANGUAGE",
        "Bar"
      )
    );

    result.push(
      groupsDirectField_Without_Table(
        farmerArr,
        "operationType",
        "RUNNING FARM",
        "Pie"
      )
    );

    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "programmeRedistributionObj",
        "REDISTRIBUTION",
        "Bar"
      )
    );

    result.push(
      groupsObj_With_Table_CountsObjValues_Without_CndName(
        farmerArr,
        "farmerAssetsServices",
        "govtSupport",
        "Support Programme",
        "Bar"
      )
    );

    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "totalFarmSize",
        "FARM SIZE",
        "Bar"
      )
    );

    result.push(
      groupsObj_With_Table_With_CndName(
        farmerArr,
        "farmerAssetsServices",
        "annualTurnoverObj",
        "ANNUAL TURNOVER",
        "Bar"
      )
    );
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "liveStock",
        "LIVESTOCK",
        "Bar"
      )
    );
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "aquaculture",
        "AQUACULTURE",
        "Bar"
      )
    );
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "seaFishing",
        "SEA FISHING",
        "Bar"
      )
    );
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "gameFarming",
        "GAME FARMING",
        "Bar"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Farm House/Stead",
        "Fixed Structures - FARM HOUSE STEAD",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Storage Rooms/ Sheds",
        "Fixed Structures - STORAGE",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Poultry houses",
        "Fixed Structures - POULTRY HOUSES",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Pigsty",
        "Fixed Structures - PIGSTY",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Packhouse",
        "Fixed Structures - PARKHOUSE",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Fencing",
        "Fixed Structures - FENCING",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Other",
        "Fixed Structures - OTHER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Drip/Micro Irrigation",
        "Irrigation System - MICRO",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Sprinkler Irrigation",
        "Irrigation System - SPRINKLER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Centre Pivots",
        "Irrigation System - CENTRE PIVOT",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Furrow Irrigation",
        "Irrigation System - FURROW",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Flood Irrigation",
        "Irrigation System - FLOOD",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Other",
        "Irrigation System - OTHER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "River",
        "Water Infrastructure - RIVER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Dams (Catchment Areas)",
        "Water Infrastructure - DAMS",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Canal",
        "Water Infrastructure - CANAL",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Boreholes/Windmills",
        "Water Infrastructure - BOREHOLES",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Other",
        "Water Infrastructure - OTHER",
        "Pie"
      )
    );

    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Tractor",
        "Machinery - TRACTOR",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Combine Harvester",
        "Machinery - COMBINE HARVESTER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Truck",
        "Machinery - TRUCK",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Light Delivery Vehicle/Bakkie",
        "Machinery - LIGHT DELIVERY VEHICLE",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Other",
        "Machinery - OTHER",
        "Pie"
      )
    );

    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Plough",
        "Implements - PLOUGH",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Planter",
        "Implements - PLANTER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Tiller",
        "Implements - TILLER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Garden Tools",
        "Implements - GARDEN TOOLS",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Trailer",
        "Implements - TRAILER",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Other",
        "Implements - OTHER",
        "Pie"
      )
    );

    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Dip Tank",
        "Other - DIP TANK",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Access Road",
        "Other - ACCESS ROAD",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Electricity",
        "Other - ELECTRICITY",
        "Pie"
      )
    );
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Other",
        "Other - OTHER",
        "Pie"
      )
    );
    result.push(
      groupsDirectField_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "isAccessToDipTank",
        "DIP TANK",
        "Bar"
      )
    );

    result.push(
      groupsDirectField_With_Table(
        farmerArr,
        "farmerAssetsServices",
        "dipTankValue",
        "Dip Tank - TYPES",
        "Pie"
      )
    );

    result.push(
      groupsDirectField_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "haveVeterinaryServices",
        "VETERINARY SERVICES",
        "Pie"
      )
    );

    result.push(
      groupsDirectField_With_Table(
        farmerArr,
        "farmerAssetsServices",
        "veterinaryServiceType",
        "Veterinary Services - TYPES",
        "Pie"
      )
    );
  }

  /*
  if (id == "1") result.push(farmerType(farmerArr));
  if (id == "2") result.push(businessEntityType(farmerArr));
  if (id == "3") result.push(ownershipType(farmerArr));
  if (id == "4") result.push(landAquisition(farmerArr));
  if (id == "5") result.push(ageGroups(farmerArr));
  if (id == "6") result.push(gender(farmerArr));
  if (id == "7") result.push(isDisabled(farmerArr));
  if (id == "8") result.push(population(farmerArr));
  if (id == "9") result.push(language(farmerArr));
  if (id == "10") result.push(operationType(farmerArr));
  if (id == "11") result.push(redistributionProgramme(farmerArr));
  if (id == "50") result.push(govtSupport(farmerArr));
  if (id == "51") result.push(totalFarmSize(farmerArr));
  if (id == "12") result.push(annualTurnover(farmerArr));
  if (id == "12")
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(farmerArr, "farmerProduction", "liveStock", "LIVESTOCK")
    );

  if (id == "13") result.push(fixedStructures_FarmHouse(farmerArr));
  if (id == "14") result.push(fixedStructures_Storage(farmerArr));
  if (id == "15") result.push(fixedStructures_PoultryHouses(farmerArr));
  if (id == "16") result.push(fixedStructures_Pigsty(farmerArr));
  if (id == "17") result.push(fixedStructures_Packhouse(farmerArr));
  if (id == "18") result.push(fixedStructures_Fencing(farmerArr));
  if (id == "19") result.push(fixedStructures_Other(farmerArr));

  if (id == "20") result.push(irrigationSystems_Drip(farmerArr));
  if (id == "21") result.push(irrigationSystems_Sprinkler(farmerArr));
  if (id == "22") result.push(irrigationSystems_Pivots(farmerArr));
  if (id == "23") result.push(irrigationSystems_Furrow(farmerArr));
  if (id == "24") result.push(irrigationSystems_Flood(farmerArr));
  if (id == "25") result.push(irrigationSystems_Other(farmerArr));

  if (id == "26") result.push(waterInfrastructure_River(farmerArr));
  if (id == "27") result.push(waterInfrastructure_Dams(farmerArr));
  if (id == "28") result.push(waterInfrastructure_Canal(farmerArr));
  if (id == "29") result.push(waterInfrastructure_Boreholes(farmerArr));
  if (id == "30") result.push(waterInfrastructure_Other(farmerArr));

  if (id == "31") result.push(machineryVehicles_Tractor(farmerArr));
  if (id == "32") result.push(machineryVehicles_Harvester(farmerArr));
  if (id == "33") result.push(machineryVehicles_Truck(farmerArr));
  if (id == "34") result.push(machineryVehicles_Vehicle(farmerArr));
  if (id == "35") result.push(machineryVehicles_Other(farmerArr));

  if (id == "36") result.push(implementsEquipment_Plough(farmerArr));
  if (id == "37") result.push(implementsEquipment_Planter(farmerArr));
  if (id == "38") result.push(implementsEquipment_Tiller(farmerArr));
  if (id == "39") result.push(implementsEquipment_Garden(farmerArr));
  if (id == "40") result.push(implementsEquipment_Trailer(farmerArr));
  if (id == "41") result.push(implementsEquipment_Other(farmerArr));

  if (id == "42") result.push(otherAssets_Dip(farmerArr));
  if (id == "43") result.push(otherAssets_Access(farmerArr));
  if (id == "44") result.push(otherAssets_Electricity(farmerArr));
  if (id == "45") result.push(otherAssets_Other(farmerArr));

  if (id == "46") result.push(isAccessToDipTank(farmerArr));
  if (id == "47") result.push(dipTankValue(farmerArr));
  if (id == "48") result.push(haveVeterinaryServices(farmerArr));
  if (id == "49") result.push(veterinaryServiceType(farmerArr));
*/

  if (id == "1")
    result.push(
      groupsDirectField_Without_Table(
        farmerArr,
        "farmerType",
        "FARMER CATEGORY",
        "Doughnut"
      )
    );

  if (id == "2")
    result.push(
      groupsObj_With_Table_With_CndName(
        farmerArr,
        "farmerProduction",
        "businessEntityTypeObj",
        "REGISTERED ENTITY",
        "Bar"
      )
    );
  if (id == "3")
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "ownershipTypeObj",
        "TYPE OF OWNERSHIP",
        "Bar"
      )
    );

  if (id == "4")
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "landAquisitionObj",
        "LAND AQUISITION",
        "Bar"
      )
    );

  if (id == "5")
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "ageGroupsObj",
        "FARMER AGE GROUPS",
        "Bar"
      )
    );

  if (id == "6")
    result.push(
      groupsDirectField_Without_Table(farmerArr, "gender", "GENDER", "Pie")
    );

  if (id == "7")
    result.push(
      groupsDirectField_Without_Table_YorN_Count(
        farmerArr,
        "isDisabled",
        "PWDs",
        "Pie"
      )
    );

  if (id == "8")
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "populationGroupObj",
        "POPULATION GROUP",
        "Bar"
      )
    );

  if (id == "9")
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "homeLanguageObj",
        "LANGUAGE",
        "Bar"
      )
    );

  if (id == "10")
    result.push(
      groupsDirectField_Without_Table(
        farmerArr,
        "operationType",
        "RUNNING FARM",
        "Pie"
      )
    );

  if (id == "11")
    result.push(
      groupsObj_Without_Table_With_CndName(
        farmerArr,
        "programmeRedistributionObj",
        "REDISTRIBUTION",
        "Bar"
      )
    );

  if (id == "12")
    result.push(
      groupsObj_With_Table_CountsObjValues_Without_CndName(
        farmerArr,
        "farmerAssetsServices",
        "govtSupport",
        "Support Programme",
        "Bar"
      )
    );

  if (id == "13")
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "totalFarmSize",
        "FARM SIZE",
        "Bar"
      )
    );

  if (id == "14")
    result.push(
      groupsObj_With_Table_With_CndName(
        farmerArr,
        "farmerAssetsServices",
        "annualTurnoverObj",
        "ANNUAL TURNOVER",
        "Bar"
      )
    );
  if (id == "15")
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "liveStock",
        "LIVESTOCK",
        "Bar"
      )
    );
  if (id == "16")
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "aquaculture",
        "AQUACULTURE",
        "Bar"
      )
    );
  if (id == "17")
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "seaFishing",
        "SEA FISHING",
        "Bar"
      )
    );
  if (id == "18")
    result.push(
      groupsObj_With_Table_SumsObjValues_Without_CndName(
        farmerArr,
        "farmerProduction",
        "gameFarming",
        "GAME FARMING",
        "Bar"
      )
    );
  if (id == "19")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Farm House/Stead",
        "Fixed Structures - FARM HOUSE STEAD",
        "Pie"
      )
    );
  if (id == "20")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Storage Rooms/ Sheds",
        "Fixed Structures - STORAGE",
        "Pie"
      )
    );
  if (id == "21")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Poultry houses",
        "Fixed Structures - POULTRY HOUSES",
        "Pie"
      )
    );
  if (id == "22")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Pigsty",
        "Fixed Structures - PIGSTY",
        "Pie"
      )
    );
  if (id == "23")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Packhouse",
        "Fixed Structures - PARKHOUSE",
        "Pie"
      )
    );
  if (id == "24")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Fencing",
        "Fixed Structures - FENCING",
        "Pie"
      )
    );
  if (id == "25")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "fixedStructures",
        "Other",
        "Fixed Structures - OTHER",
        "Pie"
      )
    );
  if (id == "26")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Drip/Micro Irrigation",
        "Irrigation System - MICRO",
        "Pie"
      )
    );
  if (id == "27")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Sprinkler Irrigation",
        "Irrigation System - SPRINKLER",
        "Pie"
      )
    );
  if (id == "28")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Centre Pivots",
        "Irrigation System - CENTRE PIVOT",
        "Pie"
      )
    );
  if (id == "29")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Furrow Irrigation",
        "Irrigation System - FURROW",
        "Pie"
      )
    );
  if (id == "30")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Flood Irrigation",
        "Irrigation System - FLOOD",
        "Pie"
      )
    );
  if (id == "31")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "irrigationSystems",
        "Other",
        "Irrigation System - OTHER",
        "Pie"
      )
    );
  if (id == "32")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "River",
        "Water Infrastructure - RIVER",
        "Pie"
      )
    );
  if (id == "33")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Dams (Catchment Areas)",
        "Water Infrastructure - DAMS",
        "Pie"
      )
    );
  if (id == "34")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Canal",
        "Water Infrastructure - CANAL",
        "Pie"
      )
    );
  if (id == "35")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Boreholes/Windmills",
        "Water Infrastructure - BOREHOLES",
        "Pie"
      )
    );
  if (id == "36")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "waterInfrastructure",
        "Other",
        "Water Infrastructure - OTHER",
        "Pie"
      )
    );

  if (id == "37")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Tractor",
        "Machinery - TRACTOR",
        "Pie"
      )
    );
  if (id == "38")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Combine Harvester",
        "Machinery - COMBINE HARVESTER",
        "Pie"
      )
    );
  if (id == "39")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Truck",
        "Machinery - TRUCK",
        "Pie"
      )
    );
  if (id == "40")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Light Delivery Vehicle/Bakkie",
        "Machinery - LIGHT DELIVERY VEHICLE",
        "Pie"
      )
    );
  if (id == "41")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "machineryVehicles",
        "Other",
        "Machinery - OTHER",
        "Pie"
      )
    );

  if (id == "42")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Plough",
        "Implements - PLOUGH",
        "Pie"
      )
    );
  if (id == "43")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Planter",
        "Implements - PLANTER",
        "Pie"
      )
    );
  if (id == "44")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Tiller",
        "Implements - TILLER",
        "Pie"
      )
    );
  if (id == "45")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Garden Tools",
        "Implements - GARDEN TOOLS",
        "Pie"
      )
    );
  if (id == "46")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Trailer",
        "Implements - TRAILER",
        "Pie"
      )
    );
  if (id == "47")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "implementsEquipment",
        "Other",
        "Implements - OTHER",
        "Pie"
      )
    );

  if (id == "48")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Dip Tank",
        "Other - DIP TANK",
        "Pie"
      )
    );
  if (id == "49")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Access Road",
        "Other - ACCESS ROAD",
        "Pie"
      )
    );
  if (id == "50")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Electricity",
        "Other - ELECTRICITY",
        "Pie"
      )
    );
  if (id == "51")
    result.push(
      groupsObj_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "otherAssets",
        "Other",
        "Other - OTHER",
        "Pie"
      )
    );
  if (id == "52")
    result.push(
      groupsDirectField_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "isAccessToDipTank",
        "DIP TANK",
        "Bar"
      )
    );

  if (id == "53")
    result.push(
      groupsDirectField_With_Table(
        farmerArr,
        "farmerAssetsServices",
        "dipTankValue",
        "Dip Tank - TYPES",
        "Pie"
      )
    );

  if (id == "54")
    result.push(
      groupsDirectField_With_Table_Without_CndName_YorN_Count(
        farmerArr,
        "farmerAssetsServices",
        "haveVeterinaryServices",
        "VETERINARY SERVICES",
        "Pie"
      )
    );

  if (id == "55")
    result.push(
      groupsDirectField_With_Table(
        farmerArr,
        "farmerAssetsServices",
        "veterinaryServiceType",
        "Veterinary Services - TYPES",
        "Pie"
      )
    );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    result: result,
  });
});

//groupsDirectField_Without_Table - this method get count of different values of same field (direct field not obj field)
function groupsDirectField_Without_Table(farmerArr, field, title, chartType) {
  const filteredArray = farmerArr.filter((item) => item[field]);

  let filterObj = filteredArray.reduce(function (r, a) {
    r[a[field]] = r[a[field]] || [];
    r[a[field]].push(a);
    return r;
  }, {});

  let Obj = {};
  for (let [groupName, values] of Object.entries(filterObj)) {
    Obj[groupName] = [
      values.length,
      ((values.length / farmerArr.length) * 100).toFixed(2),
    ];
  }
  Obj["Total"] = [farmerArr.length, "100"];

  console.log("voj : ", Obj);
  return {
    name: title,
    values: Obj,
    chartType: chartType,
  };
}

function groupsDirectField_Without_Table_YorN_Count(
  farmerArr,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter((item) => item[field] != undefined);

  let var_true = filteredArray.filter((d) => d[field] == true).length;

  let var_false = filteredArray.filter((d) => d[field] == false).length;

  return {
    name: title,
    values: {
      No: [var_false, ((var_false / filteredArray.length) * 100).toFixed(2)],

      Yes: [var_true, ((var_true / filteredArray.length) * 100).toFixed(2)],
      Total: [filteredArray.length, "100"],
    },
    chartType: chartType,
  };
}

function groupsDirectField_With_Table(
  farmerArr,
  table,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) => item[table][0] && item[table][0][field]
  );

  let dipTankType = filteredArray.reduce(function (r, a) {
    r[a[table][0][field]] = r[a[table][0][field]] || [];
    r[a[table][0][field]].push(a);
    return r;
  }, {});

  let obj = {};
  for (let [groupName, values] of Object.entries(dipTankType)) {
    obj[groupName] = [
      values.length,
      ((values.length / filteredArray.length) * 100).toFixed(2),
    ];
  }
  obj["Total"] = [filteredArray.length, "100"];
  return {
    name: title,
    values: obj,
    chartType: chartType,
  };
}

//groupsDirectField_Without_Table - this method get count of different values of same field (obj field)
//production table or assets table
function groupsObj_With_Table_With_CndName(
  farmerArr,
  table,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) =>
      item[table][0] &&
      item[table][0][field] &&
      item[table][0][field]["cndName"]
  );

  let type = filteredArray.reduce(function (r, a) {
    r[a[table][0][field]["cndName"]] = r[a[table][0][field]["cndName"]] || [];
    r[a[table][0][field]["cndName"]].push(a);
    return r;
  }, {});

  let obj = {};
  for (let [groupName, values] of Object.entries(type)) {
    obj[groupName] = [
      values.length,
      ((values.length / farmerArr.length) * 100).toFixed(2),
    ];
  }
  obj["Total"] = [farmerArr.length, "100"];
  return {
    name: title,
    values: obj,
    chartType: chartType,
  };
}

//groupsDirectField_Without_Table - this method get count of different values of same field (obj field)
//details table //table not required
function groupsObj_Without_Table_With_CndName(
  farmerArr,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) => item[field] && item[field]["cndName"]
  );

  let type = filteredArray.reduce(function (r, a) {
    r[a[field]["cndName"]] = r[a[field]["cndName"]] || [];
    r[a[field]["cndName"]].push(a);
    return r;
  }, {});

  let obj = {};
  for (let [groupName, values] of Object.entries(type)) {
    if (groupName === "A Community (Communal Land/Tribal Authority) ") {
      obj["Community"] = [
        values.length,
        ((values.length / farmerArr.length) * 100).toFixed(2),
      ];
    } else
      obj[groupName] = [
        values.length,
        ((values.length / farmerArr.length) * 100).toFixed(2),
      ];
  }
  obj["Total"] = [farmerArr.length, "100"];
  return {
    name: title,
    values: obj,
    chartType: chartType,
  };
}

//groupsObj_With_Table_SumsObjValues_Without_CndName - this function gets summation of field's - obj values
function groupsObj_With_Table_SumsObjValues_Without_CndName(
  farmerArr,
  table,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) => item[table][0] && item[table][0][field]
  );
  let keysObj = {};
  let obj = {};
  if (filteredArray.length > 0) {
    for (let [key, value] of Object.entries(
      filteredArray[0][table][0][field]
    )) {
      keysObj[key] = 0;
    }

    filteredArray.map(function (item) {
      for (let [key, value] of Object.entries(item[table][0][field])) {
        if (keysObj.hasOwnProperty(key)) {
          let keyValue = keysObj[key];
          if (value != "" && key != "Total") {
            if (!isNaN(value.replace(/\s/g, ""))) {
              keysObj[key] =
                parseFloat(keyValue) + parseFloat(value.replace(/\s/g, ""));
            } else {
              console.log("isNAN : ", key, value.replace(/\s/g, ""));
            }
          }
        }
      }
    });

    // fs.writeFile("public/uploads/test.txt", x.toString(), (err) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   //file written successfully
    // });

    let objLength = (obj) => Object.values(obj).reduce((a, b) => a + b);

    for (let [groupName, values] of Object.entries(keysObj)) {
      obj[groupName] = [
        field === "totalFarmSize" ? values.toFixed(2) : values,
        ((values / objLength(keysObj)) * 100).toFixed(2),
      ];
    }
    obj["Total"] = [
      field === "totalFarmSize"
        ? objLength(keysObj).toFixed(2)
        : objLength(keysObj),
      "100",
    ];

    return {
      name: title,
      values: obj,
      chartType: chartType,
    };
  }
}

//groupsObj_With_Table_SumsObjValues_Without_CndName - this function gets summation of field's - obj values
function groupsObj_With_Table_CountsObjValues_Without_CndName(
  farmerArr,
  table,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) => item[table][0] && item[table][0][field]
  );
  let keysObj = {};
  let obj = {};
  if (filteredArray.length > 0) {
    for (let [key, value] of Object.entries(
      filteredArray[0][table][0][field]
    )) {
      keysObj[key] = 0;
    }

    filteredArray.map(function (item) {
      for (let [key, value] of Object.entries(item[table][0][field])) {
        if (keysObj.hasOwnProperty(key)) {
          let keyValue = keysObj[key];
          if (value == true) {
            keysObj[key] = keyValue + 1;
          }
        }
      }
    });

    let objLength = (obj) => Object.values(obj).reduce((a, b) => a + b);

    for (let [groupName, values] of Object.entries(keysObj)) {
      if (groupName === "AgriBEE (eg Equity Programme)")
        obj["AgriBEE"] = [
          values,
          ((values / objLength(keysObj)) * 100).toFixed(2),
        ];
      else
        obj[groupName] = [
          values,
          ((values / objLength(keysObj)) * 100).toFixed(2),
        ];
    }
    obj["Total"] = [objLength(keysObj), "100"];

    return {
      name: title,
      values: obj,
      chartType: chartType,
    };
  }
}

//groupsObj_With_Table_Without_CndName_YorN_Count - this function gets count (how many times) of field's - obj values
function groupsObj_With_Table_Without_CndName_YorN_Count(
  farmerArr,
  table,
  field,
  fieldValue,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) =>
      item[table][0] &&
      item[table][0][field] &&
      item[table][0][field][fieldValue] != undefined
  );

  let var_true = filteredArray.filter(
    (d) => d[table][0][field][fieldValue] == true
  ).length;

  let var_false = filteredArray.filter(
    (d) => d[table][0][field][fieldValue] == false
  ).length;

  return {
    name: title,
    values: {
      No: [var_false, ((var_false / filteredArray.length) * 100).toFixed(2)],

      Yes: [var_true, ((var_true / filteredArray.length) * 100).toFixed(2)],
      Total: [filteredArray.length, "100"],
    },
    chartType: chartType,
  };
}

function groupsDirectField_With_Table_Without_CndName_YorN_Count(
  farmerArr,
  table,
  field,
  title,
  chartType
) {
  const filteredArray = farmerArr.filter(
    (item) => item[table][0] && item[table][0][field] != undefined
  );

  let var_true = filteredArray.filter((d) => d[table][0][field] == true).length;

  let var_false = filteredArray.filter(
    (d) => d[table][0][field] == false
  ).length;

  return {
    name: title,
    values: {
      No: [var_false, ((var_false / filteredArray.length) * 100).toFixed(2)],

      Yes: [var_true, ((var_true / filteredArray.length) * 100).toFixed(2)],
      Total: [filteredArray.length, "100"],
    },
    chartType: chartType,
  };
}

module.exports = router;

//initial code
//   let farmerType_Commercial = farmerArr.filter(
//     (d) => d.farmerType === "Commercial"
//   ).length;
//   let farmerType_Subsistence = farmerArr.filter(
//     (d) => d.farmerType === "Subsistence"
//   ).length;
//   let farmerType_Smallholder = farmerArr.filter(
//     (d) => d.farmerType === "Smallholder"
//   ).length;

//   result.push({
//     name: "Farmer Category",
//     values: {
//       Commercial: [
//         farmerType_Commercial,
//         ((farmerType_Commercial / farmerArr.length) * 100).toFixed(2),
//       ],
//       Subsistence: [
//         farmerType_Subsistence,
//         ((farmerType_Subsistence / farmerArr.length) * 100).toFixed(2),
//       ],
//       Smallholder: [
//         farmerType_Smallholder,
//         ((farmerType_Smallholder / farmerArr.length) * 100).toFixed(2),
//       ],
//       Total: [farmerArr.length, "100"],
//     },
//   });
