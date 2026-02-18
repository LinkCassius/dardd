var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Activites = require("../models/Activities");
var multer = require("multer");
const path = require("path");
const Config = require("../config/config");
const auth = require("../middleware/auth");

const { masterConst } = Config;

// /**
//  * @swagger
//  * /api/logactivity:
//  *   post:
//  *     tags:
//  *       - Entry Log Activity, List All activites
//  *     description: Returns a object of activity log
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: activityName
//  *         description: name of activity
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: activityType
//  *         description: name of activity type
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: module
//  *         description: belongs to module
//  *         in: formData
//  *         type: string
//  *       - name: section
//  *         description: belongs to section
//  *         in: formData
//  *         type: string
//  *       - name: url
//  *         description: current url
//  *         in: formData
//  *         type: string
//  *       - name: desc
//  *         description: description of activity
//  *         in: formData
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of activity log
//  *         schema:
//  *            $ref: '#/definitions/Activity'
//  */

/************Start Activity ADD / CAPTURE API ************************* */
router.post("/api/logactivity", auth, async function (req, res) {
  //console.log("body", req.body);
  if (!req.body.activityName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter activity name.",
    });
  } else if (!req.body.activityType) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter activity type.",
    });
  } else {
    if (req.body.id) {
      /** Update CND **/
      Activites.findOne(
        {
          _id: req.body.id,
        },
        function (err, activity) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!cnd) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Activity with given id not exists!",
            });
          } else {
            Activites.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                activityName: req.body.activityName,
                activityType: req.body.activityType,
                module: req.body.module,
                section: req.body.section,
                url: req.body.url,
                desc: req.body.desc ? req.body.desc : activity.desc,
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
                    msg: "Actvity Log Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Activity Log **/
      var ActivityObj = {
        activityName: req.body.activityName,
        activityType: req.body.activityType,
        module: req.body.module,
        section: req.body.section,
        url: req.body.url,
        desc: req.body.desc,
      };
      var newActivity = new Activites(ActivityObj);
      newActivity.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "code already exist!, plz try with another.",
            });
          } else {
            if (err.errors && err.errors.activityType)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.cndCode.message,
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
        var result = JSON.parse(JSON.stringify(newActivity));

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Activity Log added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Activity Logger API ************************* */

/************Start Activity List API ************************* */
// /**
//  * @swagger
//  * /api/activitylist:
//  *   get:
//  *     tags:
//  *       - Entry Log Activity, List All activites
//  *     description: Returns a Activity list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: activityName
//  *         in:  query
//  *         type: string
//  *       - name: activityType
//  *         in:  query
//  *         type: string
//  *       - name: module
//  *         in:  query
//  *         type: string
//  *       - name: section
//  *         in:  query
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Array list of Activity
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
//  *             $ref: '#/definitions/Activity'
//  *
//  *
//  */
/************* Activity LIST API****************/
router.get("/api/activitylist", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  var columns = {};
  if (req.query.id) {
    dbquery._id = req.query.id;
  }
  if (!req.query.id) {
    (columns.oldValues = 0),
      (columns.newValues = 0),
      (columns.user = 0),
      (columns.section = 0);
  }
  if (req.query.activityName) {
    dbquery.activityName = req.query.activityName;
  }

  if (req.query.activityType) {
    dbquery.activityType = req.query.activityType;
  }
  if (req.query.module) {
    dbquery.module = req.query.module;
  }

  if (req.query.section) {
    dbquery.section = req.query.section;
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
  //console.log("query================", dbquery);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  Activites.find(dbquery)
    .select(columns)
    .count()
    .exec(function (err, totalCount) {
      //   console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
          error: err,
        });
      }
      Activites.find(
        {
          $and: [
            dbquery,
            {
              $or: [
                { activityName: { $regex: dbquery_search, $options: "i" } },
                { activityType: { $regex: dbquery_search, $options: "i" } },
                { ipAddress: { $regex: dbquery_search, $options: "i" } },
                { url: { $regex: dbquery_search, $options: "i" } },
                { userName: { $regex: dbquery_search, $options: "i" } },
              ],
            },
          ],
        },
        {}
      )
        .select(columns)
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, cndInfo) {
          if (err) {
            // if (err.code === 16500) {
            //   console.log("req 16500 rate large");
            //   var retryAfterHeader = header["x-ms-retry-after-ms"] || 1;
            //   var retryAfter = Number(retryAfterHeader);
            //   return setTimeout(toRetryIf16500, retryAfter);
            // }
            // if (err.code === 429) {
            //   console.log("req 429 rate large");
            //   var retryAfterHeader = header["x-ms-retry-after-ms"] || 1;
            //   var retryAfter = Number(retryAfterHeader);
            //   return setTimeout(toRetryIf429, retryAfter);
            // } else
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
              error: err,
              errorCode: err.code,
            });
          } else {
            var results = [];

            //    var totalPages = Math.ceil(totalCount / size)
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
/************End Activites List API ************************* */

module.exports = router;
