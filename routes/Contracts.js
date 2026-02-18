var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Contracts = require("../models/Contracts");
var approvalHistory = require("./ApprovalHistoryFunc");

const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/contract:
 *   post:
 *     tags:
 *       - Add / Update, List Contract
 *     description: Returns a object of Contract
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: contractName
 *         description: name of contract
 *         in: formData
 *         required: true
 *         type: string
 *       - name: startDate
 *         description: start Date of contract
 *         in: formData
 *         required: true
 *         type: number
 *       - name: endDate
 *         description: end Date of contract
 *         in: formData
 *         required: true
 *         type: number
 *       - name: serviceProvider
 *         description: name of service provider
 *         in: formData
 *         type: string
 *       - name: contractDetail
 *         description: details of contract
 *         in: formData
 *         type: string
 *       - name: file
 *         description: url of file attached with  contract
 *         in: formData
 *         type: string
 *       - name: status
 *         description: description of cnd
 *         in: formData
 *         type: number
 *     responses:
 *       200:
 *         description: An Object of contract
 *         schema:
 *            $ref: '#/definitions/Contract'
 */

/************Start contract ADD/UPDATE API ************************* */
router.post("/api/contract", auth, async function (req, res) {
  if (!req.body.contractName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter contractName.",
    });
  } else {
    /*
  else if (!req.body.startDate) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter startDate."
    });
  } else if (!req.body.endDate) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter endDate."
    });
  }
  */
    if (req.body.id) {
      /** Update CND **/
      Contracts.findOne(
        {
          _id: req.body.id,
        },
        function (err, contract) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!contract) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Contracts with given id not exists!",
            });
          } else {
            Contracts.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                contractName: req.body.contractName
                  ? req.body.contractName
                  : contract.contractName,
                contractNumber: req.body.contractNumber
                  ? req.body.contractNumber
                  : contract.contractNumber,
                projectNumber: req.body.projectNumber
                  ? req.body.projectNumber
                  : contract.projectNumber,
                startDate: req.body.startDate
                  ? req.body.startDate
                  : contract.startDate,
                endDate: req.body.endDate ? req.body.endDate : contract.endDate,
                serviceProvider: req.body.serviceProvider
                  ? req.body.serviceProvider
                  : contract.serviceProvider,
                serviceProviderId: req.body.serviceProviderId
                  ? req.body.serviceProviderId
                  : contract.serviceProviderId,
                contractDetail: req.body.contractDetail
                  ? req.body.contractDetail
                  : contract.contractDetail,
                contractValue: req.body.contractValue
                  ? req.body.contractValue
                  : contract.contractValue,
                contractType: req.body.contractType
                  ? req.body.contractType
                  : contract.contractType,
                variationApproved: req.body.variationApproved
                  ? req.body.variationApproved
                  : contract.variationApproved,
                extension: req.body.extension
                  ? req.body.extension
                  : contract.extension,

                contractStatus: req.body.contractStatus
                  ? req.body.contractStatus
                  : contract.contractStatus,
                status: req.body.status ? req.body.status : contract.status,
                deleted: req.body.deleted ? req.body.deleted : contract.deleted,
                // penalty: req.body.penalty,
                remarks: req.body.remarks ? req.body.remarks : contract.remarks,
                contractStatus_ApprValue: req.body.contractStatus_ApprValue
                  ? req.body.contractStatus_ApprValue
                  : contract.contractStatus_ApprValue,
                contractStatus_ApprStatus: req.body.contractStatus_ApprStatus
                  ? req.body.contractStatus_ApprStatus
                  : contract.contractStatus_ApprStatus,
                contractStatus_ApprSequence: req.body
                  .contractStatus_ApprSequence
                  ? req.body.contractStatus_ApprSequence
                  : contract.contractStatus_ApprSequence,
                endDate_ApprValue: req.body.endDate_ApprValue
                  ? req.body.endDate_ApprValue
                  : contract.endDate_ApprValue,
                endDate_ApprStatus: req.body.endDate_ApprStatus
                  ? req.body.endDate_ApprStatus
                  : contract.endDate_ApprStatus,
                endDate_ApprSequence: req.body.endDate_ApprSequence
                  ? req.body.endDate_ApprSequence
                  : contract.endDate_ApprSequence,
                contractStatus_LastUpdated: req.body.contractStatus_LastUpdated
                  ? req.body.contractStatus_LastUpdated
                  : contract.contractStatus_LastUpdated,
                endDate_LastUpdated: req.body.endDate_LastUpdated
                  ? req.body.endDate_LastUpdated
                  : contract.endDate_LastUpdated,

                isRetentionApplicable: req.body.isRetentionApplicable,
                updatedDate: new Date().setHours(0, 0, 0, 0),
                updatedBy: req.user._id,
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
                  loghistory(
                    req.user._id,
                    "Contract Updated",
                    "Update",
                    "contracts",
                    "contract edit",
                    req.get("referer"),
                    contract,
                    result
                  );

                  if (
                    //Contract Status
                    req.body.contractStatus_ApprStatus &&
                    req.body.contractStatus_ApprStatus ==
                      "5e996a81c3f4c40045d3717b"
                  ) {
                    var applicationObj = {
                      contract: req.body.id,
                      contractName: req.body.contractName,
                      fromStatus: req.body.fromStatus,
                      toStatus: req.body.toStatus,
                    };

                    approvalHistory(
                      "5eb914cfc36ca02d64c82d66",
                      req.body.id,
                      req.body.approvalLevel ? req.body.approvalLevel : null,
                      "CS",
                      1,
                      applicationObj
                    );
                  } else if (
                    //contract extension
                    req.body.endDate_ApprStatus &&
                    req.body.endDate_ApprStatus == "5e996a81c3f4c40045d3717b"
                  ) {
                    var applicationObj = {
                      contract: req.body.id,
                      contractName: req.body.contractName,
                      fromEndDate: req.body.fromEndDate,
                      toEndDate: req.body.toEndDate,
                    };
                    approvalHistory(
                      "5eb915242117ee3c78840c73",
                      req.body.id,
                      req.body.approvalLevel ? req.body.approvalLevel : null,
                      "CE",
                      1,
                      applicationObj
                    );
                  }

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Contract updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Contract **/
      //console.log(req.body);
      var contractObj = {
        contractName: req.body.contractName,
        contractNumber: req.body.contractNumber,
        projectNumber: req.body.projectNumber,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        serviceProvider: req.body.serviceProvider,
        serviceProviderId: req.body.serviceProviderId,
        contractDetail: req.body.contractDetail,
        contractValue: req.body.contractValue,
        contractType: req.body.contractType,
        variationApproved:
          req.body.variationApproved === "" ? 0 : req.body.variationApproved,
        extension: req.body.extension,

        contractStatus: req.body.contractStatus,
        status: req.body.status,
        deleted: req.body.deleted,
        remarks: req.body.remarks,
        //  penalty: req.body.penalty,

        isRetentionApplicable: req.body.isRetentionApplicable,
        createdDate: new Date().setHours(0, 0, 0, 0),
        createdBy: req.user._id,
      };
      var newContract = new Contracts(contractObj);
      newContract.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "contract Name already exist!, plz try with another.",
            });
          } else {
            if (err.errors && err.errors.contractName)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.contractName.message,
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
        var result = JSON.parse(JSON.stringify(newContract));

        loghistory(
          req.user._id,
          "Contract Add",
          "Add",
          "contracts",
          "Add contract",
          req.get("referer"),
          null,
          result
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Contract added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Contract ADD/UPDATE API ************************* */

/************Start Contract List API ************************* */
/**
 * @swagger
 * /api/contractlist:
 *   get:
 *     tags:
 *       - Add / Update, List Contract
 *     description: Returns a Contract list according to params
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: contractName
 *         in:  query
 *         type: string
 *       - name: startDate
 *         in:  query
 *         type: string
 *       - name: endDate
 *         in:  query
 *         type: string
 *     responses:
 *       200:
 *         description: Array list of cnds
 *         schema:
 *          type: object
 *          properties:
 *           status:
 *            type: string
 *           totalRecCount:
 *            type: integer
 *           result:
 *            type: array
 *            items:
 *             $ref: '#/definitions/Contract'
 *
 *
 */
/************* Contracts LIST API****************/
router.get("/api/contractlist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.contractName) {
    dbquery.contractName = req.query.contractName;
  }
  if (req.query.contractId) {
    dbquery._id = req.query.contractId;
  }
  if (req.query.contractType && req.query.contractType !== "undefined") {
    dbquery.contractType = req.query.contractType;
  }

  if (req.query.contractStatus && req.query.contractStatus !== "undefined") {
    dbquery.contractStatus = req.query.contractStatus;
  }

  if (req.query.startDate && req.query.startDate !== "") {
    dbquery.startDate = { $gte: req.query.startDate };
  }

  if (req.query.endDate && req.query.endDate !== "") {
    dbquery.endDate = { $lte: req.query.endDate };
  }

  if (req.query.hasVariation && req.query.hasVariation !== "") {
    if (req.query.hasVariation === "Yes")
      dbquery.variationApproved = { $gt: 0 };
    else dbquery.variationApproved = { $eq: 0 };
  }

  // console.log("dbquery contract list : ", dbquery);
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
  Contracts.find({
    $and: [
      { status: 1 }, //active contracts//not deleted, 0 means deleted
      dbquery,
      {
        $or: [
          { contractName: { $regex: dbquery_search, $options: "i" } },
          { contractNumber: { $regex: dbquery_search, $options: "i" } },
          { projectNumber: { $regex: dbquery_search, $options: "i" } },
          { serviceProvider: { $regex: dbquery_search, $options: "i" } },
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
      Contracts.find(
        {
          $and: [
            { status: 1 }, //active contracts//not deleted, 0 means deleted
            dbquery,
            {
              $or: [
                { contractName: { $regex: dbquery_search, $options: "i" } },
                { contractNumber: { $regex: dbquery_search, $options: "i" } },
                { projectNumber: { $regex: dbquery_search, $options: "i" } },
                { serviceProvider: { $regex: dbquery_search, $options: "i" } },
              ],
            },
          ],
        },
        {}
      )
        .populate({
          path: "contractType",
          model: "cnds",
          select: "_id cndName cndGroup",
        })
        .populate({
          path: "contractStatus",
          model: "cnds",
          select: "_id cndName cndGroup",
        })
        .populate({
          path: "contractStatus_ApprStatus",
          model: "cnds",
          select: "_id cndName cndGroup",
        })
        .populate({
          path: "endDate_ApprStatus",
          model: "cnds",
          select: "_id cndName cndGroup",
        })
        .populate({
          path: "serviceProviderId",
          model: "contract_serviceproviders",
          select: "_id serviceProviderFirmName",
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
            var results = [];

            //    var totalPages = Math.ceil(totalCount / size)
            //console.log("cndInfo : ", cndInfo[0]);
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

router.delete("/api/deletecontract", auth, async (req, res) => {
  const oldData = await Contracts.findById(req.query.id);

  const contract = await Contracts.findByIdAndUpdate(req.query.id, {
    deletedDate: new Date().setHours(0, 0, 0, 0),
    status: 0,
    deletedBy: req.user._id,
  });

  if (!contract) return res.status(400).send("Record not found");

  loghistory(
    req.user._id,
    "Contract Deleted",
    "Delete",
    "Contracts",
    "Delete Contract",
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
