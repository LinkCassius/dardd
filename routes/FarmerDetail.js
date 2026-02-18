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
const Config = require("../config/config");
//import { isValidObjectId } from "mongoose";
//import { try } from "bluebird";
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

const { masterConst } = Config;

/**
 * @swagger
 * /api/farmerRegistration:
 *   post:
 *     tags:
 *       - Add/Update - Farmer Personal details
 *     description: Returns a object of Farmer Details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: farmerType
 *         description: farmer type
 *         in: formData
 *         required: true
 *         type: string
 *       - name: surname
 *         description: surname of farmer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: name of farmer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: emailaddress of farmer
 *         in: formData
 *         type: string
 *         format: email
 *       - name: identityNumber
 *         description: identity no of farmer (Unique)
 *         in: formData
 *         required: true
 *         type: string
 *       - name: contactNumber
 *         description: Phone/Mobile no of farmer
 *         in: formData
 *         type: string
 *       - name: nationality
 *         description: SELECT nationality of farmer
 *         in: formData
 *       - name: farmerType
 *         description: farmerType
 *         in: formData
 *         type: string
 *       - name: residentialAddress
 *         description: residential Address of farmer
 *         in: formData
 *         type: string
 *       - name: residentialPostalcode
 *         description: residentialPostalcode of farmer
 *         in: formData
 *         type: string
 *       - name: postalAddress
 *         description: postal address of farmer
 *         in: formData
 *         type: string
 *       - name: postalcode
 *         description: postalcode of farmer
 *         in: formData
 *         type: string
 *       - name: farmingExperience
 *         description: Experience of farming
 *         in: formData
 *         type: string
 *       - name: farmingExperienceYears
 *         description: Years of Experience in farming
 *         in: formData
 *         type: number
 *       - name: ageGroups
 *         description: (ID) SELECT ageGroups
 *         in: formData
 *       - name: gender
 *         description: gender of farmer
 *         in: formData
 *         type: string
 *       - name: populationGroup
 *         description: (ID) SELECT populationGroup
 *         in: formData
 *       - name: populationGroupOther
 *         description: populationGroup Other of farmer
 *         in: formData
 *         type: string
 *       - name: homeLanguage
 *         description: (ID) SELECT homeLanguage
 *         in: formData
 *       - name: homeLanguageOther
 *         description: homeLanguageOther of farmer
 *         in: formData
 *         type: string
 *       - name: education
 *         description: (ID) SELECT education
 *         in: formData
 *       - name: educationOther
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: operationType
 *         description: (ID) SELECT type of operation
 *         in: formData
 *         type: string
 *       - name: isOwner
 *         description: farmer is owner of not
 *         in: formData
 *         type: boolean
 *       - name: ownershipType
 *         description: (ID) SELECT ownershipType
 *         in: formData
 *       - name: otherOwnerShip
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: landAquisition
 *         description: (ID) SELECT landAquisition
 *         in: formData
 *       - name: landAquisitionOther
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: programmeRedistribution
 *         description: (ID) SELECT programmeRedistribution
 *         in: formData
 *         type: string
 *       - name: programmeRedistributionOther
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: noOfEmployees
 *         description: Total No. of Male, Female, Youth, With Disability
 *         in: formData
 *         type: object
 *       - name: parmanentEmployment
 *         description: Number of Male, Female, Youth Male, Youth Female
 *         in: formData
 *         type: object
 *       - name: seasonalEmployment
 *         description: Number of Male, Female, Youth Male, Youth Female
 *         in: formData
 *         type: object
 *       - name: contractEmployment
 *         description: Number of Male, Female, Youth Male, Youth Female
 *         in: formData
 *         type: object
 *       - name: nationalityObj
 *         description: _id- Nationality, cndName- Nationality Text
 *         in: formData
 *         type: object
 *       - name: ageGroupsObj
 *         description: _id- ageGroups, cndName- ageGroups Text
 *         in: formData
 *         type: object
 *       - name: populationGroupObj
 *         description: _id- populationGroup, cndName- populationGroup Text
 *         in: formData
 *         type: object
 *       - name: homeLanguageObj
 *         description: _id- homeLanguage, cndName- homeLanguage Text
 *         in: formData
 *         type: object
 *       - name: educationObj
 *         description: _id- education, cndName- education Text
 *         in: formData
 *         type: object
 *       - name: ownershipTypeObj
 *         description: _id- ownershipType, cndName- ownershipType Text
 *         in: formData
 *         type: object
 *       - name: landAquisitionObj
 *         description: _id- landAquisition, cndName- landAquisition Text
 *         in: formData
 *         type: object
 *       - name: programmeRedistributionObj
 *         description: _id- Redistribution, cndName- Redistribution Text
 *         in: formData
 *         type: object
 *     responses:
 *       200:
 *         description: An Object of Farmer Personal Details
 *         schema:
 *            $ref: '#/definitions/FarmerDetail'
 */

