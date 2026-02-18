var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
var FarmerDetail = require("../models/FarmerDetail");
var FarmerProduction = require("../models/FarmerProduction");
var FarmAssetsServices = require("../models/FarmAssetsServices");
var FarmersDump2020 = require("../models/FarmerDetailDump2020");
var { User } = require("../models/User");
var PerformanceMng = require("../models/PerformanceMng");
var IndicatorTitles = require("../models/IndicatorsTitle");
var ContractServiceProviders = require("../models/ContractServiceProviders");

var FarmerDetailDump = require("../models/FarmerDetailDump");
var FarmerDetailDump2020 = require("../models/FarmerDetailDump2020");
let jsonData2017 = require("./farmers2017Update.json");
let jsonData2020 = require("./farmers2020Email.json");
const indTargets = require("./indicator2020.json");
const serviceProviders = require("./contractsJson.json");

const fs = require("fs");

router.get("/api/uploadFarmersJson2020", function (req, res) {
  console.log("FOR LOOP STARTS ... !!!");

  //below loop is for 2020 data
  //for (let row = 0; row < jsonData2020.Table.length; row++) {
  for (let row = 0; row < jsonData2020.Table.length; row++) {
    let referenceNumber = jsonData2020.Table[row].ReferenceNumber;
    let resAddr1 =
      jsonData2020.Table[row].ResidentialAddress01 == undefined ||
      jsonData2020.Table[row].ResidentialAddress01 == ""
        ? ""
        : jsonData2020.Table[row].ResidentialAddress01 + " ";
    let resAddr2 =
      jsonData2020.Table[row].ResidentialAddress02 == undefined ||
      jsonData2020.Table[row].ResidentialAddress02 == ""
        ? ""
        : jsonData2020.Table[row].ResidentialAddress02 + " ";
    let resAddr3 =
      jsonData2020.Table[row].ResidentialAddress03 == undefined ||
      jsonData2020.Table[row].ResidentialAddress03 == ""
        ? ""
        : jsonData2020.Table[row].ResidentialAddress03;

    let posAddr1 =
      jsonData2020.Table[row].PostalAddress01 == undefined ||
      jsonData2020.Table[row].PostalAddress01 == ""
        ? ""
        : jsonData2020.Table[row].PostalAddress01 + " ";
    let posAddr2 =
      jsonData2020.Table[row].PostalAddress02 == undefined ||
      jsonData2020.Table[row].PostalAddress02 == ""
        ? ""
        : jsonData2020.Table[row].PostalAddress02 + " ";
    let posAddr3 =
      jsonData2020.Table[row].PostalAddress03 == undefined ||
      jsonData2020.Table[row].PostalAddress03 == ""
        ? ""
        : jsonData2020.Table[row].PostalAddress03;

    //below is the object
    let farmerRegObj = {
      referenceNumber: referenceNumber,
      nationality: "5e3811685426832b10cb9128",
      education: getEduction(jsonData2020.Table[row].HighestLevelEducation),
      educationOther: null,
      farmingExperience:
        jsonData2020.Table[row].FarmingExperience == undefined ||
        jsonData2020.Table[row].FarmingExperience == ""
          ? " "
          : jsonData2020.Table[row].FarmingExperience,
      farmingExperienceYears:
        jsonData2020.Table[row].FarmingExperienceYears == undefined ||
        jsonData2020.Table[row].FarmingExperienceYears == ""
          ? " "
          : jsonData2020.Table[row].FarmingExperienceYears,

      //farmerType: getFarmerType(jsonData2020.Table[row].generalinfo),
      farmerType:
        jsonData2020.Table[row].ApproximateAnnualTurnover == undefined ||
        jsonData2020.Table[row].ApproximateAnnualTurnover == ""
          ? "Subsistence"
          : jsonData2020.Table[row].ApproximateAnnualTurnover == "SMALLHOLDER"
          ? "Smallholder"
          : "Subsistence",
      surname:
        jsonData2020.Table[row].ProducerSurname == undefined ||
        jsonData2020.Table[row].ProducerSurname == ""
          ? " "
          : jsonData2020.Table[row].ProducerSurname,
      name:
        jsonData2020.Table[row].Names == undefined ||
        jsonData2020.Table[row].Names == ""
          ? " "
          : jsonData2020.Table[row].Names,
      contactNumber:
        jsonData2020.Table[row].ContactNo == undefined ||
        jsonData2020.Table[row].ContactNo == ""
          ? " "
          : jsonData2020.Table[row].ContactNo,
      identityNumber:
        jsonData2020.Table[row].IdentityNumber == undefined ||
        jsonData2020.Table[row].IdentityNumber == ""
          ? " "
          : jsonData2020.Table[row].IdentityNumber,
      email:
        jsonData2020.Table[row].EmailAddress == undefined ||
        jsonData2020.Table[row].EmailAddress == "NONE" ||
        jsonData2020.Table[row].EmailAddress == ""
          ? ""
          : jsonData2020.Table[row].EmailAddress,
      residentialAddress: resAddr1 + resAddr2 + resAddr3,
      residentialPostalcode:
        jsonData2020.Table[row].ResidentialAddressCode == undefined ||
        jsonData2020.Table[row].ResidentialAddressCode == ""
          ? ""
          : jsonData2020.Table[row].ResidentialAddressCode,
      postalAddress: posAddr1 + posAddr2 + posAddr3,
      postalcode:
        jsonData2020.Table[row].PostalAddressCode == undefined ||
        jsonData2020.Table[row].PostalAddressCode == ""
          ? ""
          : jsonData2020.Table[row].PostalAddressCode,
      gender: getGender(jsonData2020.Table[row].ProducerGender),
      ageGroups: getAgeGroups(jsonData2020.Table[row].ProducerAgeGroups),
      populationGroup: getPopulationGroup(
        jsonData2020.Table[row].populationgroup
      ),
      populationGroupOther: "",
      homeLanguage: getLanguage2020(
        jsonData2020.Table[row].Afrikaans,
        jsonData2020.Table[row].English,
        jsonData2020.Table[row].IsiNdebele,
        jsonData2020.Table[row].Sepedi,
        jsonData2020.Table[row].Setswana,
        jsonData2020.Table[row].Sesotho,
        jsonData2020.Table[row].SiSwati,
        jsonData2020.Table[row].Tshivenda,
        jsonData2020.Table[row].Xitsonga,
        jsonData2020.Table[row].IsiXhosa,
        jsonData2020.Table[row].IsiZulu
      ),

      homeLanguageOther:
        jsonData2020.Table[row].LanguageOtherSpecify == undefined ||
        jsonData2020.Table[row].LanguageOtherSpecify == ""
          ? ""
          : jsonData2020.Table[row].LanguageOtherSpecify,
      operationType: getOperationType(
        jsonData2020.Table[row].FulltimeOrParttimeBasis
      ),
      isOwner:
        jsonData2020.Table[row].OwnerOfTheFarm == undefined ||
        jsonData2020.Table[row].OwnerOfTheFarm == "" ||
        jsonData2020.Table[row].OwnerOfTheFarm == "NO"
          ? false
          : true,
      ownershipType: getOwnershipType(
        jsonData2020.Table[row].IndicateTheOwnership
      ),
      otherOwnerShip:
        jsonData2020.Table[row].IndicateTheOwnership == "OTHER"
          ? jsonData2020.Table[row].OwnershipOtherSpecify
          : "",
      landAquisition: getLandAquisition(
        jsonData2020.Table[row].FarmOrLandAcquired
      ),
      landAquisitionOther:
        jsonData2020.Table[row].FarmOrLandAcquired == "OTHER"
          ? jsonData2020.Table[row].LandAcquiredOtherSpecify
          : "",
      programmeRedistribution: getRedistribution(
        jsonData2020.Table[row].RedistributionProgramme
      ),
      programmeRedistributionOther:
        jsonData2020.Table[row].RedistributionProgramme == "OTHER"
          ? jsonData2020.Table[row].RedistributionOtherSpecify
          : "",
      noOfEmployees: {
        totalEmp:
          jsonData2020.Table[row].NoOfEmployeesTotal == undefined ||
          jsonData2020.Table[row].NoOfEmployeesTotal == "" ||
          isNaN(jsonData2020.Table[row].NoOfEmployeesTotal)
            ? 0
            : jsonData2020.Table[row].NoOfEmployeesTotal,
        Male:
          jsonData2020.Table[row].NoOfEmployeesMales == undefined ||
          jsonData2020.Table[row].NoOfEmployeesMales == "" ||
          isNaN(jsonData2020.Table[row].NoOfEmployeesMales)
            ? 0
            : jsonData2020.Table[row].NoOfEmployeesMales,
        Female:
          jsonData2020.Table[row].NoOfEmployeesFemales == undefined ||
          jsonData2020.Table[row].NoOfEmployeesFemales == "" ||
          isNaN(jsonData2020.Table[row].NoOfEmployeesFemales)
            ? 0
            : jsonData2020.Table[row].NoOfEmployeesFemales,
        Youth:
          jsonData2020.Table[row].NoOfEmployeesYouth == undefined ||
          jsonData2020.Table[row].NoOfEmployeesYouth == "" ||
          isNaN(jsonData2020.Table[row].NoOfEmployeesYouth)
            ? 0
            : jsonData2020.Table[row].NoOfEmployeesYouth,
        "With Disability":
          jsonData2020.Table[row].NoOfEmployeesDisable == undefined ||
          jsonData2020.Table[row].NoOfEmployeesDisable == "" ||
          isNaN(jsonData2020.Table[row].NoOfEmployeesDisable)
            ? 0
            : jsonData2020.Table[row].NoOfEmployeesDisable,
      },
      parmanentEmployment: {
        Male:
          jsonData2020.Table[row].EmploymentTypeMaleP == undefined ||
          jsonData2020.Table[row].EmploymentTypeMaleP == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeMaleP)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeMaleP,
        Female:
          jsonData2020.Table[row].EmploymentTypeFemaleP == undefined ||
          jsonData2020.Table[row].EmploymentTypeFemaleP == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeFemaleP)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeFemaleP,
        "Youth Male":
          jsonData2020.Table[row].EmploymentTypeYouthMaleP == undefined ||
          jsonData2020.Table[row].EmploymentTypeYouthMaleP == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeYouthMaleP)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeYouthMaleP,
        "Youth Female":
          jsonData2020.Table[row].EmploymentTypeYouthFemaleP == undefined ||
          jsonData2020.Table[row].EmploymentTypeYouthFemaleP == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeYouthFemaleP)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeYouthFemaleP,
      },
      seasonalEmployment: {
        Male:
          jsonData2020.Table[row].EmploymentTypeMaleS == undefined ||
          jsonData2020.Table[row].EmploymentTypeMaleS == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeMaleS)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeMaleS,
        Female:
          jsonData2020.Table[row].EmploymentTypeFemaleS == undefined ||
          jsonData2020.Table[row].EmploymentTypeFemaleS == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeFemaleS)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeFemaleS,
        "Youth Male":
          jsonData2020.Table[row].EmploymentTypeYouthMaleS == undefined ||
          jsonData2020.Table[row].EmploymentTypeYouthMaleS == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeYouthMaleS)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeYouthMaleS,
        "Youth Female":
          jsonData2020.Table[row].EmploymentTypeYouthFemaleS == undefined ||
          jsonData2020.Table[row].EmploymentTypeYouthFemaleS == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeYouthFemaleS)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeYouthFemaleS,
      },
      contractEmployment: {
        Male:
          jsonData2020.Table[row].EmploymentTypeMaleC == undefined ||
          jsonData2020.Table[row].EmploymentTypeMaleC == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeMaleC)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeMaleC,
        Female:
          jsonData2020.Table[row].EmploymentTypeFemaleC == undefined ||
          jsonData2020.Table[row].EmploymentTypeFemaleC == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeFemaleC)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeFemaleC,
        "Youth Male":
          jsonData2020.Table[row].EmploymentTypeYouthMaleC == undefined ||
          jsonData2020.Table[row].EmploymentTypeYouthMaleC == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeYouthMaleC)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeYouthMaleC,
        "Youth Female":
          jsonData2020.Table[row].EmploymentTypeYouthFemaleC == undefined ||
          jsonData2020.Table[row].EmploymentTypeYouthFemaleC == "" ||
          isNaN(jsonData2020.Table[row].EmploymentTypeYouthFemaleC)
            ? 0
            : jsonData2020.Table[row].EmploymentTypeYouthFemaleC,
      },
      nationalityObj: {
        _id: "5e3811685426832b10cb9128",
        cndName: "South Africa",
      },
      ageGroupsObj: getAgeGroupsObj(jsonData2020.Table[row].ProducerAgeGroups),
      populationGroupObj: getPopulationGroupObj(
        jsonData2020.Table[row].populationgroup
      ),
      homeLanguageObj: getLanguage2020Obj(
        jsonData2020.Table[row].Afrikaans,
        jsonData2020.Table[row].English,
        jsonData2020.Table[row].IsiNdebele,
        jsonData2020.Table[row].Sepedi,
        jsonData2020.Table[row].Setswana,
        jsonData2020.Table[row].Sesotho,
        jsonData2020.Table[row].SiSwati,
        jsonData2020.Table[row].Tshivenda,
        jsonData2020.Table[row].Xitsonga,
        jsonData2020.Table[row].IsiXhosa,
        jsonData2020.Table[row].IsiZulu
      ),
      educationObj: getEductionObj(
        jsonData2020.Table[row].HighestLevelEducation
      ),
      ownershipTypeObj: getOwnershipTypeObj(
        jsonData2020.Table[row].IndicateTheOwnership
      ),
      landAquisitionObj: getLandAquisitionObj(
        jsonData2020.Table[row].FarmOrLandAcquired
      ),
      programmeRedistributionObj: getRedistributionObj(
        jsonData2020.Table[row].RedistributionProgramme
      ),
      regionObj: {
        metroDistrictObj: getDistrictObj(jsonData2020.Table[row].MetroDistrict),
        farmMuncipalRegionObj: getMunicipalityObj(
          jsonData2020.Table[row].DistrictMunicipality
        ),
      },
    };

    var newObj = new FarmerDetail(farmerRegObj);

    newObj.save(async function (err, farmer) {
      if (err) {
        console.log("errors farmer Reg", err);
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Some thing is wrong.",
          error: err.errors,
        });
      }
      //var result = JSON.parse(JSON.stringify(newObj));

      // console.log(
      //   "Result Farmer _Id : ",
      //   JSON.parse(JSON.stringify(newObj))._id
      // );

      ////// Farmer Production ////////////
      if (farmer._id) {
        //console.log("farmer Reg result : ", farmer._id);
        let farmerProdObj = {
          referenceNumber: referenceNumber,
          farmerId: farmer._id,
          farmName:
            jsonData2020.Table[row].FarmName == undefined ||
            jsonData2020.Table[row].FarmName == ""
              ? " "
              : jsonData2020.Table[row].FarmName,
          totalFarmSize: {
            Total:
              jsonData2020.Table[row].TotalFarmSize == undefined ||
              jsonData2020.Table[row].TotalFarmSize == ""
                ? "0"
                : jsonData2020.Table[row].TotalFarmSize,
            Arable:
              jsonData2020.Table[row].Arable == undefined ||
              jsonData2020.Table[row].Arable == ""
                ? "0"
                : jsonData2020.Table[row].Arable,
            "Non-arable":
              jsonData2020.Table[row].NonArable == undefined ||
              jsonData2020.Table[row].NonArable == ""
                ? "0"
                : jsonData2020.Table[row].NonArable,
            Grazing:
              jsonData2020.Table[row].Grazing == undefined ||
              jsonData2020.Table[row].Grazing == ""
                ? "0"
                : jsonData2020.Table[row].Grazing,
          },
          metroDistrict: getDistrict(jsonData2020.Table[row].MetroDistrict),
          farmMuncipalRegion: getMunicipality(
            jsonData2020.Table[row].DistrictMunicipality
          ),
          wardNumber:
            jsonData2020.Table[row].WardNumber == undefined ||
            jsonData2020.Table[row].WardNumber == ""
              ? ""
              : jsonData2020.Table[row].WardNumber,
          townVillage:
            jsonData2020.Table[row].TownOrVillage == undefined ||
            jsonData2020.Table[row].TownOrVillage == ""
              ? ""
              : jsonData2020.Table[row].TownOrVillage,
          province: getProvince(jsonData2020.Table[row].Province),
          projectLegalEntityName:
            jsonData2020.Table[row].ProjectLegalEntityName == undefined ||
            jsonData2020.Table[row].ProjectLegalEntityName == ""
              ? ""
              : jsonData2020.Table[row].ProjectLegalEntityName,
          businessEntityType: getBusinessEntityType(
            jsonData2020.Table[row].SoleProprietor,
            jsonData2020.Table[row].Partnerships,
            jsonData2020.Table[row].CloseCorporation,
            jsonData2020.Table[row].PrivateCompany,
            jsonData2020.Table[row].PublicCompany,
            jsonData2020.Table[row].CoOperatives,
            jsonData2020.Table[row].Trusts,
            jsonData2020.Table[row].NotRegistered
          ),
          totalMembersInEnitity: jsonData2020.Table[row].CoOperativesMembers,
          liveStock: {
            Rabbit:
              jsonData2020.Table[row].LivestockRabbit == undefined ||
              jsonData2020.Table[row].LivestockRabbit == ""
                ? "0"
                : jsonData2020.Table[row].LivestockRabbit,
            Ostrich:
              jsonData2020.Table[row].LivestockOstrich == undefined ||
              jsonData2020.Table[row].LivestockOstrich == ""
                ? "0"
                : jsonData2020.Table[row].LivestockOstrich,
            Pigs:
              jsonData2020.Table[row].LivestockPigs == undefined ||
              jsonData2020.Table[row].LivestockPigs == ""
                ? "0"
                : jsonData2020.Table[row].LivestockPigs,
            Sheep:
              jsonData2020.Table[row].LivestockSheep == undefined ||
              jsonData2020.Table[row].LivestockSheep == ""
                ? "0"
                : jsonData2020.Table[row].LivestockSheep,
            Goat:
              jsonData2020.Table[row].LivestockGoat == undefined ||
              jsonData2020.Table[row].LivestockGoat == ""
                ? "0"
                : jsonData2020.Table[row].LivestockGoat,
            Cattle:
              jsonData2020.Table[row].LivestockCattle == undefined ||
              jsonData2020.Table[row].LivestockCattle == ""
                ? "0"
                : jsonData2020.Table[row].LivestockCattle,
            Broilers:
              jsonData2020.Table[row].LivestockBroilers == undefined ||
              jsonData2020.Table[row].LivestockBroilers == ""
                ? "0"
                : jsonData2020.Table[row].LivestockBroilers,
            Layers:
              jsonData2020.Table[row].LivestockLayers == undefined ||
              jsonData2020.Table[row].LivestockLayers == ""
                ? "0"
                : jsonData2020.Table[row].LivestockLayers,
            Other:
              jsonData2020.Table[row].LivestockOther == undefined ||
              jsonData2020.Table[row].LivestockOther == ""
                ? "0"
                : jsonData2020.Table[row].LivestockOther,
          },
          horticulture: {
            horticulture_other:
              jsonData2020.Table[row].HorticultureOtherHa == undefined ||
              jsonData2020.Table[row].HorticultureOtherHa == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureOtherHa,
            Nuts:
              jsonData2020.Table[row].HorticultureNutsHa == undefined ||
              jsonData2020.Table[row].HorticultureNutsHa == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureNutsHa,
            Fruits:
              jsonData2020.Table[row].HorticultureFruitsHa == undefined ||
              jsonData2020.Table[row].HorticultureFruitsHa == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureFruitsHa,
            Vegetables:
              jsonData2020.Table[row].HorticultureVegetablesHa == undefined ||
              jsonData2020.Table[row].HorticultureVegetablesHa == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureVegetablesHa,
          },
          horticultureProduction: {
            VegetablesProd:
              jsonData2020.Table[row].HorticultureVegetablesTons == undefined ||
              jsonData2020.Table[row].HorticultureVegetablesTons == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureVegetablesTons,
            FruitsProd:
              jsonData2020.Table[row].HorticultureFruitsTons == undefined ||
              jsonData2020.Table[row].HorticultureFruitsTons == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureFruitsTons,
            NutsProd:
              jsonData2020.Table[row].HorticultureNutsTons == undefined ||
              jsonData2020.Table[row].HorticultureNutsTons == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureNutsTons,
            horticulture_otherprod:
              jsonData2020.Table[row].HorticultureOtherTons == undefined ||
              jsonData2020.Table[row].HorticultureOtherTons == ""
                ? "0"
                : jsonData2020.Table[row].HorticultureOtherTons,
          },
          fieldCrops: {
            Field_Crops_Other:
              jsonData2020.Table[row].FieldCropsOtherHa == undefined ||
              jsonData2020.Table[row].FieldCropsOtherHa == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsOtherHa,
            "Sugar Cane":
              jsonData2020.Table[row].FieldCropsSugarCaneHa == undefined ||
              jsonData2020.Table[row].FieldCropsSugarCaneHa == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsSugarCaneHa,
            Oilseeds:
              jsonData2020.Table[row].FieldCropsOilseedsHa == undefined ||
              jsonData2020.Table[row].FieldCropsOilseedsHa == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsOilseedsHa,
            Cotton:
              jsonData2020.Table[row].FieldCropsCottonHa == undefined ||
              jsonData2020.Table[row].FieldCropsCottonHa == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsCottonHa,
            Grain:
              jsonData2020.Table[row].FieldCropsGrainha == undefined ||
              jsonData2020.Table[row].FieldCropsGrainha == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsGrainha,
          },
          fieldCropsProduction: {
            Field_Crops_OtherProd:
              jsonData2020.Table[row].FieldCropsOtherTons == undefined ||
              jsonData2020.Table[row].FieldCropsOtherTons == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsOtherTons,
            SugarCaneProd:
              jsonData2020.Table[row].FieldCropsSugarCaneTons == undefined ||
              jsonData2020.Table[row].FieldCropsSugarCaneTons == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsSugarCaneTons,
            OilseedsProd:
              jsonData2020.Table[row].FieldCropsOilseedsTons == undefined ||
              jsonData2020.Table[row].FieldCropsOilseedsTons == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsOilseedsTons,
            CottonProd:
              jsonData2020.Table[row].FieldCropsCottonTons == undefined ||
              jsonData2020.Table[row].FieldCropsCottonTons == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsCottonTons,
            GrainProd:
              jsonData2020.Table[row].FieldCropsGrainTons == undefined ||
              jsonData2020.Table[row].FieldCropsGrainTons == ""
                ? "0"
                : jsonData2020.Table[row].FieldCropsGrainTons,
          },
          forestry: {
            Forestry_Other:
              jsonData2020.Table[row].ForestryOtherHa == undefined ||
              jsonData2020.Table[row].ForestryOtherHa == ""
                ? "0"
                : jsonData2020.Table[row].ForestryOtherHa,
            "Building Poles":
              jsonData2020.Table[row].ForestryBPolesHa == undefined ||
              jsonData2020.Table[row].ForestryBPolesHa == ""
                ? "0"
                : jsonData2020.Table[row].ForestryBPolesHa,
            Forestry_Poles:
              jsonData2020.Table[row].ForestryPolesHa == undefined ||
              jsonData2020.Table[row].ForestryPolesHa == ""
                ? "0"
                : jsonData2020.Table[row].ForestryPolesHa,
            Droppers:
              jsonData2020.Table[row].ForestryDroppersHa == undefined ||
              jsonData2020.Table[row].ForestryDroppersHa == ""
                ? "0"
                : jsonData2020.Table[row].ForestryDroppersHa,
            Laths:
              jsonData2020.Table[row].ForestryLathsHa == undefined ||
              jsonData2020.Table[row].ForestryLathsHa == ""
                ? "0"
                : jsonData2020.Table[row].ForestryLathsHa,
          },
          forestryProduction: {
            Forestry_Other_Prod:
              jsonData2020.Table[row].ForestryOtherTons == undefined ||
              jsonData2020.Table[row].ForestryOtherTons == ""
                ? "0"
                : jsonData2020.Table[row].ForestryOtherTons,
            "Building Poles Prod":
              jsonData2020.Table[row].ForestryBPolesTons == undefined ||
              jsonData2020.Table[row].ForestryBPolesTons == ""
                ? "0"
                : jsonData2020.Table[row].ForestryBPolesTons,
            PolesProd:
              jsonData2020.Table[row].ForestryPolesTons == undefined ||
              jsonData2020.Table[row].ForestryPolesTons == ""
                ? "0"
                : jsonData2020.Table[row].ForestryPolesTons,
            DroppersProd:
              jsonData2020.Table[row].ForestryDroppersTons == undefined ||
              jsonData2020.Table[row].ForestryDroppersTons == ""
                ? "0"
                : jsonData2020.Table[row].ForestryDroppersTons,
            LathsProd:
              jsonData2020.Table[row].ForestryLathsTons == undefined ||
              jsonData2020.Table[row].ForestryLathsTons == ""
                ? "0"
                : jsonData2020.Table[row].ForestryLathsTons,
          },
          aquaculture: {
            Aquaculture_Other:
              jsonData2020.Table[row].AquacultureOther == undefined ||
              jsonData2020.Table[row].AquacultureOther == ""
                ? "0"
                : jsonData2020.Table[row].AquacultureOther,
            "Shell-fish":
              jsonData2020.Table[row].AquacultureShelfish == undefined ||
              jsonData2020.Table[row].AquacultureShelfish == ""
                ? "0"
                : jsonData2020.Table[row].AquacultureShelfish,
            Plants:
              jsonData2020.Table[row].AquaculturePlants == undefined ||
              jsonData2020.Table[row].AquaculturePlants == ""
                ? "0"
                : jsonData2020.Table[row].AquaculturePlants,
            Fish:
              jsonData2020.Table[row].AquacultureFish == undefined ||
              jsonData2020.Table[row].AquacultureFish == ""
                ? "0"
                : jsonData2020.Table[row].AquacultureFish,
          },
          seaFishing: {
            SeaFishing_Other:
              jsonData2020.Table[row].SeaFishingOther == undefined ||
              jsonData2020.Table[row].SeaFishingOther == ""
                ? "0"
                : jsonData2020.Table[row].SeaFishingOther,
            Lobster:
              jsonData2020.Table[row].SeaFishingLobster == undefined ||
              jsonData2020.Table[row].SeaFishingLobster == ""
                ? "0"
                : jsonData2020.Table[row].SeaFishingLobster,
            "SeaFishing_Shell-fish":
              jsonData2020.Table[row].SeaFishingShelfish == undefined ||
              jsonData2020.Table[row].SeaFishingShelfish == ""
                ? "0"
                : jsonData2020.Table[row].SeaFishingShelfish,
            Tuna:
              jsonData2020.Table[row].SeaFishingTuna == undefined ||
              jsonData2020.Table[row].SeaFishingTuna == ""
                ? "0"
                : jsonData2020.Table[row].SeaFishingTuna,
            Hake:
              jsonData2020.Table[row].SeaFishingHake == undefined ||
              jsonData2020.Table[row].SeaFishingHake == ""
                ? "0"
                : jsonData2020.Table[row].SeaFishingHake,
            Snoek:
              jsonData2020.Table[row].SeaFishingSnoek == undefined ||
              jsonData2020.Table[row].SeaFishingSnoek == ""
                ? "0"
                : jsonData2020.Table[row].SeaFishingSnoek,
          },
          gameFarming: {
            GameFarming_Other:
              jsonData2020.Table[row].GameFarmingOther == undefined ||
              jsonData2020.Table[row].GameFarmingOther == ""
                ? "0"
                : jsonData2020.Table[row].GameFarmingOther,
            Gemsbok:
              jsonData2020.Table[row].GameFarmingGemsbok == undefined ||
              jsonData2020.Table[row].GameFarmingGemsbok == ""
                ? "0"
                : jsonData2020.Table[row].GameFarmingGemsbok,
            Crocodiles:
              jsonData2020.Table[row].GameFarmingCrocodiles == undefined ||
              jsonData2020.Table[row].GameFarmingCrocodiles == ""
                ? "0"
                : jsonData2020.Table[row].GameFarmingCrocodiles,
            Impala:
              jsonData2020.Table[row].GameFarmingImpala == undefined ||
              jsonData2020.Table[row].GameFarmingImpala == ""
                ? "0"
                : jsonData2020.Table[row].GameFarmingImpala,
            Springbok:
              jsonData2020.Table[row].GameFarmingSpringbok == undefined ||
              jsonData2020.Table[row].GameFarmingSpringbok == ""
                ? "0"
                : jsonData2020.Table[row].GameFarmingSpringbok,
            Buffalo:
              jsonData2020.Table[row].GameFarmingBuffalo == undefined ||
              jsonData2020.Table[row].GameFarmingBuffalo == ""
                ? "0"
                : jsonData2020.Table[row].GameFarmingBuffalo,
          },
          marketingChannelTypeFormal:
            jsonData2020.Table[row].TypeofMarketingChannel == undefined ||
            jsonData2020.Table[row].TypeofMarketingChannel == ""
              ? false
              : jsonData2020.Table[row].TypeofMarketingChannel == "FORMAL"
              ? true
              : false,
          marketingChannelTypeInformal:
            jsonData2020.Table[row].TypeofMarketingChannel == undefined ||
            jsonData2020.Table[row].TypeofMarketingChannel == ""
              ? true
              : jsonData2020.Table[row].TypeofMarketingChannel == "INFORMAL"
              ? true
              : false,
          practiseAgroProcessing:
            jsonData2020.Table[row].ValueAndAgroProcessing == undefined ||
            jsonData2020.Table[row].ValueAndAgroProcessing == ""
              ? false
              : jsonData2020.Table[row].ValueAndAgroProcessing == "YES"
              ? true
              : false,
          primaryAgroProcessing: {
            Others:
              jsonData2020.Table[row].PrimaryOthers == undefined ||
              jsonData2020.Table[row].PrimaryOthers == "" ||
              jsonData2020.Table[row].PrimaryOthers == "0"
                ? false
                : true,
            Pasteurising:
              jsonData2020.Table[row].Pasteurising == undefined ||
              jsonData2020.Table[row].Pasteurising == "" ||
              jsonData2020.Table[row].Pasteurising == "0"
                ? false
                : true,
            Labelling:
              jsonData2020.Table[row].Labelling == undefined ||
              jsonData2020.Table[row].Labelling == "" ||
              jsonData2020.Table[row].Labelling == "0"
                ? false
                : true,
            "Slice and Dice (cutting)":
              jsonData2020.Table[row].SliceAndDice == undefined ||
              jsonData2020.Table[row].SliceAndDice == "" ||
              jsonData2020.Table[row].SliceAndDice == "0"
                ? false
                : true,
            "Cold Storage":
              jsonData2020.Table[row].ColdStorage == undefined ||
              jsonData2020.Table[row].ColdStorage == "" ||
              jsonData2020.Table[row].ColdStorage == "0"
                ? false
                : true,
            Packaging:
              jsonData2020.Table[row].Packaging == undefined ||
              jsonData2020.Table[row].Packaging == "" ||
              jsonData2020.Table[row].Packaging == "0"
                ? false
                : true,
            "Sorting and Grading":
              jsonData2020.Table[row].SortingAndGrading == undefined ||
              jsonData2020.Table[row].SortingAndGrading == "" ||
              jsonData2020.Table[row].SortingAndGrading == "0"
                ? false
                : true,
          },
          secondaryAgroProcessing: {
            Others:
              jsonData2020.Table[row].SecondaryOthers == undefined ||
              jsonData2020.Table[row].SecondaryOthers == "" ||
              jsonData2020.Table[row].SecondaryOthers == "0"
                ? false
                : true,
            "Juicing and Purees":
              jsonData2020.Table[row].JuicingAndPurees == undefined ||
              jsonData2020.Table[row].JuicingAndPurees == "" ||
              jsonData2020.Table[row].JuicingAndPurees == "0"
                ? false
                : true,
            "Pressing for Oil":
              jsonData2020.Table[row].PressingForOil == undefined ||
              jsonData2020.Table[row].PressingForOil == "" ||
              jsonData2020.Table[row].PressingForOil == "0"
                ? false
                : true,
            Slaughtering:
              jsonData2020.Table[row].Slaughtering == undefined ||
              jsonData2020.Table[row].Slaughtering == "" ||
              jsonData2020.Table[row].Slaughtering == "0"
                ? false
                : true,
            Grinding:
              jsonData2020.Table[row].Grinding == undefined ||
              jsonData2020.Table[row].Grinding == "" ||
              jsonData2020.Table[row].Grinding == "0"
                ? false
                : true,
            Milling:
              jsonData2020.Table[row].Milling == undefined ||
              jsonData2020.Table[row].Milling == "" ||
              jsonData2020.Table[row].Milling == "0"
                ? false
                : true,
          },
          advancedAgroProcessing: {
            Others:
              jsonData2020.Table[row].AdvancedOthers == undefined ||
              jsonData2020.Table[row].AdvancedOthers == "" ||
              jsonData2020.Table[row].AdvancedOthers == "0"
                ? false
                : true,
            Flavouring:
              jsonData2020.Table[row].Flavouring == undefined ||
              jsonData2020.Table[row].Flavouring == "" ||
              jsonData2020.Table[row].Flavouring == "0"
                ? false
                : true,
            Mixing:
              jsonData2020.Table[row].Mixing == undefined ||
              jsonData2020.Table[row].Mixing == "" ||
              jsonData2020.Table[row].Mixing == "0"
                ? false
                : true,
            "Extraction (Concentrates)":
              jsonData2020.Table[row].Extraction == undefined ||
              jsonData2020.Table[row].Extraction == "" ||
              jsonData2020.Table[row].Extraction == "0"
                ? false
                : true,
            Bottling:
              jsonData2020.Table[row].Bottling == undefined ||
              jsonData2020.Table[row].Bottling == "" ||
              jsonData2020.Table[row].Bottling == "0"
                ? false
                : true,
            Canning:
              jsonData2020.Table[row].Canning == undefined ||
              jsonData2020.Table[row].Canning == "" ||
              jsonData2020.Table[row].Canning == "0"
                ? false
                : true,
          },
          practiseAgroProcessingManual:
            jsonData2020.Table[row].UndertakenMmanually == undefined ||
            jsonData2020.Table[row].UndertakenMmanually == ""
              ? false
              : jsonData2020.Table[row].UndertakenMmanually == "YES"
              ? true
              : false,
          farmLatitude:
            jsonData2020.Table[row].GPS == undefined ||
            jsonData2020.Table[row].GPS == ""
              ? "0"
              : jsonData2020.Table[row].GPS.X,
          farmLongitude:
            jsonData2020.Table[row].GPS == undefined ||
            jsonData2020.Table[row].GPS == ""
              ? "0"
              : jsonData2020.Table[row].GPS.Y,

          farmLatitudeManual:
            jsonData2020.Table[row].LatitudeHours == undefined ||
            jsonData2020.Table[row].LatitudeHours == ""
              ? "0"
              : "-" +
                jsonData2020.Table[row].LatitudeHours +
                "." +
                jsonData2020.Table[row].LatitudeMin +
                jsonData2020.Table[row].LatitudeSec +
                jsonData2020.Table[row].LatitudeDirection,

          farmLongitudeManual:
            jsonData2020.Table[row].LongitudeHours == undefined ||
            jsonData2020.Table[row].LongitudeHours == ""
              ? "0"
              : jsonData2020.Table[row].LongitudeHours +
                "." +
                jsonData2020.Table[row].LongitudeMin +
                jsonData2020.Table[row].LongitudeSec +
                jsonData2020.Table[row].LongitudeDirection,

          portionNumber:
            jsonData2020.Table[row].PortionNumber == undefined ||
            jsonData2020.Table[row].PortionNumber == ""
              ? "0"
              : jsonData2020.Table[row].PortionNumber,
          portionName:
            jsonData2020.Table[row].PortionName == undefined ||
            jsonData2020.Table[row].PortionName == ""
              ? "0"
              : jsonData2020.Table[row].PortionName,

          metroDistrictObj: getDistrictObj(
            jsonData2020.Table[row].MetroDistrict
          ),
          farmMuncipalRegionObj: getMunicipalityObj(
            jsonData2020.Table[row].DistrictMunicipality
          ),
          provinceObj: getProvinceObj(jsonData2020.Table[row].Province),
          businessEntityTypeObj: getBusinessEntityTypeObj(
            jsonData2020.Table[row].SoleProprietor,
            jsonData2020.Table[row].Partnerships,
            jsonData2020.Table[row].CloseCorporation,
            jsonData2020.Table[row].PrivateCompany,
            jsonData2020.Table[row].PublicCompany,
            jsonData2020.Table[row].CoOperatives,
            jsonData2020.Table[row].Trusts,
            jsonData2020.Table[row].NotRegistered
          ),
        };
        var newObj2 = new FarmerProduction(farmerProdObj);

        await newObj2.save(async function (err, production) {
          //  console.log("Save Production Record #### ");
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Some thing is wrong.",
              error: err.errors,
            });
          }
          //var result2 = JSON.parse(JSON.stringify(newObj2));
          //   console.log("farmer Prod result : ", await production._id);
          //  res.status(200).json({
          //   success: true,
          //   responseCode: 200,
          //   msg: "Farmers uploaded successfully.",
          //   result:production
          // });
        });
        //////End of Farmer Production

        //////Farmer Assets
        let farmerAssetObj = {
          referenceNumber: referenceNumber,
          farmerId: farmer._id,
          fixedStructures: {
            Fencing:
              jsonData2020.Table[row].FixedStructuresFencing == undefined ||
              jsonData2020.Table[row].FixedStructuresFencing == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresFencing == "0"
                ? false
                : true,
            Packhouse:
              jsonData2020.Table[row].FixedStructuresPackhouse == undefined ||
              jsonData2020.Table[row].FixedStructuresPackhouse == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresPackhouse == "0"
                ? false
                : true,
            Pigsty:
              jsonData2020.Table[row].FixedStructuresPigsty == undefined ||
              jsonData2020.Table[row].FixedStructuresPigsty == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresPigsty == "0"
                ? false
                : true,
            Other:
              jsonData2020.Table[row].FixedStructuresOther == undefined ||
              jsonData2020.Table[row].FixedStructuresOther == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresOther == "0"
                ? false
                : true,
            "Poultry houses":
              jsonData2020.Table[row].FixedStructuresPoultryHouses ==
                undefined ||
              jsonData2020.Table[row].FixedStructuresPoultryHouses == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresPoultryHouses == "0"
                ? false
                : true,
            "Storage Rooms/ Sheds":
              jsonData2020.Table[row].FixedStructuresStorageRooms ==
                undefined ||
              jsonData2020.Table[row].FixedStructuresStorageRooms == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresStorageRooms == "0"
                ? false
                : true,
            "Farm House/Stead":
              jsonData2020.Table[row].FixedStructuresFarmHouse == undefined ||
              jsonData2020.Table[row].FixedStructuresFarmHouse == ""
                ? false
                : jsonData2020.Table[row].FixedStructuresFarmHouse == "0"
                ? false
                : true,
          },
          fixedStructureOther:
            jsonData2020.Table[row].FixedStructuresOtherSpecify == undefined ||
            jsonData2020.Table[row].FixedStructuresOtherSpecify == ""
              ? ""
              : jsonData2020.Table[row].FixedStructuresOtherSpecify,
          irrigationSystems: {
            Other:
              jsonData2020.Table[row].IrrigationOther == undefined ||
              jsonData2020.Table[row].IrrigationOther == ""
                ? false
                : jsonData2020.Table[row].IrrigationOther == "0"
                ? false
                : true,
            "Flood Irrigation":
              jsonData2020.Table[row].IrrigationFlood == undefined ||
              jsonData2020.Table[row].IrrigationFlood == ""
                ? false
                : jsonData2020.Table[row].IrrigationFlood == "0"
                ? false
                : true,
            "Furrow Irrigation":
              jsonData2020.Table[row].IrrigationFurrow == undefined ||
              jsonData2020.Table[row].IrrigationFurrow == ""
                ? false
                : jsonData2020.Table[row].IrrigationFurrow == "0"
                ? false
                : true,
            "Centre Pivots":
              jsonData2020.Table[row].IrrigationCentrePivots == undefined ||
              jsonData2020.Table[row].IrrigationCentrePivots == ""
                ? false
                : jsonData2020.Table[row].IrrigationCentrePivots == "0"
                ? false
                : true,
            "Sprinkler Irrigation":
              jsonData2020.Table[row].IrrigationSprinkler == undefined ||
              jsonData2020.Table[row].IrrigationSprinkler == ""
                ? false
                : jsonData2020.Table[row].IrrigationSprinkler == "0"
                ? false
                : true,
            "Drip/Micro Irrigation":
              jsonData2020.Table[row].IrrigationDripMicro == undefined ||
              jsonData2020.Table[row].IrrigationDripMicro == ""
                ? false
                : jsonData2020.Table[row].IrrigationDripMicro == "0"
                ? false
                : true,
          },
          irrigationSystemOther:
            jsonData2020.Table[row].IrrigationOtherSpecify == undefined ||
            jsonData2020.Table[row].otherspecify16 == ""
              ? ""
              : jsonData2020.Table[row].IrrigationOtherSpecify,
          waterInfrastructure: {
            Other:
              jsonData2020.Table[row].WaterOther == undefined ||
              jsonData2020.Table[row].WaterOther == ""
                ? false
                : jsonData2020.Table[row].WaterOther == "0"
                ? false
                : true,
            "Boreholes/Windmills":
              jsonData2020.Table[row].WaterBoreholesWindmills == undefined ||
              jsonData2020.Table[row].WaterBoreholesWindmills == ""
                ? false
                : jsonData2020.Table[row].WaterBoreholesWindmills == "0"
                ? false
                : true,
            Canal:
              jsonData2020.Table[row].WaterCanal == undefined ||
              jsonData2020.Table[row].WaterCanal == ""
                ? false
                : jsonData2020.Table[row].WaterCanal == "0"
                ? false
                : true,
            "Dams (Catchment Areas)":
              jsonData2020.Table[row].WaterDams == undefined ||
              jsonData2020.Table[row].WaterDams == ""
                ? false
                : jsonData2020.Table[row].WaterDams == "0"
                ? false
                : true,
            River:
              jsonData2020.Table[row].WaterRiver == undefined ||
              jsonData2020.Table[row].WaterRiver == ""
                ? false
                : jsonData2020.Table[row].WaterRiver == "0"
                ? false
                : true,
          },
          waterInfrastructureOther:
            jsonData2020.Table[row].WaterOtherSpecify == undefined ||
            jsonData2020.Table[row].WaterOtherSpecify == ""
              ? false
              : jsonData2020.Table[row].WaterOtherSpecify,
          machineryVehicles: {
            Other:
              jsonData2020.Table[row].MachineryOther == undefined ||
              jsonData2020.Table[row].MachineryOther == ""
                ? false
                : jsonData2020.Table[row].MachineryOther == "0"
                ? false
                : true,
            "Light Delivery Vehicle/Bakkie":
              jsonData2020.Table[row].MachineryLightDelivery == undefined ||
              jsonData2020.Table[row].MachineryLightDelivery == ""
                ? false
                : jsonData2020.Table[row].MachineryLightDelivery == "0"
                ? false
                : true,
            Truck:
              jsonData2020.Table[row].MachineryTruck == undefined ||
              jsonData2020.Table[row].MachineryTruck == ""
                ? false
                : jsonData2020.Table[row].MachineryTruck == "0"
                ? false
                : true,
            "Combine Harvester":
              jsonData2020.Table[row].MachineryCombineHarvester == undefined ||
              jsonData2020.Table[row].MachineryCombineHarvester == ""
                ? false
                : jsonData2020.Table[row].MachineryCombineHarvester == "0"
                ? false
                : true,
            Tractor:
              jsonData2020.Table[row].MachineryTractor == undefined ||
              jsonData2020.Table[row].MachineryTractor == ""
                ? false
                : jsonData2020.Table[row].MachineryTractor == "0"
                ? false
                : true,
          },
          machineryVehicleOther:
            jsonData2020.Table[row].MachineryOtherSpecify == undefined ||
            jsonData2020.Table[row].MachineryOtherSpecify == ""
              ? ""
              : jsonData2020.Table[row].MachineryOtherSpecify,
          implementsEquipment: {
            Other:
              jsonData2020.Table[row].ImplementsEquipmentOther == undefined ||
              jsonData2020.Table[row].ImplementsEquipmentOther == ""
                ? false
                : jsonData2020.Table[row].ImplementsEquipmentOther == "0"
                ? false
                : true,
            Trailer:
              jsonData2020.Table[row].ImplementsEquipmentTrailer == undefined ||
              jsonData2020.Table[row].ImplementsEquipmentTrailer == ""
                ? false
                : jsonData2020.Table[row].ImplementsEquipmentTrailer == "0"
                ? false
                : true,
            "Garden Tools":
              jsonData2020.Table[row].ImplementsEquipmentGarden == undefined ||
              jsonData2020.Table[row].ImplementsEquipmentGarden == ""
                ? false
                : jsonData2020.Table[row].ImplementsEquipmentGarden == "0"
                ? false
                : true,
            Tiller:
              jsonData2020.Table[row].ImplementsEquipmentTiller == undefined ||
              jsonData2020.Table[row].ImplementsEquipmentTiller == ""
                ? false
                : jsonData2020.Table[row].ImplementsEquipmentTiller == "0"
                ? false
                : true,
            Planter:
              jsonData2020.Table[row].ImplementsEquipmentPlanter == undefined ||
              jsonData2020.Table[row].ImplementsEquipmentPlanter == ""
                ? false
                : jsonData2020.Table[row].ImplementsEquipmentPlanter == "0"
                ? false
                : true,
            Plough:
              jsonData2020.Table[row].ImplementsEquipmentPlough == undefined ||
              jsonData2020.Table[row].ImplementsEquipmentPlough == ""
                ? false
                : jsonData2020.Table[row].ImplementsEquipmentPlough == "0"
                ? false
                : true,
          },
          implementsEquipmentOther:
            jsonData2020.Table[row].ImplementsEquipmentSpecify == undefined ||
            jsonData2020.Table[row].ImplementsEquipmentSpecify == ""
              ? ""
              : jsonData2020.Table[row].ImplementsEquipmentSpecify,
          otherAssets: {
            Other:
              jsonData2020.Table[row].OtherOther == undefined ||
              jsonData2020.Table[row].OtherOther == ""
                ? false
                : jsonData2020.Table[row].OtherOther == "0"
                ? false
                : true,
            Electricity:
              jsonData2020.Table[row].OtherElectricity == undefined ||
              jsonData2020.Table[row].OtherElectricity == ""
                ? false
                : jsonData2020.Table[row].OtherElectricity == "0"
                ? false
                : true,
            "Access Road":
              jsonData2020.Table[row].OtherAccessRoad == undefined ||
              jsonData2020.Table[row].OtherAccessRoad == ""
                ? false
                : jsonData2020.Table[row].OtherAccessRoad == "0"
                ? false
                : true,
            "Dip Tank":
              jsonData2020.Table[row].OtherDipTank == undefined ||
              jsonData2020.Table[row].OtherDipTank == ""
                ? false
                : jsonData2020.Table[row].OtherDipTank == "0"
                ? false
                : true,
          },
          otherAssetsOther:
            jsonData2020.Table[row].OtherOtherSpecify == undefined ||
            jsonData2020.Table[row].OtherOtherSpecify == ""
              ? ""
              : jsonData2020.Table[row].OtherOtherSpecify,

          dipTankValue:
            jsonData2020.Table[row].WhichOfTheFollowing == undefined ||
            jsonData2020.Table[row].WhichOfTheFollowing == ""
              ? ""
              : jsonData2020.Table[row].WhichOfTheFollowing ==
                "COMMUNAL PUBLIC DIP TANK"
              ? "Communal/Public Dip Tank"
              : jsonData2020.Table[row].WhichOfTheFollowing ==
                "PRIVATE DIP TANK"
              ? "Private Dip Tank"
              : "",
          dipTankType:
            jsonData2020.Table[row].TypeOfDipTank == undefined ||
            jsonData2020.Table[row].TypeOfDipTank == ""
              ? ""
              : jsonData2020.Table[row].TypeOfDipTank == "SMALL STOCK"
              ? "Small Stock"
              : "Large Stock",
          govtSupport: {
            Other:
              jsonData2020.Table[row].OtherGovernmentSupport == undefined ||
              jsonData2020.Table[row].OtherGovernmentSupport == ""
                ? false
                : jsonData2020.Table[row].OtherGovernmentSupport == "0"
                ? false
                : true,
            ILIMA:
              jsonData2020.Table[row].ILMA == undefined ||
              jsonData2020.Table[row].ILMA == ""
                ? false
                : jsonData2020.Table[row].ILMA == "0"
                ? false
                : true,
            RECAP:
              jsonData2020.Table[row].RECAP == undefined ||
              jsonData2020.Table[row].RECAP == ""
                ? false
                : jsonData2020.Table[row].RECAP == "0"
                ? false
                : true,
            "Land Care":
              jsonData2020.Table[row].LandCare == undefined ||
              jsonData2020.Table[row].LandCare == ""
                ? false
                : jsonData2020.Table[row].LandCare == "0"
                ? false
                : true,
            "AgriBEE (eg Equity Programme)":
              jsonData2020.Table[row].AgriBEEE == undefined ||
              jsonData2020.Table[row].AgriBEEE == ""
                ? false
                : jsonData2020.Table[row].AgriBEEE == "0"
                ? false
                : true,
            CASP:
              jsonData2020.Table[row].CASP == undefined ||
              jsonData2020.Table[row].CASP == ""
                ? false
                : jsonData2020.Table[row].CASP == "0"
                ? false
                : true,
            MAFISA:
              jsonData2020.Table[row].MAFISA == undefined ||
              jsonData2020.Table[row].MAFISA == ""
                ? false
                : jsonData2020.Table[row].MAFISA == "0"
                ? false
                : true,
          },
          govtSupportOther:
            jsonData2020.Table[row].GovernmentSupportSpecify == undefined ||
            jsonData2020.Table[row].GovernmentSupportSpecify == ""
              ? ""
              : jsonData2020.Table[row].GovernmentSupportSpecify,
          extensionServiceType:
            jsonData2020.Table[row].ExtensionServicesInUse == undefined ||
            jsonData2020.Table[row].ExtensionServicesInUse == ""
              ? ""
              : jsonData2020.Table[row].ExtensionServicesInUse == "PRIVATE"
              ? "Private"
              : jsonData2020.Table[row].ExtensionServicesInUse == "STATE"
              ? "State"
              : "",
          veterinaryServiceType:
            jsonData2020.Table[row].VeterinaryServicesInUse == undefined ||
            jsonData2020.Table[row].VeterinaryServicesInUse == ""
              ? ""
              : jsonData2020.Table[row].VeterinaryServicesInUse == "PRIVATE"
              ? "Private"
              : jsonData2020.Table[row].VeterinaryServicesInUse == "STATE"
              ? "State"
              : "",
          annualTurnover: getTurnOver(
            jsonData2020.Table[row].ApproximateAnnualTurnover
          ),
          preferredcommunication: getPreferredComm(
            jsonData2020.Table[row].Telephone,
            jsonData2020.Table[row].MobilePhone,
            jsonData2020.Table[row].Fax,
            jsonData2020.Table[row]["E-mail"],
            jsonData2020.Table[row].FaceToFace
          ),
          hasCropInsurance: false,
          insuranceCompanyName: "",
          insuranceType: "",
          bankAccountNumber: "",
          bankAccountName: "",
          bank: null,
          bankBranch: null,
          isAccessToDipTank:
            jsonData2020.Table[row].DipTankElsewhere == undefined ||
            jsonData2020.Table[row].DipTankElsewhere == ""
              ? false
              : jsonData2020.Table[row].DipTankElsewhere == "NO"
              ? false
              : true,
          haveExtensionServices:
            jsonData2020.Table[row].ExtensionServices == undefined ||
            jsonData2020.Table[row].ExtensionServices == ""
              ? false
              : jsonData2020.Table[row].ExtensionServices == "NO"
              ? false
              : true,
          haveVeterinaryServices:
            jsonData2020.Table[row].veterinaryservices == undefined ||
            jsonData2020.Table[row].veterinaryservices == ""
              ? false
              : jsonData2020.Table[row].veterinaryservices == "NO"
              ? false
              : true,
          earlyWarningInfo:
            jsonData2020.Table[row].EarlyWarningInformation == undefined ||
            jsonData2020.Table[row].EarlyWarningInformation == ""
              ? false
              : jsonData2020.Table[row].EarlyWarningInformation == "NO"
              ? false
              : true,
          agriEconomicInfo:
            jsonData2020.Table[row].AgriculturalEconomicInfo == undefined ||
            jsonData2020.Table[row].AgriculturalEconomicInfo == ""
              ? false
              : jsonData2020.Table[row].AgriculturalEconomicInfo == "NO"
              ? false
              : true,
          training:
            jsonData2020.Table[row].Training == undefined ||
            jsonData2020.Table[row].Training == ""
              ? false
              : jsonData2020.Table[row].Training == "NO"
              ? false
              : true,
          comments:
            jsonData2020.Table[row].comments == undefined ||
            jsonData2020.Table[row].comments == ""
              ? ""
              : jsonData2020.Table[row].comments,
          extensionofficername:
            jsonData2020.Table[row].SurnameAndInitials == undefined ||
            jsonData2020.Table[row].SurnameAndInitials == ""
              ? ""
              : jsonData2020.Table[row].SurnameAndInitials,
          enumeratorMobile:
            jsonData2020.Table[row].TelephoneMobilePhoneNo == undefined ||
            jsonData2020.Table[row].TelephoneMobilePhoneNo == ""
              ? ""
              : jsonData2020.Table[row].TelephoneMobilePhoneNo,
          enumeratorEmail:
            jsonData2020.Table[row].ExtensionOfficerEmail == undefined ||
            jsonData2020.Table[row].ExtensionOfficerEmail == ""
              ? ""
              : jsonData2020.Table[row].ExtensionOfficerEmail,
          enumeratorDate:
            jsonData2020.Table[row].ExtensionOfficerDate == undefined ||
            jsonData2020.Table[row].ExtensionOfficerDate == ""
              ? ""
              : jsonData2020.Table[row].ExtensionOfficerDate,
          annualTurnoverObj: getTurnOverObj(
            jsonData2020.Table[row].ApproximateAnnualTurnover
          ),
          preferredcommunicationObj: getPreferredCommObj(
            jsonData2020.Table[row].Telephone,
            jsonData2020.Table[row].MobilePhone,
            jsonData2020.Table[row].Fax,
            jsonData2020.Table[row]["E-mail"],
            jsonData2020.Table[row].FaceToFace
          ),
          regionObj: {
            metroDistrictObj: getDistrictObj(
              jsonData2020.Table[row].MetroDistrict
            ),
            farmMuncipalRegionObj: getMunicipalityObj(
              jsonData2020.Table[row].DistrictMunicipality
            ),
          },
        };
        var newObj3 = new FarmAssetsServices(farmerAssetObj);

        await newObj3.save(async function (err, asset) {
          //  console.log("Save Asset Record #### ");
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Some thing is wrong.",
              error: err.errors,
            });
          }
          //var result2 = JSON.parse(JSON.stringify(newObj3));
          //   console.log("farmer Prod result : ", await production._id);
          //  res.status(200).json({
          //   success: true,
          //   responseCode: 200,
          //   msg: "Farmers uploaded successfully.",
          //   result:asset
          // });
        });
        //////End of Farmer Assets
      } //end of if (farmer._id)
    });
  } //for loop ends

  console.log("FOR LOOPS ends ... !!!");
});

