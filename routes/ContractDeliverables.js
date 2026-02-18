var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ContractDeliverables = require("../models/ContractDeliverables");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

// /**
//  * @swagger
//  * /api/contract_deliverable:
//  *   post:
//  *     tags:
//  *       - Add / Update, List Contract Deliverables
//  *     description: Returns a object of Contract Deliverables
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: contractId
//  *         description: id of contract , from which milestone is attached
//  *         in: formData
//  *         required: true
//  *       - name: milestoneName
//  *         description: name of milestone
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: startDate
//  *         description: start Date of contract
//  *         in: formData
//  *         required: true
//  *         type: number
//  *       - name: endDate
//  *         description: end Date of contract
//  *         in: formData
//  *         required: true
//  *         type: number
//  *       - name: serviceProvider
//  *         description: name of service provider
//  *         in: formData
//  *         type: string
//  *       - name: contractDetail
//  *         description: details of contract
//  *         in: formData
//  *         type: string
//  *       - name: file
//  *         description: url of file attached with  contract
//  *         in: formData
//  *         type: string
//  *       - name: status
//  *         description: description of cnd
//  *         in: formData
//  *         type: number
//  *     responses:
//  *       200:
//  *         description: An Object of Contract Deliverables
//  *         schema:
//  *            $ref: '#/definitions/ContractDeliverables'
//  */

/************Start Cnd ADD/UPDATE API ************************* */
router.post("/api/contract_deliverable", auth, async function (req, res) {
  console.log("body", req.body);
  if (!req.body.contractId) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter contractId.",
    });
  } else if (!req.body.milestoneName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter milestoneName.",
    });
  } else if (!req.body.startDate) {
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
  } else {
    if (req.body.id) {
      /** Update CND **/
      ContractDeliverables.findOne(
        {
          _id: req.body.id,
        },
        function (err, contractDeliverable) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!contractDeliverable) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Contracts with given id not exists!",
            });
          } else {
            ContractDeliverables.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                milestoneName: req.body.milestoneName,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                milestoneDetails: req.body.milestoneDetails
                  ? req.body.milestoneDetails
                  : contractDeliverable.milestoneDetails,
                supportDoc: req.body.supportDoc
                  ? req.body.supportDoc
                  : contractDeliverable.supportDoc,
                contractId: req.body.contractId
                  ? req.body.contractId
                  : contractDeliverable.contractId,
                status: req.body.status
                  ? req.body.status
                  : contractDeliverable.status,
                flag: req.body.flag ? req.body.flag : contractDeliverable.flag,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : contractDeliverable.deleted,
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
                  if (req.query.userid)
                    loghistory(
                      req.query.userid,
                      "Contract Deliverable Update",
                      "Update",
                      "contract_deliverables",
                      "Update Contract Deliverable",
                      req.get("referer"),
                      contractDeliverable,
                      result
                    );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Milestone Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Contract Deliverable **/
      var contractDeliverableObj = {
        milestoneName: req.body.milestoneName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        milestoneDetails: req.body.milestoneDetails,
        contractId: req.body.contractId,
        supportDoc: req.body.supportDoc,
        status: req.body.status,
        flag: req.body.flag,
        deleted: req.body.deleted,
      };
      var newContractDeliver = new ContractDeliverables(contractDeliverableObj);
      newContractDeliver.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Milestone Name already exist!, plz try with another.",
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
        var result = JSON.parse(JSON.stringify(newContractDeliver));
        if (req.query.userid)
          loghistory(
            req.query.userid,
            "Contract Deliverables Add",
            "Add",
            "contract_deliverables",
            "Add Contract Deliverable",
            req.get("referer"),
            null,
            result
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

/************End Contract Deliverable ADD/UPDATE API ************************* */

/************Start Contract Deliverable List API ************************* */
// /**
//  * @swagger
//  * /api/contract_deliverable_list:
//  *   get:
//  *     tags:
//  *       - Add / Update, List Contract Deliverables
//  *     description: Returns a Contract Deliverables list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: milestoneName
//  *         in:  query
//  *         type: string
//  *       - name: contractId
//  *         in:  query
//  *         type: string
//  *       - name: status
//  *         in:  query
//  *         type: number
//  *       - name: flag
//  *         in:  query
//  *         type: number
//  *       - name: startDate
//  *         in:  query
//  *         type: string
//  *       - name: endDate
//  *         in:  query
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Array list of Contract Deliverables
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
//  *             $ref: '#/definitions/ContractDeliverables'
//  *
//  *
//  */
/************* Contract Deliverables LIST API****************/
router.get("/api/contract_deliverable_list", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.milestoneName) {
    dbquery.milestoneName = req.query.milestoneName;
  }

  if (req.query.contractId) {
    dbquery.contractId = req.query.contractId;
  }

  if (req.query.status) {
    dbquery.status = req.query.status;
  }

  if (req.query.flag) {
    dbquery.flag = req.query.flag;
  }

  if (req.query.startDate) {
    dbquery.startDate = req.query.startDate;
  }

  if (req.query.endDate) {
    dbquery.endDate = req.query.endDate;
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
  console.log("query================", dbquery);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  ContractDeliverables.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      ContractDeliverables.find(dbquery, {})
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
/************End Contracts Deliverables List API ************************* */
module.exports = router;
