var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ApprovalSetup = require("../models/ApprovalSetup");
const loghistory = require("./userhistory");
var { User } = require("../models/User");
var UserGroup = require("../models/UserGroup");
const auth = require("../middleware/auth");
/************Start ApprovalSetup ADD / CAPTURE API ************************* */
router.post("/api/approvalsetup", auth, async function (req, res) {
  if (!req.body.approvalLevel) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Approval Level.",
    });
  } else if (!req.body.approverId) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please select Approver",
    });
  } else {
    if (req.body.id) {
      ApprovalSetup.findOne(
        {
          _id: req.body.id,
        },
        function (err, approvalsetup) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!approvalsetup) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "ApprovalSetup with given id not exists!",
            });
          } else {
            ApprovalSetup.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                approvalArea: req.body.approvalArea
                  ? req.body.approvalArea
                  : approvalsetup.approvalArea,
                approvalLevel: req.body.approvalLevel
                  ? req.body.approvalLevel
                  : approvalsetup.approvalLevel,
                approverId: req.body.approverId
                  ? req.body.approverId
                  : approvalsetup.approverId,
                approvalType: req.body.approvalType
                  ? req.body.approvalType
                  : approvalsetup.approvalType,
                sequence: req.body.sequence
                  ? req.body.sequence
                  : approvalsetup.sequence,

                status: req.body.status
                  ? req.body.status
                  : approvalsetup.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : approvalsetup.deleted,
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
                      "Approval Setup Updated",
                      "Update",
                      "approval_setup",
                      "approval setup edit",
                      req.get("referer"),
                      approvalsetup,
                      result
                    );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Approval Setup Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Approval Setup **/

      var Obj = {
        approvalArea: req.body.approvalArea,
        approvalLevel: req.body.approvalLevel,
        approverId: req.body.approverId,
        approvalType: req.body.approvalType,
        sequence: req.body.sequence,

        status: req.body.status,
        deleted: req.body.deleted,
      };
      var newObj = new ApprovalSetup(Obj);
      newObj.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Approval Level already exist!, please try with another.",
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
            "Approval Setup Add",
            "Add",
            "approval_setup",
            "Add Approval Setup",
            req.get("referer"),
            null,
            result
          );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Approval Setup added successfully.",
          result: result,
        });
      });
    }
  }
});
/************End ApprovalSetup API ************************* */

/************* Approval Setup LIST API****************/
router.get("/api/approvalsetuplist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.approvalArea) {
    dbquery.approvalArea = req.query.approvalArea;
  }
  if (req.query.approvalsetupid) {
    dbquery._id = req.query.approvalsetupid;
  }
  if (req.query.approvalLevel) {
    dbquery.approvalLevel = req.query.approvalLevel;
  }

  if (req.query.approvalType) {
    dbquery.approvalType = req.query.approvalType;
  }

  if (req.query.approverId) {
    dbquery.approverId = req.query.approverId;
  }

  if (req.query.sequence) {
    dbquery.sequence = req.query.sequence;
  }

  /************total count query start here ********/
  // Find some documents
  ApprovalSetup.find(dbquery)
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
      ApprovalSetup.find(dbquery, {})
        .populate({
          path: "approvalArea",
          model: "approval_areas",
        })
        .exec(async function (err, info) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
            });
          } else {
            var results = [];
            for (var i = 0; i < info.length; i++) {
              var obj = {};
              if (info[i].approvalLevel === "User") {
                let user = await User.findOne({ _id: info[i].approverId });
                if (user) {
                  obj["approverId"] = user.firstName + " " + user.lastName;
                  obj["approverIdObj"] = {
                    _id: info[i].approverId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                  };
                } else {
                  obj["approverId"] = "";
                  obj["approverIdObj"] = {};
                }
              } else if (info[i].approvalLevel === "Role") {
                obj["approverIdObj"] = {};
                let role = await UserGroup.findOne({ _id: info[i].approverId });
                if (role) {
                  obj["approverId"] = role.groupName;
                } else obj["approverId"] = "";
              } else if (info[i].approvalLevel === "Supervisor") {
                obj["approverId"] = "Supervisor";
              }
              obj["approvalArea"] = info[i].approvalArea;
              obj["approvalLevel"] = info[i].approvalLevel;
              obj["approvalType"] = info[i].approvalType;
              obj["sequence"] = info[i].sequence;
              obj["_id"] = info[i]._id;
              obj["ddl"] = info[i].approverId;
              results.push(obj);
            }

            res.status(200).json({
              success: true,
              responseCode: 200,
              result: results,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});
/************End Approval Setup List API ************************* */

router.delete("/api/deleteapprovalsetup", auth, async (req, res) => {
  const oldData = await ApprovalSetup.findById(req.query.id);

  const approvalsetup = await ApprovalSetup.findOneAndDelete({
    _id: req.query.id,
    refType: "Milestone",
    contractId: req.body.contract,
  });

  if (!approvalsetup) return res.status(400).send("Record not found");

  console.log("approvalsetup : ", approvalsetup);
  if (approvalsetup)
    loghistory(
      req.user._id,
      "Approval setup Deleted",
      "Delete",
      "ApprovalSetup",
      "Delete ApprovalSetup",
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

module.exports = router;
