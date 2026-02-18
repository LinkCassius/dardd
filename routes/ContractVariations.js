var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ContractVariations = require("../models/ContractVariations");
const loghistory = require("./userhistory");
var ApprovalHistoryTable = require("../models/ApprovalHistory");
var approvalHistory = require("./ApprovalHistoryFunc");
var uploadFile = require("./UploadFileFunc");
var ContractDocuments = require("../models/ContractDocuments");
var moment = require("moment");
const auth = require("../middleware/auth");

/************Start task ADD/UPDATE API ************************* */
router.post("/api/contract_variation", auth, async function (req, res) {
  if (!req.body.subject) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter subject.",
    });
  } else {
    if (req.body.id) {
      ContractVariations.findOne(
        {
          _id: req.body.id,
        },
        function (err, contractVariation) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!contractVariation) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Variation with given id not exists!",
            });
          } else {
            ContractVariations.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                contract: req.body.contract
                  ? req.body.contract
                  : contractVariation.contract,
                subject: req.body.subject
                  ? req.body.subject
                  : contractVariation.subject,
                // unit: req.body.unit ? req.body.unit : contractVariation.unit,
                // rate: req.body.rate ? req.body.rate : contractVariation.rate,
                amount: req.body.amount
                  ? req.body.amount
                  : contractVariation.amount,
                // approver: req.body.approver
                //   ? req.body.approver
                //   : contractVariation.approver,
                approvalStatus: req.body.approvalStatus
                  ? req.body.approvalStatus
                  : contractVariation.approvalStatus,
                // approverRemarks: req.body.approverRemarks
                //   ? req.body.approverRemarks
                //   : contractVariation.approverRemarks,
                approvalSequence: req.body.approvalSequence
                  ? req.body.approvalSequence
                  : contractVariation.approvalSequence,

                docCollection: req.body.docCollection
                  ? req.body.docCollection
                  : contractVariation.docCollection,
                status: req.body.status
                  ? req.body.status
                  : contractVariation.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : contractVariation.deleted,
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

                  if (req.user._id)
                    loghistory(
                      req.user._id,
                      "Contract Variation Update",
                      "Update",
                      "contract_variations",
                      "Update Contract Variation",
                      req.get("referer"),
                      contractVariation,
                      result
                    );

                  //******delete old record & re-initiate the approval ******/
                  //delete the (not approved/rejected) record from approval history table
                  //ApprovalHistoryTable
                  ApprovalHistoryTable.findOneAndDelete(
                    {
                      applicationId: req.body.id,
                      approvalType: "CV",
                      //approverId: null,
                    },
                    function (err) {
                      if (err) {
                        console.log("err", err);
                        return res.status(400).json({
                          success: false,
                          responseCode: 400,
                          msg: "Internal Server Error.",
                        });
                      }
                      console.log(
                        "Successful deletion of approval history record"
                      );
                    }
                  );
                  //re-initiate
                  if (
                    //Contract Variation - insert record in approval history table
                    req.body.approvalStatus &&
                    req.body.approvalStatus == "5e996a81c3f4c40045d3717b"
                  ) {
                    var applicationObj = {
                      contract: req.body.contract,
                      contractName: req.body.contractName,
                      subject: req.body.subject,
                      // unit: req.body.unit,
                      // rate: req.body.rate,
                      amount: req.body.amount,
                    };
                    approvalHistory(
                      "5eb9154f2117ee3c78840c74",
                      result._id,
                      req.body.approvalLevel ? req.body.approvalLevel : null,
                      "CV",
                      1,
                      applicationObj
                    );
                  }

                  //remove old document if new document has been uploaded

                  ///////////////////////////////////
                  if (
                    req.body.docCollection &&
                    contractVariation.docCollection !== req.body.docCollection
                  ) {
                    //checking condition not to upload same doc again and delete old record for new document.
                    //delete old file
                    ContractDocuments.findOneAndDelete(
                      {
                        refId: req.body.id,
                        refType: "Variation",
                        contractId: req.body.contract,
                      },
                      function (err) {
                        if (err) {
                          console.log("err", err);
                          return res.status(400).json({
                            success: false,
                            responseCode: 400,
                            msg: "Internal Server Error.",
                          });
                        }
                        console.log(
                          "Successful deletion of contract document record"
                        );
                      }
                    );

                    //upload new file
                    uploadFile(
                      req.body.contract,
                      req.body.fileName,
                      req.body.docCollection,
                      "N",
                      moment(new Date()).format("X"),
                      null,
                      result._id,
                      "Variation"
                    );
                  }
                  //****** ******/
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Variation Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Task **/
      var varObj = {
        contract: req.body.contract,
        subject: req.body.subject,
        // unit: req.body.unit,
        // rate: req.body.rate,
        amount: req.body.amount,
        //approver: req.body.approver,
        approvalStatus: req.body.approvalStatus,
        approvalSequence: req.body.approvalSequence,
        status: req.body.status,
        deleted: req.body.deleted,
        docCollection: req.body.docCollection,
      };
      var newTask = new ContractVariations(varObj);
      newTask.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "subject already exist!, please try with another.",
            });
          } else {
            if (err.errors && err.errors.subject)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.subject.message,
              });
            else if (err.errors && err.errors.amount)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.amount.message,
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
        var result = JSON.parse(JSON.stringify(newTask));
        if (req.user._id)
          loghistory(
            req.user._id,
            "Contract Variation Add",
            "Add",
            "contract_variations",
            "Add Variation",
            req.get("referer"),
            null,
            result
          );

        if (
          //Contract Variation - insert record in approval history table
          req.body.approvalStatus &&
          req.body.approvalStatus == "5e996a81c3f4c40045d3717b"
        ) {
          var applicationObj = {
            contract: req.body.contract,
            contractName: req.body.contractName,
            subject: req.body.subject,
            // unit: req.body.unit,
            // rate: req.body.rate,
            amount: req.body.amount,
          };
          approvalHistory(
            "5eb9154f2117ee3c78840c74",
            result._id,
            req.body.approvalLevel ? req.body.approvalLevel : null,
            "CV",
            1,
            applicationObj
          );
        }

        uploadFile(
          req.body.contract,
          req.body.fileName,
          req.body.docCollection,
          "N",
          moment(new Date()).format("X"),
          null,
          result._id,
          "Variation"
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Variation added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Task ADD/UPDATE API ************************* */

/************Start Task List API ************************* */

/************* Contracts LIST API****************/
router.get(
  "/api/contract_variation_list/:contractId?",
  auth,
  function (req, res) {
    /*********Search Query build ************/
    var dbquery = {};
    if (req.params.contractId) dbquery.contract = req.params.contractId;

    if (req.query.subject) {
      dbquery.subject = req.query.subject;
    }

    if (req.query.approver) {
      dbquery.approver = req.query.approver;
    }
    if (req.query.approvalStatus) {
      dbquery.approvalStatus = req.query.approvalStatus;
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

    /************total count query start here ********/
    // Find some documents
    ContractVariations.find({
      $and: [
        dbquery,
        {
          $or: [{ subject: { $regex: dbquery_search, $options: "i" } }],
        },
      ],
    })
      .countDocuments()
      .exec(function (err, totalCount) {
        if (err) {
          res.status(400).json({
            success: false,
            responseCode: 400,
            result: "Error fetching data",
            msg: "Error fetching data",
          });
        }
        ContractVariations.find(
          {
            $and: [
              dbquery,
              {
                $or: [{ subject: { $regex: dbquery_search, $options: "i" } }],
              },
            ],
          },
          {}
        )
          // .populate({
          //   path: "contract",
          //   model: "contracts",
          // })
          .populate({
            path: "approvalStatus",
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
  }
);
/************End Tasks List API ************************* */

/************* Get Single User API****************/
router.get("/api/variationbyid/:variationId", auth, function (req, res) {
  ContractVariations.findById(req.params.variationId)
    // .populate({
    //   path: "contract",
    //   model: "contracts",
    // })
    .exec(async function (err, cndInfo) {
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Error fetching data",
          result: "error",
        });
      } else {
        let docObj = await ContractDocuments.find({
          refId: cndInfo._id,
        })
          .sort({ _id: -1 })
          .limit(1);
        let docCollection = docObj ? docObj[0].docCollection : "";

        res.status(200).json({
          success: true,
          responseCode: 200,
          result: cndInfo,
          docCollection: docCollection,
          msg: "List fetching successfully",
        });
      }
    });
});
/************End Get Single User API ************************* */

module.exports = router;
