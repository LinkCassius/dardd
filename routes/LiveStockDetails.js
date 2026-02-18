var mongoose = require("mongoose");
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var liveStockDetail = require("../models/liveStockDetails");
var User = require("../models/User");
var Cnd = require("../models/Cnds");
const Config = require("../config/config");
// import { try } from "bluebird";
const loghistory = require("./userhistory");

const { masterConst } = Config;

// /**
//  * @swagger
//  * /api/liveStockRegistration:
//  *   post:
//  *     tags:
//  *       - liveStock Signup / Registration with personal details
//  *     description: Returns a object of liveStock Details
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: commodityType
//  *         description: Name of Commodity
//  *         in: formData
//  *         required: true
//  *         type: object
//  *       - name: projectOrCooperativeName
//  *         description: Project name / Co-operative name
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: cooperativeRegNo
//  *         description: Co-operative registration number
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: reprasentativeName
//  *         description: Representative’s Name & Surname
//  *         in: formData
//  *         type: string
//  *       - name: reprasentativeIdNo
//  *         description: Representative’s ID number
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: telephone
//  *         description: Telephone
//  *         in: formData
//  *         type: string
//  *       - name: cell
//  *         description: Cell
//  *         in: formData
//  *         type: string
//  *       - name: fax
//  *         description: Fax
//  *         in: formData
//  *         type: string
//  *       - name: physicalOrBussinessAddress
//  *         description: Physical/Business address
//  *         in: formData
//  *         type: string
//  *       - name: postalAddress
//  *         description: Postal Address
//  *         in: formData
//  *         type: string
//  *       - name: district
//  *         description: District
//  *         in: formData
//  *         type: boolean
//  *       - name: localMunicipality
//  *         description: Local Municipality
//  *         in: formData
//  *         type: string
//  *       - name: areaName
//  *         description: Area name
//  *         in: formData
//  *         type: string
//  *       - name: wardNo
//  *         description: Ward Number
//  *         in: formData
//  *         type: string
//  *       - name: gpsCoordinates
//  *         description: GPS Coordinates
//  *         in: formData
//  *         type: string
//  *       - name: typeOfFarm
//  *         description: Type of farm
//  *         in: formData
//  *         type: object
//  *       - name: periodOfLeaseInYears
//  *         description: If Lease agreement indicate period of lease in years
//  *         in: formData
//  *         type: string
//  *       - name: landType
//  *         description: Total land size (ha)
//  *         in: formData
//  *         type: Object
//  *       - name: liveStockBrandMark
//  *         description: liveStock Brand mark
//  *         in: formData
//  *         type: string
//  *       - name: benficiaries
//  *         description: Total number of beneficiaries in Co-op / project
//  *         in: formData
//  *         type: object
//  *       - name: infrastructure
//  *         description: Water sources (River or not)
//  *         in: formData
//  *         type: object
//  *       - name: stockOnTheFarm
//  *         description: Different stock type with count
//  *         in: formData
//  *         type: object
//  *       - name: applicantOrReprasentativeName
//  *         description: Signature of applicant / representative
//  *         in: formData
//  *         type: string
//  *       - name: agriculturalAdviserName
//  *         description: Signature of Agricultural Advisor
//  *         in: formData
//  *         type: string
//  *       - name: agriculturalMunicipalManagerName
//  *         description: Signature of Agricultural Municipal Manager
//  *         in: formData
//  *         type: string
//  *       - name: finYear
//  *         description: Financial Year
//  *         in: formData
//  *         type: string
//  *
//  *     responses:
//  *       200:
//  *         description: An Object of registered user
//  *         schema:
//  *            $ref: '#/definitions/liveStockDetail'
//  */

/************liveStock REGISTER/SIGNUP API************************* */
router.post("/api/liveStockRegistration", async function (req, res) {
  {
    var signupObj = {
      commodityType: req.body.commodityType,
      projectOrCooperativeName: req.body.projectOrCooperativeName,
      cooperativeRegNo: req.body.cooperativeRegNo,
      reprasentativeName: req.body.reprasentativeName,
      reprasentativeIdNo: req.body.reprasentativeIdNo,
      telephone: req.body.telephone,
      cell: req.body.cell,
      fax: req.body.fax,
      physicalOrBussinessAddress: req.body.physicalOrBussinessAddress,
      postalAddress: req.body.postalAddress,
      district: req.body.district,
      localMunicipality: req.body.localMunicipality,
      areaName: req.body.areaName,
      wardNo: req.body.wardNo,
      gpsCoordinates: req.body.gpsCoordinates,
      typeOfFarm: req.body.typeOfFarm,
      periodOfLeaseInYears: req.body.periodOfLeaseInYears,
      landType: req.body.LandType,
      liveStockBrandMark: req.body.liveStockBrandMark == "Yes" ? true : false,
      beneficiaries: req.body.Beneficiaries,
      infrastructure: req.body.Infrastructure,
      stockOnTheFarm: req.body.StockOnTheFarm,
      applicantOrReprasentativeName: req.body.applicantOrReprasentativeName,
      agriculturalAdviserName: req.body.agriculturalAdviserName,
      agriculturalMunicipalManagerName:
        req.body.agriculturalMunicipalManagerName,
      userId: req.body.userId,
      finYear: req.body.finYear,
    };
    console.log(signupObj);

    var newUser = new liveStockDetail(signupObj);
    newUser.save(function (err) {
      if (err) {
        console.log(err);
        if (
          (err.name === "BulkWriteError" || err.name === "MongoError") &&
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
      var result = JSON.parse(JSON.stringify(newUser));

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: req.body.name + " registered successfully.",
        result: result,
      });
    });
  }
});

/**************END REGISTER API*************/

