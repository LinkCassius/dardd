var mongoose = require("mongoose");
var express = require("express");
var startOfWeek = require("date-fns/startOfWeek");
var endOfWeek = require("date-fns/endOfWeek");
var format = require("date-fns/format");
var PizZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
var fs = require("fs");
var path = require("path");
var router = express.Router();
var PerformanceMng = require("../models/PerformanceMng");
var AnnualReport = require("../models/AnnualReport");
var Indicators = require("../models/Indicators");
var IndicatorTitles = require("../models/IndicatorsTitle");

var ObjectId = require("mongodb").ObjectID;
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
// var sendMailFunc = require("./SendMailFunc");
// var sendMailFuncReturn = require("./SendMailFuncReturn");
const { sendMailFunc, sendMailFuncReturn } = require("./SendMailFunc");
const { User } = require("../models/User");
const { DateTime } = require("luxon");
const { Console } = require("console");

/**
 * @swagger
 * /api/performance:
 *   post:
 *     tags:
 *       - Add / Update, performance review
 *     description: Returns success message
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: Indicator ID
 *         in: formData
 *         required: true
 *         type: Object ID
 *       - name: target
 *         description: target of Indicators
 *         in: formData
 *         required: true
 *         type: string
 *       - name: startDate
 *         description: cycleValue of Indicators (ex 2020, Jan 2020, Jan Feb Mar 2020)
 *         in: formData
 *         required: true
 *         type: string
 *       - name: indicatorTitle
 *         description: indicator title
 *         in: formData
 *         type: string
 *       - name: IndicatorsDetail
 *         description: details of Indicators
 *         in: formData
 *         type: string
 *       - name: file
 *         description: url of file attached with  Indicators
 *         in: formData
 *         type: string
 *       - name: status
 *         description: description of cnd
 *         in: formData
 *         type: number
 *     responses:
 *       200:
 *         description: An Object of Indicators
 *         schema:
 *            $ref: '#/definitions/Indicators'
 */

/************Start performance ADD/UPDATE API ************************* */
router.post("/api/performance", auth, async function (req, res) {
  var flag = false;
  const objPerf = req.body;

  const status = req.query.status;
  let lastApproval = "";
  let mailObj = [];

  for (var obj in objPerf) {
    if (objPerf[obj].perId === "" && !objPerf[obj].disabled) {
      if (status === "submit") {
        mailObj.push({
          userid: objPerf[obj].responsibleUser,
          mailApprovar: objPerf[obj].approverUser2,
          reportingCycle:
            objPerf[obj].reportingCycle + " " + objPerf[obj].startDate,
          lastApproval: false,
        });
      }
      var indicatoreObj = {
        indicatorId: objPerf[obj]._id,
        target: objPerf[obj].target,
        cycleValue: objPerf[obj].startDate,
        indicatorTitle: objPerf[obj].indicatorTitle,
        target: objPerf[obj].target,
        responsibleUser: objPerf[obj].responsibleUser,
        remarks: objPerf[obj].remarks,
        actualPerformance: objPerf[obj].actualPerformance,
        status: status,
        approvalStatus: objPerf[obj].approvalStatus,
        dimensions: objPerf[obj].dimensions,
        reportingCycle: objPerf[obj].reportingCycle,
        approverUser1: objPerf[obj].approverUser1,
        approverUser2: objPerf[obj].approverUser2,
        approverUser3: objPerf[obj].approverUser3,
        approverUser1Status: status === "submit" ? "pending" : "",
        outcome: objPerf[obj].outcome,
        outputs: objPerf[obj].outputs,
        intervention: objPerf[obj].intervention,
      };
      var newIndicatore = new PerformanceMng(indicatoreObj);
      await newIndicatore.save(async function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "indicatore Name already exist!, plz try with another.",
            });
          } else {
            if (err.errors && err.errors.indicatorTitle) {
              console.log("err", err);
              flag = false;
            } else {
              console.log("err", err);
              flag = false;
            }
          }
        }
        var result = JSON.parse(JSON.stringify(indicatoreObj));

        loghistory(
          req.user._id,
          "performance Add",
          "Add",
          "performance",
          "Add performance",
          req.get("referer"),
          null,
          result
        );

        flag = true;
      });
    } else if (objPerf[obj].perId !== "" && !objPerf[obj].disabled) {
      let perList = objPerf[obj];
      let pmsFind = await PerformanceMng.findById(objPerf[obj].perId);

      if (!pmsFind) {
        console.log("err", err);
        flag = false;
      } else {
        try {
          if (perList.approverUser1 != null) {
            lastApproval = "approverUser1";
          }
          if (perList.approverUser2 != null) {
            lastApproval = "approverUser2";
          }
          if (perList.approverUser3 != null) {
            lastApproval = "approverUser3";
          }

          if (lastApproval === perList.currentApprovar) {
            mailObj.push({
              indicatorTitle: perList.indicatorTitle,
              userid: perList.responsibleUser,
              mailApprovar:
                lastApproval === "approverUser1"
                  ? perList.approverUser1
                  : lastApproval === "approverUser2"
                  ? perList.approverUser2
                  : lastApproval === "approverUser3"
                  ? perList.approverUser3
                  : "",
              reportingCycle: perList.reportingCycle + " " + perList.startDate,
              lastApproval: true,
            });
          } else if (perList.currentApprovar === "approverUser1") {
            if (status !== "rejected")
              mailObj.push({
                indicatorTitle: perList.indicatorTitle,
                userid: perList.responsibleUser,
                mailApprovar: perList.approverUser2,
                reportingCycle:
                  perList.reportingCycle + " " + perList.startDate,
                lastApproval: false,
              });
            else
              mailObj.push({
                indicatorTitle: perList.indicatorTitle,
                userid: perList.responsibleUser,
                mailApprovar: perList.approverUser1,
                reportingCycle:
                  perList.reportingCycle + " " + perList.startDate,
                lastApproval: false,
              });
          } else if (perList.currentApprovar === "approverUser2") {
            if (status !== "rejected")
              mailObj.push({
                indicatorTitle: perList.indicatorTitle,
                userid: perList.responsibleUser,
                mailApprovar: perList.approverUser3,
                reportingCycle:
                  perList.reportingCycle + " " + perList.startDate,
                lastApproval: false,
              });
            else
              mailObj.push({
                indicatorTitle: perList.indicatorTitle,
                userid: perList.responsibleUser,
                mailApprovar: perList.approverUser2,
                reportingCycle:
                  perList.reportingCycle + " " + perList.startDate,
                lastApproval: false,
              });
          } else if (status === "submit") {
            mailObj.push({
              indicatorTitle: perList.indicatorTitle,
              userid: perList.responsibleUser,
              mailApprovar: perList.approverUser1,
              reportingCycle: perList.reportingCycle + " " + perList.startDate,
              lastApproval: false,
            });
          }

          let pmsUpdate = await PerformanceMng.findByIdAndUpdate(
            {
              _id: perList.perId,
            },
            {
              remarks:
                perList.userRemarks !== ""
                  ? perList.userRemarks
                  : perList.remarks,
              actualPerformance: perList.actualPerformance,
              status:
                status === "rejected"
                  ? "draft"
                  : status == "draft" || status == "submit"
                  ? status
                  : perList.status,
              approvalStatus:
                lastApproval == perList.currentApprovar && status === "approved"
                  ? status
                  : "",
              approverUser1Remarks: perList.approverUser1Remarks,
              approverUser2Remarks: perList.approverUser2Remarks,
              approverUser3Remarks: perList.approverUser3Remarks,
              approverUser1Status:
                perList.currentApprovar === "approverUser1"
                  ? status
                  : status === "submit"
                  ? "pending"
                  : perList.approverUser1Status,
              approverUser2Status:
                perList.currentApprovar === "approverUser2"
                  ? status
                  : perList.approverUser2 !== null &&
                    status === "approved" &&
                    perList.currentApprovar === "approverUser1"
                  ? "pending"
                  : perList.approverUser2Status,
              approverUser3Status:
                perList.currentApprovar === "approverUser3"
                  ? status
                  : perList.approverUser3 !== null &&
                    status === "approved" &&
                    perList.currentApprovar === "approverUser2"
                  ? "pending"
                  : perList.approverUser3Status,
              indicatorTitle: perList.indicatorTitle,
              target: perList.target,
              outcome: perList.outcome,
              outputs: perList.outputs,
              intervention: perList.intervention,
            },
            { new: true }
          );
          if (pmsUpdate) {
            await loghistory(
              req.user._id,
              "PMS Reporting",
              "Update",
              "performance",
              status,
              req.get("referer"),
              pmsFind,
              pmsUpdate
            );
            flag = true;
          }
        } catch (error) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Something went wrong.",
            error: error,
          });
        }
      }
    }
  }
  if (flag) var result = true;
  try {
    if (!req.query.moderate) await sendPerformanceMails(status, mailObj);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Indicator added successfully.",
    result: result,
  });
});

const sendPerformanceMails = async (status, mailObj) => {
  const mailFilterObj = mailObj.filter(
    (v, i, a) =>
      a.findIndex(
        (t) =>
          t.userid === v.userid &&
          t.mailApprovar === v.mailApprovar &&
          t.reportingCycle === v.reportingCycle &&
          t.lastApproval === v.lastApproval &&
          t.indicatorTitle === v.indicatorTitle
      ) === i
  );

  mailFilterObj.map(async (value) => {
    let userInfo = {};
    let mailBody = "";
    let mailTo = "";

    let quarter = value.reportingCycle.includes("Apr")
      ? "Q1"
      : value.reportingCycle.includes("Jul")
      ? "Q2"
      : value.reportingCycle.includes("Oct")
      ? "Q3"
      : value.reportingCycle.includes("Jan")
      ? "Q4"
      : "";
    quarter = quarter + " -  (" + value.reportingCycle + ") ";
    if (status === "submit") {
      userInfo = await User.findById(value.userid);

      mailBody =
        "You are requested to approve performance reporting  of " +
        userInfo.firstName +
        " " +
        userInfo.lastName +
        " " +
        "for the reporting cycle : <br/><b>" +
        quarter +
        "<br/>" +
        "Indicator : " +
        value.indicatorTitle +
        " </b>";
      mailTo = value.mailApprovar;
    } else if (status === "approved") {
      if (value.lastApproval === true) {
        userInfo = await User.findById(value.mailApprovar);
        "Your performance reporting has been approved by " +
          userInfo.firstName +
          " " +
          userInfo.lastName +
          " " +
          "for reporting cycle : <br/><b>" +
          quarter +
          "<br/>" +
          "Indicator : " +
          value.indicatorTitle +
          " </b>";
        mailTo = value.userid;
      } else {
        userInfo = await User.findById(value.userid);
        mailBody =
          "You are requested to approve performance reporting  of " +
          userInfo.firstName +
          " " +
          userInfo.lastName +
          " " +
          "for reporting cycle : <br/><b>" +
          quarter +
          "<br/>" +
          "Indicator : " +
          value.indicatorTitle +
          " </b>";
        mailTo = value.mailApprovar;
      }
    } else if (status === "rejected") {
      userInfo = await User.findById(value.mailApprovar);
      mailBody =
        "Your performance reporting has been rejected by " +
        userInfo.firstName +
        " " +
        userInfo.lastName +
        " " +
        "for reporting cycle : <br/><b>" +
        quarter +
        "<br/>" +
        "Indicator : " +
        value.indicatorTitle +
        " </b>";
      mailTo = value.userid;
    }
    sendMailFunc(
      10,
      "Approver",
      "Indicator Approval - Notification",
      mailBody,
      mailTo
      //"5f72e8a8211bbb0035899417" //sandesh.dasi@technobraingroup.com
    );

    return value;
  });
};

/************End Indicators ADD/UPDATE API ************************* */

/*************start-update UI table values on clicking document folder */
router.post("/api/performance_folder", auth, async function (req, res) {
  var flag = false;
  const objPerf = req.body;

  for (var obj in objPerf) {
    if (objPerf[obj].perId !== "") {
      let perList = objPerf[obj];
      let pmsFind = await PerformanceMng.findById(objPerf[obj].perId);
      //console.log("pmsFind : ", pmsFind);
      if (!pmsFind) {
        console.log("err", err);
        flag = false;
      } else {
        try {
          await PerformanceMng.findByIdAndUpdate(
            {
              _id: perList.perId,
            },
            {
              remarks:
                perList.userRemarks !== ""
                  ? perList.userRemarks
                  : perList.remarks,
              actualPerformance: perList.actualPerformance,
              approverUser1Remarks: perList.approverUser1Remarks,
              approverUser2Remarks: perList.approverUser2Remarks,
              approverUser3Remarks: perList.approverUser3Remarks,
              intervention: perList.intervention,
            },
            { new: true }
          );
        } catch (error) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Something went wrong.",
            error: error,
          });
        }
      }
    }
  }
  if (flag) var result = true;

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Indicator updated successfully.",
    result: result,
  });
});
/*************end - update UI table values on clicking document folder */