///upload farmers 2017 json - API

router.get("/api/uploadFarmersJson2017", function (req, res) {
  console.log("FOR LOOP STARTS ... !!!");

  //below loop is for 2017 data
  //for (let row = 0; row < jsonData2017.Table.length; row++) {
  for (let row = 0; row < jsonData2017.Table.length; row++) {
    let referenceNumber = jsonData2017.Table[row].ReferenceNumber;
    let resAddr1 =
      jsonData2017.Table[row].farmresidentialaddress1 == undefined ||
      jsonData2017.Table[row].farmresidentialaddress1 == ""
        ? ""
        : jsonData2017.Table[row].farmresidentialaddress1 + " ";
    let resAddr2 =
      jsonData2017.Table[row].farmresidentialaddress2 == undefined ||
      jsonData2017.Table[row].farmresidentialaddress2 == ""
        ? ""
        : jsonData2017.Table[row].farmresidentialaddress2 + " ";
    let resAddr3 =
      jsonData2017.Table[row].farmresidentialaddress3 == undefined ||
      jsonData2017.Table[row].farmresidentialaddress3 == ""
        ? ""
        : jsonData2017.Table[row].farmresidentialaddress3;

    let posAddr1 =
      jsonData2017.Table[row].section2postaladdress1 == undefined ||
      jsonData2017.Table[row].section2postaladdress1 == ""
        ? ""
        : jsonData2017.Table[row].section2postaladdress1 + " ";
    let posAddr2 =
      jsonData2017.Table[row].section2postaladdress2 == undefined ||
      jsonData2017.Table[row].section2postaladdress2 == ""
        ? ""
        : jsonData2017.Table[row].section2postaladdress2 + " ";
    let posAddr3 =
      jsonData2017.Table[row].section2postaladdress3 == undefined ||
      jsonData2017.Table[row].section2postaladdress3 == ""
        ? ""
        : jsonData2017.Table[row].section2postaladdress3;

    //below is the object
    let farmerRegObj = {
      referenceNumber: referenceNumber,
      nationality: "5e3811685426832b10cb9128",
      education: "5e3816425426832b10cb913e",
      educationOther: null,
      farmingExperience: " ",
      farmingExperienceYears: 0,

      farmerType: getFarmerType(jsonData2017.Table[row].generalinfo),
      surname:
        jsonData2017.Table[row].surname1 == undefined ||
        jsonData2017.Table[row].surname1 == ""
          ? " "
          : jsonData2017.Table[row].surname1,
      name:
        jsonData2017.Table[row].name == undefined ||
        jsonData2017.Table[row].name == ""
          ? " "
          : jsonData2017.Table[row].name,
      contactNumber:
        jsonData2017.Table[row].contactnumber == undefined ||
        jsonData2017.Table[row].contactnumber == ""
          ? " "
          : jsonData2017.Table[row].contactnumber,
      identityNumber:
        jsonData2017.Table[row].identitynumber == undefined ||
        jsonData2017.Table[row].identitynumber == ""
          ? " "
          : jsonData2017.Table[row].identitynumber,
      email:
        jsonData2017.Table[row].emailaddress == undefined ||
        jsonData2017.Table[row].emailaddress == "NONE" ||
        jsonData2017.Table[row].emailaddress == ""
          ? ""
          : jsonData2017.Table[row].emailaddress,
      residentialAddress: resAddr1 + resAddr2 + resAddr3,
      residentialPostalcode:
        jsonData2017.Table[row].postalcode1 == undefined ||
        jsonData2017.Table[row].postalcode1 == ""
          ? ""
          : jsonData2017.Table[row].postalcode1,
      postalAddress: posAddr1 + posAddr2 + posAddr3,
      postalcode:
        jsonData2017.Table[row].ua_postalcode2 == undefined ||
        jsonData2017.Table[row].ua_postalcode2 == ""
          ? ""
          : jsonData2017.Table[row].ua_postalcode2,
      gender: getGender(jsonData2017.Table[row].gender),
      ageGroups: getAgeGroups(jsonData2017.Table[row].demographicsage),
      populationGroup: getPopulationGroup(
        jsonData2017.Table[row].populationgroup
      ),
      populationGroupOther: "",
      homeLanguage: getLanguage(jsonData2017.Table[row].language),
      homeLanguageOther: "",
      operationType: getOperationType(jsonData2017.Table[row].runningfarm),
      ownershipType: getOwnershipType(jsonData2017.Table[row].ownershipoffarm),
      otherOwnerShip:
        jsonData2017.Table[row].ownershipoffarm == "OTHER"
          ? jsonData2017.Table[row].otherspecify2
          : "",
      landAquisition: getLandAquisition(jsonData2017.Table[row].farmland),
      landAquisitionOther:
        jsonData2017.Table[row].farmland == "OTHER"
          ? jsonData2017.Table[row].otherspecify3
          : "",
      programmeRedistribution: getRedistribution(
        jsonData2017.Table[row].redistribution
      ),
      programmeRedistributionOther:
        jsonData2017.Table[row].redistribution == "OTHER"
          ? jsonData2017.Table[row].otherspecify4
          : "",
      noOfEmployees: {
        totalEmp: "0",
        Male: "0",
        Female: "0",
        Youth: "0",
        "With Disability": "0",
      },
      parmanentEmployment: {
        Male: "0",
        Female: "0",
        "Youth Male": "0",
        "Youth Female": "0",
      },
      seasonalEmployment: {
        Male: "0",
        Female: "0",
        "Youth Male": "0",
        "Youth Female": "0",
      },
      contractEmployment: {
        Male: "0",
        Female: "0",
        "Youth Male": "0",
        "Youth Female": "0",
      },
      nationalityObj: {
        _id: "5e3811685426832b10cb9128",
        cndName: "South Africa",
      },
      educationObj: {
        _id: "5e3816425426832b10cb913e",
        cndName: "None",
      },
      ageGroupsObj: getAgeGroupsObj(jsonData2017.Table[row].demographicsage),
      populationGroupObj: getPopulationGroupObj(
        jsonData2017.Table[row].populationgroup
      ),
      homeLanguageObj: getLanguageObj(jsonData2017.Table[row].language),
      ownershipTypeObj: getOwnershipTypeObj(
        jsonData2017.Table[row].ownershipoffarm
      ),
      landAquisitionObj: getLandAquisitionObj(jsonData2017.Table[row].farmland),
      programmeRedistributionObj: getRedistributionObj(
        jsonData2017.Table[row].redistribution
      ),
      regionObj: {
        metroDistrictObj: getDistrictObj(jsonData2017.Table[row].MetroDistrict),
        farmMuncipalRegionObj: getMunicipalityObj(
          jsonData2017.Table[row].DistrictMunicipality
        ),
      },
    };

    var newObj = new FarmerDetail(farmerRegObj);

    newObj.save(async function (err, farmer) {
      if (err) {
        console.log("errors farmer Reg", err);
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Some thing is wrong.",
          error: err.errors,
        });
      }
      //var result = JSON.parse(JSON.stringify(newObj));

      // console.log(
      //   "Result Farmer _Id : ",
      //   JSON.parse(JSON.stringify(newObj))._id
      // );

      ////// Farmer Production ////////////
      if (farmer._id) {
        //console.log("farmer Reg result : ", farmer._id);
        let farmerProdObj = {
          referenceNumber: referenceNumber,
          farmerId: farmer._id,
          farmName:
            jsonData2017.Table[row].nameoffarm == undefined ||
            jsonData2017.Table[row].nameoffarm == ""
              ? " "
              : jsonData2017.Table[row].nameoffarm,
          totalFarmSize: {
            Total:
              jsonData2017.Table[row].farmsizetotal == undefined ||
              jsonData2017.Table[row].farmsizetotal == ""
                ? "0"
                : jsonData2017.Table[row].farmsizetotal,
            Arable:
              jsonData2017.Table[row].arable == undefined ||
              jsonData2017.Table[row].arable == ""
                ? "0"
                : jsonData2017.Table[row].arable,
            "Non-arable":
              jsonData2017.Table[row].nonarable == undefined ||
              jsonData2017.Table[row].nonarable == ""
                ? "0"
                : jsonData2017.Table[row].nonarable,
            Grazing: "0",
          },
          metroDistrict: getDistrict(jsonData2017.Table[row].metrodistrict),
          farmMuncipalRegion: getMunicipality(
            jsonData2017.Table[row].localmunicipality
          ),
          wardNumber:
            jsonData2017.Table[row].wardnumber == undefined ||
            jsonData2017.Table[row].wardnumber == ""
              ? ""
              : jsonData2017.Table[row].wardnumber,
          townVillage:
            jsonData2017.Table[row].nearesttown == undefined ||
            jsonData2017.Table[row].nearesttown == ""
              ? ""
              : jsonData2017.Table[row].nearesttown,
          province: getProvince(jsonData2017.Table[row].provincefarm),
          liveStock: {
            Rabbit:
              jsonData2017.Table[row].LivestockRabbit == undefined ||
              jsonData2017.Table[row].LivestockRabbit == ""
                ? "0"
                : jsonData2017.Table[row].LivestockRabbit,
            Ostrich:
              jsonData2017.Table[row].LivestockOstrich == undefined ||
              jsonData2017.Table[row].LivestockOstrich == ""
                ? "0"
                : jsonData2017.Table[row].LivestockOstrich,
            Pigs:
              jsonData2017.Table[row].livestockno4 == undefined ||
              jsonData2017.Table[row].livestockno4 == ""
                ? "0"
                : jsonData2017.Table[row].livestockno4,
            Sheep:
              jsonData2017.Table[row].livestockno2 == undefined ||
              jsonData2017.Table[row].livestockno2 == ""
                ? "0"
                : jsonData2017.Table[row].livestockno2,
            Goat:
              jsonData2017.Table[row].livestockno3 == undefined ||
              jsonData2017.Table[row].livestockno3 == ""
                ? "0"
                : jsonData2017.Table[row].livestockno3,
            Cattle:
              jsonData2017.Table[row].livestockno1 == undefined ||
              jsonData2017.Table[row].livestockno1 == ""
                ? "0"
                : jsonData2017.Table[row].livestockno1,
            Broilers:
              jsonData2017.Table[row].LivestockBroilers == undefined ||
              jsonData2017.Table[row].LivestockBroilers == ""
                ? "0"
                : jsonData2017.Table[row].LivestockBroilers,
            Layers:
              jsonData2017.Table[row].LivestockLayers == undefined ||
              jsonData2017.Table[row].LivestockLayers == ""
                ? "0"
                : jsonData2017.Table[row].LivestockLayers,
            Other:
              jsonData2017.Table[row].livestockno5 == undefined ||
              jsonData2017.Table[row].livestockno5 == ""
                ? "0"
                : jsonData2017.Table[row].livestockno5,
          },
          liveStockOther: jsonData2017.Table[row].otherspecify6,
          horticulture: {
            horticulture_other: 0,
            Nuts: 0,
            Fruits: 0,
            Vegetables: 0,
          },
          horticultureProduction: {
            VegetablesProd: 0,
            FruitsProd: 0,
            NutsProd: 0,
            horticulture_otherprod: 0,
          },
          horticultureOther: jsonData2017.Table[row].otherspecify7,
          fieldCrops: {
            Field_Crops_Other: 0,
            "Sugar Cane": 0,
            Oilseeds: 0,
            Cotton: 0,
            Grain: 0,
          },
          fieldCropsProduction: {
            Field_Crops_OtherProd: 0,
            SugarCaneProd: 0,
            OilseedsProd: 0,
            CottonProd: 0,
            GrainProd: 0,
          },
          fieldCropsOther: jsonData2017.Table[row].otherspecify8,
          forestry: {
            Forestry_Other: 0,
            "Building Poles": 0,
            Forestry_Poles: 0,
            Droppers: 0,
            Laths: 0,
          },
          forestryProduction: {
            Forestry_Other_Prod: 0,
            "Building Poles Prod": 0,
            PolesProd: 0,
            DroppersProd: 0,
            LathsProd: 0,
          },
          forestryOther: jsonData2017.Table[row].otherspecify9,
          aquaculture: {
            Aquaculture_Other: 0,
            "Shell-fish": 0,
            Plants: 0,
            Fish: 0,
          },
          aquacultureOther: jsonData2017.Table[row].otherspecify10,
          seaFishing: {
            SeaFishing_Other: 0,
            Lobster: 0,
            "SeaFishing_Shell-fish": 0,
            Tuna: 0,
            Hake: 0,
            Snoek: 0,
          },
          seaFishingOther: jsonData2017.Table[row].otherspecify11,
          gameFarming: {
            GameFarming_Other: 0,
            Gemsbok: 0,
            Crocodiles: 0,
            Impala: 0,
            Springbok: 0,
            Buffalo: 0,
          },
          gameFarmingOther: jsonData2017.Table[row].otherspecify12,
          marketingChannelTypeFormal: false,
          marketingChannelTypeInformal: false,
          practiseAgroProcessing: false,
          primaryAgroProcessing: {
            Others: false,
            Pasteurising: false,
            Labelling: false,
            "Slice and Dice (cutting)": false,
            "Cold Storage": false,
            Packaging: false,
            "Sorting and Grading": false,
          },
          secondaryAgroProcessing: {
            Others: false,
            "Juicing and Purees": false,
            "Pressing for Oil": false,
            Slaughtering: false,
            Grinding: false,
            Milling: false,
          },
          advancedAgroProcessing: {
            Others: false,
            Flavouring: false,
            Mixing: false,
            "Extraction (Concentrates)": false,
            Bottling: false,
            Canning: false,
          },
          practiseAgroProcessingManual: false,
          farmLatitude:
            jsonData2017.Table[row].GPS == undefined ||
            jsonData2017.Table[row].GPS == ""
              ? "0"
              : jsonData2017.Table[row].GPS.X,
          farmLongitude:
            jsonData2017.Table[row].GPS == undefined ||
            jsonData2017.Table[row].GPS == ""
              ? "0"
              : jsonData2017.Table[row].GPS.Y,

          farmLatitudeManual:
            jsonData2017.Table[row].latitude == undefined ||
            jsonData2017.Table[row].latitude == ""
              ? "0"
              : "-" +
                jsonData2017.Table[row].latitude.substring(0, 2) +
                "." +
                jsonData2017.Table[row].latitude
                  .substring(2, jsonData2017.Table[row].latitude.length)
                  .split(" ")
                  .join(""),

          farmLongitudeManual:
            jsonData2017.Table[row].longitude == undefined ||
            jsonData2017.Table[row].longitude == ""
              ? "0"
              : jsonData2017.Table[row].longitude.substring(0, 2) +
                "." +
                jsonData2017.Table[row].longitude
                  .substring(2, jsonData2017.Table[row].longitude.length)
                  .split(" ")
                  .join(""),

          portionNumber: "",
          portionName: "",

          metroDistrictObj: getDistrictObj(
            jsonData2017.Table[row].metrodistrict
          ),
          farmMuncipalRegionObj: getMunicipalityObj(
            jsonData2017.Table[row].localmunicipality
          ),
          provinceObj: getProvinceObj(jsonData2017.Table[row].provincefarm),
          businessEntityTypeObj: {},
        };
        var newObj2 = new FarmerProduction(farmerProdObj);

        await newObj2.save(async function (err, production) {
          //  console.log("Save Production Record #### ");
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Some thing is wrong.",
              error: err.errors,
            });
          }
          //var result2 = JSON.parse(JSON.stringify(newObj2));
          //   console.log("farmer Prod result : ", await production._id);
          //  res.status(200).json({
          //   success: true,
          //   responseCode: 200,
          //   msg: "Farmers uploaded successfully.",
          //   result:production
          // });
        });
        //////End of Farmer Production

        //////Farmer Assets
        let farmerAssetObj = {
          referenceNumber: referenceNumber,
          farmerId: farmer._id,
          fixedStructures: {
            Fencing:
              jsonData2017.Table[row].fixedstructures6 == undefined ||
              jsonData2017.Table[row].fixedstructures6 == ""
                ? false
                : jsonData2017.Table[row].fixedstructures6 == "0"
                ? false
                : true,
            Packhouse:
              jsonData2017.Table[row].fixedstructures5 == undefined ||
              jsonData2017.Table[row].fixedstructures5 == ""
                ? false
                : jsonData2017.Table[row].fixedstructures5 == "0"
                ? false
                : true,
            Pigsty:
              jsonData2017.Table[row].PigSties == undefined ||
              jsonData2017.Table[row].PigSties == ""
                ? false
                : jsonData2017.Table[row].PigSties == "0"
                ? false
                : true,
            Other:
              jsonData2017.Table[row].fixedstructures7 == undefined ||
              jsonData2017.Table[row].fixedstructures7 == ""
                ? false
                : jsonData2017.Table[row].fixedstructures7 == "0"
                ? false
                : true,
            "Poultry houses":
              jsonData2017.Table[row].fixedstructures3 == undefined ||
              jsonData2017.Table[row].fixedstructures3 == ""
                ? false
                : jsonData2017.Table[row].fixedstructures3 == "0"
                ? false
                : true,
            "Storage Rooms/ Sheds":
              jsonData2017.Table[row].fixedstructures2 == undefined ||
              jsonData2017.Table[row].fixedstructures2 == ""
                ? false
                : jsonData2017.Table[row].fixedstructures2 == "0"
                ? false
                : true,
            "Farm House/Stead":
              jsonData2017.Table[row].fixedstructures1 == undefined ||
              jsonData2017.Table[row].fixedstructures1 == ""
                ? false
                : jsonData2017.Table[row].fixedstructures1 == "0"
                ? false
                : true,
          },
          fixedStructureOther:
            jsonData2017.Table[row].otherspecify14 == undefined ||
            jsonData2017.Table[row].otherspecify14 == ""
              ? ""
              : jsonData2017.Table[row].otherspecify14,
          irrigationSystems: {
            Other:
              jsonData2017.Table[row].irrigationsystems6 == undefined ||
              jsonData2017.Table[row].irrigationsystems6 == ""
                ? false
                : jsonData2017.Table[row].irrigationsystems6 == "0"
                ? false
                : true,
            "Flood Irrigation":
              jsonData2017.Table[row].irrigationsystems5 == undefined ||
              jsonData2017.Table[row].irrigationsystems5 == ""
                ? false
                : jsonData2017.Table[row].irrigationsystems5 == "0"
                ? false
                : true,
            "Furrow Irrigation":
              jsonData2017.Table[row].irrigationsystems4 == undefined ||
              jsonData2017.Table[row].irrigationsystems4 == ""
                ? false
                : jsonData2017.Table[row].irrigationsystems4 == "0"
                ? false
                : true,
            "Centre Pivots":
              jsonData2017.Table[row].irrigationsystems3 == undefined ||
              jsonData2017.Table[row].irrigationsystems3 == ""
                ? false
                : jsonData2017.Table[row].irrigationsystems3 == "0"
                ? false
                : true,
            "Sprinkler Irrigation":
              jsonData2017.Table[row].irrigationsystems1 == undefined ||
              jsonData2017.Table[row].irrigationsystems1 == ""
                ? false
                : jsonData2017.Table[row].irrigationsystems1 == "0"
                ? false
                : true,
            "Drip/Micro Irrigation":
              jsonData2017.Table[row].irrigationsystems2 == undefined ||
              jsonData2017.Table[row].irrigationsystems2 == ""
                ? false
                : jsonData2017.Table[row].irrigationsystems2 == "0"
                ? false
                : true,
          },
          irrigationSystemOther:
            jsonData2017.Table[row].otherspecify16 == undefined ||
            jsonData2017.Table[row].otherspecify16 == ""
              ? false
              : jsonData2017.Table[row].otherspecify16,
          waterInfrastructure: {
            Other:
              jsonData2017.Table[row].waterinfrastructure5 == undefined ||
              jsonData2017.Table[row].waterinfrastructure5 == ""
                ? false
                : jsonData2017.Table[row].waterinfrastructure5 == "0"
                ? false
                : true,
            "Boreholes/Windmills":
              jsonData2017.Table[row].BoreholesWindmills == undefined ||
              jsonData2017.Table[row].BoreholesWindmills == ""
                ? false
                : jsonData2017.Table[row].BoreholesWindmills == "0"
                ? false
                : true,
            Canal:
              jsonData2017.Table[row].waterinfrastructure3 == undefined ||
              jsonData2017.Table[row].waterinfrastructure3 == ""
                ? false
                : jsonData2017.Table[row].waterinfrastructure3 == "0"
                ? false
                : true,
            "Dams (Catchment Areas)":
              jsonData2017.Table[row].waterinfrastructure4 == undefined ||
              jsonData2017.Table[row].waterinfrastructure4 == ""
                ? false
                : jsonData2017.Table[row].waterinfrastructure4 == "0"
                ? false
                : true,
            River:
              jsonData2017.Table[row].waterinfrastructure1 == undefined ||
              jsonData2017.Table[row].waterinfrastructure1 == ""
                ? false
                : jsonData2017.Table[row].waterinfrastructure1 == "0"
                ? false
                : true,
          },
          waterInfrastructureOther:
            jsonData2017.Table[row].otherspecify17 == undefined ||
            jsonData2017.Table[row].otherspecify17 == ""
              ? false
              : jsonData2017.Table[row].otherspecify17,
          machineryVehicles: {
            Other:
              jsonData2017.Table[row].machinery5 == undefined ||
              jsonData2017.Table[row].machinery5 == ""
                ? false
                : jsonData2017.Table[row].machinery5 == "0"
                ? false
                : true,
            "Light Delivery Vehicle/Bakkie":
              jsonData2017.Table[row].machinery4 == undefined ||
              jsonData2017.Table[row].machinery4 == ""
                ? false
                : jsonData2017.Table[row].machinery4 == "0"
                ? false
                : true,
            Truck:
              jsonData2017.Table[row].machinery3 == undefined ||
              jsonData2017.Table[row].machinery3 == ""
                ? false
                : jsonData2017.Table[row].machinery3 == "0"
                ? false
                : true,
            "Combine Harvester":
              jsonData2017.Table[row].machinery2 == undefined ||
              jsonData2017.Table[row].machinery2 == ""
                ? false
                : jsonData2017.Table[row].machinery2 == "0"
                ? false
                : true,
            Tractor:
              jsonData2017.Table[row].machinery1 == undefined ||
              jsonData2017.Table[row].machinery1 == ""
                ? false
                : jsonData2017.Table[row].machinery1 == "0"
                ? false
                : true,
          },
          machineryVehicleOther:
            jsonData2017.Table[row].otherspecify15 == undefined ||
            jsonData2017.Table[row].otherspecify15 == ""
              ? ""
              : jsonData2017.Table[row].otherspecify15,
          implementsEquipment: {
            Other:
              jsonData2017.Table[row].implements6 == undefined ||
              jsonData2017.Table[row].implements6 == ""
                ? false
                : jsonData2017.Table[row].implements6 == "0"
                ? false
                : true,
            Trailer:
              jsonData2017.Table[row].ua_implements5 == undefined ||
              jsonData2017.Table[row].ua_implements5 == ""
                ? false
                : jsonData2017.Table[row].ua_implements5 == "0"
                ? false
                : true,
            "Garden Tools":
              jsonData2017.Table[row].ua_implements4 == undefined ||
              jsonData2017.Table[row].ua_implements4 == ""
                ? false
                : jsonData2017.Table[row].ua_implements4 == "0"
                ? false
                : true,
            Tiller:
              jsonData2017.Table[row].ua_implements3 == undefined ||
              jsonData2017.Table[row].ua_implements3 == ""
                ? false
                : jsonData2017.Table[row].ua_implements3 == "0"
                ? false
                : true,
            Planter:
              jsonData2017.Table[row].ua_implements2 == undefined ||
              jsonData2017.Table[row].ua_implements2 == ""
                ? false
                : jsonData2017.Table[row].ua_implements2 == "0"
                ? false
                : true,
            Plough:
              jsonData2017.Table[row].ua_implements1 == undefined ||
              jsonData2017.Table[row].ua_implements1 == ""
                ? false
                : jsonData2017.Table[row].ua_implements1 == "0"
                ? false
                : true,
          },
          implementsEquipmentOther:
            jsonData2017.Table[row].otherspecify18 == undefined ||
            jsonData2017.Table[row].otherspecify18 == ""
              ? ""
              : jsonData2017.Table[row].otherspecify18,
          otherAssets: {
            Other:
              jsonData2017.Table[row].section4other4 == undefined ||
              jsonData2017.Table[row].section4other4 == ""
                ? false
                : jsonData2017.Table[row].section4other4 == "0"
                ? false
                : true,
            Electricity:
              jsonData2017.Table[row].section4other3 == undefined ||
              jsonData2017.Table[row].section4other3 == ""
                ? false
                : jsonData2017.Table[row].section4other3 == "0"
                ? false
                : true,
            "Access Road":
              jsonData2017.Table[row].section4other2 == undefined ||
              jsonData2017.Table[row].section4other2 == ""
                ? false
                : jsonData2017.Table[row].section4other2 == "0"
                ? false
                : true,
            "Dip Tank":
              jsonData2017.Table[row].section4other1 == undefined ||
              jsonData2017.Table[row].section4other1 == ""
                ? false
                : jsonData2017.Table[row].section4other1 == "0"
                ? false
                : true,
          },
          otherAssetsOther:
            jsonData2017.Table[row].otherspecify19 == undefined ||
            jsonData2017.Table[row].otherspecify19 == ""
              ? ""
              : jsonData2017.Table[row].otherspecify19,
          dipTankValue:
            jsonData2017.Table[row].diptankifyes == undefined ||
            jsonData2017.Table[row].diptankifyes == ""
              ? ""
              : jsonData2017.Table[row].diptankifyes == "COMMUNAL"
              ? "Communal/Public Dip Tank"
              : jsonData2017.Table[row].diptankifyes == "PRIVATE"
              ? "Private Dip Tank"
              : "",
          dipTankType: "",
          govtSupport: {
            Other: false,
            ILIMA: false,
            RECAP: false,
            "Land Care": false,
            "AgriBEE (eg Equity Programme)": false,
            CASP: false,
            MAFISA: false,
          },
          govtSupportOther: "",
          extensionServiceType: "",
          veterinaryServiceType:
            jsonData2017.Table[row].whichdoyouuse == undefined ||
            jsonData2017.Table[row].whichdoyouuse == ""
              ? ""
              : jsonData2017.Table[row].whichdoyouuse == "PRIVATE VETERINARIAN"
              ? "Private"
              : jsonData2017.Table[row].whichdoyouuse == "STATE"
              ? "State"
              : "",
          annualTurnover: getTurnOver(jsonData2017.Table[row].approximate),
          preferredcommunication: getPreferredComm(
            jsonData2017.Table[row].preferredcom
          ),
          hasCropInsurance: false,
          insuranceCompanyName: "",
          insuranceType: "",
          bankAccountNumber: "",
          bankAccountName: "",
          bank: null,
          bankBranch: null,
          isAccessToDipTank:
            jsonData2017.Table[row].diptank == undefined ||
            jsonData2017.Table[row].diptank == ""
              ? false
              : jsonData2017.Table[row].diptank == "0"
              ? false
              : true,
          haveExtensionServices: false,
          haveVeterinaryServices:
            jsonData2017.Table[row].veterinaryservices == undefined ||
            jsonData2017.Table[row].veterinaryservices == ""
              ? false
              : jsonData2017.Table[row].veterinaryservices == "NO"
              ? false
              : true,
          earlyWarningInfo: false,
          agriEconomicInfo: false,
          training: false,
          comments:
            jsonData2017.Table[row].comments == undefined ||
            jsonData2017.Table[row].comments == ""
              ? ""
              : jsonData2017.Table[row].comments,
          extensionofficername:
            jsonData2017.Table[row].extensionofficername == undefined ||
            jsonData2017.Table[row].extensionofficername == ""
              ? ""
              : jsonData2017.Table[row].extensionofficername,
          enumeratorMobile:
            jsonData2017.Table[row].mobilephone2 == undefined ||
            jsonData2017.Table[row].mobilephone2 == ""
              ? ""
              : jsonData2017.Table[row].mobilephone2,
          enumeratorEmail:
            jsonData2017.Table[row].emailaddress3 == undefined ||
            jsonData2017.Table[row].emailaddress3 == ""
              ? ""
              : jsonData2017.Table[row].emailaddress3,
          enumeratorDate:
            jsonData2017.Table[row].extensionofficerdate == undefined ||
            jsonData2017.Table[row].extensionofficerdate == ""
              ? ""
              : jsonData2017.Table[row].extensionofficerdate,
          annualTurnoverObj: getTurnOverObj(
            jsonData2017.Table[row].approximate
          ),
          preferredcommunicationObj: getPreferredCommObj(
            jsonData2017.Table[row].preferredcom
          ),

          regionObj: {
            metroDistrictObj: getDistrictObj(
              jsonData2017.Table[row].MetroDistrict
            ),
            farmMuncipalRegionObj: getMunicipalityObj(
              jsonData2017.Table[row].DistrictMunicipality
            ),
          },
        };
        var newObj3 = new FarmAssetsServices(farmerAssetObj);

        await newObj3.save(async function (err, asset) {
          //  console.log("Save Asset Record #### ");
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Some thing is wrong.",
              error: err.errors,
            });
          }
          //var result2 = JSON.parse(JSON.stringify(newObj3));
          //   console.log("farmer Prod result : ", await production._id);
          //  res.status(200).json({
          //   success: true,
          //   responseCode: 200,
          //   msg: "Farmers uploaded successfully.",
          //   result:asset
          // });
        });
        //////End of Farmer Assets
      } //end of if (farmer._id)
    });
  } //for loop ends

  console.log("FOR LOOPS ends ... !!!");
});