// /**
//  * @swagger
//  * /api/updateliveStockDetails:
//  *   post:
//  *     tags:
//  *       - liveStock Details Update
//  *     description: Returns updated object of liveStock Details
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: commodityType
//  *         description: Name of Commodity
//  *         in: formData
//  *         required: true
//  *         type: object
//  *       - name: projectOrCooperativeName
//  *         description: Project name / Co-operative name
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: cooperativeRegNo
//  *         description: Co-operative registration number
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: reprasentativeName
//  *         description: Representative’s Name & Surname
//  *         in: formData
//  *         type: string
//  *       - name: reprasentativeIdNo
//  *         description: Representative’s ID number
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: telephone
//  *         description: Telephone
//  *         in: formData
//  *         type: string
//  *       - name: cell
//  *         description: Cell
//  *         in: formData
//  *         type: string
//  *       - name: fax
//  *         description: Fax
//  *         in: formData
//  *         type: string
//  *       - name: physicalOrBussinessAddress
//  *         description: Physical/Business address
//  *         in: formData
//  *         type: string
//  *       - name: postalAddress
//  *         description: Postal Address
//  *         in: formData
//  *         type: string
//  *       - name: district
//  *         description: District
//  *         in: formData
//  *         type: boolean
//  *       - name: localMunicipality
//  *         description: Local Municipality
//  *         in: formData
//  *         type: string
//  *       - name: areaName
//  *         description: Area name
//  *         in: formData
//  *         type: string
//  *       - name: wardNo
//  *         description: Ward Number
//  *         in: formData
//  *         type: string
//  *       - name: gpsCoordinates
//  *         description: GPS Coordinates
//  *         in: formData
//  *         type: string
//  *       - name: typeOfFarm
//  *         description: Type of farm
//  *         in: formData
//  *         type: object
//  *       - name: periodOfLeaseInYears
//  *         description: If Lease agreement indicate period of lease in years
//  *         in: formData
//  *         type: string
//  *       - name: landType
//  *         description: Land type details
//  *         in: formData
//  *         type: string
//  *       - name: liveStockBrandMark
//  *         description: liveStock Brand mark
//  *         in: formData
//  *         type: string
//  *       - name: beneficiaries
//  *         description: Total number of beneficiaries in Co-op / project count
//  *         in: formData
//  *         type: object
//  *       - name: infrastructure
//  *         description: infrastructure details
//  *         in: formData
//  *         type: object
//  *       - name: stockOnTheFarm
//  *         description: Stock on the farm details
//  *         in: formData
//  *         type: string
//  *       - name: applicantOrReprasentativeName
//  *         description: Signature of applicant / representative
//  *         in: formData
//  *         type: string
//  *       - name: agriculturalAdviserName
//  *         description: Signature of Agricultural Advisor
//  *         in: formData
//  *         type: string
//  *       - name: agriculturalMunicipalManagerName
//  *         description: Signature of Agricultural Municipal Manager
//  *         in: formData
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of liveStock details with updated data
//  *         schema:
//  *            $ref: '#/definitions/liveStockDetail'
//  */

/************liveStock UPDATE API************************* */
router.post("/api/updateliveStockDetails", async function (req, res) {
  if (!req.body.id) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "id is mandatory to update liveStock details",
    });
  } else {
    liveStockDetail.findOne(
      {
        _id: req.body.id,
      },
      async function (err, liveStock) {
        if (err) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Internal Server Error.",
          });
        }
        if (!liveStock) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "liveStock with given id not exists!",
          });
        } else {
          try {
            liveStockDetail.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                commodityType: req.body.commodityType,
                projectOrCooperativeName: req.body.projectOrCooperativeName,
                cooperativeRegNo: req.body.cooperativeRegNo,
                reprasentativeName: req.body.reprasentativeName,
                reprasentativeIdNo: req.body.reprasentativeIdNo,
                telephone: req.body.telephone,
                cell: req.body.cell,
                fax: req.body.fax,
                physicalOrBussinessAddress: req.body.physicalOrBussinessAddress,
                postalAddress: req.body.postalAddress,
                district: req.body.district,
                localMunicipality: req.body.localMunicipality,
                areaName: req.body.areaName,
                wardNo: req.body.wardNo,
                gpsCoordinates: req.body.gpsCoordinates,
                typeOfFarm: req.body.typeOfFarm,
                periodOfLeaseInYears: req.body.periodOfLeaseInYears,
                landType: req.body.LandType,
                liveStockBrandMark:
                  req.body.liveStockBrandMark == "Yes" ? true : false,
                beneficiaries: req.body.Beneficiaries,
                infrastructure: req.body.Infrastructure,
                stockOnTheFarm: req.body.StockOnTheFarm,
                applicantOrReprasentativeName:
                  req.body.applicantOrReprasentativeName,
                agriculturalAdviserName: req.body.agriculturalAdviserName,
                agriculturalMunicipalManagerName:
                  req.body.agriculturalMunicipalManagerName,
                userId: req.body.userId,
                finYear: req.body.finYear,
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
                    msg: "liveStock details updated sucessfully.",
                    result,
                  });
                }
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    );
  }
});

/************* liveStocks LIST API****************/
router.get("/api/liveStocksList", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};

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
  console.log("query================", dbquery);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  liveStockDetail
    .find(dbquery)
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
      liveStockDetail
        .find(dbquery, {})
        .populate({
          path: "commodityType",
          model: "cnds",
        })
        .populate({
          path: "typeOfFarm",
          model: "cnds",
        })
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, cndInfo) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
            });
          } else {
            var results = [];
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

/************End Customer List API ************************* */

/************* Get Single liveStock API****************/
router.get("/api/liveStocksList/:id", function (req, res) {
  liveStockDetail.findById(req.params.id).exec(function (err, resInfo) {
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

module.exports = router;
