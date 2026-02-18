var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
var FarmerDetail = require("../models/FarmerDetail");
var FarmerProduction = require("../models/FarmerProduction");
var FarmAssetsServices = require("../models/FarmAssetsServices");
var Interactions = require("../models/FarmerInteractions");

const Excel = require("exceljs");
var fs = require("fs");
const XlsxPopulate = require("xlsx-populate");

const workbookNew = new Excel.Workbook();
const worksheetNew = workbookNew.addWorksheet(
  "Farmers",

  { views: [{ state: "frozen", xSplit: 4, ySplit: 1 }] }
);

const farmerColumns = [
  {
    header: "Latitude",
    key: "farmLatitude",
    width: 12,
  },
  {
    header: "Longitude",
    key: "farmLongitude",
    width: 12,
  },
  {
    header: "ProducerSurname",
    key: "surname",
    width: 25,
  },
  {
    header: "Names",
    key: "name",
    width: 25,
  },
  {
    header: "IdentityNumber",
    key: "identityNumber",
    width: 25,
  },
  {
    header: "ContactNo",
    key: "contactNumber",
    width: 15,
  },
  {
    header: "Nationality",
    key: "nationality",
    width: 15,
  },
  {
    header: "EmailAddress",
    key: "email",
    width: 25,
  },
  {
    header: "IsDisabled",
    key: "isDisabled",
    width: 15,
  },
  {
    header: "FarmerType",
    key: "farmerType",
    width: 15,
  },
  {
    header: "ResidentialAddress",
    key: "residentialAddress",
    width: 25,
  },
  {
    header: "ResidentialPostalcode",
    key: "residentialPostalcode",
    width: 25,
  },
  {
    header: "PostalAddress",
    key: "postalAddress",
    width: 25,
  },
  {
    header: "Postalcode",
    key: "postalcode",
    width: 25,
  },
  {
    header: "FarmingExperience",
    key: "farmingExperience",
    width: 25,
  },
  {
    header: "FarmingExperienceYears",
    key: "farmingExperienceYears",
    width: 25,
  },
  {
    header: "ProducerAgeGroups",
    key: "ageGroups",
    width: 25,
  },
  {
    header: "ProducerGender",
    key: "gender",
    width: 25,
  },
  {
    header: "PopulationGroup",
    key: "populationGroup",
    width: 25,
  },
  {
    header: "PopulationGroupSpecify",
    key: "populationGroupOther",
    width: 25,
  },
  {
    header: "Language",
    key: "homeLanguage",
    width: 25,
  },
  {
    header: "LanguageOther",
    key: "homeLanguageOther",
    width: 25,
  },
  {
    header: "HighestLevelEducation",
    key: "education",
    width: 25,
  },
  {
    header: "FulltimeOrParttimeBasis",
    key: "operationType",
    width: 25,
  },

  {
    header: "OwnerOfTheFarm",
    key: "isOwner",
    width: 25,
  },
  {
    header: "IndicateTheOwnership",
    key: "ownershipType",
    width: 25,
  },
  {
    header: "OwnershipOtherSpecify",
    key: "otherOwnerShip",
    width: 25,
  },
  {
    header: "FarmOrLandAcquired",
    key: "landAquisition",
    width: 25,
  },
  {
    header: "LandAcquiredOtherSpecify",
    key: "landAquisitionOther",
    width: 25,
  },
  {
    header: "RedistributionProgramme",
    key: "programmeRedistribution",
    width: 25,
  },
  {
    header: "RedistributionOtherSpecify",
    key: "programmeRedistributionOther",
    width: 25,
  },
  {
    header: "NoOfEmployeesTotal",
    key: "NoOfEmployeesTotal",
    width: 25,
  },
  {
    header: "NoOfEmployeesMales",
    key: "NoOfEmployeesMales",
    width: 25,
  },
  {
    header: "NoOfEmployeesFemales",
    key: "NoOfEmployeesFemales",
    width: 25,
  },
  {
    header: "NoOfEmployeesYouth",
    key: "NoOfEmployeesYouth",
    width: 25,
  },
  {
    header: "NoOfEmployeesDisable",
    key: "NoOfEmployeesDisable",
    width: 25,
  },
  {
    header: "EmploymentTypeMaleP",
    key: "EmploymentTypeMaleP",
    width: 25,
  },
  {
    header: "EmploymentTypeFemaleP",
    key: "EmploymentTypeFemaleP",
    width: 25,
  },
  {
    header: "EmploymentTypeYouthMaleP",
    key: "EmploymentTypeYouthMaleP",
    width: 25,
  },
  {
    header: "EmploymentTypeYouthFemaleP",
    key: "EmploymentTypeYouthFemaleP",
    width: 25,
  },
  {
    header: "EmploymentTypeMaleS",
    key: "EmploymentTypeMaleS",
    width: 25,
  },
  {
    header: "EmploymentTypeFemaleS",
    key: "EmploymentTypeFemaleS",
    width: 25,
  },
  {
    header: "EmploymentTypeYouthMaleS",
    key: "EmploymentTypeYouthMaleS",
    width: 25,
  },
  {
    header: "EmploymentTypeYouthFemaleS",
    key: "EmploymentTypeYouthFemaleS",
    width: 25,
  },
  {
    header: "EmploymentTypeMaleC",
    key: "EmploymentTypeMaleC",
    width: 25,
  },
  {
    header: "EmploymentTypeFemaleC",
    key: "EmploymentTypeFemaleC",
    width: 25,
  },
  {
    header: "EmploymentTypeYouthMaleC",
    key: "EmploymentTypeYouthMaleC",
    width: 25,
  },
  {
    header: "EmploymentTypeYouthFemaleC",
    key: "EmploymentTypeYouthFemaleC",
    width: 25,
  },
  {
    header: "FarmName",
    key: "farmName",
    width: 25,
  },
  {
    header: "PortionNumber",
    key: "PortionNumber",
    width: 25,
  },
  {
    header: "PortionName",
    key: "PortionName",
    width: 25,
  },
  {
    header: "Province",
    key: "Province",
    width: 25,
  },
  {
    header: "MetroDistrict",
    key: "MetroDistrict",
    width: 25,
  },
  {
    header: "DistrictMunicipality",
    key: "DistrictMunicipality",
    width: 25,
  },
  {
    header: "WardNumber",
    key: "WardNumber",
    width: 25,
  },
  {
    header: "TownOrVillage",
    key: "TownOrVillage",
    width: 25,
  },
  {
    header: "ProjectLegalEntityName",
    key: "ProjectLegalEntityName",
    width: 25,
  },
  {
    header: "BusinessEntityType",
    key: "businessEntityType",
    width: 25,
  },
  {
    header: "CoOperativesMembers",
    key: "CoOperativesMembers",
    width: 25,
  },
  {
    header: "TotalFarmSize",
    key: "totalFarmSize",
    width: 25,
  },
  {
    header: "Grazing",
    key: "Grazing",
    width: 25,
  },
  {
    header: "NonArable",
    key: "NonArable",
    width: 25,
  },
  {
    header: "Arable",
    key: "Arable",
    width: 25,
  },
  {
    header: "LivestockLayers",
    key: "Layers",
    width: 25,
  },
  {
    header: "LivestockGoat",
    key: "LivestockGoat",
    width: 25,
  },
  {
    header: "LivestockBroilers",
    key: "LivestockBroilers",
    width: 25,
  },
  {
    header: "LivestockCattle",
    key: "LivestockCattle",
    width: 25,
  },
  {
    header: "LivestockSheep",
    key: "LivestockSheep",
    width: 25,
  },
  {
    header: "LivestockPigs",
    key: "LivestockPigs",
    width: 25,
  },
  {
    header: "LivestockOstrich",
    key: "LivestockOstrich",
    width: 25,
  },
  {
    header: "LivestockRabbit",
    key: "LivestockRabbit",
    width: 25,
  },
  {
    header: "LiveStockOther",
    key: "liveStockOther",
    width: 25,
  },
  {
    header: "LivestockOtherSpecify",
    key: "LivestockOtherSpecify",
    width: 25,
  },
  {
    header: "HorticultureVegetablesHa",
    key: "HorticultureVegetablesHa",
    width: 25,
  },
  {
    header: "HorticultureVegetablesTons",
    key: "HorticultureVegetablesTons",
    width: 25,
  },
  {
    header: "HorticultureFruitsHa",
    key: "HorticultureFruitsHa",
    width: 25,
  },
  {
    header: "HorticultureFruitsTons",
    key: "HorticultureFruitsTons",
    width: 25,
  },
  {
    header: "HorticultureNutsHa",
    key: "HorticultureNutsHa",
    width: 25,
  },
  {
    header: "HorticultureNutsTons",
    key: "HorticultureNutsTons",
    width: 25,
  },
  {
    header: "HorticultureOtherHa",
    key: "HorticultureOtherHa",
    width: 25,
  },
  {
    header: "HorticultureOtherTons",
    key: "HorticultureOtherTons",
    width: 25,
  },
  {
    header: "HorticultureOtherSpecify",
    key: "HorticultureOtherSpecify",
    width: 25,
  },
  {
    header: "FieldCropsGrainha",
    key: "FieldCropsGrainha",
    width: 25,
  },
  {
    header: "FieldCropsGrainTons",
    key: "FieldCropsGrainTons",
    width: 25,
  },
  {
    header: "FieldCropsCottonHa",
    key: "FieldCropsCottonHa",
    width: 25,
  },
  {
    header: "FieldCropsCottonTons",
    key: "FieldCropsCottonTons",
    width: 25,
  },
  {
    header: "FieldCropsOilseedsHa",
    key: "FieldCropsOilseedsHa",
    width: 25,
  },
  {
    header: "FieldCropsOilseedsTons",
    key: "FieldCropsOilseedsTons",
    width: 25,
  },
  {
    header: "FieldCropsSugarCaneHa",
    key: "FieldCropsSugarCaneHa",
    width: 25,
  },
  {
    header: "FieldCropsSugarCaneTons",
    key: "FieldCropsSugarCaneTons",
    width: 25,
  },
  {
    header: "FieldCropsOtherHa",
    key: "FieldCropsOtherHa",
    width: 25,
  },
  {
    header: "FieldCropsOtherTons",
    key: "FieldCropsOtherTons",
    width: 25,
  },
  {
    header: "fieldCropsOtherSpecify",
    key: "fieldCropsOtherSpecify",
    width: 25,
  },
  {
    header: "ForestryLathsHa",
    key: "ForestryLathsHa",
    width: 25,
  },
  {
    header: "ForestryLathsTons",
    key: "ForestryLathsTons",
    width: 25,
  },
  {
    header: "ForestryDroppersHa",
    key: "ForestryDroppersHa",
    width: 25,
  },
  {
    header: "ForestryDroppersTons",
    key: "ForestryDroppersTons",
    width: 25,
  },
  {
    header: "ForestryPolesHa",
    key: "ForestryPolesHa",
    width: 25,
  },
  {
    header: "ForestryPolesTons",
    key: "ForestryPolesTons",
    width: 25,
  },
  {
    header: "ForestryBPolesHa",
    key: "ForestryBPolesHa",
    width: 25,
  },
  {
    header: "ForestryBPolesTons",
    key: "ForestryBPolesTons",
    width: 25,
  },
  {
    header: "ForestryOtherHa",
    key: "ForestryOtherHa",
    width: 25,
  },
  {
    header: "ForestryOtherTons",
    key: "ForestryOtherTons",
    width: 25,
  },
  {
    header: "forestryOtherSpecify",
    key: "forestryOtherSpecify",
    width: 25,
  },
  {
    header: "AquacultureFish",
    key: "AquacultureFish",
    width: 25,
  },
  {
    header: "AquaculturePlants",
    key: "AquaculturePlants",
    width: 25,
  },
  {
    header: "AquacultureShelfish",
    key: "AquacultureShelfish",
    width: 25,
  },
  {
    header: "AquacultureOther",
    key: "AquacultureOther",
    width: 25,
  },
  {
    header: "aquacultureOtherSpecify",
    key: "aquacultureOtherSpecify",
    width: 25,
  },
  {
    header: "SeaFishingHake",
    key: "SeaFishingHake",
    width: 25,
  },
  {
    header: "SeaFishingSnoek",
    key: "SeaFishingSnoek",
    width: 25,
  },
  {
    header: "SeaFishingTuna",
    key: "SeaFishingTuna",
    width: 25,
  },
  {
    header: "SeaFishingShelfish",
    key: "SeaFishingShelfish",
    width: 25,
  },
  {
    header: "SeaFishingLobster",
    key: "SeaFishingLobster",
    width: 25,
  },
  {
    header: "SeaFishingOther",
    key: "SeaFishingOther",
    width: 25,
  },
  {
    header: "SeaFishingOtherSpecify",
    key: "seaFishingOtherSpecify",
    width: 25,
  },
  {
    header: "GameFarmingBuffalo",
    key: "GameFarmingBuffalo",
    width: 25,
  },
  {
    header: "GameFarmingSpringbok",
    key: "GameFarmingSpringbok",
    width: 25,
  },
  {
    header: "GameFarmingImpala",
    key: "GameFarmingImpala",
    width: 25,
  },
  {
    header: "GameFarmingCrocodiles",
    key: "GameFarmingCrocodiles",
    width: 25,
  },
  {
    header: "GameFarmingGemsbok",
    key: "GameFarmingGemsbok",
    width: 25,
  },
  {
    header: "GameFarmingOther",
    key: "GameFarmingOther",
    width: 25,
  },
  {
    header: "GameFarmingOtherSpecify",
    key: "GameFarmingOtherSpecify",
    width: 25,
  },
  {
    header: "FormalMarketingChannel",
    key: "marketingChannelTypeFormal",
    width: 25,
  },
  {
    header: "InformalMarketingChannel",
    key: "marketingChannelTypeInformal",
    width: 25,
  },
  {
    header: "ValueAndAgroProcessing",
    key: "ValueAndAgroProcessing",
    width: 25,
  },
  {
    header: "SortingAndGrading",
    key: "SortingAndGrading",
    width: 25,
  },
  {
    header: "Packaging",
    key: "Packaging",
    width: 25,
  },
  {
    header: "ColdStorage",
    key: "ColdStorage",
    width: 25,
  },
  {
    header: "SliceAndDice",
    key: "SliceAndDice",
    width: 25,
  },
  {
    header: "Labelling",
    key: "Labelling",
    width: 25,
  },
  {
    header: "Pasteurising",
    key: "Pasteurising",
    width: 25,
  },
  {
    header: "PrimaryOthers",
    key: "PrimaryOthers",
    width: 25,
  },
  {
    header: "primaryOtherSpecify",
    key: "primaryOtherSpecify",
    width: 25,
  },
  {
    header: "Milling",
    key: "Milling",
    width: 25,
  },
  {
    header: "Grinding",
    key: "Grinding",
    width: 25,
  },
  {
    header: "Slaughtering",
    key: "Slaughtering",
    width: 25,
  },
  {
    header: "PressingForOil",
    key: "PressingForOil",
    width: 25,
  },
  {
    header: "JuicingAndPurees",
    key: "JuicingAndPurees",
    width: 25,
  },
  {
    header: "SecondaryOthers",
    key: "SecondaryOthers",
    width: 25,
  },
  {
    header: "secondaryOtherSpecify",
    key: "secondaryOtherSpecify",
    width: 25,
  },
  {
    header: "Canning",
    key: "Canning",
    width: 25,
  },
  {
    header: "Bottling",
    key: "Bottling",
    width: 25,
  },
  {
    header: "Extraction",
    key: "Extraction",
    width: 25,
  },
  {
    header: "Mixing",
    key: "Mixing",
    width: 25,
  },
  {
    header: "Flavouring",
    key: "Flavouring",
    width: 25,
  },
  {
    header: "AdvancedOthers",
    key: "AdvancedOthers",
    width: 25,
  },
  {
    header: "AdvancedOtherSpecify",
    key: "AdvancedOtherSpecify",
    width: 25,
  },
  {
    header: "UndertakenManually",
    key: "UndertakenMmanually",
    width: 25,
  },
  {
    header: "FixedStructuresFarmHouse",
    key: "FixedStructuresFarmHouse",
    width: 25,
  },
  {
    header: "FixedStructuresStorageRooms",
    key: "FixedStructuresStorageRooms",
    width: 25,
  },
  {
    header: "FixedStructuresPoultryHouses",
    key: "FixedStructuresPoultryHouses",
    width: 25,
  },
  {
    header: "FixedStructuresPigsty",
    key: "FixedStructuresPigsty",
    width: 25,
  },
  {
    header: "FixedStructuresPackhouse",
    key: "FixedStructuresPackhouse",
    width: 25,
  },
  {
    header: "FixedStructuresFencing",
    key: "FixedStructuresFencing",
    width: 25,
  },
  {
    header: "FixedStructuresOther",
    key: "FixedStructuresOther",
    width: 25,
  },
  {
    header: "FixedStructuresOtherSpecify",
    key: "FixedStructuresOtherSpecify",
    width: 25,
  },
  {
    header: "IrrigationDripMicro",
    key: "IrrigationDripMicro",
    width: 25,
  },
  {
    header: "IrrigationSprinkler",
    key: "IrrigationSprinkler",
    width: 25,
  },
  {
    header: "IrrigationCentrePivots",
    key: "IrrigationCentrePivots",
    width: 25,
  },
  {
    header: "IrrigationFurrow",
    key: "IrrigationFurrow",
    width: 25,
  },
  {
    header: "IrrigationFlood",
    key: "IrrigationFlood",
    width: 25,
  },
  {
    header: "IrrigationOther",
    key: "IrrigationOther",
    width: 25,
  },
  {
    header: "IrrigationOtherSpecify",
    key: "IrrigationOtherSpecify",
    width: 25,
  },
  {
    header: "WaterRiver",
    key: "WaterRiver",
    width: 25,
  },
  {
    header: "WaterDams",
    key: "WaterDams",
    width: 25,
  },
  {
    header: "WaterCanal",
    key: "WaterCanal",
    width: 25,
  },
  {
    header: "WaterBoreholesWindmills",
    key: "WaterBoreholesWindmills",
    width: 25,
  },
  {
    header: "WaterOther",
    key: "WaterOther",
    width: 25,
  },
  {
    header: "WaterOtherSpecify",
    key: "WaterOtherSpecify",
    width: 25,
  },
  {
    header: "MachineryTractor",
    key: "MachineryTractor",
    width: 25,
  },
  {
    header: "MachineryCombineHarvester",
    key: "MachineryCombineHarvester",
    width: 25,
  },
  {
    header: "MachineryTruck",
    key: "MachineryTruck",
    width: 25,
  },
  {
    header: "MachineryLightDelivery",
    key: "MachineryLightDelivery",
    width: 25,
  },
  {
    header: "MachineryOther",
    key: "MachineryOther",
    width: 25,
  },
  {
    header: "MachineryOtherSpecify",
    key: "MachineryOtherSpecify",
    width: 25,
  },
  {
    header: "ImplementsEquipmentPlough",
    key: "ImplementsEquipmentPlough",
    width: 25,
  },
  {
    header: "ImplementsEquipmentPlanter",
    key: "ImplementsEquipmentPlanter",
    width: 25,
  },
  {
    header: "ImplementsEquipmentTiller",
    key: "ImplementsEquipmentTiller",
    width: 25,
  },
  {
    header: "ImplementsEquipmentGarden",
    key: "ImplementsEquipmentGarden",
    width: 25,
  },
  {
    header: "ImplementsEquipmentTrailer",
    key: "ImplementsEquipmentTrailer",
    width: 25,
  },
  {
    header: "ImplementsEquipmentOther",
    key: "ImplementsEquipmentOther",
    width: 25,
  },
  {
    header: "ImplementsEquipmentSpecify",
    key: "ImplementsEquipmentSpecify",
    width: 25,
  },
  {
    header: "OtherDipTank",
    key: "OtherDipTank",
    width: 25,
  },
  {
    header: "OtherAccessRoad",
    key: "OtherAccessRoad",
    width: 25,
  },
  {
    header: "OtherElectricity",
    key: "OtherElectricity",
    width: 25,
  },
  {
    header: "OtherOther",
    key: "OtherOther",
    width: 25,
  },
  {
    header: "OtherOtherSpecify",
    key: "OtherOtherSpecify",
    width: 25,
  },
  {
    header: "DipTankElsewhere",
    key: "DipTankElsewhere",
    width: 25,
  },
  {
    header: "WhichOfTheFollowing",
    key: "WhichOfTheFollowing",
    width: 25,
  },
  {
    header: "TypeOfDipTank",
    key: "TypeOfDipTank",
    width: 25,
  },
  {
    header: "MAFISA",
    key: "MAFISA",
    width: 25,
  },
  {
    header: "CASP",
    key: "CASP",
    width: 25,
  },
  {
    header: "AgriBEEE",
    key: "AgriBEEE",
    width: 25,
  },
  {
    header: "LandCare",
    key: "LandCare",
    width: 25,
  },
  {
    header: "RECAP",
    key: "RECAP",
    width: 25,
  },
  {
    header: "ILMA",
    key: "ILMA",
    width: 25,
  },
  {
    header: "OtherGovernmentSupport",
    key: "OtherGovernmentSupport",
    width: 25,
  },
  {
    header: "GovernmentSupportSpecify",
    key: "GovernmentSupportSpecify",
    width: 25,
  },
  {
    header: "ExtensionServices",
    key: "ExtensionServices",
    width: 25,
  },
  {
    header: "ExtensionServicesInUse",
    key: "ExtensionServicesInUse",
    width: 25,
  },
  {
    header: "VeterinaryServices",
    key: "VeterinaryServices",
    width: 25,
  },
  {
    header: "VeterinaryServicesInUse",
    key: "VeterinaryServicesInUse",
    width: 25,
  },
  {
    header: "EarlyWarningInformation",
    key: "EarlyWarningInformation",
    width: 25,
  },
  {
    header: "AgriculturalEconomicInfo",
    key: "AgriculturalEconomicInfo",
    width: 25,
  },
  {
    header: "Training",
    key: "Training",
    width: 25,
  },
  {
    header: "ApproximateAnnualTurnover",
    key: "ApproximateAnnualTurnover",
    width: 24,
  },
  {
    header: "Preferredcommunication",
    key: "preferredcommunication",
    width: 25,
  },
  {
    header: "HasCropInsurance",
    key: "hasCropInsurance",
    width: 25,
  },
  {
    header: "InsuranceCompanyName",
    key: "insuranceCompanyName",
    width: 25,
  },
  {
    header: "InsuranceType",
    key: "insuranceType",
    width: 25,
  },
];