/************Start Indicators List API ************************* */
// /**
//  * @swagger
//  * /api/Indicatorslist:
//  *   get:
//  *     tags:
//  *       - Add / Update, List Indicators
//  *     description: Returns a Indicators list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: IndicatorsName
//  *         in:  query
//  *         type: string
//  *       - name: startDate
//  *         in:  query
//  *         type: string
//  *       - name: endDate
//  *         in:  query
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Array list of cnds
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
//  *             $ref: '#/definitions/Indicators'
//  *
//  *
//  */
/************* Indicatorss LIST API****************/
router.get("/api/performancelist", auth, async (req, res) => {
  /*********Search Query build ************/
  const resId = req.query.userid;
  const reviewType = req.query.reviewType;
  const year = new Date().getFullYear();
  let Value_match = new RegExp(year);

  var date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  const nextYear = new Date(date).getFullYear();
  let cYear = year.toString();

  if (req.query.finYear) {
    cYear = req.query.finYear;
  }
  if (reviewType === "self") {
    await PerformanceMng.aggregate([
      {
        $match: {
          // "responsibleUser": new ObjectId(resId)
          $and: [
            { responsibleUser: new ObjectId(resId) },
            { finYear: cYear },
            { status: { $ne: "Deleted" } },
          ],
        },
      },
      { $sort: { cycleValue: 1 } },
      {
        $group: {
          _id: "$reportingCycle",
          obj: {
            $push: {
              indicatorTitle: "$indicatorTitle",
              target: "$target",
              reportingCycle: "$reportingCycle",
              startDate: "$startDate",
              dimensions: "$dimensions",
              remarks: "$remarks",
              actualPerformance: "$actualPerformance",
              _id: "$_id",
              status: "$status",
              approvalStatus: "",
              responsibleUser: "$responsibleUser",
              perId: "$_id",
              approverUser1: "$approverUser1",
              approverUser2: "$approverUser2",
              approverUser3: "$approverUser3",
              currentApprovar: "",
              currentApprovarStatus: "",
              currentRemarks: "",
              userRemarks: "",
              hasDocuments: "$hasDocuments",
              disabled: false,
              outcome: "$outcome",
              outputs: "$outputs",
              intervention: "$intervention",
              isTargetCummulative: "$isTargetCummulative",
              annualTarget: "$annualTarget",
              checkedFlag: false,
              apUser1HasDownload: "$apUser1HasDownload",
              apUser2HasDownload: "$apUser2HasDownload",
              apUser3HasDownload: "$apUser3HasDownload",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $let: {
              vars: { obj: [{ k: { $substr: ["$_id", 0, -1] }, v: "$obj" }] },
              in: { $arrayToObject: "$$obj" },
            },
          },
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;
      ////////////////////////////
      /*
      if (indicators.length > 0) {
        let yglist = indicators[0].Quarterly.reduce(
          (h, obj) =>
            Object.assign(h, {
              [obj.indicatorTitle]: (h[obj.indicatorTitle] || []).concat(obj),
            }),
          {}
        );

        for (var key in indicators[0].Quarterly) {
          if (indicators[0].Quarterly.hasOwnProperty(key)) {
            const listofqua =
              yglist[indicators[0].Quarterly[key].indicatorTitle];

            let annualTargetVar = 0;
            listofqua.forEach((element) => {
              if (
                element.indicatorTitle ===
                indicators[0].Quarterly[key].indicatorTitle
              ) {
                if (indicators[0].Quarterly[key].isTargetCummulative === true) {
                  indicators[0].Quarterly[key].annualTarget =
                    annualTargetVar + parseInt(element.target);
                  annualTargetVar = parseInt(
                    indicators[0].Quarterly[key].annualTarget
                  );
                } else {
                  indicators[0].Quarterly[key].annualTarget = element.target;
                }
              }
            });
          }
        }
      }
      */
      ////////////////////////////
      const iObj = await getPerList(indicators);
      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: iObj,
      });
    });
  } else if (reviewType === "approvals") {
    await PerformanceMng.aggregate([
      {
        $match: {
          $and: [
            { finYear: cYear },
            { status: "submit" },
            {
              $or: [
                { approverUser1: new ObjectId(resId) },
                { approverUser2: new ObjectId(resId) },
                { approverUser3: new ObjectId(resId) },
              ],
            },
          ],
        },
      },
      { $sort: { cycleValue: 1 } },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "responsibleUser",
          as: "responsibleUser",
        },
      },

      {
        $group: {
          _id: "$reportingCycle",
          obj: {
            $push: {
              indicatorTitle: "$indicatorTitle",
              target: "$target",
              reportingCycle: "$reportingCycle",
              startDate: "$cycleValue",
              dimensions: "$dimensions",
              remarks: "$remarks",
              actualPerformance: "$actualPerformance",
              _id: "$_id",
              status: "$status",
              approvalStatus: "",
              responsibleUser: "$responsibleUser",
              perId: "$_id",
              approverUser1Remarks: "$approverUser1Remarks",
              approverUser2Remarks: "$approverUser2Remarks",
              approverUser3Remarks: "$approverUser3Remarks",
              approverUser1Status: "$approverUser1Status",
              approverUser2Status: "$approverUser2Status",
              approverUser3Status: "$approverUser3Status",
              currentApprovar: "",
              currentApprovarStatus: "",
              currentRemarks: "",
              approverUser1: "$approverUser1",
              approverUser2: "$approverUser2",
              approverUser3: "$approverUser3",
              userRemarks: "",
              disabled: false,
              hasDocuments: "$hasDocuments",
              outcome: "$outcome",
              outputs: "$outputs",
              intervention: "$intervention",
              isTargetCummulative: "$isTargetCummulative",
              annualTarget: "$annualTarget",
              checkedFlag: false,
              apUser1HasDownload: "$apUser1HasDownload",
              apUser2HasDownload: "$apUser2HasDownload",
              apUser3HasDownload: "$apUser3HasDownload",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $let: {
              vars: { obj: [{ k: { $substr: ["$_id", 0, -1] }, v: "$obj" }] },
              in: { $arrayToObject: "$$obj" },
            },
          },
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      ////////////////////////////
      /*
      if (indicators.length > 0) {
        let yglist = indicators[0].Quarterly.reduce(
          (h, obj) =>
            Object.assign(h, {
              [obj.indicatorTitle]: (h[obj.indicatorTitle] || []).concat(obj),
            }),
          {}
        );

        for (var key in indicators[0].Quarterly) {
          if (indicators[0].Quarterly.hasOwnProperty(key)) {
            const listofqua =
              yglist[indicators[0].Quarterly[key].indicatorTitle];

            let annualTargetVar = 0;
            listofqua.forEach((element) => {
              if (
                element.indicatorTitle ===
                indicators[0].Quarterly[key].indicatorTitle
              ) {
                if (indicators[0].Quarterly[key].isTargetCummulative === true) {
                  indicators[0].Quarterly[key].annualTarget =
                    annualTargetVar + parseInt(element.target);
                  annualTargetVar = parseInt(
                    indicators[0].Quarterly[key].annualTarget
                  );
                } else {
                  indicators[0].Quarterly[key].annualTarget = element.target;
                }
              }
            });
          }
        }
      }
      */
      ////////////////////////////

      const iObj = await getApprovalPerList(indicators, resId);
      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: iObj,
      });
    });
  } else if (reviewType === "ALL") {
    await PerformanceMng.aggregate([
      {
        $match: {
          $and: [{ finYear: cYear }, { status: { $ne: "Deleted" } }],
        },
      },
      { $sort: { cycleValue: 1 } },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "responsibleUser",
          as: "responsibleUser",
        },
      },
      {
        $group: {
          _id: "$reportingCycle",
          obj: {
            $push: {
              indicatorTitle: "$indicatorTitle",
              target: "$target",
              reportingCycle: "$reportingCycle",
              startDate: "$startDate",
              dimensions: "$dimensions",
              remarks: "$remarks",
              actualPerformance: "$actualPerformance",
              _id: "$_id",
              status: "$status",
              approvalStatus: "",
              responsibleUser: "$responsibleUser",
              perId: "$_id",
              approverUser1Remarks: "$approverUser1Remarks",
              approverUser2Remarks: "$approverUser2Remarks",
              approverUser3Remarks: "$approverUser3Remarks",
              approverUser1Status: "$approverUser1Status",
              approverUser2Status: "$approverUser2Status",
              approverUser3Status: "$approverUser3Status",
              currentApprovar: "",
              currentApprovarStatus: "",
              currentRemarks: "",
              approverUser1: "$approverUser1",
              approverUser2: "$approverUser2",
              approverUser3: "$approverUser3",
              userRemarks: "",
              disabled: false,
              hasDocuments: "$hasDocuments",
              outcome: "$outcome",
              outputs: "$outputs",
              intervention: "$intervention",
              isTargetCummulative: "$isTargetCummulative",
              annualTarget: "$annualTarget",
              checkedFlag: false,
              apUser1HasDownload: "$apUser1HasDownload",
              apUser2HasDownload: "$apUser2HasDownload",
              apUser3HasDownload: "$apUser3HasDownload",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $let: {
              vars: { obj: [{ k: { $substr: ["$_id", 0, -1] }, v: "$obj" }] },
              in: { $arrayToObject: "$$obj" },
            },
          },
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;
      ////////////////////////////
      /*
      if (indicators.length > 0) {
        let yglist = indicators[0].Quarterly.reduce(
          (h, obj) =>
            Object.assign(h, {
              [obj.indicatorTitle]: (h[obj.indicatorTitle] || []).concat(obj),
            }),
          {}
        );

        for (var key in indicators[0].Quarterly) {
          if (indicators[0].Quarterly.hasOwnProperty(key)) {
            const listofqua =
              yglist[indicators[0].Quarterly[key].indicatorTitle];

            let annualTargetVar = 0;
            listofqua.forEach((element) => {
              if (
                element.indicatorTitle ===
                indicators[0].Quarterly[key].indicatorTitle
              ) {
                if (indicators[0].Quarterly[key].isTargetCummulative === true) {
                  indicators[0].Quarterly[key].annualTarget =
                    annualTargetVar + parseInt(element.target);
                  annualTargetVar = parseInt(
                    indicators[0].Quarterly[key].annualTarget
                  );
                } else {
                  indicators[0].Quarterly[key].annualTarget = element.target;
                }
              }
            });
          }
        }
      }
      */
      ////////////////////////////
      const iObj = await getPerListAll(indicators);
      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: iObj,
      });
    });
  }
});

const getPerList = async (objP) => {
  const fObject = objP.map(async (obj) => {
    const pvalue = Object.keys(obj).map((obj1) => obj[obj1]);
    const PerList = pvalue[0];
    if (PerList.length > 0) {
    }
    const ovalue = Object.keys(obj).map((obj1) => obj1);
    const ad = obj[ovalue];
    if (ad.length) {
      const oiboej = obj[ovalue].map(async (value) => {
        value.startDate = getReportingCycleString(
          value.startDate,
          value.reportingCycle,
          0
        );
        value.perId = value._id;
        value.disabled = value.status === "submit" ? true : false;
        return value;
      });
      const evalue = await Promise.all(oiboej);
      const grouplist = groupBy(evalue);
      obj[ovalue] = grouplist;
    }
    return obj;
  });
  const feojdf = await Promise.all(fObject);
  return feojdf;
};

const getApprovalPerList = async (objP, resId) => {
  const fObject = objP.map(async (obj) => {
    const ovalue = Object.keys(obj).map((obj1) => obj1);
    const ad = obj[ovalue];
    if (ad.length) {
      const oiboej = obj[ovalue].map(async (value) => {
        {
          if (value.approverUser1.toString() === resId) {
            value.currentApprovar = "approverUser1";
            value.currentApprovarStatus = value.approverUser1Status;
            value.userRemarks = value.remarks;
            value.remarks = value.approverUser1Remarks;
          } else if (value.approverUser2.toString() === resId) {
            value.currentApprovar = "approverUser2";
            value.currentApprovarStatus = value.approverUser2Status;
            value.userRemarks = value.remarks;
            value.remarks = value.approverUser2Remarks;
          } else if (value.approverUser3.toString() === resId) {
            value.currentApprovar = "approverUser3";
            value.currentApprovarStatus = value.approverUser3Status;
            value.userRemarks = value.remarks;
            value.remarks = value.approverUser3Remarks;
          }
          if (value.currentApprovarStatus !== "pending") {
            value.disabled = true;
          }
        }
        return value;
      });
      const evalue = await Promise.all(oiboej);
      const grouplist = groupBy(evalue);
      obj[ovalue] = grouplist;
    }
    return obj;
  });

  const feojdf = await Promise.all(fObject);
  return feojdf;
};

const getPerListAll = async (objP) => {
  const fObject = objP.map(async (obj) => {
    const pvalue = Object.keys(obj).map((obj1) => obj[obj1]);
    const PerList = pvalue[0];
    if (PerList.length > 0) {
    }
    const ovalue = Object.keys(obj).map((obj1) => obj1);
    const ad = obj[ovalue];
    if (ad.length) {
      const oiboej = obj[ovalue].map(async (value) => {
        value.startDate = getReportingCycleString(
          value.startDate,
          value.reportingCycle,
          0
        );
        value.perId = value._id;
        value.disabled = value.status === "submit" ? false : false;
        return value;
      });
      const evalue = await Promise.all(oiboej);
      const grouplist = groupBy(evalue);
      obj[ovalue] = grouplist;
    }
    return obj;
  });
  const feojdf = await Promise.all(fObject);
  return feojdf;
};