/************FARMER REGISTER/SIGNUP API************************* */
router.post("/api/farmerRegistration", auth, async function (req, res) {
  //console.log("req", req.body);
  if (!req.body.name) {
    return res
      .status(400)
      .json({ success: false, responseCode: 400, msg: "Please enter name." });
  } else if (!req.body.surname) {
    return res
      .status(400)
      .json({ success: false, msg: "Please enter surname." });
  } else if (!req.body.identityNumber) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Identity Number.",
    });
  } else {
    if (req.body.id) {
      var farmerData = await FarmerDetail.findOne({
        identityNumber: req.body.identityNumber,
        _id: { $ne: req.body.id },
      });

      if (farmerData) {
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Identity Number already registered!, please try with another.",
        });
      } else {
        FarmerDetail.findOne(
          {
            _id: req.body.id,
          },
          async function (err, farmer) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            //console.log("farmer : ", farmer);

            if (!farmer) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Farmer with given id not exists!",
              });
            } else {
              var oldObj = {
                farmerId: farmer._id,
                farmerType: farmer.farmerType,
                surname: farmer.surname,
                name: farmer.name,
                identityNumber: farmer.identityNumber,
                contactNumber: farmer.contactNumber,
                nationality: farmer.nationality,
                residentialAddress: farmer.residentialAddress,
                postalAddress: farmer.postalAddress,
                residentialPostalcode: farmer.residentialPostalcode,
                postalcode: farmer.postalcode,
                farmingExperience: farmer.farmingExperience,
                farmingExperienceYears: farmer.farmingExperienceYears,
                gender: farmer.gender,
                ageGroups: farmer.ageGroups,
                populationGroup: farmer.populationGroup,
                populationGroupOther: farmer.populationGroupOther,
                homeLanguage: farmer.homeLanguage,
                homeLanguageOther: farmer.homeLanguageOther,
                education: farmer.education,
                operationType: farmer.operationType,
                isOwner: farmer.isOwner,
                ownershipType: farmer.ownershipType,
                otherOwnerShip: farmer.otherOwnerShip,
                landAquisition: farmer.landAquisition,
                landAquisitionOther: farmer.landAquisitionOther,
                programmeRedistribution: farmer.programmeRedistribution,
                programmeRedistributionOther:
                  farmer.programmeRedistributionOther,
                noOfEmployees: farmer.noOfEmployees,
                parmanentEmployment: farmer.parmanentEmployment,
                seasonalEmployment: farmer.seasonalEmployment,
                contractEmployment: farmer.contractEmployment,
                deleted: farmer.deleted,
                userId: farmer.userId,
                email: farmer.email,
                nationalityObj: farmer.nationalityObj,
                ageGroupsObj: farmer.ageGroupsObj,
                populationGroupObj: farmer.populationGroupObj,
                homeLanguageObj: farmer.homeLanguageObj,
                educationObj: farmer.educationObj,
                ownershipTypeObj: farmer.ownershipTypeObj,
                landAquisitionObj: farmer.landAquisitionObj,
                programmeRedistributionObj: farmer.programmeRedistributionObj,
                createdDate: new Date().getTime(),
                createdBy: farmer.createdBy,
                createdByObj: farmer.createdByObj,
                isDisabled: farmer.isDisabled,
              };

              var newObj = new FarmerDetailHistory(oldObj);

              newObj.save(function (err) {
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
                      msg: "Mobile No/Email already exist!, plz try with another.",
                    });
                  } else {
                    if (err.errors && err.errors.mobilenumber)
                      return res.status(400).json({
                        success: false,
                        responseCode: 400,
                        msg: err.errors.mobilenumber.message,
                      });
                    else
                      return res.status(400).json({
                        success: false,
                        responseCode: 400,
                        msg: "Some thing is wrong.",
                        error: err.errors,
                      });
                  }
                }
                var result = JSON.parse(JSON.stringify(newObj));
              });

              var updateObj = {
                farmerId: req.body.id ? req.body.id : farmer._id,
                farmerType: req.body.farmerType
                  ? req.body.farmerType
                  : farmer.farmerType,
                surname: req.body.surname ? req.body.surname : farmer.surname,
                name: req.body.name ? req.body.name : farmer.name,
                identityNumber: req.body.identityNumber
                  ? req.body.identityNumber
                  : farmer.identityNumber,
                contactNumber: req.body.contactNumber
                  ? req.body.contactNumber
                  : farmer.contactNumber,
                nationality: req.body.nationality
                  ? req.body.nationality
                  : farmer.nationality,
                residentialAddress: req.body.residentialAddress
                  ? req.body.residentialAddress
                  : farmer.residentialAddress,
                postalAddress: req.body.postalAddress
                  ? req.body.postalAddress
                  : farmer.postalAddress,
                residentialPostalcode: req.body.residentialPostalcode
                  ? req.body.residentialPostalcode
                  : farmer.residentialPostalcode,
                postalcode: req.body.postalcode
                  ? req.body.postalcode
                  : farmer.postalcode,
                farmingExperience: req.body.farmingExperience
                  ? req.body.farmingExperience
                  : farmer.farmingExperience,
                farmingExperienceYears: req.body.farmingExperienceYears
                  ? req.body.farmingExperienceYears
                  : farmer.farmingExperienceYears,
                gender: req.body.gender ? req.body.gender : farmer.gender,
                ageGroups: req.body.ageGroups
                  ? req.body.ageGroups
                  : farmer.ageGroups,
                populationGroup: req.body.populationGroup
                  ? req.body.populationGroup
                  : farmer.populationGroup,
                populationGroupOther: req.body.populationGroupOther
                  ? req.body.populationGroupOther
                  : farmer.populationGroupOther,
                homeLanguage: req.body.homeLanguage
                  ? req.body.homeLanguage
                  : farmer.homeLanguage,
                homeLanguageOther: req.body.homeLanguageOther
                  ? req.body.homeLanguageOther
                  : farmer.homeLanguageOther,
                education: req.body.education
                  ? req.body.education
                  : farmer.education,
                operationType: req.body.operationType
                  ? req.body.operationType
                  : farmer.operationType,
                isOwner: req.body.isOwner,
                ownershipType: req.body.ownershipType
                  ? req.body.ownershipType
                  : farmer.ownershipType,
                otherOwnerShip: req.body.otherOwnerShip
                  ? req.body.otherOwnerShip
                  : farmer.otherOwnerShip,
                landAquisition: req.body.landAquisition
                  ? req.body.landAquisition
                  : farmer.landAquisition,
                landAquisitionOther: req.body.landAquisitionOther
                  ? req.body.landAquisitionOther
                  : farmer.landAquisitionOther,
                programmeRedistribution: req.body.programmeRedistribution
                  ? req.body.programmeRedistribution
                  : farmer.programmeRedistribution,
                programmeRedistributionOther: req.body
                  .programmeRedistributionOther
                  ? req.body.programmeRedistributionOther
                  : farmer.programmeRedistributionOther,
                noOfEmployees: req.body.noOfEmployees
                  ? req.body.noOfEmployees
                  : farmer.noOfEmployees,
                parmanentEmployment: req.body.parmanentEmployment
                  ? req.body.parmanentEmployment
                  : farmer.parmanentEmployment,
                seasonalEmployment: req.body.seasonalEmployment
                  ? req.body.seasonalEmployment
                  : farmer.seasonalEmployment,
                contractEmployment: req.body.contractEmployment
                  ? req.body.contractEmployment
                  : farmer.contractEmployment,
                deleted: req.body.deleted ? req.body.deleted : farmer.deleted,
                // userId: farmer.userId,
                email: req.body.email,
                nationalityObj: req.body.nationalityObj
                  ? req.body.nationalityObj
                  : farmer.nationalityObj,
                ageGroupsObj: req.body.ageGroupsObj
                  ? req.body.ageGroupsObj
                  : farmer.ageGroupsObj,
                populationGroupObj: req.body.populationGroupObj
                  ? req.body.populationGroupObj
                  : farmer.populationGroupObj,
                homeLanguageObj: req.body.homeLanguageObj
                  ? req.body.homeLanguageObj
                  : farmer.homeLanguageObj,
                educationObj: req.body.educationObj
                  ? req.body.educationObj
                  : farmer.educationObj,
                ownershipTypeObj: req.body.ownershipTypeObj
                  ? req.body.ownershipTypeObj
                  : farmer.ownershipTypeObj,
                landAquisitionObj: req.body.landAquisitionObj
                  ? req.body.landAquisitionObj
                  : farmer.landAquisitionObj,
                programmeRedistributionObj: req.body.programmeRedistributionObj
                  ? req.body.programmeRedistributionObj
                  : farmer.programmeRedistributionObj,
                updatedDate: new Date().setHours(0, 0, 0, 0),
                updatedBy: req.user._id,
                updatedByObj: {
                  email: req.user.email,
                  name: req.user.firstName + " " + req.user.lastName,
                },
                isDisabled: req.body.isDisabled,
              };

              FarmerDetail.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                updateObj,
                { new: true },
                function (err, result) {
                  if (err) {
                    return res.status(400).json({
                      success: false,
                      responseCode: 400,
                      msg: "Internal Server Error.",
                    });
                  } else {
                    var result = JSON.parse(JSON.stringify(result));

                    if (req.user._id)
                      loghistory(
                        req.user._id,
                        "Farmer Registration Updated",
                        "Update",
                        "farmer_details",
                        "Farmer Registraion edit",
                        req.get("referer"),
                        farmer,
                        result
                      );

                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: "Farmer details updated sucessfully.",
                      result,
                    });
                  }
                }
              );
            }
          }
        );
      }
    } else {
      //check for identity number if exists
      let farmerIDNumber = await FarmerDetail.findOne({
        identityNumber: req.body.identityNumber,
      });

      if (farmerIDNumber) {
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Identity Number already registered!, please try with another.",
        });
      } else {
        //add

        //var OTP = Math.floor(1000 + Math.random() * 9000);
        var signupObj = {
          farmerType: req.body.farmerType,
          surname: req.body.surname,
          name: req.body.name,
          identityNumber: req.body.identityNumber,
          contactNumber: req.body.contactNumber,
          nationality: req.body.nationality,
          email: req.body.email,
          residentialAddress: req.body.residentialAddress,
          residentialPostalcode: req.body.residentialPostalcode,
          postalcode: req.body.postalcode,
          postalAddress: req.body.postalAddress,
          farmingExperience: req.body.farmingExperience,
          farmingExperienceYears: req.body.farmingExperienceYears,
          gender: req.body.gender,
          ageGroups: req.body.ageGroups,
          populationGroup: req.body.populationGroup,
          populationGroupOther: req.body.populationGroupOther,
          homeLanguage: req.body.homeLanguage,
          homeLanguageOther: req.body.homeLanguageOther,
          education: req.body.education,
          operationType: req.body.operationType,
          isOwner: req.body.isOwner,
          ownershipType: req.body.ownershipType,
          otherOwnerShip: req.body.otherOwnerShip,
          landAquisition: req.body.landAquisition,
          landAquisitionOther: req.body.landAquisitionOther,
          programmeRedistribution: req.body.programmeRedistribution,
          programmeRedistributionOther: req.body.programmeRedistributionOther,
          noOfEmployees: req.body.noOfEmployees,
          parmanentEmployment: req.body.parmanentEmployment,
          seasonalEmployment: req.body.seasonalEmployment,
          contractEmployment: req.body.contractEmployment,
          //userId: userData._id,
          nationalityObj: req.body.nationalityObj,
          ageGroupsObj: req.body.ageGroupsObj,
          populationGroupObj: req.body.populationGroupObj,
          homeLanguageObj: req.body.homeLanguageObj,
          educationObj: req.body.educationObj,
          ownershipTypeObj: req.body.ownershipTypeObj,
          landAquisitionObj: req.body.landAquisitionObj,
          programmeRedistributionObj: req.body.programmeRedistributionObj,
          createdDate: new Date().setHours(0, 0, 0, 0),
          createdBy: req.user._id,
          createdByObj: {
            email: req.user.email,
            name: req.user.firstName + " " + req.user.lastName,
          },
          isDisabled: req.body.isDisabled,
        };

        var newUser = new FarmerDetail(signupObj);

        newUser.save(function (err) {
          console.log("errors", err);
          if (err) {
            if (
              (err.name === "BulkWriteError" || err.name === "MongoError") &&
              err.code === 11000
            ) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "please try with another.",
              });
            } else {
              if (err.errors && err.errors.mobilenumber)
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: err.errors.mobilenumber.message,
                });
              else
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "Some thing is wrong.",
                  error: err.errors,
                });
            }
          }
          var result = JSON.parse(JSON.stringify(newUser));
          if (req.user._id)
            loghistory(
              req.user._id,
              "Farmer Registration Add",
              "Add",
              "farmer_details",
              "Add Farmer Registration",
              req.get("referer"),
              null,
              result
            );
          res.status(200).json({
            success: true,
            responseCode: 200,
            msg: req.body.name + " registered successfully.",
            result: result,
          });
        });
      }
    }
  }
});

