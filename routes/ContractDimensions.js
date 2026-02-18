var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ContractDimensions = require("../models/ContractDimensions");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/************Start task ADD/UPDATE API ************************* */
router.post("/api/contract_dimension", auth, async function (req, res) {
  if (!req.body.dimension) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter subprogramme.",
    });
  } else {
   
    if (req.body.id) {
      var userData = await ContractDimensions.findOne({
        dimension: req.body.dimension,
        contract: req.body.contract,
        _id: { $ne: req.body.id },
      });

      if (userData) {
        res.status(400).json({
          success: false,
          msg: "subprogramme is already available, please choose another one",
        });
      } else {
        ContractDimensions.findOne(
          {
            _id: req.body.id,
          },
          function (err, contractDimension) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            if (!contractDimension) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Dimension with given id not exists!",
              });
            } else {
              ContractDimensions.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                {
                  contract: req.body.contract
                    ? req.body.contract
                    : contractDimension.contract,
                  dimension: req.body.dimension
                    ? req.body.dimension
                    : contractDimension.dimension,
                  status: req.body.status
                    ? req.body.status
                    : contractDimension.status,
                  deleted: req.body.deleted
                    ? req.body.deleted
                    : contractDimension.deleted,
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
                        "Contract programme Update",
                        "Update",
                        "contract_programmes",
                        "Update Contract programme",
                        req.get("referer"),
                        contractDimension,
                        result
                      );

                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: "Programme Updated sucessfully.",
                      result,
                    });
                  }
                }
              );
            }
          }
        );
      }
    } else {
      var userData = await ContractDimensions.findOne({
        dimension: req.body.dimension,
        contract: req.body.contract,
      });
      if (userData) {
        res.status(400).json({
          success: false,
          msg: "Subprogramme is already available, please choose another one",
        });
      } else {
        /** ADD Task **/
        var varObj = {
          contract: req.body.contract,
          dimension: req.body.dimension,
          status: req.body.status,
          deleted: req.body.deleted,
        };
        var newTask = new ContractDimensions(varObj);
        newTask.save(function (err) {
          console.log("errors", err);
          if (err) {
            if (
              (err.name === "BulkWriteError" || err.name === "MongoError") &&
              err.code === 11000
            ) {
              return res.status(400).json({
                success: false,
                msg: "Programme already exist!, plz try with another.",
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
              "Contract Programme Add",
              "Add",
              "contract_Programmes",
              "Add Contract Programme",
              req.get("referer"),
              null,
              result
            );
          res.status(200).json({
            success: true,
            responseCode: 200,
            msg: "Programme added successfully.",
            result: result,
          });
        });
      }
    }
  }
});

/************End Task ADD/UPDATE API ************************* */

/************Start Task List API ************************* */

/************* Contracts LIST API****************/
router.get("/api/contract_dimension_list/:contractId", auth, function (
  req,
  res
) {
  /*********Search Query build ************/
  var dbquery = {};
  dbquery.contract = req.params.contractId;
  if (req.query.dimension) {
    dbquery.dimension = req.query.dimension;
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
  ContractDimensions.find(dbquery)
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
      ContractDimensions.find(dbquery, {})
        .populate({
          path: "contract",
          model: "contracts",
        })
        .populate({
          path: "dimension",
          model: "programs",
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
/************End Tasks List API ************************* */

/************* Get Single User API****************/
router.get("/api/dimensionbyid/:dimensionId", auth, function (req, res) {
  ContractDimensions.findById(req.params.dimensionId)
    .populate({
      path: "dimension",
      model: "programs",
    })
    .exec(function (err, cndInfo) {
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
/************End Get Single User API ************************* */

module.exports = router;
