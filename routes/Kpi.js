var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Kpi = require("../models/Kpi");
const loghistory = require("./userhistory");

// /**
//  * @swagger
//  * /api/kpi:
//  *   post:
//  *     tags:
//  *       - Add / Update, List Kpi
//  *     description: Returns a object of Kpi
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: kpiCode
//  *         description: code of the Kpi
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: kpiDescription
//  *         description: description of the Kpi
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: kpiTarget
//  *         description: Kpi Target
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: kpiComplianceMin
//  *         description: Kpi Compliance Minimum
//  *         in: formData
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of kpi
//  *         schema:
//  *            $ref: '#/definitions/Kpi'
//  */

/************Start Kpi ADD/UPDATE API ************************* */
router.post("/api/kpi", async function (req, res) {
  console.log("kpi body: ", req.body);

  if (!req.body.kpiCode) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter KPI Code.",
    });
  } else if (!req.body.kpiDescription) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter KPI Description.",
    });
  } else if (!req.body.kpiTarget) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter KPI Target.",
    });
  } else if (!req.body.kpiComplianceMin) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter KPI Compliance Minimum.",
    });
  } else {
    if (req.body.id) {
      /** Update CND **/
      Kpi.findOne(
        {
          _id: req.body.id,
        },
        function (err, kpi) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!kpi) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "KPI with given id not exists!",
            });
          } else {
            Kpi.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                kpiCode: req.body.kpiCode,
                kpiDescription: req.body.kpiDescription,
                kpiTarget: req.body.kpiTarget,
                kpiComplianceMin: req.body.kpiComplianceMin,
                deleted: req.body.deleted ? req.body.deleted : kpi.deleted,
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
                    msg: "KPI Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD KPI **/
      var kpiObj = {
        kpiCode: req.body.kpiCode,
        kpiDescription: req.body.kpiDescription,
        kpiTarget: req.body.kpiTarget,
        kpiComplianceMin: req.body.kpiComplianceMin,
        deleted: req.body.deleted,
      };
      var newKpi = new Kpi(kpiObj);
      newKpi.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "KPI Code already exist!, please try with another code.",
            });
          } else {
            if (err.errors && err.errors.kpiCode)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.kpiCode.message,
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
        var result = JSON.parse(JSON.stringify(newKpi));

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "KPI added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End KPI ADD/UPDATE API ************************* */

/************Start KPI List API ************************* */
// /**
//  * @swagger
//  * /api/kpilist:
//  *   get:
//  *     tags:
//  *       - Add / Update, List Kpi
//  *     description: Returns a Kpi list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: kpiCode
//  *         in:  query
//  *         type: string
//  *       - name: kpiDescription
//  *         in:  query
//  *         type: string
//  *       - name: kpiTarget
//  *         in:  query
//  *         type: string
//  *       - name: kpiComplianceMin
//  *         in:  query
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Array list of KPIs
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
//  *             $ref: '#/definitions/Kpi'
//  *
//  *
//  */
/************* KPIs LIST API****************/
router.get("/api/kpilist", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};

  if (req.query.kpiCode) {
    dbquery.kpiCode = req.query.kpiCode;
  }

  if (req.query.kpiDescription) {
    dbquery.kpiDescription = req.query.kpiDescription;
  }

  if (req.query.kpiTarget) {
    dbquery.kpiTarget = req.query.kpiTarget;
  }

  if (req.query.kpiComplianceMin) {
    dbquery.kpiTarget = req.query.kpiComplianceMin;
  }
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
  Kpi.find(dbquery)
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
      Kpi.find(dbquery, {})
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
            var results = [];

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
/************End KPIs List API ************************* */

/************* Get Single KPI API****************/
router.get("/api/kpilist/:id", function (req, res) {
  Kpi.findById(req.params.id).exec(function (err, cndInfo) {
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
        result: cndInfo,
        msg: "List fetching successfully",
      });
    }
  });
});
/************End Get Single KPI API ************************* */

module.exports = router;