/**************END REGISTER API*************/

/**
 * @swagger
 * /api/updatefarmerDetails:
 *   post:
 *     tags:
 *       - Update - Farmer Personal Details
 *     description: Returns updated object of Farmer Details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: id of farmer
 *         in: formData
 *         type: string
 *       - name: farmerType
 *         description: farmer type
 *         in: formData
 *         required: true
 *         type: string
 *       - name: surname
 *         description: surname of farmer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: name
 *         description: name of farmer
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: emailaddress of farmer
 *         in: formData
 *         type: string
 *         format: email
 *       - name: identityNumber
 *         description: identity no of farmer (Unique)
 *         in: formData
 *         required: true
 *         type: string
 *       - name: contactNumber
 *         description: Phone/Mobile no of farmer
 *         in: formData
 *         type: string
 *       - name: nationality
 *         description: SELECT nationality of farmer
 *         in: formData
 *       - name: farmerType
 *         description: farmerType
 *         in: formData
 *         type: string
 *       - name: residentialAddress
 *         description: residential Address of farmer
 *         in: formData
 *         type: string
 *       - name: residentialPostalcode
 *         description: residentialPostalcode of farmer
 *         in: formData
 *         type: string
 *       - name: postalAddress
 *         description: postal address of farmer
 *         in: formData
 *         type: string
 *       - name: postalcode
 *         description: postalcode of farmer
 *         in: formData
 *         type: string
 *       - name: farmingExperience
 *         description: Experience of farming
 *         in: formData
 *         type: string
 *       - name: farmingExperienceYears
 *         description: Years of Experience in farming
 *         in: formData
 *         type: number
 *       - name: ageGroups
 *         description: (ID) SELECT ageGroups
 *         in: formData
 *       - name: gender
 *         description: gender of farmer
 *         in: formData
 *         type: string
 *       - name: populationGroup
 *         description: (ID) SELECT populationGroup
 *         in: formData
 *       - name: populationGroupOther
 *         description: populationGroup Other of farmer
 *         in: formData
 *         type: string
 *       - name: homeLanguage
 *         description: (ID) SELECT homeLanguage
 *         in: formData
 *       - name: homeLanguageOther
 *         description: homeLanguageOther of farmer
 *         in: formData
 *         type: string
 *       - name: education
 *         description: (ID) SELECT education
 *         in: formData
 *       - name: educationOther
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: operationType
 *         description: (ID) SELECT type of operation
 *         in: formData
 *         type: string
 *       - name: isOwner
 *         description: farmer is owner of not
 *         in: formData
 *         type: boolean
 *       - name: ownershipType
 *         description: (ID) SELECT ownershipType
 *         in: formData
 *       - name: otherOwnerShip
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: landAquisition
 *         description: (ID) SELECT landAquisition
 *         in: formData
 *       - name: landAquisitionOther
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: programmeRedistribution
 *         description: (ID) SELECT programmeRedistribution
 *         in: formData
 *         type: string
 *       - name: programmeRedistributionOther
 *         description: Other specify
 *         in: formData
 *         type: string
 *       - name: noOfEmployees
 *         description: Total No. of Male, Female, Youth, With Disability
 *         in: formData
 *         type: object
 *       - name: parmanentEmployment
 *         description: Number of Male, Female, Youth Male, Youth Female
 *         in: formData
 *         type: object
 *       - name: seasonalEmployment
 *         description: Number of Male, Female, Youth Male, Youth Female
 *         in: formData
 *         type: object
 *       - name: contractEmployment
 *         description: Number of Male, Female, Youth Male, Youth Female
 *         in: formData
 *         type: object
 *       - name: nationalityObj
 *         description: _id- Nationality, cndName- Nationality Text
 *         in: formData
 *         type: object
 *       - name: ageGroupsObj
 *         description: _id- ageGroups, cndName- ageGroups Text
 *         in: formData
 *         type: object
 *       - name: populationGroupObj
 *         description: _id- populationGroup, cndName- populationGroup Text
 *         in: formData
 *         type: object
 *       - name: homeLanguageObj
 *         description: _id- homeLanguage, cndName- homeLanguage Text
 *         in: formData
 *         type: object
 *       - name: educationObj
 *         description: _id- education, cndName- education Text
 *         in: formData
 *         type: object
 *       - name: ownershipTypeObj
 *         description: _id- ownershipType, cndName- ownershipType Text
 *         in: formData
 *         type: object
 *       - name: landAquisitionObj
 *         description: _id- landAquisition, cndName- landAquisition Text
 *         in: formData
 *         type: object
 *       - name: programmeRedistributionObj
 *         description: _id- Redistribution, cndName- Redistribution Text
 *         in: formData
 *         type: object
 *     responses:
 *       200:
 *         description: An Object of farmer details with updated data
 *         schema:
 *            $ref: '#/definitions/FarmerDetail'
 */