const docsAssignWorksheet = (
  docsArray,
  farmerProduction,
  farmerAssetsServices,
  worksheet
) => {
  for (let i = 0; i < docsArray.length; i++) {
    //console.log("docsArray[i] : ", docsArray[i]);
    let obj = {};
    obj["_id"] = docsArray[i]._id;

    obj["surname"] = docsArray[i].surname == null ? "" : docsArray[i].surname;
    obj["name"] = docsArray[i].name == null ? "" : docsArray[i].name;
    obj["contactNumber"] =
      docsArray[i].contactNumber == null ? "" : docsArray[i].contactNumber;
    obj["identityNumber"] =
      docsArray[i].identityNumber == null ? "" : docsArray[i].identityNumber;

    obj["nationality"] =
      docsArray[i].nationalityObj && docsArray[i].nationalityObj.cndName != null
        ? docsArray[i].nationalityObj.cndName
        : "";

    obj["email"] = docsArray[i].email == null ? "" : docsArray[i].email;
    obj["isDisabled"] =
      docsArray[i].isDisabled == null ? "" : docsArray[i].isDisabled;
    obj["farmerType"] = docsArray[i].farmerType;
    obj["residentialAddress"] =
      docsArray[i].residentialAddress == null
        ? ""
        : docsArray[i].residentialAddress;
    obj["residentialPostalcode"] =
      docsArray[i].residentialPostalcode == null
        ? ""
        : docsArray[i].residentialPostalcode;
    obj["postalAddress"] =
      docsArray[i].postalAddress == null ? "" : docsArray[i].postalAddress;
    obj["postalcode"] =
      docsArray[i].postalcode == null ? "" : docsArray[i].postalcode;
    obj["farmingExperience"] =
      docsArray[i].farmingExperience == null
        ? ""
        : docsArray[i].farmingExperience;
    obj["farmingExperienceYears"] =
      docsArray[i].farmingExperienceYears == null
        ? ""
        : docsArray[i].farmingExperienceYears;
    obj["ageGroups"] =
      docsArray[i].ageGroupsObj && docsArray[i].ageGroupsObj.cndName != null
        ? docsArray[i].ageGroupsObj.cndName
        : "";

    obj["gender"] = docsArray[i].gender == null ? "" : docsArray[i].gender;

    obj["populationGroup"] =
      docsArray[i].populationGroupObj &&
      docsArray[i].populationGroupObj.cndName != null
        ? docsArray[i].populationGroupObj.cndName
        : "";

    obj["populationGroupOther"] =
      docsArray[i].populationGroupOther == null
        ? ""
        : docsArray[i].populationGroupOther;

    obj["homeLanguage"] =
      docsArray[i].homeLanguageObj &&
      docsArray[i].homeLanguageObj.cndName != null
        ? docsArray[i].homeLanguageObj.cndName
        : "";

    obj["homeLanguageOther"] =
      docsArray[i].homeLanguageOther == null
        ? ""
        : docsArray[i].homeLanguageOther;

    obj["education"] =
      docsArray[i].educationObj && docsArray[i].educationObj.cndName != null
        ? docsArray[i].educationObj.cndName
        : "";

    obj["operationType"] =
      docsArray[i].operationType == null ? "" : docsArray[i].operationType;
    obj["isOwner"] = docsArray[i].isOwner == "true" ? "YES" : "NO";

    obj["ownershipType"] =
      docsArray[i].ownershipTypeObj &&
      docsArray[i].ownershipTypeObj.cndName != null
        ? docsArray[i].ownershipTypeObj.cndName
        : "";

    obj["otherOwnerShip"] =
      docsArray[i].otherOwnerShip == null ? "" : docsArray[i].otherOwnerShip;

    obj["landAquisition"] =
      docsArray[i].landAquisitionObj &&
      docsArray[i].landAquisitionObj.cndName == null
        ? docsArray[i].landAquisitionObj.cndName
        : "";

    obj["landAquisitionOther"] =
      docsArray[i].landAquisitionOther == null
        ? ""
        : docsArray[i].landAquisitionOther;

    obj["programmeRedistribution"] =
      docsArray[i].programmeRedistributionObj &&
      docsArray[i].programmeRedistributionObj.cndName != null
        ? docsArray[i].programmeRedistributionObj.cndName
        : "";

    obj["programmeRedistributionOther"] =
      docsArray[i].programmeRedistributionOther == null
        ? ""
        : docsArray[i].programmeRedistributionOther;
    obj["NoOfEmployeesTotal"] = docsArray[i].noOfEmployees.totalEmp;
    obj["NoOfEmployeesMales"] = docsArray[i].noOfEmployees.Male;
    obj["NoOfEmployeesFemales"] = docsArray[i].noOfEmployees.Female;
    obj["NoOfEmployeesYouth"] = docsArray[i].noOfEmployees.Youth;
    obj["NoOfEmployeesDisable"] = docsArray[i].noOfEmployees["With Disability"];
    obj["EmploymentTypeMaleP"] = docsArray[i].parmanentEmployment.Male;
    obj["EmploymentTypeFemaleP"] = docsArray[i].parmanentEmployment.Female;
    obj["EmploymentTypeYouthMaleP"] =
      docsArray[i].parmanentEmployment["Youth Male"];
    obj["EmploymentTypeYouthFemaleP"] =
      docsArray[i].parmanentEmployment["Youth Female"];
    obj["EmploymentTypeMaleS"] = docsArray[i].seasonalEmployment.Male;
    obj["EmploymentTypeFemaleS"] = docsArray[i].seasonalEmployment.Female;
    obj["EmploymentTypeYouthMaleS"] =
      docsArray[i].seasonalEmployment["Youth Male"];
    obj["EmploymentTypeYouthFemaleS"] =
      docsArray[i].seasonalEmployment["Youth Female"];

    obj["EmploymentTypeMaleC"] = docsArray[i].contractEmployment.Male;
    obj["EmploymentTypeFemaleC"] = docsArray[i].contractEmployment.Female;
    obj["EmploymentTypeYouthMaleC"] =
      docsArray[i].contractEmployment["Youth Male"];
    obj["EmploymentTypeYouthFemaleC"] =
      docsArray[i].contractEmployment["Youth Female"];

    //filter prod & asset arrays
    let doc2 = farmerProduction.find(
      (item) => item.farmerId == docsArray[i]._id + ""
    );
    let doc3 = farmerAssetsServices.find(
      (item) => item.farmerId == docsArray[i]._id + ""
    );

    //Farmer Production

    if (doc2 && Object.keys(doc2).length > 0) {
      obj["businessEntityType"] =
        doc2.businessEntityTypeObj && doc2.businessEntityTypeObj.cndName != null
          ? doc2.businessEntityTypeObj.cndName
          : "";
      //province
      obj["Province"] =
        doc2.provinceObj && doc2.provinceObj.cndName != null
          ? doc2.provinceObj.cndName
          : "";
      //metro district
      obj["MetroDistrict"] =
        doc2.metroDistrictObj && doc2.metroDistrictObj.cndName != null
          ? doc2.metroDistrictObj.cndName
          : "";
      //municipality
      obj["DistrictMunicipality"] =
        doc2.farmMuncipalRegionObj && doc2.farmMuncipalRegionObj.cndName != null
          ? doc2.farmMuncipalRegionObj.cndName
          : "";
      obj["farmLatitude"] = doc2.farmLatitude == null ? "" : doc2.farmLatitude;
      obj["farmLongitude"] =
        doc2.farmLongitude == null ? "" : doc2.farmLongitude;
      obj["farmName"] = doc2.farmName == null ? "" : doc2.farmName;

      obj["PortionNumber"] =
        doc2.portionNumber == null ? "" : doc2.portionNumber;
      obj["PortionName"] = doc2.portionName == null ? "" : doc2.portionName;

      obj["WardNumber"] = doc2.wardNumber == null ? "" : doc2.wardNumber;
      obj["TownOrVillage"] = doc2.townVillage == null ? "" : doc2.townVillage;
      obj["ProjectLegalEntityName"] =
        doc2.projectLegalEntityName == null ? "" : doc2.projectLegalEntityName;

      obj["CoOperativesMembers"] =
        doc2.totalMembersInEnitity == null ? "" : doc2.totalMembersInEnitity;
      obj["totalFarmSize"] = doc2.totalFarmSize.Total;
      obj["Grazing"] = doc2.totalFarmSize.Grazing;
      obj["NonArable"] = doc2.totalFarmSize["Non-arable"];
      obj["Arable"] = doc2.totalFarmSize.Arable;
      obj["Layers"] = doc2.liveStock.Layers;
      obj["LivestockGoat"] = doc2.liveStock.Goat;
      obj["LivestockBroilers"] = doc2.liveStock.Broilers;
      obj["LivestockCattle"] = doc2.liveStock.Cattle;
      obj["LivestockSheep"] = doc2.liveStock.Sheep;
      obj["LivestockPigs"] = doc2.liveStock.Pigs;
      obj["LivestockOstrich"] = doc2.liveStock.Ostrich;
      obj["LivestockRabbit"] = doc2.liveStock.Rabbit;
      obj["liveStockOther"] = doc2.liveStock.Other;
      obj["LivestockOtherSpecify"] =
        doc2.liveStockOther == null ? "" : doc2.liveStockOther;
      obj["HorticultureVegetablesHa"] = doc2.horticulture.Vegetables;
      obj["HorticultureVegetablesTons"] =
        doc2.horticultureProduction.VegetablesProd;
      obj["HorticultureFruitsHa"] = doc2.horticulture.Fruits;
      obj["HorticultureFruitsTons"] = doc2.horticultureProduction.FruitsProd;
      obj["HorticultureNutsHa"] = doc2.horticulture.Nuts;
      obj["HorticultureNutsTons"] = doc2.horticultureProduction.NutsProd;
      obj["HorticultureOtherHa"] = doc2.horticulture.horticulture_other;
      obj["HorticultureOtherTons"] =
        doc2.horticultureProduction.horticulture_otherprod;
      obj["HorticultureOtherSpecify"] =
        doc2.horticultureOther == null ? "" : doc2.horticultureOther;
      obj["FieldCropsGrainha"] = doc2.fieldCrops.Grain;
      obj["FieldCropsGrainTons"] = doc2.fieldCropsProduction.GrainProd;
      obj["FieldCropsCottonHa"] = doc2.fieldCrops.Cotton;
      obj["FieldCropsCottonTons"] = doc2.fieldCropsProduction.CottonProd;
      obj["FieldCropsOilseedsHa"] = doc2.fieldCrops.Oilseeds;
      obj["FieldCropsOilseedsTons"] = doc2.fieldCropsProduction.OilseedsProd;
      obj["FieldCropsSugarCaneHa"] = doc2.fieldCrops["Sugar Cane"];
      obj["FieldCropsSugarCaneTons"] = doc2.fieldCropsProduction.SugarCaneProd;
      obj["FieldCropsOtherHa"] = doc2.fieldCrops.Field_Crops_Other;
      obj["FieldCropsOtherTons"] =
        doc2.fieldCropsProduction.Field_Crops_OtherProd;
      obj["fieldCropsOtherSpecify"] =
        doc2.fieldCropsOther == null ? "" : doc2.fieldCropsOther;
      obj["ForestryLathsHa"] = doc2.forestry.Laths;
      obj["ForestryLathsTons"] = doc2.forestryProduction.LathsProd;
      obj["ForestryDroppersHa"] = doc2.forestry.Droppers;
      obj["ForestryDroppersTons"] = doc2.forestryProduction.DroppersProd;
      obj["ForestryPolesHa"] = doc2.forestry.Forestry_Poles;
      obj["ForestryPolesTons"] = doc2.forestryProduction.PolesProd;
      obj["ForestryBPolesHa"] = doc2.forestry["Building Poles"];
      obj["ForestryBPolesTons"] =
        doc2.forestryProduction["Building Poles Prod"];
      obj["ForestryOtherHa"] = doc2.forestry.Forestry_Other;
      obj["ForestryOtherTons"] = doc2.forestryProduction.Forestry_Other_Prod;
      obj["forestryOtherSpecify"] =
        doc2.forestryOther == null ? "" : doc2.forestryOther;
      obj["AquacultureFish"] = doc2.aquaculture.Fish;
      obj["AquaculturePlants"] = doc2.aquaculture.Plants;
      obj["AquacultureShelfish"] = doc2.aquaculture["Shell-fish"];
      obj["AquacultureOther"] = doc2.aquaculture.Aquaculture_Other;
      obj["aquacultureOtherSpecify"] =
        doc2.aquacultureOther == null ? "" : doc2.aquacultureOther;
      obj["SeaFishingHake"] = doc2.seaFishing.Hake;
      obj["SeaFishingSnoek"] = doc2.seaFishing.Snoek;
      obj["SeaFishingTuna"] = doc2.seaFishing.Tuna;
      obj["SeaFishingShelfish"] = doc2.seaFishing["SeaFishing_Shell-fish"];
      obj["SeaFishingLobster"] = doc2.seaFishing.Lobster;
      obj["SeaFishingOther"] = doc2.seaFishing.SeaFishing_Other;
      obj["seaFishingOtherSpecify"] =
        doc2.seaFishingOther == null ? "" : doc2.seaFishingOther;
      obj["GameFarmingBuffalo"] = doc2.gameFarming.Buffalo;
      obj["GameFarmingSpringbok"] = doc2.gameFarming.Springbok;
      obj["GameFarmingImpala"] = doc2.gameFarming.GameFarmingImpala;
      obj["GameFarmingCrocodiles"] = doc2.gameFarming.Crocodiles;
      obj["GameFarmingGemsbok"] = doc2.gameFarming.Gemsbok;
      obj["GameFarmingOther"] = doc2.gameFarming.GameFarming_Other;
      obj["GameFarmingOtherSpecify"] =
        doc2.gameFarmingOther == null ? "" : doc2.gameFarmingOther;
      obj["marketingChannelTypeFormal"] =
        doc2.marketingChannelTypeFormal == true ? "YES" : "NO";
      obj["marketingChannelTypeInformal"] =
        doc2.marketingChannelTypeInformal == true ? "YES" : "NO";
      obj["ValueAndAgroProcessing"] =
        doc2.practiseAgroProcessing == true ? "YES" : "NO";
      obj["SortingAndGrading"] =
        doc2.primaryAgroProcessing["Sorting and Grading"] == true ? "1" : "0";
      obj["Packaging"] =
        doc2.primaryAgroProcessing.Packaging == true ? "1" : "0";
      obj["ColdStorage"] =
        doc2.primaryAgroProcessing["Cold Storage"] == true ? "1" : "0";
      obj["SliceAndDice"] =
        doc2.primaryAgroProcessing["Slice and Dice (cutting)"] == true
          ? "1"
          : "0";
      obj["Labelling"] =
        doc2.primaryAgroProcessing.Labelling == true ? "1" : "0";
      obj["Pasteurising"] =
        doc2.primaryAgroProcessing.Pasteurising == true ? "1" : "0";
      obj["PrimaryOthers"] =
        doc2.primaryAgroProcessing.Others == true ? "1" : "0";
      obj["primaryOtherSpecify"] =
        doc2.primaryAgroProcessingOther == null
          ? ""
          : doc2.primaryAgroProcessingOther;

      obj["Milling"] = doc2.secondaryAgroProcessing.Milling == true ? "1" : "0";
      obj["Grinding"] =
        doc2.secondaryAgroProcessing.Grinding == true ? "1" : "0";
      obj["Slaughtering"] =
        doc2.secondaryAgroProcessing.Slaughtering == true ? "1" : "0";
      obj["PressingForOil"] =
        doc2.secondaryAgroProcessing["Pressing for Oil"] == true ? "1" : "0";
      obj["JuicingAndPurees"] =
        doc2.secondaryAgroProcessing["Juicing and Purees"] == true ? "1" : "0";
      obj["SecondaryOthers"] =
        doc2.secondaryAgroProcessing.Others == true ? "1" : "0";
      obj["secondaryOtherSpecify"] =
        doc2.secondaryAgroProcessingOther == null
          ? ""
          : doc2.secondaryAgroProcessingOther;

      obj["Canning"] = doc2.advancedAgroProcessing.Canning == true ? "1" : "0";
      obj["Bottling"] =
        doc2.advancedAgroProcessing.Bottling == true ? "1" : "0";
      obj["Extraction"] =
        doc2.advancedAgroProcessing["Extraction (Concentrates)"] == true
          ? "1"
          : "0";
      obj["Mixing"] = doc2.advancedAgroProcessing.Mixing == true ? "1" : "0";
      obj["Flavouring"] =
        doc2.advancedAgroProcessing.Flavouring == true ? "1" : "0";
      obj["AdvancedOthers"] =
        doc2.advancedAgroProcessing.Others == true ? "1" : "0";
      obj["AdvancedOtherSpecify"] =
        doc2.advancedAgroProcessingOther == null
          ? ""
          : doc2.advancedAgroProcessingOther;
      obj["UndertakenMmanually"] =
        doc2.practiseAgroProcessingManual == true ? "YES" : "NO";
    } else {
      obj["farmLatitude"] = "";
      obj["farmLongitude"] = "";
      obj["farmName"] = "";
      obj["PortionNumber"] = "";
      obj["PortionName"] = "";
      obj["WardNumber"] = "";
      obj["TownOrVillage"] = "";
      obj["ProjectLegalEntityName"] = "";
      obj["CoOperativesMembers"] = "";
      obj["totalFarmSize"] = "";
      obj["Grazing"] = "";
      obj["NonArable"] = "";
      obj["Arable"] = "";
      obj["Layers"] = "";
      obj["LivestockGoat"] = "";
      obj["LivestockBroilers"] = "";
      obj["LivestockCattle"] = "";
      obj["LivestockSheep"] = "";
      obj["LivestockPigs"] = "";
      obj["LivestockOstrich"] = "";
      obj["LivestockRabbit"] = "";
      obj["liveStockOther"] = "";
      obj["LivestockOtherSpecify"] = "";
      obj["HorticultureVegetablesHa"] = "";
      obj["HorticultureVegetablesTons"] = "";
      obj["HorticultureFruitsHa"] = "";
      obj["HorticultureFruitsTons"] = "";
      obj["HorticultureNutsHa"] = "";
      obj["HorticultureNutsTons"] = "";
      obj["HorticultureOtherHa"] = "";
      obj["HorticultureOtherTons"] = "";
      obj["HorticultureOtherSpecify"] = "";
      obj["FieldCropsGrainha"] = "";
      obj["FieldCropsGrainTons"] = "";
      obj["FieldCropsCottonHa"] = "";
      obj["FieldCropsCottonTons"] = "";
      obj["FieldCropsOilseedsHa"] = "";
      obj["FieldCropsOilseedsTons"] = "";
      obj["FieldCropsSugarCaneHa"] = "";
      obj["FieldCropsSugarCaneTons"] = "";
      obj["FieldCropsOtherHa"] = "";
      obj["FieldCropsOtherTons"] = "";
      obj["fieldCropsOtherSpecify"] = "";
      obj["ForestryLathsHa"] = "";
      obj["ForestryLathsTons"] = "";
      obj["ForestryDroppersHa"] = "";
      obj["ForestryDroppersTons"] = "";
      obj["ForestryPolesHa"] = "";
      obj["ForestryPolesTons"] = "";
      obj["ForestryBPolesHa"] = "";
      obj["ForestryBPolesTons"] = "";
      obj["ForestryOtherHa"] = "";
      obj["ForestryOtherTons"] = "";
      obj["forestryOtherSpecify"] = "";
      obj["AquacultureFish"] = "";
      obj["AquaculturePlants"] = "";
      obj["AquacultureShelfish"] = "";
      obj["AquacultureOther"] = "";
      obj["aquacultureOtherSpecify"] = "";
      obj["SeaFishingHake"] = "";
      obj["SeaFishingSnoek"] = "";
      obj["SeaFishingTuna"] = "";
      obj["SeaFishingShelfish"] = "";
      obj["SeaFishingLobster"] = "";
      obj["SeaFishingOther"] = "";
      obj["seaFishingOtherSpecify"] = "";
      obj["GameFarmingBuffalo"] = "";
      obj["GameFarmingSpringbok"] = "";
      obj["GameFarmingImpala"] = "";
      obj["GameFarmingCrocodiles"] = "";
      obj["GameFarmingGemsbok"] = "";
      obj["GameFarmingOther"] = "";
      obj["GameFarmingOtherSpecify"] = "";
      obj["marketingChannelTypeFormal"] = "";
      obj["marketingChannelTypeInformal"] = "";
      obj["ValueAndAgroProcessing"] = "";
      obj["SortingAndGrading"] = "";
      obj["Packaging"] = "";
      obj["ColdStorage"] = "";
      obj["SliceAndDice"] = "";
      obj["Labelling"] = "";
      obj["Pasteurising"] = "";
      obj["PrimaryOthers"] = "";
      obj["primaryOtherSpecify"] = "";
      obj["Milling"] = "";
      obj["Grinding"] = "";
      obj["Slaughtering"] = "";
      obj["PressingForOil"] = "";
      obj["JuicingAndPurees"] = "";
      obj["SecondaryOthers"] = "";
      obj["secondaryOtherSpecify"] = "";
      obj["Canning"] = "";
      obj["Bottling"] = "";
      obj["Extraction"] = "";
      obj["Mixing"] = "";
      obj["Flavouring"] = "";
      obj["AdvancedOthers"] = "";
      obj["AdvancedOtherSpecify"] = "";
      obj["UndertakenMmanually"] = "";
    }
    //farmer Assets

    if (doc3 && Object.keys(doc3).length > 0) {
      //annual turnover

      obj["ApproximateAnnualTurnover"] =
        doc3.annualTurnoverObj && doc3.annualTurnoverObj.cndName != null
          ? doc3.annualTurnoverObj.cndName
          : "";

      //preferred communication
      obj["preferredcommunication"] =
        doc3.preferredcommunicationObj &&
        doc3.preferredcommunicationObj.cndName != null
          ? doc3.preferredcommunicationObj.cndName
          : "";

      obj["FixedStructuresFarmHouse"] =
        doc3.fixedStructures["Farm House/Stead"] == true ? "1" : "0";
      obj["FixedStructuresStorageRooms"] =
        doc3.fixedStructures["Storage Rooms/ Sheds"] == true ? "1" : "0";
      obj["FixedStructuresPoultryHouses"] =
        doc3.fixedStructures["Poultry houses"] == true ? "1" : "0";
      obj["FixedStructuresPigsty"] =
        doc3.fixedStructures.Pigsty == true ? "1" : "0";
      obj["FixedStructuresPackhouse"] =
        doc3.fixedStructures.Packhouse == true ? "1" : "0";
      obj["FixedStructuresFencing"] =
        doc3.fixedStructures.Fencing == true ? "1" : "0";
      obj["FixedStructuresOther"] =
        doc3.fixedStructures.Other == true ? "1" : "0";
      obj["FixedStructuresOtherSpecify"] =
        doc3.fixedStructureOther == null ? "" : doc3.fixedStructureOther;

      obj["IrrigationDripMicro"] =
        doc3.irrigationSystems["Drip/Micro Irrigation"] == true ? "1" : "0";
      obj["IrrigationSprinkler"] =
        doc3.irrigationSystems["Sprinkler Irrigation"] == true ? "1" : "0";
      obj["IrrigationCentrePivots"] =
        doc3.irrigationSystems["Centre Pivots"] == true ? "1" : "0";
      obj["IrrigationFurrow"] =
        doc3.irrigationSystems["Furrow Irrigation"] == true ? "1" : "0";
      obj["IrrigationFlood"] =
        doc3.irrigationSystems["Flood Irrigation"] == true ? "1" : "0";
      obj["IrrigationOther"] = doc3.irrigationSystems.Other == true ? "1" : "0";
      obj["IrrigationOtherSpecify"] =
        doc3.irrigationSystemOther == null ? "" : doc3.irrigationSystemOther;

      obj["WaterRiver"] = doc3.waterInfrastructure.River == true ? "1" : "0";
      obj["WaterDams"] =
        doc3.waterInfrastructure["Dams (Catchment Areas)"] == true ? "1" : "0";
      obj["WaterCanal"] = doc3.waterInfrastructure["Canal"] == true ? "1" : "0";
      obj["WaterBoreholesWindmills"] =
        doc3.waterInfrastructure["Boreholes/Windmills"] == true ? "1" : "0";
      obj["WaterOther"] = doc3.waterInfrastructure.Other == true ? "1" : "0";
      obj["WaterOtherSpecify"] =
        doc3.waterInfrastructureOther == null
          ? ""
          : doc3.waterInfrastructureOther;

      obj["MachineryTractor"] =
        doc3.machineryVehicles.Tractor == true ? "1" : "0";
      obj["MachineryCombineHarvester"] =
        doc3.machineryVehicles["Combine Harvester"] == true ? "1" : "0";
      obj["MachineryTruck"] = doc3.machineryVehicles.Truck == true ? "1" : "0";
      obj["MachineryLightDelivery"] =
        doc3.machineryVehicles["Light Delivery Vehicle/Bakkie"] == true
          ? "1"
          : "0";
      obj["MachineryOther"] = doc3.machineryVehicles.Other == true ? "1" : "0";
      obj["MachineryOtherSpecify"] =
        doc3.machineryVehicleOther == null ? "" : doc3.machineryVehicleOther;

      obj["ImplementsEquipmentPlough"] =
        doc3.implementsEquipment.Plough == true ? "1" : "0";
      obj["ImplementsEquipmentPlanter"] =
        doc3.implementsEquipment.Planter == true ? "1" : "0";
      obj["ImplementsEquipmentTiller"] =
        doc3.implementsEquipment.Tiller == true ? "1" : "0";
      obj["ImplementsEquipmentGarden"] =
        doc3.implementsEquipment["Garden Tools"] == true ? "1" : "0";
      obj["ImplementsEquipmentTrailer"] =
        doc3.implementsEquipment.Trailer == true ? "1" : "0";
      obj["ImplementsEquipmentOther"] =
        doc3.implementsEquipment.Other == true ? "1" : "0";
      obj["ImplementsEquipmentSpecify"] =
        doc3.implementsEquipmentOther == null
          ? ""
          : doc3.implementsEquipmentOther;

      obj["OtherDipTank"] = doc3.otherAssets["Dip Tank"] == true ? "1" : "0";
      obj["OtherAccessRoad"] =
        doc3.otherAssets["Access Road"] == true ? "1" : "0";
      obj["OtherElectricity"] =
        doc3.otherAssets.Electricity == true ? "1" : "0";
      obj["OtherOther"] = doc3.otherAssets.Other == true ? "1" : "0";
      obj["OtherOtherSpecify"] =
        doc3.otherAssetsOther == null ? "" : doc3.otherAssetsOther;

      obj["DipTankElsewhere"] = doc3.isAccessToDipTank == true ? "YES" : "NO";
      obj["WhichOfTheFollowing"] = doc3.dipTankValue;
      obj["TypeOfDipTank"] = doc3.dipTankType;

      obj["MAFISA"] = doc3.govtSupport.MAFISA == true ? "1" : "0";
      obj["CASP"] = doc3.govtSupport.CASP == true ? "1" : "0";
      obj["AgriBEEE"] =
        doc3.govtSupport["AgriBEE (eg Equity Programme)"] == true ? "1" : "0";
      obj["LandCare"] = doc3.govtSupport["Land Care"] == true ? "1" : "0";
      obj["RECAP"] = doc3.govtSupport.RECAP == true ? "1" : "0";
      obj["ILMA"] = doc3.govtSupport.ILIMA == true ? "1" : "0";
      obj["OtherGovernmentSupport"] =
        doc3.govtSupport.Other == true ? "1" : "0";
      obj["GovernmentSupportSpecify"] =
        doc3.govtSupportOther == null ? "" : doc3.govtSupportOther;

      obj["ExtensionServices"] =
        doc3.haveExtensionServices == true ? "YES" : "NO";
      obj["ExtensionServicesInUse"] =
        doc3.extensionServiceType == null ? "" : doc3.extensionServiceType;
      obj["VeterinaryServices"] =
        doc3.haveVeterinaryServices == true ? "YES" : "NO";
      obj["VeterinaryServicesInUse"] =
        doc3.veterinaryServiceType == null ? "" : doc3.veterinaryServiceType;
      obj["EarlyWarningInformation"] =
        doc3.earlyWarningInfo == true ? "YES" : "NO";
      obj["AgriculturalEconomicInfo"] =
        doc3.agriEconomicInfo == true ? "YES" : "NO";
      obj["Training"] = doc3.training == true ? "YES" : "NO";

      obj["hasCropInsurance"] = doc3.hasCropInsurance == true ? "YES" : "NO";
      obj["insuranceCompanyName"] =
        doc3.insuranceCompanyName == null ? "" : doc3.insuranceCompanyName;
      obj["insuranceType"] =
        doc3.insuranceType == null ? "" : doc3.insuranceType;
    } else {
      obj["FixedStructuresFarmHouse"] = "";
      obj["FixedStructuresStorageRooms"] = "";
      obj["FixedStructuresPoultryHouses"] = "";
      obj["FixedStructuresPigsty"] = "";
      obj["FixedStructuresPackhouse"] = "";
      obj["FixedStructuresFencing"] = "";
      obj["FixedStructuresOther"] = "";
      obj["FixedStructuresOtherSpecify"] = "";
      obj["IrrigationDripMicro"] = "";
      obj["IrrigationSprinkler"] = "";
      obj["IrrigationCentrePivots"] = "";
      obj["IrrigationFurrow"] = "";
      obj["IrrigationFlood"] = "";
      obj["IrrigationOther"] = "";
      obj["IrrigationOtherSpecify"] = "";
      obj["WaterRiver"] = "";
      obj["WaterDams"] = "";
      obj["WaterCanal"] = "";
      obj["WaterBoreholesWindmills"] = "";
      obj["WaterOther"] = "";
      obj["WaterOtherSpecify"] = "";
      obj["MachineryTractor"] = "";
      obj["MachineryCombineHarvester"] = "";
      obj["MachineryTruck"] = "";
      obj["MachineryLightDelivery"] = "";
      obj["MachineryOther"] = "";
      obj["MachineryOtherSpecify"] = "";
      obj["ImplementsEquipmentPlough"] = "";
      obj["ImplementsEquipmentPlanter"] = "";
      obj["ImplementsEquipmentTiller"] = "";
      obj["ImplementsEquipmentGarden"] = "";
      obj["ImplementsEquipmentTrailer"] = "";
      obj["ImplementsEquipmentOther"] = "";
      obj["ImplementsEquipmentSpecify"] = "";
      obj["OtherDipTank"] = "";
      obj["OtherAccessRoad"] = "";
      obj["OtherElectricity"] = "";
      obj["OtherOther"] = "";
      obj["OtherOtherSpecify"] = "";
      obj["DipTankElsewhere"] = "";
      obj["WhichOfTheFollowing"] = "";
      obj["MAFISA"] = "";
      obj["CASP"] = "";
      obj["AgriBEEE"] = "";
      obj["LandCare"] = "";
      obj["RECAP"] = "";
      obj["ILMA"] = "";
      obj["OtherGovernmentSupport"] = "";
      obj["GovernmentSupportSpecify"] = "";
      obj["ExtensionServices"] = "";
      obj["ExtensionServicesInUse"] = "";
      obj["VeterinaryServices"] = "";
      obj["VeterinaryServicesInUse"] = "";
      obj["EarlyWarningInformation"] = "";
      obj["AgriculturalEconomicInfo"] = "";
      obj["Training"] = "";
      obj["hasCropInsurance"] = "";
      obj["insuranceCompanyName"] = "";
      obj["insuranceType"] = "";
    }
    worksheet.addRow(obj);
  }
};

