var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ContractMilestones = require("../models/ContractMilestones");
var ContractPayments = require("../models/ContractPayments");
const loghistory = require("./userhistory");
var approvalHistory = require("./ApprovalHistoryFunc");
var ApprovalHistoryTable = require("../models/ApprovalHistory");
var uploadFile = require("./UploadFileFunc");
var ContractDocuments = require("../models/ContractDocuments");
var moment = require("moment");
const auth = require("../middleware/auth");

/************Start task ADD/UPDATE API ************************* */
router.post("/api/contract_milestone", auth, async function (req, res) {
  if (!req.body.milestoneName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter milestoneName.",
    });
  } else {
    if (req.body.id) {
      ContractMilestones.findOne(
        {
          _id: req.body.id,
        },
        async function (err, contractMilestone) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!contractMilestone) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Milestone with given id not exists!",
            });
          } else {
            //before updating milestone, check if payment is done for the milestone.
            let chkPayments = await ContractPayments.find({
              milestone: req.body.id,
            });
            if (chkPayments.length > 0) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Cannot modify! Milestone has payment(s)",
              });
            }
            //
            await ContractMilestones.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                contract: req.body.contract
                  ? req.body.contract
                  : contractMilestone.contract,
                milestoneName: req.body.milestoneName
                  ? req.body.milestoneName
                  : contractMilestone.milestoneName,
                milestoneDetails: req.body.milestoneDetails
                  ? req.body.milestoneDetails
                  : contractMilestone.milestoneDetails,
                startDate: req.body.startDate
                  ? req.body.startDate
                  : contractMilestone.startDate,
                endDate: req.body.endDate
                  ? req.body.endDate
                  : contractMilestone.endDate,
                milestoneValue: req.body.milestoneValue
                  ? req.body.milestoneValue
                  : contractMilestone.milestoneValue,
                Revision: req.body.Revision
                  ? req.body.Revision
                  : contractMilestone.Revision,
                personResponsible: req.body.personResponsible
                  ? req.body.personResponsible
                  : contractMilestone.personResponsible,
                approvalStatus: req.body.approvalStatus
                  ? req.body.approvalStatus
                  : contractMilestone.approvalStatus,
                approvalSequence: req.body.approvalSequence
                  ? req.body.approvalSequence
                  : contractMilestone.approvalSequence,
                milestoneStatus: req.body.milestoneStatus
                  ? req.body.milestoneStatus
                  : contractMilestone.milestoneStatus,
                remarks: req.body.remarks
                  ? req.body.remarks
                  : contractMilestone.remarks,
                docCollection: req.body.docCollection
                  ? req.body.docCollection
                  : contractMilestone.docCollection,

                status: req.body.status
                  ? req.body.status
                  : contractMilestone.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : contractMilestone.deleted,
                penalty: req.body.penalty,
                retentionPercentage: req.body.retentionPercentage
                  ? req.body.retentionPercentage
                  : contractMilestone.retentionPercentage,
                isRetentionMilestone: req.body.isRetentionMilestone,
              },
              { new: true },
              async function (err, result) {
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
                      "Contract Milestone Update",
                      "Update",
                      "contract_milestones",
                      "Update Contract Milestone",
                      req.get("referer"),
                      contractMilestone,
                      result
                    );

                  //******delete old record & re-initiate the approval ******/
                  //delete the (not approved/rejected) record from approval history table
                  //ApprovalHistoryTable
                  await ApprovalHistoryTable.findOneAndDelete(
                    {
                      applicationId: req.body.id,
                      approvalType: "CM",
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
                      milestoneName: req.body.milestoneName,
                      milestoneStartDate: req.body.milestoneStartDate,
                      milestoneendDate: req.body.milestoneendDate,
                      milestoneValue: req.body.milestoneValue,
                      personResponsibleName: req.body.personResponsibleName,
                      penalty: req.body.penalty,
                      retentionPercentage: req.body.retentionPercentage,
                      isRetentionMilestone: req.body.isRetentionMilestone,
                    };
                    approvalHistory(
                      "5eb915662117ee3c78840c75",
                      result._id,
                      req.body.approvalLevel ? req.body.approvalLevel : null,
                      "CM",
                      1,
                      applicationObj
                    );
                  }

                  //remove old document if new document has been uploaded

                  ///////////////////////////////////
                  if (
                    req.body.docCollection &&
                    contractMilestone.docCollection !== req.body.docCollection
                  ) {
                    //checking condition not to upload same doc again and delete old record for new document.
                    //delete old file
                    await ContractDocuments.findOneAndDelete(
                      {
                        refId: req.body.id,
                        refType: "Milestone",
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
                      "Milestone"
                    );
                  }

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
        milestoneName: req.body.milestoneName,
        milestoneDetails: req.body.milestoneDetails,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        milestoneValue: req.body.milestoneValue,
        Revision: req.body.Revision,
        personResponsible: req.body.personResponsible,

        approvalStatus: req.body.approvalStatus,
        approvalSequence: req.body.approvalSequence,
        status: req.body.status,
        deleted: req.body.deleted,
        penalty: req.body.penalty,
        retentionPercentage: req.body.retentionPercentage,
        docCollection: req.body.docCollection,
        isRetentionMilestone: req.body.isRetentionMilestone,
      };
      var newTask = new ContractMilestones(varObj);
      newTask.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Milestone already exist!, please try with another.",
            });
          } else {
            if (err.errors && err.errors.milestoneName)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.milestoneName.message,
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
            "Contract Milestone Add",
            "Add",
            "contract_milestones",
            "Add Milestone",
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
            milestoneName: req.body.milestoneName,
            milestoneStartDate: req.body.milestoneStartDate,
            milestoneendDate: req.body.milestoneendDate,
            milestoneValue: req.body.milestoneValue,
            personResponsibleName: req.body.personResponsibleName,
            penalty: req.body.penalty,
            retentionPercentage: req.body.retentionPercentage,
            isRetentionMilestone: req.body.isRetentionMilestone,
          };
          approvalHistory(
            "5eb915662117ee3c78840c75",
            result._id,
            req.body.approvalLevel ? req.body.approvalLevel : null,
            "CM",
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
          "Milestone"
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Milestone added successfully.",
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
  "/api/contract_milestone_list/:contractId?",
  auth,
  function (req, res) {
    /*********Search Query build ************/
    var dbquery = {};
    if (req.params.contractId) dbquery.contract = req.params.contractId;

    if (req.query.milestoneName) {
      dbquery.milestoneName = req.query.milestoneName;
    }
    if (req.query.personResponsible) {
      dbquery.personResponsible = req.query.personResponsible;

      //only approved milestones should be visible to assignee
      dbquery.approvalStatus = "5e996ae2c3f4c40045d3717e";
    }
    //below if condition - if it is contract payment
    if (req.query.payflag) {
      //only approved milestones should be visible in payment tab
      dbquery.approvalStatus = "5e996ae2c3f4c40045d3717e";
    }
    if (req.query.approver) {
      dbquery.approver = req.query.approver;
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
    ContractMilestones.find({
      $and: [
        dbquery,
        {
          $or: [{ milestoneName: { $regex: dbquery_search, $options: "i" } }],
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
        ContractMilestones.find(
          {
            $and: [
              dbquery,
              {
                $or: [
                  { milestoneName: { $regex: dbquery_search, $options: "i" } },
                ],
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
            path: "personResponsible",
            model: "users",
            select: "_id firstName lastName",
          })
          .populate({
            path: "approvalStatus",
            model: "cnds",
            select: "_id cndName",
          })
          .populate({
            path: "milestoneStatus",
            model: "cnds",
            select: "_id cndName",
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

              let sumMilestoneValues = 0,
                sumRetentionAmount = 0,
                sumValueBeforeRetention = 0;

              let arrResult = [];

              //for loop start
              for (let i = 0; i < cndInfo.length; i++) {
                let obj = {};

                obj["contract"] = cndInfo[i].contract;
                obj["Revision"] = cndInfo[i].Revision;
                obj["personResponsible"] = cndInfo[i].personResponsible;
                obj["approver"] = cndInfo[i].approver;
                obj["approverRemarks"] = cndInfo[i].approverRemarks;
                obj["approvalStatus"] = cndInfo[i].approvalStatus;
                obj["milestoneStatus"] = cndInfo[i].milestoneStatus;
                obj["remarks"] = cndInfo[i].remarks;
                obj["status"] = cndInfo[i].status;
                obj["deleted"] = cndInfo[i].deleted;
                obj["createdDate"] = cndInfo[i].createdDate;
                obj["updatedDate"] = cndInfo[i].updatedDate;
                obj["approvalSequence"] = cndInfo[i].approvalSequence;
                obj["penalty"] = cndInfo[i].penalty;
                obj["docCollection"] = cndInfo[i].docCollection;
                obj["isRetentionMilestone"] = cndInfo[i].isRetentionMilestone;
                obj["_id"] = cndInfo[i]._id;
                obj["milestoneName"] = cndInfo[i].milestoneName;
                obj["milestoneDetails"] = cndInfo[i].milestoneDetails;
                obj["startDate"] = cndInfo[i].startDate;
                obj["endDate"] = cndInfo[i].endDate;
                obj["milestoneValue"] = cndInfo[i].milestoneValue;
                obj["retentionPercentage"] = cndInfo[i].retentionPercentage;
                obj["retentionAmount"] = 0;
                obj["valueBeforeRetention"] = 0;

                if (cndInfo[i].approvalStatus.cndName !== "Rejected") {
                  sumMilestoneValues =
                    parseFloat(sumMilestoneValues.toFixed(2)) +
                    parseFloat(cndInfo[i].milestoneValue.toFixed(2));

                  if (!cndInfo[i].isRetentionMilestone) {
                    //if this is not ret milestone, then skip summation for ret amt

                    //inorder to allow milestone for rec perc amt, add rec perc from milestone's value
                    let retentionAmount =
                      parseFloat(cndInfo[i].milestoneValue.toFixed(2)) *
                      parseFloat(cndInfo[i].retentionPercentage / 100).toFixed(
                        2
                      );
                    let valueBeforeRetention =
                      parseFloat(cndInfo[i].milestoneValue.toFixed(2)) +
                      parseFloat(retentionAmount.toFixed(2));

                    sumValueBeforeRetention =
                      parseFloat(sumValueBeforeRetention.toFixed(2)) +
                      parseFloat(cndInfo[i].milestoneValue.toFixed(2)) +
                      parseFloat(retentionAmount.toFixed(2));

                    sumRetentionAmount =
                      parseFloat(sumRetentionAmount.toFixed(2)) +
                      parseFloat(retentionAmount.toFixed(2));

                    //arrResult.push({ ...cndInfo[i], quantity: 1 });

                    obj["retentionAmount"] = retentionAmount;
                    obj["valueBeforeRetention"] = valueBeforeRetention;
                  }
                }
                arrResult.push(obj);
              }

              //for loop end
              // console.log(
              //   "sumMilestoneValues, sumRetentionAmount, sumValueBeforeRetention : ",
              //   sumMilestoneValues,
              //   sumRetentionAmount,
              //   sumValueBeforeRetention
              // );
              arrResult.push({
                contract: "",
                Revision: "",
                personResponsible: null,
                approver: null,
                approvalStatus: "totals",
                milestoneStatus: "totals",
                remarks: "",
                approvalSequence: null,
                penalty: null,
                isRetentionMilestone: null,
                _id: null,
                milestoneName: "Totals",
                milestoneDetails: "",
                startDate: null,
                endDate: null,
                retentionPercentage: null,
                milestoneValue: sumMilestoneValues,
                retentionAmount: sumRetentionAmount,
                valueBeforeRetention: sumValueBeforeRetention,
              });
              //console.log("milestone list : ", arrResult);
              res.status(200).json({
                success: true,
                responseCode: 200,
                result: arrResult,
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
router.get("/api/milestonebyid/:milestoneId", auth, function (req, res) {
  ContractMilestones.findById(req.params.milestoneId)
    // .populate({
    //   path: "contract",
    //   model: "contracts",
    // })
    .populate({
      path: "personResponsible",
      model: "users",
      select: "_id firstName lastName",
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

        //get remaining retention amount
        let milestonesArr = await ContractMilestones.find(
          {
            contract: cndInfo.contract,
          },
          {
            approvalStatus: 1,
            isRetentionMilestone: 1,
            milestoneValue: 1,
            retentionPercentage: 1,
            remainingRetentionAmount: 1,
          }
        ).sort({ _id: -1 });

        let retentionAmountMilestone = 0,
          totalRetentionAmountPerc = 0;
        //for loop start
        //console.log("milestonesArr : ", milestonesArr);
        milestonesArr.forEach(function (arrayItem) {
          if (
            arrayItem.approvalStatus.cndName !== "Rejected" &&
            arrayItem._id != req.params.milestoneId
          ) {
            if (!arrayItem.isRetentionMilestone) {
              //if this is not ret milestone, then skip summation for ret amt

              //inorder to allow milestone for rec perc amt, add rec perc from milestone's value
              let retAmount =
                parseFloat(arrayItem.milestoneValue.toFixed(2)) *
                parseFloat(arrayItem.retentionPercentage / 100).toFixed(2);

              totalRetentionAmountPerc =
                parseFloat(totalRetentionAmountPerc.toFixed(2)) +
                parseFloat(retAmount.toFixed(2));
            }
            if (arrayItem.isRetentionMilestone) {
              //check for all ret milestone to get ret amt
              retentionAmountMilestone =
                parseFloat(retentionAmountMilestone.toFixed(2)) +
                parseFloat(arrayItem.milestoneValue.toFixed(2));
            }
          }
        });
        //for loop end

        //remaining ret amt = total retention % amount - already available milestone retention values
        let remainingRetentionAmount = 0;
        remainingRetentionAmount =
          parseFloat(totalRetentionAmountPerc.toFixed(2)) -
          parseFloat(retentionAmountMilestone.toFixed(2));

        // if (cndInfo.isRetentionMilestone === false) {
        //   remainingRetentionAmount = 0;
        // }

        //console.log("remainingRetentionAmount : ", remainingRetentionAmount);
        res.status(200).json({
          success: true,
          responseCode: 200,
          result: cndInfo,
          docCollection: docCollection,
          remainingRetentionAmount: remainingRetentionAmount,
          msg: "List fetching successfully",
        });
      }
    });
});
/************End Get Single User API ************************* */

module.exports = router;