/************FARMER UPDATE API************************* */
router.post("/api/updatefarmerDetails", auth, async function (req, res) {
  if (!req.body.id) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "id is mandatory to update farmer details",
    });
  } else {
    FarmerDetail.findOne(
      {
        _id: req.body.id,
      },
      async function (err, farmer) {
        if (err) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Internal Server Error.",
          });
        }
        if (!farmer) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Farmer with given id not exists!",
          });
        } else {
          /*
          try {
            var updateUserObj = {
              firstName: req.body.name ? req.body.name : farmer.name,
              lastName: req.body.surname ? req.body.surname : farmer.surname,
              userName: req.body.userName ? req.body.userName : farmer.userName,
              phone: req.body.contactNumber
                ? req.body.contactNumber
                : farmer.contactNumber,
            };
            if (req.body.password) {
              updateUserObj.password = req.body.password;
            }

            let user = await User.findOneAndUpdate(
              {
                _id: farmer.userId,
              },
              updateUserObj
            );
          } catch (error) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Something went wrong.",
              error: error,
            });
          }
          */
          FarmerDetail.findOneAndUpdate(
            {
              _id: req.body.id,
            },
            {
              surname: req.body.surname ? req.body.surname : farmer.surname,
              name: req.body.name ? req.body.name : farmer.name,
              identityNumber: req.body.identityNumber
                ? req.body.identityNumber
                : farmer.identityNumber,
              contactNumber: req.body.contactNumber
                ? req.body.contactNumber
                : farmer.contactNumber,
              nationality: req.body.nationality
                ? req.body.nationality
                : farmer.nationality,
              residentialAddress: req.body.residentialAddress
                ? req.body.residentialAddress
                : farmer.residentialAddress,
              postalAddress: req.body.postalAddress
                ? req.body.postalAddress
                : farmer.postalAddress,
              residentialPostalcode: req.body.residentialPostalcode
                ? req.body.residentialPostalcode
                : farmer.residentialPostalcode,
              postalcode: req.body.postalcode
                ? req.body.postalcode
                : farmer.postalcode,
              farmingExperience: req.body.farmingExperience
                ? req.body.farmingExperience
                : farmer.farmingExperience,
              gender: req.body.gender ? req.body.gender : farmer.gender,
              ageGroups: req.body.ageGroups
                ? req.body.ageGroups
                : farmer.ageGroups,
              populationGroup: req.body.populationGroup
                ? req.body.populationGroup
                : farmer.populationGroup,
              populationGroupOther: req.body.populationGroupOther
                ? req.body.populationGroupOther
                : farmer.populationGroupOther,
              homeLanguage: req.body.homeLanguage
                ? req.body.homeLanguage
                : farmer.homeLanguage,
              homeLanguageOther: req.body.homeLanguageOther
                ? req.body.homeLanguageOther
                : farmer.homeLanguageOther,
              education: req.body.education
                ? req.body.education
                : farmer.education,
              operationType: req.body.operationType
                ? req.body.operationType
                : farmer.operationType,
              isOwner: req.body.isOwner ? req.body.isOwner : farmer.isOwner,
              ownershipType: req.body.ownershipType
                ? req.body.ownershipType
                : farmer.ownershipType,
              otherOwnerShip: req.body.otherOwnerShip
                ? req.body.otherOwnerShip
                : farmer.otherOwnerShip,
              landAquisition: req.body.landAquisition
                ? req.body.landAquisition
                : farmer.landAquisition,
              landAquisitionOther: req.body.landAquisitionOther
                ? req.body.landAquisitionOther
                : farmer.landAquisitionOther,
              programmeRedistribution: req.body.programmeRedistribution
                ? req.body.programmeRedistribution
                : farmer.programmeRedistribution,
              programmeRedistributionOther: req.body
                .programmeRedistributionOther
                ? req.body.programmeRedistributionOther
                : farmer.programmeRedistributionOther,
              noOfEmployees: req.body.noOfEmployees
                ? req.body.noOfEmployees
                : farmer.noOfEmployees,
              parmanentEmployment: req.body.parmanentEmployment
                ? req.body.parmanentEmployment
                : farmer.parmanentEmployment,
              seasonalEmployment: req.body.seasonalEmployment
                ? req.body.seasonalEmployment
                : farmer.seasonalEmployment,
              contractEmployment: req.body.contractEmployment
                ? req.body.contractEmployment
                : farmer.contractEmployment,
              //customerName: req.body.customerName,
              //email: req.body.email,
              nationalityObj: req.body.nationalityObj
                ? req.body.nationalityObj
                : farmer.nationalityObj,
              ageGroupsObj: req.body.ageGroupsObj
                ? req.body.ageGroupsObj
                : farmer.ageGroupsObj,
              populationGroupObj: req.body.populationGroupObj
                ? req.body.populationGroupObj
                : farmer.populationGroupObj,
              homeLanguageObj: req.body.homeLanguageObj
                ? req.body.homeLanguageObj
                : farmer.homeLanguageObj,
              educationObj: req.body.educationObj
                ? req.body.educationObj
                : farmer.educationObj,
              ownershipTypeObj: req.body.ownershipTypeObj
                ? req.body.ownershipTypeObj
                : farmer.ownershipTypeObj,
              landAquisitionObj: req.body.landAquisitionObj
                ? req.body.landAquisitionObj
                : farmer.landAquisitionObj,
              programmeRedistributionObj: req.body.programmeRedistributionObj
                ? req.body.programmeRedistributionObj
                : farmer.programmeRedistributionObj,
              deleted: req.body.deleted ? req.body.deleted : farmer.deleted,
              updatedBy: req.user._id,
              updatedDate: new Date().setHours(0, 0, 0, 0),
              updatedByObj: {
                email: req.user.email,
                name: req.user.firstName + " " + req.user.lastName,
              },
            },
            { new: true },
            function (err, result) {
              if (err) {
                console.log("err", err);
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "Internal Server Error.",
                });
              } else {
                var result = JSON.parse(JSON.stringify(result));
                res.status(200).json({
                  success: true,
                  responseCode: 200,
                  msg: "Farmer details updated sucessfully.",
                  result,
                });
              }
            }
          );
        }
      }
    );
  }
});