/////////DUMP/////////////////////////////////////////////////////////////////////

router.get("/api/farmersdump2020", function (req, res) {
  console.log("FOR LOOP STARTS ... !!!");

  //below loop is for 2020 data
  //for (let row = 0; row < jsonData2020.Table.length; row++) {
  for (let row = 0; row < jsonData2020.Table.length; row++) {
    //below is the object
    let farmerRegObj = {
      TimeStamp:
        jsonData2020.Table[row].TimeStamp != undefined
          ? jsonData2020.Table[row].TimeStamp
          : "",
      FormDate:
        jsonData2020.Table[row].FormDate != undefined
          ? jsonData2020.Table[row].FormDate
          : "",
      FormTime:
        jsonData2020.Table[row].FormTime != undefined
          ? jsonData2020.Table[row].FormTime
          : "",
      PenUserDetails:
        jsonData2020.Table[row].PenUserDetails != undefined
          ? jsonData2020.Table[row].PenUserDetails
          : "",
      PenUserEmail:
        jsonData2020.Table[row].PenUserEmail != undefined
          ? jsonData2020.Table[row].PenUserEmail
          : "",
      Geography:
        jsonData2020.Table[row].Geography != undefined
          ? jsonData2020.Table[row].Geography
          : "",
      GPS:
        jsonData2020.Table[row].GPS != undefined
          ? jsonData2020.Table[row].GPS
          : "",
      PgcFormGUID:
        jsonData2020.Table[row].PgcFormGUID != undefined
          ? jsonData2020.Table[row].PgcFormGUID
          : "",
      GeographyID:
        jsonData2020.Table[row].GeographyID != undefined
          ? jsonData2020.Table[row].GeographyID
          : "",
      ReferenceNumber:
        jsonData2020.Table[row].ReferenceNumber != undefined
          ? jsonData2020.Table[row].ReferenceNumber
          : "",
      FirstStrokeTimeStamp:
        jsonData2020.Table[row].FirstStrokeTimeStamp != undefined
          ? jsonData2020.Table[row].FirstStrokeTimeStamp
          : "",
      LastStrokeTimeStamp:
        jsonData2020.Table[row].LastStrokeTimeStamp != undefined
          ? jsonData2020.Table[row].LastStrokeTimeStamp
          : "",
      DamagedForm:
        jsonData2020.Table[row].DamagedForm != undefined
          ? jsonData2020.Table[row].DamagedForm
          : "",
      LatitudeHours:
        jsonData2020.Table[row].LatitudeHours != undefined
          ? jsonData2020.Table[row].LatitudeHours
          : "",
      LatitudeMin:
        jsonData2020.Table[row].LatitudeMin != undefined
          ? jsonData2020.Table[row].LatitudeMin
          : "",
      LatitudeSec:
        jsonData2020.Table[row].LatitudeSec != undefined
          ? jsonData2020.Table[row].LatitudeSec
          : "",
      LatitudeDirection:
        jsonData2020.Table[row].LatitudeDirection != undefined
          ? jsonData2020.Table[row].LatitudeDirection
          : "",
      LongitudeHours:
        jsonData2020.Table[row].LongitudeHours != undefined
          ? jsonData2020.Table[row].LongitudeHours
          : "",
      LongitudeMin:
        jsonData2020.Table[row].LongitudeMin != undefined
          ? jsonData2020.Table[row].LongitudeMin
          : "",
      LongitudeSec:
        jsonData2020.Table[row].LongitudeSec != undefined
          ? jsonData2020.Table[row].LongitudeSec
          : "",
      LongitudeDirection:
        jsonData2020.Table[row].LongitudeDirection != undefined
          ? jsonData2020.Table[row].LongitudeDirection
          : "",
      ProducerSurname:
        jsonData2020.Table[row].ProducerSurname != undefined
          ? jsonData2020.Table[row].ProducerSurname
          : "",
      Names:
        jsonData2020.Table[row].Names != undefined
          ? jsonData2020.Table[row].Names
          : "",
      IdentityNumber:
        jsonData2020.Table[row].IdentityNumber != undefined
          ? jsonData2020.Table[row].IdentityNumber
          : "",
      ContactNo:
        jsonData2020.Table[row].ContactNo != undefined
          ? jsonData2020.Table[row].ContactNo
          : "",
      Nationality:
        jsonData2020.Table[row].Nationality != undefined
          ? jsonData2020.Table[row].Nationality
          : "",
      EmailAddress:
        jsonData2020.Table[row].EmailAddress != undefined
          ? jsonData2020.Table[row].EmailAddress
          : "",
      ResidentialAddress01:
        jsonData2020.Table[row].ResidentialAddress01 != undefined
          ? jsonData2020.Table[row].ResidentialAddress01
          : "",
      ResidentialAddress02:
        jsonData2020.Table[row].ResidentialAddress02 != undefined
          ? jsonData2020.Table[row].ResidentialAddress02
          : "",
      ResidentialAddressCode:
        jsonData2020.Table[row].ResidentialAddressCode != undefined
          ? jsonData2020.Table[row].ResidentialAddressCode
          : "",
      ResidentialAddress03:
        jsonData2020.Table[row].ResidentialAddress03 != undefined
          ? jsonData2020.Table[row].ResidentialAddress03
          : "",
      PostalAddress01:
        jsonData2020.Table[row].PostalAddress01 != undefined
          ? jsonData2020.Table[row].PostalAddress01
          : "",
      PostalAddress02:
        jsonData2020.Table[row].PostalAddress02 != undefined
          ? jsonData2020.Table[row].PostalAddress02
          : "",
      PostalAddress03:
        jsonData2020.Table[row].PostalAddress03 != undefined
          ? jsonData2020.Table[row].PostalAddress03
          : "",
      PostalAddressCode:
        jsonData2020.Table[row].PostalAddressCode != undefined
          ? jsonData2020.Table[row].PostalAddressCode
          : "",
      FarmingExperience:
        jsonData2020.Table[row].FarmingExperience != undefined
          ? jsonData2020.Table[row].FarmingExperience
          : "",
      FarmingExperienceYears:
        jsonData2020.Table[row].FarmingExperienceYears != undefined
          ? jsonData2020.Table[row].FarmingExperienceYears
          : "",
      ProducerAgeGroups:
        jsonData2020.Table[row].ProducerAgeGroups != undefined
          ? jsonData2020.Table[row].ProducerAgeGroups
          : "",
      ProducerGender:
        jsonData2020.Table[row].ProducerGender != undefined
          ? jsonData2020.Table[row].ProducerGender
          : "",
      PopulationGroupSpecify:
        jsonData2020.Table[row].PopulationGroupSpecify != undefined
          ? jsonData2020.Table[row].PopulationGroupSpecify
          : "",
      PopulationGroup:
        jsonData2020.Table[row].PopulationGroup != undefined
          ? jsonData2020.Table[row].PopulationGroup
          : "",
      Afrikaans:
        jsonData2020.Table[row].Afrikaans != undefined
          ? jsonData2020.Table[row].Afrikaans
          : "",
      English:
        jsonData2020.Table[row].English != undefined
          ? jsonData2020.Table[row].English
          : "",
      IsiNdebele:
        jsonData2020.Table[row].IsiNdebele != undefined
          ? jsonData2020.Table[row].IsiNdebele
          : "",
      Sepedi:
        jsonData2020.Table[row].Sepedi != undefined
          ? jsonData2020.Table[row].Sepedi
          : "",
      Setswana:
        jsonData2020.Table[row].Setswana != undefined
          ? jsonData2020.Table[row].Setswana
          : "",
      Sesotho:
        jsonData2020.Table[row].Sesotho != undefined
          ? jsonData2020.Table[row].Sesotho
          : "",
      SiSwati:
        jsonData2020.Table[row].SiSwati != undefined
          ? jsonData2020.Table[row].SiSwati
          : "",
      Tshivenda:
        jsonData2020.Table[row].Tshivenda != undefined
          ? jsonData2020.Table[row].Tshivenda
          : "",
      Xitsonga:
        jsonData2020.Table[row].Xitsonga != undefined
          ? jsonData2020.Table[row].Xitsonga
          : "",
      IsiXhosa:
        jsonData2020.Table[row].IsiXhosa != undefined
          ? jsonData2020.Table[row].IsiXhosa
          : "",
      IsiZulu:
        jsonData2020.Table[row].IsiZulu != undefined
          ? jsonData2020.Table[row].IsiZulu
          : "",
      OtherLanguage:
        jsonData2020.Table[row].OtherLanguage != undefined
          ? jsonData2020.Table[row].OtherLanguage
          : "",
      LanguageOtherSpecify:
        jsonData2020.Table[row].LanguageOtherSpecify != undefined
          ? jsonData2020.Table[row].LanguageOtherSpecify
          : "",
      HighestLevelEducation:
        jsonData2020.Table[row].HighestLevelEducation != undefined
          ? jsonData2020.Table[row].HighestLevelEducation
          : "",
      FulltimeOrParttimeBasis:
        jsonData2020.Table[row].FulltimeOrParttimeBasis != undefined
          ? jsonData2020.Table[row].FulltimeOrParttimeBasis
          : "",
      OwnerOfTheFarm:
        jsonData2020.Table[row].OwnerOfTheFarm != undefined
          ? jsonData2020.Table[row].OwnerOfTheFarm
          : "",
      IndicateTheOwnership:
        jsonData2020.Table[row].IndicateTheOwnership != undefined
          ? jsonData2020.Table[row].IndicateTheOwnership
          : "",
      OwnershipOtherSpecify:
        jsonData2020.Table[row].OwnershipOtherSpecify != undefined
          ? jsonData2020.Table[row].OwnershipOtherSpecify
          : "",
      FarmOrLandAcquired:
        jsonData2020.Table[row].FarmOrLandAcquired != undefined
          ? jsonData2020.Table[row].FarmOrLandAcquired
          : "",
      LandAcquiredOtherSpecify:
        jsonData2020.Table[row].LandAcquiredOtherSpecify != undefined
          ? jsonData2020.Table[row].LandAcquiredOtherSpecify
          : "",
      RedistributionProgramme:
        jsonData2020.Table[row].RedistributionProgramme != undefined
          ? jsonData2020.Table[row].RedistributionProgramme
          : "",
      RedistributionOtherSpecify:
        jsonData2020.Table[row].RedistributionOtherSpecify != undefined
          ? jsonData2020.Table[row].RedistributionOtherSpecify
          : "",
      NoOfEmployeesTotal:
        jsonData2020.Table[row].NoOfEmployeesTotal != undefined
          ? jsonData2020.Table[row].NoOfEmployeesTotal
          : "",
      NoOfEmployeesMales:
        jsonData2020.Table[row].NoOfEmployeesMales != undefined
          ? jsonData2020.Table[row].NoOfEmployeesMales
          : "",
      NoOfEmployeesFemales:
        jsonData2020.Table[row].NoOfEmployeesFemales != undefined
          ? jsonData2020.Table[row].NoOfEmployeesFemales
          : "",
      NoOfEmployeesYouth:
        jsonData2020.Table[row].NoOfEmployeesYouth != undefined
          ? jsonData2020.Table[row].NoOfEmployeesYouth
          : "",
      NoOfEmployeesDisable:
        jsonData2020.Table[row].NoOfEmployeesDisable != undefined
          ? jsonData2020.Table[row].NoOfEmployeesDisable
          : "",
      EmploymentTypeMaleP:
        jsonData2020.Table[row].EmploymentTypeMaleP != undefined
          ? jsonData2020.Table[row].EmploymentTypeMaleP
          : "",
      EmploymentTypeFemaleP:
        jsonData2020.Table[row].EmploymentTypeFemaleP != undefined
          ? jsonData2020.Table[row].EmploymentTypeFemaleP
          : "",
      EmploymentTypeFemaleS:
        jsonData2020.Table[row].EmploymentTypeFemaleS != undefined
          ? jsonData2020.Table[row].EmploymentTypeFemaleS
          : "",
      EmploymentTypeMaleC:
        jsonData2020.Table[row].EmploymentTypeMaleC != undefined
          ? jsonData2020.Table[row].EmploymentTypeMaleC
          : "",
      EmploymentTypeFemaleC:
        jsonData2020.Table[row].EmploymentTypeFemaleC != undefined
          ? jsonData2020.Table[row].EmploymentTypeFemaleC
          : "",
      EmploymentTypeMaleS:
        jsonData2020.Table[row].EmploymentTypeMaleS != undefined
          ? jsonData2020.Table[row].EmploymentTypeMaleS
          : "",
      EmploymentTypeYouthMaleP:
        jsonData2020.Table[row].EmploymentTypeYouthMaleP != undefined
          ? jsonData2020.Table[row].EmploymentTypeYouthMaleP
          : "",
      EmploymentTypeYouthFemaleP:
        jsonData2020.Table[row].EmploymentTypeYouthFemaleP != undefined
          ? jsonData2020.Table[row].EmploymentTypeYouthFemaleP
          : "",
      EmploymentTypeYouthMaleS:
        jsonData2020.Table[row].EmploymentTypeYouthMaleS != undefined
          ? jsonData2020.Table[row].EmploymentTypeYouthMaleS
          : "",
      EmploymentTypeYouthFemaleS:
        jsonData2020.Table[row].EmploymentTypeYouthFemaleS != undefined
          ? jsonData2020.Table[row].EmploymentTypeYouthFemaleS
          : "",
      EmploymentTypeYouthMaleC:
        jsonData2020.Table[row].EmploymentTypeYouthMaleC != undefined
          ? jsonData2020.Table[row].EmploymentTypeYouthMaleC
          : "",
      EmploymentTypeYouthFemaleC:
        jsonData2020.Table[row].EmploymentTypeYouthFemaleC != undefined
          ? jsonData2020.Table[row].EmploymentTypeYouthFemaleC
          : "",
      FarmName:
        jsonData2020.Table[row].FarmName != undefined
          ? jsonData2020.Table[row].FarmName
          : "",
      PortionNumber:
        jsonData2020.Table[row].PortionNumber != undefined
          ? jsonData2020.Table[row].PortionNumber
          : "",
      PortionName:
        jsonData2020.Table[row].PortionName != undefined
          ? jsonData2020.Table[row].PortionName
          : "",
      Province:
        jsonData2020.Table[row].Province != undefined
          ? jsonData2020.Table[row].Province
          : "",
      MetroDistrict:
        jsonData2020.Table[row].MetroDistrict != undefined
          ? jsonData2020.Table[row].MetroDistrict
          : "",
      Region:
        jsonData2020.Table[row].Region != undefined
          ? jsonData2020.Table[row].Region
          : "",
      DistrictMunicipality:
        jsonData2020.Table[row].DistrictMunicipality != undefined
          ? jsonData2020.Table[row].DistrictMunicipality
          : "",
      WardNumber:
        jsonData2020.Table[row].WardNumber != undefined
          ? jsonData2020.Table[row].WardNumber
          : "",
      TownOrVillage:
        jsonData2020.Table[row].TownOrVillage != undefined
          ? jsonData2020.Table[row].TownOrVillage
          : "",
      ProjectLegalEntityName:
        jsonData2020.Table[row].ProjectLegalEntityName != undefined
          ? jsonData2020.Table[row].ProjectLegalEntityName
          : "",
      SoleProprietor:
        jsonData2020.Table[row].SoleProprietor != undefined
          ? jsonData2020.Table[row].SoleProprietor
          : "",
      Partnerships:
        jsonData2020.Table[row].Partnerships != undefined
          ? jsonData2020.Table[row].Partnerships
          : "",
      CloseCorporation:
        jsonData2020.Table[row].CloseCorporation != undefined
          ? jsonData2020.Table[row].CloseCorporation
          : "",
      PrivateCompany:
        jsonData2020.Table[row].PrivateCompany != undefined
          ? jsonData2020.Table[row].PrivateCompany
          : "",
      PublicCompany:
        jsonData2020.Table[row].PublicCompany != undefined
          ? jsonData2020.Table[row].PublicCompany
          : "",
      CoOperatives:
        jsonData2020.Table[row].CoOperatives != undefined
          ? jsonData2020.Table[row].CoOperatives
          : "",
      CoOperativesMembers:
        jsonData2020.Table[row].CoOperativesMembers != undefined
          ? jsonData2020.Table[row].CoOperativesMembers
          : "",
      Trusts:
        jsonData2020.Table[row].Trusts != undefined
          ? jsonData2020.Table[row].Trusts
          : "",
      NotRegistered:
        jsonData2020.Table[row].NotRegistered != undefined
          ? jsonData2020.Table[row].NotRegistered
          : "",
      Arable:
        jsonData2020.Table[row].Arable != undefined
          ? jsonData2020.Table[row].Arable
          : "",
      TotalFarmSize:
        jsonData2020.Table[row].TotalFarmSize != undefined
          ? jsonData2020.Table[row].TotalFarmSize
          : "",
      Grazing:
        jsonData2020.Table[row].Grazing != undefined
          ? jsonData2020.Table[row].Grazing
          : "",
      NonArable:
        jsonData2020.Table[row].NonArable != undefined
          ? jsonData2020.Table[row].NonArable
          : "",
      LivestockGoat:
        jsonData2020.Table[row].LivestockGoat != undefined
          ? jsonData2020.Table[row].LivestockGoat
          : "",
      LivestockLayers:
        jsonData2020.Table[row].LivestockLayers != undefined
          ? jsonData2020.Table[row].LivestockLayers
          : "",
      LivestockBroilers:
        jsonData2020.Table[row].LivestockBroilers != undefined
          ? jsonData2020.Table[row].LivestockBroilers
          : "",
      LivestockCattle:
        jsonData2020.Table[row].LivestockCattle != undefined
          ? jsonData2020.Table[row].LivestockCattle
          : "",
      LivestockSheep:
        jsonData2020.Table[row].LivestockSheep != undefined
          ? jsonData2020.Table[row].LivestockSheep
          : "",
      LivestockPigs:
        jsonData2020.Table[row].LivestockPigs != undefined
          ? jsonData2020.Table[row].LivestockPigs
          : "",
      LivestockSows:
        jsonData2020.Table[row].LivestockSows != undefined
          ? jsonData2020.Table[row].LivestockSows
          : "",
      LivestockOstrich:
        jsonData2020.Table[row].LivestockOstrich != undefined
          ? jsonData2020.Table[row].LivestockOstrich
          : "",
      LivestockRabbit:
        jsonData2020.Table[row].LivestockRabbit != undefined
          ? jsonData2020.Table[row].LivestockRabbit
          : "",
      LivestockOther:
        jsonData2020.Table[row].LivestockOther != undefined
          ? jsonData2020.Table[row].LivestockOther
          : "",
      HorticultureVegetablesHa:
        jsonData2020.Table[row].HorticultureVegetablesHa != undefined
          ? jsonData2020.Table[row].HorticultureVegetablesHa
          : "",
      HorticultureVegetablesTons:
        jsonData2020.Table[row].HorticultureVegetablesTons != undefined
          ? jsonData2020.Table[row].HorticultureVegetablesTons
          : "",
      HorticultureFruitsHa:
        jsonData2020.Table[row].HorticultureFruitsHa != undefined
          ? jsonData2020.Table[row].HorticultureFruitsHa
          : "",
      HorticultureFruitsTons:
        jsonData2020.Table[row].HorticultureFruitsTons != undefined
          ? jsonData2020.Table[row].HorticultureFruitsTons
          : "",
      HorticultureNutsTons:
        jsonData2020.Table[row].HorticultureNutsTons != undefined
          ? jsonData2020.Table[row].HorticultureNutsTons
          : "",
      HorticultureOtherHa:
        jsonData2020.Table[row].HorticultureOtherHa != undefined
          ? jsonData2020.Table[row].HorticultureOtherHa
          : "",
      HorticultureOtherTons:
        jsonData2020.Table[row].HorticultureOtherTons != undefined
          ? jsonData2020.Table[row].HorticultureOtherTons
          : "",
      HorticultureNutsHa:
        jsonData2020.Table[row].HorticultureNutsHa != undefined
          ? jsonData2020.Table[row].HorticultureNutsHa
          : "",
      FieldCropsGrainTons:
        jsonData2020.Table[row].FieldCropsGrainTons != undefined
          ? jsonData2020.Table[row].FieldCropsGrainTons
          : "",
      FieldCropsCottonHa:
        jsonData2020.Table[row].FieldCropsCottonHa != undefined
          ? jsonData2020.Table[row].FieldCropsCottonHa
          : "",
      FieldCropsCottonTons:
        jsonData2020.Table[row].FieldCropsCottonTons != undefined
          ? jsonData2020.Table[row].FieldCropsCottonTons
          : "",
      FieldCropsGrainha:
        jsonData2020.Table[row].FieldCropsGrainha != undefined
          ? jsonData2020.Table[row].FieldCropsGrainha
          : "",
      FieldCropsOilseedsTons:
        jsonData2020.Table[row].FieldCropsOilseedsTons != undefined
          ? jsonData2020.Table[row].FieldCropsOilseedsTons
          : "",
      FieldCropsSugarCaneHa:
        jsonData2020.Table[row].FieldCropsSugarCaneHa != undefined
          ? jsonData2020.Table[row].FieldCropsSugarCaneHa
          : "",
      FieldCropsSugarCaneTons:
        jsonData2020.Table[row].FieldCropsSugarCaneTons != undefined
          ? jsonData2020.Table[row].FieldCropsSugarCaneTons
          : "",
      FieldCropsOilseedsHa:
        jsonData2020.Table[row].FieldCropsOilseedsHa != undefined
          ? jsonData2020.Table[row].FieldCropsOilseedsHa
          : "",
      FieldCropsOtherTons:
        jsonData2020.Table[row].FieldCropsOtherTons != undefined
          ? jsonData2020.Table[row].FieldCropsOtherTons
          : "",
      FieldCropsOtherHa:
        jsonData2020.Table[row].FieldCropsOtherHa != undefined
          ? jsonData2020.Table[row].FieldCropsOtherHa
          : "",
      ForestryLathsHa:
        jsonData2020.Table[row].ForestryLathsHa != undefined
          ? jsonData2020.Table[row].ForestryLathsHa
          : "",
      ForestryLathsTons:
        jsonData2020.Table[row].ForestryLathsTons != undefined
          ? jsonData2020.Table[row].ForestryLathsTons
          : "",
      ForestryDroppersHa:
        jsonData2020.Table[row].ForestryDroppersHa != undefined
          ? jsonData2020.Table[row].ForestryDroppersHa
          : "",
      ForestryDroppersTons:
        jsonData2020.Table[row].ForestryDroppersTons != undefined
          ? jsonData2020.Table[row].ForestryDroppersTons
          : "",
      ForestryPolesHa:
        jsonData2020.Table[row].ForestryPolesHa != undefined
          ? jsonData2020.Table[row].ForestryPolesHa
          : "",
      ForestryPolesTons:
        jsonData2020.Table[row].ForestryPolesTons != undefined
          ? jsonData2020.Table[row].ForestryPolesTons
          : "",
      ForestryBPolesHa:
        jsonData2020.Table[row].ForestryBPolesHa != undefined
          ? jsonData2020.Table[row].ForestryBPolesHa
          : "",
      ForestryBPolesTons:
        jsonData2020.Table[row].ForestryBPolesTons != undefined
          ? jsonData2020.Table[row].ForestryBPolesTons
          : "",
      ForestryOtherHa:
        jsonData2020.Table[row].ForestryOtherHa != undefined
          ? jsonData2020.Table[row].ForestryOtherHa
          : "",
      ForestryOtherTons:
        jsonData2020.Table[row].ForestryOtherTons != undefined
          ? jsonData2020.Table[row].ForestryOtherTons
          : "",
      AquacultureFish:
        jsonData2020.Table[row].AquacultureFish != undefined
          ? jsonData2020.Table[row].AquacultureFish
          : "",
      AquaculturePlants:
        jsonData2020.Table[row].AquaculturePlants != undefined
          ? jsonData2020.Table[row].AquaculturePlants
          : "",
      AquacultureShelfish:
        jsonData2020.Table[row].AquacultureShelfish != undefined
          ? jsonData2020.Table[row].AquacultureShelfish
          : "",
      AquacultureOther:
        jsonData2020.Table[row].AquacultureOther != undefined
          ? jsonData2020.Table[row].AquacultureOther
          : "",
      SeaFishingHake:
        jsonData2020.Table[row].SeaFishingHake != undefined
          ? jsonData2020.Table[row].SeaFishingHake
          : "",
      SeaFishingSnoek:
        jsonData2020.Table[row].SeaFishingSnoek != undefined
          ? jsonData2020.Table[row].SeaFishingSnoek
          : "",
      SeaFishingTuna:
        jsonData2020.Table[row].SeaFishingTuna != undefined
          ? jsonData2020.Table[row].SeaFishingTuna
          : "",
      SeaFishingShelfish:
        jsonData2020.Table[row].SeaFishingShelfish != undefined
          ? jsonData2020.Table[row].SeaFishingShelfish
          : "",
      SeaFishingOther:
        jsonData2020.Table[row].SeaFishingOther != undefined
          ? jsonData2020.Table[row].SeaFishingOther
          : "",
      SeaFishingLobster:
        jsonData2020.Table[row].SeaFishingLobster != undefined
          ? jsonData2020.Table[row].SeaFishingLobster
          : "",
      GameFarmingBuffalo:
        jsonData2020.Table[row].GameFarmingBuffalo != undefined
          ? jsonData2020.Table[row].GameFarmingBuffalo
          : "",
      GameFarmingSpringbok:
        jsonData2020.Table[row].GameFarmingSpringbok != undefined
          ? jsonData2020.Table[row].GameFarmingSpringbok
          : "",
      GameFarmingImpala:
        jsonData2020.Table[row].GameFarmingImpala != undefined
          ? jsonData2020.Table[row].GameFarmingImpala
          : "",
      GameFarmingCrocodiles:
        jsonData2020.Table[row].GameFarmingCrocodiles != undefined
          ? jsonData2020.Table[row].GameFarmingCrocodiles
          : "",
      GameFarmingGemsbok:
        jsonData2020.Table[row].GameFarmingGemsbok != undefined
          ? jsonData2020.Table[row].GameFarmingGemsbok
          : "",
      GameFarmingOther:
        jsonData2020.Table[row].GameFarmingOther != undefined
          ? jsonData2020.Table[row].GameFarmingOther
          : "",
      TypeofMarketingChannel:
        jsonData2020.Table[row].TypeofMarketingChannel != undefined
          ? jsonData2020.Table[row].TypeofMarketingChannel
          : "",
      ValueAndAgroProcessing:
        jsonData2020.Table[row].ValueAndAgroProcessing != undefined
          ? jsonData2020.Table[row].ValueAndAgroProcessing
          : "",
      SortingAndGrading:
        jsonData2020.Table[row].SortingAndGrading != undefined
          ? jsonData2020.Table[row].SortingAndGrading
          : "",
      Milling:
        jsonData2020.Table[row].Milling != undefined
          ? jsonData2020.Table[row].Milling
          : "",
      Canning:
        jsonData2020.Table[row].Canning != undefined
          ? jsonData2020.Table[row].Canning
          : "",
      Packaging:
        jsonData2020.Table[row].Packaging != undefined
          ? jsonData2020.Table[row].Packaging
          : "",
      Grinding:
        jsonData2020.Table[row].Grinding != undefined
          ? jsonData2020.Table[row].Grinding
          : "",
      Bottling:
        jsonData2020.Table[row].Bottling != undefined
          ? jsonData2020.Table[row].Bottling
          : "",
      ColdStorage:
        jsonData2020.Table[row].ColdStorage != undefined
          ? jsonData2020.Table[row].ColdStorage
          : "",
      Slaughtering:
        jsonData2020.Table[row].Slaughtering != undefined
          ? jsonData2020.Table[row].Slaughtering
          : "",
      Extraction:
        jsonData2020.Table[row].Extraction != undefined
          ? jsonData2020.Table[row].Extraction
          : "",
      SliceAndDice:
        jsonData2020.Table[row].SliceAndDice != undefined
          ? jsonData2020.Table[row].SliceAndDice
          : "",
      PressingForOil:
        jsonData2020.Table[row].PressingForOil != undefined
          ? jsonData2020.Table[row].PressingForOil
          : "",
      Mixing:
        jsonData2020.Table[row].Mixing != undefined
          ? jsonData2020.Table[row].Mixing
          : "",
      Labelling:
        jsonData2020.Table[row].Labelling != undefined
          ? jsonData2020.Table[row].Labelling
          : "",
      JuicingAndPurees:
        jsonData2020.Table[row].JuicingAndPurees != undefined
          ? jsonData2020.Table[row].JuicingAndPurees
          : "",
      Flavouring:
        jsonData2020.Table[row].Flavouring != undefined
          ? jsonData2020.Table[row].Flavouring
          : "",
      Pasteurising:
        jsonData2020.Table[row].Pasteurising != undefined
          ? jsonData2020.Table[row].Pasteurising
          : "",
      SecondaryOthers:
        jsonData2020.Table[row].SecondaryOthers != undefined
          ? jsonData2020.Table[row].SecondaryOthers
          : "",
      AdvancedOthers:
        jsonData2020.Table[row].AdvancedOthers != undefined
          ? jsonData2020.Table[row].AdvancedOthers
          : "",
      PrimaryOthers:
        jsonData2020.Table[row].PrimaryOthers != undefined
          ? jsonData2020.Table[row].PrimaryOthers
          : "",
      UndertakenMmanually:
        jsonData2020.Table[row].UndertakenMmanually != undefined
          ? jsonData2020.Table[row].UndertakenMmanually
          : "",
      FixedStructuresFarmHouse:
        jsonData2020.Table[row].FixedStructuresFarmHouse != undefined
          ? jsonData2020.Table[row].FixedStructuresFarmHouse
          : "",
      FixedStructuresStorageRooms:
        jsonData2020.Table[row].FixedStructuresStorageRooms != undefined
          ? jsonData2020.Table[row].FixedStructuresStorageRooms
          : "",
      FixedStructuresPoultryHouses:
        jsonData2020.Table[row].FixedStructuresPoultryHouses != undefined
          ? jsonData2020.Table[row].FixedStructuresPoultryHouses
          : "",
      FixedStructuresPigsty:
        jsonData2020.Table[row].FixedStructuresPigsty != undefined
          ? jsonData2020.Table[row].FixedStructuresPigsty
          : "",
      FixedStructuresPackhouse:
        jsonData2020.Table[row].FixedStructuresPackhouse != undefined
          ? jsonData2020.Table[row].FixedStructuresPackhouse
          : "",
      FixedStructuresFencing:
        jsonData2020.Table[row].FixedStructuresFencing != undefined
          ? jsonData2020.Table[row].FixedStructuresFencing
          : "",
      FixedStructuresOther:
        jsonData2020.Table[row].FixedStructuresOther != undefined
          ? jsonData2020.Table[row].FixedStructuresOther
          : "",
      FixedStructuresOtherSpecify:
        jsonData2020.Table[row].FixedStructuresOtherSpecify != undefined
          ? jsonData2020.Table[row].FixedStructuresOtherSpecify
          : "",
      IrrigationDripMicro:
        jsonData2020.Table[row].IrrigationDripMicro != undefined
          ? jsonData2020.Table[row].IrrigationDripMicro
          : "",
      IrrigationSprinkler:
        jsonData2020.Table[row].IrrigationSprinkler != undefined
          ? jsonData2020.Table[row].IrrigationSprinkler
          : "",
      IrrigationCentrePivots:
        jsonData2020.Table[row].IrrigationCentrePivots != undefined
          ? jsonData2020.Table[row].IrrigationCentrePivots
          : "",
      IrrigationFurrow:
        jsonData2020.Table[row].IrrigationFurrow != undefined
          ? jsonData2020.Table[row].IrrigationFurrow
          : "",
      IrrigationFlood:
        jsonData2020.Table[row].IrrigationFlood != undefined
          ? jsonData2020.Table[row].IrrigationFlood
          : "",
      IrrigationOther:
        jsonData2020.Table[row].IrrigationOther != undefined
          ? jsonData2020.Table[row].IrrigationOther
          : "",
      IrrigationOtherSpecify:
        jsonData2020.Table[row].IrrigationOtherSpecify != undefined
          ? jsonData2020.Table[row].IrrigationOtherSpecify
          : "",
      WaterRiver:
        jsonData2020.Table[row].WaterRiver != undefined
          ? jsonData2020.Table[row].WaterRiver
          : "",
      WaterDams:
        jsonData2020.Table[row].WaterDams != undefined
          ? jsonData2020.Table[row].WaterDams
          : "",
      WaterCanal:
        jsonData2020.Table[row].WaterCanal != undefined
          ? jsonData2020.Table[row].WaterCanal
          : "",
      WaterBoreholesWindmills:
        jsonData2020.Table[row].WaterBoreholesWindmills != undefined
          ? jsonData2020.Table[row].WaterBoreholesWindmills
          : "",
      WaterOther:
        jsonData2020.Table[row].WaterOther != undefined
          ? jsonData2020.Table[row].WaterOther
          : "",
      WaterOtherSpecify:
        jsonData2020.Table[row].WaterOtherSpecify != undefined
          ? jsonData2020.Table[row].WaterOtherSpecify
          : "",
      MachineryTractor:
        jsonData2020.Table[row].MachineryTractor != undefined
          ? jsonData2020.Table[row].MachineryTractor
          : "",
      MachineryCombineHarvester:
        jsonData2020.Table[row].MachineryCombineHarvester != undefined
          ? jsonData2020.Table[row].MachineryCombineHarvester
          : "",
      MachineryTruck:
        jsonData2020.Table[row].MachineryTruck != undefined
          ? jsonData2020.Table[row].MachineryTruck
          : "",
      MachineryLightDelivery:
        jsonData2020.Table[row].MachineryLightDelivery != undefined
          ? jsonData2020.Table[row].MachineryLightDelivery
          : "",
      MachineryOther:
        jsonData2020.Table[row].MachineryOther != undefined
          ? jsonData2020.Table[row].MachineryOther
          : "",
      MachineryOtherSpecify:
        jsonData2020.Table[row].MachineryOtherSpecify != undefined
          ? jsonData2020.Table[row].MachineryOtherSpecify
          : "",
      ImplementsEquipmentPlough:
        jsonData2020.Table[row].ImplementsEquipmentPlough != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentPlough
          : "",
      ImplementsEquipmentPlanter:
        jsonData2020.Table[row].ImplementsEquipmentPlanter != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentPlanter
          : "",
      ImplementsEquipmentTiller:
        jsonData2020.Table[row].ImplementsEquipmentTiller != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentTiller
          : "",
      ImplementsEquipmentGarden:
        jsonData2020.Table[row].ImplementsEquipmentGarden != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentGarden
          : "",
      ImplementsEquipmentTrailer:
        jsonData2020.Table[row].ImplementsEquipmentTrailer != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentTrailer
          : "",
      ImplementsEquipmentOther:
        jsonData2020.Table[row].ImplementsEquipmentOther != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentOther
          : "",
      ImplementsEquipmentSpecify:
        jsonData2020.Table[row].ImplementsEquipmentSpecify != undefined
          ? jsonData2020.Table[row].ImplementsEquipmentSpecify
          : "",
      OtherDipTank:
        jsonData2020.Table[row].OtherDipTank != undefined
          ? jsonData2020.Table[row].OtherDipTank
          : "",
      OtherAccessRoad:
        jsonData2020.Table[row].OtherAccessRoad != undefined
          ? jsonData2020.Table[row].OtherAccessRoad
          : "",
      OtherElectricity:
        jsonData2020.Table[row].OtherElectricity != undefined
          ? jsonData2020.Table[row].OtherElectricity
          : "",
      OtherOther:
        jsonData2020.Table[row].OtherOther != undefined
          ? jsonData2020.Table[row].OtherOther
          : "",
      OtherOtherSpecify:
        jsonData2020.Table[row].OtherOtherSpecify != undefined
          ? jsonData2020.Table[row].OtherOtherSpecify
          : "",
      DipTankElsewhere:
        jsonData2020.Table[row].DipTankElsewhere != undefined
          ? jsonData2020.Table[row].DipTankElsewhere
          : "",
      TypeOfDipTank:
        jsonData2020.Table[row].TypeOfDipTank != undefined
          ? jsonData2020.Table[row].TypeOfDipTank
          : "",
      WhichOfTheFollowing:
        jsonData2020.Table[row].WhichOfTheFollowing != undefined
          ? jsonData2020.Table[row].WhichOfTheFollowing
          : "",
      MAFISA:
        jsonData2020.Table[row].MAFISA != undefined
          ? jsonData2020.Table[row].MAFISA
          : "",
      CASP:
        jsonData2020.Table[row].CASP != undefined
          ? jsonData2020.Table[row].CASP
          : "",
      AgriBEEE:
        jsonData2020.Table[row].AgriBEEE != undefined
          ? jsonData2020.Table[row].AgriBEEE
          : "",
      LandCare:
        jsonData2020.Table[row].LandCare != undefined
          ? jsonData2020.Table[row].LandCare
          : "",
      RECAP:
        jsonData2020.Table[row].RECAP != undefined
          ? jsonData2020.Table[row].RECAP
          : "",
      ILMA:
        jsonData2020.Table[row].ILMA != undefined
          ? jsonData2020.Table[row].ILMA
          : "",
      OtherGovernmentSupport:
        jsonData2020.Table[row].OtherGovernmentSupport != undefined
          ? jsonData2020.Table[row].OtherGovernmentSupport
          : "",
      GovernmentSupportSpecify:
        jsonData2020.Table[row].GovernmentSupportSpecify != undefined
          ? jsonData2020.Table[row].GovernmentSupportSpecify
          : "",
      ExtensionServices:
        jsonData2020.Table[row].ExtensionServices != undefined
          ? jsonData2020.Table[row].ExtensionServices
          : "",
      ExtensionServicesInUse:
        jsonData2020.Table[row].ExtensionServicesInUse != undefined
          ? jsonData2020.Table[row].ExtensionServicesInUse
          : "",
      VeterinaryServices:
        jsonData2020.Table[row].VeterinaryServices != undefined
          ? jsonData2020.Table[row].VeterinaryServices
          : "",
      VeterinaryServicesInUse:
        jsonData2020.Table[row].VeterinaryServicesInUse != undefined
          ? jsonData2020.Table[row].VeterinaryServicesInUse
          : "",
      EarlyWarningInformation:
        jsonData2020.Table[row].EarlyWarningInformation != undefined
          ? jsonData2020.Table[row].EarlyWarningInformation
          : "",
      AgriculturalEconomicInfo:
        jsonData2020.Table[row].AgriculturalEconomicInfo != undefined
          ? jsonData2020.Table[row].AgriculturalEconomicInfo
          : "",
      Training:
        jsonData2020.Table[row].Training != undefined
          ? jsonData2020.Table[row].Training
          : "",
      ApproximateAnnualTurnover:
        jsonData2020.Table[row].ApproximateAnnualTurnover != undefined
          ? jsonData2020.Table[row].ApproximateAnnualTurnover
          : "",
      Telephone:
        jsonData2020.Table[row].Telephone != undefined
          ? jsonData2020.Table[row].Telephone
          : "",
      MobilePhone:
        jsonData2020.Table[row].MobilePhone != undefined
          ? jsonData2020.Table[row].MobilePhone
          : "",
      Fax:
        jsonData2020.Table[row].Fax != undefined
          ? jsonData2020.Table[row].Fax
          : "",
      Email:
        jsonData2020.Table[row]["E-mail"] != undefined
          ? jsonData2020.Table[row]["E-mail"]
          : "",
      FaceToFace:
        jsonData2020.Table[row].FaceToFace != undefined
          ? jsonData2020.Table[row].FaceToFace
          : "",
      ProducerFarmerDate:
        jsonData2020.Table[row].ProducerFarmerDate != undefined
          ? jsonData2020.Table[row].ProducerFarmerDate
          : "",
      ProducerFarmerSignature:
        jsonData2020.Table[row].ProducerFarmerSignature != undefined
          ? jsonData2020.Table[row].ProducerFarmerSignature
          : "",
      SurnameAndInitials:
        jsonData2020.Table[row].SurnameAndInitials != undefined
          ? jsonData2020.Table[row].SurnameAndInitials
          : "",
      ExtensionOfficerEmail:
        jsonData2020.Table[row].ExtensionOfficerEmail != undefined
          ? jsonData2020.Table[row].ExtensionOfficerEmail
          : "",
      TelephoneMobilePhoneNo:
        jsonData2020.Table[row].TelephoneMobilePhoneNo != undefined
          ? jsonData2020.Table[row].TelephoneMobilePhoneNo
          : "",
      ExtensionOfficerDate:
        jsonData2020.Table[row].ExtensionOfficerDate != undefined
          ? jsonData2020.Table[row].ExtensionOfficerDate
          : "",
      Name_01:
        jsonData2020.Table[row].Name_01 != undefined
          ? jsonData2020.Table[row].Name_01
          : "",
      Surname_01:
        jsonData2020.Table[row].Surname_01 != undefined
          ? jsonData2020.Table[row].Surname_01
          : "",
      Gender_01:
        jsonData2020.Table[row].Gender_01 != undefined
          ? jsonData2020.Table[row].Gender_01
          : "",
      Race_01:
        jsonData2020.Table[row].Race_01 != undefined
          ? jsonData2020.Table[row].Race_01
          : "",
      AgeGroups_01:
        jsonData2020.Table[row].AgeGroups_01 != undefined
          ? jsonData2020.Table[row].AgeGroups_01
          : "",
      IDNo_01:
        jsonData2020.Table[row].IDNo_01 != undefined
          ? jsonData2020.Table[row].IDNo_01
          : "",
      Name_02:
        jsonData2020.Table[row].Name_02 != undefined
          ? jsonData2020.Table[row].Name_02
          : "",
      Surname_02:
        jsonData2020.Table[row].Surname_02 != undefined
          ? jsonData2020.Table[row].Surname_02
          : "",
      IDNo_02:
        jsonData2020.Table[row].IDNo_02 != undefined
          ? jsonData2020.Table[row].IDNo_02
          : "",
      Gender_02:
        jsonData2020.Table[row].Gender_02 != undefined
          ? jsonData2020.Table[row].Gender_02
          : "",
      Race_02:
        jsonData2020.Table[row].Race_02 != undefined
          ? jsonData2020.Table[row].Race_02
          : "",
      AgeGroups_02:
        jsonData2020.Table[row].AgeGroups_02 != undefined
          ? jsonData2020.Table[row].AgeGroups_02
          : "",
      Name_03:
        jsonData2020.Table[row].Name_03 != undefined
          ? jsonData2020.Table[row].Name_03
          : "",
      Surname_03:
        jsonData2020.Table[row].Surname_03 != undefined
          ? jsonData2020.Table[row].Surname_03
          : "",
      IDNo_03:
        jsonData2020.Table[row].IDNo_03 != undefined
          ? jsonData2020.Table[row].IDNo_03
          : "",
      Gender_03:
        jsonData2020.Table[row].Gender_03 != undefined
          ? jsonData2020.Table[row].Gender_03
          : "",
      Race_03:
        jsonData2020.Table[row].Race_03 != undefined
          ? jsonData2020.Table[row].Race_03
          : "",
      AgeGroups_03:
        jsonData2020.Table[row].AgeGroups_03 != undefined
          ? jsonData2020.Table[row].AgeGroups_03
          : "",
      Gender_04:
        jsonData2020.Table[row].Gender_04 != undefined
          ? jsonData2020.Table[row].Gender_04
          : "",
      AgeGroups_04:
        jsonData2020.Table[row].AgeGroups_04 != undefined
          ? jsonData2020.Table[row].AgeGroups_04
          : "",
      Name_04:
        jsonData2020.Table[row].Name_04 != undefined
          ? jsonData2020.Table[row].Name_04
          : "",
      Surname_04:
        jsonData2020.Table[row].Surname_04 != undefined
          ? jsonData2020.Table[row].Surname_04
          : "",
      IDNo_04:
        jsonData2020.Table[row].IDNo_04 != undefined
          ? jsonData2020.Table[row].IDNo_04
          : "",
      Race_04:
        jsonData2020.Table[row].Race_04 != undefined
          ? jsonData2020.Table[row].Race_04
          : "",
      Race_05:
        jsonData2020.Table[row].Race_05 != undefined
          ? jsonData2020.Table[row].Race_05
          : "",
      AgeGroups_05:
        jsonData2020.Table[row].AgeGroups_05 != undefined
          ? jsonData2020.Table[row].AgeGroups_05
          : "",
      Name_05:
        jsonData2020.Table[row].Name_05 != undefined
          ? jsonData2020.Table[row].Name_05
          : "",
      Surname_05:
        jsonData2020.Table[row].Surname_05 != undefined
          ? jsonData2020.Table[row].Surname_05
          : "",
      IDNo_05:
        jsonData2020.Table[row].IDNo_05 != undefined
          ? jsonData2020.Table[row].IDNo_05
          : "",
      Gender_05:
        jsonData2020.Table[row].Gender_05 != undefined
          ? jsonData2020.Table[row].Gender_05
          : "",
      Name_06:
        jsonData2020.Table[row].Name_06 != undefined
          ? jsonData2020.Table[row].Name_06
          : "",
      Surname_06:
        jsonData2020.Table[row].Surname_06 != undefined
          ? jsonData2020.Table[row].Surname_06
          : "",
      IDNo_06:
        jsonData2020.Table[row].IDNo_06 != undefined
          ? jsonData2020.Table[row].IDNo_06
          : "",
      Gender_06:
        jsonData2020.Table[row].Gender_06 != undefined
          ? jsonData2020.Table[row].Gender_06
          : "",
      Race_06:
        jsonData2020.Table[row].Race_06 != undefined
          ? jsonData2020.Table[row].Race_06
          : "",
      AgeGroups_06:
        jsonData2020.Table[row].AgeGroups_06 != undefined
          ? jsonData2020.Table[row].AgeGroups_06
          : "",
      Name_07:
        jsonData2020.Table[row].Name_07 != undefined
          ? jsonData2020.Table[row].Name_07
          : "",
      Surname_07:
        jsonData2020.Table[row].Surname_07 != undefined
          ? jsonData2020.Table[row].Surname_07
          : "",
      IDNo_07:
        jsonData2020.Table[row].IDNo_07 != undefined
          ? jsonData2020.Table[row].IDNo_07
          : "",
      Gender_07:
        jsonData2020.Table[row].Gender_07 != undefined
          ? jsonData2020.Table[row].Gender_07
          : "",
      Race_07:
        jsonData2020.Table[row].Race_07 != undefined
          ? jsonData2020.Table[row].Race_07
          : "",
      AgeGroups_07:
        jsonData2020.Table[row].AgeGroups_07 != undefined
          ? jsonData2020.Table[row].AgeGroups_07
          : "",
      Name_08:
        jsonData2020.Table[row].Name_08 != undefined
          ? jsonData2020.Table[row].Name_08
          : "",
      Surname_08:
        jsonData2020.Table[row].Surname_08 != undefined
          ? jsonData2020.Table[row].Surname_08
          : "",
      IDNo_08:
        jsonData2020.Table[row].IDNo_08 != undefined
          ? jsonData2020.Table[row].IDNo_08
          : "",
      Gender_08:
        jsonData2020.Table[row].Gender_08 != undefined
          ? jsonData2020.Table[row].Gender_08
          : "",
      Race_08:
        jsonData2020.Table[row].Race_08 != undefined
          ? jsonData2020.Table[row].Race_08
          : "",
      AgeGroups_08:
        jsonData2020.Table[row].AgeGroups_08 != undefined
          ? jsonData2020.Table[row].AgeGroups_08
          : "",
      Name_09:
        jsonData2020.Table[row].Name_09 != undefined
          ? jsonData2020.Table[row].Name_09
          : "",
      Surname_09:
        jsonData2020.Table[row].Surname_09 != undefined
          ? jsonData2020.Table[row].Surname_09
          : "",
      Race_09:
        jsonData2020.Table[row].Race_09 != undefined
          ? jsonData2020.Table[row].Race_09
          : "",
      IDNo_09:
        jsonData2020.Table[row].IDNo_09 != undefined
          ? jsonData2020.Table[row].IDNo_09
          : "",
      Gender_09:
        jsonData2020.Table[row].Gender_09 != undefined
          ? jsonData2020.Table[row].Gender_09
          : "",
      AgeGroups_09:
        jsonData2020.Table[row].AgeGroups_09 != undefined
          ? jsonData2020.Table[row].AgeGroups_09
          : "",
      Name_10:
        jsonData2020.Table[row].Name_10 != undefined
          ? jsonData2020.Table[row].Name_10
          : "",
      Surname_10:
        jsonData2020.Table[row].Surname_10 != undefined
          ? jsonData2020.Table[row].Surname_10
          : "",
      IDNo_10:
        jsonData2020.Table[row].IDNo_10 != undefined
          ? jsonData2020.Table[row].IDNo_10
          : "",
      Gender_10:
        jsonData2020.Table[row].Gender_10 != undefined
          ? jsonData2020.Table[row].Gender_10
          : "",
      Race_10:
        jsonData2020.Table[row].Race_10 != undefined
          ? jsonData2020.Table[row].Race_10
          : "",
      AgeGroups_10:
        jsonData2020.Table[row].AgeGroups_10 != undefined
          ? jsonData2020.Table[row].AgeGroups_10
          : "",
      Name_11:
        jsonData2020.Table[row].Name_11 != undefined
          ? jsonData2020.Table[row].Name_11
          : "",
      Surname_11:
        jsonData2020.Table[row].Surname_11 != undefined
          ? jsonData2020.Table[row].Surname_11
          : "",
      IDNo_11:
        jsonData2020.Table[row].IDNo_11 != undefined
          ? jsonData2020.Table[row].IDNo_11
          : "",
      Gender_11:
        jsonData2020.Table[row].Gender_11 != undefined
          ? jsonData2020.Table[row].Gender_11
          : "",
      Race_11:
        jsonData2020.Table[row].Race_11 != undefined
          ? jsonData2020.Table[row].Race_11
          : "",
      AgeGroups_11:
        jsonData2020.Table[row].AgeGroups_11 != undefined
          ? jsonData2020.Table[row].AgeGroups_11
          : "",
      Name_12:
        jsonData2020.Table[row].Name_12 != undefined
          ? jsonData2020.Table[row].Name_12
          : "",
      Surname_12:
        jsonData2020.Table[row].Surname_12 != undefined
          ? jsonData2020.Table[row].Surname_12
          : "",
      Gender_12:
        jsonData2020.Table[row].Gender_12 != undefined
          ? jsonData2020.Table[row].Gender_12
          : "",
      AgeGroups_12:
        jsonData2020.Table[row].AgeGroups_12 != undefined
          ? jsonData2020.Table[row].AgeGroups_12
          : "",
      IDNo_12:
        jsonData2020.Table[row].IDNo_12 != undefined
          ? jsonData2020.Table[row].IDNo_12
          : "",
      Race_12:
        jsonData2020.Table[row].Race_12 != undefined
          ? jsonData2020.Table[row].Race_12
          : "",
      Name_13:
        jsonData2020.Table[row].Name_13 != undefined
          ? jsonData2020.Table[row].Name_13
          : "",
      Surname_13:
        jsonData2020.Table[row].Surname_13 != undefined
          ? jsonData2020.Table[row].Surname_13
          : "",
      IDNo_13:
        jsonData2020.Table[row].IDNo_13 != undefined
          ? jsonData2020.Table[row].IDNo_13
          : "",
      Gender_13:
        jsonData2020.Table[row].Gender_13 != undefined
          ? jsonData2020.Table[row].Gender_13
          : "",
      Race_13:
        jsonData2020.Table[row].Race_13 != undefined
          ? jsonData2020.Table[row].Race_13
          : "",
      AgeGroups_13:
        jsonData2020.Table[row].AgeGroups_13 != undefined
          ? jsonData2020.Table[row].AgeGroups_13
          : "",
      Name_14:
        jsonData2020.Table[row].Name_14 != undefined
          ? jsonData2020.Table[row].Name_14
          : "",
      Surname_14:
        jsonData2020.Table[row].Surname_14 != undefined
          ? jsonData2020.Table[row].Surname_14
          : "",
      IDNo_14:
        jsonData2020.Table[row].IDNo_14 != undefined
          ? jsonData2020.Table[row].IDNo_14
          : "",
      Gender_14:
        jsonData2020.Table[row].Gender_14 != undefined
          ? jsonData2020.Table[row].Gender_14
          : "",
      Race_14:
        jsonData2020.Table[row].Race_14 != undefined
          ? jsonData2020.Table[row].Race_14
          : "",
      AgeGroups_14:
        jsonData2020.Table[row].AgeGroups_14 != undefined
          ? jsonData2020.Table[row].AgeGroups_14
          : "",
      Name_15:
        jsonData2020.Table[row].Name_15 != undefined
          ? jsonData2020.Table[row].Name_15
          : "",
      Surname_15:
        jsonData2020.Table[row].Surname_15 != undefined
          ? jsonData2020.Table[row].Surname_15
          : "",
      IDNo_15:
        jsonData2020.Table[row].IDNo_15 != undefined
          ? jsonData2020.Table[row].IDNo_15
          : "",
      Gender_15:
        jsonData2020.Table[row].Gender_15 != undefined
          ? jsonData2020.Table[row].Gender_15
          : "",
      Race_15:
        jsonData2020.Table[row].Race_15 != undefined
          ? jsonData2020.Table[row].Race_15
          : "",
      AgeGroups_15:
        jsonData2020.Table[row].AgeGroups_15 != undefined
          ? jsonData2020.Table[row].AgeGroups_15
          : "",
      Name_16:
        jsonData2020.Table[row].Name_16 != undefined
          ? jsonData2020.Table[row].Name_16
          : "",
      Surname_16:
        jsonData2020.Table[row].Surname_16 != undefined
          ? jsonData2020.Table[row].Surname_16
          : "",
      IDNo_16:
        jsonData2020.Table[row].IDNo_16 != undefined
          ? jsonData2020.Table[row].IDNo_16
          : "",
      AgeGroups_16:
        jsonData2020.Table[row].AgeGroups_16 != undefined
          ? jsonData2020.Table[row].AgeGroups_16
          : "",
      Gender_16:
        jsonData2020.Table[row].Gender_16 != undefined
          ? jsonData2020.Table[row].Gender_16
          : "",
      Race_16:
        jsonData2020.Table[row].Race_16 != undefined
          ? jsonData2020.Table[row].Race_16
          : "",
      Name_17:
        jsonData2020.Table[row].Name_17 != undefined
          ? jsonData2020.Table[row].Name_17
          : "",
      Surname_17:
        jsonData2020.Table[row].Surname_17 != undefined
          ? jsonData2020.Table[row].Surname_17
          : "",
      IDNo_17:
        jsonData2020.Table[row].IDNo_17 != undefined
          ? jsonData2020.Table[row].IDNo_17
          : "",
      Race_17:
        jsonData2020.Table[row].Race_17 != undefined
          ? jsonData2020.Table[row].Race_17
          : "",
      Gender_17:
        jsonData2020.Table[row].Gender_17 != undefined
          ? jsonData2020.Table[row].Gender_17
          : "",
      AgeGroups_17:
        jsonData2020.Table[row].AgeGroups_17 != undefined
          ? jsonData2020.Table[row].AgeGroups_17
          : "",
      Name_18:
        jsonData2020.Table[row].Name_18 != undefined
          ? jsonData2020.Table[row].Name_18
          : "",
      Surname_18:
        jsonData2020.Table[row].Surname_18 != undefined
          ? jsonData2020.Table[row].Surname_18
          : "",
      IDNo_18:
        jsonData2020.Table[row].IDNo_18 != undefined
          ? jsonData2020.Table[row].IDNo_18
          : "",
      Race_18:
        jsonData2020.Table[row].Race_18 != undefined
          ? jsonData2020.Table[row].Race_18
          : "",
      Gender_18:
        jsonData2020.Table[row].Gender_18 != undefined
          ? jsonData2020.Table[row].Gender_18
          : "",
      AgeGroups_18:
        jsonData2020.Table[row].AgeGroups_18 != undefined
          ? jsonData2020.Table[row].AgeGroups_18
          : "",
      Name_19:
        jsonData2020.Table[row].Name_19 != undefined
          ? jsonData2020.Table[row].Name_19
          : "",
      Surname_19:
        jsonData2020.Table[row].Surname_19 != undefined
          ? jsonData2020.Table[row].Surname_19
          : "",
      IDNo_19:
        jsonData2020.Table[row].IDNo_19 != undefined
          ? jsonData2020.Table[row].IDNo_19
          : "",
      Race_19:
        jsonData2020.Table[row].Race_19 != undefined
          ? jsonData2020.Table[row].Race_19
          : "",
      AgeGroups_19:
        jsonData2020.Table[row].AgeGroups_19 != undefined
          ? jsonData2020.Table[row].AgeGroups_19
          : "",
      Gender_19:
        jsonData2020.Table[row].Gender_19 != undefined
          ? jsonData2020.Table[row].Gender_19
          : "",
    };

    var newObj = new FarmerDetailDump2020(farmerRegObj);

    newObj.save(async function (err, farmer) {
      if (err) {
        console.log("errors farmer Reg", err);
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Some thing is wrong.",
          error: err.errors,
        });
      }
    });
  } //for loop ends

  console.log("FOR LOOPS ends ... !!!");
});