const getFarmersWithFind = async (
  skipArg,
  limitArg,
  dbquery,
  dbquery_search,
  worksheet
) => {
  /*
  let docs = await FarmerDetail.find({
    $and: [
      { status: { $ne: "Deleted" } },
      // dbquery,
      // {
      //   $or: [
      //     { surname: { $regex: dbquery_search, $options: "i" } },
      //     { name: { $regex: dbquery_search, $options: "i" } },
      //     { identityNumber: { $regex: dbquery_search, $options: "i" } },
      //     { contactNumber: { $regex: dbquery_search, $options: "i" } },
      //     { farmerType: { $regex: dbquery_search, $options: "i" } },
      //   ],
      // },
    ],
  })
    .sort({ _id: -1 })
    .limit(limitArg)
    .skip(skipArg);
*/
  let docs = await FarmerDetail.aggregate([
    { $sort: { _id: -1 } },
    { $skip: skipArg },
    { $limit: limitArg },
  ]);

  var _idArray = docs.map(function (el) {
    return el._id;
  });

  console.log("docs 1 : ", _idArray.length);
  /*
  let farmerProduction = await FarmerProduction.find({
    farmerId: _idArray,
  });
  */
  let farmerProduction = await FarmerProduction.aggregate([
    { $match: { farmerId: { $in: _idArray } } },
  ]);

  console.log("docs 2 : ", farmerProduction.length);
  /*
  let farmerAssetsServices = await FarmAssetsServices.find({
    farmerId: _idArray,
  });
  */
  let farmerAssetsServices = await FarmAssetsServices.aggregate([
    { $match: { farmerId: { $in: _idArray } } },
  ]);
  console.log("docs 3 : ", farmerAssetsServices.length);

  docsAssignWorksheet(docs, farmerProduction, farmerAssetsServices, worksheet);
};