/**************FARMER UPDATE  API*************/

/************Start Farmers List API ************************* */
/**
 * @swagger
 * /api/farmersList:
 *   get:
 *     tags:
 *       - Farmers List
 *     description: Returns a Farmers list according to params
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         in:  query
 *         type: string
 *       - name: email
 *         in:  query
 *         type: string
 *     responses:
 *       200:
 *         description: Array list of Farmers
 *         schema:
 *          type: object
 *          properties:
 *           status:
 *            type: string
 *           totalRecCount:
 *            type: integer
 *           result:
 *            type: array
 *            items:
 *             $ref: '#/definitions/FarmerDetail'
 *
 *
 */
/************* Farmers LIST API****************/
/*router.get("/api/farmersList", function(req, res) {

  var dbquery = {};
  if (req.query.name) {
    dbquery.name = req.query.name;
  }

  if (req.query.email) {
    dbquery.country = req.query.email;
  }
  if (req.query.status) {
    dbquery.status = req.query.status;
  }

  if (req.query.deleted) {
    dbquery.status = req.query.deleted;
  }

  /******* pagination query started here ***********/
/*var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  var sort_field = "_id";
  var sort_mode = -1;

  if (req.query.sort_field) {
    sort_field = req.query.sort_field;
  }

  if (req.query.sort_mode) {
    var var_sort_mode = req.query.sort_mode;
    if (var_sort_mode == "descend") {
      sort_mode = -1;
    } else {
      sort_mode = 1;
    }
  }

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1"
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  console.log("query================", dbquery);

  /******* pagination query end here****************/

/************total count query start here ********/
// Find some documents
/*FarmerDetail.find(dbquery)
    .count()
    .exec(function(err, totalCount) {
      console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data"
        });
      }
      FarmerDetail.find(dbquery, {})
        //.populate("farmerProduction")
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function(err, info) {
          if (err) {
            res.status(400).json({
              success: false,
              result: "Something went wrong",
              msg: "Something went wrong",
              responseCode: 400,
              error: err
            });
          } else {
            var results = [];

            //    var totalPages = Math.ceil(totalCount / size)
            res.status(200).json({
              success: true,
              responseCode: 200,
              msg: "List fetched successfully",
              result: info,
              totalRecCount: totalCount
            });
          }
        });
    });
});
*/

/************* Farmers LIST API****************/
const getFarmers = async (
  skipArg,
  limitArg,
  dbquery,
  dbquery_search,
  sort_field,
  sort_mode,
  dbquery_createdDateG,
  dbquery_updatedDateG
) => {
  let docs = await FarmerDetail.aggregate([
    {
      $match: {
        $and: [
          { status: { $ne: "Deleted" } },
          dbquery,
          {
            $or: [
              { surname: { $regex: dbquery_search, $options: "i" } },
              { name: { $regex: dbquery_search, $options: "i" } },
              {
                identityNumber: { $regex: dbquery_search, $options: "i" },
              },
              {
                contactNumber: { $regex: dbquery_search, $options: "i" },
              },
              { farmerType: { $regex: dbquery_search, $options: "i" } },
            ],
          },
          { $or: [dbquery_createdDateG, dbquery_updatedDateG] },
        ],
      },
    },
    { $sort: { [sort_field]: sort_mode } },
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
  ]);

  //console.log("ddd occccs : ", docs);
  return docs;
};

router.get("/api/farmersList", auth, async (req, res) => {
  let dbquery = {};
  var dbquery_search = "";

  if (req.query.farmerId) {
    dbquery._id = req.query.farmerId;
    dbquery_search = req.query.farmerId;
  }

  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /////////get data based on date if any new farmers are added after android import//////////////

  let dbquery_createdDateG = {},
    dbquery_updatedDateG = {};
  let dateVar = "";
  var datex = moment(
    req.query.searchDate &&
      req.query.searchDate !== "" &&
      req.query.searchDate !== "ALL"
      ? req.query.searchDate
      : ""
  );
  if (datex.isValid() === true) {
    dateVar = moment(req.query.searchDate).format("X");
    dateVar = dateVar + "000";
    dbquery_createdDateG.createdDate = { $gte: parseFloat(dateVar) };
    dbquery_updatedDateG.updatedDate = { $gte: parseFloat(dateVar) };
  }

  //below is not required as the object will pass as empty
  // else {
  //   dbquery_createdDateG.createdDate = { $gte: 0 };
  //   dbquery_updatedDateG.updatedDate = { $gte: 0 };
  // }
  // if (
  //   req.query.searchDate &&
  //   req.query.searchDate !== "" &&
  //   req.query.searchDate.toLowerCase() === "all"
  // ) {
  //   dbquery_createdDateG.createdDate = { $gte: 0 };
  //   dbquery_updatedDateG.updatedDate = { $gte: 0 };
  // }

  ///////////////////////

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo ? req.query.pageNo : 1); //req.query.pageNo
  var size = parseInt(req.query.per_page ? req.query.per_page : 2000); //

  var sort_field = "_id";
  var sort_mode = -1;

  if (req.query.sort_field) {
    sort_field = req.query.sort_field;
  }

  if (req.query.sort_mode) {
    var var_sort_mode = req.query.sort_mode;
    if (var_sort_mode == "descend") {
      sort_mode = -1;
    } else {
      sort_mode = 1;
    }
  }

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  /******* pagination query end here****************/

  const getFarmersObj = await getFarmers(
    query.skip,
    query.limit,
    dbquery,
    dbquery_search,
    sort_field,
    sort_mode,
    dbquery_createdDateG,
    dbquery_updatedDateG
  );

  // console.log("getFarmersObj : ", getFarmersObj.count[0].totalRecords);

  const totalFarmers = await FarmerDetail.countDocuments({
    $and: [
      { status: { $ne: "Deleted" } },
      dbquery,
      {
        $or: [
          { surname: { $regex: dbquery_search, $options: "i" } },
          { name: { $regex: dbquery_search, $options: "i" } },
          {
            identityNumber: { $regex: dbquery_search, $options: "i" },
          },
          {
            contactNumber: { $regex: dbquery_search, $options: "i" },
          },
          { farmerType: { $regex: dbquery_search, $options: "i" } },
        ],
        //$or: [dbquery_createdDateG, dbquery_updatedDateG],
      },
      { $or: [dbquery_createdDateG, dbquery_updatedDateG] },
    ],
  });
  // console.log("totalFarmers : ", totalFarmers);

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    result: getFarmersObj,
    totalRecCount: totalFarmers,
  });
});

