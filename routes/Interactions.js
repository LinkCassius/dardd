var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Interactions = require("../models/Interactions");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

// /**
//  * @swagger
//  * /api/interaction:
//  *   post:
//  *     tags:
//  *       - Add / Update, List Interaction
//  *     description: Returns a object of Interaction
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: farmerId
//  *         description: objectId of farmer
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: userId
//  *         description: objectId of user
//  *         in: formData
//  *         required: true
//  *       - name: activity
//  *         description: field or office activity
//  *         in: formData
//  *         type: boolean
//  *       - name: programmeClassification
//  *         description: programmeClassification
//  *         in: formData
//  *         required: true
//  *         type: object
//  *       - name: typeOfAssistance
//  *         description: typeOfAssistance
//  *         in: formData
//  *         type: object
//  *       - name: docCollection
//  *         description: docCollection
//  *         in: formData
//  *         type: string
//  *       - name: queryReportBack
//  *         description: queryReportBack
//  *         in: formData
//  *         type: string
//  *       - name: followUpRequired
//  *         description: followUpRequired
//  *         in: formData
//  *         type: boolean
//  *       - name: followUpComments
//  *         description: followUpComments
//  *         in: formData
//  *         type: string
//  *       - name: clientComments
//  *         description: clientComments
//  *         in: formData
//  *         type: string
//  *       - name: status
//  *         description: description of cnd
//  *         in: formData
//  *         type: number
//  *     responses:
//  *       200:
//  *         description: An Object of Interaction
//  *         schema:
//  *            $ref: '#/definitions/Interaction'
//  */

/************Start Interaction ADD/UPDATE API ************************* */
router.post("/api/interaction", auth, async function (req, res) {
  if (!req.body.farmerId) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter farmer.",
    });
  } else {
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

            let updateObj =
              req.body.deviceType !== "web"
                ? {
                    farmerId: req.body.farmerId
                      ? req.body.farmerId
                      : interaction.farmerId,
                    userId: req.body.userId
                      ? req.body.userId
                      : interaction.userId,
                    activity: req.body.activity
                      ? req.body.activity
                      : interaction.activity,
                    programmeClassification: req.body.programmeClassification
                      ? JSON.parse(req.body.programmeClassification)
                      : interaction.programmeClassification,
                    typeOfAssistance: req.body.typeOfAssistance
                      ? JSON.parse(req.body.typeOfAssistance)
                      : interaction.typeOfAssistance,
                    docCollection: req.body.docCollection
                      ? req.body.docCollection
                      : interaction.docCollection,
                    queryReportBack: req.body.queryReportBack
                      ? req.body.queryReportBack
                      : interaction.queryReportBack,
                    followUpRequired: req.body.followUpRequired,
                    followUpComments: req.body.followUpComments
                      ? req.body.followUpComments
                      : interaction.followUpComments,
                    clientRating: req.body.clientRating
                      ? req.body.clientRating
                      : interaction.clientRating,
                    clientComments: req.body.clientComments
                      ? req.body.clientComments
                      : interaction.clientComments,
                    followUpDate: req.body.followUpDate
                      ? req.body.followUpDate
                      : interaction.followUpDate,
                    latitude: req.body.latitude
                      ? req.body.latitude
                      : interaction.latitude,
                    longitude: req.body.longitude
                      ? req.body.longitude
                      : interaction.longitude,
                    status: req.body.status
                      ? req.body.status
                      : interaction.status,
                    deleted: req.body.deleted
                      ? req.body.deleted
                      : interaction.deleted,
                    updatedDate: new Date().getTime(),
                    clientSignature: req.body.clientSignature
                      ? req.body.clientSignature
                      : interaction.clientSignature,
                  }
                : {
                    farmerId: req.body.farmerId
                      ? req.body.farmerId
                      : interaction.farmerId,
                    userId: req.body.userId
                      ? req.body.userId
                      : interaction.userId,
                    activity: req.body.activity
                      ? req.body.activity
                      : interaction.activity,
                    programmeClassification: req.body.programmeClassification
                      ? req.body.programmeClassification
                      : interaction.programmeClassification,
                    typeOfAssistance: req.body.typeOfAssistance
                      ? req.body.typeOfAssistance
                      : interaction.typeOfAssistance,
                    docCollection: req.body.docCollection
                      ? req.body.docCollection
                      : interaction.docCollection,
                    queryReportBack: req.body.queryReportBack
                      ? req.body.queryReportBack
                      : interaction.queryReportBack,
                    followUpRequired: req.body.followUpRequired,
                    followUpComments: req.body.followUpComments
                      ? req.body.followUpComments
                      : interaction.followUpComments,
                    clientRating: req.body.clientRating
                      ? req.body.clientRating
                      : interaction.clientRating,
                    clientComments: req.body.clientComments
                      ? req.body.clientComments
                      : interaction.clientComments,
                    followUpDate: req.body.followUpDate
                      ? req.body.followUpDate
                      : interaction.followUpDate,
                    latitude: req.body.latitude
                      ? req.body.latitude
                      : interaction.latitude,
                    longitude: req.body.longitude
                      ? req.body.longitude
                      : interaction.longitude,
                    status: req.body.status
                      ? req.body.status
                      : interaction.status,
                    deleted: req.body.deleted
                      ? req.body.deleted
                      : interaction.deleted,
                    updatedDate: new Date().getTime(),
                    clientSignature: req.body.clientSignature
                      ? req.body.clientSignature
                      : interaction.clientSignature,
                  };

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

      let interactionObj =
        req.body.deviceType !== "web"
          ? {
              farmerId: req.body.farmerId,
              userId: req.body.userId,
              activity: req.body.activity,
              programmeClassification: JSON.parse(
                req.body.programmeClassification
              ),
              typeOfAssistance: JSON.parse(req.body.typeOfAssistance),
              docCollection: req.body.docCollection,
              queryReportBack: req.body.queryReportBack,
              followUpRequired: req.body.followUpRequired,
              followUpComments: req.body.followUpComments,
              clientRating: req.body.clientRating,
              clientComments: req.body.clientComments,
              followUpDate: req.body.followUpDate,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              status: req.body.status,
              deleted: req.body.deleted,
              createdDate: new Date().getTime(),
              clientSignature: req.body.clientSignature,
            }
          : {
              farmerId: req.body.farmerId,
              userId: req.body.userId,
              activity: req.body.activity,
              programmeClassification: req.body.programmeClassification,
              typeOfAssistance: req.body.typeOfAssistance,
              docCollection: req.body.docCollection,
              queryReportBack: req.body.queryReportBack,
              followUpRequired: req.body.followUpRequired,
              followUpComments: req.body.followUpComments,
              clientRating: req.body.clientRating,
              clientComments: req.body.clientComments,
              followUpDate: req.body.followUpDate,
              latitude: req.body.latitude,
              longitude: req.body.longitude,
              status: req.body.status,
              deleted: req.body.deleted,
              createdDate: new Date().getTime(),
              clientSignature: req.body.clientSignature,
            };
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
              msg: "Already exist!, plz try with another.",
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
  }
});