const getReportingCycleString = (startDate, reportingCycle, flag) => {
  const quarterly1 = ["Jan", "Feb", "Mar"];
  const quarterly2 = ["Apr", "May", "Jun"];
  const quarterly3 = ["Jul", "Aug", "Sep"];
  const quarterly4 = ["Oct", "Nov", "Dec"];
  let oldDate;
  if (flag === 0) {
    oldDate = new Date(startDate * 1000);
  } else {
    oldDate = new Date(startDate);
  }

  if (reportingCycle === "Weekly") {
    let startOfTheWeekD = startOfWeek(oldDate);
    let endOfTheWeekD = endOfWeek(oldDate);
    return (
      new Date(startOfTheWeekD).toLocaleDateString("en-GB") +
      " to " +
      new Date(endOfTheWeekD).toLocaleDateString("en-GB")
    );
  } else if (reportingCycle === "Monthly") {
    var yearstring = `${format(startOfWeek(oldDate), "yyyy")}`;
    return yearstring + " " + `${format(startOfWeek(oldDate), "MMM")}`;
  } else if (reportingCycle === "Quarterly") {
    var quarters = "";
    var monthName = `${format(startOfWeek(oldDate), "MMM")}`;
    var yearstring = `${format(startOfWeek(oldDate), "yyyy")}`;

    //console.log("month name : ", monthName, yearstring);
    var index1 = quarterly1.indexOf(monthName);
    if (index1 !== -1) {
      quarters =
        yearstring +
        ": " +
        quarterly1[0] +
        " " +
        quarterly1[1] +
        " " +
        quarterly1[2];
    } else {
      var index2 = quarterly2.indexOf(monthName);
      if (index2 !== -1) {
        quarters =
          yearstring +
          ": " +
          quarterly2[0] +
          " " +
          quarterly2[1] +
          " " +
          quarterly2[2];
      } else {
        var index3 = quarterly3.indexOf(monthName);
        if (index3 !== -1) {
          quarters =
            yearstring +
            ": " +
            quarterly3[0] +
            " " +
            quarterly3[1] +
            " " +
            quarterly3[2];
        } else {
          var index4 = quarterly4.indexOf(monthName);
          if (index4 !== -1) {
            quarters =
              yearstring +
              ": " +
              quarterly4[0] +
              " " +
              quarterly4[1] +
              " " +
              quarterly4[2];
          }
        }
      }
    }

    return quarters;
  } else if (reportingCycle === "Annually") {
    var yearstring = `${format(startOfWeek(oldDate), "yyyy")}`;
    return yearstring;
  }
};
const getIndicators = async (perf) => {
  /** Update CND **/

  return Indicators.findOne(
    {
      _id: perf._id,
    },
    function (err, Indicatorlist) {
      if (err) {
        return null;
      }
      if (!Indicatorlist) {
        return null;
      } else {
        return Indicatorlist;
      }
    }
  );
  // const users = await Promise.all(indi);
  // return users;
};
const checkIndicator = async (perf) => {
  /** Update CND **/

  return PerformanceMng.findOne(
    {
      indicatorId: perf._id,
      responsibleUser: perf.responsibleUser,
      reportingCycle: perf.reportingCycle,
    },
    // { sort: { _id: -1 } },
    function (err, performlist) {
      if (err) {
        return null;
      }
      if (!performlist) {
        return null;
      } else {
        return performlist;
      }
    }
  );
  // const users = await Promise.all(indi);
  // return users;
};
const groupBy = (array, key) => {
  var fResult = array.reduce((result, currentValue) => {
    (result[currentValue.startDate] =
      result[currentValue.startDate] || []).push(currentValue);
    return result;
  }, {});
  return fResult;
};
router.get("/api/performanceListById", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.indicatorId) {
    dbquery._id = req.query.indicatorId;
  }

  /************total count query start here ********/
  // Find some documents

  PerformanceMng.find({
    $and: [dbquery, { status: { $ne: "Deleted" } }],
  })
    .populate({
      path: "responsibleUser",
      model: "users",
    })
    .populate({
      path: "approverUser1",
      model: "users",
    })
    .populate({
      path: "approverUser2",
      model: "users",
    })
    .populate({
      path: "approverUser3",
      model: "users",
    })
    .exec(function (err, indicatorinfo) {
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
          result: indicatorinfo,
          msg: "List fetching successfully",
        });
      }
    });
});
const generateDocument = (data, fileName, reportingCycle) => {
  const sourcefileName =
    reportingCycle == "Annually"
      ? "annualreport.docx"
      : reportingCycle == "Quarterly"
      ? "quarterreport.docx"
      : reportingCycle == "Monthly"
      ? "quarterreport.docx"
      : "test";

  var content = fs.readFileSync(
    path.resolve("public/uploads", sourcefileName),
    "binary"
  );

  var zip = new PizZip(content);
  var doc;
  try {
    doc = new Docxtemplater(zip);
  } catch (error) {
    // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
    errorHandler(error);
  }

  doc.setData(data);

  //set the templateVariables
  // doc.setData({
  //     "programs": [
  //         {
  //             "program1": "8.1 Program2: Sustainable Resource Management",
  //             "subprograms": [
  //                 {
  //                     "subprogram": "8.1.1 Sub-Programme 2.1: Engineering Services",
  //                     "clients1": [{

  //                         "indicator": "Number of agricultural infrastructure established",
  //                         "reportingCycle": "2019/2020",
  //                         "target": "100",
  //                         "actualPerformance": "90"
  //                     },
  //                     {
  //                         "indicator": "Number of environmental centres upgraded",
  //                         "reportingCycle": "2019/2020",
  //                         "target": "50",
  //                         "actualPerformance": "49"
  //                     }

  //                     ],
  //                     "clients2": [{

  //                         "indicator": "Number of agricultural infrastructure established",
  //                         "Q1": "80",
  //                         "Q2": "100",
  //                         "Q3": "90",
  //                         "Q4": "70"
  //                     },
  //                     {
  //                         "indicator": "Number of environmental centres upgraded",
  //                         "Q1": "80",
  //                         "Q2": "100",
  //                         "Q3": "90",
  //                         "Q4": "70"
  //                     }

  //                     ]

  //                 },
  //                 {
  //                     "subprogram": "8.1.2	Sub-Programme 2.2: Land Care",
  //                     "clients1": [{
  //                         "indicator": "Number of hectares of agricultural land rehabilitated",
  //                         "reportingCycle": "Annually 2020",
  //                         "target": "2000",
  //                         "actualPerformance": "1500"
  //                     },
  //                     {
  //                         "indicator": "Number of green jobs created ",
  //                         "reportingCycle": "Annually 2020",
  //                         "target": "600",
  //                         "actualPerformance": "650"
  //                     }
  //                     ],
  //                     "clients2": [{

  //                         "indicator": "Number of hectares of agricultural land rehabilitated",
  //                         "Q1": "10",
  //                         "Q2": "1200",
  //                         "Q3": "190",
  //                         "Q4": "20"
  //                     },
  //                     {
  //                         "indicator": "Number of green jobs created",
  //                         "Q1": "40",
  //                         "Q2": "500",
  //                         "Q3": "60",
  //                         "Q4": "40"
  //                     }

  //                     ]
  //                 }
  //             ]
  //         },

  //         {
  //             "program1": "8.2 Programme 3: Farmer Support and Development",
  //             "subprograms": [
  //                 {
  //                     "subprogram": "8.2.1 Sub-Programme 3.1: Farmer Settlement and Development",
  //                     "clients1": [{

  //                         "indicator": "Number of smallholder producers supported",
  //                         "reportingCycle": "2019/2020",
  //                         "target": "100",
  //                         "actualPerformance": "90"
  //                     },
  //                     {
  //                         "indicator": "Number of commodity-based mentors appointed and linked to land reform farms",
  //                         "reportingCycle": "2019/2020",
  //                         "target": "50",
  //                         "actualPerformance": "49"
  //                     }

  //                     ],
  //                     "clients2": [{

  //                         "indicator": "Number of smallholder producers supported",
  //                         "Q1": "8",
  //                         "Q2": "1000",
  //                         "Q3": "1200",
  //                         "Q4": "10"
  //                     },
  //                     {
  //                         "indicator": "Number of commodity-based mentors appointed and linked to land reform farms",
  //                         "Q1": "80",
  //                         "Q2": "40",
  //                         "Q3": "10",
  //                         "Q4": "700"
  //                     }

  //                     ]

  //                 },
  //                 {
  //                     "subprogram": "8.2.2	Sub-Programme 3.2: Extension and Advisory Services",
  //                     "clients1": [{
  //                         "indicator": "Number of smallholder producers supported with agricultural advice",
  //                         "reportingCycle": "2019/2020",
  //                         "target": "2000",
  //                         "actualPerformance": "1500"
  //                     },
  //                     {
  //                         "indicator": "Number of subsistence producers supported with agricultural advice ",
  //                         "reportingCycle": "2019/2020",
  //                         "target": "600",
  //                         "actualPerformance": "650"
  //                     }
  //                     ],
  //                     "clients2": [{

  //                         "indicator": "Number of smallholder producers supported with agricultural advice",
  //                         "Q1": "400",
  //                         "Q2": "13",
  //                         "Q3": "20",
  //                         "Q4": "90"
  //                     },
  //                     {
  //                         "indicator": "Number of subsistence producers supported with agricultural advice",
  //                         "Q1": "800",
  //                         "Q2": "100",
  //                         "Q3": "65",
  //                         "Q4": "45"
  //                     }

  //                     ]
  //                 }
  //             ]
  //         }

  //     ]
  // }
  // );

  try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render();
  } catch (error) {
    // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
    errorHandler(error);
  }

  var buf = doc.getZip().generate({ type: "nodebuffer" });
  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  try {
    fs.writeFileSync(path.resolve("public/uploads", fileName), buf);
  } catch (error) {
    console.log(error);
  }
};

router.get("/api/getDocument", function async(req, res) {
  // req.query.cycle = "Quarterly";
  // req.query.year = new Date();
  if (!req.query.year) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "query error",
    });
  }
  if (!req.query.cycle) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "query error",
    });
  }

  const cycleValue = getReportingCycleString(
    new Date(req.query.year),
    req.query.cycle,
    1
  );
  let year = new Date(req.query.year).getFullYear();

  let cYear = year.toString();
  if (
    cycleValue.includes("Jan") ||
    cycleValue.includes("Feb") ||
    cycleValue.includes("Mar")
  ) {
    cYear = (parseInt(cYear) - 1).toString();
  }
  if (req.query.cycle == "Annually") {
    let date = new Date(cYear);
    date.setFullYear(date.getFullYear() + 1);
    const nextYear = new Date(date).getFullYear();

    let Value_match = new RegExp(year);

    PerformanceMng.aggregate([
      {
        $lookup: {
          from: "programs",
          foreignField: "_id",
          localField: "dimensions",
          as: "DimensionsList",
        },
      },
      {
        $match: {
          $and: [{ finYear: cYear }, { status: { $ne: "Deleted" } }],
        },
      },
      {
        $project: {
          indicator: "$indicatorTitle",
          target: "$target",
          reportingCycle: "$reportingCycle",
          dimensions: "$DimensionsList",
          actualPerformance: "$actualPerformance",
          outcome: "$outcome",
          outputs: "$outputs",
          cycleValue: "$cycleValue",
          //cycle: year + "/" + nextYear,
          remarks: "$remarks",
          intervention: "$intervention",
          //responsibleUser: "$objResponsibleUser",
          isTargetCummulative: "$isTargetCummulative",
          //annualtarget: 0,
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      //const data = await docList(indicators, req.query.year);
      const reportlable = year + "/" + nextYear;
      const reporthlable = "Annual Report";
      const data = await yearReportDocList(
        indicators,
        req.query.year,
        cycleValue,
        reportlable,
        reporthlable
      );

      // console.log("data: ", data);
      const datalength = data.programs.length;
      var d = new Date();
      let fileName =
        "Annualreport" +
        d.getFullYear() +
        "" +
        d.getMonth() +
        "" +
        d.getDate() +
        "" +
        d.getHours() +
        "" +
        d.getMinutes() +
        "" +
        d.getSeconds() +
        ".docx";
      // if (datalength === 0) {
      //   res.status(400).json({
      //     success: false,
      //     responseCode: 400,
      //     msg: "Performance not done",
      //   });
      // } else
      {
        generateDocument(data, fileName, req.query.cycle);
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "fetching successfull.",
          result: fileName,
        });
      }
    });
  } else if (req.query.cycle == "Quarterly") {
    var date = new Date(cYear);
    date.setFullYear(date.getFullYear() + 1);
    const nextYear = new Date(date).getFullYear();

    let changeYear = year;
    if (
      cycleValue.includes("Jan") ||
      cycleValue.includes("Feb") ||
      cycleValue.includes("Mar")
    ) {
      changeYear = (parseInt(year) - 1).toString();
    }
    var Value_match = new RegExp(changeYear);

    const reportlable = cycleValue.includes("Apr")
      ? "1st Quarter"
      : cycleValue.includes("Jul")
      ? "2nd Quarter"
      : cycleValue.includes("Oct")
      ? "3rd Quarter"
      : cycleValue.includes("Jan")
      ? "4th Quarter"
      : "";
    const reporthlable = cycleValue.includes("Apr")
      ? "FIRST QUARTER"
      : cycleValue.includes("Jul")
      ? "SECOND QUARTER"
      : cycleValue.includes("Oct")
      ? "THIRD QUARTER"
      : cycleValue.includes("Jan")
      ? "FOURTH QUARTER"
      : "";

    PerformanceMng.aggregate([
      {
        $lookup: {
          from: "programs",
          foreignField: "_id",
          localField: "dimensions",
          as: "DimensionsList",
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     foreignField: "_id",
      //     localField: "responsibleUser",
      //     as: "objResponsibleUser",
      //   },
      // },
      {
        $match: {
          $and: [{ finYear: cYear }, { status: { $ne: "Deleted" } }],
        },
      },
      {
        $project: {
          indicator: "$indicatorTitle",
          target: "$target",
          reportingCycle: "$reportingCycle",
          dimensions: "$DimensionsList",
          actualPerformance: "$actualPerformance",
          outputs: "$outputs",
          cycleValue: "$cycleValue",
          //cycle: year + "/" + nextYear,
          // Q1: "-",
          // Q2: "-",
          // Q3: "-",
          // Q4: "-",
          //annualtarget: 0,
          remarks: "$remarks",
          intervention: "$intervention",
          approvalStatus: "$approvalStatus",
          //responsibleUser: "$objResponsibleUser",
          isTargetCummulative: "$isTargetCummulative",
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      const data = await qreportDocList(
        indicators,
        req.query.year,
        cycleValue,
        reportlable,
        reporthlable
      );

      const datalength = data.programs.length;
      var d = new Date();
      let fileName =
        "Quarterlyreport" +
        d.getFullYear() +
        "" +
        d.getMonth() +
        "" +
        d.getDate() +
        "" +
        d.getHours() +
        "" +
        d.getMinutes() +
        "" +
        d.getSeconds() +
        ".docx";
      generateDocument(data, fileName, req.query.cycle);
      // if (datalength === 0) {
      //   res.status(400).json({
      //     success: false,
      //     responseCode: 400,
      //     msg: "Performance not done",
      //   });
      // } else
      {
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "fetching successfull.",
          result: fileName,
        });
      }
    });
  } else if (req.query.cycle == "Monthly") {
    var date = new Date(cYear);
    date.setFullYear(date.getFullYear() + 1);
    const nextYear = new Date(date).getFullYear();
    let changeYear = year;
    if (
      cycleValue.includes("Jan") ||
      cycleValue.includes("Feb") ||
      cycleValue.includes("Mar")
    ) {
      changeYear = (parseInt(year) - 1).toString();
    }
    var Value_match = new RegExp(changeYear);
    const reportlable = cycleValue;
    const reporthlable = "";
    PerformanceMng.aggregate([
      {
        $lookup: {
          from: "programs",
          foreignField: "_id",
          localField: "dimensions",
          as: "DimensionsList",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "responsibleUser",
          as: "objResponsibleUser",
        },
      },
      {
        $match: {
          $and: [{ finYear: cYear }, { status: { $ne: "Deleted" } }],
        },
      },
      {
        $project: {
          indicator: "$indicatorTitle",
          target: "$target",
          reportingCycle: "$reportingCycle",
          dimensions: "$DimensionsList",
          actualPerformance: "$actualPerformance",
          outputs: "$outputs",
          cycleValue: "$cycleValue",
          cycle: year + "/" + nextYear,
          Q1: "-",
          Q2: "-",
          Q3: "-",
          Q4: "-",
          annualtarget: 0,
          remarks: "$remarks",
          intervention: "$intervention",
          approvalStatus: "$approvalStatus",
          responsibleUser: "$objResponsibleUser",
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      const data = await qreportDocList(
        indicators,
        req.query.year,
        cycleValue,
        reportlable,
        reporthlable
      );

      const datalength = data.programs.length;
      var d = new Date();
      let fileName =
        req.query.cycle +
        "report" +
        d.getFullYear() +
        "" +
        d.getMonth() +
        "" +
        d.getDate() +
        "" +
        d.getHours() +
        "" +
        d.getMinutes() +
        "" +
        d.getSeconds() +
        ".docx";
      generateDocument(data, fileName, req.query.cycle, cycleValue);
      // if (datalength === 0) {
      //   res.status(400).json({
      //     success: false,
      //     responseCode: 400,
      //     msg: "Performance not done",
      //   });
      // } else
      {
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "fetching successfull.",
          result: fileName,
        });
      }
    });
  }
});

function generateMonthlyReport() {}
function generateQuarterlyReport() {}
function generateAnnualReport() {}

const docList = async (indicators, yearDate) => {
  let date = new Date(yearDate);
  date.setFullYear(date.getFullYear() + 1);
  const Year = new Date(date).getFullYear();
  date.setFullYear(date.getFullYear() + 1);

  const data2 = await readdocList(indicators, yearDate);
  //console.log("data2 :", data2);
  return data2;
};