//below method is used for Android importing farmers
const getFarmersImport = async (
  skipArg,
  limitArg,
  dbquery_createdDateG,
  dbquery_updatedDateG
) => {
  let docs = await FarmerDetail.aggregate([
    {
      $match: {
        $and: [
          { status: { $ne: "Deleted" } },
          { $or: [dbquery_createdDateG, dbquery_updatedDateG] },
        ],
      },
    },
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
  ]);

  return docs;
};

router.get("/api/farmersimport", auth, async (req, res) => {
  /////////get data based on date if any new farmers are added after android import//////////////

  let dbquery_createdDateG = {},
    dbquery_updatedDateG = {};
  let dateVar = "";
  var datex = moment(
    req.query.searchDate &&
      req.query.searchDate !== "" &&
      req.query.searchDate !== "ALL"
      ? req.query.searchDate
      : ""
  );
  if (datex.isValid() === true) {
    dateVar = moment(req.query.searchDate).format("X");
    dateVar = dateVar + "000";
    dbquery_createdDateG.createdDate = { $gte: parseFloat(dateVar) };
    dbquery_updatedDateG.updatedDate = { $gte: parseFloat(dateVar) };
  }

  //below is not required as the object will pass as empty
  // else {
  //   dbquery_createdDateG.createdDate = { $gte: 0 };
  //   dbquery_updatedDateG.updatedDate = { $gte: 0 };
  // }
  // if (
  //   req.query.searchDate &&
  //   req.query.searchDate !== "" &&
  //   req.query.searchDate.toLowerCase() === "all"
  // ) {
  //   dbquery_createdDateG.createdDate = { $gte: 0 };
  //   dbquery_updatedDateG.updatedDate = { $gte: 0 };
  // }

  ///////////////////////

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo ? req.query.pageNo : 1); //req.query.pageNo
  var size = parseInt(req.query.per_page ? req.query.per_page : 2000); //

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  /******* pagination query end here****************/

  const getFarmersObj = await getFarmersImport(
    query.skip,
    query.limit,
    dbquery_createdDateG,
    dbquery_updatedDateG
  );

  const totalFarmers = await FarmerDetail.countDocuments({
    $and: [
      { status: { $ne: "Deleted" } },
      { $or: [dbquery_createdDateG, dbquery_updatedDateG] },
    ],
  });

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    result: getFarmersObj,
    totalRecCount: totalFarmers,
  });
});

//made it old on 25-mar-2021
router.get("/api/farmersListOld", async (req, res) => {
  let dbquery = {};
  var dbquery_search = "";

  if (req.query.farmerId) {
    dbquery._id = req.query.farmerId;
    dbquery_search = req.query.farmerId;
  }

  if (req.query.name) {
    dbquery.name = req.query.name;
  }

  if (req.query.email) {
    dbquery.email = req.query.email;
  }
  if (req.query.status) {
    dbquery.status = req.query.status;
  }

  if (req.query.deleted) {
    dbquery.status = req.query.deleted;
  }

  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  var sort_field = "_id";
  var sort_mode = -1;

  if (req.query.sort_field) {
    sort_field = req.query.sort_field;
  }

  if (req.query.sort_mode) {
    var var_sort_mode = req.query.sort_mode;
    if (var_sort_mode == "descend") {
      sort_mode = -1;
    } else {
      sort_mode = 1;
    }
  }

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  //console.log("dbquery_search : ", dbquery_search);
  //console.log("query.skip : ", query.skip);
  //console.log("query.limit : ", query.limit);
  /******* pagination query end here****************/
  let finalResult = [];
  await FarmerDetail.find({
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
  })
    .count()
    .exec(async function (err, totalCount) {
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }

      let docs = await FarmerDetail.find(
        {
          $and: [
            dbquery,
            {
              $or: [
                { surname: { $regex: dbquery_search, $options: "i" } },
                { name: { $regex: dbquery_search, $options: "i" } },
                { identityNumber: { $regex: dbquery_search, $options: "i" } },
                { contactNumber: { $regex: dbquery_search, $options: "i" } },
                { farmerType: { $regex: dbquery_search, $options: "i" } },
                { gender: { $regex: dbquery_search, $options: "i" } },
              ],
            },
          ],
        },
        {
          _id: 1,
          surname: 1,
          name: 1,
          identityNumber: 1,
          contactNumber: 1,
          farmerType: 1,
        }
      )

        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit);

      for (var i = 0; i < docs.length; i++) {
        let obj = {};
        obj["_id"] = docs[i]._id;
        obj["farmerType"] = docs[i].farmerType;
        obj["surname"] = docs[i].surname;
        obj["name"] = docs[i].name;
        obj["contactNumber"] = docs[i].contactNumber;
        obj["identityNumber"] = docs[i].identityNumber;

        let farmerProduction = await FarmerProduction.find(
          {
            farmerId: docs[i]._id,
            // "farmMuncipalRegion.cndName": "MBOMBELA",
          },
          {
            farmMuncipalRegion: 1,
            farmName: 1,
            totalFarmSize: 1,
            liveStock: 1,
            liveStockOther: 1,
          }
        ).populate({
          path: "farmMuncipalRegion",
          model: "cnds",
          select: "cndName -_id",
          // match: {
          //   "farmMuncipalRegion.cndName": "MBOMBELA",
          // },
        });

        obj["farmerProduction"] = farmerProduction[0];

        let farmerAssets = await FarmAssetsServices.find({
          farmerId: docs[i]._id,
        }).populate({
          path: "annualTurnover",
          model: "cnds",
        });

        obj["farmerAsset"] = farmerAssets[0];

        finalResult.push(obj);
      }
      // console.log("doc final : ", finalResult);

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "List fetched successfully",
        //result: docs[0].data,
        result: finalResult,
        totalRecCount: totalCount,
      });
      // });
    });
});