router.get("/api/farmersdump2017", function (req, res) {
  console.log("FOR LOOP STARTS ... !!!");

  //below loop is for 2017 data
  //for (let row = 0; row < jsonData2017.Table.length; row++) {
  for (let row = 10000; row < jsonData2017.Table.length; row++) {
    //below is the object
    let farmerRegObj = {
      TimeStamp:
        jsonData2017.Table[row].TimeStamp != undefined
          ? jsonData2017.Table[row].TimeStamp
          : "",
      FormDate:
        jsonData2017.Table[row].FormDate != undefined
          ? jsonData2017.Table[row].FormDate
          : "",
      FormTime:
        jsonData2017.Table[row].FormTime != undefined
          ? jsonData2017.Table[row].FormTime
          : "",
      PenUserDetails:
        jsonData2017.Table[row].PenUserDetails != undefined
          ? jsonData2017.Table[row].PenUserDetails
          : "",
      Geography:
        jsonData2017.Table[row].Geography != undefined
          ? jsonData2017.Table[row].Geography
          : "",
      GPS:
        jsonData2017.Table[row].GPS != undefined
          ? jsonData2017.Table[row].GPS
          : "",
      PgcFormGUID:
        jsonData2017.Table[row].PgcFormGUID != undefined
          ? jsonData2017.Table[row].PgcFormGUID
          : "",
      GeographyID:
        jsonData2017.Table[row].GeographyID != undefined
          ? jsonData2017.Table[row].GeographyID
          : "",
      ReferenceNumber:
        jsonData2017.Table[row].ReferenceNumber != undefined
          ? jsonData2017.Table[row].ReferenceNumber
          : "",
      FirstStrokeTimeStamp:
        jsonData2017.Table[row].FirstStrokeTimeStamp != undefined
          ? jsonData2017.Table[row].FirstStrokeTimeStamp
          : "",
      LastStrokeTimeStamp:
        jsonData2017.Table[row].LastStrokeTimeStamp != undefined
          ? jsonData2017.Table[row].LastStrokeTimeStamp
          : "",
      damagedform:
        jsonData2017.Table[row].damagedform != undefined
          ? jsonData2017.Table[row].damagedform
          : "",
      reference_number:
        jsonData2017.Table[row].reference_number != undefined
          ? jsonData2017.Table[row].reference_number
          : "",
      sgcode:
        jsonData2017.Table[row].sgcode != undefined
          ? jsonData2017.Table[row].sgcode
          : "",
      longitude:
        jsonData2017.Table[row].longitude != undefined
          ? jsonData2017.Table[row].longitude
          : "",
      latitude:
        jsonData2017.Table[row].latitude != undefined
          ? jsonData2017.Table[row].latitude
          : "",
      gpscoordinates:
        jsonData2017.Table[row].gpscoordinates != undefined
          ? jsonData2017.Table[row].gpscoordinates
          : "",
      otherspecify1:
        jsonData2017.Table[row].otherspecify1 != undefined
          ? jsonData2017.Table[row].otherspecify1
          : "",
      generalinfo:
        jsonData2017.Table[row].generalinfo != undefined
          ? jsonData2017.Table[row].generalinfo
          : "",
      surname1:
        jsonData2017.Table[row].surname1 != undefined
          ? jsonData2017.Table[row].surname1
          : "",
      name:
        jsonData2017.Table[row].name != undefined
          ? jsonData2017.Table[row].name
          : "",
      contactnumber:
        jsonData2017.Table[row].contactnumber != undefined
          ? jsonData2017.Table[row].contactnumber
          : "",
      identitynumber:
        jsonData2017.Table[row].identitynumber != undefined
          ? jsonData2017.Table[row].identitynumber
          : "",
      emailaddress:
        jsonData2017.Table[row].emailaddress != undefined
          ? jsonData2017.Table[row].emailaddress
          : "",
      farmresidentialaddress1:
        jsonData2017.Table[row].farmresidentialaddress1 != undefined
          ? jsonData2017.Table[row].farmresidentialaddress1
          : "",
      farmresidentialaddress2:
        jsonData2017.Table[row].farmresidentialaddress2 != undefined
          ? jsonData2017.Table[row].farmresidentialaddress2
          : "",
      postalcode1:
        jsonData2017.Table[row].postalcode1 != undefined
          ? jsonData2017.Table[row].postalcode1
          : "",
      farmresidentialaddress3:
        jsonData2017.Table[row].farmresidentialaddress3 != undefined
          ? jsonData2017.Table[row].farmresidentialaddress3
          : "",
      section2postaladdress1:
        jsonData2017.Table[row].section2postaladdress1 != undefined
          ? jsonData2017.Table[row].section2postaladdress1
          : "",
      section2postaladdress2:
        jsonData2017.Table[row].section2postaladdress2 != undefined
          ? jsonData2017.Table[row].section2postaladdress2
          : "",
      ua_postalcode2:
        jsonData2017.Table[row].ua_postalcode2 != undefined
          ? jsonData2017.Table[row].ua_postalcode2
          : "",
      section2postaladdress3:
        jsonData2017.Table[row].section2postaladdress3 != undefined
          ? jsonData2017.Table[row].section2postaladdress3
          : "",
      pwds:
        jsonData2017.Table[row].pwds != undefined
          ? jsonData2017.Table[row].pwds
          : "",
      gender:
        jsonData2017.Table[row].gender != undefined
          ? jsonData2017.Table[row].gender
          : "",
      demographicsage:
        jsonData2017.Table[row].demographicsage != undefined
          ? jsonData2017.Table[row].demographicsage
          : "",
      populationgroup:
        jsonData2017.Table[row].populationgroup != undefined
          ? jsonData2017.Table[row].populationgroup
          : "",
      language:
        jsonData2017.Table[row].language != undefined
          ? jsonData2017.Table[row].language
          : "",
      runningfarm:
        jsonData2017.Table[row].runningfarm != undefined
          ? jsonData2017.Table[row].runningfarm
          : "",
      farmregistered:
        jsonData2017.Table[row].farmregistered != undefined
          ? jsonData2017.Table[row].farmregistered
          : "",
      ownershipoffarm:
        jsonData2017.Table[row].ownershipoffarm != undefined
          ? jsonData2017.Table[row].ownershipoffarm
          : "",
      otherspecify2:
        jsonData2017.Table[row].otherspecify2 != undefined
          ? jsonData2017.Table[row].otherspecify2
          : "",
      farmland:
        jsonData2017.Table[row].farmland != undefined
          ? jsonData2017.Table[row].farmland
          : "",
      otherspecify3:
        jsonData2017.Table[row].otherspecify3 != undefined
          ? jsonData2017.Table[row].otherspecify3
          : "",
      redistribution:
        jsonData2017.Table[row].redistribution != undefined
          ? jsonData2017.Table[row].redistribution
          : "",
      otherspecify4:
        jsonData2017.Table[row].otherspecify4 != undefined
          ? jsonData2017.Table[row].otherspecify4
          : "",
      supportprogramme:
        jsonData2017.Table[row].supportprogramme != undefined
          ? jsonData2017.Table[row].supportprogramme
          : "",
      otherspecify5:
        jsonData2017.Table[row].otherspecify5 != undefined
          ? jsonData2017.Table[row].otherspecify5
          : "",
      nameoffarm:
        jsonData2017.Table[row].nameoffarm != undefined
          ? jsonData2017.Table[row].nameoffarm
          : "",
      commonname:
        jsonData2017.Table[row].commonname != undefined
          ? jsonData2017.Table[row].commonname
          : "",
      farmsizetotal:
        jsonData2017.Table[row].farmsizetotal != undefined
          ? jsonData2017.Table[row].farmsizetotal
          : "",
      arable:
        jsonData2017.Table[row].arable != undefined
          ? jsonData2017.Table[row].arable
          : "",
      nonarable:
        jsonData2017.Table[row].nonarable != undefined
          ? jsonData2017.Table[row].nonarable
          : "",
      provincefarm:
        jsonData2017.Table[row].provincefarm != undefined
          ? jsonData2017.Table[row].provincefarm
          : "",
      metrodistrict:
        jsonData2017.Table[row].metrodistrict != undefined
          ? jsonData2017.Table[row].metrodistrict
          : "",
      metropolitanmunicipality:
        jsonData2017.Table[row].metropolitanmunicipality != undefined
          ? jsonData2017.Table[row].metropolitanmunicipality
          : "",
      localmunicipality:
        jsonData2017.Table[row].localmunicipality != undefined
          ? jsonData2017.Table[row].localmunicipality
          : "",
      wardnumber:
        jsonData2017.Table[row].wardnumber != undefined
          ? jsonData2017.Table[row].wardnumber
          : "",
      nearesttown:
        jsonData2017.Table[row].nearesttown != undefined
          ? jsonData2017.Table[row].nearesttown
          : "",
      livestock_3:
        jsonData2017.Table[row].livestock_3 != undefined
          ? jsonData2017.Table[row].livestock_3
          : "",
      livestock_4:
        jsonData2017.Table[row].livestock_4 != undefined
          ? jsonData2017.Table[row].livestock_4
          : "",
      livestock_5:
        jsonData2017.Table[row].livestock_5 != undefined
          ? jsonData2017.Table[row].livestock_5
          : "",
      livestock_1:
        jsonData2017.Table[row].livestock_1 != undefined
          ? jsonData2017.Table[row].livestock_1
          : "",
      livestock_2:
        jsonData2017.Table[row].livestock_2 != undefined
          ? jsonData2017.Table[row].livestock_2
          : "",
      livestockno3:
        jsonData2017.Table[row].livestockno3 != undefined
          ? jsonData2017.Table[row].livestockno3
          : "",
      livestockno4:
        jsonData2017.Table[row].livestockno4 != undefined
          ? jsonData2017.Table[row].livestockno4
          : "",
      livestockno5:
        jsonData2017.Table[row].livestockno5 != undefined
          ? jsonData2017.Table[row].livestockno5
          : "",
      livestockno1:
        jsonData2017.Table[row].livestockno1 != undefined
          ? jsonData2017.Table[row].livestockno1
          : "",
      livestockno2:
        jsonData2017.Table[row].livestockno2 != undefined
          ? jsonData2017.Table[row].livestockno2
          : "",
      otherspecify6:
        jsonData2017.Table[row].otherspecify6 != undefined
          ? jsonData2017.Table[row].otherspecify6
          : "",
      horticulture1:
        jsonData2017.Table[row].horticulture1 != undefined
          ? jsonData2017.Table[row].horticulture1
          : "",
      horticulture2:
        jsonData2017.Table[row].horticulture2 != undefined
          ? jsonData2017.Table[row].horticulture2
          : "",
      horticulture3:
        jsonData2017.Table[row].horticulture3 != undefined
          ? jsonData2017.Table[row].horticulture3
          : "",
      horticulture4:
        jsonData2017.Table[row].horticulture4 != undefined
          ? jsonData2017.Table[row].horticulture4
          : "",
      otherspecify7:
        jsonData2017.Table[row].otherspecify7 != undefined
          ? jsonData2017.Table[row].otherspecify7
          : "",
      fieldcrops2:
        jsonData2017.Table[row].fieldcrops2 != undefined
          ? jsonData2017.Table[row].fieldcrops2
          : "",
      fieldcrops3:
        jsonData2017.Table[row].fieldcrops3 != undefined
          ? jsonData2017.Table[row].fieldcrops3
          : "",
      fieldcrops4:
        jsonData2017.Table[row].fieldcrops4 != undefined
          ? jsonData2017.Table[row].fieldcrops4
          : "",
      fieldcrops1:
        jsonData2017.Table[row].fieldcrops1 != undefined
          ? jsonData2017.Table[row].fieldcrops1
          : "",
      fieldcrops5:
        jsonData2017.Table[row].fieldcrops5 != undefined
          ? jsonData2017.Table[row].fieldcrops5
          : "",
      otherspecify8:
        jsonData2017.Table[row].otherspecify8 != undefined
          ? jsonData2017.Table[row].otherspecify8
          : "",
      forestry1:
        jsonData2017.Table[row].forestry1 != undefined
          ? jsonData2017.Table[row].forestry1
          : "",
      forestry3:
        jsonData2017.Table[row].forestry3 != undefined
          ? jsonData2017.Table[row].forestry3
          : "",
      forestry2:
        jsonData2017.Table[row].forestry2 != undefined
          ? jsonData2017.Table[row].forestry2
          : "",
      forestry4:
        jsonData2017.Table[row].forestry4 != undefined
          ? jsonData2017.Table[row].forestry4
          : "",
      forestry5:
        jsonData2017.Table[row].forestry5 != undefined
          ? jsonData2017.Table[row].forestry5
          : "",
      forestry8:
        jsonData2017.Table[row].forestry8 != undefined
          ? jsonData2017.Table[row].forestry8
          : "",
      forestry6:
        jsonData2017.Table[row].forestry6 != undefined
          ? jsonData2017.Table[row].forestry6
          : "",
      forestry7:
        jsonData2017.Table[row].forestry7 != undefined
          ? jsonData2017.Table[row].forestry7
          : "",
      otherspecify9:
        jsonData2017.Table[row].otherspecify9 != undefined
          ? jsonData2017.Table[row].otherspecify9
          : "",
      aquaculture1:
        jsonData2017.Table[row].aquaculture1 != undefined
          ? jsonData2017.Table[row].aquaculture1
          : "",
      aquaculture2:
        jsonData2017.Table[row].aquaculture2 != undefined
          ? jsonData2017.Table[row].aquaculture2
          : "",
      aquaculture3:
        jsonData2017.Table[row].aquaculture3 != undefined
          ? jsonData2017.Table[row].aquaculture3
          : "",
      aquaculture4:
        jsonData2017.Table[row].aquaculture4 != undefined
          ? jsonData2017.Table[row].aquaculture4
          : "",
      otherspecify10:
        jsonData2017.Table[row].otherspecify10 != undefined
          ? jsonData2017.Table[row].otherspecify10
          : "",
      seafishing4:
        jsonData2017.Table[row].seafishing4 != undefined
          ? jsonData2017.Table[row].seafishing4
          : "",
      seafishing5:
        jsonData2017.Table[row].seafishing5 != undefined
          ? jsonData2017.Table[row].seafishing5
          : "",
      seafishing6:
        jsonData2017.Table[row].seafishing6 != undefined
          ? jsonData2017.Table[row].seafishing6
          : "",
      seafishing1:
        jsonData2017.Table[row].seafishing1 != undefined
          ? jsonData2017.Table[row].seafishing1
          : "",
      seafishing2:
        jsonData2017.Table[row].seafishing2 != undefined
          ? jsonData2017.Table[row].seafishing2
          : "",
      seafishing3:
        jsonData2017.Table[row].seafishing3 != undefined
          ? jsonData2017.Table[row].seafishing3
          : "",
      otherspecify11:
        jsonData2017.Table[row].otherspecify11 != undefined
          ? jsonData2017.Table[row].otherspecify11
          : "",
      gamefarming1:
        jsonData2017.Table[row].gamefarming1 != undefined
          ? jsonData2017.Table[row].gamefarming1
          : "",
      gamefarming3:
        jsonData2017.Table[row].gamefarming3 != undefined
          ? jsonData2017.Table[row].gamefarming3
          : "",
      gamefarming4:
        jsonData2017.Table[row].gamefarming4 != undefined
          ? jsonData2017.Table[row].gamefarming4
          : "",
      gamefarming5:
        jsonData2017.Table[row].gamefarming5 != undefined
          ? jsonData2017.Table[row].gamefarming5
          : "",
      gamefarming2:
        jsonData2017.Table[row].gamefarming2 != undefined
          ? jsonData2017.Table[row].gamefarming2
          : "",
      gamefarming6:
        jsonData2017.Table[row].gamefarming6 != undefined
          ? jsonData2017.Table[row].gamefarming6
          : "",
      otherspecify12:
        jsonData2017.Table[row].otherspecify12 != undefined
          ? jsonData2017.Table[row].otherspecify12
          : "",
      production1:
        jsonData2017.Table[row].production1 != undefined
          ? jsonData2017.Table[row].production1
          : "",
      production2:
        jsonData2017.Table[row].production2 != undefined
          ? jsonData2017.Table[row].production2
          : "",
      production3:
        jsonData2017.Table[row].production3 != undefined
          ? jsonData2017.Table[row].production3
          : "",
      otherspecify13:
        jsonData2017.Table[row].otherspecify13 != undefined
          ? jsonData2017.Table[row].otherspecify13
          : "",
      packaging1:
        jsonData2017.Table[row].packaging1 != undefined
          ? jsonData2017.Table[row].packaging1
          : "",
      packaging2:
        jsonData2017.Table[row].packaging2 != undefined
          ? jsonData2017.Table[row].packaging2
          : "",
      approximate:
        jsonData2017.Table[row].approximate != undefined
          ? jsonData2017.Table[row].approximate
          : "",
      fixedstructures7:
        jsonData2017.Table[row].fixedstructures7 != undefined
          ? jsonData2017.Table[row].fixedstructures7
          : "",
      fixedstructures1:
        jsonData2017.Table[row].fixedstructures1 != undefined
          ? jsonData2017.Table[row].fixedstructures1
          : "",
      fixedstructures2:
        jsonData2017.Table[row].fixedstructures2 != undefined
          ? jsonData2017.Table[row].fixedstructures2
          : "",
      fixedstructures3:
        jsonData2017.Table[row].fixedstructures3 != undefined
          ? jsonData2017.Table[row].fixedstructures3
          : "",
      PigSties:
        jsonData2017.Table[row].PigSties != undefined
          ? jsonData2017.Table[row].PigSties
          : "",
      fixedstructures5:
        jsonData2017.Table[row].fixedstructures5 != undefined
          ? jsonData2017.Table[row].fixedstructures5
          : "",
      fixedstructures6:
        jsonData2017.Table[row].fixedstructures6 != undefined
          ? jsonData2017.Table[row].fixedstructures6
          : "",
      otherspecify14:
        jsonData2017.Table[row].otherspecify14 != undefined
          ? jsonData2017.Table[row].otherspecify14
          : "",
      machinery1:
        jsonData2017.Table[row].machinery1 != undefined
          ? jsonData2017.Table[row].machinery1
          : "",
      machinery2:
        jsonData2017.Table[row].machinery2 != undefined
          ? jsonData2017.Table[row].machinery2
          : "",
      machinery5:
        jsonData2017.Table[row].machinery5 != undefined
          ? jsonData2017.Table[row].machinery5
          : "",
      machinery3:
        jsonData2017.Table[row].machinery3 != undefined
          ? jsonData2017.Table[row].machinery3
          : "",
      machinery4:
        jsonData2017.Table[row].machinery4 != undefined
          ? jsonData2017.Table[row].machinery4
          : "",
      otherspecify15:
        jsonData2017.Table[row].otherspecify15 != undefined
          ? jsonData2017.Table[row].otherspecify15
          : "",
      irrigationsystems5:
        jsonData2017.Table[row].irrigationsystems5 != undefined
          ? jsonData2017.Table[row].irrigationsystems5
          : "",
      irrigationsystems2:
        jsonData2017.Table[row].irrigationsystems2 != undefined
          ? jsonData2017.Table[row].irrigationsystems2
          : "",
      irrigationsystems3:
        jsonData2017.Table[row].irrigationsystems3 != undefined
          ? jsonData2017.Table[row].irrigationsystems3
          : "",
      irrigationsystems4:
        jsonData2017.Table[row].irrigationsystems4 != undefined
          ? jsonData2017.Table[row].irrigationsystems4
          : "",
      irrigationsystems6:
        jsonData2017.Table[row].irrigationsystems6 != undefined
          ? jsonData2017.Table[row].irrigationsystems6
          : "",
      irrigationsystems1:
        jsonData2017.Table[row].irrigationsystems1 != undefined
          ? jsonData2017.Table[row].irrigationsystems1
          : "",
      otherspecify16:
        jsonData2017.Table[row].otherspecify16 != undefined
          ? jsonData2017.Table[row].otherspecify16
          : "",
      waterinfrastructure4:
        jsonData2017.Table[row].waterinfrastructure4 != undefined
          ? jsonData2017.Table[row].waterinfrastructure4
          : "",
      waterinfrastructure1:
        jsonData2017.Table[row].waterinfrastructure1 != undefined
          ? jsonData2017.Table[row].waterinfrastructure1
          : "",
      BoreholesWindmills:
        jsonData2017.Table[row].BoreholesWindmills != undefined
          ? jsonData2017.Table[row].BoreholesWindmills
          : "",
      waterinfrastructure3:
        jsonData2017.Table[row].waterinfrastructure3 != undefined
          ? jsonData2017.Table[row].waterinfrastructure3
          : "",
      waterinfrastructure5:
        jsonData2017.Table[row].waterinfrastructure5 != undefined
          ? jsonData2017.Table[row].waterinfrastructure5
          : "",
      otherspecify17:
        jsonData2017.Table[row].otherspecify17 != undefined
          ? jsonData2017.Table[row].otherspecify17
          : "",
      ua_implements5:
        jsonData2017.Table[row].ua_implements5 != undefined
          ? jsonData2017.Table[row].ua_implements5
          : "",
      ua_implements3:
        jsonData2017.Table[row].ua_implements3 != undefined
          ? jsonData2017.Table[row].ua_implements3
          : "",
      ua_implements4:
        jsonData2017.Table[row].ua_implements4 != undefined
          ? jsonData2017.Table[row].ua_implements4
          : "",
      implements6:
        jsonData2017.Table[row].implements6 != undefined
          ? jsonData2017.Table[row].implements6
          : "",
      ua_implements1:
        jsonData2017.Table[row].ua_implements1 != undefined
          ? jsonData2017.Table[row].ua_implements1
          : "",
      ua_implements2:
        jsonData2017.Table[row].ua_implements2 != undefined
          ? jsonData2017.Table[row].ua_implements2
          : "",
      otherspecify18:
        jsonData2017.Table[row].otherspecify18 != undefined
          ? jsonData2017.Table[row].otherspecify18
          : "",
      section4other1:
        jsonData2017.Table[row].section4other1 != undefined
          ? jsonData2017.Table[row].section4other1
          : "",
      section4other2:
        jsonData2017.Table[row].section4other2 != undefined
          ? jsonData2017.Table[row].section4other2
          : "",
      section4other3:
        jsonData2017.Table[row].section4other3 != undefined
          ? jsonData2017.Table[row].section4other3
          : "",
      section4other4:
        jsonData2017.Table[row].section4other4 != undefined
          ? jsonData2017.Table[row].section4other4
          : "",
      otherspecify19:
        jsonData2017.Table[row].otherspecify19 != undefined
          ? jsonData2017.Table[row].otherspecify19
          : "",
      diptank:
        jsonData2017.Table[row].diptank != undefined
          ? jsonData2017.Table[row].diptank
          : "",
      diptankifyes:
        jsonData2017.Table[row].diptankifyes != undefined
          ? jsonData2017.Table[row].diptankifyes
          : "",
      whichdoyouuse:
        jsonData2017.Table[row].whichdoyouuse != undefined
          ? jsonData2017.Table[row].whichdoyouuse
          : "",
      veterinaryservices:
        jsonData2017.Table[row].veterinaryservices != undefined
          ? jsonData2017.Table[row].veterinaryservices
          : "",
      comments:
        jsonData2017.Table[row].comments != undefined
          ? jsonData2017.Table[row].comments
          : "",
      personname:
        jsonData2017.Table[row].personname != undefined
          ? jsonData2017.Table[row].personname
          : "",
      positiontitle:
        jsonData2017.Table[row].positiontitle != undefined
          ? jsonData2017.Table[row].positiontitle
          : "",
      personpostaladdress_1:
        jsonData2017.Table[row].personpostaladdress_1 != undefined
          ? jsonData2017.Table[row].personpostaladdress_1
          : "",
      personpostaladdress_2:
        jsonData2017.Table[row].personpostaladdress_2 != undefined
          ? jsonData2017.Table[row].personpostaladdress_2
          : "",
      postaladdress_3:
        jsonData2017.Table[row].postaladdress_3 != undefined
          ? jsonData2017.Table[row].postaladdress_3
          : "",
      postalcode3:
        jsonData2017.Table[row].postalcode3 != undefined
          ? jsonData2017.Table[row].postalcode3
          : "",
      physicaladdress1:
        jsonData2017.Table[row].physicaladdress1 != undefined
          ? jsonData2017.Table[row].physicaladdress1
          : "",
      physicaladdress2:
        jsonData2017.Table[row].physicaladdress2 != undefined
          ? jsonData2017.Table[row].physicaladdress2
          : "",
      ua_physicaladdress3:
        jsonData2017.Table[row].ua_physicaladdress3 != undefined
          ? jsonData2017.Table[row].ua_physicaladdress3
          : "",
      postalcode4:
        jsonData2017.Table[row].postalcode4 != undefined
          ? jsonData2017.Table[row].postalcode4
          : "",
      Telephone1:
        jsonData2017.Table[row].Telephone1 != undefined
          ? jsonData2017.Table[row].Telephone1
          : "",
      mobilephone:
        jsonData2017.Table[row].mobilephone != undefined
          ? jsonData2017.Table[row].mobilephone
          : "",
      fax1:
        jsonData2017.Table[row].fax1 != undefined
          ? jsonData2017.Table[row].fax1
          : "",
      emailadress2:
        jsonData2017.Table[row].emailadress2 != undefined
          ? jsonData2017.Table[row].emailadress2
          : "",
      preferredcom:
        jsonData2017.Table[row].preferredcom != undefined
          ? jsonData2017.Table[row].preferredcom
          : "",
      farmername:
        jsonData2017.Table[row].farmername != undefined
          ? jsonData2017.Table[row].farmername
          : "",
      surname2:
        jsonData2017.Table[row].surname2 != undefined
          ? jsonData2017.Table[row].surname2
          : "",
      farmerdate:
        jsonData2017.Table[row].farmerdate != undefined
          ? jsonData2017.Table[row].farmerdate
          : "",
      signature:
        jsonData2017.Table[row].signature != undefined
          ? jsonData2017.Table[row].signature
          : "",
      extensionofficername:
        jsonData2017.Table[row].extensionofficername != undefined
          ? jsonData2017.Table[row].extensionofficername
          : "",
      surname3:
        jsonData2017.Table[row].surname3 != undefined
          ? jsonData2017.Table[row].surname3
          : "",
      mobilephone2:
        jsonData2017.Table[row].mobilephone2 != undefined
          ? jsonData2017.Table[row].mobilephone2
          : "",
      telephone2:
        jsonData2017.Table[row].telephone2 != undefined
          ? jsonData2017.Table[row].telephone2
          : "",
      emailaddress3:
        jsonData2017.Table[row].emailaddress3 != undefined
          ? jsonData2017.Table[row].emailaddress3
          : "",
      extensionofficerdate:
        jsonData2017.Table[row].extensionofficerdate != undefined
          ? jsonData2017.Table[row].extensionofficerdate
          : "",
      ExtensionSignature:
        jsonData2017.Table[row].ExtensionSignature != undefined
          ? jsonData2017.Table[row].ExtensionSignature
          : "",
    };

    var newObj = new FarmerDetailDump(farmerRegObj);

    newObj.save(async function (err, farmer) {
      if (err) {
        console.log("errors farmer Reg", err);
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Some thing is wrong.",
          error: err.errors,
        });
      }
      //var result = JSON.parse(JSON.stringify(newObj));

      // console.log(
      //   "Result Farmer _Id : ",
      //   JSON.parse(JSON.stringify(newObj))._id
      // );
    });
  } //for loop ends

  console.log("FOR LOOPS ends ... !!!");
});