const qreportDocList = async (
  currentYearData,
  yearDate,
  cycleValue,
  reportlable,
  reporthlable
) => {
  let cdate = new Date(yearDate);
  const cYear = new Date(cdate).getFullYear();
  cdate.setFullYear(cdate.getFullYear() + 1);

  const nYear = new Date(cdate).getFullYear();

  cdate.setFullYear(cdate.getFullYear() + 1);

  currentYearData.map((item, index) => {
    if (item.dimensions.length > 0) {
      const dimensions = item.dimensions;
      // const program = dimensions.find((obj) => obj.cndName === "Programme");
      // console.log("dimensions : ", dimensions);
      const program = dimensions.find(
        (obj) =>
          obj.cndName === "Programme 1 " ||
          obj.cndName === "Programme 2 " ||
          obj.cndName === "Programme 3 " ||
          obj.cndName === "Programme 4 " ||
          obj.cndName === "Programme 5 " ||
          obj.cndName === "Programme 6 " ||
          obj.cndName === "Programme 7 " ||
          obj.cndName === "Programme 8 " ||
          obj.cndName === "Programme 9 "
      );
      //console.log("program : ", program);

      // const subprogram = dimensions.find(
      //   (obj) => obj.cndName === "SubProgramme"
      // );
      const subprogram = dimensions.find((obj) =>
        obj.cndName.match(/SubProgramme/)
      );
      //console.log("subprogram : ", subprogram);
      // if (program) {
      //   item.program = program.cndCode;
      //   item.programpurpose = program.desc;
      //   if (subprogram) {
      //     item.subprogram = subprogram.cndCode;
      //     item.subprogrampurpose = subprogram.desc;
      //   }
      // }
      if (program) {
        item.program = program.cndName + ": " + program.cndCode;
        item.priority = program.priority;
        if (subprogram) {
          item.subprogram = subprogram.cndName + ": " + subprogram.cndCode;
          item.subprogrampurpose = subprogram.desc;
          item.priority = subprogram.priority;
        }
        item.programpurpose = program.desc;
      }
    }
    delete item.dimensions;
  });
  let yglist = currentYearData.reduce(
    (h, obj) =>
      Object.assign(h, {
        [obj.indicator]: (h[obj.indicator] || []).concat(obj),
      }),
    {}
  );

  for (let objitem in currentYearData) {
    if (currentYearData[objitem].reportingCycle === "Annually") {
      const listofyr = yglist[currentYearData[objitem].indicator];

      if (typeof listofyr != "undefined") {
        let annualtarget = 0;
        let actualPerf = 0;
        let cflag = 0;
        let indicatorRespPerson = "",
          actualPerformanceInc = "";
        let plannedTarget = 0;
        listofyr.forEach((element) => {
          let respUser = element.responsibleUser.map(
            (a) => a.firstName + " " + a.lastName
          );

          currentYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(currentYearData[objitem].annualtarget);

          if (element !== "approved") {
            if (!actualPerformanceInc.includes(" Planned for 4th quarter ")) {
              currentYearData[objitem].actualPerformance =
                actualPerformanceInc + " Planned for 4th quarter ";
              actualPerformanceInc = currentYearData[objitem].actualPerformance;
            }
          } else {
            currentYearData[objitem].actualPerformance =
              actualPerf +
              parseInt(
                element.actualPerformance == "" ? 0 : element.actualPerformance
              );
            actualPerf = parseInt(currentYearData[objitem].actualPerformance);
          }

          currentYearData[objitem].target =
            plannedTarget + parseInt(element.target);
          plannedTarget = currentYearData[objitem].target;

          if (!indicatorRespPerson.includes(respUser[0])) {
            currentYearData[objitem].target =
              currentYearData[objitem].target +
              " - Responsibility ( " +
              indicatorRespPerson +
              " , " +
              respUser[0] +
              " )";
            indicatorRespPerson = indicatorRespPerson + " , " + respUser[0];
          } else {
            currentYearData[objitem].target =
              currentYearData[objitem].target +
              " - Responsibility ( " +
              indicatorRespPerson +
              " )";
          }
        });
        delete yglist[currentYearData[objitem].indicator];
      } else {
        delete currentYearData[objitem];
      }

      ///////////////////////////yearly end
    } else if (currentYearData[objitem].reportingCycle === "Quarterly") {
      const listofqua = yglist[currentYearData[objitem].indicator];

      if (typeof listofqua != "undefined") {
        let annualtarget = 0;

        let actualPerformanceInc = " Planned for the quarters - ";
        let cflag = 0,
          actualPerf = 0,
          plannedTargetEqual = 0;
        let varRemark = "",
          varIntervention = "";

        listofqua.forEach((element) => {
          if (currentYearData[objitem].isTargetCummulative === true) {
            currentYearData[objitem].annualtarget =
              annualtarget + parseInt(element.target);
            annualtarget = parseInt(currentYearData[objitem].annualtarget);
          } else currentYearData[objitem].annualtarget = element.target;

          if (element.cycleValue != cycleValue && cflag === 0) {
            if (element.cycleValue.includes("Apr")) {
              currentYearData[objitem].target = "-";

              if (!actualPerformanceInc.includes("1st")) {
                currentYearData[objitem].actualPerformance =
                  actualPerformanceInc + "1st, ";
                actualPerformanceInc =
                  currentYearData[objitem].actualPerformance;
              }
              currentYearData[objitem].remarks = "None";
              currentYearData[objitem].intervention = "None";
            } else if (element.cycleValue.includes("Jul")) {
              currentYearData[objitem].target = "-";

              if (!actualPerformanceInc.includes("2nd")) {
                currentYearData[objitem].actualPerformance =
                  actualPerformanceInc + "2nd, ";
                actualPerformanceInc =
                  currentYearData[objitem].actualPerformance;
              }
              currentYearData[objitem].remarks = "None";
              currentYearData[objitem].intervention = "None";
            } else if (element.cycleValue.includes("Oct")) {
              currentYearData[objitem].target = "-";

              if (!actualPerformanceInc.includes("3rd")) {
                currentYearData[objitem].actualPerformance =
                  actualPerformanceInc + "3rd, ";
                actualPerformanceInc =
                  currentYearData[objitem].actualPerformance;
              }
              currentYearData[objitem].remarks = "None";
              currentYearData[objitem].intervention = "None";
            } else if (element.cycleValue.includes("Jan")) {
              currentYearData[objitem].target = "-";

              if (!actualPerformanceInc.includes("4th")) {
                currentYearData[objitem].actualPerformance =
                  actualPerformanceInc + "4th, ";
                actualPerformanceInc =
                  currentYearData[objitem].actualPerformance;
              }
              currentYearData[objitem].remarks = "None";
              currentYearData[objitem].intervention = "None";
            }
          } else {
            if (element.cycleValue === cycleValue) {
              cflag = 1;
              if (currentYearData[objitem].isTargetCummulative === true) {
                currentYearData[objitem].target =
                  plannedTargetEqual + parseInt(element.target);
                //plannedTargetEqual = currentYearData[objitem].target;
                plannedTargetEqual =
                  plannedTargetEqual + parseInt(element.target);
              } else {
                currentYearData[objitem].target = element.target;
              }
              if (currentYearData[objitem].isTargetCummulative === true) {
                currentYearData[objitem].actualPerformance =
                  actualPerf +
                  parseInt(
                    element.actualPerformance === ""
                      ? 0
                      : element.actualPerformance
                  );
                //actualPerf = parseInt(currentYearData[objitem].actualPerformance);
                actualPerf =
                  actualPerf +
                  parseInt(
                    element.actualPerformance === ""
                      ? 0
                      : element.actualPerformance
                  );
              } else {
                currentYearData[objitem].actualPerformance = parseInt(
                  element.actualPerformance === ""
                    ? 0
                    : element.actualPerformance
                );
              }
              currentYearData[objitem].remarks = varRemark + element.remarks;
              varRemark = varRemark + element.remarks + "; ";

              currentYearData[objitem].intervention =
                varIntervention + element.intervention;
              varIntervention = varIntervention + element.intervention + "; ";
            }
          }
        });

        /////////////check condition for append indicator title, remarks, intervention

        currentYearData[objitem].annualtarget =
          currentYearData[objitem].annualtarget +
          " " +
          currentYearData[objitem].indicator.replace("Number of ", "");

        if (Number.isInteger(parseInt(currentYearData[objitem].target)))
          currentYearData[objitem].target =
            currentYearData[objitem].target +
            " " +
            currentYearData[objitem].indicator.replace("Number of ", "");

        if (
          Number.isInteger(parseInt(currentYearData[objitem].actualPerformance))
        )
          currentYearData[objitem].actualPerformance =
            currentYearData[objitem].actualPerformance +
            " " +
            currentYearData[objitem].indicator.replace("Number of ", "");

        currentYearData[objitem].remarks =
          currentYearData[objitem].remarks === "" ||
          currentYearData[objitem].remarks === "; "
            ? "None"
            : currentYearData[objitem].remarks;
        currentYearData[objitem].intervention =
          currentYearData[objitem].intervention === "" ||
          currentYearData[objitem].intervention === "; "
            ? "None"
            : currentYearData[objitem].intervention;
        //////////
        delete yglist[currentYearData[objitem].indicator];
      } else {
        delete currentYearData[objitem];
      }
    } else if (currentYearData[objitem].reportingCycle === "Monthly") {
      const monthlist = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const listofqua = yglist[currentYearData[objitem].indicator];
      if (typeof listofqua != "undefined") {
        let annualtarget = 0;
        let cflag = 0;
        let indicatorRespPerson = "";
        let plannedTarget = 0,
          actualPerf = 0,
          actualPerformanceInc = "",
          plannedTargetEqual = 0;

        listofqua.forEach((element) => {
          let respUser = element.responsibleUser.map(
            (a) => a.firstName + " " + a.lastName
          );

          currentYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(currentYearData[objitem].annualtarget);

          /////////////////////////////////////////////////////////////////////////////////
          if (element.cycleValue === cycleValue) {
            cflag = 1;

            currentYearData[objitem].actualPerformance =
              actualPerf +
              parseInt(
                element.actualPerformance == "" ? 0 : element.actualPerformance
              );
            actualPerf = parseInt(currentYearData[objitem].actualPerformance);

            currentYearData[objitem].target =
              plannedTarget + parseInt(element.target);
            plannedTarget = parseInt(element.target);

            if (!indicatorRespPerson.includes(respUser[0])) {
              currentYearData[objitem].target =
                currentYearData[objitem].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                " , " +
                respUser[0] +
                " )";
              indicatorRespPerson = indicatorRespPerson + " , " + respUser[0];
            } else {
              currentYearData[objitem].target =
                currentYearData[objitem].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                " )";
            }
          } else if (cflag === 0 && element.approvalStatus !== "approved") {
            monthlist.forEach((Melement) => {
              currentYearData[objitem].target = "";

              if (Melement === element.cycleValue) {
                cflag = 1;
                // currentYearData[objitem].actualPerformance =
                //   " Planned for" + Melement + " month ";

                if (!actualPerformanceInc.includes(Melement)) {
                  currentYearData[objitem].actualPerformance =
                    actualPerformanceInc +
                    " Planned for" +
                    Melement +
                    " month ";
                  actualPerformanceInc =
                    currentYearData[objitem].actualPerformance;
                }

                currentYearData[objitem].target =
                  plannedTarget + parseInt(element.target);
                plannedTarget = currentYearData[objitem].target;

                if (!indicatorRespPerson.includes(respUser[0])) {
                  currentYearData[objitem].target =
                    currentYearData[objitem].target +
                    " - Responsibility ( " +
                    indicatorRespPerson +
                    " , " +
                    respUser[0] +
                    " )";
                  indicatorRespPerson =
                    indicatorRespPerson + " , " + respUser[0];
                } else {
                  currentYearData[objitem].target =
                    currentYearData[objitem].target +
                    " - Responsibility ( " +
                    indicatorRespPerson +
                    " )";
                }
              } else if (cflag === 0) {
                currentYearData[objitem].actualPerformance = "";
              }
            });

            if (!indicatorRespPerson.includes(respUser[0])) {
              currentYearData[objitem].target =
                currentYearData[objitem].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                " , " +
                respUser[0] +
                " )";
              indicatorRespPerson = indicatorRespPerson + " , " + respUser[0];
            } else {
              currentYearData[objitem].target =
                currentYearData[objitem].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                " )";
            }
          }
        });
        delete yglist[currentYearData[objitem].indicator];
      } else {
        delete currentYearData[objitem];
      }
    }
  }
  //13-May-2021 added below method to sort by programmes
  currentYearData.sort(function (a, b) {
    return a.priority - b.priority;
  });

  var yeardata = currentYearData,
    groups = ["program", "subprogram"],
    grouped = {};

  yeardata.forEach(function (a) {
    groups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, grouped)
      .push(a);
  });

  let changeYearX = cYear,
    changeNYearX = nYear;
  if (
    cycleValue.includes("Jan") ||
    cycleValue.includes("Feb") ||
    cycleValue.includes("Mar")
  ) {
    changeYearX = (parseInt(cYear) - 1).toString();
    changeNYearX = (parseInt(nYear) - 1).toString();
  }

  let obj3 = {
    programs: [],
    reporttitle: reporthlable,
    reportyear: changeYearX + "/" + changeNYearX,
    reportperiod: cycleValue,
  };
  //console.log("grouped :", grouped)
  for (const commonBrand in grouped) {
    const pindex = Object.keys(grouped).indexOf(commonBrand);
    const subObj = grouped[commonBrand];
    const obj1 = { program1: "", subprograms: [], programpurpose: "" };
    for (let comSub in subObj) {
      let inObj2 = {
        subprogram: "",
        subprogrampurpose: "",
        currentyear: "",
        headerlable: reportlable,
        clients1: [],
      };
      let cindex = Object.keys(subObj).indexOf(comSub);
      inObj2.subprogram =
        //"Sub-Programme " + (pindex + 1) + "." + (cindex + 1) + ": " +
        comSub;

      let changeYear = cYear,
        changeNYear = nYear;
      if (
        cycleValue.includes("Jan") ||
        cycleValue.includes("Feb") ||
        cycleValue.includes("Mar")
      ) {
        changeYear = (parseInt(cYear) - 1).toString();
        changeNYear = (parseInt(nYear) - 1).toString();
      }

      inObj2.currentyear = changeYear + "/" + changeNYear;
      let clients1 = subObj[comSub];

      const fiobje = clients1.filter(function (el) {
        return el != null;
      });
      inObj2.clients1 = fiobje;

      inObj2.subprogrampurpose =
        inObj2.clients1 && inObj2.clients1[0].subprogrampurpose;
      obj1.programpurpose =
        inObj2.clients1 && inObj2.clients1[0].programpurpose;

      obj1.subprograms.push(inObj2);
    }
    obj1.program1 =
      //"PROGRAMME " + (pindex + 1) + ": " +
      commonBrand;
    obj3.programs.push(obj1);
  }

  return obj3;
};