///using this for web for fast retrieval//////06-Jul-2021
//for fetching 1000 records, find & aggregation taking same time. but for 10 records, find takes less time
router.post("/api/farmerslistnew", auth, async (req, res) => {
  let dbquery = {},
    dbquery_search = "",
    CreatedDateQuery = {},
    createdByQuery = {},
    approverStatusQuery = {},
    childArray = [],
    approverStatus = "";

  if (req.query.farmerId) {
    dbquery._id = req.query.farmerId;
    dbquery_search = req.query.farmerId;
  }

  if (req.body) {
    if (req.body.childArray) childArray = req.body.childArray.map((a) => a._id);
    if (req.body.approvalStatus) approverStatus = req.body.approvalStatus;
  }
  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  if (req.body.startDate && !req.body.endDate) {
    CreatedDateQuery.createdDate = {
      $gte: req.body.startDate,
    };
  }

  if (req.body.endDate && !req.body.startDate) {
    CreatedDateQuery.createdDate = { $lte: req.body.endDate };
  }

  if (req.body.startDate && req.body.endDate) {
    CreatedDateQuery.createdDate = {
      $gte: req.body.startDate,
      $lte: req.body.endDate,
    };
  }

  if (
    dbquery &&
    Object.keys(dbquery).length === 0 &&
    dbquery.constructor === Object &&
    req.body.childArray
  )
    createdByQuery.createdBy = childArray;

  if (approverStatus !== "") {
    approverStatusQuery.approverStatus = approverStatus;
  }

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  /******* pagination query end here****************/
  /////////get data based on date//////////////

  const totalFarmers = await FarmerDetail.countDocuments({
    $and: [
      { status: { $ne: "Deleted" } },
      dbquery,
      createdByQuery,
      approverStatusQuery,
      CreatedDateQuery,
      {
        $or: [
          { surname: { $regex: dbquery_search, $options: "i" } },
          { name: { $regex: dbquery_search, $options: "i" } },
          { identityNumber: { $regex: dbquery_search, $options: "i" } },
          { contactNumber: { $regex: dbquery_search, $options: "i" } },
        ],
      },
    ],
  });

  let docs = await FarmerDetail.find(
    {
      $and: [
        { status: { $ne: "Deleted" } },
        dbquery,
        createdByQuery,
        approverStatusQuery,
        CreatedDateQuery,
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
    },
    {
      _id: 1,
      surname: 1,
      name: 1,
      identityNumber: 1,
      contactNumber: 1,
      nationality: 1,
      nationalityObj: 1,
      email: 1,
      residentialAddress: 1,
      residentialPostalcode: 1,
      postalcode: 1,
      postalAddress: 1,
      farmingExperience: 1,
      farmingExperienceYears: 1,
      ageGroups: 1,
      ageGroupsObj: 1,
      gender: 1,
      populationGroup: 1,
      populationGroupObj: 1,
      populationGroupOther: 1,
      homeLanguage: 1,
      homeLanguageObj: 1,
      homeLanguageOther: 1,
      education: 1,
      educationObj: 1,
      operationType: 1,
      isOwner: 1,
      ownershipType: 1,
      ownershipTypeObj: 1,
      otherOwnerShip: 1,
      landAquisition: 1,
      landAquisitionObj: 1,
      landAquisitionOther: 1,
      programmeRedistribution: 1,
      programmeRedistributionObj: 1,
      programmeRedistributionOther: 1,
      noOfEmployees: 1,
      parmanentEmployment: 1,
      seasonalEmployment: 1,
      contractEmployment: 1,
      farmerType: 1,
      isDisabled: 1,
      approverStatus: 1,
    }
  )
    .sort({ _id: -1 })
    .skip(query.skip)
    .limit(query.limit);

  var _idArray = docs.map(function (el) {
    return el._id;
  });

  //console.log("_idArray : ", _idArray);

  let farmerProduction = await FarmerProduction.find({
    farmerId: _idArray,
  });
  let farmerAssetsServices = await FarmAssetsServices.find({
    farmerId: _idArray,
  });

  let finalResult = [];

  for (let i = 0; i < docs.length; i++) {
    let obj = {};
    obj["_id"] = docs[i]._id;
    obj["surname"] = docs[i].surname;
    obj["name"] = docs[i].name;
    obj["identityNumber"] = docs[i].identityNumber;
    obj["contactNumber"] = docs[i].contactNumber;
    obj["nationality"] = docs[i].nationality;
    obj["nationalityObj"] = docs[i].nationalityObj;
    obj["email"] = docs[i].email;
    obj["residentialAddress"] = docs[i].residentialAddress;
    obj["residentialPostalcode"] = docs[i].residentialPostalcode;
    obj["postalcode"] = docs[i].postalcode;
    obj["postalAddress"] = docs[i].postalAddress;
    obj["farmingExperience"] = docs[i].farmingExperience;
    obj["farmingExperienceYears"] = docs[i].farmingExperienceYears;
    obj["ageGroups"] = docs[i].ageGroups;
    obj["ageGroupsObj"] = docs[i].ageGroupsObj;
    obj["gender"] = docs[i].gender;
    obj["populationGroup"] = docs[i].populationGroup;
    obj["populationGroupObj"] = docs[i].populationGroupObj;
    obj["populationGroupOther"] = docs[i].populationGroupOther;
    obj["homeLanguage"] = docs[i].homeLanguage;
    obj["homeLanguageObj"] = docs[i].homeLanguageObj;
    obj["homeLanguageOther"] = docs[i].homeLanguageOther;
    obj["education"] = docs[i].education;
    obj["educationObj"] = docs[i].educationObj;
    obj["operationType"] = docs[i].operationType;
    obj["isOwner"] = docs[i].isOwner;
    obj["ownershipType"] = docs[i].ownershipType;
    obj["ownershipTypeObj"] = docs[i].ownershipTypeObj;
    obj["otherOwnerShip"] = docs[i].otherOwnerShip;
    obj["landAquisition"] = docs[i].landAquisition;
    obj["landAquisitionObj"] = docs[i].landAquisitionObj;
    obj["landAquisitionOther"] = docs[i].landAquisitionOther;
    obj["programmeRedistribution"] = docs[i].programmeRedistribution;
    obj["programmeRedistributionObj"] = docs[i].programmeRedistributionObj;
    obj["programmeRedistributionOther"] = docs[i].programmeRedistributionOther;
    obj["noOfEmployees"] = docs[i].noOfEmployees;
    obj["parmanentEmployment"] = docs[i].parmanentEmployment;
    obj["seasonalEmployment"] = docs[i].seasonalEmployment;
    obj["contractEmployment"] = docs[i].contractEmployment;
    obj["farmerType"] = docs[i].farmerType;
    obj["isDisabled"] = docs[i].isDisabled;
    obj["approverStatus"] = docs[i].approverStatus;

    let doc2 = farmerProduction.find(
      (item) => item.farmerId == docs[i]._id + ""
    );
    let doc3 = farmerAssetsServices.find(
      (item) => item.farmerId == docs[i]._id + ""
    );

    obj["farmerProduction"] = [doc2];
    obj["farmerAssetsServices"] = [doc3];

    finalResult.push(obj);
  }

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    result: finalResult,
    totalRecCount: totalFarmers,
  });
  // });
});
/************End Farmers List API ************************* */