//////functions///////

function getFarmerType(type) {
  if (type == "COMMERCIAL") {
    return "Commercial";
  } else if (type == "SMALLHOLDER") {
    return "Smallholder";
  } else if (type == "SUBSISTENCE") {
    return "Subsistence";
  }
  return "Subsistence";
}
function getGender(type) {
  if (type == "MALE") {
    return "Male";
  } else if (type == "FEMALE") {
    return "Female";
  }
  return "Male";
}
function getAgeGroups(type) {
  if (type == "60 PLUS") {
    return "5e3815605426832b10cb9131";
  } else if (type == "19 35") {
    return "5e3815485426832b10cb912f";
  } else if (type == "36 59") {
    return "5e3815555426832b10cb9130";
  } else if (type == "18 TO 35 YEARS") {
    return "5e3815485426832b10cb912f";
  } else if (type == "35 TO 60 YEARS") {
    return "5e3815555426832b10cb9130";
  } else if (type == "OVER 60 YEARS") {
    return "5e3815605426832b10cb9131";
  } else if (type == "UNDER 18 YEARS") {
    return "5e3815405426832b10cb912e";
  }
  return "5e3815555426832b10cb9130";
}
function getAgeGroupsObj(type) {
  let ageObj = {
    _id: "5e3815555426832b10cb9130",
    cndName: "36-60 Years",
  };
  if (type == "60 PLUS") {
    ageObj = {
      _id: "5e3815605426832b10cb9131",
      cndName: "> 60 Years",
    };
  } else if (type == "19 35") {
    ageObj = {
      _id: "5e3815485426832b10cb912f",
      cndName: "18-35 Years",
    };
  } else if (type == "36 59") {
    ageObj = {
      _id: "5e3815555426832b10cb9130",
      cndName: "36-60 Years",
    };
  } else if (type == "18 TO 35 YEARS") {
    ageObj = {
      _id: "5e3815485426832b10cb912f",
      cndName: "18-35 Years",
    };
  } else if (type == "35 TO 60 YEARS") {
    ageObj = {
      _id: "5e3815555426832b10cb9130",
      cndName: "36-60 Years",
    };
  } else if (type == "OVER 60 YEARS") {
    ageObj = {
      _id: "5e3815605426832b10cb9131",
      cndName: "> 60 Years",
    };
  } else if (type == "UNDER 18 YEARS") {
    ageObj = {
      _id: "5e3815405426832b10cb912e",
      cndName: "< 18 years",
    };
  }
  return ageObj;
}
function getPopulationGroup(type) {
  if (type == "BLACK AFRICAN") {
    return "5e3812725426832b10cb912a";
  } else if (type == "COLOURED") {
    return "5e3812805426832b10cb912b";
  } else if (type == "INDIAN ASIAN") {
    return "5e38128b5426832b10cb912c";
  } else if (type == "WHITE") {
    return "5e38151c5426832b10cb912d";
  } else if (type == "AFRICAN") {
    return "5e3812725426832b10cb912a";
  } else if (type == "INDIAN") {
    return "5e38128b5426832b10cb912c";
  } else if (type == "OTHER") {
    return "5e38151c5426832b10cb912d";
  }
  return "5e3812725426832b10cb912a";
}
function getPopulationGroupObj(type) {
  let popObj = {
    _id: "5e3812725426832b10cb912a",
    cndName: "African",
  };
  if (type == "BLACK AFRICAN") {
    popObj = {
      _id: "5e3812725426832b10cb912a",
      cndName: "African",
    };
  } else if (type == "COLOURED") {
    popObj = {
      _id: "5e3812805426832b10cb912b",
      cndName: "Coloured",
    };
  } else if (type == "INDIAN ASIAN") {
    popObj = {
      _id: "5e38128b5426832b10cb912c",
      cndName: "Indian",
    };
  } else if (type == "WHITE") {
    popObj = {
      _id: "5e38151c5426832b10cb912d",
      cndName: "Other",
    };
  } else if (type == "AFRICAN") {
    popObj = {
      _id: "5e3812725426832b10cb912a",
      cndName: "African",
    };
  } else if (type == "INDIAN") {
    popObj = {
      _id: "5e38128b5426832b10cb912c",
      cndName: "Indian",
    };
  } else if (type == "OTHER") {
    popObj = {
      _id: "5e38151c5426832b10cb912d",
      cndName: "Other",
    };
  }
  return popObj;
}
function getLanguage(type) {
  if (type == "AFRIKAANS") {
    return "5e3815955426832b10cb9132";
  } else if (type == "ENGLISH") {
    return "5e38159d5426832b10cb9133";
  } else if (type == "ISINDEBELE") {
    return "5e3815a75426832b10cb9134";
  } else if (type == "ISISWATI") {
    return "5e3815d55426832b10cb9138";
  } else if (type == "ISIXHOSA") {
    return "5e3815f45426832b10cb913b";
  } else if (type == "ISIZULU") {
    return "5e3815fe5426832b10cb913c";
  } else if (type == "SEPEDI") {
    return "5e3815b95426832b10cb9135";
  } else if (type == "SESOTHO") {
    return "5e3815cb5426832b10cb9137";
  } else if (type == "SETSWANA") {
    return "5e3815c35426832b10cb9136";
  } else if (type == "TSHIVENDA") {
    return "5e3815e05426832b10cb9139";
  } else if (type == "XITSONGA") {
    return "5e3815eb5426832b10cb913a";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e565087a007090044e72633";
  }
  return "5e565087a007090044e72633";
}
function getLanguageObj(type) {
  let lanObj = {
    _id: "5e565087a007090044e72633",
    cndName: "Other",
  };
  if (type == "AFRIKAANS") {
    lanObj = {
      _id: "5e3815955426832b10cb9132",
      cndName: "Afrikaans",
    };
  } else if (type == "ENGLISH") {
    lanObj = {
      _id: "5e38159d5426832b10cb9133",
      cndName: "English",
    };
  } else if (type == "ISINDEBELE") {
    lanObj = {
      _id: "5e3815a75426832b10cb9134",
      cndName: "IsiNdebele",
    };
  } else if (type == "ISISWATI") {
    lanObj = {
      _id: "5e3815d55426832b10cb9138",
      cndName: "SiSwati",
    };
  } else if (type == "ISIXHOSA") {
    lanObj = {
      _id: "5e3815f45426832b10cb913b",
      cndName: "IsiXhosa",
    };
  } else if (type == "ISIZULU") {
    lanObj = {
      _id: "5e3815fe5426832b10cb913c",
      cndName: "IsiZulu",
    };
  } else if (type == "SEPEDI") {
    lanObj = {
      _id: "5e3815b95426832b10cb9135",
      cndName: "Sepedi",
    };
  } else if (type == "SESOTHO") {
    lanObj = {
      _id: "5e3815cb5426832b10cb9137",
      cndName: "Sesotho",
    };
  } else if (type == "SETSWANA") {
    lanObj = {
      _id: "5e3815c35426832b10cb9136",
      cndName: "Setswana",
    };
  } else if (type == "TSHIVENDA") {
    lanObj = {
      _id: "5e3815e05426832b10cb9139",
      cndName: "Tshivenda",
    };
  } else if (type == "XITSONGA") {
    lanObj = {
      _id: "5e3815eb5426832b10cb913a",
      cndName: "Xitsonga",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    lanObj = {
      _id: "5e565087a007090044e72633",
      cndName: "Other",
    };
  }
  return lanObj;
}
function getLanguage2020(
  Afrikaans,
  English,
  IsiNdebele,
  Sepedi,
  Setswana,
  Sesotho,
  SiSwati,
  Tshivenda,
  Xitsonga,
  IsiXhosa,
  IsiZulu
) {
  if (Afrikaans != undefined && Afrikaans == "1")
    return "5e3815955426832b10cb9132";
  else if (English != undefined && English == "1")
    return "5e38159d5426832b10cb9133";
  else if (IsiNdebele != undefined && IsiNdebele == "1")
    return "5e3815a75426832b10cb9134";
  else if (Sepedi != undefined && Sepedi == "1")
    return "5e3815b95426832b10cb9135";
  else if (Setswana != undefined && Setswana == "1")
    return "5e3815c35426832b10cb9136";
  else if (Sesotho != undefined && Sesotho == "1")
    return "5e3815cb5426832b10cb9137";
  else if (SiSwati != undefined && SiSwati == "1")
    return "5e3815d55426832b10cb9138";
  else if (Tshivenda != undefined && Tshivenda == "1")
    return "5e3815e05426832b10cb9139";
  else if (Xitsonga != undefined && Xitsonga == "1")
    return "5e3815eb5426832b10cb913a";
  else if (IsiXhosa != undefined && IsiXhosa == "1")
    return "5e3815f45426832b10cb913b";
  else if (IsiZulu != undefined && IsiZulu == "1")
    return "5e3815fe5426832b10cb913c";
  else return "5e565087a007090044e72633";
}
function getLanguage2020Obj(
  Afrikaans,
  English,
  IsiNdebele,
  Sepedi,
  Setswana,
  Sesotho,
  SiSwati,
  Tshivenda,
  Xitsonga,
  IsiXhosa,
  IsiZulu
) {
  let lanObj2 = {
    _id: "5e565087a007090044e72633",
    cndName: "Other",
  };

  if (Afrikaans != undefined && Afrikaans == "1")
    lanObj2 = {
      _id: "5e3815955426832b10cb9132",
      cndName: "Afrikaans",
    };
  else if (English != undefined && English == "1")
    lanObj2 = {
      _id: "5e38159d5426832b10cb9133",
      cndName: "English",
    };
  else if (IsiNdebele != undefined && IsiNdebele == "1")
    lanObj2 = {
      _id: "5e3815a75426832b10cb9134",
      cndName: "IsiNdebele",
    };
  else if (Sepedi != undefined && Sepedi == "1")
    lanObj2 = {
      _id: "5e3815b95426832b10cb9135",
      cndName: "Sepedi",
    };
  else if (Setswana != undefined && Setswana == "1")
    lanObj2 = {
      _id: "5e3815c35426832b10cb9136",
      cndName: "Setswana",
    };
  else if (Sesotho != undefined && Sesotho == "1")
    lanObj2 = {
      _id: "5e3815cb5426832b10cb9137",
      cndName: "Sesotho",
    };
  else if (SiSwati != undefined && SiSwati == "1")
    lanObj2 = {
      _id: "5e3815d55426832b10cb9138",
      cndName: "SiSwati",
    };
  else if (Tshivenda != undefined && Tshivenda == "1")
    lanObj2 = {
      _id: "5e3815e05426832b10cb9139",
      cndName: "Tshivenda",
    };
  else if (Xitsonga != undefined && Xitsonga == "1")
    lanObj2 = {
      _id: "5e3815eb5426832b10cb913a",
      cndName: "Xitsonga",
    };
  else if (IsiXhosa != undefined && IsiXhosa == "1")
    lanObj2 = {
      _id: "5e3815f45426832b10cb913b",
      cndName: "IsiXhosa",
    };
  else if (IsiZulu != undefined && IsiZulu == "1")
    lanObj2 = {
      _id: "5e3815fe5426832b10cb913c",
      cndName: "IsiZulu",
    };
  return lanObj2;
}
function getBusinessEntityType(
  SoleProprietor,
  Partnerships,
  CloseCorporation,
  PrivateCompany,
  PublicCompany,
  CoOperatives,
  Trusts,
  NotRegistered
) {
  if (SoleProprietor != undefined && SoleProprietor == "1")
    return "5e381b6f5426832b10cb9159";
  else if (Partnerships != undefined && Partnerships == "1")
    return "5e381b775426832b10cb915a";
  else if (CloseCorporation != undefined && CloseCorporation == "1")
    return "5e381b825426832b10cb915b";
  else if (PrivateCompany != undefined && PrivateCompany == "1")
    return "5e381b8c5426832b10cb915c";
  else if (PublicCompany != undefined && PublicCompany == "1")
    return "5e381b965426832b10cb915d";
  else if (CoOperatives != undefined && CoOperatives == "1")
    return "5e381ba05426832b10cb915e";
  else if (Trusts != undefined && Trusts == "1")
    return "5e381baa5426832b10cb915f";
  else if (NotRegistered != undefined && NotRegistered == "1")
    return "5e381bb75426832b10cb9160";
  else return "5e381bb75426832b10cb9160";
}
function getBusinessEntityTypeObj(
  SoleProprietor,
  Partnerships,
  CloseCorporation,
  PrivateCompany,
  PublicCompany,
  CoOperatives,
  Trusts,
  NotRegistered
) {
  let busObj = {
    _id: "5e381bb75426832b10cb9160",
    cndName: "Not Registered",
  };
  if (SoleProprietor != undefined && SoleProprietor == "1")
    busObj = {
      _id: "5e381b6f5426832b10cb9159",
      cndName: "Sole Proprietor",
    };
  else if (Partnerships != undefined && Partnerships == "1")
    busObj = {
      _id: "5e381b775426832b10cb915a",
      cndName: "Partnerships",
    };
  else if (CloseCorporation != undefined && CloseCorporation == "1")
    busObj = {
      _id: "5e381b825426832b10cb915b",
      cndName: "Close Corporation",
    };
  else if (PrivateCompany != undefined && PrivateCompany == "1")
    busObj = {
      _id: "5e381b8c5426832b10cb915c",
      cndName: "Private Company",
    };
  else if (PublicCompany != undefined && PublicCompany == "1")
    busObj = {
      _id: "5e381b965426832b10cb915d",
      cndName: "Public Company",
    };
  else if (CoOperatives != undefined && CoOperatives == "1")
    busObj = {
      _id: "5e381ba05426832b10cb915e",
      cndName: "Co-operatives",
    };
  else if (Trusts != undefined && Trusts == "1")
    busObj = {
      _id: "5e381baa5426832b10cb915f",
      cndName: "Trusts",
    };
  else if (NotRegistered != undefined && NotRegistered == "1")
    busObj = {
      _id: "5e381bb75426832b10cb9160",
      cndName: "Not Registered",
    };
  return busObj;
}
function getEduction(type) {
  if (type == "NONE") {
    return "5e3816425426832b10cb913e";
  } else if (type == "HIGH SCHOOL") {
    return "5e38165b5426832b10cb9140";
  } else if (type == "DIPLOMA OR DEGREE") {
    return "5e3816705426832b10cb9142";
  } else if (type == "PRIMARY SCHOOL") {
    return "5e3816515426832b10cb913f";
  } else if (type == "POSTGRADUATE") {
    return "5e38167b5426832b10cb9143";
  } else if (type == "CERTIFICATE") {
    return "5e3816655426832b10cb9141";
  }
  return "5e3816425426832b10cb913e";
}
function getEductionObj(type) {
  let eduObj = {
    _id: "5e3816425426832b10cb913e",
    cndName: "None",
  };
  if (type == "NONE") {
    eduObj = {
      _id: "5e3816425426832b10cb913e",
      cndName: "None",
    };
  } else if (type == "HIGH SCHOOL") {
    eduObj = {
      _id: "5e38165b5426832b10cb9140",
      cndName: "High School (Grade 8-12)",
    };
  } else if (type == "DIPLOMA OR DEGREE") {
    eduObj = {
      _id: "5e3816705426832b10cb9142",
      cndName: "Diploma/ Degree",
    };
  } else if (type == "PRIMARY SCHOOL") {
    eduObj = {
      _id: "5e3816515426832b10cb913f",
      cndName: "Primary School (Grade 1-7)",
    };
  } else if (type == "POSTGRADUATE") {
    eduObj = {
      _id: "5e38167b5426832b10cb9143",
      cndName: "Postgraduate",
    };
  } else if (type == "CERTIFICATE") {
    eduObj = {
      _id: "5e3816655426832b10cb9141",
      cndName: "Certificate",
    };
  }
  return eduObj;
}
function getOperationType(type) {
  if (type == "FULL TIME") {
    return "Full-time";
  } else if (type == "PART TIME") {
    return "Part-time";
  }
  return "Part-time";
}
function getOwnershipType(type) {
  if (type == "A COMMUNITY") {
    return "5e3d5e4e9388e60044056538";
  } else if (type == "COMMUNITY") {
    return "5e3d5e4e9388e60044056538";
  } else if (type == "A FAMILY") {
    return "5e3d5e109388e60044056535";
  } else if (type == "AN INDIVIDUAL") {
    return "5e3d5e109388e60044056535";
  } else if (type == "PRIVATE") {
    return "5e3d5e109388e60044056535";
  } else if (type == "GOVERNMENT") {
    return "5e3d5e3a9388e60044056537";
  } else if (type == "GOVERMENT") {
    return "5e3d5e3a9388e60044056537";
  } else if (type == "COMPANY") {
    return "5e3d5e2d9388e60044056536";
  } else if (type == "OTHER") {
    return "5e3d5e5e9388e60044056539";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e3d5e109388e60044056535";
  }
  return "5e3d5e109388e60044056535";
}
function getOwnershipTypeObj(type) {
  let ownObj = {
    _id: "5e3d5e109388e60044056535",
    cndName: "Private",
  };
  if (type == "A COMMUNITY") {
    ownObj = {
      _id: "5e3d5e4e9388e60044056538",
      cndName: "A Community (Communal Land/Tribal Authority) ",
    };
  } else if (type == "COMMUNITY") {
    ownObj = {
      _id: "5e3d5e4e9388e60044056538",
      cndName: "A Community (Communal Land/Tribal Authority) ",
    };
  } else if (type == "A FAMILY") {
    ownObj = {
      _id: "5e3d5e109388e60044056535",
      cndName: "Private",
    };
  } else if (type == "AN INDIVIDUAL") {
    ownObj = {
      _id: "5e3d5e109388e60044056535",
      cndName: "Private",
    };
  } else if (type == "PRIVATE") {
    ownObj = {
      _id: "5e3d5e109388e60044056535",
      cndName: "Private",
    };
  } else if (type == "GOVERNMENT") {
    ownObj = {
      _id: "5e3d5e3a9388e60044056537",
      cndName: "Government",
    };
  } else if (type == "GOVERMENT") {
    ownObj = {
      _id: "5e3d5e3a9388e60044056537",
      cndName: "Government",
    };
  } else if (type == "COMPANY") {
    ownObj = {
      _id: "5e3d5e2d9388e60044056536",
      cndName: "Company",
    };
  } else if (type == "OTHER") {
    ownObj = {
      _id: "5e3d5e5e9388e60044056539",
      cndName: "Other",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    ownObj = {
      _id: "5e3d5e109388e60044056535",
      cndName: "Private",
    };
  }
  return ownObj;
}
function getLandAquisition(type) {
  if (type == "HIRED") {
    return "5e3817085426832b10cb9148";
  } else if (type == "HIRE TO LEASE") {
    return "5e3817085426832b10cb9148";
  } else if (type == "LEASE") {
    return "5e3817125426832b10cb9149";
  } else if (type == "INHERITED") {
    return "5e38171a5426832b10cb914a";
  } else if (type == "PERMISSIONTOOCCUPY") {
    return "5e3817245426832b10cb914b";
  } else if (type == "PERMISSION TO OCCUPY") {
    return "5e3817245426832b10cb914b";
  } else if (type == "REDISTRIBUTION") {
    return "5e3816f25426832b10cb9146";
  } else if (type == "RESTITUTION") {
    return "5e3816e85426832b10cb9145";
  } else if (type == "SELF BOUGHT") {
    return "5e3816fc5426832b10cb9147";
  } else if (type == "A FAMILY") {
    return "5e3816fc5426832b10cb9147";
  } else if (type == "TENURE") {
    return "5e3816da5426832b10cb9144";
  } else if (type == "TENURE REFORM") {
    return "5e3816da5426832b10cb9144";
  } else if (type == "OTHER") {
    return "5e565298a007090044e72634";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e565298a007090044e72634";
  }
  return "5e565298a007090044e72634";
}
function getLandAquisitionObj(type) {
  let landObj = {
    _id: "5e565298a007090044e72634",
    cndName: "Other",
  };
  if (type == "HIRED") {
    landObj = {
      _id: "5e3817085426832b10cb9148",
      cndName: "Hire To Lease",
    };
  } else if (type == "HIRE TO LEASE") {
    landObj = {
      _id: "5e3817085426832b10cb9148",
      cndName: "Hire To Lease",
    };
  } else if (type == "LEASE") {
    landObj = {
      _id: "5e3817125426832b10cb9149",
      cndName: "Lease",
    };
  } else if (type == "INHERITED") {
    landObj = {
      _id: "5e38171a5426832b10cb914a",
      cndName: "Inherited",
    };
  } else if (type == "PERMISSIONTOOCCUPY") {
    landObj = {
      _id: "5e3817245426832b10cb914b",
      cndName: "Permission to Occupy",
    };
  } else if (type == "PERMISSION TO OCCUPY") {
    landObj = {
      _id: "5e3817245426832b10cb914b",
      cndName: "Permission to Occupy",
    };
  } else if (type == "REDISTRIBUTION") {
    landObj = {
      _id: "5e3816f25426832b10cb9146",
      cndName: "Redistribution",
    };
  } else if (type == "RESTITUTION") {
    landObj = {
      _id: "5e3816e85426832b10cb9145",
      cndName: "Restitution",
    };
  } else if (type == "SELF BOUGHT") {
    landObj = {
      _id: "5e565298a007090044e72634",
      cndName: "Other",
    };
  } else if (type == "A FAMILY") {
    landObj = {
      _id: "5e3816fc5426832b10cb9147",
      cndName: "A Family",
    };
  } else if (type == "TENURE") {
    landObj = {
      _id: "5e3816da5426832b10cb9144",
      cndName: "Tenure Reform",
    };
  } else if (type == "TENURE REFORM") {
    landObj = {
      _id: "5e3816da5426832b10cb9144",
      cndName: "Tenure Reform",
    };
  } else if (type == "OTHER") {
    landObj = {
      _id: "5e565298a007090044e72634",
      cndName: "Other",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    landObj = {
      _id: "5e565298a007090044e72634",
      cndName: "Other",
    };
  }
  return landObj;
}
function getRedistribution(type) {
  if (type == "COMMONAGE") {
    return "5e3817775426832b10cb9151";
  } else if (type == "LRAD") {
    return "5e38176c5426832b10cb9150";
  } else if (type == "PLAS") {
    return "5e38175b5426832b10cb914e";
  } else if (type == "SLAG") {
    return "5e3817645426832b10cb914f";
  } else if (type == "OTHER") {
    return "5e5652f3a007090044e72635";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e5652f3a007090044e72635";
  }
  return "5e5652f3a007090044e72635";
}
function getRedistributionObj(type) {
  let redObj = {
    _id: "5e5652f3a007090044e72635",
    cndName: "Other",
  };
  if (type == "COMMONAGE") {
    redObj = {
      _id: "5e3817775426832b10cb9151",
      cndName: "Commonage",
    };
  } else if (type == "LRAD") {
    redObj = {
      _id: "5e38176c5426832b10cb9150",
      cndName: "LRAD",
    };
  } else if (type == "PLAS") {
    redObj = {
      _id: "5e38175b5426832b10cb914e",
      cndName: "PLAS",
    };
  } else if (type == "SLAG") {
    redObj = {
      _id: "5e3817645426832b10cb914f",
      cndName: "SLAG",
    };
  } else if (type == "OTHER") {
    redObj = {
      _id: "5e5652f3a007090044e72635",
      cndName: "Other",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    redObj = {
      _id: "5e5652f3a007090044e72635",
      cndName: "Other",
    };
  }
  return redObj;
}
function getProvince(type) {
  if (type == "WESTERN CAPE") {
    return "5e381a5b5426832b10cb9158";
  } else if (type == "NORTH WEST") {
    return "5e381a515426832b10cb9157";
  } else if (type == "NORTHERN CAPE") {
    return "5e381a475426832b10cb9156";
  } else if (type == "LIMPOPO") {
    return "5e381a3c5426832b10cb9155";
  } else if (type == "GAUTENG") {
    return "5e381a315426832b10cb9154";
  } else if (type == "FREE STATE") {
    return "5e381a275426832b10cb9153";
  } else if (type == "EASTERN CAPE") {
    return "5e381a1b5426832b10cb9152";
  } else if (type == "MPUMALANGA") {
    return "5e380d495426832b10cb9127";
  } else if (type == "KWAZULU-NATAL") {
    return "5e37e9421360d5574847f18e";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e380d495426832b10cb9127";
  }

  return "5e380d495426832b10cb9127";
}
function getProvinceObj(type) {
  let proObj = {
    _id: "5e380d495426832b10cb9127",
    cndName: "Mpumalanga",
  };
  if (type == "WESTERN CAPE") {
    proObj = {
      _id: "5e381a5b5426832b10cb9158",
      cndName: "Western Cape",
    };
  } else if (type == "NORTH WEST") {
    proObj = {
      _id: "5e381a515426832b10cb9157",
      cndName: "North West",
    };
  } else if (type == "NORTHERN CAPE") {
    proObj = {
      _id: "5e381a475426832b10cb9156",
      cndName: "Northern Cape",
    };
  } else if (type == "LIMPOPO") {
    proObj = {
      _id: "5e381a3c5426832b10cb9155",
      cndName: "Limpopo",
    };
  } else if (type == "GAUTENG") {
    proObj = {
      _id: "5e381a315426832b10cb9154",
      cndName: "Gauteng",
    };
  } else if (type == "FREE STATE") {
    proObj = {
      _id: "5e381a275426832b10cb9153",
      cndName: "Free State",
    };
  } else if (type == "EASTERN CAPE") {
    proObj = {
      _id: "5e381a1b5426832b10cb9152",
      cndName: "Eastern Cape",
    };
  } else if (type == "MPUMALANGA") {
    proObj = {
      _id: "5e380d495426832b10cb9127",
      cndName: "Mpumalanga",
    };
  } else if (type == "KWAZULU-NATAL") {
    proObj = {
      _id: "5e37e9421360d5574847f18e",
      cndName: "KwaZulu-Natal",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    proObj = {
      _id: "5e380d495426832b10cb9127",
      cndName: "Mpumalanga",
    };
  }
  return proObj;
}
function getTurnOver(type) {
  if (type == "R500 000 TO LESS THAN R3 MILLI") {
    return "60265bc4408b570039086ee0";
  } else if (type == "R5 MILLION OR MORE") {
    return "60265b86408b570039086edf";
  } else if (type == "R3 MILLION TO LESS THAN R5 MIL") {
    return "602659b3408b570039086ede";
  } else if (type == "R200 000 TO LESS THAN R500 000") {
    return "6026595f408b570039086edd";
  } else if (type == "R100 000 TO LESS THAN R200 000") {
    return "6026592f408b570039086edc";
  } else if (type == "LESS THAN R100 000") {
    return "602658fa408b570039086edb";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "602658fa408b570039086edb";
  } else if (type == "HOUSEHOLD SUBSISTENCE") {
    return "5e4cc0f924949c00442307c8";
  } else if (type == "HOUSEHOLD VULNERABLE") {
    return "5e4cc0c924949c00442307c7";
  } else if (type == "LARGE SCALE") {
    return "5e4cc17124949c00442307cb";
  } else if (type == "MEDIUM SCALE ") {
    return "5e4cc15724949c00442307ca";
  } else if (type == "MEGA") {
    return "5e4cc18e24949c00442307cc";
  } else if (type == "SMALLHOLDER ") {
    return "5e4cc12824949c00442307c9";
  }
  return "602658fa408b570039086edb";
}
function getTurnOverObj(type) {
  let turnObj = {
    _id: "602658fa408b570039086edb",
    cndName: "Less than R100 000",
  };
  if (type == "R500 000 TO LESS THAN R3 MILLI") {
    turnObj = {
      _id: "60265bc4408b570039086ee0",
      cndName: "R500 000 to less than R3 million",
    };
  } else if (type == "R5 MILLION OR MORE") {
    turnObj = {
      _id: "60265b86408b570039086edf",
      cndName: "R5 million or more",
    };
  } else if (type == "R3 MILLION TO LESS THAN R5 MIL") {
    turnObj = {
      _id: "602659b3408b570039086ede",
      cndName: "R3 million to less than R5 million",
    };
  } else if (type == "R200 000 TO LESS THAN R500 000") {
    turnObj = {
      _id: "6026595f408b570039086edd",
      cndName: "R200 000 to less than R500 000",
    };
  } else if (type == "R100 000 TO LESS THAN R200 000") {
    turnObj = {
      _id: "6026592f408b570039086edc",
      cndName: "R100 000 to less than R200 000",
    };
  } else if (type == "LESS THAN R100 000") {
    turnObj = {
      _id: "602658fa408b570039086edb",
      cndName: "Less than R100 000",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    turnObj = {
      _id: "602658fa408b570039086edb",
      cndName: "Less than R100 000",
    };
  } else if (type == "HOUSEHOLD SUBSISTENCE") {
    turnObj = {
      _id: "5e4cc0f924949c00442307c8",
      cndName: "Household (Subsistence) Less than R50,000",
    };
  } else if (type == "HOUSEHOLD VULNERABLE") {
    turnObj = {
      _id: "5e4cc0c924949c00442307c7",
      cndName: "Household (Vulnerable) Income negligible ",
    };
  } else if (type == "LARGE SCALE") {
    turnObj = {
      _id: "5e4cc17124949c00442307cb",
      cndName: "Large Scale R10 million to less than R50 million",
    };
  } else if (type == "MEDIUM SCALE ") {
    turnObj = {
      _id: "5e4cc15724949c00442307ca",
      cndName: "Medium Scale R1 million to less than R10 million ",
    };
  } else if (type == "MEGA") {
    turnObj = {
      _id: "5e4cc18e24949c00442307cc",
      cndName: "Mega More than R50 million",
    };
  } else if (type == "SMALLHOLDER ") {
    turnObj = {
      _id: "5e4cc12824949c00442307c9",
      cndName: "Smallholder R50 000 to less than R1 million ",
    };
  }
  return turnObj;
}
function getPreferredComm(type) {
  if (type == "EMAIL") {
    return "5e4cc1f824949c00442307d0";
  } else if (type == "FAX") {
    return "5e4cc1e224949c00442307cf";
  } else if (type == "MOBILE PHONE") {
    return "5e4cc1d824949c00442307ce";
  } else if (type == "TELEPHONE") {
    return "5e4cc1c524949c00442307cd";
  } else if (type == "Face to Face") {
    return "5e4cc21124949c00442307d1";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e4cc1d824949c00442307ce";
  }
  return "5e4cc1d824949c00442307ce";
}
function getPreferredCommObj(type) {
  let commObj = {
    _id: "5e4cc1d824949c00442307ce",
    cndName: "Mobile Phone",
  };
  if (type == "EMAIL") {
    commObj = {
      _id: "5e4cc1f824949c00442307d0",
      cndName: "E-mail",
    };
  } else if (type == "FAX") {
    commObj = {
      _id: "5e4cc1e224949c00442307cf",
      cndName: "Fax",
    };
  } else if (type == "MOBILE PHONE") {
    commObj = {
      _id: "5e4cc1d824949c00442307ce",
      cndName: "Mobile Phone",
    };
  } else if (type == "TELEPHONE") {
    commObj = {
      _id: "5e4cc1c524949c00442307cd",
      cndName: "Telephone",
    };
  } else if (type == "Face to Face") {
    commObj = {
      _id: "5e4cc21124949c00442307d1",
      cndName: "Face to Face",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    commObj = {
      _id: "5e4cc1d824949c00442307ce",
      cndName: "Mobile Phone",
    };
  }
  return commObj;
}
function getDistrict(type) {
  if (type == "BOHLABELA") {
    return "602f7319d2b8f94640a55981";
  } else if (type == "EHLANZENI") {
    return "602f7328d2b8f94640a55983";
  } else if (type == "GERT SIBANDE") {
    return "602f7337d2b8f94640a55985";
  } else if (type == "NKANGALA") {
    return "602f7349d2b8f94640a55987";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "602f7328d2b8f94640a55983";
  }
  return "602f7328d2b8f94640a55983";
}
function getDistrictObj(type) {
  let distObj = {
    _id: "602f7328d2b8f94640a55983",
    cndName: "EHLANZENI",
  };
  if (type == "BOHLABELA") {
    distObj = {
      _id: "602f7319d2b8f94640a55981",
      cndName: "BOHLABELA",
    };
  } else if (type == "EHLANZENI") {
    distObj = {
      _id: "602f7328d2b8f94640a55983",
      cndName: "EHLANZENI",
    };
  } else if (type == "GERT SIBANDE") {
    distObj = {
      _id: "602f7337d2b8f94640a55985",
      cndName: "GERT SIBANDE",
    };
  } else if (type == "NKANGALA") {
    distObj = {
      _id: "602f7349d2b8f94640a55987",
      cndName: "NKANGALA",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    distObj = {
      _id: "602f7328d2b8f94640a55983",
      cndName: "EHLANZENI",
    };
  }
  return distObj;
}
function getMunicipality(type) {
  if (type == "BUSHBUCKRIDGE NORTH") {
    return "602f75f3706be36cd41f753e";
  } else if (type == "BUSHBUCKRIDGE SOUTH") {
    return "602f7616706be36cd41f7540";
  } else if (type == "GOVAN MBEKI") {
    return "602f77bb706be36cd41f754a";
  } else if (type == "NKOMAZI") {
    return "602f7649706be36cd41f7544";
  } else if (type == "THEMBISILE HANI") {
    return "602f7699706be36cd41f7546";
  } else if (type == "THABA CHWEU") {
    return "602f762f706be36cd41f7542";
  } else if (type == "MKHONDO") {
    return "602f7807706be36cd41f754c";
  } else if (type == "DR J.S MOROKA") {
    return "602f75c8706be36cd41f753c";
  } else if (type == "MJINDI") {
    return "602f7830706be36cd41f754e";
  } else if (type == "LEKWA") {
    return "602f7850706be36cd41f7550";
  } else if (type == "VICTOR KHANYE") {
    return "602f7870706be36cd41f7552";
  } else if (type == "CHIEF ALBERT LUTHULI") {
    return "602f7891706be36cd41f7554";
  } else if (type == "MSUKALIGWA") {
    return "602f78c6706be36cd41f7556";
  } else if (type == "MBOMBELA") {
    return "602f78f0706be36cd41f7558";
  } else if (type == "DIPALESENG") {
    return "6050a1fedcf3f90036d89be0";
  } else if (type == "DR PIXLEY KA SEME") {
    return "6050a235dcf3f90036d89be2";
  } else if (type == "EMAKHAZENI") {
    return "6050a294dcf3f90036d89be4";
  } else if (type == "EMALAHLENI") {
    return "6050a2bedcf3f90036d89be6";
  } else if (type == "STEVE TSHWETE") {
    return "6050a3f0dcf3f90036d89be8";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "602f78f0706be36cd41f7558";
  }
  return "602f78f0706be36cd41f7558";
}
function getMunicipalityObj(type) {
  let municObj = {
    _id: "602f78f0706be36cd41f7558",
    cndName: "MBOMBELA",
  };
  if (type == "BUSHBUCKRIDGE NORTH") {
    municObj = {
      _id: "602f75f3706be36cd41f753e",
      cndName: "BUSHBUCKRIDGE NORTH",
    };
  } else if (type == "BUSHBUCKRIDGE SOUTH") {
    municObj = {
      _id: "602f7616706be36cd41f7540",
      cndName: "BUSHBUCKRIDGE SOUTH",
    };
  } else if (type == "GOVAN MBEKI") {
    municObj = {
      _id: "602f77bb706be36cd41f754a",
      cndName: "GOVAN MBEKI",
    };
  } else if (type == "NKOMAZI") {
    municObj = {
      _id: "602f7649706be36cd41f7544",
      cndName: "NKOMAZI",
    };
  } else if (type == "THEMBISILE HANI") {
    municObj = {
      _id: "602f7699706be36cd41f7546",
      cndName: "THEMBISILE HANI",
    };
  } else if (type == "THABA CHWEU") {
    municObj = {
      _id: "602f762f706be36cd41f7542",
      cndName: "THABA CHWEU",
    };
  } else if (type == "MKHONDO") {
    municObj = {
      _id: "602f7807706be36cd41f754c",
      cndName: "MKHONDO",
    };
  } else if (type == "DR J.S MOROKA") {
    municObj = {
      _id: "602f75c8706be36cd41f753c",
      cndName: "DR J.S MOROKA",
    };
  } else if (type == "MJINDI") {
    municObj = {
      _id: "602f7830706be36cd41f754e",
      cndName: "MJINDI",
    };
  } else if (type == "LEKWA") {
    municObj = {
      _id: "602f7850706be36cd41f7550",
      cndName: "LEKWA",
    };
  } else if (type == "VICTOR KHANYE") {
    municObj = {
      _id: "602f7870706be36cd41f7552",
      cndName: "VICTOR KHANYE",
    };
  } else if (type == "CHIEF ALBERT LUTHULI") {
    municObj = {
      _id: "602f7891706be36cd41f7554",
      cndName: "CHIEF ALBERT LUTHULI",
    };
  } else if (type == "MSUKALIGWA") {
    municObj = {
      _id: "602f78c6706be36cd41f7556",
      cndName: "MSUKALIGWA",
    };
  } else if (type == "MBOMBELA") {
    municObj = {
      _id: "602f78f0706be36cd41f7558",
      cndName: "MBOMBELA",
    };
  } else if (type == "DIPALESENG") {
    municObj = {
      _id: "6050a1fedcf3f90036d89be0",
      cndName: "DIPALESENG",
    };
  } else if (type == "DR PIXLEY KA SEME") {
    municObj = {
      _id: "6050a235dcf3f90036d89be2",
      cndName: "DR PIXLEY KA SEME",
    };
  } else if (type == "EMAKHAZENI") {
    municObj = {
      _id: "6050a294dcf3f90036d89be4",
      cndName: "EMAKHAZENI",
    };
  } else if (type == "EMALAHLENI") {
    municObj = {
      _id: "6050a2bedcf3f90036d89be6",
      cndName: "EMALAHLENI",
    };
  } else if (type == "STEVE TSHWETE") {
    municObj = {
      _id: "6050a3f0dcf3f90036d89be8",
      cndName: "STEVE TSHWETE",
    };
  } else if (type == "" || type == "undefined" || type == undefined) {
    municObj = {
      _id: "602f78f0706be36cd41f7558",
      cndName: "MBOMBELA",
    };
  }
  return municObj;
}

//below api is to update dump 2020 table for created by user
router.get("/api/updatecreatedby", async function (req, res) {
  let emailNotFoundArr = [];
  let userData = await User.find(
    {},
    {
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
    }
  );

  let prodData = await FarmersDump2020.find(
    {},
    {
      PenUserEmail: 1,
    }
  );

  for (let i = 0; i < prodData.length; i++) {
    let userId = userData.filter(
      (m) =>
        m.email.trim().toLowerCase() ===
        prodData[i].PenUserEmail.trim().toLowerCase()
    );

    if (userId.length > 0) {
      // console.log(
      //   "user ID : ",
      //   userId[0]._id,
      //   prodData[i].PenUserEmail.trim().toLowerCase()
      // );

      await FarmersDump2020.updateMany(
        { PenUserEmail: prodData[i].PenUserEmail },
        {
          $set: {
            createdBy: userId[0]._id,
            createdByObj: {
              email: userId[0].email,
              name: userId[0].firstName + " " + userId[0].lastName,
            },
          },
        }
      );
    } else {
      //console.log("userData : ", userData);
      if (
        !emailNotFoundArr.includes(
          prodData[i].PenUserEmail.trim().toLowerCase()
        )
      ) {
        emailNotFoundArr.push(prodData[i].PenUserEmail.trim().toLowerCase());

        console.log("userId : ", userId);
        console.log("prodData[i].PenUserEmail : ", prodData[i].PenUserEmail);
      }
      // let obj = userData.find(
      //   (o) => o.email.trim() === prodData[i].PenUserEmail.trim()
      // );

      // console.log("obj : ", obj);
    }
  }

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    EmailNotFound: emailNotFoundArr,
  });
});

router.get("/api/updatecreatedbymain", async function (req, res) {
  try {
    let prodData = await FarmersDump2020.find(
      {},
      {
        ReferenceNumber: 1,
        createdBy: 1,
        createdByObj: 1,
      }
    );

    console.log("LOOP Start");
    for (let i = 0; i < prodData.length; i++) {
      await FarmerDetail.bulkWrite([
        {
          updateOne: {
            filter: { referenceNumber: prodData[i].ReferenceNumber },
            update: {
              $set: {
                createdBy: prodData[i].createdBy,
                createdByObj: {
                  email: prodData[i].createdByObj.email,
                  name: prodData[i].createdByObj.name,
                },
              },
            },
          },
        },
      ]);
    }
    console.log("LOOP End");
  } catch (ex) {
    console.log("exception : ", ex);
  }

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
  });
});

const indMov = {};

const indOutcome = {};

const indEmails = {};

router.get("/api/insertmov", async function (req, res) {
  /*
  let x = 0;
  for (let row = 0; row < Mov.Table.length; row++) {
    let movRow = Mov.Table[row]["Means of Verification"];
    const movArr = movRow.split(",");

    for (let i = 0; i < movArr.length; i++) {
      x = x + 1;
      let value = movArr[i];

      const movAvailable = await PeformanceMov.find({ name: value.trim() });

      console.log("movAv : ", movAvailable);

      if (movAvailable.length == 0) {
        let obj = new PeformanceMov({
          name: value.trim(),
          createdDate: new Date().setHours(0, 0, 0, 0),
        });

        await obj.save();
      }
    }
  }
*/

  let emailNotFoundArr = [];
  let userData = await User.find(
    {},
    {
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
    }
  );

  for (let i = 0; i < indEmails.Table.length; i++) {
    let responsiblePersonMail = indEmails.Table[i]["Approver 2 Email"];
    // let approver1Mail = indEmails.Table[i]["Approver 1 Email"];
    // let approver2Mail = indEmails.Table[i]["Approver 2 Email"];

    //console.log("responsiblePersonMail : ", responsiblePersonMail);
    if (responsiblePersonMail) {
      let userId = userData.filter(
        (m) =>
          m.email.trim().toLowerCase() ===
          responsiblePersonMail.trim().toLowerCase()
      );

      if (userId.length > 0) {
      } else {
        if (
          !emailNotFoundArr.includes(responsiblePersonMail.trim().toLowerCase())
        ) {
          emailNotFoundArr.push(responsiblePersonMail.trim().toLowerCase());

          //console.log("userId : ", userId);
          // console.log("responsiblePersonMail : ", responsiblePersonMail);
        }
      }
    }
  }

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    EmailNotFound: emailNotFoundArr,
  });
});

router.get("/api/insertind2020", async function (req, res) {
  console.log("loop starts!");
  for (let i = 0; i < indTargets.Table.length; i++) {
    let indicatorTitle = indTargets.Table[i]["Indicator Title"];
    let quarter = indTargets.Table[i]["Quarter"];
    let annualTarget = indTargets.Table[i]["Annual Target"];
    let quarterTarget = indTargets.Table[i]["Quarter Target"];
    let responsiblePersonMail =
      indTargets.Table[i]["Responsible Person Email "];
    let actualOutput = indTargets.Table[i]["Actual Output"];
    let remarks = indTargets.Table[i]["Challenges/Comments"];
    let intervention = indTargets.Table[i]["Intervention"];
    let approver1Email = indTargets.Table[i]["Approver 1 Email"];
    let approver1Remarks = indTargets.Table[i]["Approver 1 Remarks"];
    let approver2Email = indTargets.Table[i]["Approver 2 Email"];
    let approver2Remarks = indTargets.Table[i]["Approver 2 Remarks"];

    let respID = [];
    if (responsiblePersonMail) {
      respID = await User.find(
        { email: responsiblePersonMail.trim() },
        {
          _id: 1,
          userGroup: 1,
        }
      );
    }
    //approver1
    let app1ID = [];
    if (approver1Email) {
      app1ID = await User.find(
        { email: approver1Email.trim() },
        {
          _id: 1,
          userGroup: 1,
        }
      );
    } //approver 1 end

    //approver 2
    let app2ID = [];
    if (
      approver2Email &&
      approver1Email != approver2Email &&
      approver2Email != "None"
    ) {
      app2ID = await User.find(
        { email: approver2Email.trim() },
        {
          _id: 1,
          userGroup: 1,
        }
      );
    } //approver 2 end

    //get indicator title details - mov, o/p, o/c
    if (indicatorTitle) {
      let titleData = await IndicatorTitles.findOne(
        { indicatorTitle: indicatorTitle.trim() },
        {
          _id: 1,
          indicatorTitle: 1,
          dimensions: 1,
          movArray: 1,
          outcome: 1,
          outputs: 1,
        }
      );
      console.log("respID : ", responsiblePersonMail, respID);
      console.log("app1ID : ", approver1Email, app1ID[0]._id);
      console.log(
        "app2ID : ",
        approver2Email,
        approver1Email == approver2Email,
        app2ID.length > 0 ? app2ID[0]._id : "NA"
      );
      console.log("dimensions : ", indicatorTitle, titleData.dimensions);

      //insert to performance table
      var indicatoreObj = {
        dimensions: titleData.dimensions,
        indicatorTitle: titleData.indicatorTitle,
        outcome: titleData.outcome,
        outputs: titleData.outputs,
        movArray: titleData.movArray,
        target: quarterTarget ? quarterTarget.replace(/\s/g, "") : "0",
        annualTarget: annualTarget ? annualTarget.replace(/\s/g, "") : "0",
        actualPerformance: actualOutput ? actualOutput.replace(/\s/g, "") : "0",
        responsibleRole: respID[0].userGroup,
        responsibleUser: respID.length > 0 ? respID[0]._id : null,
        intervention: intervention,
        remarks: remarks,
        approverUser1: app1ID.length > 0 ? app1ID[0]._id : null,
        approverUser1Remarks: approver1Remarks,
        approverUser1Status: "approved",
        approverUser2: app2ID.length > 0 ? app2ID[0]._id : null,
        approverUser2Remarks: app2ID.length > 0 ? approver2Remarks : "",
        approverUser2Status: app2ID.length > 0 ? "approved" : "",
        apUser1HasDownload: true,
        apUser2HasDownload: app2ID.length > 0 ? true : false,
        finYear: "2020",
        reportingCycle: "Quarterly",
        status: "submit",
        approvalStatus: "",
        hasDocuments: true,
        isTargetCummulative: true,
        cycleValue: quarterFunc(quarter),
        startDate: startDateFunc(quarter),

        approverUser3: null,
        approverUser3Remarks: "",
        approverUser3Status: "",
        apUser3HasDownload: false,
      };

      let indicators2020 = new PerformanceMng(indicatoreObj);
      await indicators2020.save();
    } //indicator title end
  } //main for loop
  console.log("loop ends!");

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
  });
});

