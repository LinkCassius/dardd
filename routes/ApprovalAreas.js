var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ApprovalAreas = require("../models/ApprovalAreas");
var ApprovalSetup = require("../models/ApprovalSetup");
var { User } = require("../models/User");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/************Start ApprovalArea ADD / CAPTURE API ************************* */
router.post("/api/approvalarea", auth, async function (req, res) {
  if (!req.body.approvalAreaName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Approval Area Name.",
    });
  } else {
    if (req.body.id) {
      ApprovalAreas.findOne(
        {
          _id: req.body.id,
        },
        function (err, approvalarea) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!approvalarea) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "ApprovalArea with given id not exists!",
            });
          } else {
            ApprovalAreas.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                approvalAreaCode: req.body.approvalAreaCode
                  ? req.body.approvalAreaCode
                  : approvalarea.approvalAreaCode,
                approvalAreaName: req.body.approvalAreaName
                  ? req.body.approvalAreaName
                  : approvalarea.approvalAreaName,

                status: req.body.status ? req.body.status : approvalarea.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : approvalarea.deleted,
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
                  if (req.user._id)
                    loghistory(
                      req.user._id,
                      "Approval Area Updated",
                      "Update",
                      "approval_areas",
                      "approval area edit",
                      req.get("referer"),
                      approvalarea,
                      result
                    );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Approval Area Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Approval Area **/

      var Obj = {
        approvalAreaCode: req.body.approvalAreaCode,
        approvalAreaName: req.body.approvalAreaName,

        status: req.body.status,
        deleted: req.body.deleted,
      };
      var newObj = new ApprovalAreas(Obj);
      newObj.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg:
                "Approval Area Name already exist!, please try with another.",
            });
          } else {
            if (err.errors && err.errors.name)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.name.message,
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

        if (req.user._id)
          loghistory(
            req.user._id,
            "Approval Area Add",
            "Add",
            "approval_areas",
            "Add Approval Area",
            req.get("referer"),
            null,
            result
          );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Approval Area added successfully.",
          result: result,
        });
      });
    }
  }
});
/************End ApprovalArea API ************************* */

/************* Approval Area LIST API****************/
router.get("/api/approvalarealist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.approvalAreaCode) {
    dbquery.approvalAreaCode = req.query.approvalAreaCode;
  }
  if (req.query.approvalareaid) {
    dbquery._id = req.query.approvalareaid;
  }
  if (req.query.approvalAreaName) {
    dbquery.approvalAreaName = req.query.approvalAreaName;
  }
  dbquery.approvalAreaCode = { $ne: "FR" };
  /************total count query start here ********/
  // Find some documents
  ApprovalAreas.find(dbquery)
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
      ApprovalAreas.find(dbquery, {}).exec(function (err, info) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: "error",
          });
        } else {
          var results = [];

          //    var totalPages = Math.ceil(totalCount / size)
          res.status(200).json({
            success: true,
            responseCode: 200,
            result: info,
            totalRecCount: totalCount,
            msg: "List fetching successfully",
          });
        }
      });
    });
});
/************End Approval Area List API ************************* */

/************* Approval Area LIST API****************/
router.get("/api/pendingapprovalarealist", auth, async function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.approvalAreaCode) {
    dbquery.approvalAreaCode = req.query.approvalAreaCode;
  }
  if (req.query.approvalareaid) {
    dbquery._id = req.query.approvalareaid;
  }
  if (req.query.approvalAreaName) {
    dbquery.approvalAreaName = req.query.approvalAreaName;
  }

  let areaIds = [];
  /*
  if (req.query.userid) {
    let approvalSetup = await ApprovalSetup.find().populate({
      path: "approvalArea",
      model: "approval_areas",
    });
    // console.log("approvalSetup : ", approvalSetup);

    for (var i = 0; i < approvalSetup.length; i++) {
      if (
        approvalSetup[i].approvalLevel == "User" &&
        approvalSetup[i].approverId == req.query.userid
      ) {
        areaIds.push(approvalSetup[i].approvalArea._id);
      } else if (approvalSetup[i].approvalLevel == "Role") {
        let role = await User.find({
          userGroup: approvalSetup[i].approverId,
          _id: req.query.userid,
        });

        if (role.length > 0) {
          areaIds.push(approvalSetup[i].approvalArea._id);
        }
      } else if (approvalSetup[i].approvalLevel == "Supervisor") {
        areaIds.push(approvalSetup[i].approvalArea._id);
      }
    }
  }
  */

  /************total count query start here ********/
  // Find some documents
  // ApprovalAreas.find({ _id: { $in: areaIds } })
  ApprovalAreas.find({ approvalAreaCode: { $ne: "FR" } })
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
      //ApprovalAreas.find({ _id: { $in: areaIds } }, {}).exec(function (
      ApprovalAreas.find({ approvalAreaCode: { $ne: "FR" } }).exec(function (
        err,
        info
      ) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: "error",
          });
        } else {
          var results = [];

          //    var totalPages = Math.ceil(totalCount / size)
          res.status(200).json({
            success: true,
            responseCode: 200,
            result: info,
            totalRecCount: totalCount,
            msg: "List fetching successfully",
          });
        }
      });
    });
});
/************End Approval Area List API ************************* */

module.exports = router;