router.get("/api/exportFarmers", async function (req, res) {
  try {
    console.log("export farmers using find - Started !!!");
    //excel
    let sheetName = req.query.sheetName ? req.query.sheetName : "Sheet1";
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(
      sheetName,

      { views: [{ state: "frozen", xSplit: 2, ySplit: 1 }] }
    );
    worksheet.properties.defaultRowHeight = 20;
    worksheet.autoFilter = "A1:C1";

    worksheet.columns = farmerColumns;

    //filters
    req.setTimeout(2880000);

    let skipRecords = 0;
    if (
      req.query.skipRecords == "0" ||
      req.query.skipRecords == "5000" ||
      req.query.skipRecords == "10000" ||
      req.query.skipRecords == "15000"
    ) {
      skipRecords = Number(req.query.skipRecords);
    }

    let dbquery = {};
    let dbquery_search = "";

    if (req.query.name) {
      dbquery.name = req.query.name;
    }

    if (req.query.searchTable) dbquery_search = req.query.searchTable;

    const limitRecords = 10000;

    await getFarmersWithFind(
      skipRecords,
      limitRecords,
      dbquery,
      dbquery_search,
      worksheet
    );

    console.log("writing to excel ... !!!");
    await workbook.xlsx.writeFile("public/uploads/" + req.query.fileName);
    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      fileName: req.query.fileName,
      //totalRecCount: totalFarmers,
    });

    // save under export.xlsx
  } catch (err) {
    console.log("fetch failed", err);
  }
});

