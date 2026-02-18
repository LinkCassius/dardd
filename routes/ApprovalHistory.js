var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var { User } = require("../models/User");
var Contracts = require("../models/Contracts");
var ContractVariations = require("../models/ContractVariations");
var ContractMilestones = require("../models/ContractMilestones");
var ContractPayments = require("../models/ContractPayments");
var FarmAssetsServices = require("../models/FarmAssetsServices");
var ApprovalSetup = require("../models/ApprovalSetup");
var ApprovalAreas = require("../models/ApprovalAreas");
var ApprovalHistory = require("../models/ApprovalHistory");
const loghistory = require("./userhistory");
var approvalHistory = require("./ApprovalHistoryFunc");
//var sendMailFunc = require("./SendMailFunc");
const { sendMailFunc } = require("./SendMailACS");
var moment = require("moment");
const auth = require("../middleware/auth");

/************Start ApprovalHistory ADD / CAPTURE API ************************* */
router.post("/api/approvalhistory", auth, async function (req, res) {
  if (!req.body.approvalStatus) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Approval Status.",
    });
  } else {
    if (req.body.id) {
      ApprovalHistory.findOne(
        {
          _id: req.body.id,
        },
        function (err, approvalhistoryObj) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!approvalhistoryObj) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "ApprovalHistory with given id not exists!",
            });
          } else {
            ApprovalHistory.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                approvalArea: req.body.approvalArea
                  ? req.body.approvalArea
                  : approvalhistoryObj.approvalArea,
                applicationId: req.body.applicationId
                  ? req.body.applicationId
                  : approvalhistoryObj.applicationId,
                approvalLevel: req.body.approvalLevel
                  ? req.body.approvalLevel
                  : approvalhistoryObj.approvalLevel,
                approvalType: req.body.approvalType
                  ? req.body.approvalType
                  : approvalhistoryObj.approvalType,
                approverId: req.body.approverId
                  ? req.body.approverId
                  : approvalhistoryObj.approverId,
                sequence: req.body.sequence
                  ? req.body.sequence
                  : approvalhistoryObj.sequence,
                approvalStatus: req.body.approvalStatus
                  ? req.body.approvalStatus
                  : approvalhistoryObj.approvalStatus,
                approverRemarks: req.body.approverRemarks
                  ? req.body.approverRemarks
                  : approvalhistoryObj.approverRemarks,

                status: req.body.status
                  ? req.body.status
                  : approvalhistoryObj.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : approvalhistoryObj.deleted,
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

                  //   var ip = req.connection.remoteAddress;
                  //   console.log("ip Address : ", ip);
                  if (req.user._id)
                    loghistory(
                      req.user._id,
                      "Approval History Updated",
                      "Update",
                      "approval_history",
                      "approval history edit",
                      req.get("referer"),
                      approvalhistoryObj,
                      result
                    );

                  //check if sequence is last and update main table, else insert new record in history

                  let approvalSetup = await ApprovalSetup.find({
                    approvalType: approvalhistoryObj.approvalType,
                    sequence: approvalhistoryObj.sequence + 1,
                  });
                  if (approvalSetup.length > 0) {
                    //insert new record in approval history
                    approvalHistory(
                      approvalSetup[0].approvalArea,
                      approvalhistoryObj.applicationId,
                      approvalSetup[0].approvalLevel,
                      approvalhistoryObj.approvalType,
                      approvalhistoryObj.sequence + 1,
                      approvalhistoryObj.applicationObject
                    );
                    let ApprovalAreaType = "",
                      mailBody = "";
                    if (approvalSetup[0].approvalType == "CS") {
                      //update sequence in main table *** Start ***
                      await Contracts.findByIdAndUpdate(
                        approvalhistoryObj.applicationId,
                        {
                          contractStatus_ApprSequence:
                            approvalhistoryObj.sequence + 1,
                        }
                      );
                      //update sequence in main table *** End ***

                      ApprovalAreaType = "Contract Status";
                      if (approvalhistoryObj.applicationObject !== null) {
                        mailBody =
                          "Contract Name:" +
                          approvalhistoryObj.applicationObject.contractName +
                          "<br/>" +
                          // "Contract Number:" +
                          // contractInfo[0].contractNumber +
                          // "<br/>" +
                          "You are requested to approve contract-status change from : <br/><b>" +
                          approvalhistoryObj.applicationObject.fromStatus +
                          " </b>" +
                          "to " +
                          "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                          approvalhistoryObj.applicationObject.toStatus +
                          "</span><br/>";
                      } else {
                        let contractInfo = await Contracts.find({
                          _id: approvalhistoryObj.applicationId,
                        })
                          .populate({
                            path: "contractStatus",
                            model: "cnds",
                          })
                          .populate({
                            path: "contractStatus_ApprValue",
                            model: "cnds",
                          });
                        mailBody =
                          "Contract Name:" +
                          contractInfo[0].contractName +
                          "<br/>" +
                          "Contract Number:" +
                          contractInfo[0].contractNumber +
                          "<br/>" +
                          "You are requested to approve contract-status change from : <br/><b>" +
                          contractInfo[0].contractStatus.cndName +
                          " </b>" +
                          "to " +
                          "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                          contractInfo[0].contractStatus_ApprValue.cndName +
                          "</span><br/>";
                      }
                    } else if (approvalSetup[0].approvalType == "CE") {
                      //update sequence in main table *** Start ***
                      await Contracts.findByIdAndUpdate(
                        approvalhistoryObj.applicationId,
                        {
                          endDate_ApprSequence: approvalhistoryObj.sequence + 1,
                        }
                      );
                      //update sequence in main table *** End ***

                      ApprovalAreaType = "Contract Extension";

                      if (approvalhistoryObj.applicationObject !== null) {
                        mailBody =
                          "Contract Name:" +
                          approvalhistoryObj.applicationObject.contractName +
                          "<br/>" +
                          // "Contract Number:" +
                          // contractInfo[0].contractNumber +
                          // "<br/>" +
                          "You are requested to approve contract-extension from : <br/><b>" +
                          approvalhistoryObj.applicationObject.fromEndDate +
                          " </b>" +
                          "to " +
                          "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                          approvalhistoryObj.applicationObject.toEndDate +
                          "</span><br/>";
                      } else {
                        let contractInfo = await Contracts.find({
                          _id: approvalhistoryObj.applicationId,
                        }).populate({
                          path: "endDate_ApprStatus",
                          model: "cnds",
                        });
                        mailBody =
                          "Contract Name:" +
                          contractInfo[0].contractName +
                          "<br/>" +
                          "Contract Number:" +
                          contractInfo[0].contractNumber +
                          "<br/>" +
                          "You are requested to approve contract-extension from : <br/><b>" +
                          moment(contractInfo[0].endDate * 1000).format(
                            "DD/MM/YYYY"
                          ) +
                          " </b>" +
                          "to " +
                          "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                          moment(
                            contractInfo[0].endDate_ApprValue * 1000
                          ).format("DD/MM/YYYY") +
                          "</span><br/>";
                      }
                    } else if (approvalSetup[0].approvalType == "CV") {
                      //update sequence in main table *** Start ***
                      await ContractVariations.findByIdAndUpdate(
                        approvalhistoryObj.applicationId,
                        {
                          approvalSequence: approvalhistoryObj.sequence + 1,
                        }
                      );
                      //update sequence in main table *** End ***

                      ApprovalAreaType = "Contract Variation";
                      if (approvalhistoryObj.applicationObject !== null) {
                        mailBody =
                          "Contract Name:" +
                          approvalhistoryObj.applicationObject.contractName +
                          "<br/>" +
                          // "Contract Number:" +
                          // contractInfo[0].contract.contractNumber +
                          // "<br/>" +
                          "You are requested to approve contract-variation : <br/>" +
                          "<b> Subject:" +
                          approvalhistoryObj.applicationObject.subject +
                          // "  <br/>" +
                          // "Units:" +
                          // approvalhistoryObj.applicationObject.unit +
                          // "  <br/>" +
                          // "Rate:" +
                          // approvalhistoryObj.applicationObject.rate +
                          "<br/>" +
                          "Amount:" +
                          approvalhistoryObj.applicationObject.amount +
                          " </b> <br/>";
                      } else {
                        let contractInfo = await ContractVariations.find({
                          _id: approvalhistoryObj.applicationId,
                        }).populate({
                          path: "contract",
                          model: "contracts",
                        });

                        mailBody =
                          "Contract Name:" +
                          contractInfo[0].contract.contractName +
                          "<br/>" +
                          "Contract Number:" +
                          contractInfo[0].contract.contractNumber +
                          "<br/>" +
                          "You are requested to approve contract-variation : <br/>" +
                          "<b> Subject:" +
                          contractInfo[0].subject +
                          "  <br/>" +
                          "Units:" +
                          contractInfo[0].unit +
                          "  <br/>" +
                          "Rate:" +
                          contractInfo[0].rate +
                          "<br/>" +
                          "Amount:" +
                          contractInfo[0].amount +
                          " </b> <br/>";
                      }
                    } else if (approvalSetup[0].approvalType == "CM") {
                      //update sequence in main table *** Start ***
                      await ContractMilestones.findByIdAndUpdate(
                        approvalhistoryObj.applicationId,
                        {
                          approvalSequence: approvalhistoryObj.sequence + 1,
                        }
                      );
                      //update sequence in main table *** End ***

                      ApprovalAreaType = "Contract Milestone";
                      if (approvalhistoryObj.applicationObject !== null) {
                        mailBody =
                          "Contract Name:" +
                          approvalhistoryObj.applicationObject.contractName +
                          "<br/>" +
                          // "Contract Number:" +
                          // contractInfo[0].contract.contractNumber +
                          // "<br/>" +
                          "You are requested to approve contract-milestone : <br/>" +
                          "<b> Milestone Name: " +
                          approvalhistoryObj.applicationObject.milestoneName +
                          "  <br/>" +
                          "StartDate: " +
                          moment(
                            approvalhistoryObj.applicationObject.milestoneStartDate
                          ).format("DD/MM/YYYY") +
                          "  <br/>" +
                          "EndDate: " +
                          moment(
                            approvalhistoryObj.applicationObject.milestoneendDate
                          ).format("DD/MM/YYYY") +
                          "<br/>" +
                          "Milestone Value: " +
                          approvalhistoryObj.applicationObject.milestoneValue +
                          "  <br/>" +
                          "Retention %: " +
                          approvalhistoryObj.applicationObject
                            .retentionPercentage +
                          "<br/>" +
                          "Person Responsible: " +
                          approvalhistoryObj.applicationObject
                            .personResponsibleName;
                        (" </b> <br/>");
                      } else {
                        let contractInfo = await ContractMilestones.find({
                          _id: approvalhistoryObj.applicationId,
                        })
                          .populate({
                            path: "contract",
                            model: "contracts",
                          })
                          .populate({
                            path: "personResponsible",
                            model: "users",
                          });

                        mailBody =
                          "Contract Name:" +
                          contractInfo[0].contract.contractName +
                          "<br/>" +
                          "Contract Number:" +
                          contractInfo[0].contract.contractNumber +
                          "<br/>" +
                          "You are requested to approve contract-milestone : <br/>" +
                          "<b> Milestone Name: " +
                          contractInfo[0].milestoneName +
                          "  <br/>" +
                          "StartDate: " +
                          moment(contractInfo[0].startDate * 1000).format(
                            "DD/MM/YYYY"
                          ) +
                          "  <br/>" +
                          "EndDate: " +
                          moment(contractInfo[0].endDate * 1000).format(
                            "DD/MM/YYYY"
                          ) +
                          "<br/>" +
                          "Milestone Value: " +
                          contractInfo[0].milestoneValue +
                          "  <br/>" +
                          "Retention %: " +
                          contractInfo[0].retentionPercentage +
                          "<br/>" +
                          "Person Responsible: " +
                          contractInfo[0].personResponsible.firstName +
                          " " +
                          contractInfo[0].personResponsible.lastName;
                        (" </b> <br/>");
                      }
                    } else if (approvalSetup[0].approvalType == "CP") {
                      //update sequence in main table *** Start ***
                      await ContractPayments.findByIdAndUpdate(
                        approvalhistoryObj.applicationId,
                        {
                          approvalSequence: approvalhistoryObj.sequence + 1,
                        }
                      );
                      //update sequence in main table *** End ***

                      ApprovalAreaType = "Contract Payment";

                      if (approvalhistoryObj.applicationObject !== null) {
                        mailBody =
                          "Contract Name:" +
                          approvalhistoryObj.applicationObject.contractName +
                          "<br/>" +
                          // "Contract Number:" +
                          // contractInfo[0].contract.contractNumber +
                          // "<br/>" +
                          "You are requested to approve payment for: <br/>" +
                          "<b> Milestone: " +
                          approvalhistoryObj.applicationObject.milestoneName +
                          "  <br/>" +
                          "Amount: " +
                          approvalhistoryObj.applicationObject.amount +
                          " <br/>" +
                          "Remarks : " +
                          approvalhistoryObj.applicationObject.transRefno +
                          " </b> <br/>";
                      } else {
                        let contractInfo = await ContractPayments.find({
                          _id: approvalhistoryObj.applicationId,
                        })
                          .populate({
                            path: "contract",
                            model: "contracts",
                          })
                          .populate({
                            path: "milestone",
                            model: "contract_milestones",
                          });

                        mailBody =
                          "Contract Name:" +
                          contractInfo[0].contract.contractName +
                          "<br/>" +
                          "Contract Number:" +
                          contractInfo[0].contract.contractNumber +
                          "<br/>" +
                          "You are requested to approve payment for: <br/>" +
                          "<b> Milestone: " +
                          contractInfo[0].milestone.milestoneName +
                          "  <br/>" +
                          "Amount: " +
                          contractInfo[0].amount +
                          " <br/>" +
                          "Remarks : " +
                          contractInfo[0].transRefno +
                          " </b> <br/>";
                      }
                    } else if (approvalSetup[0].approvalType == "FR") {
                      //update sequence in main table *** Start ***
                      await FarmAssetsServices.findByIdAndUpdate(
                        approvalhistoryObj.applicationId,
                        {
                          approvalSequence: approvalhistoryObj.sequence + 1,
                        }
                      );
                      //update sequence in main table *** End ***

                      ApprovalAreaType = "Farmer Registration";

                      if (approvalhistoryObj.applicationObject !== null) {
                        mailBody =
                          "You are requested to approve new farmer registration";
                      }
                    }
                    //send mails to the next approver
                    if (approvalSetup[0].approvalLevel == "User") {
                      sendMailFunc(
                        3,
                        "Approver",
                        "Request for approval - " + ApprovalAreaType,
                        mailBody,
                        approvalSetup[0].approverId
                      );
                    } else if (approvalSetup[0].approvalLevel == "Role") {
                      let userInfo = await User.find({
                        userGroup: approvalSetup[0].approverId,
                      });

                      for (var i = 0; i < userInfo.length; i++) {
                        sendMailFunc(
                          3,
                          "Approver",
                          "Request for approval - " + ApprovalAreaType,
                          mailBody,
                          userInfo[i]._id
                        );
                      }
                    } else if (approvalSetup[0].approvalLevel == "Supervisor") {
                      let user_createdBy = await User.findOne(
                        {
                          _id: approvalhistoryObj.applicationObject.createdBy,
                        },
                        { _id: 1, supervisor: 1 }
                      );

                      if (user_createdBy) {
                        sendMailFunc(
                          3,
                          "Approver",
                          "Request for approval - " + ApprovalAreaType,
                          mailBody,
                          user_createdBy.supervisor
                        );
                      }
                    }
                  } else {
                    //update main tables with final status
                    if (approvalhistoryObj.approvalType == "CS") {
                      //update contract table for cotract status

                      await Contracts.findOne(
                        {
                          _id: approvalhistoryObj.applicationId,
                        },
                        async function (err, contractObjStatus) {
                          if (err) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Internal Server Error.",
                            });
                          }
                          if (!contractObjStatus) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "contract with given id not exists!",
                            });
                          } else {
                            await Contracts.findOneAndUpdate(
                              {
                                _id: approvalhistoryObj.applicationId,
                              },
                              {
                                contractStatus_ApprValue: null,
                                contractStatus_ApprStatus:
                                  req.body.approvalStatus,
                                contractStatus_LastUpdated:
                                  new Date().getTime(),
                                contractStatus:
                                  //contractObjStatus.contractStatus_ApprValue,
                                  req.body.approvalStatus_Text &&
                                  req.body.approvalStatus_Text == "Approved"
                                    ? contractObjStatus.contractStatus_ApprValue
                                    : contractObjStatus.contractStatus,
                                contractStatus_ApprSequence:
                                  approvalhistoryObj.sequence,
                              },
                              { new: true },
                              function (err, resultContract) {
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
                                      "Contract Status Update",
                                      "Update",
                                      "contracts",
                                      "Update Contract",
                                      req.get("referer"),
                                      contractObjStatus,
                                      resultContract
                                    );

                                  var result1 = JSON.parse(
                                    JSON.stringify(resultContract)
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    } else if (approvalhistoryObj.approvalType == "CE") {
                      //update contract table for cotract extension

                      await Contracts.findOne(
                        {
                          _id: approvalhistoryObj.applicationId,
                        },
                        async function (err, contractObjStatus) {
                          if (err) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Internal Server Error.",
                            });
                          }
                          if (!contractObjStatus) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "contract with given id not exists!",
                            });
                          } else {
                            await Contracts.findOneAndUpdate(
                              {
                                _id: approvalhistoryObj.applicationId,
                              },
                              {
                                endDate_ApprValue: null,
                                endDate_ApprStatus: req.body.approvalStatus,
                                endDate_LastUpdated: new Date().getTime(),
                                endDate:
                                  req.body.approvalStatus_Text &&
                                  req.body.approvalStatus_Text == "Approved"
                                    ? contractObjStatus.endDate_ApprValue
                                    : contractObjStatus.endDate,
                                endDate_ApprSequence:
                                  approvalhistoryObj.sequence,
                              },
                              { new: true },
                              function (err, resultContract) {
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
                                      "Contract Status Update",
                                      "Update",
                                      "contracts",
                                      "Update Contract",
                                      req.get("referer"),
                                      contractObjStatus,
                                      resultContract
                                    );

                                  var result1 = JSON.parse(
                                    JSON.stringify(resultContract)
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    } else if (approvalhistoryObj.approvalType == "CV") {
                      //update contract table for cotract variation

                      await ContractVariations.findOne(
                        {
                          _id: approvalhistoryObj.applicationId,
                        },
                        async function (err, contractObjStatus) {
                          if (err) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Internal Server Error.",
                            });
                          }
                          if (!contractObjStatus) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "contract variation with given id not exists!",
                            });
                          } else {
                            await ContractVariations.findOneAndUpdate(
                              {
                                _id: approvalhistoryObj.applicationId,
                              },
                              {
                                approvalStatus: req.body.approvalStatus,
                                updatedDate: new Date().getTime(),
                                approvalSequence: approvalhistoryObj.sequence,
                              },
                              { new: true },
                              function (err, resultContract) {
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
                                      "Contract Variation Status Update",
                                      "Update",
                                      "contract_variations",
                                      "Update Contract Variation",
                                      req.get("referer"),
                                      contractObjStatus,
                                      resultContract
                                    );

                                  var result1 = JSON.parse(
                                    JSON.stringify(resultContract)
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    } else if (approvalhistoryObj.approvalType == "CM") {
                      //update contract table for cotract milestone

                      let contractMile = await ContractMilestones.findOne(
                        {
                          _id: approvalhistoryObj.applicationId,
                        },
                        async function (err, contractObjStatus) {
                          if (err) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Internal Server Error.",
                            });
                          }
                          if (!contractObjStatus) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "contract milestone with given id not exists!",
                            });
                          } else {
                            await ContractMilestones.findOneAndUpdate(
                              {
                                _id: approvalhistoryObj.applicationId,
                              },
                              {
                                approvalStatus: req.body.approvalStatus,
                                updatedDate: new Date().getTime(),
                                approvalSequence: approvalhistoryObj.sequence,
                              },
                              { new: true },
                              function (err, resultContract) {
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
                                      "Contract Milestone Status Update",
                                      "Update",
                                      "contract_milestones",
                                      "Update Contract Milestone",
                                      req.get("referer"),
                                      contractObjStatus,
                                      resultContract
                                    );

                                  var result1 = JSON.parse(
                                    JSON.stringify(resultContract)
                                  );

                                  //send mail to assignee person
                                  if (contractMile) {
                                    var mailBody =
                                      "Contract Name:" +
                                      contractMile.contract.contractName +
                                      "<br/>" +
                                      "Contract Number:" +
                                      contractMile.contract.contractNumber +
                                      "<br/>" +
                                      "Milestone Details : <br/>" +
                                      "<b> Milestone Name: " +
                                      contractMile.milestoneName +
                                      "  <br/>" +
                                      "StartDate: " +
                                      moment(
                                        contractMile.startDate * 1000
                                      ).format("DD/MM/YYYY") +
                                      "  <br/>" +
                                      "EndDate: " +
                                      moment(
                                        contractMile.endDate * 1000
                                      ).format("DD/MM/YYYY") +
                                      "<br/>" +
                                      "Milestone Value: " +
                                      contractMile.milestoneValue +
                                      "<br/>" +
                                      "Person Responsible: " +
                                      contractMile.personResponsible.firstName +
                                      " " +
                                      contractMile.personResponsible.lastName +
                                      " </b> <br/>";
                                    if (
                                      resultContract.approvalStatus ==
                                      "5e996ae2c3f4c40045d3717e"
                                    ) {
                                      //send mail only if it approved
                                      sendMailFunc(
                                        2,
                                        "PersonResponsible",
                                        "Milestone Responsibility",
                                        mailBody,
                                        contractMile.personResponsible._id
                                      );
                                    }
                                  }
                                }
                              }
                            );
                          }
                        }
                      )
                        .populate({
                          path: "contract",
                          model: "contracts",
                        })
                        .populate({
                          path: "personResponsible",
                          model: "users",
                        });
                    } else if (approvalhistoryObj.approvalType == "CP") {
                      //update contract table for cotract payment

                      await ContractPayments.findOne(
                        {
                          _id: approvalhistoryObj.applicationId,
                        },
                        async function (err, contractObjStatus) {
                          if (err) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Internal Server Error.",
                            });
                          }
                          if (!contractObjStatus) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "contract payment with given id not exists!",
                            });
                          } else {
                            await ContractPayments.findOneAndUpdate(
                              {
                                _id: approvalhistoryObj.applicationId,
                              },
                              {
                                approvalStatus: req.body.approvalStatus,
                                updatedDate: new Date().getTime(),
                                approvalSequence: approvalhistoryObj.sequence,
                              },
                              { new: true },
                              function (err, resultContract) {
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
                                      "Contract Payment Status Update",
                                      "Update",
                                      "contract_payments",
                                      "Update Contract Payment",
                                      req.get("referer"),
                                      contractObjStatus,
                                      resultContract
                                    );

                                  var result1 = JSON.parse(
                                    JSON.stringify(resultContract)
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    } else if (approvalhistoryObj.approvalType == "FR") {
                      //update Farmer Assets table

                      await FarmAssetsServices.findOne(
                        {
                          _id: approvalhistoryObj.applicationId,
                        },
                        async function (err, farmerObjStatus) {
                          if (err) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Internal Server Error.",
                            });
                          }
                          if (!farmerObjStatus) {
                            return res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "farmer with given id not exists!",
                            });
                          } else {
                            await FarmAssetsServices.findOneAndUpdate(
                              {
                                _id: approvalhistoryObj.applicationId,
                              },
                              {
                                approvalStatus: req.body.approvalStatus,
                                updatedDate: new Date().getTime(),
                                approvalSequence: approvalhistoryObj.sequence,
                              },
                              { new: true },
                              function (err, resultFarmer) {
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
                                      "Farmer Register Status Update",
                                      "Update",
                                      "farmer registration",
                                      "Update farmer registration",
                                      req.get("referer"),
                                      farmerObjStatus,
                                      resultFarmer
                                    );

                                  var result1 = JSON.parse(
                                    JSON.stringify(resultFarmer)
                                  );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }

                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Approval History Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Approval History **/

      var Obj = {
        approvalArea: req.body.approvalArea,
        applicationId: req.body.applicationId,
        approvalLevel: req.body.approvalLevel,
        approvalType: req.body.approvalType,
        approverId: req.body.approverId,
        sequence: req.body.sequence,
        approvalStatus: req.body.approvalStatus,
        approverRemarks: req.body.approverRemarks,

        status: req.body.status,
        deleted: req.body.deleted,
      };
      var newObj = new ApprovalHistory(Obj);
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
            "Approval History Add",
            "Add",
            "approval_history",
            "Add Approval History",
            req.get("referer"),
            null,
            result
          );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Approval History added successfully.",
          result: result,
        });
      });
    }
  }
});
/************End ApprovalHistory API ************************* */

