var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ContractPayments = require("../models/ContractPayments");
const loghistory = require("./userhistory");
var ApprovalHistoryTable = require("../models/ApprovalHistory");
var approvalHistory = require("./ApprovalHistoryFunc");
var uploadFile = require("./UploadFileFunc");
var ContractDocuments = require("../models/ContractDocuments");
var moment = require("moment");
const auth = require("../middleware/auth");

/************Start contractPayment ADD/UPDATE API ************************* */
router.post("/api/contract_payment", auth, async function (req, res) {
  if (!req.body.transRefno) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter transRefno.",
    });
  } else {
    if (req.body.id) {
      ContractPayments.findOne(
        {
          _id: req.body.id,
        },
        function (err, contractPayment) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!contractPayment) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Payment with given id not exists!",
            });
          } else {
            ContractPayments.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                contract: req.body.contract
                  ? req.body.contract
                  : contractPayment.contract,
                milestone: req.body.milestone
                  ? req.body.milestone
                  : contractPayment.milestone,
                // isRetention: req.body.isRetention
                //   ? req.body.isRetention
                //   : contractPayment.isRetention,
                // retentionPercentage: req.body.retentionPercentage
                //   ? req.body.retentionPercentage
                //   : contractPayment.retentionPercentage,
                amount: req.body.amount
                  ? req.body.amount
                  : contractPayment.amount,
                transRefno: req.body.transRefno
                  ? req.body.transRefno
                  : contractPayment.transRefno,
                docCollection: req.body.docCollection
                  ? req.body.docCollection
                  : contractPayment.docCollection,
                status: req.body.status
                  ? req.body.status
                  : contractPayment.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : contractPayment.deleted,
                approvalStatus: req.body.approvalStatus
                  ? req.body.approvalStatus
                  : contractPayment.approvalStatus,
                approvalSequence: req.body.approvalSequence
                  ? req.body.approvalSequence
                  : contractPayment.approvalSequence,
                paymentDate: req.body.paymentDate
                  ? req.body.paymentDate
                  : contractPayment.paymentDate,
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
                      "Contract Payment Update",
                      "Update",
                      "contract_payments",
                      "Update Contract Payment",
                      req.get("referer"),
                      contractPayment,
                      result
                    );

                  //******delete old record & re-initiate the approval ******/
                  //delete the (not approved/rejected) record from approval history table
                  //ApprovalHistoryTable
                  ApprovalHistoryTable.findOneAndDelete(
                    {
                      applicationId: req.body.id,
                      approvalType: "CP",
                      //approverId: null,  all records either approved/rejected/initiated can be deleted
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
                    //Contract Payment - insert record in approval history table
                    req.body.approvalStatus &&
                    req.body.approvalStatus == "5e996a81c3f4c40045d3717b"
                  ) {
                    var applicationObj = {
                      contract: req.body.contract,
                      contractName: req.body.contractName,
                      milestoneName: req.body.milestoneName,
                      retentionPercentage: req.body.retentionPercentage,
                      amount: req.body.amount,
                      transRefno: req.body.transRefno,
                      paymentDate: req.body.paymentDate,
                    };
                    approvalHistory(
                      "5eb915782117ee3c78840c76",
                      result._id,
                      req.body.approvalLevel ? req.body.approvalLevel : null,
                      "CP",
                      1,
                      applicationObj
                    );
                  }
                  //remove old document if new document has been uploaded
                  if (
                    req.body.docCollection &&
                    contractPayment.docCollection !== req.body.docCollection
                  ) {
                    //checking condition not to upload same doc again and delete old record for new document.
                    //delete old file
                    ContractDocuments.findOneAndDelete(
                      {
                        refId: req.body.id,
                        refType: "Payment",
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
                      "Payment"
                    );
                  }
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Payment Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD contractPayment **/
      var varObj = {
        contract: req.body.contract,
        milestone: req.body.milestone,
        // isRetention: req.body.isRetention,
        // retentionPercentage: req.body.retentionPercentage,
        amount: req.body.amount,
        transRefno: req.body.transRefno,
        status: req.body.status,
        deleted: req.body.deleted,
        approvalStatus: req.body.approvalStatus,
        approvalSequence: req.body.approvalSequence,
        docCollection: req.body.docCollection,
        paymentDate: req.body.paymentDate
      };
      var newTask = new ContractPayments(varObj);
      newTask.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "subject already exist!, plz try with another.",
            });
          } else {
            if (err.errors && err.errors.subject)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.subject.message,
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
            "Contract Payment Add",
            "Add",
            "contract_payments",
            "Add Payment",
            req.get("referer"),
            null,
            result
          );

        if (
          //Contract Payment - insert record in approval history table
          req.body.approvalStatus &&
          req.body.approvalStatus == "5e996a81c3f4c40045d3717b"
        ) {
          var applicationObj = {
            contract: req.body.contract,
            contractName: req.body.contractName,
            milestoneName: req.body.milestoneName,
            retentionPercentage: req.body.retentionPercentage,
            amount: req.body.amount,
            transRefno: req.body.transRefno,
            paymentDate: req.body.paymentDate
          };
          approvalHistory(
            "5eb915782117ee3c78840c76",
            result._id,
            req.body.approvalLevel ? req.body.approvalLevel : null,
            "CP",
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
          "Payment"
        );
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Payment added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Task ADD/UPDATE API ************************* */

/************* Contracts LIST API****************/
router.get("/api/contract_payment_list/:contractId", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  dbquery.contract = req.params.contractId;
  if (req.query.subject) {
    dbquery.subject = req.query.subject;
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
  ContractPayments.find({
    $and: [
      dbquery,
      // {
      //   $or: [{ amount: { $regex: dbquery_search, $options: "i" } }],
      // },
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
      ContractPayments.find(
        {
          $and: [
            dbquery,
            // {
            //   $or: [{ amount: { $regex: dbquery_search, $options: "i" } }],
            // },
          ],
        },
        {}
      )
        .populate({
          path: "contract",
          model: "contracts",
        })
        .populate({
          path: "milestone",
          model: "contract_milestones",
        })
        .populate({
          path: "approvalStatus",
          model: "cnds",
        })
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, cndInfo) {
          if (err) {
            console.log("err:", err);
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
});
/************End Contracts List API ************************* */

/************* Get Single User API****************/
router.get("/api/paymentbyid/:paymentId", auth, function (req, res) {
  ContractPayments.findById(req.params.paymentId)
    .populate({
      path: "contract",
      model: "contracts",
    })
    .populate({
      path: "milestone",
      model: "contract_milestones",
    })
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