function quarterFunc(quarter) {
  let res = "";
  if (quarter == "Q1") res = "2020: Apr May Jun";
  else if (quarter == "Q2") res = "2020: Jul Aug Sep";
  else if (quarter == "Q3") res = "2020: Oct Nov Dec";
  else if (quarter == "Q4") res = "2021: Jan Feb Mar";

  return res;
}

function startDateFunc(quarter) {
  let res = 0;
  if (quarter == "Q1") res = 1588444200;
  else if (quarter == "Q2") res = 1598380200;
  else if (quarter == "Q3") res = 1606242600;
  else if (quarter == "Q4") res = 1613845800;

  return res;
}

// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
  for (var i = 0; i < this.length; i++) {
    if (comparer(this[i])) return true;
  }
  return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function (element, comparer) {
  if (!this.inArray(comparer)) {
    this.push(element);
  }
};

router.get("/api/insertserviceproviders", async function (req, res) {
  console.log("loop starts!");
  var sPUniqueArr = [];
  for (let i = 0; i < serviceProviders.Table.length; i++) {
    let serviceProviderFirmName =
      serviceProviders.Table[i]["serviceProviderFirmName"];
    let contactPersonName = serviceProviders.Table[i]["contactPersonName"];
    let contactNumber = serviceProviders.Table[i]["contactNumber"];
    let email = serviceProviders.Table[i]["email"];

    let element = serviceProviders.Table[i];
    sPUniqueArr.pushIfNotExist(element, function (e) {
      return e.serviceProviderFirmName === element.serviceProviderFirmName;
    });
  } //main for loop

  // //insert to service providers table
  await ContractServiceProviders.insertMany(sPUniqueArr)
    .then(function () {
      console.log("Data inserted"); // Success
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  console.log("sPUniqueArr : ", sPUniqueArr.length);
  console.log("loop ends!");

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
  });
});

module.exports = router;