/************* Approval History LIST API****************/
router.get("/api/approvalhistorylist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.approvalArea) {
    dbquery.approvalArea = req.query.approvalArea;
  }
  if (req.query.approvalhistoryid) {
    dbquery._id = req.query.approvalhistoryid;
  }

  if (req.query.applicationId) {
    dbquery.applicationId = req.query.applicationId;
  }

  if (req.query.approvalLevel) {
    dbquery.approvalLevel = req.query.approvalLevel;
  }

  if (req.query.approverId) {
    dbquery.approverId = req.query.approverId;
  }

  if (req.query.sequence) {
    dbquery.sequence = req.query.sequence;
  }

  if (req.query.approvalStatus) {
    dbquery.approvalStatus = req.query.approvalStatus;
  }

  /************total count query start here ********/
  // Find some documents
  ApprovalHistory.find(dbquery)
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
      ApprovalHistory.find(dbquery, {})
        .populate({
          path: "approvalArea",
          model: "approval_areas",
        })
        .populate({
          path: "approvalStatus",
          model: "cnds",
        })
        .exec(function (err, info) {
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
/************End Approval History List API ************************* */

/************* Pending Approval LIST API****************/
router.get("/api/pendingapprovalslistold", async function (req, res) {
  /*********Search Query build ************/

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

  ApprovalHistory.find({
    approvalType: req.query.approvalArea,
    approverId: null,
  })
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
      ApprovalHistory.find(
        {
          approvalType: req.query.approvalArea,
          approverId: null,
        },
        { status: 0, deleted: 0 }
      )
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(async function (err, approvalHistory) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
            });
          } else {
            let aHResult = [];
            // console.log("ah : ", approvalHistory.length);
            for (var i = 0; i < approvalHistory.length; i++) {
              let obj = {};

              let approvalSetup = await ApprovalSetup.find(
                {
                  approvalType: approvalHistory[i].approvalType,
                  sequence: approvalHistory[i].sequence,
                },
                { approverId: 1 }
              );

              obj["approvalArea"] = approvalHistory[i].approvalArea;
              obj["approvalLevel"] = approvalHistory[i].approvalLevel;
              obj["approverId"] = null;
              obj["approvalType"] = approvalHistory[i].approvalType;
              obj["sequence"] = approvalHistory[i].sequence;
              obj["approvalStatus"] = null;
              obj["approverRemarks"] = null;
              obj["approvalDate"] = approvalHistory[i].approvalDate;
              obj["_id"] = approvalHistory[i]._id;
              obj["applicationId"] = approvalHistory[i].applicationId;

              if (approvalHistory[i].approvalLevel === "User") {
                let user = await User.findOne(
                  {
                    _id: approvalSetup[0].approverId,
                  },
                  { _id: 1, firstName: 1, lastName: 1 }
                );
                if (user) {
                  obj["userid"] = user._id;
                  obj["username"] = user.firstName + " " + user.lastName;
                } else {
                  obj["userid"] = "NA";
                  obj["username"] = "NA";
                }
              } else if (approvalHistory[i].approvalLevel === "Role") {
                let role = await User.find(
                  {
                    userGroup: approvalSetup[0].approverId,
                    _id: req.user._id,
                  },
                  { _id: 1, firstName: 1, lastName: 1 }
                );

                if (role.length > 0) {
                  obj["userid"] = role[0]._id;
                  obj["username"] = role[0].firstName + " " + role[0].lastName;
                } else {
                  obj["userid"] = "NA";
                  obj["username"] = "NA";
                }
              }
              // else if (approvalHistory[i].approvalLevel === "Supervisor") {
              //   let user = await User.findOne(
              //     {
              //       _id: req.query.userid,
              //     },
              //     { _id: 1, firstName: 1, lastName: 1 }
              //   );
              //   if (user) {
              //     obj["userid"] = user._id;
              //     obj["username"] = user.firstName + " " + user.lastName;
              //   } else {
              //     obj["userid"] = "NA";
              //     obj["username"] = "NA";
              //   }
              // }
              //contract details for contract status/extension
              if (
                approvalHistory[i].approvalType == "CS" ||
                approvalHistory[i].approvalType == "CE"
              ) {
                if (approvalHistory[i].approvalType == "CS") {
                  if (approvalHistory[i].applicationObject !== null) {
                    obj["requestInfo"] =
                      "Request for Contract Status change for the contract name : " +
                      approvalHistory[i].applicationObject.contractName +
                      " - status from " +
                      approvalHistory[i].applicationObject.fromStatus +
                      " to " +
                      approvalHistory[i].applicationObject.toStatus;

                    obj["contractId"] =
                      approvalHistory[i].applicationObject.contract;
                  } else {
                    let contract = await Contracts.find({
                      _id: approvalHistory[i].applicationId,
                    })
                      .populate({
                        path: "contractStatus",
                        model: "cnds",
                      })
                      .populate({
                        path: "contractStatus_ApprValue",
                        model: "cnds",
                      });

                    obj["requestInfo"] =
                      "Request for Contract Status change for the contract name : " +
                      contract[0].contractName +
                      " - status from " +
                      contract[0].contractStatus.cndName +
                      " to " +
                      contract[0].contractStatus_ApprValue.cndName;

                    obj["contractId"] = contract[0]._id;
                  }
                } else if (approvalHistory[i].approvalType == "CE") {
                  if (approvalHistory[i].applicationObject !== null) {
                    obj["requestInfo"] =
                      "Request for Contract Extension for the contract name : " +
                      approvalHistory[i].applicationObject.contractName +
                      " - End-Date from " +
                      approvalHistory[i].applicationObject.fromEndDate +
                      //moment(contract[0].endDate * 1000).format("DD/MM/YYYY") +
                      " to " +
                      //moment(contract[0].endDate_ApprValue * 1000).format("DD/MM/YYYY");
                      approvalHistory[i].applicationObject.toEndDate;
                    obj["contractId"] =
                      approvalHistory[i].applicationObject.contract;
                  } else {
                    let contract = await Contracts.find({
                      _id: approvalHistory[i].applicationId,
                    })
                      .populate({
                        path: "contractStatus",
                        model: "cnds",
                      })
                      .populate({
                        path: "contractStatus_ApprValue",
                        model: "cnds",
                      });

                    obj["requestInfo"] =
                      "Request for Contract Extension for the contract name : " +
                      contract[0].contractName +
                      " - End-Date from " +
                      moment(contract[0].endDate * 1000).format("DD/MM/YYYY") +
                      " to " +
                      moment(contract[0].endDate_ApprValue * 1000).format(
                        "DD/MM/YYYY"
                      );
                    obj["contractId"] = contract[0]._id;
                  }
                }
              } else if (approvalHistory[i].approvalType == "CV") {
                if (approvalHistory[i].applicationObject !== null) {
                  obj["requestInfo"] =
                    "Request for Contract Variation for the contract name : " +
                    approvalHistory[i].applicationObject.contractName +
                    "- Details - Subject : " +
                    approvalHistory[i].applicationObject.subject +
                    // " ; Unit : " +
                    // approvalHistory[i].applicationObject.unit +
                    // " ; Rate : " +
                    // approvalHistory[i].applicationObject.rate +
                    " ; Amount : " +
                    new Intl.NumberFormat("en-za", {
                      style: "currency",
                      currency: "ZAR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(approvalHistory[i].applicationObject.amount);
                  obj["contractId"] =
                    approvalHistory[i].applicationObject.contract;
                } else {
                  let contract = await ContractVariations.find({
                    _id: approvalHistory[i].applicationId,
                  }).populate({
                    path: "contract",
                    model: "contracts",
                  });

                  if (contract) {
                    obj["requestInfo"] =
                      "Request for Contract Variation for the contract name : " +
                      contract[0].contract.contractName +
                      "- Details - Subject : " +
                      contract[0].subject +
                      // " ; Unit : " +
                      // contract[0].unit +
                      // " ; Rate : " +
                      // contract[0].rate +
                      " ; Amount : " +
                      new Intl.NumberFormat("en-za", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(contract[0].amount);
                    obj["contractId"] = contract[0].contract._id;
                  }
                }
              } else if (approvalHistory[i].approvalType == "CM") {
                if (approvalHistory[i].applicationObject !== null) {
                  obj["requestInfo"] =
                    "Request for Contract Milestone for the contract name : " +
                    approvalHistory[i].applicationObject.contractName +
                    "- Details - Milestone Name : " +
                    approvalHistory[i].applicationObject.milestoneName +
                    " ; StartDate : " +
                    moment(
                      approvalHistory[i].applicationObject.milestoneStartDate
                    ).format("DD/MM/YYYY") +
                    " ; EndDate : " +
                    moment(
                      approvalHistory[i].applicationObject.milestoneendDate
                    ).format("DD/MM/YYYY") +
                    " ; Milestone Value : " +
                    new Intl.NumberFormat("en-za", {
                      style: "currency",
                      currency: "ZAR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(
                      approvalHistory[i].applicationObject.milestoneValue
                    ) +
                    " ; Person Responsible : " +
                    approvalHistory[i].applicationObject.personResponsibleName;
                  obj["contractId"] =
                    approvalHistory[i].applicationObject.contract;
                } else {
                  let contract = await ContractMilestones.find({
                    _id: approvalHistory[i].applicationId,
                  })
                    .populate({
                      path: "contract",
                      model: "contracts",
                    })
                    .populate({
                      path: "personResponsible",
                      model: "users",
                    });

                  if (contract) {
                    obj["requestInfo"] =
                      "Request for Contract Milestone for the contract name : " +
                      contract[0].contract.contractName +
                      "- Details - Milestone Name : " +
                      contract[0].milestoneName +
                      " ; StartDate : " +
                      moment(contract[0].startDate * 1000).format(
                        "DD/MM/YYYY"
                      ) +
                      " ; EndDate : " +
                      moment(contract[0].endDate * 1000).format("DD/MM/YYYY") +
                      " ; Milestone Value : " +
                      new Intl.NumberFormat("en-za", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(contract[0].milestoneValue) +
                      " ; Person Responsible : " +
                      contract[0].personResponsible.firstName +
                      " " +
                      contract[0].personResponsible.lastName;
                    obj["contractId"] = contract[0].contract._id;
                  }
                }
              } else if (approvalHistory[i].approvalType == "CP") {
                if (approvalHistory[i].applicationObject !== null) {
                  obj["requestInfo"] =
                    "Request for Payment for the contract name : " +
                    approvalHistory[i].applicationObject.contractName +
                    " for the milestone : " +
                    approvalHistory[i].applicationObject.milestoneName +
                    // "- Retention % : " +
                    // approvalHistory[i].applicationObject.retentionPercentage +
                    " ; amount : " +
                    new Intl.NumberFormat("en-za", {
                      style: "currency",
                      currency: "ZAR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(approvalHistory[i].applicationObject.amount) +
                    " ; Remarks : " +
                    approvalHistory[i].applicationObject.transRefno;
                  obj["contractId"] =
                    approvalHistory[i].applicationObject.contract;
                } else {
                  let contract = await ContractPayments.find({
                    _id: approvalHistory[i].applicationId,
                  })
                    .populate({
                      path: "contract",
                      model: "contracts",
                    })
                    .populate({
                      path: "milestone",
                      model: "contract_milestones",
                    });

                  if (contract) {
                    obj["requestInfo"] =
                      "Request for Payment for the contract name : " +
                      contract[0].contract.contractName +
                      " for the milestone : " +
                      contract[0].milestone.milestoneName +
                      // "- Retention % : " +
                      // contract[0].retentionPercentage +
                      " ; amount : " +
                      new Intl.NumberFormat("en-za", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(contract[0].amount) +
                      " ; Remarks : " +
                      contract[0].transRefno;
                    obj["contractId"] = contract[0].contract._id;
                  }
                }
              } else if (approvalHistory[i].approvalType == "FR") {
                if (approvalHistory[i].applicationObject !== null) {
                  if (approvalHistory[i].approvalLevel === "Supervisor") {
                    let user_createdBy = await User.findOne(
                      {
                        _id: approvalHistory[i].applicationObject.createdBy,
                      },
                      { _id: 1, firstName: 1, lastName: 1, supervisor: 1 }
                    );

                    if (user_createdBy) {
                      if (user_createdBy.supervisor == req.query.userid) {
                        obj["userid"] = req.query.userid;
                        obj["username"] =
                          user_createdBy.firstName +
                          " " +
                          user_createdBy.lastName;
                      } else {
                        obj["userid"] = "NA";
                        obj["username"] = "NA";
                      }
                    } else {
                      obj["userid"] = "NA";
                      obj["username"] = "NA";
                    }
                  }
                  obj["requestInfo"] =
                    "Request for approval of farmer registration - Farmer Name : " +
                    approvalHistory[i].applicationObject.name +
                    " ; Identity Number : " +
                    approvalHistory[i].applicationObject.identityNumber;
                  obj["contractId"] =
                    approvalHistory[i].applicationObject.farmerId;
                }
              }
              aHResult.push(obj);
            }

            var userAreas = aHResult.filter(function (area) {
              return area.userid == req.query.userid;
            });
            res.status(200).json({
              success: true,
              responseCode: 200,
              totalRecCount: totalCount, //userAreas.length,
              msg: "List fetched successfully",
              result: userAreas,
            });
          }
        });
    });

  /////////////////////////////////////////////////////
  /*
  let aHResult = [];

  let approvalHistory = await ApprovalHistory.find(
    {
      approvalType: req.query.approvalArea,
      approverId: null,
    },
    { status: 0, deleted: 0 }
  )
    .sort({ [sort_field]: sort_mode })
    .skip(query.skip)
    .limit(query.limit);
  console.log("ap his : ", approvalHistory);
  for (var i = 0; i < approvalHistory.length; i++) {
    let obj = {};

    let approvalSetup = await ApprovalSetup.find(
      {
        approvalType: approvalHistory[i].approvalType,
        sequence: approvalHistory[i].sequence,
      },
      { approverId: 1 }
    );

    obj["approvalArea"] = approvalHistory[i].approvalArea;
    obj["approvalLevel"] = approvalHistory[i].approvalLevel;
    obj["approverId"] = null;
    obj["approvalType"] = approvalHistory[i].approvalType;
    obj["sequence"] = approvalHistory[i].sequence;
    obj["approvalStatus"] = null;
    obj["approverRemarks"] = null;
    obj["approvalDate"] = approvalHistory[i].approvalDate;
    obj["_id"] = approvalHistory[i]._id;
    obj["applicationId"] = approvalHistory[i].applicationId;

    if (approvalHistory[i].approvalLevel === "User") {
      let user = await User.findOne({ _id: approvalSetup[0].approverId });
      if (user) {
        obj["userid"] = user._id;
        obj["username"] = user.firstName + " " + user.lastName;
      } else {
        obj["userid"] = "NA";
        obj["username"] = "NA";
      }
    } else if (approvalHistory[i].approvalLevel === "Role") {
      let role = await User.find({
        userGroup: approvalSetup[0].approverId,
        _id: req.query.userid,
      });

      if (role.length > 0) {
        obj["userid"] = role[0]._id;
        obj["username"] = role[0].firstName + " " + role[0].lastName;
      } else {
        obj["userid"] = "NA";
        obj["username"] = "NA";
      }
    }

    //contract details for contract status/extension
    if (
      approvalHistory[i].approvalType == "CS" ||
      approvalHistory[i].approvalType == "CE"
    ) {
      let contract = await Contracts.find({
        _id: approvalHistory[i].applicationId,
      })
        .populate({
          path: "contractStatus",
          model: "cnds",
        })
        .populate({
          path: "contractStatus_ApprValue",
          model: "cnds",
        });

      if (contract) {
        if (approvalHistory[i].approvalType == "CS") {
          obj["requestInfo"] =
            "Request for Contract Status change for the contract name : " +
            contract[0].contractName +
            " - status from " +
            contract[0].contractStatus.cndName +
            " to " +
            contract[0].contractStatus_ApprValue.cndName;

          obj["contractId"] = contract[0]._id;
        } else if (approvalHistory[i].approvalType == "CE") {
          obj["requestInfo"] =
            "Request for Contract Extension for the contract name : " +
            contract[0].contractName +
            " - End-Date from " +
            moment(contract[0].endDate * 1000).format("DD/MM/YYYY") +
            " to " +
            moment(contract[0].endDate_ApprValue * 1000).format("DD/MM/YYYY");
          obj["contractId"] = contract[0]._id;
        }
      }
    } else if (approvalHistory[i].approvalType == "CV") {
      let contract = await ContractVariations.find({
        _id: approvalHistory[i].applicationId,
      }).populate({
        path: "contract",
        model: "contracts",
      });

      if (contract) {
        obj["requestInfo"] =
          "Request for Contract Variation for the contract name : " +
          contract[0].contract.contractName +
          "- Details - Subject : " +
          contract[0].subject +
          " ; Unit : " +
          contract[0].unit +
          " ; Rate : " +
          contract[0].rate +
          " ; Amount : " +
          contract[0].amount;
        obj["contractId"] = contract[0].contract._id;
      }
    } else if (approvalHistory[i].approvalType == "CM") {
      let contract = await ContractMilestones.find({
        _id: approvalHistory[i].applicationId,
      })
        .populate({
          path: "contract",
          model: "contracts",
        })
        .populate({
          path: "personResponsible",
          model: "users",
        });

      if (contract) {
        obj["requestInfo"] =
          "Request for Contract Milestone for the contract name : " +
          contract[0].contract.contractName +
          "- Details - Milestone Name : " +
          contract[0].milestoneName +
          " ; StartDate : " +
          moment(contract[0].startDate * 1000).format("DD/MM/YYYY") +
          " ; EndDate : " +
          moment(contract[0].endDate * 1000).format("DD/MM/YYYY") +
          " ; Milestone Value : " +
          contract[0].milestoneValue +
          " ; Person Responsible : " +
          contract[0].personResponsible.firstName +
          " " +
          contract[0].personResponsible.lastName;
        obj["contractId"] = contract[0].contract._id;
      }
    } else if (approvalHistory[i].approvalType == "CP") {
      let contract = await ContractPayments.find({
        _id: approvalHistory[i].applicationId,
      })
        .populate({
          path: "contract",
          model: "contracts",
        })
        .populate({
          path: "milestone",
          model: "contract_milestones",
        });

      if (contract) {
        obj["requestInfo"] =
          "Request for Payment for the contract name : " +
          contract[0].contract.contractName +
          " for the milestone : " +
          contract[0].milestone.milestoneName +
          "- Retention % : " +
          contract[0].retentionPercentage +
          " ; amount : " +
          contract[0].amount +
          " ; Remarks : " +
          contract[0].transRefno;
        obj["contractId"] = contract[0].contract._id;
      }
    }
    aHResult.push(obj);
  }

  var userAreas = aHResult.filter(function (area) {
    return area.userid == req.query.userid;
  });
  res.status(200).json({
    success: true,
    responseCode: 200,
    totalRecCount: userAreas.length,
    msg: "List fetched successfully",
    result: userAreas,
  });

*/
});
/************End Pending Approval List API ************************* */

//get approval history by application id
router.get("/api/approvalhistorybyappid/:appid", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.params.appid) dbquery.applicationId = req.params.appid;

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
  ApprovalHistory.find({
    $and: [dbquery],
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
      ApprovalHistory.find({
        $and: [dbquery],
      })
        .populate({
          path: "approvalStatus",
          model: "cnds",
        })
        .populate({
          path: "approverId",
          model: "users",
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
});

//new
/************* Pending Approval LIST API****************/
router.get("/api/pendingapprovalslist", auth, async (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNo);
    const size = parseInt(req.query.per_page);
    let sortField = req.query.sort_field || "_id";
    let sortMode = req.query.sort_mode === "ascend" ? 1 : -1;

    if (pageNo < 1) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Invalid page number, should start with 1",
      });
    }

    const skip = size * (pageNo - 1);
    const filter = { approvalType: req.query.approvalArea, approverId: null };

    // Fetch total count and paginated approvals in parallel
    const [totalCount, approvalHistory] = await Promise.all([
      ApprovalHistory.countDocuments(filter),
      ApprovalHistory.find(filter)
        .sort({ [sortField]: sortMode })
        .skip(skip)
        .limit(size)
        .select({ status: 0, deleted: 0 })
        .lean(), // Use .lean() for better performance
    ]);

    if (!approvalHistory.length) {
      return res.status(200).json({
        success: true,
        responseCode: 200,
        totalRecCount: 0,
        msg: "No records found",
        result: [],
      });
    }

    // Fetch approval setups and related user/contract data in parallel
    const approvalSetupsPromises = approvalHistory.map((history) =>
      ApprovalSetup.find({
        approvalType: history.approvalType,
        sequence: history.sequence,
      })
        .select({ approverId: 1 })
        .lean()
    );

    const approvalSetups = await Promise.all(approvalSetupsPromises);

    const userIds = approvalSetups
      .flatMap((setup) => setup.map((s) => s.approverId))
      .filter(Boolean);

    const users = await User.find({ _id: { $in: userIds } })
      .select({ _id: 1, firstName: 1, lastName: 1 })
      .lean();

    const usersMap = users.reduce((acc, user) => {
      acc[user._id] = `${user.firstName} ${user.lastName}`;
      return acc;
    }, {});

    // Prepare approval results with requestInfo
    const aHResult = await Promise.all(
      approvalHistory.map(async (history, index) => {
        const obj = {
          approvalArea: history.approvalArea,
          approvalLevel: history.approvalLevel,
          approverId: null,
          approvalType: history.approvalType,
          sequence: history.sequence,
          approvalStatus: null,
          approverRemarks: null,
          approvalDate: history.approvalDate,
          _id: history._id,
          applicationId: history.applicationId,
          userid: "NA",
          username: "NA",
          contractId: "NA",
          requestInfo: "No information available",
        };

        // Assign User information if available
        if (history.approvalLevel === "User" && approvalSetups[index].length > 0) {
          const approverId = approvalSetups[index][0].approverId;
          obj.userid = approverId;
          obj.username = usersMap[approverId] || "NA";
        } else if (
          history.approvalLevel === "Role" &&
          approvalSetups[index].length > 0
        ) {
          const approverId = approvalSetups[index][0].approverId;
          const roleUser = users.find(
            (user) => user._id.toString() === approverId.toString()
          );
          obj.userid = roleUser ? roleUser._id : "NA";
          obj.username = roleUser
            ? `${roleUser.firstName} ${roleUser.lastName}`
            : "NA";
        }

        // Construct requestInfo based on approvalType
        try {
          if (["CS", "CE"].includes(history.approvalType)) {
            const contract = await Contracts.findOne({ _id: history.applicationId })
              .populate({ path: "contractStatus", model: "cnds", select: "cndName" })
              .populate({ path: "contractStatus_ApprValue", model: "cnds", select: "cndName" })
              .lean();

            if (contract) {
              if (history.approvalType === "CS") {
                obj.requestInfo = `Request for Contract Status change for the contract name: ${contract.contractName} - status from ${contract.contractStatus.cndName} to ${contract.contractStatus_ApprValue.cndName}`;
              } else if (history.approvalType === "CE") {
                obj.requestInfo = `Request for Contract Extension for the contract name: ${contract.contractName} - End-Date from ${moment(contract.endDate * 1000).format("DD/MM/YYYY")} to ${moment(contract.endDate_ApprValue * 1000).format("DD/MM/YYYY")}`;
              }
              obj.contractId = contract._id;
            }
          } else if (history.approvalType === "CV") {
            const contract = await ContractVariations.findOne({
              _id: history.applicationId,
            })
              .populate({ path: "contract", model: "contracts", select: "contractName" })
              .lean();

            if (contract) {
              obj.requestInfo = `Request for Contract Variation for the contract name: ${contract.contract.contractName} - Details - Subject: ${contract.subject} ; Amount: ${new Intl.NumberFormat("en-za", {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2,
              }).format(contract.amount)}`;
              obj.contractId = contract.contract._id;
            }
          } else if (history.approvalType === "CM") {
            const milestone = await ContractMilestones.findOne({
              _id: history.applicationId,
            })
              .populate({ path: "contract", model: "contracts", select: "contractName" })
              .populate({ path: "personResponsible", model: "users", select: "firstName lastName" })
              .lean();

            if (milestone) {
              obj.requestInfo = `Request for Contract Milestone for the contract name: ${milestone.contract.contractName} - Details - Milestone Name: ${milestone.milestoneName} ; StartDate: ${moment(milestone.startDate * 1000).format("DD/MM/YYYY")} ; EndDate: ${moment(milestone.endDate * 1000).format("DD/MM/YYYY")} ; Milestone Value: ${new Intl.NumberFormat("en-za", {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2,
              }).format(milestone.milestoneValue)} ; Person Responsible: ${milestone.personResponsible.firstName} ${milestone.personResponsible.lastName}`;
              obj.contractId = milestone.contract._id;
            }
          }
          else if (history.approvalType === "CP") {
            const payment = await ContractPayments.findOne({
              _id: history.applicationId,
            })
              .populate({ path: "contract", model: "contracts", select: "contractName" })
              .populate({ path: "milestone", model: "contract_milestones", select: "milestoneName" })
              .lean();

            if (payment) {
              obj.requestInfo = `Request for Payment for the contract name: ${payment.contract.contractName} for the milestone: ${payment.milestone.milestoneName} ; Amount: ${new Intl.NumberFormat("en-za", {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2,
              }).format(payment.amount)} ; 
              Payment Date: ${moment(payment.paymentDate * 1000).format("DD/MM/YYYY")} ;
              Remarks: ${payment.transRefno}`;
              obj.contractId = payment.contract._id;
            }
          }
          else if (history.approvalType === "FR") {
            if (history.applicationObject !== null) {
              if (history.approvalLevel === "Supervisor") {
                const userCreatedBy = await User.findOne({
                  _id: history.applicationObject.createdBy,
                })
                  .select("_id firstName lastName supervisor")
                  .lean();

                if (userCreatedBy) {
                  if (userCreatedBy.supervisor == req.query.userid) {
                    obj.userid = req.query.userid;
                    obj.username = `${userCreatedBy.firstName} ${userCreatedBy.lastName}`;
                  } else {
                    obj.userid = "NA";
                    obj.username = "NA";
                  }
                } else {
                  obj.userid = "NA";
                  obj.username = "NA";
                }
              }
              obj.requestInfo = `Request for approval of farmer registration - Farmer Name: ${history.applicationObject.name} ; Identity Number: ${history.applicationObject.identityNumber}`;
              obj.contractId = history.applicationObject.farmerId;
            }
          }
        } catch (error) {
          console.error(
            `Error constructing requestInfo for applicationId ${history.applicationId}:`,
            error
          );
          // Set default values in case of an error
          obj.requestInfo = "Error fetching contract information";
        }

        return obj;
      })
    );

    const userAreas = aHResult.filter((area) => area.contractId !== "NA" && area.userid === req.query.userid);
    res.status(200).json({
      success: true,
      responseCode: 200,
      totalRecCount: userAreas.length,
      msg: "List fetched successfully",
      result: userAreas,
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({
      success: false,
      responseCode: 500,
      msg: "Internal server error",
    });
  }
});


module.exports = router;