router.get("/api/farmersDDL", async (req, res) => {
  let dbquery = {};
  var dbquery_search = "";

  if (req.query.farmerId) {
    dbquery._id = req.query.farmerId;
    dbquery_search = req.query.farmerId;
  }

  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  var sort_field = "_id";
  var sort_mode = -1;

  if (req.query.sort_field) {
    sort_field = req.query.sort_field;
  }

  if (req.query.sort_mode) {
    var var_sort_mode = req.query.sort_mode;
    if (var_sort_mode == "descend") {
      sort_mode = -1;
    } else {
      sort_mode = 1;
    }
  }

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  //console.log("dbquery_search : ", dbquery_search);
  //console.log("query.skip : ", query.skip);
  //console.log("query.limit : ", query.limit);
  /******* pagination query end here****************/
  // await FarmerDetail.find({
  //   $and: [
  //     dbquery,
  //     {
  //       $or: [
  //         { surname: { $regex: dbquery_search, $options: "i" } },
  //         { name: { $regex: dbquery_search, $options: "i" } },
  //         { identityNumber: { $regex: dbquery_search, $options: "i" } },
  //         { contactNumber: { $regex: dbquery_search, $options: "i" } },
  //       ],
  //     },
  //   ],
  // })
  //   .count()
  //   .exec(async function (err, totalCount) {
  //     if (err) {
  //       res.status(400).json({
  //         success: false,
  //         responseCode: 400,
  //         result: "Error fetching data",
  //         msg: "Error fetching data",
  //       });
  //     }

  let docs = await FarmerDetail.find(
    {
      $and: [
        { status: { $ne: "Deleted" } },
        dbquery,
        {
          $or: [
            { surname: { $regex: dbquery_search, $options: "i" } },
            { name: { $regex: dbquery_search, $options: "i" } },
            { identityNumber: { $regex: dbquery_search, $options: "i" } },
            { contactNumber: { $regex: dbquery_search, $options: "i" } },
          ],
        },
      ],
    },
    {
      _id: 1,
      surname: 1,
      name: 1,
      identityNumber: 1,
      contactNumber: 1,
    }
  )
    .sort({ [sort_field]: sort_mode })
    .skip(query.skip)
    .limit(query.limit);

  const totalFarmers = await FarmerDetail.countDocuments({
    $and: [
      { status: { $ne: "Deleted" } },
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

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    //result: docs[0].data,
    result: docs,
    totalRecCount: totalFarmers,
  });
  // });
  //});
});

/************* Get Single farmer API****************/
router.get("/api/farmerlist/:id", auth, function (req, res) {
  FarmerDetail.find({ _id: req.params.id }).exec(function (err, resInfo) {
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
        result: resInfo,
        msg: "List fetching successfully",
      });
    }
  });
});
/************End Get Single KPI API ************************* */

router.get("/api/farmerDetailsHistory", auth, async function (req, res) {
  let dbquery = {};

  if (req.query.farmerId) {
    dbquery.farmerId = req.query.farmerId;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }

  if (req.query.name) {
    dbquery.name = req.query.name;
  }

  if (req.query.email) {
    dbquery.email = req.query.email;
  }
  if (req.query.status) {
    dbquery.status = req.query.status;
  }

  if (req.query.deleted) {
    dbquery.status = req.query.deleted;
  }

  FarmerDetailHistory.find()
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
      FarmerDetailHistory.find(dbquery, {}).exec(function (err, cndInfo) {
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
            result: cndInfo,
            totalRecCount: totalCount,
            msg: "List fetching successfully",
          });
        }
      });
    });
});

////////Delete Farmer//////////////////////////////////
router.delete("/api/deletefarmer", auth, async (req, res) => {
  const farmer = await FarmerDetail.findByIdAndUpdate(req.query.id, {
    deletedDate: Date.now(),
    status: "Deleted",
    deletedBy: req.user._id,
  });

  if (!farmer) return res.status(400).send("Record not found");
  const oldData = await FarmerDetail.findById(req.query.id);

  loghistory(
    req.user._id,
    "Farmer Deleted",
    "Delete",
    "Farmers",
    "Delete Farmer",
    req.get("referer"),
    oldData,
    null
  );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Record deleted sucessfully.",
    oldData,
  });
});

//get createdBy users of farmers records
router.post("/api/farmerusers", async function (req, res) {
  let farmers = await FarmerDetail.distinct("createdBy");

  let dbquery = {};

  if (req.body.district) dbquery.metroDistrict = req.body.district;

  if (req.body.municipality) dbquery.municipalRegion = req.body.municipality;

  let users = await User.find({
    $and: [{ _id: { $in: farmers } }, dbquery],
  });

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    result: users,
    totalRecCount: users.length,
  });
});

/************* Farmers Data API for Messaging App ***************/
router.get("/api/farmersData", auth, async function (req, res) {
  let dbquery_createdDateG = {},
    dbquery_updatedDateG = {};
  let dateVar = "";
  var datex = moment(
    req.query.searchDate &&
      req.query.searchDate !== "" &&
      req.query.searchDate !== "ALL"
      ? req.query.searchDate
      : ""
  );
  if (datex.isValid() === true) {
    dateVar = moment(req.query.searchDate).format("X");
    dateVar = dateVar + "000";
    dbquery_createdDateG.createdDate = { $eq: parseFloat(dateVar) };
    dbquery_updatedDateG.updatedDate = { $eq: parseFloat(dateVar) };
  } else {
    dbquery_createdDateG.createdDate = { $eq: 0 };
    dbquery_updatedDateG.updatedDate = { $eq: 0 };
  }
  if (
    req.query.searchDate &&
    req.query.searchDate !== "" &&
    req.query.searchDate.toLowerCase() === "all"
  ) {
    dbquery_createdDateG.createdDate = { $gte: 0 };
    dbquery_updatedDateG.updatedDate = { $gte: 0 };
  }

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo);
  var size = parseInt(req.query.per_page);

  var sort_field = "_id";
  var sort_mode = -1;

  if (req.query.sort_field) {
    sort_field = req.query.sort_field;
  }

  if (req.query.sort_mode) {
    var var_sort_mode = req.query.sort_mode;
    if (var_sort_mode == "descend") {
      sort_mode = -1;
    } else {
      sort_mode = 1;
    }
  }

  var query = {};
  if (pageNo < 0 || pageNo === 0) {
    response = {
      success: false,
      responseCode: 400,
      msg: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;

  /******* pagination query end here****************/

  FarmerDetail.find({
    $and: [
      { status: { $ne: "Deleted" } },
      {
        $or: [dbquery_createdDateG, dbquery_updatedDateG],
      },
    ],
  })
    .sort({ [sort_field]: sort_mode })
    .skip(query.skip)
    .limit(query.limit ? query.limit : 1000000)
    .exec(async function (err, docs) {
      if (err) throw err;

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "List fetched successfully",
        result: docs,
        totalRecCount: docs.length,
      });
    });
});

router.get("/api/getIntToken", async (req, res) => {
  let user = await User.findOne({ email: "admin@admin.com" }); //email can be passed dynamically
  if (!user) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Authentication failed. Invalid Email or Password.",
    });
  }

  var result = JSON.parse(JSON.stringify(user));

  await user.generateFarmerToken().then((data) => {
    result.farmersToken = data.farmersToken;
  });

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Token generated successfully.",
    result: result.farmersToken,
  });

  // res.send(response);
});

module.exports = router;