const yearReportDocList = async (
  currentYearData,
  yearDate,
  cycleValue,
  reportlable,
  reporthlable
) => {
  let cdate = new Date(yearDate);
  const cYear = new Date(cdate).getFullYear();
  cdate.setFullYear(cdate.getFullYear() + 1);

  const nYear = new Date(cdate).getFullYear();

  cdate.setFullYear(cdate.getFullYear() + 1);

  currentYearData.map((item, index) => {
    if (item.dimensions.length > 0) {
      const dimensions = item.dimensions;
      // const program = dimensions.find((obj) => obj.cndName === "Programme");
      // console.log("dimensions : ", dimensions);
      const program = dimensions.find(
        (obj) =>
          obj.cndName === "Programme 1 " ||
          obj.cndName === "Programme 2 " ||
          obj.cndName === "Programme 3 " ||
          obj.cndName === "Programme 4 " ||
          obj.cndName === "Programme 5 " ||
          obj.cndName === "Programme 6 " ||
          obj.cndName === "Programme 7 " ||
          obj.cndName === "Programme 8 " ||
          obj.cndName === "Programme 9 "
      );
      //console.log("program : ", program);

      // const subprogram = dimensions.find(
      //   (obj) => obj.cndName === "SubProgramme"
      // );
      const subprogram = dimensions.find((obj) =>
        obj.cndName.match(/SubProgramme/)
      );
      //console.log("subprogram : ", subprogram);
      if (program) {
        item.program = program.cndName + ": " + program.cndCode;
        item.priority = program.priority;
        if (subprogram) {
          item.subprogram = subprogram.cndName + ": " + subprogram.cndCode;
          item.subprogrampurpose = subprogram.desc;
          item.priority = subprogram.priority;
        }
        item.programpurpose = program.desc;
      }
    }
    delete item.dimensions;
  });
  let yglist = currentYearData.reduce(
    (h, obj) =>
      Object.assign(h, {
        [obj.indicator]: (h[obj.indicator] || []).concat(obj),
      }),
    {}
  );

  for (let objitem in currentYearData) {
    if (currentYearData[objitem].reportingCycle === "Annually") {
      const listofyr = yglist[currentYearData[objitem].indicator];

      if (typeof listofyr != "undefined") {
        let annualtarget = 0;
        let actualPerf = 0;
        let cflag = 0;
        let indicatorRespPerson = "";
        let plannedTarget = 0,
          actualPerformanceInc = "";
        listofyr.forEach((element) => {
          let respUser = element.responsibleUser.map(
            (a) => a.firstName + " " + a.lastName
          );

          currentYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(currentYearData[objitem].annualtarget);

          if (element !== "approved") {
            if (!actualPerformanceInc.includes(" Planned for 4th quarter ")) {
              currentYearData[objitem].actualPerformance =
                actualPerformanceInc + " Planned for 4th quarter ";
              actualPerformanceInc = currentYearData[objitem].actualPerformance;
            }
          } else {
            currentYearData[objitem].actualPerformance =
              actualPerf +
              parseInt(
                element.actualPerformance == "" ? 0 : element.actualPerformance
              );
            actualPerf = parseInt(currentYearData[objitem].actualPerformance);
          }

          currentYearData[objitem].target =
            plannedTarget + parseInt(element.target);
          plannedTarget = currentYearData[objitem].target;
        });
        delete yglist[currentYearData[objitem].indicator];
      } else {
        delete currentYearData[objitem];
      }

      ///////////////////////////yearly end
    } else if (currentYearData[objitem].reportingCycle === "Quarterly") {
      const listofqua = yglist[currentYearData[objitem].indicator];

      if (typeof listofqua != "undefined") {
        let annualtarget = 0,
          plannedTargetEqual = 0,
          actualPerf = 0,
          checkValueNonC = 0; //this var is for non-cum, it should get the latest actual val
        listofqua.forEach((element) => {
          if (element.isTargetCummulative === true) {
            currentYearData[objitem].annualtarget =
              annualtarget + parseInt(element.target);
            annualtarget = parseInt(currentYearData[objitem].annualtarget);
          } else {
            currentYearData[objitem].annualtarget = element.target;
          }
          if (element.isTargetCummulative === true) {
            currentYearData[objitem].target =
              plannedTargetEqual + parseInt(element.target);
            plannedTargetEqual = plannedTargetEqual + parseInt(element.target);
          } else {
            currentYearData[objitem].target = element.target;
          }
          if (element.isTargetCummulative === true) {
            currentYearData[objitem].actualPerformance =
              actualPerf +
              parseInt(
                element.actualPerformance === "" ? 0 : element.actualPerformance
              );

            actualPerf =
              actualPerf +
              parseInt(
                element.actualPerformance === "" ? 0 : element.actualPerformance
              );
          } else {
            if (
              (element.actualPerformance === ""
                ? 0
                : parseInt(element.actualPerformance)) > 0
            ) {
              if (
                checkValueNonC <
                (element.actualPerformance === ""
                  ? 0
                  : parseInt(element.actualPerformance))
              ) {
                checkValueNonC =
                  element.actualPerformance === ""
                    ? 0
                    : element.actualPerformance;
              }
            }

            currentYearData[objitem].actualPerformance = checkValueNonC;
          }
        });

        /////////////check condition for append indicator title, remarks, intervention

        currentYearData[objitem].annualtarget =
          currentYearData[objitem].annualtarget +
          " " +
          currentYearData[objitem].indicator.replace("Number of ", "");

        if (Number.isInteger(parseInt(currentYearData[objitem].target)))
          currentYearData[objitem].target =
            currentYearData[objitem].target +
            " " +
            currentYearData[objitem].indicator.replace("Number of ", "");

        if (
          Number.isInteger(parseInt(currentYearData[objitem].actualPerformance))
        )
          currentYearData[objitem].actualPerformance =
            currentYearData[objitem].actualPerformance +
            " " +
            currentYearData[objitem].indicator.replace("Number of ", "");

        currentYearData[objitem].remarks = "";
        currentYearData[objitem].intervention = "";
        ////////////////
        delete yglist[currentYearData[objitem].indicator];
      } else {
        delete currentYearData[objitem];
      }
    } else if (currentYearData[objitem].reportingCycle === "Monthly") {
      const monthlist = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const listofqua = yglist[currentYearData[objitem].indicator];
      if (typeof listofqua != "undefined") {
        let annualtarget = 0;
        let cflag = 0;
        let indicatorRespPerson = "";
        let plannedTarget = 0,
          actualPerformanceInc = "",
          actualPerf = 0;

        listofqua.forEach((element) => {
          let respUser = element.responsibleUser.map(
            (a) => a.firstName + " " + a.lastName
          );
          currentYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(currentYearData[objitem].annualtarget);

          if (cflag === 0 && element.approvalStatus !== "approved") {
            monthlist.forEach((Melement) => {
              if (element.cycleValue.includes(Melement)) {
                //cflag = 1;

                if (!actualPerformanceInc.includes(Melement)) {
                  currentYearData[objitem].actualPerformance =
                    actualPerformanceInc +
                    "Planned for " +
                    Melement +
                    " month ";
                  actualPerformanceInc =
                    currentYearData[objitem].actualPerformance;
                }

                currentYearData[objitem].target =
                  plannedTarget + parseInt(element.target);
                plannedTarget = currentYearData[objitem].target;

                if (!indicatorRespPerson.includes(respUser[0])) {
                  currentYearData[objitem].target =
                    currentYearData[objitem].target +
                    " - Responsibility ( " +
                    indicatorRespPerson +
                    " , " +
                    respUser[0] +
                    " )";
                  indicatorRespPerson =
                    indicatorRespPerson + " , " + respUser[0];
                } else {
                  currentYearData[objitem].target =
                    currentYearData[objitem].target +
                    " - Responsibility ( " +
                    indicatorRespPerson +
                    " )";
                }
              }
            });
          } else {
            currentYearData[objitem].actualPerformance =
              actualPerf +
              parseInt(
                element.actualPerformance == "" ? 0 : element.actualPerformance
              );
            actualPerf = parseInt(currentYearData[objitem].actualPerformance);

            // cflag = 1;
            // currentYearData[objitem].actualPerformance =
            //   element.actualPerformance !== ""
            //     ? element.actualPerformance + " " + element.indicator
            //     : "";

            //below lines added on 30-Sep-2020
            //currentYearData[objitem].target = parseInt(element.target);
            currentYearData[objitem].target =
              plannedTarget + parseInt(element.target);
            plannedTarget = currentYearData[objitem].target;

            if (!indicatorRespPerson.includes(respUser[0])) {
              currentYearData[objitem].target =
                currentYearData[objitem].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                " , " +
                respUser[0] +
                " )";
              indicatorRespPerson = indicatorRespPerson + " , " + respUser[0];
            } else {
              currentYearData[objitem].target =
                currentYearData[objitem].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                " )";
            }
          }
        });
        delete yglist[currentYearData[objitem].indicator];
      } else {
        delete currentYearData[objitem];
      }
    }
  }

  //13-May-2021 added below method to sort by programmes
  currentYearData.sort(function (a, b) {
    return a.priority - b.priority;
  });
  var yeardata = currentYearData,
    groups = ["program", "subprogram"],
    grouped = {};
  // console.log("currentYearData :", currentYearData);

  yeardata.forEach(function (a) {
    groups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, grouped)
      .push(a);
  });

  let obj3 = {
    programs: [],
    reporttitle: reporthlable,
    reportyear: cYear + "/" + nYear,
    reportperiod: cycleValue,
  };
  //console.log("grouped :", grouped)
  for (const commonBrand in grouped) {
    const pindex = Object.keys(grouped).indexOf(commonBrand);
    const subObj = grouped[commonBrand];
    const obj1 = { program1: "", subprograms: [], programpurpose: "" };
    for (let comSub in subObj) {
      let inObj2 = {
        subprogram: "",
        subprogrampurpose: "",
        currentyear: "",
        headerlable: reportlable,
        clients1: [],
      };
      let cindex = Object.keys(subObj).indexOf(comSub);
      inObj2.subprogram =
        //"Sub-Programme " + (pindex + 1) + "." + (cindex + 1) + ": " +
        comSub;
      inObj2.currentyear = cYear + "/" + nYear;
      let clients1 = subObj[comSub];

      const fiobje = clients1.filter(function (el) {
        return el != null;
      });
      inObj2.clients1 = fiobje;

      inObj2.subprogrampurpose =
        inObj2.clients1 && inObj2.clients1[0].subprogrampurpose;
      obj1.programpurpose =
        inObj2.clients1 && inObj2.clients1[0].programpurpose;

      obj1.subprograms.push(inObj2);
    }
    obj1.program1 =
      //"PROGRAMME " + (pindex + 1) + ": " +
      commonBrand;
    obj3.programs.push(obj1);
  }

  return obj3;
};

const readdocList = async (currentYearData, yearDate) => {
  let cdate = new Date(yearDate);
  const cYear = new Date(cdate).getFullYear();
  cdate.setFullYear(cdate.getFullYear() + 1);

  const nYear = new Date(cdate).getFullYear();

  cdate.setFullYear(cdate.getFullYear() + 1);

  const nxYear = new Date(cdate).getFullYear();

  currentYearData.map((item, index) => {
    if (item.dimensions.length > 0) {
      const dimensions = item.dimensions;
      const program = dimensions.find(
        (obj) =>
          obj.cndName === "Programme 1 " ||
          obj.cndName === "Programme 2 " ||
          obj.cndName === "Programme 3 " ||
          obj.cndName === "Programme 4 " ||
          obj.cndName === "Programme 5 " ||
          obj.cndName === "Programme 6 " ||
          obj.cndName === "Programme 7 " ||
          obj.cndName === "Programme 8 " ||
          obj.cndName === "Programme 9 "
      );
      const subprogram = dimensions.find((obj) =>
        obj.cndName.match(/SubProgramme/)
      );
      if (program) {
        item.program = program.cndCode;
        item.subprogram = subprogram.cndCode;
      }
    }
    delete item.dimensions;
  });

  var yeardata = currentYearData,
    groups = ["program", "subprogram"],
    grouped = {};

  yeardata.forEach(function (a) {
    groups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, grouped)
      .push(a);
  });

  nextYearData.map((item, index) => {
    if (item.dimensions.length > 0) {
      const dimensions = item.dimensions;
      const programnext = dimensions.find(
        (obj) =>
          obj.cndName === "Programme 1 " ||
          obj.cndName === "Programme 2 " ||
          obj.cndName === "Programme 3 " ||
          obj.cndName === "Programme 4 " ||
          obj.cndName === "Programme 5 " ||
          obj.cndName === "Programme 6 " ||
          obj.cndName === "Programme 7 " ||
          obj.cndName === "Programme 8 " ||
          obj.cndName === "Programme 9 "
      );
      const subprogramnext = dimensions.find((obj) =>
        obj.cndName.match(/SubProgramme/)
      );
      if (programnext) {
        item.program = programnext.cndCode;
        item.subprogram = subprogramnext.cndCode;
      }
    }
    delete item.dimensions;
  });
  const quarterly1 = ["Jan", "Feb", "Mar"];
  const quarterly2 = ["Apr", "May", "Jun"];
  const quarterly3 = ["Jul", "Aug", "Sep"];
  const quarterly4 = ["Oct", "Nov", "Dec"];
  let glist = nextYearData.reduce(
    (h, obj) =>
      Object.assign(h, {
        [obj.indicator]: (h[obj.indicator] || []).concat(obj),
      }),
    {}
  );
  for (let objitem in nextYearData) {
    if (nextYearData[objitem].reportingCycle === "Annually") {
      nextYearData[objitem].Q4 = nextYearData[objitem].target;
      nextYearData[objitem].annualtarget = nextYearData[objitem].target;
    } else if (nextYearData[objitem].reportingCycle === "Monthly") {
      const mlistofqua = glist[nextYearData[objitem].indicator];
      if (typeof mlistofqua != "undefined") {
        let annualtarget = 0;
        let mtarget = 0;
        mlistofqua.forEach((element) => {
          if (quarterly1.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q1 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q1);
          } else if (quarterly2.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q2 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q2);
          } else if (quarterly3.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q3 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q3);
          } else if (quarterly4.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q4 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q4);
          }
          nextYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(nextYearData[objitem].annualtarget);
        });
        delete glist[nextYearData[objitem].indicator];
      } else {
        delete nextYearData[objitem];
      }
    } else if (nextYearData[objitem].reportingCycle === "Quarterly") {
      const listofqua = glist[nextYearData[objitem].indicator];
      if (typeof listofqua != "undefined") {
        let annualtarget = 0;
        listofqua.forEach((element) => {
          if (element.cycleValue.includes("Apr")) {
            nextYearData[objitem].Q1 = element.target;
          } else if (element.cycleValue.includes("Jul")) {
            nextYearData[objitem].Q2 = element.target;
          } else if (element.cycleValue.includes("Oct")) {
            nextYearData[objitem].Q3 = element.target;
          } else if (element.cycleValue.includes("Jan")) {
            nextYearData[objitem].Q4 = element.target;
          }
          nextYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(nextYearData[objitem].annualtarget);
        });
        delete glist[nextYearData[objitem].indicator];
      } else {
        delete nextYearData[objitem];
      }
    }
  }

  var nextyear = nextYearData,
    nextgroups = ["program", "subprogram"],
    nextgrouped = {};

  nextyear.forEach(function (a) {
    nextgroups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === nextgroups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, nextgrouped)
      .push(a);
  });

  let obj3 = { programs: [] };

  for (const commonBrand in grouped) {
    const pindex = Object.keys(grouped).indexOf(commonBrand);
    const subObj = grouped[commonBrand];
    const obj1 = { program1: "", subprograms: [] };
    for (let comSub in subObj) {
      let inObj2 = {
        subprogram: "",
        currentyear: "",
        nextyear: "",
        clients1: [],
        clients2: [],
      };
      let cindex = Object.keys(subObj).indexOf(comSub);
      inObj2.subprogram =
        "8." +
        (pindex + 1) +
        "." +
        (cindex + 1) +
        " Sub-Programme " +
        (pindex + 2) +
        "." +
        (cindex + 1) +
        ": " +
        comSub;
      inObj2.currentyear = cYear + "/" + nYear;
      inObj2.nextyear = nYear + "/" + nxYear;
      let clients1 = subObj[comSub];
      let gsslist = clients1.reduce(
        (h, obj) =>
          Object.assign(h, {
            [obj.indicator]: (h[obj.indicator] || []).concat(obj),
          }),
        {}
      );

      for (let obslist in clients1) {
        //////////////////////////

        if (clients1[obslist].reportingCycle.trim() === "Annually") {
          const listofyr = gsslist[clients1[obslist].indicator];
          if (typeof listofyr != "undefined") {
            let actualPerformanceobj = 0;
            let ctarget = 0;
            let indicatorRespPerson = "";

            listofyr.forEach((element) => {
              let respUser = element.responsibleUser.map(
                (a) => a.firstName + " " + a.lastName
              );

              clients1[obslist].actualPerformance =
                actualPerformanceobj +
                parseInt(
                  element.actualPerformance === ""
                    ? 0
                    : element.actualPerformance
                );
              actualPerformanceobj = parseInt(
                clients1[obslist].actualPerformance === ""
                  ? 0
                  : clients1[obslist].actualPerformance
              );

              clients1[obslist].target = ctarget + parseInt(element.target);
              ctarget = parseInt(clients1[obslist].target);

              clients1[obslist].target =
                clients1[obslist].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                ", " +
                respUser[0] +
                " )";
              indicatorRespPerson = respUser[0];
            });
            delete gsslist[clients1[obslist].indicator];
          } else {
            delete clients1[obslist];
          }
        }
        //////////////////////////yearly end
        else if (clients1[obslist].reportingCycle.trim() === "Quarterly") {
          const listofqua = gsslist[clients1[obslist].indicator];
          if (typeof listofqua != "undefined") {
            let actualPerformanceobj = 0;
            let ctarget = 0;
            let indicatorRespPerson = "";
            listofqua.forEach((element) => {
              let respUser = element.responsibleUser.map(
                (a) => a.firstName + " " + a.lastName
              );

              clients1[obslist].actualPerformance =
                actualPerformanceobj +
                parseInt(
                  element.actualPerformance === ""
                    ? 0
                    : element.actualPerformance
                );
              actualPerformanceobj = parseInt(
                clients1[obslist].actualPerformance === ""
                  ? 0
                  : clients1[obslist].actualPerformance
              );

              clients1[obslist].target = ctarget + parseInt(element.target);
              ctarget = parseInt(clients1[obslist].target);
              clients1[obslist].target =
                clients1[obslist].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                ", " +
                respUser[0] +
                " )";
              indicatorRespPerson = respUser[0];
            });
            delete gsslist[clients1[obslist].indicator];
          } else {
            delete clients1[obslist];
          }
        } else if (clients1[obslist].reportingCycle.trim() === "Monthly") {
          const mlistofqua = gsslist[clients1[obslist].indicator];
          if (typeof mlistofqua != "undefined") {
            let actualPerformanceobj = 0;
            let ctarget = 0;
            let indicatorRespPerson = "";
            mlistofqua.forEach((element) => {
              let respUser = element.responsibleUser.map(
                (a) => a.firstName + " " + a.lastName
              );

              clients1[obslist].actualPerformance =
                actualPerformanceobj +
                parseInt(
                  element.actualPerformance === ""
                    ? 0
                    : element.actualPerformance
                );
              actualPerformanceobj = parseInt(
                clients1[obslist].actualPerformance === ""
                  ? 0
                  : clients1[obslist].actualPerformance
              );

              clients1[obslist].target = ctarget + parseInt(element.target);
              ctarget = parseInt(clients1[obslist].target);

              clients1[obslist].target =
                clients1[obslist].target +
                " - Responsibility ( " +
                indicatorRespPerson +
                ", " +
                respUser[0] +
                " )";
              indicatorRespPerson = respUser[0];
            });
            delete gsslist[clients1[obslist].indicator];
          } else {
            delete clients1[obslist];
          }
        }
      }
      const fiobje = clients1.filter(function (el) {
        //console.log("el :", el);
        return el != null;
      });
      inObj2.clients1 = fiobje;
      //console.log("fiobje :", fiobje);

      for (const commonBrandnext in nextgrouped) {
        //console.log("nextgrouped :", nextgrouped);
        const subObjnext = nextgrouped[commonBrandnext];
        for (let comSubnext in subObjnext) {
          //console.log("subObjnext :", subObjnext);
          if (comSubnext === comSub) {
            inObj2.clients2 = subObjnext[comSubnext];
          }
        }
      }
      obj1.subprograms.push(inObj2);
    }
    obj1.program1 =
      "8." + (pindex + 1) + " Programme" + (pindex + 2) + ": " + commonBrand;
    obj3.programs.push(obj1);
  }
  //console.log("obj3 :", obj3);
  return obj3;
};

