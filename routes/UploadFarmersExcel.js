var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
var FarmerDetail = require("../models/FarmerDetail");
var FarmerProduction = require("../models/FarmerProduction");
var FarmAssetsServices = require("../models/FarmAssetsServices");

var fs = require("fs");
var xml2js = require("xml2js");
const xlsx = require("xlsx");

router.get("/api/uploadFarmersExcel", function (req, res) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const workbook = xlsx.readFile(
    "public/uploads" +
      "/Xcallibre_DOA_MP_FarmerRegisterQuestionnaire_Export_22_01_21.xlsx"
  );
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets["Table"]);
  let farmerReg = [];

  for (var row = 0; row < rows.length; row++) {
    if (row === 0) console.log("rowwwwwwssssss 1 : ", rows[row]);
    if (row === 1) console.log("rowwwwwwssssss 2 : ", rows[row]);

    var farmerRegObj = {
      nationality: "5e3811685426832b10cb9128",
      education: "5e3816425426832b10cb913e",
      educationOther: null,
      farmingExperience: " ",
      farmingExperienceYears: 0,

      farmerType: getFarmerType(rows[row].generalinfo),
      surname: rows[row]._,
      name: rows[row]._ == undefined || rows[row]._ == "" ? " " : rows[row]._,
      contactNumber:
        rows[row]._ == undefined || rows[row]._ == "" ? " " : rows[row]._,
      identityNumber:
        rows[row]._ == undefined || rows[row]._ == "" ? " " : rows[row]._,
      email:
        rows[row]._ == undefined || rows[row]._ == "NONE" || rows[row]._ == ""
          ? ""
          : rows[row]._,
      residentialAddress:
        rows[row]._ == undefined || rows[row]._ == ""
          ? ""
          : rows[row]._ + " " + rows[row]._ == undefined || rows[row]._ == ""
          ? ""
          : rows[row]._ + " " + rows[row]._ == undefined || rows[row]._ == ""
          ? ""
          : rows[row]._,
      residentialPostalcode:
        rows[row]._ == undefined || rows[row]._ == "" ? "" : rows[row]._,
      postalAddress:
        rows[row]._ == undefined || rows[row]._ == ""
          ? ""
          : rows[row]._ + " " + rows[row]._ == undefined || rows[row]._ == ""
          ? ""
          : rows[row]._ + " " + rows[row]._ == undefined || rows[row]._ == ""
          ? ""
          : rows[row]._,
      postalcode:
        rows[row]._ == undefined || rows[row]._ == "" ? "" : rows[row]._,
      gender: getGender(rows[row]._),
      ageGroups: getAgeGroups(rows[row]._),
      populationGroup: getPopulationGroup(rows[row]._),
      populationGroupOther: "",
      homeLanguage: getLanguage(rows[row]._),
      homeLanguageOther: "",
      operationType: getOperationType(rows[row]._),
      ownershipType: getOwnershipType(rows[row]._),
      otherOwnerShip: rows[row]._ == "OTHER" ? rows[row]._ : "",
      landAquisition: getLandAquisition(rows[row]._),
      landAquisitionOther: rows[row]._ == "OTHER" ? rows[row]._ : "",
      programmeRedistribution: getRedistribution(rows[row]._),
      programmeRedistributionOther: rows[row]._ == "OTHER" ? rows[row]._ : "",
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
    };
    farmerReg.push(farmerRegObj);
  }
  fs.writeFileSync("farmers.json", JSON.stringify(farmerReg));
});

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
  }

  return "5e3815555426832b10cb9130";
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
  }

  return "5e3812725426832b10cb912a";
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
  } else if (type == "A FAMILY") {
    return "5e3d5e109388e60044056535";
  } else if (type == "AN INDIVIDUAL") {
    return "5e3d5e109388e60044056535";
  } else if (type == "GOVERNMENT") {
    return "5e3d5e3a9388e60044056537";
  } else if (type == "OTHER") {
    return "5e3d5e5e9388e60044056539";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e3d5e109388e60044056535";
  }
  return "5e3d5e109388e60044056535";
}
function getLandAquisition(type) {
  if (type == "HIRED") {
    return "5e3817085426832b10cb9148";
  } else if (type == "INHERITED") {
    return "5e38171a5426832b10cb914a";
  } else if (type == "PERMISSIONTOOCCUPY") {
    return "5e3817245426832b10cb914b";
  } else if (type == "REDISTRIBUTION") {
    return "5e3816f25426832b10cb9146";
  } else if (type == "RESTITUTION") {
    return "5e3816e85426832b10cb9145";
  } else if (type == "SELF BOUGHT") {
    return "5e3816fc5426832b10cb9147";
  } else if (type == "TENURE") {
    return "5e3816da5426832b10cb9144";
  } else if (type == "OTHER") {
    return "5e565298a007090044e72634";
  } else if (type == "" || type == "undefined" || type == undefined) {
    return "5e565298a007090044e72634";
  }
  return "5e565298a007090044e72634";
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

module.exports = router;