/************End Interaction ADD/UPDATE API ************************* */

/************Start Interaction List API ************************* */
// /**
//  * @swagger
//  * /api/interactionlist:
//  *   get:
//  *     tags:
//  *       - Add / Update, List Interaction
//  *     description: Returns a Interaction list according
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: Array list of Interactions
//  *         schema:
//  *          type: object
//  *          properties:
//  *           status:
//  *            type: string
//  *           totalRecCount:
//  *            type: integer
//  *           result:
//  *            type: array
//  *            items:
//  *             $ref: '#/definitions/Interaction'
//  *
//  *
//  */
/************* Interactions LIST API****************/
router.get("/api/interactionlist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};

  if (req.query.id) {
    dbquery._id = req.query.id;
  }

  var dbquery_search = "";
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

  /******* pagination query end here****************/
  // Find some documents
  Interactions.aggregate([
    { $match: dbquery },
    {
      $lookup: {
        from: "farmer_details" /* underlying collection for jobSchema */,
        localField: "farmerId",
        foreignField: "_id",
        as: "farmerdetails",
      },
    },
    // { $unwind: "$farmer_assets_services" },
    {
      $lookup: {
        from: "farmer_productions" /* underlying collection for jobSchema */,
        localField: "farmerId",
        foreignField: "farmerId",
        as: "farmerProduction",
      },
    },
    {
      $lookup: {
        from: "users" /* underlying collection for jobSchema */,
        localField: "userId",
        foreignField: "_id",
        as: "users",
      },
    },
  ])
    .sort({ [sort_field]: sort_mode })
    .skip(query.skip)
    .limit(query.limit ? query.limit : 1000000)
    .exec(async function (err, docs) {
      if (err) throw err;
      var totalDoc = await Interactions.find(dbquery, {});
      var totalCount = totalDoc.length;

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "List fetched successfully",
        result: docs,
        totalRecCount: totalCount,
      });
    });
});
/************End Interactions List API ************************* */
module.exports = router;