router.get("/api/getAnnualPlanDoc", function async(req, res) {
  // req.query.cycle = "Quarterly";
  // req.query.year = new Date();
  if (!req.query.year) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "query error",
    });
  }
  if (!req.query.cycle) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "query error",
    });
  }

  const cycleValue = getReportingCycleString(
    new Date(req.query.year),
    req.query.cycle,
    1
  );
  const year = new Date(req.query.year).getFullYear();
  // console.log("year :", year)
  const cYear = year.toString();
  if (req.query.cycle == "Annually") {
    let date = new Date(cYear);
    // console.log("date :", date)
    date.setFullYear(date.getFullYear() + 1);
    const nextYear = new Date(date).getFullYear();

    let Value_match = new RegExp(year);
    // console.log("val match :", Value_match)

    PerformanceMng.aggregate([
      {
        $lookup: {
          from: "programs",
          foreignField: "_id",
          localField: "dimensions",
          as: "DimensionsList",
        },
      },

      {
        $match: {
          $and: [{ finYear: cYear }, { status: { $ne: "Deleted" } }],
        },
      },
      {
        $project: {
          indicator: "$indicatorTitle",
          target: "$target",
          reportingCycle: "$reportingCycle",
          dimensions: "$DimensionsList",
          actualPerformance: "$actualPerformance",
          // Q1: "-",
          // Q2: "-",
          // Q3: "-",
          // Q4: "-",
          cycleValue: "$cycleValue",
          outcome: "$outcome",
          outputs: "$outputs",
          //cycle: year + "/" + nextYear,
          //annualtarget: 0,
          isTargetCummulative: "$isTargetCummulative",
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;
      const data = await docListAnnualPlan(indicators, req.query.year);
      /// console.log("annual plan: ", data);
      const datalength = data.programs.length;
      var d = new Date();
      let fileName =
        "Annualplan" +
        d.getFullYear() +
        "" +
        d.getMonth() +
        "" +
        d.getDate() +
        "" +
        d.getHours() +
        "" +
        d.getMinutes() +
        "" +
        d.getSeconds() +
        ".docx";

      generateDocumentAnnualPlan(data, fileName, req.query.cycle);
      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: fileName,
      });
    });
  }
});

const generateDocumentAnnualPlan = (data, fileName, reportingCycle) => {
  const sourcefileName =
    reportingCycle == "Annually"
      ? "annualplan.docx"
      : reportingCycle == "Quarterly"
      ? "quarterreport.docx"
      : reportingCycle == "Monthly"
      ? "quarterreport.docx"
      : "test";

  var content = fs.readFileSync(
    path.resolve("public/uploads", sourcefileName),
    "binary"
  );

  var zip = new PizZip(content);
  var doc;
  try {
    doc = new Docxtemplater(zip);
  } catch (error) {
    // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
    errorHandler(error);
  }

  doc.setData(data);

  try {
    // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
    doc.render();
  } catch (error) {
    // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
    errorHandler(error);
  }

  var buf = doc.getZip().generate({ type: "nodebuffer" });
  // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
  try {
    fs.writeFileSync(path.resolve("public/uploads", fileName), buf);
  } catch (error) {
    console.log(error);
  }
};

//////06-Oct-2020 Annual Planning start
const docListAnnualPlan = async (indicators, yearDate) => {
  let date = new Date(yearDate);
  date.setFullYear(date.getFullYear() + 1);
  const Year = new Date(date).getFullYear();
  date.setFullYear(date.getFullYear() + 1);

  const nextYear = new Date(date).getFullYear();
  let Value_match = new RegExp(Year);

  const cYear = Year;

  const lgtdata = await PerformanceMng.aggregate([
    {
      $lookup: {
        from: "programs",
        foreignField: "_id",
        localField: "dimensions",
        as: "DimensionsList",
      },
    },
    {
      $match: {
        $and: [{ finYear: cYear }, { status: { $ne: "Deleted" } }],
      },
    },
    {
      $project: {
        indicator: "$indicatorTitle",
        target: "$target",
        reportingCycle: "$reportingCycle",
        dimensions: "$DimensionsList",
        // Q1: "-",
        // Q2: "-",
        // Q3: "-",
        // Q4: "-",
        cycleValue: "$cycleValue",
        outcome: "$outcome",
        outputs: "$outputs",
        // cycle: Year + "/" + nextYear,
        // annualtarget: 0,
      },
    },
  ]).exec();

  const data2 = await readdocList_AnnualPlan(indicators, yearDate);
  //console.log("data2 :", data2);
  return data2;
};

const readdocList_AnnualPlan = async (nextYearData, yearDate) => {
  let cdate = new Date(yearDate);
  const cYear = new Date(cdate).getFullYear();
  cdate.setFullYear(cdate.getFullYear() + 1);

  const nYear = new Date(cdate).getFullYear();

  cdate.setFullYear(cdate.getFullYear() + 1);

  const nxYear = new Date(cdate).getFullYear();

  nextYearData.map((item, index) => {
    if (item.dimensions.length > 0) {
      const dimensions = item.dimensions;
      const programnext = dimensions.find(
        (obj) =>
          obj.cndName === "Programme 1 " ||
          obj.cndName === "Programme 2 " ||
          obj.cndName === "Programme 3 " ||
          obj.cndName === "Programme 4 " ||
          obj.cndName === "Programme 5 " ||
          obj.cndName === "Programme 6 " ||
          obj.cndName === "Programme 7 " ||
          obj.cndName === "Programme 8 " ||
          obj.cndName === "Programme 9 "
      );
      const subprogramnext = dimensions.find((obj) =>
        obj.cndName.match(/SubProgramme/)
      );
      if (programnext) {
        item.program = programnext.cndName + ": " + programnext.cndCode;
        item.priority = programnext.priority;
        item.subprogram =
          subprogramnext.cndName + ": " + subprogramnext.cndCode;
        item.programpurpose = programnext.desc;
        item.subprogrampurpose = subprogramnext.desc;
        if (subprogramnext) item.priority = subprogramnext.priority;
      }
    }
    delete item.dimensions;
  });
  const quarterly1 = ["Jan", "Feb", "Mar"];
  const quarterly2 = ["Apr", "May", "Jun"];
  const quarterly3 = ["Jul", "Aug", "Sep"];
  const quarterly4 = ["Oct", "Nov", "Dec"];
  let glist = nextYearData.reduce(
    (h, obj) =>
      Object.assign(h, {
        [obj.indicator]: (h[obj.indicator] || []).concat(obj),
      }),
    {}
  );
  for (let objitem in nextYearData) {
    nextYearData[objitem].Q1 = "-";
    nextYearData[objitem].Q2 = "-";
    nextYearData[objitem].Q3 = "-";
    nextYearData[objitem].Q4 = "-";
    if (nextYearData[objitem].reportingCycle === "Annually") {
      nextYearData[objitem].Q4 = nextYearData[objitem].target;
      nextYearData[objitem].annualtarget = nextYearData[objitem].target;
    } else if (nextYearData[objitem].reportingCycle === "Monthly") {
      const mlistofqua = glist[nextYearData[objitem].indicator];
      if (typeof mlistofqua != "undefined") {
        let annualtarget = 0;
        let mtarget = 0;
        mlistofqua.forEach((element) => {
          if (quarterly1.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q1 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q1);
          } else if (quarterly2.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q2 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q2);
          } else if (quarterly3.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q3 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q3);
          } else if (quarterly4.indexOf(element.cycleValue) !== -1) {
            nextYearData[objitem].Q4 = mtarget + parseInt(element.target);
            mtarget = parseInt(nextYearData[objitem].Q4);
          }
          nextYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(nextYearData[objitem].annualtarget);
        });
        delete glist[nextYearData[objitem].indicator];
      } else {
        delete nextYearData[objitem];
      }
    } else if (nextYearData[objitem].reportingCycle === "Quarterly") {
      const listofqua = glist[nextYearData[objitem].indicator];
      if (typeof listofqua != "undefined") {
        let annualtarget = 0,
          plannedTargetApr = 0,
          plannedTargetJul = 0,
          plannedTargetOct = 0,
          plannedTargetJan = 0;

        listofqua.forEach((element) => {
          if (element.cycleValue.includes("Apr")) {
            //nextYearData[objitem].Q1 = element.target;
            nextYearData[objitem].Q1 =
              plannedTargetApr + parseInt(element.target);
            plannedTargetApr = parseInt(nextYearData[objitem].Q1);
          } else if (element.cycleValue.includes("Jul")) {
            //nextYearData[objitem].Q2 = element.target;
            nextYearData[objitem].Q2 =
              plannedTargetJul + parseInt(element.target);
            plannedTargetJul = parseInt(nextYearData[objitem].Q2);
          } else if (element.cycleValue.includes("Oct")) {
            //nextYearData[objitem].Q3 = element.target;
            nextYearData[objitem].Q3 =
              plannedTargetOct + parseInt(element.target);
            plannedTargetOct = parseInt(nextYearData[objitem].Q3);
          } else if (element.cycleValue.includes("Jan")) {
            //nextYearData[objitem].Q4 = element.target;
            nextYearData[objitem].Q4 =
              plannedTargetJan + parseInt(element.target);
            plannedTargetJan = parseInt(nextYearData[objitem].Q4);
          }
          nextYearData[objitem].annualtarget =
            annualtarget + parseInt(element.target);
          annualtarget = parseInt(nextYearData[objitem].annualtarget);
        });
        delete glist[nextYearData[objitem].indicator];
      } else {
        delete nextYearData[objitem];
      }

      if (
        nextYearData[objitem] &&
        nextYearData[objitem].isTargetCummulative == false
      ) {
        nextYearData[objitem].annualtarget = nextYearData[objitem].target;
      }
    }
  }

  //13-May-2021 added below method to sort by programmes
  nextYearData.sort(function (a, b) {
    return a.priority - b.priority;
  });

  var nextyear = nextYearData,
    nextgroups = ["program", "subprogram"],
    nextgrouped = {};

  nextyear.forEach(function (a) {
    nextgroups
      .reduce(function (o, g, i) {
        // take existing object,
        o[a[g]] = o[a[g]] || (i + 1 === nextgroups.length ? [] : {}); // or generate new obj, or
        return o[a[g]]; // at last, then an array
      }, nextgrouped)
      .push(a);
  });

  let obj3 = { programs: [], reportyear: "" };

  //console.log("grouped :", grouped);
  for (const commonBrand in nextgrouped) {
    // console.log("commonBrand :", commonBrand);
    const pindex = Object.keys(nextgrouped).indexOf(commonBrand);
    // console.log("pindex :", pindex);
    const subObj = nextgrouped[commonBrand];
    //console.log("subObj :", subObj);
    const obj1 = { program1: "", subprograms: [], programpurpose: "" };
    for (let comSub in subObj) {
      let inObj2 = {
        subprogram: "",
        subprogrampurpose: "",
        currentyear: "",
        nextyear: "",

        clients2: [],
      };
      let cindex = Object.keys(subObj).indexOf(comSub);

      inObj2.subprogram =
        // "8." +
        // (pindex + 1) +
        // "." +
        // (cindex + 1) +
        // " Sub-Programme " +
        // (pindex + 2) +
        // "." +
        // (cindex + 1) +
        // ": " +
        comSub;
      inObj2.currentyear = cYear + "/" + nYear;
      inObj2.nextyear = inObj2.currentyear; // nYear + "/" + nxYear;

      inObj2.clients2 = subObj[comSub];

      inObj2.subprogrampurpose =
        inObj2.clients2 && inObj2.clients2[0].subprogrampurpose;
      obj1.programpurpose =
        inObj2.clients2 && inObj2.clients2[0].programpurpose;

      obj1.subprograms.push(inObj2);
    }
    obj1.program1 =
      //"8." + (pindex + 1) + " Programme" + (pindex + 2) + ": " +
      commonBrand;
    obj3.programs.push(obj1);
    obj3.reportyear = cYear + " - " + nYear;
  }
  //console.log("obj3 :", obj3);
  return obj3;
};

//////06-Oct-2020 Annual Planning end

function replaceErrors(key, value) {
  if (value instanceof Error) {
    return Object.getOwnPropertyNames(value).reduce(function (error, key) {
      error[key] = value[key];
      return error;
    }, {});
  }
  return value;
}

function errorHandler(error) {
  if (error.properties && error.properties.errors instanceof Array) {
    const errorMessages = error.properties.errors
      .map(function (error) {
        return error.properties.explanation;
      })
      .join("\n");
    console.log("errorMessages", errorMessages);
  }
  throw error;
}

