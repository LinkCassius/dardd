var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ContractKpis = require("../models/ContractKpis");
var Kpi = require("../models/Kpi");
const loghistory = require("./userhistory");

// /**
//  * @swagger
//  * /api/contract_deliverable:
//  *   post:
//  *     tags:
//  *       - Add / Update, List Contract KPIs
//  *     description: Returns a object of Contract Deliverables
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: contractId
//  *         description: id of contract , from which KPI is attached
//  *         in: formData
//  *         required: true
//  *       - name: kpiId
//  *         description: id of kpi , from which achievement is attached
//  *         in: formData
//  *         required: true
//  *       - name: value
//  *         description: Description of the achievement
//  *         in: formData
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of Contract KPIs
//  *         schema:
//  *            $ref: '#/definitions/ContractKpis'
//  */

/************Start Contract Kpi ADD/UPDATE API ************************* */
router.post("/api/contract_kpi", async function (req, res) {
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      if (!req.body[key].contractId) {
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "ContractId not passed",
        });
      } else if (!req.body[key].kpiId) {
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "kpiId not passed",
        });
      } else {
        {
          /** ADD Contract KPI **/
          var query = {
            contractId: req.body[key].contractId,
            kpiId: req.body[key].kpiId,
          };

          await ContractKpis.deleteMany(query, function (err) {
            console.log("delete err", err);
          });

          var contractKpiObj = {
            value: req.body[key].value,
            contractId: req.body[key].contractId,
            kpiId: req.body[key].kpiId,
          };
          var newContractKpi = await new ContractKpis(contractKpiObj);
          newContractKpi.save(function (err) {
            var result = JSON.parse(JSON.stringify(newContractKpi));
          });
        }
      }
    }
  } //for loop end
  return res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "data added successfully.",
    result: "",
  });
});

/************End Contract Kpi ADD/UPDATE API ************************* */

/************Start Contract Kpi Bind API ************************* */
// /**
//  * @swagger
//  * /api/contract_deliverable_list:
//  *   get:
//  *     tags:
//  *       - Bind Contract Kpis
//  *     description: Returns a Contract Kpi list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: value
//  *         in:  query
//  *         type: string
//  *       - name: contractId
//  *         in:  query
//  *         type: string
//  *       - name: kpiId
//  *         in:  query
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Array list of Contract Kpis
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
//  *             $ref: '#/definitions/ContractKpis'
//  *
//  *
//  */
/************* Contract Kpis LIST API****************/
router.get("/api/contract_kpi_list/:contractId", function (req, res) {
  /*
  db.BusinessCollection.aggregate([
    { $match: { clinics: { $type: "array" } } },
    {
      $lookup: {
        from: "ClinicsCollection",
        let: { clinics: "$clinics" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$clinics"] },
                  { $not: { $eq: ["$_id", 1] } }
                ]
              }
            }
          }
        ],
        as: "clinics"
      }
    }
  ]);*/

  let dbquery = {};
  dbquery.contractId = req.params.contractId;
  console.log("dbquery: ", req.params.contractId);
  var contractId = mongoose.Types.ObjectId(req.params.contractId);
  Kpi.aggregate([
    {
      $lookup: {
        from: "contract_kpis", // collection name in db
        localField: "_id",
        foreignField: "kpiId",
        as: "contract_kpis",
      },
    },
    { $unwind: "$contract_kpis" },
    {
      $match: {
        "contract_kpis.contractId": contractId,
      },
    },
  ]).exec(async function (err, docs) {
    if (err) throw err;
    var totalDoc = await Kpi.find(dbquery, {});
    var totalCount = totalDoc.length;
    res.status(200).json({
      success: true,
      responseCode: 200,
      msg: "List fetched successfully",
      result: docs,
      totalRecCount: totalCount,
    });
  });

  /*
  let dbquery = {};
  dbquery.contractId = req.params.contractId;
  dbquery.kpiId = req.params.kpiId;
  console.log("dbquery: ", req.params.contractId);
  ContractKpis.find(dbquery).exec(function(err, cndInfo) {
    console.log("err", err);
    if (err) {
      res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Error fetching data",
        result: "error"
      });
    } else {
      res.status(200).json({
        success: true,
        responseCode: 200,
        result: cndInfo,
        msg: "List fetching successfully"
      });
    }
  });

  */
});
/************End Contracts Kpis List API ************************* */
module.exports = router;
