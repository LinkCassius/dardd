var mongoose = require("mongoose");
var express = require("express");

var router = express.Router();
var ContractDocuments = require("../models/ContractDocuments");
var Contracts = require("../models/Contracts");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/************Start Cnd ADD/UPDATE API ************************* */

router.post("/api/contract_document", auth, async function (req, res) {
  if (req.body.taskId === "") req.body.taskId = null;
  if (req.body.milestoneId === "") req.body.milestoneId = null;
  if (req.body.variationId === "") req.body.variationId = null;
  if (req.body.paymentId === "") req.body.paymentId = null;
  if (req.body.parent === "") req.body.parent = null;

  if (!req.body.name) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter name.",
    });
  } else {
    if (req.body.id) {
      /** Update CND **/
      ContractDocuments.findOne(
        {
          _id: req.body.id,
        },
        function (err, contractDocument) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!contractDocument) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Document with given id not exists!",
            });
          } else {
            ContractDocuments.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                name: req.body.name ? req.body.name : contractDocument.name,
                docCollection: req.body.docCollection
                  ? req.body.docCollection
                  : contractDocument.docCollection,
                isFolder: req.body.isFolder
                  ? req.body.isFolder
                  : contractDocument.isFolder,
                uploadDate: req.body.uploadDate
                  ? req.body.uploadDate
                  : contractDocument.uploadDate,

                parent: req.body.parent
                  ? req.body.parent
                  : contractDocument.parent,
                refId: req.body.refId ? req.body.refId : contractDocument.refId,
                refType: req.body.refType
                  ? req.body.refType
                  : contractDocument.refType,
                taskId: req.body.taskId
                  ? req.body.taskId
                  : contractDocument.taskId,
                variationId: req.body.variationId
                  ? req.body.variationId
                  : contractDocument.variationId,
                milestoneId: req.body.milestoneId
                  ? req.body.milestoneId
                  : contractDocument.milestoneId,
                paymentId: req.body.paymentId
                  ? req.body.paymentId
                  : contractDocument.paymentId,
                status: req.body.status
                  ? req.body.status
                  : contractDocument.status,
                deleted: req.body.deleted
                  ? req.body.deleted
                  : contractDocument.deleted,
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
                      "Contract Document Update",
                      "Update",
                      "contract_documents",
                      "Update Contract Document",
                      req.get("referer"),
                      contractDocument,
                      result
                    );

                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Document Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Contract Document **/
      var contractDocumentObj = {
        contractId: req.body.contractId,
        name: req.body.name,
        docCollection: req.body.docCollection,
        isFolder: req.body.isFolder,
        uploadDate: req.body.uploadDate,
        parent: req.body.parent,
        refId: req.body.refId,
        refType: req.body.refType,
        taskId: req.body.taskId,
        variationId: req.body.variationId,
        milestoneId: req.body.milestoneId,
        paymentId: req.body.paymentId,
        status: req.body.status,
        deleted: req.body.deleted,
      };
      var newContractDocument = new ContractDocuments(contractDocumentObj);
      newContractDocument.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Document already exist!, plz try with another.",
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
        var result = JSON.parse(JSON.stringify(newContractDocument));
        if (req.user._id)
          loghistory(
            req.user._id,
            "Contract Document Add",
            "Add",
            "contract_documents",
            "Add Document",
            req.get("referer"),
            null,
            result
          );
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Document added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Contract Document ADD/UPDATE API ************************* */

/************Start Contract Document List API ************************* */

/************* Contract Documents LIST API****************/
router.get(
  "/api/contract_document_list/:contractId/:parentId?",
  auth,
  function (req, res) {
    /*********Search Query build ************/

    var dbquery = {};
    if (req.query.refId) {
      // console.log("query string: x : ENETERED ====>>> : ", req.query.refId);
      dbquery.refId = req.query.refId;
      dbquery.refType = req.query.refType;
    }

    dbquery.contractId = req.params.contractId;

    if (
      req.params.parentId &&
      req.params.parentId != null &&
      req.params.parentId != ""
    ) {
      //  console.log("parent Id: x: ", req.params.parentId);
      dbquery.parent = req.params.parentId;
    } else {
      dbquery.parent = null;
    }

    if (req.query.name) {
      dbquery.name = req.query.name;
    }

    if (req.query.status) {
      dbquery.status = req.query.status;
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
    ContractDocuments.find({
      $and: [
        dbquery,
        {
          $or: [{ name: { $regex: dbquery_search, $options: "i" } }],
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
        ContractDocuments.find(
          {
            $and: [
              dbquery,
              {
                $or: [{ name: { $regex: dbquery_search, $options: "i" } }],
              },
            ],
          },
          {}
        )
          .sort({ [sort_field]: sort_mode })
          .skip(query.skip)
          .limit(query.limit)
          .exec(async function (err, cndInfo) {
            if (err) {
              res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Error fetching data",
                result: "error",
              });
            } else {
              let contractObj = await Contracts.findById(req.params.contractId);

              res.status(200).json({
                success: true,
                responseCode: 200,
                result: cndInfo,
                contractName: contractObj.contractName,

                totalRecCount: totalCount,
                msg: "List fetching successfully",
              });
            }
          });
      });
  }
);
/************End Contracts Documents List API ************************* */

/************* Get Single User API****************/
router.get("/api/documentbyid/:documentId", auth, function (req, res) {
  ContractDocuments.findById(req.params.documentId).exec(function (
    err,
    cndInfo
  ) {
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