router.get("/api/performancelistbycycle", auth, async (req, res) => {
  /*********Search Query build ************/
  const reviewType = req.query.reviewType;
  const resId = req.query.userid;
  const cycleValue = req.query.cycleValue.trim();

  if (reviewType === "self") {
    await PerformanceMng.aggregate([
      {
        $match: {
          $and: [
            { responsibleUser: new ObjectId(resId) },
            { cycleValue: cycleValue },
            { status: { $ne: "Deleted" } },
          ],
        },
      },
      {
        $group: {
          _id: "$reportingCycle",
          obj: {
            $push: {
              indicatorTitle: "$indicatorTitle",
              target: "$target",
              reportingCycle: "$reportingCycle",
              startDate: "$startDate",
              dimensions: "$dimensions",
              remarks: "$remarks",
              actualPerformance: "$actualPerformance",
              _id: "$_id",
              status: "$status",
              approvalStatus: "$approvalStatus",
              responsibleUser: "$responsibleUser",
              perId: "$_id",
              approverUser1: "$approverUser1",
              approverUser2: "$approverUser2",
              approverUser3: "$approverUser3",
              currentApprovar: "",
              currentApprovarStatus: "",
              currentRemarks: "",
              userRemarks: "",
              hasDocuments: "$hasDocuments",
              disabled: false,
              outcome: "$outcome",
              outputs: "$outputs",
              intervention: "$intervention",
              isTargetCummulative: "$isTargetCummulative",
              annualTarget: "$annualTarget",
              checkedFlag: false,
              apUser1HasDownload: "$apUser1HasDownload",
              apUser2HasDownload: "$apUser2HasDownload",
              apUser3HasDownload: "$apUser3HasDownload",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $let: {
              vars: { obj: [{ k: { $substr: ["$_id", 0, -1] }, v: "$obj" }] },
              in: { $arrayToObject: "$$obj" },
            },
          },
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      ////////////////////////////
      /*
      if (indicators.length > 0) {
        let yglist = indicators[0].Quarterly.reduce(
          (h, obj) =>
            Object.assign(h, {
              [obj.indicatorTitle]: (h[obj.indicatorTitle] || []).concat(obj),
            }),
          {}
        );

        for (var key in indicators[0].Quarterly) {
          if (indicators[0].Quarterly.hasOwnProperty(key)) {
            const listofqua =
              yglist[indicators[0].Quarterly[key].indicatorTitle];

            let annualTargetVar = 0;
            listofqua.forEach((element) => {
              if (
                element.indicatorTitle ===
                indicators[0].Quarterly[key].indicatorTitle
              ) {
                if (indicators[0].Quarterly[key].isTargetCummulative === true) {
                  indicators[0].Quarterly[key].annualTarget =
                    annualTargetVar + parseInt(element.target);
                  annualTargetVar = parseInt(
                    indicators[0].Quarterly[key].annualTarget
                  );
                } else {
                  indicators[0].Quarterly[key].annualTarget = element.target;
                }
              }
            });
          }
        }
      }
      */
      ////////////////////////////
      const iObj = await getPerList(indicators);

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: iObj,
      });
    });
  } else if (reviewType === "approvals") {
    await PerformanceMng.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { approverUser1: new ObjectId(resId) },
                { approverUser2: new ObjectId(resId) },
                { approverUser3: new ObjectId(resId) },
              ],
            },
            { status: "submit" },
            { cycleValue: req.query.cycleValue.trim() },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "responsibleUser",
          as: "responsibleUser",
        },
      },
      {
        $group: {
          _id: "$reportingCycle",
          obj: {
            $push: {
              indicatorTitle: "$indicatorTitle",
              target: "$target",
              reportingCycle: "$reportingCycle",
              startDate: "$cycleValue",
              dimensions: "$dimensions",
              remarks: "$remarks",
              actualPerformance: "$actualPerformance",
              _id: "$_id",
              status: "$status",
              approvalStatus: "",
              responsibleUser: "$responsibleUser",
              perId: "$_id",
              approverUser1Remarks: "$approverUser1Remarks",
              approverUser2Remarks: "$approverUser2Remarks",
              approverUser3Remarks: "$approverUser3Remarks",
              approverUser1Status: "$approverUser1Status",
              approverUser2Status: "$approverUser2Status",
              approverUser3Status: "$approverUser3Status",
              currentApprovar: "",
              currentApprovarStatus: "",
              currentRemarks: "",
              approverUser1: "$approverUser1",
              approverUser2: "$approverUser2",
              approverUser3: "$approverUser3",
              userRemarks: "",
              disabled: false,
              hasDocuments: "$hasDocuments",
              outcome: "$outcome",
              outputs: "$outputs",
              intervention: "$intervention",
              isTargetCummulative: "$isTargetCummulative",
              annualTarget: "$annualTarget",
              checkedFlag: false,
              apUser1HasDownload: "$apUser1HasDownload",
              apUser2HasDownload: "$apUser2HasDownload",
              apUser3HasDownload: "$apUser3HasDownload",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $let: {
              vars: { obj: [{ k: { $substr: ["$_id", 0, -1] }, v: "$obj" }] },
              in: { $arrayToObject: "$$obj" },
            },
          },
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      ////////////////////////////
      /*
      if (indicators.length > 0) {
        let yglist = indicators[0].Quarterly.reduce(
          (h, obj) =>
            Object.assign(h, {
              [obj.indicatorTitle]: (h[obj.indicatorTitle] || []).concat(obj),
            }),
          {}
        );

        for (var key in indicators[0].Quarterly) {
          if (indicators[0].Quarterly.hasOwnProperty(key)) {
            const listofqua =
              yglist[indicators[0].Quarterly[key].indicatorTitle];

            let annualTargetVar = 0;
            listofqua.forEach((element) => {
              if (
                element.indicatorTitle ===
                indicators[0].Quarterly[key].indicatorTitle
              ) {
                if (indicators[0].Quarterly[key].isTargetCummulative === true) {
                  indicators[0].Quarterly[key].annualTarget =
                    annualTargetVar + parseInt(element.target);
                  annualTargetVar = parseInt(
                    indicators[0].Quarterly[key].annualTarget
                  );
                } else {
                  indicators[0].Quarterly[key].annualTarget = element.target;
                }
              }
            });
          }
        }
      }*/
      ////////////////////////////
      const iObj = await getApprovalPerList(indicators, resId);
      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: iObj,
      });
    });
  } else if (reviewType === "ALL") {
    await PerformanceMng.aggregate([
      {
        $match: {
          $and: [{ cycleValue: cycleValue }, { status: { $ne: "Deleted" } }],
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "responsibleUser",
          as: "responsibleUser",
        },
      },

      {
        $group: {
          _id: "$reportingCycle",
          obj: {
            $push: {
              indicatorTitle: "$indicatorTitle",
              target: "$target",
              reportingCycle: "$reportingCycle",
              startDate: "$startDate",
              dimensions: "$dimensions",
              remarks: "$remarks",
              actualPerformance: "$actualPerformance",
              _id: "$_id",
              status: "$status",
              approvalStatus: "$approvalStatus",
              responsibleUser: "$responsibleUser",
              perId: "$_id",
              approverUser1: "$approverUser1",
              approverUser2: "$approverUser2",
              approverUser3: "$approverUser3",
              currentApprovar: "",
              currentApprovarStatus: "",
              currentRemarks: "",
              userRemarks: "",
              hasDocuments: "$hasDocuments",
              disabled: false,
              outcome: "$outcome",
              outputs: "$outputs",
              intervention: "$intervention",
              isTargetCummulative: "$isTargetCummulative",
              annualTarget: "$annualTarget",
              checkedFlag: false,
              apUser1HasDownload: "$apUser1HasDownload",
              apUser2HasDownload: "$apUser2HasDownload",
              apUser3HasDownload: "$apUser3HasDownload",
            },
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $let: {
              vars: { obj: [{ k: { $substr: ["$_id", 0, -1] }, v: "$obj" }] },
              in: { $arrayToObject: "$$obj" },
            },
          },
        },
      },
    ]).exec(async (err, indicators) => {
      if (err) throw err;

      ////////////////////////////
      /* if (indicators.length > 0) {
        let yglist = indicators[0].Quarterly.reduce(
          (h, obj) =>
            Object.assign(h, {
              [obj.indicatorTitle]: (h[obj.indicatorTitle] || []).concat(obj),
            }),
          {}
        );

        for (var key in indicators[0].Quarterly) {
          if (indicators[0].Quarterly.hasOwnProperty(key)) {
            const listofqua =
              yglist[indicators[0].Quarterly[key].indicatorTitle];

            let annualTargetVar = 0;
            listofqua.forEach((element) => {
              if (
                element.indicatorTitle ===
                indicators[0].Quarterly[key].indicatorTitle
              ) {
                if (indicators[0].Quarterly[key].isTargetCummulative === true) {
                  indicators[0].Quarterly[key].annualTarget =
                    annualTargetVar + parseInt(element.target);
                  annualTargetVar = parseInt(
                    indicators[0].Quarterly[key].annualTarget
                  );
                } else {
                  indicators[0].Quarterly[key].annualTarget = element.target;
                }
              }
            });
          }
        }
        
      }*/
      ////////////////////////////
      const iObj = await getPerListAll(indicators);

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "fetching successfull.",
        result: iObj,
      });
    });
  }
});

/******************************************************** */

// /**
//  * @swagger
//  * /api/Indicators:
//  *   post:
//  *     tags:
//  *       - Add / Update, List Indicators
//  *     description: Returns a object of Indicators
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: IndicatorsName
//  *         description: name of Indicators
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: startDate
//  *         description: start Date of Indicators
//  *         in: formData
//  *         required: true
//  *         type: number
//  *       - name: endDate
//  *         description: end Date of Indicators
//  *         in: formData
//  *         required: true
//  *         type: number
//  *       - name: serviceProvider
//  *         description: name of service provider
//  *         in: formData
//  *         type: string
//  *       - name: IndicatorsDetail
//  *         description: details of Indicators
//  *         in: formData
//  *         type: string
//  *       - name: file
//  *         description: url of file attached with  Indicators
//  *         in: formData
//  *         type: string
//  *       - name: status
//  *         description: description of cnd
//  *         in: formData
//  *         type: number
//  *     responses:
//  *       200:
//  *         description: An Object of Indicators
//  *         schema:
//  *            $ref: '#/definitions/Indicators'
//  */