const getFarmers = async (
  skipArg,
  limitArg,
  dbquery,
  dbquery_search,
  worksheet
) => {
  let docs = await FarmerDetail.aggregate([
    { $sort: { _id: -1 } },
    { $skip: skipArg },
    { $limit: limitArg },
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
    // { $sort: { _id: -1 } },
    // {
    //   $facet: {
    //     data: [{ $skip: skipArg }, { $limit: limitArg }],
    //   },
    // },
    // {
    //   $project: {
    //     "data._id": 1,
    //     "data.surname": 1,
    //     "data.name": 1,
    //     "data.identityNumber": 1,
    //     "data.contactNumber": 1,
    //     "data.nationalityObj": 1,
    //     "data.email": 1,
    //     "data.residentialAddress": 1,
    //     "data.residentialPostalcode": 1,
    //     "data.postalcode": 1,
    //     "data.postalAddress": 1,
    //     "data.farmingExperience": 1,
    //     "data.farmingExperienceYears": 1,
    //     "data.ageGroupsObj": 1,
    //     "data.gender": 1,
    //     "data.populationGroupObj": 1,
    //     "data.populationGroupOther": 1,
    //     "data.homeLanguageObj": 1,
    //     "data.homeLanguageOther": 1,
    //     "data.educationObj": 1,
    //     "data.operationType": 1,
    //     "data.isOwner": 1,
    //     "data.ownershipTypeObj": 1,
    //     "data.otherOwnerShip": 1,
    //     "data.landAquisitionObj": 1,
    //     "data.landAquisitionOther": 1,
    //     "data.programmeRedistributionObj": 1,
    //     "data.programmeRedistributionOther": 1,
    //     "data.noOfEmployees": 1,
    //     "data.parmanentEmployment": 1,
    //     "data.seasonalEmployment": 1,
    //     "data.contractEmployment": 1,
    //     "data.farmerType": 1,

    //     "data.farmerProduction": 1,
    //     "data.metroDistrictObj": 1,
    //     "data.farmMuncipalRegionObj": 1,
    //     "data.provinceObj": 1,
    //     "data.businessEntityTypeObj": 1,

    //     "data.farmerAssetsServices": 1,
    //     "data.annualTurnoverObj": 1,
    //     "data.preferredcommunicationObj": 1,
    //   },
    // },
  ]);
  console.log("docs length : ", docs.length);
  let docsArray = docs; //docs[0].data;
  for (let i = 0; i < docsArray.length; i++) {
    //console.log("docsArray[i] : ", docsArray[i]);
    let obj = {};
    obj["_id"] = docsArray[i]._id;

    obj["surname"] = docsArray[i].surname == null ? "" : docsArray[i].surname;
    obj["name"] = docsArray[i].name == null ? "" : docsArray[i].name;
    obj["contactNumber"] =
      docsArray[i].contactNumber == null ? "" : docsArray[i].contactNumber;
    obj["identityNumber"] =
      docsArray[i].identityNumber == null ? "" : docsArray[i].identityNumber;

    obj["nationality"] =
      docsArray[i].nationalityObj && docsArray[i].nationalityObj.cndName != null
        ? docsArray[i].nationalityObj.cndName
        : "";

    obj["email"] = docsArray[i].email == null ? "" : docsArray[i].email;
    obj["isDisabled"] =
      docsArray[i].isDisabled == null ? "" : docsArray[i].isDisabled;
    obj["farmerType"] = docsArray[i].farmerType;
    obj["residentialAddress"] =
      docsArray[i].residentialAddress == null
        ? ""
        : docsArray[i].residentialAddress;
    obj["residentialPostalcode"] =
      docsArray[i].residentialPostalcode == null
        ? ""
        : docsArray[i].residentialPostalcode;
    obj["postalAddress"] =
      docsArray[i].postalAddress == null ? "" : docsArray[i].postalAddress;
    obj["postalcode"] =
      docsArray[i].postalcode == null ? "" : docsArray[i].postalcode;
    obj["farmingExperience"] =
      docsArray[i].farmingExperience == null
        ? ""
        : docsArray[i].farmingExperience;
    obj["farmingExperienceYears"] =
      docsArray[i].farmingExperienceYears == null
        ? ""
        : docsArray[i].farmingExperienceYears;
    obj["ageGroups"] =
      docsArray[i].ageGroupsObj && docsArray[i].ageGroupsObj.cndName != null
        ? docsArray[i].ageGroupsObj.cndName
        : "";

    obj["gender"] = docsArray[i].gender == null ? "" : docsArray[i].gender;

    obj["populationGroup"] =
      docsArray[i].populationGroupObj &&
      docsArray[i].populationGroupObj.cndName != null
        ? docsArray[i].populationGroupObj.cndName
        : "";

    obj["populationGroupOther"] =
      docsArray[i].populationGroupOther == null
        ? ""
        : docsArray[i].populationGroupOther;

    obj["homeLanguage"] =
      docsArray[i].homeLanguageObj &&
      docsArray[i].homeLanguageObj.cndName != null
        ? docsArray[i].homeLanguageObj.cndName
        : "";

    obj["homeLanguageOther"] =
      docsArray[i].homeLanguageOther == null
        ? ""
        : docsArray[i].homeLanguageOther;

    obj["education"] =
      docsArray[i].educationObj && docsArray[i].educationObj.cndName != null
        ? docsArray[i].educationObj.cndName
        : "";

    obj["operationType"] =
      docsArray[i].operationType == null ? "" : docsArray[i].operationType;
    obj["isOwner"] = docsArray[i].isOwner == "true" ? "YES" : "NO";

    obj["ownershipType"] =
      docsArray[i].ownershipTypeObj &&
      docsArray[i].ownershipTypeObj.cndName != null
        ? docsArray[i].ownershipTypeObj.cndName
        : "";

    obj["otherOwnerShip"] =
      docsArray[i].otherOwnerShip == null ? "" : docsArray[i].otherOwnerShip;

    obj["landAquisition"] =
      docsArray[i].landAquisitionObj &&
      docsArray[i].landAquisitionObj.cndName == null
        ? docsArray[i].landAquisitionObj.cndName
        : "";

    obj["landAquisitionOther"] =
      docsArray[i].landAquisitionOther == null
        ? ""
        : docsArray[i].landAquisitionOther;

    obj["programmeRedistribution"] =
      docsArray[i].programmeRedistributionObj &&
      docsArray[i].programmeRedistributionObj.cndName != null
        ? docsArray[i].programmeRedistributionObj.cndName
        : "";

    obj["programmeRedistributionOther"] =
      docsArray[i].programmeRedistributionOther == null
        ? ""
        : docsArray[i].programmeRedistributionOther;
    obj["NoOfEmployeesTotal"] = docsArray[i].noOfEmployees.totalEmp;
    obj["NoOfEmployeesMales"] = docsArray[i].noOfEmployees.Male;
    obj["NoOfEmployeesFemales"] = docsArray[i].noOfEmployees.Female;
    obj["NoOfEmployeesYouth"] = docsArray[i].noOfEmployees.Youth;
    obj["NoOfEmployeesDisable"] = docsArray[i].noOfEmployees["With Disability"];
    obj["EmploymentTypeMaleP"] = docsArray[i].parmanentEmployment.Male;
    obj["EmploymentTypeFemaleP"] = docsArray[i].parmanentEmployment.Female;
    obj["EmploymentTypeYouthMaleP"] =
      docsArray[i].parmanentEmployment["Youth Male"];
    obj["EmploymentTypeYouthFemaleP"] =
      docsArray[i].parmanentEmployment["Youth Female"];
    obj["EmploymentTypeMaleS"] = docsArray[i].seasonalEmployment.Male;
    obj["EmploymentTypeFemaleS"] = docsArray[i].seasonalEmployment.Female;
    obj["EmploymentTypeYouthMaleS"] =
      docsArray[i].seasonalEmployment["Youth Male"];
    obj["EmploymentTypeYouthFemaleS"] =
      docsArray[i].seasonalEmployment["Youth Female"];

    obj["EmploymentTypeMaleC"] = docsArray[i].contractEmployment.Male;
    obj["EmploymentTypeFemaleC"] = docsArray[i].contractEmployment.Female;
    obj["EmploymentTypeYouthMaleC"] =
      docsArray[i].contractEmployment["Youth Male"];
    obj["EmploymentTypeYouthFemaleC"] =
      docsArray[i].contractEmployment["Youth Female"];

    //Farmer Production

    if (
      docsArray[i].farmerProduction &&
      docsArray[i].farmerProduction.length > 0
    ) {
      obj["businessEntityType"] =
        docsArray[i].farmerProduction[0] &&
        docsArray[i].farmerProduction[0].businessEntityTypeObj &&
        docsArray[i].farmerProduction[0].businessEntityTypeObj.cndName != null
          ? docsArray[i].farmerProduction[0].businessEntityTypeObj.cndName
          : "";

      //province

      obj["Province"] =
        docsArray[i].farmerProduction[0] &&
        docsArray[i].farmerProduction[0].provinceObj &&
        docsArray[i].farmerProduction[0].provinceObj.cndName != null
          ? docsArray[i].farmerProduction[0].provinceObj.cndName
          : "";

      //metro district

      obj["MetroDistrict"] =
        docsArray[i].farmerProduction[0] &&
        docsArray[i].farmerProduction[0].metroDistrictObj &&
        docsArray[i].farmerProduction[0].metroDistrictObj.cndName != null
          ? docsArray[i].farmerProduction[0].metroDistrictObj.cndName
          : "";

      //municipality

      obj["DistrictMunicipality"] =
        docsArray[i].farmerProduction[0] &&
        docsArray[i].farmerProduction[0].farmMuncipalRegionObj &&
        docsArray[i].farmerProduction[0].farmMuncipalRegionObj.cndName != null
          ? docsArray[i].farmerProduction[0].farmMuncipalRegionObj.cndName
          : "";

      obj["farmLatitude"] =
        docsArray[i].farmerProduction[0].farmLatitude == null
          ? ""
          : docsArray[i].farmerProduction[0].farmLatitude;
      obj["farmLongitude"] =
        docsArray[i].farmerProduction[0].farmLongitude == null
          ? ""
          : docsArray[i].farmerProduction[0].farmLongitude;
      obj["farmName"] =
        docsArray[i].farmerProduction[0].farmName == null
          ? ""
          : docsArray[i].farmerProduction[0].farmName;

      obj["PortionNumber"] =
        docsArray[i].farmerProduction[0].portionNumber == null
          ? ""
          : docsArray[i].farmerProduction[0].portionNumber;
      obj["PortionName"] =
        docsArray[i].farmerProduction[0].portionName == null
          ? ""
          : docsArray[i].farmerProduction[0].portionName;

      obj["WardNumber"] =
        docsArray[i].farmerProduction[0].wardNumber == null
          ? ""
          : docsArray[i].farmerProduction[0].wardNumber;
      obj["TownOrVillage"] =
        docsArray[i].farmerProduction[0].townVillage == null
          ? ""
          : docsArray[i].farmerProduction[0].townVillage;
      obj["ProjectLegalEntityName"] =
        docsArray[i].farmerProduction[0].projectLegalEntityName == null
          ? ""
          : docsArray[i].farmerProduction[0].projectLegalEntityName;

      obj["CoOperativesMembers"] =
        docsArray[i].farmerProduction[0].totalMembersInEnitity == null
          ? ""
          : docsArray[i].farmerProduction[0].totalMembersInEnitity;
      obj["totalFarmSize"] =
        docsArray[i].farmerProduction[0].totalFarmSize.Total;
      obj["Grazing"] = docsArray[i].farmerProduction[0].totalFarmSize.Grazing;
      obj["NonArable"] =
        docsArray[i].farmerProduction[0].totalFarmSize["Non-arable"];
      obj["Arable"] = docsArray[i].farmerProduction[0].totalFarmSize.Arable;
      obj["Layers"] = docsArray[i].farmerProduction[0].liveStock.Layers;
      obj["LivestockGoat"] = docsArray[i].farmerProduction[0].liveStock.Goat;
      obj["LivestockBroilers"] =
        docsArray[i].farmerProduction[0].liveStock.Broilers;
      obj["LivestockCattle"] =
        docsArray[i].farmerProduction[0].liveStock.Cattle;
      obj["LivestockSheep"] = docsArray[i].farmerProduction[0].liveStock.Sheep;
      obj["LivestockPigs"] = docsArray[i].farmerProduction[0].liveStock.Pigs;
      obj["LivestockOstrich"] =
        docsArray[i].farmerProduction[0].liveStock.Ostrich;
      obj["LivestockRabbit"] =
        docsArray[i].farmerProduction[0].liveStock.Rabbit;
      obj["liveStockOther"] = docsArray[i].farmerProduction[0].liveStock.Other;
      obj["LivestockOtherSpecify"] =
        docsArray[i].farmerProduction[0].liveStockOther == null
          ? ""
          : docsArray[i].farmerProduction[0].liveStockOther;
      obj["HorticultureVegetablesHa"] =
        docsArray[i].farmerProduction[0].horticulture.Vegetables;
      obj["HorticultureVegetablesTons"] =
        docsArray[i].farmerProduction[0].horticultureProduction.VegetablesProd;
      obj["HorticultureFruitsHa"] =
        docsArray[i].farmerProduction[0].horticulture.Fruits;
      obj["HorticultureFruitsTons"] =
        docsArray[i].farmerProduction[0].horticultureProduction.FruitsProd;
      obj["HorticultureNutsHa"] =
        docsArray[i].farmerProduction[0].horticulture.Nuts;
      obj["HorticultureNutsTons"] =
        docsArray[i].farmerProduction[0].horticultureProduction.NutsProd;
      obj["HorticultureOtherHa"] =
        docsArray[i].farmerProduction[0].horticulture.horticulture_other;
      obj["HorticultureOtherTons"] =
        docsArray[
          i
        ].farmerProduction[0].horticultureProduction.horticulture_otherprod;
      obj["HorticultureOtherSpecify"] =
        docsArray[i].farmerProduction[0].horticultureOther == null
          ? ""
          : docsArray[i].farmerProduction[0].horticultureOther;
      obj["FieldCropsGrainha"] =
        docsArray[i].farmerProduction[0].fieldCrops.Grain;
      obj["FieldCropsGrainTons"] =
        docsArray[i].farmerProduction[0].fieldCropsProduction.GrainProd;
      obj["FieldCropsCottonHa"] =
        docsArray[i].farmerProduction[0].fieldCrops.Cotton;
      obj["FieldCropsCottonTons"] =
        docsArray[i].farmerProduction[0].fieldCropsProduction.CottonProd;
      obj["FieldCropsOilseedsHa"] =
        docsArray[i].farmerProduction[0].fieldCrops.Oilseeds;
      obj["FieldCropsOilseedsTons"] =
        docsArray[i].farmerProduction[0].fieldCropsProduction.OilseedsProd;
      obj["FieldCropsSugarCaneHa"] =
        docsArray[i].farmerProduction[0].fieldCrops["Sugar Cane"];
      obj["FieldCropsSugarCaneTons"] =
        docsArray[i].farmerProduction[0].fieldCropsProduction.SugarCaneProd;
      obj["FieldCropsOtherHa"] =
        docsArray[i].farmerProduction[0].fieldCrops.Field_Crops_Other;
      obj["FieldCropsOtherTons"] =
        docsArray[
          i
        ].farmerProduction[0].fieldCropsProduction.Field_Crops_OtherProd;
      obj["fieldCropsOtherSpecify"] =
        docsArray[i].farmerProduction[0].fieldCropsOther == null
          ? ""
          : docsArray[i].farmerProduction[0].fieldCropsOther;
      obj["ForestryLathsHa"] = docsArray[i].farmerProduction[0].forestry.Laths;
      obj["ForestryLathsTons"] =
        docsArray[i].farmerProduction[0].forestryProduction.LathsProd;
      obj["ForestryDroppersHa"] =
        docsArray[i].farmerProduction[0].forestry.Droppers;
      obj["ForestryDroppersTons"] =
        docsArray[i].farmerProduction[0].forestryProduction.DroppersProd;
      obj["ForestryPolesHa"] =
        docsArray[i].farmerProduction[0].forestry.Forestry_Poles;
      obj["ForestryPolesTons"] =
        docsArray[i].farmerProduction[0].forestryProduction.PolesProd;
      obj["ForestryBPolesHa"] =
        docsArray[i].farmerProduction[0].forestry["Building Poles"];
      obj["ForestryBPolesTons"] =
        docsArray[i].farmerProduction[0].forestryProduction[
          "Building Poles Prod"
        ];
      obj["ForestryOtherHa"] =
        docsArray[i].farmerProduction[0].forestry.Forestry_Other;
      obj["ForestryOtherTons"] =
        docsArray[i].farmerProduction[0].forestryProduction.Forestry_Other_Prod;
      obj["forestryOtherSpecify"] =
        docsArray[i].farmerProduction[0].forestryOther == null
          ? ""
          : docsArray[i].farmerProduction[0].forestryOther;
      obj["AquacultureFish"] =
        docsArray[i].farmerProduction[0].aquaculture.Fish;
      obj["AquaculturePlants"] =
        docsArray[i].farmerProduction[0].aquaculture.Plants;
      obj["AquacultureShelfish"] =
        docsArray[i].farmerProduction[0].aquaculture["Shell-fish"];
      obj["AquacultureOther"] =
        docsArray[i].farmerProduction[0].aquaculture.Aquaculture_Other;
      obj["aquacultureOtherSpecify"] =
        docsArray[i].farmerProduction[0].aquacultureOther == null
          ? ""
          : docsArray[i].farmerProduction[0].aquacultureOther;
      obj["SeaFishingHake"] = docsArray[i].farmerProduction[0].seaFishing.Hake;
      obj["SeaFishingSnoek"] =
        docsArray[i].farmerProduction[0].seaFishing.Snoek;
      obj["SeaFishingTuna"] = docsArray[i].farmerProduction[0].seaFishing.Tuna;
      obj["SeaFishingShelfish"] =
        docsArray[i].farmerProduction[0].seaFishing["SeaFishing_Shell-fish"];
      obj["SeaFishingLobster"] =
        docsArray[i].farmerProduction[0].seaFishing.Lobster;
      obj["SeaFishingOther"] =
        docsArray[i].farmerProduction[0].seaFishing.SeaFishing_Other;
      obj["seaFishingOtherSpecify"] =
        docsArray[i].farmerProduction[0].seaFishingOther == null
          ? ""
          : docsArray[i].farmerProduction[0].seaFishingOther;
      obj["GameFarmingBuffalo"] =
        docsArray[i].farmerProduction[0].gameFarming.Buffalo;
      obj["GameFarmingSpringbok"] =
        docsArray[i].farmerProduction[0].gameFarming.Springbok;
      obj["GameFarmingImpala"] =
        docsArray[i].farmerProduction[0].gameFarming.GameFarmingImpala;
      obj["GameFarmingCrocodiles"] =
        docsArray[i].farmerProduction[0].gameFarming.Crocodiles;
      obj["GameFarmingGemsbok"] =
        docsArray[i].farmerProduction[0].gameFarming.Gemsbok;
      obj["GameFarmingOther"] =
        docsArray[i].farmerProduction[0].gameFarming.GameFarming_Other;
      obj["GameFarmingOtherSpecify"] =
        docsArray[i].farmerProduction[0].gameFarmingOther == null
          ? ""
          : docsArray[i].farmerProduction[0].gameFarmingOther;
      obj["marketingChannelTypeFormal"] =
        docsArray[i].farmerProduction[0].marketingChannelTypeFormal == true
          ? "YES"
          : "NO";
      obj["marketingChannelTypeInformal"] =
        docsArray[i].farmerProduction[0].marketingChannelTypeInformal == true
          ? "YES"
          : "NO";
      obj["ValueAndAgroProcessing"] =
        docsArray[i].farmerProduction[0].practiseAgroProcessing == true
          ? "YES"
          : "NO";
      obj["SortingAndGrading"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing[
          "Sorting and Grading"
        ] == true
          ? "1"
          : "0";
      obj["Packaging"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing.Packaging == true
          ? "1"
          : "0";
      obj["ColdStorage"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing[
          "Cold Storage"
        ] == true
          ? "1"
          : "0";
      obj["SliceAndDice"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing[
          "Slice and Dice (cutting)"
        ] == true
          ? "1"
          : "0";
      obj["Labelling"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing.Labelling == true
          ? "1"
          : "0";
      obj["Pasteurising"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing.Pasteurising ==
        true
          ? "1"
          : "0";
      obj["PrimaryOthers"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessing.Others == true
          ? "1"
          : "0";
      obj["primaryOtherSpecify"] =
        docsArray[i].farmerProduction[0].primaryAgroProcessingOther == null
          ? ""
          : docsArray[i].farmerProduction[0].primaryAgroProcessingOther;

      obj["Milling"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessing.Milling == true
          ? "1"
          : "0";
      obj["Grinding"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessing.Grinding ==
        true
          ? "1"
          : "0";
      obj["Slaughtering"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessing.Slaughtering ==
        true
          ? "1"
          : "0";
      obj["PressingForOil"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessing[
          "Pressing for Oil"
        ] == true
          ? "1"
          : "0";
      obj["JuicingAndPurees"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessing[
          "Juicing and Purees"
        ] == true
          ? "1"
          : "0";
      obj["SecondaryOthers"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessing.Others == true
          ? "1"
          : "0";
      obj["secondaryOtherSpecify"] =
        docsArray[i].farmerProduction[0].secondaryAgroProcessingOther == null
          ? ""
          : docsArray[i].farmerProduction[0].secondaryAgroProcessingOther;

      obj["Canning"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessing.Canning == true
          ? "1"
          : "0";
      obj["Bottling"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessing.Bottling == true
          ? "1"
          : "0";
      obj["Extraction"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessing[
          "Extraction (Concentrates)"
        ] == true
          ? "1"
          : "0";
      obj["Mixing"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessing.Mixing == true
          ? "1"
          : "0";
      obj["Flavouring"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessing.Flavouring ==
        true
          ? "1"
          : "0";
      obj["AdvancedOthers"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessing.Others == true
          ? "1"
          : "0";
      obj["AdvancedOtherSpecify"] =
        docsArray[i].farmerProduction[0].advancedAgroProcessingOther == null
          ? ""
          : docsArray[i].farmerProduction[0].advancedAgroProcessingOther;
      obj["UndertakenMmanually"] =
        docsArray[i].farmerProduction[0].practiseAgroProcessingManual == true
          ? "YES"
          : "NO";
    } else {
      obj["farmLatitude"] = "";
      obj["farmLongitude"] = "";
      obj["farmName"] = "";
      obj["PortionNumber"] = "";
      obj["PortionName"] = "";
      obj["WardNumber"] = "";
      obj["TownOrVillage"] = "";
      obj["ProjectLegalEntityName"] = "";
      obj["CoOperativesMembers"] = "";
      obj["totalFarmSize"] = "";
      obj["Grazing"] = "";
      obj["NonArable"] = "";
      obj["Arable"] = "";
      obj["Layers"] = "";
      obj["LivestockGoat"] = "";
      obj["LivestockBroilers"] = "";
      obj["LivestockCattle"] = "";
      obj["LivestockSheep"] = "";
      obj["LivestockPigs"] = "";
      obj["LivestockOstrich"] = "";
      obj["LivestockRabbit"] = "";
      obj["liveStockOther"] = "";
      obj["LivestockOtherSpecify"] = "";
      obj["HorticultureVegetablesHa"] = "";
      obj["HorticultureVegetablesTons"] = "";
      obj["HorticultureFruitsHa"] = "";
      obj["HorticultureFruitsTons"] = "";
      obj["HorticultureNutsHa"] = "";
      obj["HorticultureNutsTons"] = "";
      obj["HorticultureOtherHa"] = "";
      obj["HorticultureOtherTons"] = "";
      obj["HorticultureOtherSpecify"] = "";
      obj["FieldCropsGrainha"] = "";
      obj["FieldCropsGrainTons"] = "";
      obj["FieldCropsCottonHa"] = "";
      obj["FieldCropsCottonTons"] = "";
      obj["FieldCropsOilseedsHa"] = "";
      obj["FieldCropsOilseedsTons"] = "";
      obj["FieldCropsSugarCaneHa"] = "";
      obj["FieldCropsSugarCaneTons"] = "";
      obj["FieldCropsOtherHa"] = "";
      obj["FieldCropsOtherTons"] = "";
      obj["fieldCropsOtherSpecify"] = "";
      obj["ForestryLathsHa"] = "";
      obj["ForestryLathsTons"] = "";
      obj["ForestryDroppersHa"] = "";
      obj["ForestryDroppersTons"] = "";
      obj["ForestryPolesHa"] = "";
      obj["ForestryPolesTons"] = "";
      obj["ForestryBPolesHa"] = "";
      obj["ForestryBPolesTons"] = "";
      obj["ForestryOtherHa"] = "";
      obj["ForestryOtherTons"] = "";
      obj["forestryOtherSpecify"] = "";
      obj["AquacultureFish"] = "";
      obj["AquaculturePlants"] = "";
      obj["AquacultureShelfish"] = "";
      obj["AquacultureOther"] = "";
      obj["aquacultureOtherSpecify"] = "";
      obj["SeaFishingHake"] = "";
      obj["SeaFishingSnoek"] = "";
      obj["SeaFishingTuna"] = "";
      obj["SeaFishingShelfish"] = "";
      obj["SeaFishingLobster"] = "";
      obj["SeaFishingOther"] = "";
      obj["seaFishingOtherSpecify"] = "";
      obj["GameFarmingBuffalo"] = "";
      obj["GameFarmingSpringbok"] = "";
      obj["GameFarmingImpala"] = "";
      obj["GameFarmingCrocodiles"] = "";
      obj["GameFarmingGemsbok"] = "";
      obj["GameFarmingOther"] = "";
      obj["GameFarmingOtherSpecify"] = "";
      obj["marketingChannelTypeFormal"] = "";
      obj["marketingChannelTypeInformal"] = "";
      obj["ValueAndAgroProcessing"] = "";
      obj["SortingAndGrading"] = "";
      obj["Packaging"] = "";
      obj["ColdStorage"] = "";
      obj["SliceAndDice"] = "";
      obj["Labelling"] = "";
      obj["Pasteurising"] = "";
      obj["PrimaryOthers"] = "";
      obj["primaryOtherSpecify"] = "";
      obj["Milling"] = "";
      obj["Grinding"] = "";
      obj["Slaughtering"] = "";
      obj["PressingForOil"] = "";
      obj["JuicingAndPurees"] = "";
      obj["SecondaryOthers"] = "";
      obj["secondaryOtherSpecify"] = "";
      obj["Canning"] = "";
      obj["Bottling"] = "";
      obj["Extraction"] = "";
      obj["Mixing"] = "";
      obj["Flavouring"] = "";
      obj["AdvancedOthers"] = "";
      obj["AdvancedOtherSpecify"] = "";
      obj["UndertakenMmanually"] = "";
    }
    //farmer Assets

    if (
      docsArray[i].farmerAssetsServices &&
      docsArray[i].farmerAssetsServices.length > 0
    ) {
      //annual turnover

      obj["ApproximateAnnualTurnover"] =
        docsArray[i].farmerAssetsServices[0] &&
        docsArray[i].farmerAssetsServices[0].annualTurnoverObj &&
        docsArray[i].farmerAssetsServices[0].annualTurnoverObj.cndName != null
          ? docsArray[i].farmerAssetsServices[0].annualTurnoverObj.cndName
          : "";

      //preferred communication
      obj["preferredcommunication"] =
        docsArray[i].farmerAssetsServices[0] &&
        docsArray[i].farmerAssetsServices[0].preferredcommunicationObj &&
        docsArray[i].farmerAssetsServices[0].preferredcommunicationObj
          .cndName != null
          ? docsArray[i].farmerAssetsServices[0].preferredcommunicationObj
              .cndName
          : "";

      obj["FixedStructuresFarmHouse"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures[
          "Farm House/Stead"
        ] == true
          ? "1"
          : "0";
      obj["FixedStructuresStorageRooms"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures[
          "Storage Rooms/ Sheds"
        ] == true
          ? "1"
          : "0";
      obj["FixedStructuresPoultryHouses"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures[
          "Poultry houses"
        ] == true
          ? "1"
          : "0";
      obj["FixedStructuresPigsty"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures.Pigsty == true
          ? "1"
          : "0";
      obj["FixedStructuresPackhouse"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures.Packhouse == true
          ? "1"
          : "0";
      obj["FixedStructuresFencing"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures.Fencing == true
          ? "1"
          : "0";
      obj["FixedStructuresOther"] =
        docsArray[i].farmerAssetsServices[0].fixedStructures.Other == true
          ? "1"
          : "0";
      obj["FixedStructuresOtherSpecify"] =
        docsArray[i].farmerAssetsServices[0].fixedStructureOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].fixedStructureOther;

      obj["IrrigationDripMicro"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystems[
          "Drip/Micro Irrigation"
        ] == true
          ? "1"
          : "0";
      obj["IrrigationSprinkler"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystems[
          "Sprinkler Irrigation"
        ] == true
          ? "1"
          : "0";
      obj["IrrigationCentrePivots"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystems[
          "Centre Pivots"
        ] == true
          ? "1"
          : "0";
      obj["IrrigationFurrow"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystems[
          "Furrow Irrigation"
        ] == true
          ? "1"
          : "0";
      obj["IrrigationFlood"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystems[
          "Flood Irrigation"
        ] == true
          ? "1"
          : "0";
      obj["IrrigationOther"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystems.Other == true
          ? "1"
          : "0";
      obj["IrrigationOtherSpecify"] =
        docsArray[i].farmerAssetsServices[0].irrigationSystemOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].irrigationSystemOther;

      obj["WaterRiver"] =
        docsArray[i].farmerAssetsServices[0].waterInfrastructure.River == true
          ? "1"
          : "0";
      obj["WaterDams"] =
        docsArray[i].farmerAssetsServices[0].waterInfrastructure[
          "Dams (Catchment Areas)"
        ] == true
          ? "1"
          : "0";
      obj["WaterCanal"] =
        docsArray[i].farmerAssetsServices[0].waterInfrastructure["Canal"] ==
        true
          ? "1"
          : "0";
      obj["WaterBoreholesWindmills"] =
        docsArray[i].farmerAssetsServices[0].waterInfrastructure[
          "Boreholes/Windmills"
        ] == true
          ? "1"
          : "0";
      obj["WaterOther"] =
        docsArray[i].farmerAssetsServices[0].waterInfrastructure.Other == true
          ? "1"
          : "0";
      obj["WaterOtherSpecify"] =
        docsArray[i].farmerAssetsServices[0].waterInfrastructureOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].waterInfrastructureOther;

      obj["MachineryTractor"] =
        docsArray[i].farmerAssetsServices[0].machineryVehicles.Tractor == true
          ? "1"
          : "0";
      obj["MachineryCombineHarvester"] =
        docsArray[i].farmerAssetsServices[0].machineryVehicles[
          "Combine Harvester"
        ] == true
          ? "1"
          : "0";
      obj["MachineryTruck"] =
        docsArray[i].farmerAssetsServices[0].machineryVehicles.Truck == true
          ? "1"
          : "0";
      obj["MachineryLightDelivery"] =
        docsArray[i].farmerAssetsServices[0].machineryVehicles[
          "Light Delivery Vehicle/Bakkie"
        ] == true
          ? "1"
          : "0";
      obj["MachineryOther"] =
        docsArray[i].farmerAssetsServices[0].machineryVehicles.Other == true
          ? "1"
          : "0";
      obj["MachineryOtherSpecify"] =
        docsArray[i].farmerAssetsServices[0].machineryVehicleOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].machineryVehicleOther;

      obj["ImplementsEquipmentPlough"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipment.Plough == true
          ? "1"
          : "0";
      obj["ImplementsEquipmentPlanter"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipment.Planter == true
          ? "1"
          : "0";
      obj["ImplementsEquipmentTiller"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipment.Tiller == true
          ? "1"
          : "0";
      obj["ImplementsEquipmentGarden"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipment[
          "Garden Tools"
        ] == true
          ? "1"
          : "0";
      obj["ImplementsEquipmentTrailer"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipment.Trailer == true
          ? "1"
          : "0";
      obj["ImplementsEquipmentOther"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipment.Other == true
          ? "1"
          : "0";
      obj["ImplementsEquipmentSpecify"] =
        docsArray[i].farmerAssetsServices[0].implementsEquipmentOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].implementsEquipmentOther;

      obj["OtherDipTank"] =
        docsArray[i].farmerAssetsServices[0].otherAssets["Dip Tank"] == true
          ? "1"
          : "0";
      obj["OtherAccessRoad"] =
        docsArray[i].farmerAssetsServices[0].otherAssets["Access Road"] == true
          ? "1"
          : "0";
      obj["OtherElectricity"] =
        docsArray[i].farmerAssetsServices[0].otherAssets.Electricity == true
          ? "1"
          : "0";
      obj["OtherOther"] =
        docsArray[i].farmerAssetsServices[0].otherAssets.Other == true
          ? "1"
          : "0";
      obj["OtherOtherSpecify"] =
        docsArray[i].farmerAssetsServices[0].otherAssetsOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].otherAssetsOther;

      obj["DipTankElsewhere"] =
        docsArray[i].farmerAssetsServices[0].isAccessToDipTank == true
          ? "YES"
          : "NO";
      obj["WhichOfTheFollowing"] =
        docsArray[i].farmerAssetsServices[0].dipTankValue;
      obj["TypeOfDipTank"] = docsArray[i].farmerAssetsServices[0].dipTankType;

      obj["MAFISA"] =
        docsArray[i].farmerAssetsServices[0].govtSupport.MAFISA == true
          ? "1"
          : "0";
      obj["CASP"] =
        docsArray[i].farmerAssetsServices[0].govtSupport.CASP == true
          ? "1"
          : "0";
      obj["AgriBEEE"] =
        docsArray[i].farmerAssetsServices[0].govtSupport[
          "AgriBEE (eg Equity Programme)"
        ] == true
          ? "1"
          : "0";
      obj["LandCare"] =
        docsArray[i].farmerAssetsServices[0].govtSupport["Land Care"] == true
          ? "1"
          : "0";
      obj["RECAP"] =
        docsArray[i].farmerAssetsServices[0].govtSupport.RECAP == true
          ? "1"
          : "0";
      obj["ILMA"] =
        docsArray[i].farmerAssetsServices[0].govtSupport.ILIMA == true
          ? "1"
          : "0";
      obj["OtherGovernmentSupport"] =
        docsArray[i].farmerAssetsServices[0].govtSupport.Other == true
          ? "1"
          : "0";
      obj["GovernmentSupportSpecify"] =
        docsArray[i].farmerAssetsServices[0].govtSupportOther == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].govtSupportOther;

      obj["ExtensionServices"] =
        docsArray[i].farmerAssetsServices[0].haveExtensionServices == true
          ? "YES"
          : "NO";
      obj["ExtensionServicesInUse"] =
        docsArray[i].farmerAssetsServices[0].extensionServiceType == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].extensionServiceType;
      obj["VeterinaryServices"] =
        docsArray[i].farmerAssetsServices[0].haveVeterinaryServices == true
          ? "YES"
          : "NO";
      obj["VeterinaryServicesInUse"] =
        docsArray[i].farmerAssetsServices[0].veterinaryServiceType == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].veterinaryServiceType;
      obj["EarlyWarningInformation"] =
        docsArray[i].farmerAssetsServices[0].earlyWarningInfo == true
          ? "YES"
          : "NO";
      obj["AgriculturalEconomicInfo"] =
        docsArray[i].farmerAssetsServices[0].agriEconomicInfo == true
          ? "YES"
          : "NO";
      obj["Training"] =
        docsArray[i].farmerAssetsServices[0].training == true ? "YES" : "NO";

      obj["hasCropInsurance"] =
        docsArray[i].farmerAssetsServices[0].hasCropInsurance == true
          ? "YES"
          : "NO";
      obj["insuranceCompanyName"] =
        docsArray[i].farmerAssetsServices[0].insuranceCompanyName == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].insuranceCompanyName;
      obj["insuranceType"] =
        docsArray[i].farmerAssetsServices[0].insuranceType == null
          ? ""
          : docsArray[i].farmerAssetsServices[0].insuranceType;
    } else {
      obj["FixedStructuresFarmHouse"] = "";
      obj["FixedStructuresStorageRooms"] = "";
      obj["FixedStructuresPoultryHouses"] = "";
      obj["FixedStructuresPigsty"] = "";
      obj["FixedStructuresPackhouse"] = "";
      obj["FixedStructuresFencing"] = "";
      obj["FixedStructuresOther"] = "";
      obj["FixedStructuresOtherSpecify"] = "";
      obj["IrrigationDripMicro"] = "";
      obj["IrrigationSprinkler"] = "";
      obj["IrrigationCentrePivots"] = "";
      obj["IrrigationFurrow"] = "";
      obj["IrrigationFlood"] = "";
      obj["IrrigationOther"] = "";
      obj["IrrigationOtherSpecify"] = "";
      obj["WaterRiver"] = "";
      obj["WaterDams"] = "";
      obj["WaterCanal"] = "";
      obj["WaterBoreholesWindmills"] = "";
      obj["WaterOther"] = "";
      obj["WaterOtherSpecify"] = "";
      obj["MachineryTractor"] = "";
      obj["MachineryCombineHarvester"] = "";
      obj["MachineryTruck"] = "";
      obj["MachineryLightDelivery"] = "";
      obj["MachineryOther"] = "";
      obj["MachineryOtherSpecify"] = "";
      obj["ImplementsEquipmentPlough"] = "";
      obj["ImplementsEquipmentPlanter"] = "";
      obj["ImplementsEquipmentTiller"] = "";
      obj["ImplementsEquipmentGarden"] = "";
      obj["ImplementsEquipmentTrailer"] = "";
      obj["ImplementsEquipmentOther"] = "";
      obj["ImplementsEquipmentSpecify"] = "";
      obj["OtherDipTank"] = "";
      obj["OtherAccessRoad"] = "";
      obj["OtherElectricity"] = "";
      obj["OtherOther"] = "";
      obj["OtherOtherSpecify"] = "";
      obj["DipTankElsewhere"] = "";
      obj["WhichOfTheFollowing"] = "";
      obj["MAFISA"] = "";
      obj["CASP"] = "";
      obj["AgriBEEE"] = "";
      obj["LandCare"] = "";
      obj["RECAP"] = "";
      obj["ILMA"] = "";
      obj["OtherGovernmentSupport"] = "";
      obj["GovernmentSupportSpecify"] = "";
      obj["ExtensionServices"] = "";
      obj["ExtensionServicesInUse"] = "";
      obj["VeterinaryServices"] = "";
      obj["VeterinaryServicesInUse"] = "";
      obj["EarlyWarningInformation"] = "";
      obj["AgriculturalEconomicInfo"] = "";
      obj["Training"] = "";
      obj["hasCropInsurance"] = "";
      obj["insuranceCompanyName"] = "";
      obj["insuranceType"] = "";
    }
    worksheet.addRow(obj);
  }
  return docs;
};

router.get("/api/lookupexportfarmers", auth, async function (req, res) {
  try {
    console.log("Export Farmers Started !! ");
    //console.log("process.env.NODE_OPTIONS : ", process.env.NODE_OPTIONS);
    req.setTimeout(2880000);

    let skipRecords = 0;
    if (
      req.query.skipRecords == "0" ||
      req.query.skipRecords == "5000" ||
      req.query.skipRecords == "10000" ||
      req.query.skipRecords == "15000"
    ) {
      skipRecords = Number(req.query.skipRecords);
    }

    let sheetName = req.query.sheetName;

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName, {
      //views: [{ state: "frozen", xSplit: 4, ySplit: 1 }],
    });
    worksheet.properties.defaultRowHeight = 20;
    worksheet.autoFilter = "A1:HC1";
    //   worksheet.columns = [
    //     { header: "Id", key: "id", width: 10 },
    //     { header: "Name", key: "name", width: 32 },
    //     { header: "D.O.B.", key: "dob", width: 15 },
    //   ];

    //worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
    //worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

    worksheet.columns = farmerColumns;

    // let finalResult = [];
    let dbquery = {};
    let dbquery_search = "";

    if (req.query.name) {
      dbquery.name = req.query.name;
    }

    if (req.query.searchTable) dbquery_search = req.query.searchTable;

    // const totalFarmers = await FarmerDetail.countDocuments({
    //   $and: [
    //     dbquery,
    //     {
    //       $or: [
    //         { surname: { $regex: dbquery_search, $options: "i" } },
    //         { name: { $regex: dbquery_search, $options: "i" } },
    //         { identityNumber: { $regex: dbquery_search, $options: "i" } },
    //         { contactNumber: { $regex: dbquery_search, $options: "i" } },
    //         { farmerType: { $regex: dbquery_search, $options: "i" } },
    //       ],
    //     },
    //   ],
    // });

    const limitRecords = 5000;
    //const mainLoop = Math.ceil(totalFarmers / limitRecords);

    await getFarmers(
      skipRecords,
      limitRecords,
      dbquery,
      dbquery_search,
      worksheet
    );

    console.log("writing to excel");
    // var today = new Date();
    // var dd = String(today.getDate()).padStart(2, "0");
    // var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    // var yyyy = today.getFullYear();
    // var hrs = today.getHours();
    // var mins = today.getMinutes();
    // var secs = today.getSeconds();

    // today = dd + "-" + mm + "-" + yyyy + "_" + hrs + mins + secs;
    //workbook.xlsx.writeFile("public/uploads/export.xlsx");
    // let fileNo = 1;
    // if (skipRecords == 0) fileNo = 1;
    // else if (skipRecords == 5000) fileNo = 2;
    // else if (skipRecords == 10000) fileNo = 3;
    // else if (skipRecords == 15000) fileNo = 4;
    //let fileName = "Farmers_" + today + "_" + fileNo + ".xlsx";
    console.log("fileName", req.query.fileName);
    workbook.xlsx.writeFile("public/uploads/" + req.query.fileName);
    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      //result: docs[0].data,
      //result: data,
      fileName: req.query.fileName,
      //totalRecCount: totalFarmers,
    });
  } catch (err) {
    console.log("fetch failed", err);
  }
});

let GetFormattedDate = function (val) {
  var month = String(val.getMonth() + 1).padStart(2, "0");
  var day = String(val.getDate()).padStart(2, "0");
  var year = val.getFullYear();
  return day + "/" + month + "/" + year;
};

const getFarmerInteractions = async (
  skipArg,
  limitArg,
  dbquery,
  dbquery_search,
  worksheet
) => {
  let docs = await Interactions.aggregate([
    // {
    //   $match: {
    //     $and: [
    //       dbquery,
    //       {
    //         $or: [
    //           { surname: { $regex: dbquery_search, $options: "i" } },
    //           { name: { $regex: dbquery_search, $options: "i" } },
    //           {
    //             identityNumber: { $regex: dbquery_search, $options: "i" },
    //           },
    //           {
    //             contactNumber: { $regex: dbquery_search, $options: "i" },
    //           },
    //           { farmerType: { $regex: dbquery_search, $options: "i" } },
    //         ],
    //       },
    //     ],
    //   },
    // },
    {
      $lookup: {
        from: "farmer_details",
        localField: "farmerId",
        foreignField: "_id",
        as: "farmerDetails",
      },
    },
    {
      $lookup: {
        from: "cnds",
        localField: "farmerDetails.ownershipType",
        foreignField: "_id",
        as: "ownershipType",
      },
    },
    {
      $lookup: {
        from: "farmer_productions",
        localField: "farmerDetails._id",
        foreignField: "farmerId",
        as: "farmerProduction",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "supervisor",
        foreignField: "_id",
        as: "supervisors",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "users",
      },
    },

    { $sort: { _id: -1 } },
    {
      $facet: {
        data: [{ $skip: skipArg }, { $limit: limitArg }],
      },
    },
    {
      $project: {
        "data._id": 1,
        "data.users": 1,
        "data.supervisors": 1,
        "data.farmerDetails": 1,
        "data.ownershipType.cndName": 1,
        "data.farmerProduction": 1,
        "data.serviceType": 1,
        "data.serviceDate": 1,
        "data.serviceDescription": 1,
        "data.additionalServices": 1,
        "data.proposals": 1,
        "data.referralDetails": 1,
        "data.commodity": 1,
        "data.commodityOther": 1,
        "data.serviceSignature": 1,
        "data.extensionSignature": 1,
        "data.managerSignature": 1,
        "data.createdDate": 1,
      },
    },
  ]);
  //console.log("docs length : ", docs[0].data);
  for (let i = 0; i < docs[0].data.length; i++) {
    let obj = {};
    obj["_id"] = docs[0].data[i]._id;
    if (docs[0].data[i].users.length > 0) {
      obj["Extension Officer Name"] =
        docs[0].data[i].users[0].firstName == undefined
          ? ""
          : docs[0].data[i].users[0].firstName;
      obj["Extension Officer Surname"] =
        docs[0].data[i].users[0].lastName == undefined
          ? ""
          : docs[0].data[i].users[0].lastName;

      obj["Extension Officer Phone"] =
        docs[0].data[i].users[0].phone == undefined
          ? ""
          : docs[0].data[i].users[0].phone;
    } else {
      obj["Extension Officer Name"] = "";
      obj["Extension Officer Surname"] = "";
      obj["Extension Officer Phone"] = "";
    }
    if (docs[0].data[i].supervisors.length > 0) {
      obj["Supervisor Name"] =
        docs[0].data[i].supervisors[0].firstName == undefined
          ? ""
          : docs[0].data[i].supervisors[0].firstName;
      obj["Supervisor Surname"] =
        docs[0].data[i].supervisors[0].lastName == undefined
          ? ""
          : docs[0].data[i].supervisors[0].lastName;

      obj["Supervisor Phone"] =
        docs[0].data[i].supervisors[0].phone == undefined
          ? ""
          : docs[0].data[i].supervisors[0].phone;
    } else {
      obj["Supervisor Name"] = "";
      obj["Supervisor Surname"] = "";
      obj["Supervisor Phone"] = "";
    }

    if (docs[0].data[i].farmerDetails.length > 0) {
      obj["Farmer Name"] =
        docs[0].data[i].farmerDetails[0].name == undefined
          ? ""
          : docs[0].data[i].farmerDetails[0].name;
      obj["Farmer Surname"] =
        docs[0].data[i].farmerDetails[0].surname == undefined
          ? ""
          : docs[0].data[i].farmerDetails[0].surname;

      obj["identityNumber"] =
        docs[0].data[i].farmerDetails[0].identityNumber == undefined
          ? ""
          : docs[0].data[i].farmerDetails[0].identityNumber;

      obj["farmerType"] = docs[0].data[i].farmerDetails[0].farmerType;
    } else {
      obj["Farmer Name"] = "";
      obj["Farmer Surname"] = "";
      obj["identityNumber"] = "";
      obj["farmerType"] = "";
    }
    if (docs[0].data[i].ownershipType.length > 0) {
      obj["ownershipType"] =
        docs[0].data[i].ownershipType[0].cndName == null
          ? ""
          : docs[0].data[i].ownershipType[0].cndName;
    } else obj["ownershipType"] = "";
    //Farmer Production
    if (docs[0].data[i].farmerProduction.length > 0) {
      obj["farmName"] =
        docs[0].data[i].farmerProduction[0].farmName == null
          ? ""
          : docs[0].data[i].farmerProduction[0].farmName;
      obj["ProjectLegalEntityName"] =
        docs[0].data[i].farmerProduction[0].projectLegalEntityName == null
          ? ""
          : docs[0].data[i].farmerProduction[0].projectLegalEntityName;
      obj["WardNumber"] =
        docs[0].data[i].farmerProduction[0].wardNumber == null
          ? ""
          : docs[0].data[i].farmerProduction[0].wardNumber;
      obj["totalFarmSize"] =
        docs[0].data[i].farmerProduction[0].totalFarmSize.Total;
      obj["farmLatitude"] =
        docs[0].data[i].farmerProduction[0].farmLatitude == null
          ? ""
          : docs[0].data[i].farmerProduction[0].farmLatitude;
      obj["farmLongitude"] =
        docs[0].data[i].farmerProduction[0].farmLongitude == null
          ? ""
          : docs[0].data[i].farmerProduction[0].farmLongitude;
    } else {
      obj["farmLatitude"] = "";
      obj["farmLongitude"] = "";
      obj["farmName"] = "";
      obj["WardNumber"] = "";
      obj["ProjectLegalEntityName"] = "";
      obj["totalFarmSize"] = "";
    }

    obj["serviceType"] = docs[0].data[i].serviceType;
    obj["serviceDate"] = GetFormattedDate(
      new Date(docs[0].data[i].serviceDate * 1000)
    );
    obj["serviceDescription"] = docs[0].data[i].serviceDescription;
    obj["additionalServices"] = docs[0].data[i].additionalServices;
    obj["proposals"] = docs[0].data[i].proposals;
    obj["referralDetails"] = docs[0].data[i].referralDetails;
    obj["Horticulture"] =
      docs[0].data[i].commodity.Horticulture == true ? "1" : "0";
    obj["Cotton"] = docs[0].data[i].commodity.Cotton == true ? "1" : "0";
    obj["Sugarcane"] = docs[0].data[i].commodity.Sugarcane == true ? "1" : "0";
    obj["Vegetables"] =
      docs[0].data[i].commodity.Vegetables == true ? "1" : "0";
    obj["Grain Crops"] =
      docs[0].data[i].commodity["Grain Crops"] == true ? "1" : "0";
    obj["Large Stock"] =
      docs[0].data[i].commodity["Large Stock"] == true ? "1" : "0";
    obj["Small Stock"] =
      docs[0].data[i].commodity["Small Stock"] == true ? "1" : "0";
    obj["Poultry"] = docs[0].data[i].commodity.Poultry == true ? "1" : "0";
    obj["Fodder"] = docs[0].data[i].commodity.Fodder == true ? "1" : "0";
    obj["Other"] = docs[0].data[i].commodity.Other == true ? "1" : "0";
    obj["commodityOther"] = docs[0].data[i].commodityOther;
    obj["serviceSignature"] = docs[0].data[i].serviceSignature
      ? "https://tdapwebapi.azurewebsites.net/uploads/" +
        docs[0].data[i].serviceSignature +
        "?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjMzMTI0NjYxNDY0MTQ2LCJpYXQiOjE2MjAxOTc0NjQsImV4cCI6MTYyMDIzMzQ2NH0.aONzmAD4e2qVYcbwJRJGg0ocRJBuhnqtUUHgtf8XKP0"
      : "NA";

    // obj["extensionSignature"] = docs[0].data[i].extensionSignature;
    // obj["managerSignature"] = docs[0].data[i].managerSignature;
    obj["createdDate"] = GetFormattedDate(
      new Date(docs[0].data[i].createdDate)
    );

    worksheet.addRow(obj);
    if (docs[0].data[i].serviceSignature) {
      const signatureRow = worksheet.getRow(i + 2);
      signatureRow.getCell(35).value = {
        text: "Click to view signature",
        // docs[0].data[i].serviceSignature
        // ? docs[0].data[i].serviceSignature
        // : "",
        hyperlink: docs[0].data[i].serviceSignature
          ? "https://tdapwebapi.azurewebsites.net/uploads/" +
            docs[0].data[i].serviceSignature +
            "?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTYyMDI4ODIwOX0.ckY_HXCKeqdJDFpaxvGbSrRMm5Hnk43ELLS_bR8lgQc"
          : "",
      };
      signatureRow.getCell(35).font = {
        name: "Calibri",
        color: { argb: "0000FF" },
        family: 4,
        size: 11,
        underline: true,
        bold: true,
      };
    }
  }

  worksheet.getRow(1).font = {
    name: "Calibri",
    color: { argb: "FFFFFFFF" },
    family: 4,
    size: 11,
    bold: true,
  };
  worksheet.getRow(1).fill = {
    type: "gradient",
    gradient: "path",
    center: { left: 0.5, top: 0.5 },
    stops: [
      { position: 0, color: { argb: "006400" } },
      { position: 1, color: { argb: "006400" } },
    ],
  };
  return docs[0].data;
};

router.get("/api/exportfarmerinteractions", auth, async function (req, res) {
  try {
    req.setTimeout(2880000);

    let skipRecords = 0;
    // if (
    //   req.query.skipRecords == "0" ||
    //   req.query.skipRecords == "5000" ||
    //   req.query.skipRecords == "10000" ||
    //   req.query.skipRecords == "15000"
    // ) {
    //   skipRecords = Number(req.query.skipRecords);
    // }

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(
      "ClientInteractions",

      { views: [{ state: "frozen", xSplit: 3, ySplit: 1 }] }
    );
    worksheet.properties.defaultRowHeight = 20;
    worksheet.autoFilter = "A1:AI1";
    //   worksheet.columns = [
    //     { header: "Id", key: "id", width: 10 },
    //     { header: "Name", key: "name", width: 32 },
    //     { header: "D.O.B.", key: "dob", width: 15 },
    //   ];

    //worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
    //worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

    worksheet.columns = [
      {
        header: "Extension Officer Surname",
        key: "Extension Officer Surname",
        width: 30,
      },
      {
        header: "Extension Officer Name",
        key: "Extension Officer Name",
        width: 25,
      },
      {
        header: "Extension Officer Phone",
        key: "Extension Officer Phone",
        width: 25,
      },
      {
        header: "Supervisor Surname",
        key: "Supervisor Surname",
        width: 25,
      },
      {
        header: "Supervisor Name",
        key: "Supervisor Name",
        width: 25,
      },
      {
        header: "Supervisor Phone",
        key: "Supervisor Phone",
        width: 25,
      },
      {
        header: "Farmer Surname",
        key: "Farmer Surname",
        width: 25,
      },
      {
        header: "Farmer Name",
        key: "Farmer Name",
        width: 25,
      },
      {
        header: "Identity Number",
        key: "identityNumber",
        width: 20,
      },
      {
        header: "FarmerType",
        key: "farmerType",
        width: 15,
      },
      {
        header: "OwnershipType",
        key: "ownershipType",
        width: 25,
      },
      {
        header: "FarmName",
        key: "farmName",
        width: 25,
      },
      {
        header: "Project Name",
        key: "ProjectLegalEntityName",
        width: 25,
      },
      {
        header: "Ward Number",
        key: "WardNumber",
        width: 25,
      },
      {
        header: "Total Area",
        key: "totalFarmSize",
        width: 25,
      },
      {
        header: "farmLatitude",
        key: "farmLatitude",
        width: 25,
      },
      {
        header: "farmLongitude",
        key: "farmLongitude",
        width: 25,
      },
      {
        header: "serviceType",
        key: "serviceType",
        width: 30,
      },
      {
        header: "serviceDate",
        key: "serviceDate",
        width: 25,
      },
      {
        header: "serviceDescription",
        key: "serviceDescription",
        width: 25,
      },
      {
        header: "additionalServices",
        key: "additionalServices",
        width: 25,
      },
      {
        header: "proposals",
        key: "proposals",
        width: 25,
      },
      {
        header: "referralDetails",
        key: "referralDetails",
        width: 25,
      },
      {
        header: "Horticulture",
        key: "Horticulture",
        width: 25,
      },
      {
        header: "Cotton",
        key: "Cotton",
        width: 25,
      },
      {
        header: "Sugarcane",
        key: "Sugarcane",
        width: 25,
      },
      {
        header: "Vegetables",
        key: "Vegetables",
        width: 25,
      },
      {
        header: "Grain Crops",
        key: "Grain Crops",
        width: 25,
      },
      {
        header: "Large Stock",
        key: "Large Stock",
        width: 25,
      },
      {
        header: "Small Stock",
        key: "Small Stock",
        width: 25,
      },
      {
        header: "Poultry",
        key: "Poultry",
        width: 25,
      },
      {
        header: "Fodder",
        key: "Fodder",
        width: 25,
      },
      {
        header: "Other",
        key: "Other",
        width: 25,
      },
      {
        header: "commodityOther",
        key: "commodityOther",
        width: 25,
      },
      {
        header: "Client Signature",
        key: "serviceSignature",
        width: 25,
      },
      {
        header: "Created Date",
        key: "createdDate",
        width: 25,
      },
    ];

    // let finalResult = [];
    let dbquery = {};
    let dbquery_search = "";

    if (req.query.name) {
      dbquery.name = req.query.name;
    }

    if (req.query.searchTable) dbquery_search = req.query.searchTable;

    const totalInteractions = await Interactions
      .countDocuments
      //   {
      //   $and: [
      //     dbquery,
      //     {
      //       $or: [
      //         { surname: { $regex: dbquery_search, $options: "i" } },
      //         { name: { $regex: dbquery_search, $options: "i" } },
      //         { identityNumber: { $regex: dbquery_search, $options: "i" } },
      //         { contactNumber: { $regex: dbquery_search, $options: "i" } },
      //         { farmerType: { $regex: dbquery_search, $options: "i" } },
      //       ],
      //     },
      //   ],
      // }
      ();

    const limitRecords = 50000;
    const mainLoop = Math.ceil(totalInteractions / limitRecords);

    await getFarmerInteractions(
      skipRecords,
      limitRecords,
      dbquery,
      dbquery_search,
      worksheet
    );

    console.log("writing client interactions to excel ");
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var hrs = today.getHours();
    var mins = today.getMinutes();
    var secs = today.getSeconds();

    today = dd + "-" + mm + "-" + yyyy + "_" + hrs + mins + secs;

    let fileNo = 1;
    // if (skipRecords == 0) fileNo = 1;
    // else if (skipRecords == 5000) fileNo = 2;
    // else if (skipRecords == 10000) fileNo = 3;
    // else if (skipRecords == 15000) fileNo = 4;
    let fileName = "Interactions_" + today + ".xlsx";
    console.log("fileName", fileName);
    workbook.xlsx.writeFile("public/uploads/" + fileName);
    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      //result: docs[0].data,
      //result: data,
      fileName,
      totalRecCount: totalInteractions,
    });
  } catch (err) {
    console.log("fetch failed", err);
  }
});

////////////generate empty excel///////////////
const farmerColumnFields = () => {
  const colsArray = [
    {
      header: "Latitude",
      key: "farmLatitude",
      width: 12,
    },
    {
      header: "Longitude",
      key: "farmLongitude",
      width: 12,
    },
    {
      header: "ProducerSurname",
      key: "surname",
      width: 25,
    },
    {
      header: "Names",
      key: "name",
      width: 25,
    },
    {
      header: "IdentityNumber",
      key: "identityNumber",
      width: 25,
    },
    {
      header: "ContactNo",
      key: "contactNumber",
      width: 15,
    },
    {
      header: "Nationality",
      key: "nationality",
      width: 15,
    },
    {
      header: "EmailAddress",
      key: "email",
      width: 25,
    },
    {
      header: "FarmerType",
      key: "farmerType",
      width: 15,
    },
    {
      header: "ResidentialAddress",
      key: "residentialAddress",
      width: 25,
    },
    {
      header: "ResidentialPostalcode",
      key: "residentialPostalcode",
      width: 25,
    },
    {
      header: "PostalAddress",
      key: "postalAddress",
      width: 25,
    },
    {
      header: "Postalcode",
      key: "postalcode",
      width: 25,
    },
    {
      header: "FarmingExperience",
      key: "farmingExperience",
      width: 25,
    },
    {
      header: "FarmingExperienceYears",
      key: "farmingExperienceYears",
      width: 25,
    },
    {
      header: "ProducerAgeGroups",
      key: "ageGroups",
      width: 25,
    },
    {
      header: "ProducerGender",
      key: "gender",
      width: 25,
    },
    {
      header: "PopulationGroup",
      key: "populationGroup",
      width: 25,
    },
    {
      header: "PopulationGroupSpecify",
      key: "populationGroupOther",
      width: 25,
    },
    {
      header: "Language",
      key: "homeLanguage",
      width: 25,
    },
    {
      header: "LanguageOther",
      key: "homeLanguageOther",
      width: 25,
    },
    {
      header: "HighestLevelEducation",
      key: "education",
      width: 25,
    },
    {
      header: "FulltimeOrParttimeBasis",
      key: "operationType",
      width: 25,
    },

    {
      header: "OwnerOfTheFarm",
      key: "isOwner",
      width: 25,
    },
    {
      header: "IndicateTheOwnership",
      key: "ownershipType",
      width: 25,
    },
    {
      header: "OwnershipOtherSpecify",
      key: "otherOwnerShip",
      width: 25,
    },
    {
      header: "FarmOrLandAcquired",
      key: "landAquisition",
      width: 25,
    },
    {
      header: "LandAcquiredOtherSpecify",
      key: "landAquisitionOther",
      width: 25,
    },
    {
      header: "RedistributionProgramme",
      key: "programmeRedistribution",
      width: 25,
    },
    {
      header: "RedistributionOtherSpecify",
      key: "programmeRedistributionOther",
      width: 25,
    },
    {
      header: "NoOfEmployeesTotal",
      key: "NoOfEmployeesTotal",
      width: 25,
    },
    {
      header: "NoOfEmployeesMales",
      key: "NoOfEmployeesMales",
      width: 25,
    },
    {
      header: "NoOfEmployeesFemales",
      key: "NoOfEmployeesFemales",
      width: 25,
    },
    {
      header: "NoOfEmployeesYouth",
      key: "NoOfEmployeesYouth",
      width: 25,
    },
    {
      header: "NoOfEmployeesDisable",
      key: "NoOfEmployeesDisable",
      width: 25,
    },
    {
      header: "EmploymentTypeMaleP",
      key: "EmploymentTypeMaleP",
      width: 25,
    },
    {
      header: "EmploymentTypeFemaleP",
      key: "EmploymentTypeFemaleP",
      width: 25,
    },
    {
      header: "EmploymentTypeYouthMaleP",
      key: "EmploymentTypeYouthMaleP",
      width: 25,
    },
    {
      header: "EmploymentTypeYouthFemaleP",
      key: "EmploymentTypeYouthFemaleP",
      width: 25,
    },
    {
      header: "EmploymentTypeMaleS",
      key: "EmploymentTypeMaleS",
      width: 25,
    },
    {
      header: "EmploymentTypeFemaleS",
      key: "EmploymentTypeFemaleS",
      width: 25,
    },
    {
      header: "EmploymentTypeYouthMaleS",
      key: "EmploymentTypeYouthMaleS",
      width: 25,
    },
    {
      header: "EmploymentTypeYouthFemaleS",
      key: "EmploymentTypeYouthFemaleS",
      width: 25,
    },
    {
      header: "EmploymentTypeMaleC",
      key: "EmploymentTypeMaleC",
      width: 25,
    },
    {
      header: "EmploymentTypeFemaleC",
      key: "EmploymentTypeFemaleC",
      width: 25,
    },
    {
      header: "EmploymentTypeYouthMaleC",
      key: "EmploymentTypeYouthMaleC",
      width: 25,
    },
    {
      header: "EmploymentTypeYouthFemaleC",
      key: "EmploymentTypeYouthFemaleC",
      width: 25,
    },
    {
      header: "FarmName",
      key: "farmName",
      width: 25,
    },
    {
      header: "PortionNumber",
      key: "PortionNumber",
      width: 25,
    },
    {
      header: "PortionName",
      key: "PortionName",
      width: 25,
    },
    {
      header: "Province",
      key: "Province",
      width: 25,
    },
    {
      header: "MetroDistrict",
      key: "MetroDistrict",
      width: 25,
    },
    {
      header: "DistrictMunicipality",
      key: "DistrictMunicipality",
      width: 25,
    },
    {
      header: "WardNumber",
      key: "WardNumber",
      width: 25,
    },
    {
      header: "TownOrVillage",
      key: "TownOrVillage",
      width: 25,
    },
    {
      header: "ProjectLegalEntityName",
      key: "ProjectLegalEntityName",
      width: 25,
    },
    {
      header: "BusinessEntityType",
      key: "businessEntityType",
      width: 25,
    },
    {
      header: "CoOperativesMembers",
      key: "CoOperativesMembers",
      width: 25,
    },
    {
      header: "TotalFarmSize",
      key: "totalFarmSize",
      width: 25,
    },
    {
      header: "Grazing",
      key: "Grazing",
      width: 25,
    },
    {
      header: "NonArable",
      key: "NonArable",
      width: 25,
    },
    {
      header: "Arable",
      key: "Arable",
      width: 25,
    },
    {
      header: "LivestockLayers",
      key: "Layers",
      width: 25,
    },
    {
      header: "LivestockGoat",
      key: "LivestockGoat",
      width: 25,
    },
    {
      header: "LivestockBroilers",
      key: "LivestockBroilers",
      width: 25,
    },
    {
      header: "LivestockCattle",
      key: "LivestockCattle",
      width: 25,
    },
    {
      header: "LivestockSheep",
      key: "LivestockSheep",
      width: 25,
    },
    {
      header: "LivestockPigs",
      key: "LivestockPigs",
      width: 25,
    },
    {
      header: "LivestockOstrich",
      key: "LivestockOstrich",
      width: 25,
    },
    {
      header: "LivestockRabbit",
      key: "LivestockRabbit",
      width: 25,
    },
    {
      header: "LiveStockOther",
      key: "liveStockOther",
      width: 25,
    },
    {
      header: "LivestockOtherSpecify",
      key: "LivestockOtherSpecify",
      width: 25,
    },
    {
      header: "HorticultureVegetablesHa",
      key: "HorticultureVegetablesHa",
      width: 25,
    },
    {
      header: "HorticultureVegetablesTons",
      key: "HorticultureVegetablesTons",
      width: 25,
    },
    {
      header: "HorticultureFruitsHa",
      key: "HorticultureFruitsHa",
      width: 25,
    },
    {
      header: "HorticultureFruitsTons",
      key: "HorticultureFruitsTons",
      width: 25,
    },
    {
      header: "HorticultureNutsHa",
      key: "HorticultureNutsHa",
      width: 25,
    },
    {
      header: "HorticultureNutsTons",
      key: "HorticultureNutsTons",
      width: 25,
    },
    {
      header: "HorticultureOtherHa",
      key: "HorticultureOtherHa",
      width: 25,
    },
    {
      header: "HorticultureOtherTons",
      key: "HorticultureOtherTons",
      width: 25,
    },
    {
      header: "HorticultureOtherSpecify",
      key: "HorticultureOtherSpecify",
      width: 25,
    },
    {
      header: "FieldCropsGrainha",
      key: "FieldCropsGrainha",
      width: 25,
    },
    {
      header: "FieldCropsGrainTons",
      key: "FieldCropsGrainTons",
      width: 25,
    },
    {
      header: "FieldCropsCottonHa",
      key: "FieldCropsCottonHa",
      width: 25,
    },
    {
      header: "FieldCropsCottonTons",
      key: "FieldCropsCottonTons",
      width: 25,
    },
    {
      header: "FieldCropsOilseedsHa",
      key: "FieldCropsOilseedsHa",
      width: 25,
    },
    {
      header: "FieldCropsOilseedsTons",
      key: "FieldCropsOilseedsTons",
      width: 25,
    },
    {
      header: "FieldCropsSugarCaneHa",
      key: "FieldCropsSugarCaneHa",
      width: 25,
    },
    {
      header: "FieldCropsSugarCaneTons",
      key: "FieldCropsSugarCaneTons",
      width: 25,
    },
    {
      header: "FieldCropsOtherHa",
      key: "FieldCropsOtherHa",
      width: 25,
    },
    {
      header: "FieldCropsOtherTons",
      key: "FieldCropsOtherTons",
      width: 25,
    },
    {
      header: "fieldCropsOtherSpecify",
      key: "fieldCropsOtherSpecify",
      width: 25,
    },
    {
      header: "ForestryLathsHa",
      key: "ForestryLathsHa",
      width: 25,
    },
    {
      header: "ForestryLathsTons",
      key: "ForestryLathsTons",
      width: 25,
    },
    {
      header: "ForestryDroppersHa",
      key: "ForestryDroppersHa",
      width: 25,
    },
    {
      header: "ForestryDroppersTons",
      key: "ForestryDroppersTons",
      width: 25,
    },
    {
      header: "ForestryPolesHa",
      key: "ForestryPolesHa",
      width: 25,
    },
    {
      header: "ForestryPolesTons",
      key: "ForestryPolesTons",
      width: 25,
    },
    {
      header: "ForestryBPolesHa",
      key: "ForestryBPolesHa",
      width: 25,
    },
    {
      header: "ForestryBPolesTons",
      key: "ForestryBPolesTons",
      width: 25,
    },
    {
      header: "ForestryOtherHa",
      key: "ForestryOtherHa",
      width: 25,
    },
    {
      header: "ForestryOtherTons",
      key: "ForestryOtherTons",
      width: 25,
    },
    {
      header: "forestryOtherSpecify",
      key: "forestryOtherSpecify",
      width: 25,
    },
    {
      header: "AquacultureFish",
      key: "AquacultureFish",
      width: 25,
    },
    {
      header: "AquaculturePlants",
      key: "AquaculturePlants",
      width: 25,
    },
    {
      header: "AquacultureShelfish",
      key: "AquacultureShelfish",
      width: 25,
    },
    {
      header: "AquacultureOther",
      key: "AquacultureOther",
      width: 25,
    },
    {
      header: "aquacultureOtherSpecify",
      key: "aquacultureOtherSpecify",
      width: 25,
    },
    {
      header: "SeaFishingHake",
      key: "SeaFishingHake",
      width: 25,
    },
    {
      header: "SeaFishingSnoek",
      key: "SeaFishingSnoek",
      width: 25,
    },
    {
      header: "SeaFishingTuna",
      key: "SeaFishingTuna",
      width: 25,
    },
    {
      header: "SeaFishingShelfish",
      key: "SeaFishingShelfish",
      width: 25,
    },
    {
      header: "SeaFishingLobster",
      key: "SeaFishingLobster",
      width: 25,
    },
    {
      header: "SeaFishingOther",
      key: "SeaFishingOther",
      width: 25,
    },
    {
      header: "SeaFishingOtherSpecify",
      key: "seaFishingOtherSpecify",
      width: 25,
    },
    {
      header: "GameFarmingBuffalo",
      key: "GameFarmingBuffalo",
      width: 25,
    },
    {
      header: "GameFarmingSpringbok",
      key: "GameFarmingSpringbok",
      width: 25,
    },
    {
      header: "GameFarmingImpala",
      key: "GameFarmingImpala",
      width: 25,
    },
    {
      header: "GameFarmingCrocodiles",
      key: "GameFarmingCrocodiles",
      width: 25,
    },
    {
      header: "GameFarmingGemsbok",
      key: "GameFarmingGemsbok",
      width: 25,
    },
    {
      header: "GameFarmingOther",
      key: "GameFarmingOther",
      width: 25,
    },
    {
      header: "GameFarmingOtherSpecify",
      key: "GameFarmingOtherSpecify",
      width: 25,
    },
    {
      header: "FormalMarketingChannel",
      key: "marketingChannelTypeFormal",
      width: 25,
    },
    {
      header: "InformalMarketingChannel",
      key: "marketingChannelTypeInformal",
      width: 25,
    },
    {
      header: "ValueAndAgroProcessing",
      key: "ValueAndAgroProcessing",
      width: 25,
    },
    {
      header: "SortingAndGrading",
      key: "SortingAndGrading",
      width: 25,
    },
    {
      header: "Packaging",
      key: "Packaging",
      width: 25,
    },
    {
      header: "ColdStorage",
      key: "ColdStorage",
      width: 25,
    },
    {
      header: "SliceAndDice",
      key: "SliceAndDice",
      width: 25,
    },
    {
      header: "Labelling",
      key: "Labelling",
      width: 25,
    },
    {
      header: "Pasteurising",
      key: "Pasteurising",
      width: 25,
    },
    {
      header: "PrimaryOthers",
      key: "PrimaryOthers",
      width: 25,
    },
    {
      header: "primaryOtherSpecify",
      key: "primaryOtherSpecify",
      width: 25,
    },
    {
      header: "Milling",
      key: "Milling",
      width: 25,
    },
    {
      header: "Grinding",
      key: "Grinding",
      width: 25,
    },
    {
      header: "Slaughtering",
      key: "Slaughtering",
      width: 25,
    },
    {
      header: "PressingForOil",
      key: "PressingForOil",
      width: 25,
    },
    {
      header: "JuicingAndPurees",
      key: "JuicingAndPurees",
      width: 25,
    },
    {
      header: "SecondaryOthers",
      key: "SecondaryOthers",
      width: 25,
    },
    {
      header: "secondaryOtherSpecify",
      key: "secondaryOtherSpecify",
      width: 25,
    },
    {
      header: "Canning",
      key: "Canning",
      width: 25,
    },
    {
      header: "Bottling",
      key: "Bottling",
      width: 25,
    },
    {
      header: "Extraction",
      key: "Extraction",
      width: 25,
    },
    {
      header: "Mixing",
      key: "Mixing",
      width: 25,
    },
    {
      header: "Flavouring",
      key: "Flavouring",
      width: 25,
    },
    {
      header: "AdvancedOthers",
      key: "AdvancedOthers",
      width: 25,
    },
    {
      header: "AdvancedOtherSpecify",
      key: "AdvancedOtherSpecify",
      width: 25,
    },
    {
      header: "UndertakenManually",
      key: "UndertakenMmanually",
      width: 25,
    },
    {
      header: "FixedStructuresFarmHouse",
      key: "FixedStructuresFarmHouse",
      width: 25,
    },
    {
      header: "FixedStructuresStorageRooms",
      key: "FixedStructuresStorageRooms",
      width: 25,
    },
    {
      header: "FixedStructuresPoultryHouses",
      key: "FixedStructuresPoultryHouses",
      width: 25,
    },
    {
      header: "FixedStructuresPigsty",
      key: "FixedStructuresPigsty",
      width: 25,
    },
    {
      header: "FixedStructuresPackhouse",
      key: "FixedStructuresPackhouse",
      width: 25,
    },
    {
      header: "FixedStructuresFencing",
      key: "FixedStructuresFencing",
      width: 25,
    },
    {
      header: "FixedStructuresOther",
      key: "FixedStructuresOther",
      width: 25,
    },
    {
      header: "FixedStructuresOtherSpecify",
      key: "FixedStructuresOtherSpecify",
      width: 25,
    },
    {
      header: "IrrigationDripMicro",
      key: "IrrigationDripMicro",
      width: 25,
    },
    {
      header: "IrrigationSprinkler",
      key: "IrrigationSprinkler",
      width: 25,
    },
    {
      header: "IrrigationCentrePivots",
      key: "IrrigationCentrePivots",
      width: 25,
    },
    {
      header: "IrrigationFurrow",
      key: "IrrigationFurrow",
      width: 25,
    },
    {
      header: "IrrigationFlood",
      key: "IrrigationFlood",
      width: 25,
    },
    {
      header: "IrrigationOther",
      key: "IrrigationOther",
      width: 25,
    },
    {
      header: "IrrigationOtherSpecify",
      key: "IrrigationOtherSpecify",
      width: 25,
    },
    {
      header: "WaterRiver",
      key: "WaterRiver",
      width: 25,
    },
    {
      header: "WaterDams",
      key: "WaterDams",
      width: 25,
    },
    {
      header: "WaterCanal",
      key: "WaterCanal",
      width: 25,
    },
    {
      header: "WaterBoreholesWindmills",
      key: "WaterBoreholesWindmills",
      width: 25,
    },
    {
      header: "WaterOther",
      key: "WaterOther",
      width: 25,
    },
    {
      header: "WaterOtherSpecify",
      key: "WaterOtherSpecify",
      width: 25,
    },
    {
      header: "MachineryTractor",
      key: "MachineryTractor",
      width: 25,
    },
    {
      header: "MachineryCombineHarvester",
      key: "MachineryCombineHarvester",
      width: 25,
    },
    {
      header: "MachineryTruck",
      key: "MachineryTruck",
      width: 25,
    },
    {
      header: "MachineryLightDelivery",
      key: "MachineryLightDelivery",
      width: 25,
    },
    {
      header: "MachineryOther",
      key: "MachineryOther",
      width: 25,
    },
    {
      header: "MachineryOtherSpecify",
      key: "MachineryOtherSpecify",
      width: 25,
    },
    {
      header: "ImplementsEquipmentPlough",
      key: "ImplementsEquipmentPlough",
      width: 25,
    },
    {
      header: "ImplementsEquipmentPlanter",
      key: "ImplementsEquipmentPlanter",
      width: 25,
    },
    {
      header: "ImplementsEquipmentTiller",
      key: "ImplementsEquipmentTiller",
      width: 25,
    },
    {
      header: "ImplementsEquipmentGarden",
      key: "ImplementsEquipmentGarden",
      width: 25,
    },
    {
      header: "ImplementsEquipmentTrailer",
      key: "ImplementsEquipmentTrailer",
      width: 25,
    },
    {
      header: "ImplementsEquipmentOther",
      key: "ImplementsEquipmentOther",
      width: 25,
    },
    {
      header: "ImplementsEquipmentSpecify",
      key: "ImplementsEquipmentSpecify",
      width: 25,
    },
    {
      header: "OtherDipTank",
      key: "OtherDipTank",
      width: 25,
    },
    {
      header: "OtherAccessRoad",
      key: "OtherAccessRoad",
      width: 25,
    },
    {
      header: "OtherElectricity",
      key: "OtherElectricity",
      width: 25,
    },
    {
      header: "OtherOther",
      key: "OtherOther",
      width: 25,
    },
    {
      header: "OtherOtherSpecify",
      key: "OtherOtherSpecify",
      width: 25,
    },
    {
      header: "DipTankElsewhere",
      key: "DipTankElsewhere",
      width: 25,
    },
    {
      header: "WhichOfTheFollowing",
      key: "WhichOfTheFollowing",
      width: 25,
    },
    {
      header: "TypeOfDipTank",
      key: "TypeOfDipTank",
      width: 25,
    },
    {
      header: "MAFISA",
      key: "MAFISA",
      width: 25,
    },
    {
      header: "CASP",
      key: "CASP",
      width: 25,
    },
    {
      header: "AgriBEEE",
      key: "AgriBEEE",
      width: 25,
    },
    {
      header: "LandCare",
      key: "LandCare",
      width: 25,
    },
    {
      header: "RECAP",
      key: "RECAP",
      width: 25,
    },
    {
      header: "ILMA",
      key: "ILMA",
      width: 25,
    },
    {
      header: "OtherGovernmentSupport",
      key: "OtherGovernmentSupport",
      width: 25,
    },
    {
      header: "GovernmentSupportSpecify",
      key: "GovernmentSupportSpecify",
      width: 25,
    },
    {
      header: "ExtensionServices",
      key: "ExtensionServices",
      width: 25,
    },
    {
      header: "ExtensionServicesInUse",
      key: "ExtensionServicesInUse",
      width: 25,
    },
    {
      header: "VeterinaryServices",
      key: "VeterinaryServices",
      width: 25,
    },
    {
      header: "VeterinaryServicesInUse",
      key: "VeterinaryServicesInUse",
      width: 25,
    },
    {
      header: "EarlyWarningInformation",
      key: "EarlyWarningInformation",
      width: 25,
    },
    {
      header: "AgriculturalEconomicInfo",
      key: "AgriculturalEconomicInfo",
      width: 25,
    },
    {
      header: "Training",
      key: "Training",
      width: 25,
    },
    {
      header: "ApproximateAnnualTurnover",
      key: "ApproximateAnnualTurnover",
      width: 24,
    },
    {
      header: "Preferredcommunication",
      key: "preferredcommunication",
      width: 25,
    },
    {
      header: "HasCropInsurance",
      key: "hasCropInsurance",
      width: 25,
    },
    {
      header: "InsuranceCompanyName",
      key: "insuranceCompanyName",
      width: 25,
    },
    {
      header: "InsuranceType",
      key: "insuranceType",
      width: 25,
    },
  ];
  return colsArray;
};
const createNewExcelFile = async (excelFilePath) => {
  const colsArray = await farmerColumnFields();
  let workbook = new Excel.Workbook();
  //sheet 1
  let newSheet1 = workbook.addWorksheet("Sheet1", {
    views: [{ state: "frozen", xSplit: 4, ySplit: 1 }],
  });
  newSheet1.properties.defaultRowHeight = 20;
  newSheet1.autoFilter = "A1:HC1";
  newSheet1.columns = colsArray;

  //sheet 2
  let newSheet2 = workbook.addWorksheet("Sheet2", {
    views: [{ state: "frozen", xSplit: 4, ySplit: 1 }],
  });
  newSheet2.properties.defaultRowHeight = 20;
  newSheet2.autoFilter = "A1:HC1";
  newSheet2.columns = colsArray;

  //sheet 3
  let newSheet3 = workbook.addWorksheet("Sheet3", {
    views: [{ state: "frozen", xSplit: 4, ySplit: 1 }],
  });
  newSheet3.properties.defaultRowHeight = 20;
  newSheet3.autoFilter = "A1:HC1";
  newSheet3.columns = colsArray;

  //sheet 4
  let newSheet4 = workbook.addWorksheet("Sheet4", {
    views: [{ state: "frozen", xSplit: 4, ySplit: 1 }],
  });
  newSheet4.properties.defaultRowHeight = 20;
  newSheet4.autoFilter = "A1:HC1";
  newSheet4.columns = colsArray;

  //sheet 5
  // let newSheet5 = workbook.addWorksheet("Sheet5", {
  //   views: [{ state: "frozen", xSplit: 4, ySplit: 1 }],
  // });
  // newSheet5.properties.defaultRowHeight = 20;
  // newSheet5.autoFilter = "A1:HC1";
  // newSheet5.columns = colsArray;

  workbook.xlsx.writeFile(excelFilePath).then(function () {
    console.log("excel file created successfully");
  });
};
const transformDate = () => {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  let yyyy = today.getFullYear();
  let hrs = today.getHours();
  let mins = today.getMinutes();
  let secs = today.getSeconds();

  today = dd + "-" + mm + "-" + yyyy + "_" + hrs + mins + secs;
  return today;
};
router.get("/api/genFarmerFile", async function (req, res) {
  let getDate = await transformDate();
  let fileName = "Farmers_" + getDate + ".xlsx";
  await createNewExcelFile("public/uploads/" + fileName);

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "File generated successfully",
    fileName,
  });
});

////////////update excel sample////////////////////////
router.get("/api/expfarmers", async function (req, res) {
  let fileName = req.query.fileName;
  let sheetName = req.query.sheetName;
  let skipRecords = 0;
  if (
    req.query.skipRecords == "0" ||
    req.query.skipRecords == "5000" ||
    req.query.skipRecords == "10000" ||
    req.query.skipRecords == "15000"
  ) {
    skipRecords = Number(req.query.skipRecords);
  }
  console.log("File Name : ", fileName, skipRecords);

  const colsArray = await farmerColumnFields();
  const workbookObj = new Excel.Workbook();
  workbookObj.xlsx
    .readFile("public/uploads/" + fileName)
    .then(async function () {
      let worksheetNew = await workbookObj.getWorksheet(sheetName);

      worksheetNew.columns = colsArray;

      let dbquery = {};
      let dbquery_search = "";

      if (req.query.name) {
        dbquery.name = req.query.name;
      }

      if (req.query.searchTable) dbquery_search = req.query.searchTable;

      const totalFarmers = await FarmerDetail.countDocuments({
        $and: [
          dbquery,
          {
            $or: [
              { surname: { $regex: dbquery_search, $options: "i" } },
              { name: { $regex: dbquery_search, $options: "i" } },
              { identityNumber: { $regex: dbquery_search, $options: "i" } },
              { contactNumber: { $regex: dbquery_search, $options: "i" } },
              { farmerType: { $regex: dbquery_search, $options: "i" } },
            ],
          },
        ],
      });

      const limitRecords = 5000;
      const mainLoop = Math.ceil(totalFarmers / limitRecords);

      await getFarmers(
        skipRecords,
        limitRecords,
        dbquery,
        dbquery_search,
        worksheetNew
      );

      console.log("writing to excel");

      // let obj = {};
      // obj["surname"] = "xxxxx123544444555121";

      // worksheetNew.addRow(obj);
      // let row = worksheetNew.getRow(103);
      // row.getCell(1).value = 15; // A5's value set to 5
      // row.commit();
      await workbookObj.xlsx.writeFile("public/uploads/" + fileName);

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "List fetched successfully",
        fileName,
        totalRecCount: totalFarmers,
      });
    });
});
//////////////////////////////////////

router.get("/api/mergeExcel", auth, async function (req, res) {
  //console.log("merge file name : ", req.query.fileName);
  let exportFileName = req.query.fileName;
  let fileName1 = req.query.fileName + "_1.xlsx";
  let fileName2 = req.query.fileName + "_2.xlsx";
  let fileName3 = req.query.fileName + "_3.xlsx";
  let fileName4 = req.query.fileName + "_4.xlsx";

  // XlsxPopulate.fromFileAsync(
  //   "public/uploads/" +
  //     fileName1 +
  //     "?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjMzMTI0NjYxNDY0MTQ2LCJpYXQiOjE2MjAxOTc0NjQsImV4cCI6MTYyMDIzMzQ2NH0.aONzmAD4e2qVYcbwJRJGg0ocRJBuhnqtUUHgtf8XKP0"
  // )
  // "http://localhost:5008/"
  // let path = "https://tdapwebapi.azurewebsites.net/uploads/";
  // let token =
  //   "?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVkQXQiOjMzMTI0NjYxNDY0MTQ2LCJpYXQiOjE2MjAxOTc0NjQsImV4cCI6MTYyMDIzMzQ2NH0.aONzmAD4e2qVYcbwJRJGg0ocRJBuhnqtUUHgtf8XKP0";

  await Promise.all([
    XlsxPopulate.fromFileAsync("public/uploads/" + fileName1),
    XlsxPopulate.fromFileAsync("public/uploads/" + fileName2),
    XlsxPopulate.fromFileAsync("public/uploads/" + fileName3),
    XlsxPopulate.fromFileAsync("public/uploads/" + fileName4),
  ]).then(async (workbooks) => {
    const workbook1 = workbooks[0];
    const workbook2 = workbooks[1];
    const workbook3 = workbooks[2];
    const workbook4 = workbooks[3];
    const sheets2 = workbook2.sheets();
    const sheets3 = workbook3.sheets();
    const sheets4 = workbook4.sheets();

    sheets2.forEach((sheet) => {
      const newSheet = workbook1.addSheet(sheet.name());
      const usedRange = sheet.usedRange();
      const oldValues = usedRange.value();

      newSheet.range(usedRange.address()).value(oldValues);
    });

    sheets3.forEach((sheet) => {
      const newSheet = workbook1.addSheet(sheet.name());
      const usedRange = sheet.usedRange();
      const oldValues = usedRange.value();

      newSheet.range(usedRange.address()).value(oldValues);
    });

    sheets4.forEach((sheet) => {
      const newSheet = workbook1.addSheet(sheet.name());
      const usedRange = sheet.usedRange();
      const oldValues = usedRange.value();

      newSheet.range(usedRange.address()).value(oldValues);
    });

    await workbook1.toFileAsync("public/uploads/" + exportFileName + ".xlsx");
  });
  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Files merged successfully",
    newFile: exportFileName + ".xlsx",
  });
});

module.exports = router;
