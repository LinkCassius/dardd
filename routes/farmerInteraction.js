var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var { User } = require("../models/User");
var Interactions = require("../models/FarmerInteractions");
var FarmerDetail = require("../models/FarmerDetail");
var FarmerProduction = require("../models/FarmerProduction");
var FarmAssetsServices = require("../models/FarmAssetsServices");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");
var moment = require("moment");
var UserHierarchy = require("./UserHierarchyFunc");

/**
 * @swagger
 * /api/interaction:
 *   post:
 *     tags:
 *       - Add / Update, List Interaction
 *     description: Returns a object of Interaction
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: farmerId
 *         description: objectId of farmer
 *         in: formData
 *         type: string
 *       - name: supervisor
 *         description: objectId of supervisor
 *         in: formData
 *       - name: serviceType
 *         description: Type of service
 *         in: formData
 *         type: string
 *       - name: serviceDate
 *         description: date of service
 *         in: formData
 *         type: date
 *       - name: serviceDescription
 *         description: service type description
 *         in: formData
 *         type: string
 *       - name: serviceSignature
 *         description: farmer signature
 *         in: formData
 *         type: string
 *       - name: additionalServices
 *         description: Additional Services required or requested
 *         in: formData
 *         type: string
 *       - name: proposals
 *         description: recommendations or proposals
 *         in: formData
 *         required: true
 *         type: string
 *       - name: referralDetails
 *         description: Referral Details
 *         in: formData
 *         required: true
 *         type: string
 *       - name: commodity
 *         description: commodity
 *         in: formData
 *         type: object
 *       - name: commodityOther
 *         description: other specify
 *         in: formData
 *         type: string
 *       - name: extensionSignature
 *         description: Extension Practitioner signature
 *         in: formData
 *         type: string
 *       - name: managerSignature
 *         description: Section Head or Agriculture Manager signature
 *         in: formData
 *         type: string
 *       - name: Farmer ID Upload
 *         description: Upload Image of Farmer ID
 *         in: formData
 *         type: string
 *       - name: createdBy
 *         description: Interaction Created By
 *         in: formData
 *     responses:
 *       200:
 *         description: An Object of Interaction
 *         schema:
 *            $ref: '#/definitions/FarmerInteraction'
 */