/************Start Indicators ADD/UPDATE API ************************* */
router.post("/api/indicators", auth, async function (req, res) {
  if (!req.body.indicatorTitle) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Indicator Title.",
    });
  } else {
    if (!req.body.startDate) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter startDate.",
      });
    }
    // else if (!req.body.endDate) {
    //   return res.status(400).json({
    //     success: false,
    //     responseCode: 400,
    //     msg: "Please enter endDate.",
    //   });
    // }
    const cycleValue = getReportingCycleString(
      req.body.startDate,
      req.body.reportingCycle,
      0
    );

    if (req.body.id) {
      if (req.body.AddPersonFlag) {
        //AddPersonFlag will come only when assigning a person

        //check if indicator title & cycle value already exists

        let duplicateIndicator = await PerformanceMng.findOne({
          indicatorTitle: req.body.indicatorTitle.trim(),
          cycleValue: cycleValue.trim(),
          responsibleUser: req.body.responsibleUser,
          _id: { $ne: req.body.id },
          status: { $ne: "Deleted" },
        });

        if (duplicateIndicator) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Same person is assigned for the same quarter and indicator",
          });
        }
      }
      ///////////////////////////////////////////////////////

      let cYear = cycleValue.trim().substring(0, 4);
      if (
        cycleValue.includes("Jan") ||
        cycleValue.includes("Feb") ||
        cycleValue.includes("Mar")
      ) {
        cYear = (parseInt(cYear) - 1).toString();
      }

      ///////check indicator if one of the quarter is cummulative or not
      let checkIndicator = await PerformanceMng.find({
        indicatorTitle: req.body.indicatorTitle.trim(),
        finYear: cYear,
        _id: { $ne: req.body.id },
        status: { $ne: "Deleted" },
      });

      let annualTarget = 0;
      if (checkIndicator) {
        let checkFlag = 0,
          checkTargetFlag = 0,
          anTr = 0;
        for (var i = 0; i < checkIndicator.length; i++) {
          if (req.body.isTargetCummulative === true) {
            checkFlag =
              checkIndicator[i].isTargetCummulative === false
                ? (checkFlag = checkFlag + 1)
                : checkFlag;
            anTr = anTr + parseInt(checkIndicator[i].target);
          } else {
            checkFlag =
              checkIndicator[i].isTargetCummulative === true
                ? (checkFlag = checkFlag + 1)
                : checkFlag;

            checkTargetFlag =
              checkIndicator[i].target !== req.body.target
                ? (checkTargetFlag = checkTargetFlag + 1)
                : checkTargetFlag;
          }
        }

        if (checkFlag > 0) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Please check Target Cummulative, as the other quarter value is different",
          });
        }
        if (checkTargetFlag > 0) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "For Non-cummulative, please check Target value, as the other quarter value is different",
          });
        }
        annualTarget =
          req.body.isTargetCummulative === true
            ? anTr + parseInt(req.body.target)
            : req.body.target;
      } else {
        annualTarget = req.body.target;
      }

      /////////get movArray, outcome, outputs from IndicatorTitle table
      let oc = "",
        op = "",
        marr = [];
      if (req.body.indicatorTitle) {
        let getTitleData = await IndicatorTitles.find({
          indicatorTitle: req.body.indicatorTitle.trim(),
        });

        if (getTitleData.length > 0) {
          oc = getTitleData[0].outcome;
          op = getTitleData[0].outputs;
          marr = getTitleData[0].movArray;
        }
      }
      /////////////////////////////////////////////////////////////////

      /** Update CND **/
      PerformanceMng.findOne(
        {
          _id: req.body.id,
        },
        function (err, indicators) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!indicators) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "indicatore with given id not exists!",
            });
          } else {
            PerformanceMng.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                indicatorTitle: req.body.indicatorTitle
                  ? req.body.indicatorTitle.trim()
                  : indicators.indicatorTitle,
                target: req.body.target
                  ? req.body.target
                  : indicators.target.trim(),
                startDate: req.body.startDate
                  ? req.body.startDate
                  : indicators.startDate,
                endDate: req.body.endDate
                  ? req.body.endDate
                  : indicators.endDate,
                reportingCycle: req.body.reportingCycle
                  ? req.body.reportingCycle
                  : indicators.reportingCycle,
                responsibleRole: req.body.responsibleRole
                  ? req.body.responsibleRole
                  : indicators.responsibleRole,
                responsibleUser: req.body.responsibleUser
                  ? req.body.responsibleUser
                  : indicators.responsibleUser,
                // meansOfVerification: req.body.meansOfVerification
                //   ? req.body.meansOfVerification
                //   : indicators.meansOfVerification,
                movArray: marr ? marr : indicators.movArray,
                cycleValue: cycleValue.trim(),
                dimensions: req.body.dimensions
                  ? req.body.dimensions
                  : indicators.dimensions,
                approverUser1: req.body.approverUser1
                  ? req.body.approverUser1
                  : indicators.approverUser1,
                approverUser2: req.body.approverUser2
                  ? req.body.approverUser2
                  : req.body.approverUser2 == ""
                  ? null
                  : indicators.approverUser2,
                approverUser3: req.body.approverUser3
                  ? req.body.approverUser3
                  : req.body.approverUser3 == ""
                  ? null
                  : indicators.approverUser3,
                outcome: oc ? oc : indicators.outcome,
                outputs: op ? op : indicators.outputs,
                isTargetCummulative: req.body.isTargetCummulative,
                finYear: cYear,
                annualTarget: annualTarget,
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
                  let mailBody = "";
                  mailBody =
                    "Indicator Title:" +
                    indicators.indicatorTitle +
                    "<br/>" +
                    "Target:" +
                    indicators.target +
                    "<br/>" +
                    "Reporting Cycle:" +
                    indicators.reportingCycle +
                    "<br/>" +
                    "Reporting Period:" +
                    indicators.cycleValue +
                    // "<br/>" +
                    // "Means Of Verification:" +
                    // indicators.meansOfVerification +
                    "<br/>" +
                    "Outcome:" +
                    indicators.outcome +
                    "<br/>" +
                    "Output:" +
                    indicators.outputs +
                    "<br/>";
                  if (
                    req.body.responsibleUser &&
                    req.body.responsibleUser !== null &&
                    req.body.responsibleUser !== ""
                  ) {
                    sendMailFuncReturn(
                      0,
                      "",
                      "Indicator Responsibility",
                      "You are responsible for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.responsibleUser,
                      function (mailResp) {
                        var resultx = JSON.parse(JSON.stringify(result));
                        return res.status(200).json({
                          success: true,
                          responseCode: 200,
                          msg: "Indicators Updated Sucessfully.",
                          mailmsg: mailResp,
                          resultx,
                        });
                      }
                    );

                    // mailresponse = await sendMailFuncReturn(
                    //   0,
                    //   "",
                    //   "Indicator Responsibility",
                    //   "You are responsible for the below Indicator : <br/><br/>" +
                    //     mailBody,
                    //   req.body.responsibleUser
                    // );
                  }
                  if (
                    req.body.approverUser1 &&
                    req.body.approverUser1 !== null &&
                    req.body.approverUser1 !== ""
                  ) {
                    sendMailFunc(
                      0,
                      "",
                      "Indicator Approver",
                      "You are the first level approver for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.approverUser1
                    );
                  }

                  if (
                    req.body.approverUser2 &&
                    req.body.approverUser2 !== null &&
                    req.body.approverUser2 !== ""
                  ) {
                    sendMailFunc(
                      0,
                      "",
                      "Indicator Approver",
                      "You are the second level approver for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.approverUser2
                    );
                  }
                  if (
                    req.body.approverUser3 &&
                    req.body.approverUser3 !== null &&
                    req.body.approverUser3 !== ""
                  ) {
                    sendMailFunc(
                      0,
                      "",
                      "Indicator Approver",
                      "You are the thrid level approver for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.approverUser3
                    );
                  }

                  loghistory(
                    req.user._id,
                    "indicatore Updated",
                    "Update",
                    "indicators",
                    "indicators edit",
                    req.get("referer"),
                    indicators,
                    result
                  );

                  //////////update annual target for the same indicator//////////////////////
                  await PerformanceMng.updateMany(
                    {
                      indicatorTitle: req.body.indicatorTitle.trim(),
                      finYear: cYear,
                      status: { $ne: "Deleted" },
                    },
                    { $set: { annualTarget: annualTarget } }
                  );
                  ////////////////////////////////
                }
              }
            );
          }
        }
      );
    } else {
      //check if means of verification available for indicator
      let checkMOV = await IndicatorTitles.find({
        indicatorTitle: req.body.indicatorTitle.trim(),
        "movArray.0": { $exists: true },
      }).count();

      console.log("chck mov : ", checkMOV);
      if (checkMOV == 0) {
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Means of verification is not available for this indicator title, please update in master screen.",
        });
      }

      let cYear = cycleValue.trim().substring(0, 4);
      if (
        cycleValue.includes("Jan") ||
        cycleValue.includes("Feb") ||
        cycleValue.includes("Mar")
      ) {
        cYear = (parseInt(cYear) - 1).toString();
      }

      let checkIndicator = await PerformanceMng.find({
        indicatorTitle: req.body.indicatorTitle.trim(),
        finYear: cYear,
        status: { $ne: "Deleted" },
      });

      let annualTarget = 0;
      if (checkIndicator) {
        let checkFlag = 0,
          checkTargetFlag = 0,
          anTr = 0;
        for (var i = 0; i < checkIndicator.length; i++) {
          if (req.body.isTargetCummulative === true) {
            checkFlag =
              checkIndicator[i].isTargetCummulative === false
                ? (checkFlag = checkFlag + 1)
                : checkFlag;
            anTr = anTr + parseInt(checkIndicator[i].target);
          } else {
            checkFlag =
              checkIndicator[i].isTargetCummulative === true
                ? (checkFlag = checkFlag + 1)
                : checkFlag;

            checkTargetFlag =
              checkIndicator[i].target !== req.body.target
                ? (checkTargetFlag = checkTargetFlag + 1)
                : checkTargetFlag;
          }
        }

        if (checkFlag > 0) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Please check Target Cummulative, as the other quarter value is different",
          });
        }
        if (checkTargetFlag > 0) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "For Non-cummulative, please check Target value, as the other quarter value is different",
          });
        }
        annualTarget =
          req.body.isTargetCummulative === true
            ? anTr + parseInt(req.body.target)
            : req.body.target;
      } else {
        annualTarget = req.body.target;
      }

      /** ADD indicators **/

      /////////get movArray, outcome, outputs from IndicatorTitle table
      let oc = "",
        op = "",
        marr = [];
      if (req.body.indicatorTitle) {
        let getTitleData = await IndicatorTitles.find({
          indicatorTitle: req.body.indicatorTitle.trim(),
        });

        if (getTitleData.length > 0) {
          oc = getTitleData[0].outcome;
          op = getTitleData[0].outputs;
          marr = getTitleData[0].movArray;
        }
      }
      /////////////////////////////////////////////////////////////////

      var indicatoreObj = {
        indicatorTitle: req.body.indicatorTitle.trim(),
        target: req.body.target,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reportingCycle: req.body.reportingCycle.trim(),
        responsibleRole: req.body.responsibleRole,
        responsibleUser: req.body.responsibleUser,
        //meansOfVerification: req.body.meansOfVerification,
        movArray: marr,
        dimensions: req.body.dimensions,
        approverUser1: req.body.approverUser1,
        approverUser2:
          req.body.approverUser2 == "" ? null : req.body.approverUser2,
        approverUser3:
          req.body.approverUser3 == "" ? null : req.body.approverUser3,
        cycleValue: cycleValue.trim(),
        outcome: oc,
        outputs: op,
        isTargetCummulative: req.body.isTargetCummulative,
        finYear: cYear,
        annualTarget: annualTarget,
      };
      var newIndicatore = new PerformanceMng(indicatoreObj);
      newIndicatore.save(async function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "indicatore Name already exist!, plz try with another.",
            });
          } else {
            if (err.errors && err.errors.indicatorTitle)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.indicatorTitle.message,
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

        //to make indicator master table not editable for this indicator.
        let indTitleUpdate = await IndicatorTitles.findOneAndUpdate(
          {
            indicatorTitle: req.body.indicatorTitle.trim(),
          },
          {
            editFlag: false,
          }
        );
        var result = JSON.parse(JSON.stringify(indicatoreObj));
        /*
        let mailBody = "";

        mailBody =
          "Indicator Title:" +
          req.body.indicatorTitle.trim() +
          "<br/>" +
          "Target:" +
          req.body.target +
          "<br/>" +
          "Reporting Cycle:" +
          req.body.reportingCycle.trim() +
          "<br/>" +
          "Reporting Cycle Value:" +
          cycleValue.trim() +
          "<br/>" +
          "Means Of Verification:" +
          req.body.meansOfVerification +
          "<br/>" +
          "Outcome:" +
          req.body.outcome +
          "<br/>" +
          "Output:" +
          req.body.outputs +
          "<br/>";

        sendMailFunc(
          0,
          "",
          "Indicator Responsibility",
          "You are responsible for the below Indicator : <br/><br/>" + mailBody,
          req.body.responsibleUser
        );
        sendMailFunc(
          0,
          "",
          "Indicator Approver",
          "You are the first level approver for the below Indicator : <br/><br/>" +
            mailBody,
          req.body.approverUser1
        );

        if (req.body.approverUser2 !== null && req.body.approverUser2 !== "") {
          sendMailFunc(
            0,
            "",
            "Indicator Approver",
            "You are the second level approver for the below Indicator : <br/><br/>" +
              mailBody,
            req.body.approverUser2
          );
        }
        if (req.body.approverUser3 !== null && req.body.approverUser3 !== "") {
          sendMailFunc(
            0,
            "",
            "Indicator Approver",
            "You are the thrid level approver for the below Indicator : <br/><br/>" +
              mailBody,
            req.body.approverUser3
          );
        }
        */
        loghistory(
          req.user._id,
          "Indicator Add",
          "Add",
          "indicators",
          "Add Indicator",
          req.get("referer"),
          null,
          result
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Indicators added successfully.",
          result: result,
        });

        //////////update annual target for the same indicator//////////////////////
        await PerformanceMng.updateMany(
          {
            indicatorTitle: req.body.indicatorTitle.trim(),
            finYear: cYear,
            status: { $ne: "Deleted" },
          },
          { $set: { annualTarget: annualTarget } }
        );
        ////////////////////////////////
      });
    }
  }
});

/************End Indicators ADD/UPDATE API ************************* */
//Indicator assign to responsible person, approvers // only updating the table
router.post("/api/indicators_assign", auth, async function (req, res) {
  if (!req.body.indicatorTitle) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please close & open again",
    });
  } else {
    const cycleValue = getReportingCycleString(
      req.body.startDate,
      req.body.reportingCycle,
      0
    );

    if (req.body.id) {
      if (req.body.AddPersonFlag) {
        //AddPersonFlag will come only when assigning a person

        //check if indicator title & cycle value already exists

        let duplicateIndicator = await PerformanceMng.findOne({
          indicatorTitle: req.body.indicatorTitle.trim(),
          cycleValue: cycleValue.trim(),
          responsibleUser: req.body.responsibleUser,
          _id: { $ne: req.body.id },
          status: { $ne: "Deleted" },
        });

        if (duplicateIndicator) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Same person is assigned for the same quarter and indicator",
          });
        }
      }

      /** Update performance - assign user, approvers **/
      PerformanceMng.findOne(
        {
          _id: req.body.id,
        },
        function (err, indicators) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!indicators) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "indicatore with given id not exists!",
            });
          } else {
            PerformanceMng.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                responsibleUser: req.body.responsibleUser,
                approverUser1: req.body.approverUser1,
                approverUser2: req.body.approverUser2,
                approverUser3: req.body.approverUser3,
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
                  let mailBody = "";
                  mailBody =
                    "Indicator Title:" +
                    indicators.indicatorTitle +
                    "<br/>" +
                    "Target:" +
                    indicators.target +
                    "<br/>" +
                    "Reporting Cycle:" +
                    indicators.reportingCycle +
                    "<br/>" +
                    "Reporting Period:" +
                    indicators.cycleValue +
                    // "<br/>" +
                    // "Means Of Verification:" +
                    // indicators.meansOfVerification +
                    "<br/>" +
                    "Outcome:" +
                    indicators.outcome +
                    "<br/>" +
                    "Output:" +
                    indicators.outputs +
                    "<br/>";
                  if (
                    req.body.responsibleUser &&
                    req.body.responsibleUser !== null &&
                    req.body.responsibleUser !== ""
                  ) {
                    sendMailFuncReturn(
                      0,
                      "",
                      "Indicator Responsibility",
                      "You are responsible for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.responsibleUser,
                      function (mailResp) {
                        var resultx = JSON.parse(JSON.stringify(result));
                        return res.status(200).json({
                          success: true,
                          responseCode: 200,
                          msg: "Indicators Updated Sucessfully.",
                          mailmsg: mailResp,
                          resultx,
                        });
                      }
                    );
                  }
                  if (
                    req.body.approverUser1 &&
                    req.body.approverUser1 !== null &&
                    req.body.approverUser1 !== ""
                  ) {
                    sendMailFunc(
                      0,
                      "",
                      "Indicator Approver",
                      "You are the first level approver for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.approverUser1
                    );
                  }

                  if (
                    req.body.approverUser2 &&
                    req.body.approverUser2 !== null &&
                    req.body.approverUser2 !== ""
                  ) {
                    sendMailFunc(
                      0,
                      "",
                      "Indicator Approver",
                      "You are the second level approver for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.approverUser2
                    );
                  }
                  if (
                    req.body.approverUser3 &&
                    req.body.approverUser3 !== null &&
                    req.body.approverUser3 !== ""
                  ) {
                    sendMailFunc(
                      0,
                      "",
                      "Indicator Approver",
                      "You are the thrid level approver for the below Indicator : <br/><br/>" +
                        mailBody,
                      req.body.approverUser3
                    );
                  }

                  loghistory(
                    req.user._id,
                    "indicatore Updated",
                    "Update",
                    "indicators",
                    "indicators edit",
                    req.get("referer"),
                    indicators,
                    result
                  );
                }
              }
            );
          }
        }
      );
    }
  }
});

/************Start Indicators List API ************************* */
// /**
//  * @swagger
//  * /api/Indicatorslist:
//  *   get:
//  *     tags:
//  *       - Add / Update, List Indicators
//  *     description: Returns a Indicators list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: IndicatorsName
//  *         in:  query
//  *         type: string
//  *       - name: startDate
//  *         in:  query
//  *         type: string
//  *       - name: endDate
//  *         in:  query
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Array list of cnds
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
//  *             $ref: '#/definitions/Indicators'
//  *
//  *
//  */
/************* Indicatorss LIST API****************/
router.get("/api/indicatorslist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.indicatorTitle) {
    dbquery.indicatorTitle = req.query.indicatorTitle;
  }
  if (req.query.finYear) {
    dbquery.finYear = req.query.finYear;
  }
  if (req.query.indicatorId) {
    dbquery._id = req.query.indicatorId;
  }
  if (req.query.target) {
    dbquery.target = req.query.target;
  }

  if (req.query.reportingCycle) {
    dbquery.reportingCycle = req.query.reportingCycle;
  }

  if (req.query.cycleValue) {
    dbquery.cycleValue = req.query.cycleValue.trim();
  }
  if (req.query.dimensions) {
    var dimArr = req.query.dimensions.split(",");
    // console.log("dimensions: ", dimArr);

    dbquery.dimensions = { $in: dimArr };
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
  PerformanceMng.find({
    $and: [
      { status: { $ne: "Deleted" } },
      dbquery,
      {
        $or: [
          { indicatorTitle: { $regex: dbquery_search, $options: "i" } },
          { reportingCycle: { $regex: dbquery_search, $options: "i" } },
          { cycleValue: { $regex: dbquery_search, $options: "i" } },
        ],
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
      PerformanceMng.find(
        {
          $and: [
            { status: { $ne: "Deleted" } },
            dbquery,
            {
              $or: [
                { indicatorTitle: { $regex: dbquery_search, $options: "i" } },
                { reportingCycle: { $regex: dbquery_search, $options: "i" } },
                { cycleValue: { $regex: dbquery_search, $options: "i" } },
              ],
            },
          ],
        },
        {}
      )
        .populate({
          path: "responsibleUser",
          model: "users",
        })
        .populate({
          path: "approverUser1",
          model: "users",
        })
        .populate({
          path: "approverUser2",
          model: "users",
        })
        .populate({
          path: "approverUser3",
          model: "users",
        })
        .sort({ cycleValue: 1 })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, indicatorinfo) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
            });
          } else {
            // console.log(indicatorinfo);
            res.status(200).json({
              success: true,
              responseCode: 200,
              result: indicatorinfo,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});
/************End Indicatorss List API ************************* */

router.delete("/api/DeleteIndicator", auth, async (req, res) => {
  const oldData = await PerformanceMng.findById(req.query.id);

  const indicator = await PerformanceMng.findByIdAndUpdate(req.query.id, {
    deleteddate: Date.now(),
    status: "Deleted",
  });

  if (!indicator) return res.status(400).send("Record not found");

  await PerformanceMng.updateMany(
    {
      indicatorTitle: oldData.indicatorTitle,
      finYear: oldData.finYear,
      status: { $ne: "Deleted" },
    },
    {
      $set: {
        annualTarget:
          oldData.isTargetCummulative === true
            ? parseInt(oldData.annualTarget) - parseInt(oldData.target)
            : oldData.target,
      },
    }
  );

  loghistory(
    req.user._id,
    "Indicator Deleted",
    "Delete",
    "Indicators",
    "Delete Indicator",
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
