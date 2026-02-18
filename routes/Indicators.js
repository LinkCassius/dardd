var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Indicators = require("../models/Indicators");
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
var startOfWeek = require("date-fns/startOfWeek");
var endOfWeek = require("date-fns/endOfWeek");
var format = require("date-fns/format");
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
  // console.log(req.body);
  if (!req.body.indicatorTitle) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Indicatore Title.",
    });
  } else {
    if (!req.body.startDate) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter startDate.",
      });
    } else if (!req.body.endDate) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter endDate.",
      });
    }
    const cycleValue = getReportingCycleString(
      req.body.startDate,
      req.body.reportingCycle
    );

    if (req.body.id) {
      /** Update CND **/
      Indicators.findOne(
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
            Indicators.findOneAndUpdate(
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
                meansOfVerification: req.body.meansOfVerification
                  ? req.body.meansOfVerification
                  : indicators.meansOfVerification,
                cycleValue: cycleValue.trim(),
                dimensions: req.body.dimensions
                  ? req.body.dimensions
                  : indicators.dimensions,
                approverUser1: req.body.approverUser1
                  ? req.body.approverUser1
                  : indicators.approverUser1,
                approverUser2: req.body.approverUser2
                  ? req.body.approverUser2
                  : indicators.approverUser2,
                approverUser3: req.body.approverUser3
                  ? req.body.approverUser3
                  : indicators.approverUser3,
                outcome: req.body.outcome
                  ? req.body.outcome
                  : indicators.outcome,
                outputs: req.body.outputs
                  ? req.body.outputs
                  : indicators.outputs,
              },
              { new: true },
              function (err, result) {
                console.log("error");
                if (err) {
                  console.log("err", err);
                  return res.status(400).json({
                    success: false,
                    responseCode: 400,
                    msg: "Internal Server Error.",
                  });
                } else {
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

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "indicatore Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD indicators **/
      var indicatoreObj = {
        indicatorTitle: req.body.indicatorTitle.trim(),
        target: req.body.target,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reportingCycle: req.body.reportingCycle.trim(),
        responsibleRole: req.body.responsibleRole,
        responsibleUser: req.body.responsibleUser,
        meansOfVerification: req.body.meansOfVerification,
        dimensions: req.body.dimensions,
        approverUser1: req.body.approverUser1,
        approverUser2:
          req.body.approverUser2 == "" ? null : req.body.approverUser2,
        approverUser3:
          req.body.approverUser3 == "" ? null : req.body.approverUser3,
        cycleValue: cycleValue.trim(),
        outcome: req.body.outcome,
        outputs: req.body.outputs,
      };
      var newIndicatore = new Indicators(indicatoreObj);
      newIndicatore.save(function (err) {
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
        var result = JSON.parse(JSON.stringify(indicatoreObj));

        loghistory(
          req.user._id,
          "indicatore Add",
          "Add",
          "indicators",
          "Add indicatore",
          req.get("referer"),
          null,
          result
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Indicatore added successfully.",
          result: result,
        });
      });
    }
  }
});
const getReportingCycleString = (startDate, reportingCycle) => {
  const quarterly1 = ["Jan", "Feb", "Mar"];
  const quarterly2 = ["Apr", "May", "Jun"];
  const quarterly3 = ["Jul", "Aug", "Sep"];
  const quarterly4 = ["Oct", "Nov", "Dec"];

  let oldDate = new Date(startDate * 1000);

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
/************End Indicators ADD/UPDATE API ************************* */

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
  if (req.query.indicatorId) {
    dbquery._id = req.query.indicatorId;
  }
  if (req.query.target) {
    dbquery.target = req.query.target;
  }

  if (req.query.reportingCycle) {
    dbquery.reportingCycle = req.query.reportingCycle;
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
  Indicators.find({
    $and: [
      dbquery,
      {
        $or: [
          { indicatorTitle: { $regex: dbquery_search, $options: "i" } },
          { reportingCycle: { $regex: dbquery_search, $options: "i" } },
          { cycleValue: { $regex: dbquery_search, $options: "i" } },
          { target: { $regex: dbquery_search, $options: "i" } },
        ],
      },
    ],
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
      Indicators.find(
        {
          $and: [
            dbquery,
            {
              $or: [
                { indicatorTitle: { $regex: dbquery_search, $options: "i" } },
                { reportingCycle: { $regex: dbquery_search, $options: "i" } },
                { cycleValue: { $regex: dbquery_search, $options: "i" } },
                { target: { $regex: dbquery_search, $options: "i" } },
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
        .sort({ [sort_field]: sort_mode })
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
module.exports = router;