/************Start Interaction ADD/UPDATE API ************************* */
router.post("/api/interaction", auth, async function (req, res) {
  if (!req.body.farmerId) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please select farmer.",
    });
  } else {
    let docFarmer = await FarmerDetail.aggregate([
      {
        $match: {
          //identityNumber: req.body.identityNumber, //this is commented as there are duplicate data
          _id: mongoose.Types.ObjectId(req.body.farmerId),
        },
      },
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
          as: "farmer_assets_services",
        },
      },
      {
        $project: {
          //_id: 1,
          surname: 1,
          name: 1,
          //identityNumber: 1,
          contactNumber: 1,
          ageGroupsObj: 1,
          gender: 1,
          ownershipTypeObj: 1,
          farmerType: 1,
          isDisabled: 1,
          "farmerProduction.farmName": 1,
          "farmerProduction.totalFarmSize": 1,
          "farmerProduction.farmLatitude": 1,
          "farmerProduction.farmLongitude": 1,
          "farmerProduction.wardNumber": 1,
          "farmerProduction.projectLegalEntityName": 1,
          "farmerProduction.provinceObj": 1,
          "farmerProduction.metroDistrictObj": 1,
          "farmerProduction.farmMuncipalRegionObj": 1,
          "farmer_assets_services.docCollection": 1,
        },
      },
    ]);

    if (docFarmer.length > 0) {
      let farmerObj = {};

      farmerObj.surname = docFarmer[0].surname;
      farmerObj.name = docFarmer[0].name;
      farmerObj.farmerType = docFarmer[0].farmerType;
      farmerObj.contactNumber = docFarmer[0].contactNumber;
      farmerObj.ownershipTypeObj = docFarmer[0].ownershipTypeObj;
      farmerObj.ageGroupsObj = docFarmer[0].ageGroupsObj;
      farmerObj.gender = docFarmer[0].gender;
      farmerObj.isDisabled = docFarmer[0].isDisabled
        ? docFarmer[0].isDisabled
        : false;

      if (docFarmer[0].farmerProduction.length > 0) {
        farmerObj.farmName = docFarmer[0].farmerProduction[0].farmName;
        farmerObj.totalFarmSize =
          docFarmer[0].farmerProduction[0].totalFarmSize;
        farmerObj.farmLatitude = docFarmer[0].farmerProduction[0].farmLatitude;
        farmerObj.farmLongitude =
          docFarmer[0].farmerProduction[0].farmLongitude;
        farmerObj.wardNumber = docFarmer[0].farmerProduction[0].wardNumber;
        farmerObj.projectLegalEntityName =
          docFarmer[0].farmerProduction[0].projectLegalEntityName;
        farmerObj.provinceObj = docFarmer[0].farmerProduction[0].provinceObj;
        farmerObj.metroDistrictObj =
          docFarmer[0].farmerProduction[0].metroDistrictObj;
        farmerObj.farmMuncipalRegionObj =
          docFarmer[0].farmerProduction[0].farmMuncipalRegionObj;
      }
      if (docFarmer[0].farmer_assets_services.length > 0) {
        farmerObj.docCollection = docFarmer[0].farmer_assets_services[0]
          .docCollection
          ? docFarmer[0].farmer_assets_services[0].docCollection
          : "";
      }
      if (req.body.id) {
        /** Update Interaction **/
        Interactions.findOne(
          {
            _id: req.body.id,
          },
          function (err, interaction) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            if (!interaction) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Interaction with given id not exists!",
              });
            } else {
              if (!req.body.deviceType) req.body.deviceType = "web";

              let updateObj = {
                farmerId: docFarmer[0]._id,
                identityNumber: req.body.identityNumber
                  ? req.body.identityNumber
                  : interaction.identityNumber,
                supervisor: req.body.supervisor
                  ? req.body.supervisor
                  : interaction.supervisor,
                serviceType: req.body.serviceType
                  ? req.body.serviceType
                  : interaction.serviceType,
                serviceDate: req.body.serviceDate
                  ? req.body.serviceDate
                  : interaction.serviceDate,
                serviceSignature: req.body.serviceSignature
                  ? req.body.serviceSignature
                  : interaction.serviceSignature,
                serviceDescription: req.body.serviceDescription
                  ? req.body.serviceDescription
                  : interaction.serviceDescription,

                additionalServices: req.body.additionalServices
                  ? req.body.additionalServices
                  : interaction.additionalServices,

                proposals: req.body.proposals
                  ? req.body.proposals
                  : interaction.proposals,

                referralDetails: req.body.referralDetails
                  ? req.body.referralDetails
                  : interaction.referralDetails,

                commodityOther: req.body.commodityOther
                  ? req.body.commodityOther
                  : interaction.commodityOther,
                extensionSignature: req.body.extensionSignature
                  ? req.body.extensionSignature
                  : interaction.extensionSignature,
                managerSignature: req.body.managerSignature
                  ? req.body.managerSignature
                  : interaction.managerSignature,
                docCollection: req.body.docCollection
                  ? req.body.docCollection
                  : interaction.docCollection,
                updatedBy: req.user._id,
                updatedDate: new Date().setHours(0, 0, 0, 0),
                status: req.body.status ? req.body.status : interaction.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : interaction.deleted,

                updatedByObj: {
                  email: req.user.email,
                  name: req.user.firstName + " " + req.user.lastName,
                },
                farmerObj: farmerObj,
                approverStatus: req.body.approverStatus
                  ? req.body.approverStatus
                  : interaction.approverStatus,
                remarks: req.body.remarks
                  ? req.body.remarks
                  : interaction.remarks,
              };

              updateObj.commodity =
                req.body.deviceType !== "web"
                  ? req.body.commodity
                    ? JSON.parse(req.body.commodity)
                    : interaction.commodity
                  : req.body.commodity
                  ? req.body.commodity
                  : interaction.commodity;

              Interactions.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                updateObj,
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
                    // console.log("req.user : ", req.user);
                    loghistory(
                      req.user._id,
                      "Interaction Updated",
                      "Update",
                      "interactions",
                      "interaction edit",
                      req.get("referer"),
                      interaction,
                      result
                    );

                    var result = JSON.parse(JSON.stringify(result));
                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: "Interaction updated sucessfully.",
                      result,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        /** ADD Interaction **/

        if (!req.body.deviceType) req.body.deviceType = "web";

        let interactionObj = {
          farmerId: docFarmer[0]._id,
          identityNumber: req.body.identityNumber,
          supervisor: req.body.supervisor ? req.body.supervisor : null,
          serviceType: req.body.serviceType,
          serviceDate: req.body.serviceDate,
          serviceSignature: req.body.serviceSignature,
          serviceDescription: req.body.serviceDescription,
          additionalServices: req.body.additionalServices,
          proposals: req.body.proposals,
          referralDetails: req.body.referralDetails,
          commodityOther: req.body.commodityOther,
          extensionSignature: req.body.extensionSignature,
          managerSignature: req.body.managerSignature,
          docCollection: req.body.docCollection,
          createdBy: req.user._id,
          createdDate: new Date().setHours(0, 0, 0, 0),

          createdByObj: {
            email: req.user.email,
            name: req.user.firstName + " " + req.user.lastName,
          },
          farmerObj: farmerObj,
          approverStatus: req.body.approverStatus,
          remarks: req.body.remarks ? req.body.remarks : "",
        };
        interactionObj.commodity =
          req.body.deviceType !== "web"
            ? JSON.parse(req.body.commodity)
            : req.body.commodity;

        var newInteraction = new Interactions(interactionObj);
        newInteraction.save(function (err) {
          console.log("errors", err);
          if (err) {
            if (
              (err.name === "BulkWriteError" || err.name === "MongoError") &&
              err.code === 11000
            ) {
              return res.status(400).json({
                success: false,
                msg: "Already exist!, please try with another.",
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
          var result = JSON.parse(JSON.stringify(newInteraction));

          loghistory(
            req.user._id,
            "Interaction Add",
            "Add",
            "interactions",
            "Add Interaction",
            req.get("referer"),
            null,
            result
          );

          res.status(200).json({
            success: true,
            responseCode: 200,
            msg: "Interaction added successfully.",
            result: result,
          });
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Farmer not found",
      });
    }
  }
});

/************End Interaction ADD/UPDATE API ************************* */

/************Start Interaction List API ************************* */
/**
 * @swagger
 * /api/interactionlist:
 *   get:
 *     tags:
 *       - Add / Update, List Interaction
 *     description: Returns a Interaction list according
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Array list of Interactions
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
 *             $ref: '#/definitions/FarmerInteraction'
 *
 *
 */
/************* Interactions LIST API****************/
const getInteractionData = async (
  approverStatusQuery,
  createdByQuery,
  dbquery,
  dbquery_search,
  sort_field,
  sort_mode,
  CreatedDateQuery,
  skip,
  limit
) => {
  let interactions = await Interactions.find(
    {
      $and: [
        dbquery,
        createdByQuery,
        approverStatusQuery,
        CreatedDateQuery,
        {
          $or: [
            {
              "farmerObj.surname": {
                $regex: dbquery_search + "",
                $options: "i",
              },
            },
            {
              "farmerObj.name": { $regex: dbquery_search + "", $options: "i" },
            },
            { identityNumber: { $regex: dbquery_search, $options: "i" } },
          ],
        },
      ],
    },
    {
      _id: 1,
      farmerId: 1,
      identityNumber: 1,
      supervisor: 1,
      supervisorObj: 1,
      serviceType: 1,
      serviceDate: 1,
      serviceSignature: 1,
      serviceDescription: 1,
      additionalServices: 1,
      proposals: 1,
      referralDetails: 1,
      commodity: 1,
      commodityOther: 1,
      extensionSignature: 1,
      managerSignature: 1,
      docCollection: 1,
      createdDate: 1,
      createdBy: 1,
      createdByObj: 1,
      approverStatus: 1,
      remarks: 1,
      farmerObj: 1,
    }
  )
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  return interactions;
};

router.post("/api/interactionlist_web", auth, async function (req, res) {
  try {
    /*********Search Query build ************/
    let dbquery = {},
      CreatedDateQuery = {},
      createdByQuery = {},
      approverStatusQuery = {},
      childArray = [],
      approverStatus = "";
    // dbquery_createdDateG = {},
    // dbquery_updatedDateG = {},
    //console.log("req.body interaction : ", req.body);
    if (req.body) {
      if (req.body.childArray)
        childArray = req.body.childArray.map((a) => a._id);
      if (req.body.approvalStatus) approverStatus = req.body.approvalStatus;
    }
    //childArray.push(req.user._id);

    if (req.query.id) {
      dbquery._id = req.query.id;
    }

    var dbquery_search = "";
    if (req.query.searchTable) dbquery_search = req.query.searchTable;

    /////////get data based on date//////////////

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

    /*
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
    */

    ///////////////////////

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
      let response = {
        success: false,
        responseCode: 400,
        msg: "invalid page number, should start with 1",
      };
      return res.status(400).json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;

    //"5e3904117201433c8c2254df" Super Admin role
    //console.log("CreatedDateQuery : ", CreatedDateQuery);

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

    const getInteractionsObj = await getInteractionData(
      approverStatusQuery,
      createdByQuery,
      dbquery,
      dbquery_search,
      sort_field,
      sort_mode,
      CreatedDateQuery,
      query.skip,
      query.limit
    );

    const totalRecCount = await Interactions.countDocuments({
      $and: [
        dbquery,
        createdByQuery,
        approverStatusQuery,
        CreatedDateQuery,
        {
          $or: [
            {
              "farmerObj.surname": {
                $regex: dbquery_search + "",
                $options: "i",
              },
            },
            {
              "farmerObj.name": { $regex: dbquery_search + "", $options: "i" },
            },
            { identityNumber: { $regex: dbquery_search, $options: "i" } },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      result: getInteractionsObj,
      totalRecCount: totalRecCount,
    });
  } catch (err) {
    console.log("interactions fetch failed", err);
  }
});

///////////////////////////////////////////////////
const getInteractionsImport = async (
  skip,
  limit,
  dbquery_createdDateG,
  dbquery_updatedDateG
) => {
  let interactions = await Interactions.find(
    {
      $and: [{ $or: [dbquery_createdDateG, dbquery_updatedDateG] }],
    },
    {
      _id: 1,
      farmerId: 1,
      identityNumber: 1,
      supervisor: 1,
      supervisorObj: 1,
      serviceType: 1,
      serviceDate: 1,
      serviceSignature: 1,
      serviceDescription: 1,
      additionalServices: 1,
      proposals: 1,
      referralDetails: 1,
      commodity: 1,
      commodityOther: 1,
      extensionSignature: 1,
      managerSignature: 1,
      docCollection: 1,
      createdDate: 1,
      createdBy: 1,
      createdByObj: 1,
      approverStatus: 1,
      remarks: 1,
      farmerObj: 1,
    }
  )
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  return interactions;
};

router.get("/api/interactionsimport", auth, async function (req, res) {
  try {
    /*********Search Query build ************/
    let dbquery_createdDateG = {},
      dbquery_updatedDateG = {};

    /////////get data based on date//////////////

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

    ///////////////////////

    /******* pagination query started here ***********/
    var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
    var size = parseInt(req.query.per_page); //

    var query = {};
    if (pageNo < 0 || pageNo === 0) {
      let response = {
        success: false,
        responseCode: 400,
        msg: "invalid page number, should start with 1",
      };
      return res.status(400).json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;

    const getInteractionsObj = await getInteractionsImport(
      query.skip,
      query.limit,
      dbquery_createdDateG,
      dbquery_updatedDateG
    );

    const totalRecCount = await Interactions.countDocuments({
      $and: [{ $or: [dbquery_createdDateG, dbquery_updatedDateG] }],
    });

    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      result: getInteractionsObj,
      totalRecCount: totalRecCount,
    });
  } catch (err) {
    console.log("interactions fetch failed", err);
  }
});

router.get("/api/interactionlist", auth, async function (req, res) {
  try {
    /*********Search Query build ************/ var dbquery = {};

    if (req.query.id) {
      dbquery._id = req.query.id;
    }

    var dbquery_search = "";
    if (req.query.searchTable) dbquery_search = req.query.searchTable;

    /////////get data based on date//////////////
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

    ///////////////////////

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

    /******* pagination query end here****************/
    //console.log("interaction id : ", dbquery);
    // Find some documents
    /*
  Interactions.find(dbquery)
    .populate({
      path: "farmerId",
      model: "farmer_details",
      select: "surname name identityNumber contactNumber farmerType",
    })
    .populate({
      path: "createdBy",
      model: "users",
      select: "firstName lastName",
    })
*/
    let docs = await Interactions.aggregate([
      {
        $match: {
          $and: [
            dbquery,
            {
              $or: [dbquery_createdDateG, dbquery_updatedDateG],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "farmer_details",
          localField: "farmerId",
          foreignField: "_id",
          as: "farmerDetails",
        },
      },
      // {
      //   $lookup: {
      //     from: "cnds",
      //     localField: "farmerDetails.ownershipType",
      //     foreignField: "_id",
      //     as: "ownershipType",
      //   },
      // },
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
          from: "farmer_assets_services",
          localField: "farmerDetails._id",
          foreignField: "farmerId",
          as: "farmerAssetsServices",
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
      {
        $facet: {
          count: [
            {
              $count: "totalRecords",
            },
          ],
          data: [
            { $skip: query.skip ? query.skip : 0 },
            { $limit: query.limit ? query.limit : 10 },
          ],
        },
      },
      {
        $project: {
          "data._id": 1,
          "data.farmerId": 1,
          "data.identityNumber": 1,
          "data.supervisor": 1,
          "data.supervisors.firstName": 1,
          "data.supervisors.lastName": 1,
          "data.serviceType": 1,
          "data.serviceDate": 1,
          "data.serviceSignature": 1,
          "data.serviceDescription": 1,
          "data.additionalServices": 1,
          "data.proposals": 1,
          "data.referralDetails": 1,
          "data.commodity": 1,
          "data.commodityOther": 1,
          "data.extensionSignature": 1,
          "data.managerSignature": 1,
          "data.docCollection": 1,
          "data.createdBy": 1,
          "data.approverStatus": 1,
          "data.remarks": 1,
          "data.farmerDetails._id": 1,
          "data.farmerDetails.surname": 1,
          "data.farmerDetails.name": 1,
          "data.farmerDetails.identityNumber": 1,
          "data.farmerDetails.contactNumber": 1,
          "data.farmerDetails.farmerType": 1,
          //"data.ownershipType.cndName": 1,
          "data.farmerDetails.ownershipTypeObj": 1,
          "data.farmerDetails.gender": 1,
          "data.farmerDetails.ageGroupsObj": 1,
          "data.farmerDetails.isDisabled": 1,
          "data.farmerProduction.farmName": 1,
          "data.farmerProduction.projectLegalEntityName": 1,
          "data.farmerProduction.totalFarmSize": 1,
          "data.farmerProduction.wardNumber": 1,
          "data.farmerProduction.farmLatitude": 1,
          "data.farmerProduction.farmLongitude": 1,
          "data.farmerAssetsServices.docCollection": 1,
          "data.users.firstName": 1,
          "data.users.lastName": 1,
          "count.totalRecords": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      result: docs[0].data,
      totalRecCount: docs[0].count[0].totalRecords,
    });
  } catch (err) {
    console.log("fetch failed", err);
  }
});
/************End Interactions List API ************************* */

router.get("/api/farmerbyid/:id", auth, function (req, res) {
  try {
    FarmerDetail.find(
      { _id: req.params.id },
      {
        _id: 1,
        surname: 1,
        name: 1,
        farmerType: 1,
        identityNumber: 1,
        contactNumber: 1,
        ownershipType: 1,
        gender: 1,
        ownershipTypeObj: 1,
        ageGroupsObj: 1,
        isDisabled: 1,
      }
    )
      // .populate({
      //   path: "ownershipType",
      //   model: "cnds",
      //   select: "cndName -_id",
      // })
      .exec(async function (err, resInfo) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: "error",
          });
        } else {
          let finalResult = [];
          let obj = {};
          obj["_id"] = resInfo[0]._id;
          obj["surname"] = resInfo[0].surname;
          obj["name"] = resInfo[0].name;
          obj["identityNumber"] = resInfo[0].identityNumber;
          obj["contactNumber"] = resInfo[0].contactNumber;
          //obj["ownershipType"] = resInfo[0].ownershipType.cndName;
          obj["farmerType"] = resInfo[0].farmerType;
          obj["gender"] = resInfo[0].gender;
          obj["ownershipTypeObj"] = resInfo[0].ownershipTypeObj;
          obj["ageGroupsObj"] = resInfo[0].ageGroupsObj;
          obj["isDisabled"] = resInfo[0].isDisabled;

          let farmerProduction = await FarmerProduction.find(
            {
              farmerId: req.params.id,
            },
            {
              farmName: 1,
              totalFarmSize: 1,
              farmLatitude: 1,
              farmLongitude: 1,
              wardNumber: 1,
              projectLegalEntityName: 1,
            }
          );
          // .populate({
          //   path: "farmMuncipalRegion",
          //   model: "cnds",
          //   select: "cndName -_id",
          // });

          obj["farmerProduction"] = farmerProduction[0];

          let farmerAsset = await FarmAssetsServices.find(
            {
              farmerId: req.params.id,
            },
            {
              docCollection: 1,
            }
          );
          obj["farmerAsset"] = farmerAsset[0];

          finalResult.push(obj);
          //console.log("finalResult : ", finalResult);
          res.status(200).json({
            success: true,
            responseCode: 200,
            result: finalResult,
            msg: "List fetching successfully",
          });
        }
      });
  } catch (err) {
    console.log("fetch failed", err);
  }
});

router.post("/api/interactionusers", async function (req, res) {
  let interactions = await Interactions.distinct("createdBy");

  let dbquery = {};

  if (req.body.district) dbquery.metroDistrict = req.body.district;

  if (req.body.municipality) dbquery.municipalRegion = req.body.municipality;

  let users = await User.find({
    $and: [{ _id: { $in: interactions } }, dbquery],
  });

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
    result: users,
    totalRecCount: users.length,
  });
});

module.exports = router;
