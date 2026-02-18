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

router.get("/api/uploadFarmers", function (req, res) {
  var parser = new xml2js.Parser();

  fs.readFile("public/uploads" + "/DIGITAL PEN INFORMATION (1).xml", function (
    err,
    data
  ) {
    parser.parseString(data, async function (err, result) {
      //console.dir(result.Workbook.Worksheet[0].Table[0].Row[1].Cell[2].Data[0]._);

      for (
        var row = 1;
        row < result.Workbook.Worksheet[0].Table[0].Row.length;
        row++
      ) {
        //for (var cell = 0; cell < result.Workbook.Worksheet[0].Table[0].Row[row].Cell.length; cell++) 
        //{

          var farmerRegObj = {
            nationality: "5e3811685426832b10cb9128",
            education: "5e3816425426832b10cb913e",
            educationOther: null,
            farmingExperience: " ",
            farmingExperienceYears: 0,

            farmerType:
            getFarmerType(
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[16].Data[0]._),
            surname:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[17].Data[0]._,
            name:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[18].Data[0]._ == undefined ||
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[18].Data[0]._ == "" ? " " :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[18].Data[0]._,
            contactNumber:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[19].Data[0]._ == undefined ||
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[19].Data[0]._ == "" ? " " :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[19].Data[0]._ ,
            identityNumber:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[20].Data[0]._ == undefined ||
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[20].Data[0]._ == "" ? " " :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[20].Data[0]._ ,
            email:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[21].Data[0]._ == undefined ||
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[21].Data[0]._ == "NONE" || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[21].Data[0]._ == "" ? "" : 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[21].Data[0]._,
            residentialAddress:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[22].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[22].Data[0]._ == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[22].Data[0]._
              + " " +
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[23].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[23].Data[0]._ == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[23].Data[0]._ 
              + " " +
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[25].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[25].Data[0]._  == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[25].Data[0]._ ,
            residentialPostalcode:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[24].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[24].Data[0]._ == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[24].Data[0]._,
            postalAddress:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[26].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[26].Data[0]._ == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[26].Data[0]._
               + " " +
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[27].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[27].Data[0]._ == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[27].Data[0]._
               + " " +
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[29].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[29].Data[0]._ == "" ? "" :
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[29].Data[0]._ ,
            postalcode:
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[28].Data[0]._ == undefined || 
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[28].Data[0]._ == ""?"":
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[28].Data[0]._ ,
            gender: getGender(
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[31].Data[0]._) ,
            ageGroups: getAgeGroups(
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[32].Data[0]._)  ,
            populationGroup: getPopulationGroup(
                result.Workbook.Worksheet[0].Table[0].Row[row].Cell[33].Data[0]._)  ,
            populationGroupOther:"",
            homeLanguage: getLanguage(
                  result.Workbook.Worksheet[0].Table[0].Row[row].Cell[34].Data[0]._),
            homeLanguageOther:"",
            operationType: getOperationType(
                  result.Workbook.Worksheet[0].Table[0].Row[row].Cell[35].Data[0]._)  ,
            ownershipType: getOwnershipType(
                  result.Workbook.Worksheet[0].Table[0].Row[row].Cell[37].Data[0]._)  ,
            otherOwnerShip: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[37].Data[0]._ == "OTHER" ?
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[38].Data[0]._ : "",
            landAquisition: getLandAquisition(
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[39].Data[0]._)  ,
            landAquisitionOther: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[39].Data[0]._ == "OTHER" ?
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[40].Data[0]._ : "",
            programmeRedistribution: getRedistribution(
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[41].Data[0]._)  ,
            programmeRedistributionOther: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[41].Data[0]._ == "OTHER" ?
              result.Workbook.Worksheet[0].Table[0].Row[row].Cell[42].Data[0]._ : "",
            noOfEmployees: {
                totalEmp: "0",
                Male: "0",
                Female: "0",
                Youth: "0",
                "With Disability": "0"
            },
            parmanentEmployment: {
              "Male": "0",
              "Female": "0",
              "Youth Male": "0",
              "Youth Female": "0"
          },
          seasonalEmployment: {
              "Male": "0",
              "Female": "0",
              "Youth Male": "0",
              "Youth Female": "0"
          },
          contractEmployment: {
              "Male": "0",
              "Female": "0",
              "Youth Male": "0",
              "Youth Female": "0"
          },
          };


          var newObj = await new FarmerDetail(farmerRegObj);
           
          newObj.save(function (err) {
          console.log("Save Farmer Reg Record #### ");
          if (err) {
              console.log("errors", err);
              if (
                (err.name === "BulkWriteError" ||
                  err.name === "MongoError") &&
                err.code === 11000
              ) {
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg:
                    "Mobile No/Email already exist!, plz try with another.",
                });
              } else {
                    return res.status(400).json({
                    success: false,
                    responseCode: 400,
                    msg: "Some thing is wrong.",
                    error: err.errors,
                  });
              }
            }
            let result1 = JSON.parse(JSON.stringify(newObj));
          });
          
          //////// Farmer Production ////////////
          console.log("farmer Reg result : ", JSON.parse(JSON.stringify(newObj)));
          var farmerProdObj = {
          farmerId: JSON.parse(JSON.stringify(newObj))._id,
          farmName: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[45].Data[0]._ == undefined || 
          result.Workbook.Worksheet[0].Table[0].Row[row].Cell[45].Data[0]._ == "" ? "" :
          result.Workbook.Worksheet[0].Table[0].Row[row].Cell[45].Data[0]._,
          totalFarmSize: {
            "Total": result.Workbook.Worksheet[0].Table[0].Row[row].Cell[47].Data[0]._ == undefined || 
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[47].Data[0]._ == "" ? "0" :
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[47].Data[0]._,
            "Arable": result.Workbook.Worksheet[0].Table[0].Row[row].Cell[48].Data[0]._ == undefined || 
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[48].Data[0]._ == "" ? "0" :
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[48].Data[0]._,
            "Non-arable": result.Workbook.Worksheet[0].Table[0].Row[row].Cell[49].Data[0]._ == undefined || 
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[49].Data[0]._ == "" ? "0" :
            result.Workbook.Worksheet[0].Table[0].Row[row].Cell[49].Data[0]._,
            "Grazing": "0"
        },
        metroDistrict: "District",
        farmMuncipalRegion: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[53].Data[0]._ == undefined || 
        result.Workbook.Worksheet[0].Table[0].Row[row].Cell[53].Data[0]._ == "" ? "" :
        result.Workbook.Worksheet[0].Table[0].Row[row].Cell[53].Data[0]._,
        wardNumber: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[54].Data[0]._ == undefined || 
        result.Workbook.Worksheet[0].Table[0].Row[row].Cell[54].Data[0]._ == "" ? "" :
        result.Workbook.Worksheet[0].Table[0].Row[row].Cell[54].Data[0]._,
        townVillage: result.Workbook.Worksheet[0].Table[0].Row[row].Cell[55].Data[0]._ == undefined || 
        result.Workbook.Worksheet[0].Table[0].Row[row].Cell[55].Data[0]._ == "" ? "" :
        result.Workbook.Worksheet[0].Table[0].Row[row].Cell[55].Data[0]._,
          }
          var newObj2 = await new FarmerProduction(farmerProdObj);

          newObj2.save(function (err) {
          console.log("Save Production Record #### ");
          if (err) {
              console.log("errors", err);
              if (
                (err.name === "BulkWriteError" ||
                  err.name === "MongoError") &&
                err.code === 11000
              ) {
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg:
                    "plz try with another.",
                });
              } else {
                  return res.status(400).json({
                    success: false,
                    responseCode: 400,
                    msg: "Some thing is wrong.",
                    error: err.errors,
                  });
              }
            }
            var result2 = JSON.parse(JSON.stringify(newObj2));
            console.log("farmer Prod result : ", result2);
          });
         
        //}
      
      }

      console.log("Done");
    });
  });
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
