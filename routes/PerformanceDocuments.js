var mongoose = require("mongoose");
var express = require("express");

var router = express.Router();
var PerformanceDocuments = require("../models/PerformanceDocuments");
const loghistory = require("./userhistory");
var PerformanceMng = require("../models/PerformanceMng");
const auth = require("../middleware/auth");
/************Start Cnd ADD/UPDATE API ************************* */

router.post("/api/performance_document", auth, async function (req, res) {
  if (req.body.performanceId === "") req.body.performanceId = null;

  if (req.body.id) {
    /** Update CND **/
    PerformanceDocuments.findOne(
      {
        _id: req.body.id,
      },
      function (err, perforDocument) {
        if (err) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Internal Server Error.",
          });
        }
        if (!perforDocument) {
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Document with given id not exists!",
          });
        } else {
          PerformanceDocuments.findOneAndUpdate(
            {
              _id: req.body.id,
            },
            {
              name: req.body.name ? req.body.name : perforDocument.name,
              fileName: req.body.fileName
                ? req.body.fileName
                : perforDocument.fileName,
              uploadDate: req.body.uploadDate
                ? req.body.uploadDate
                : perforDocument.uploadDate,
              performanceId: req.body.performanceId
                ? req.body.performanceId
                : perforDocument.performanceId,
              deleted: req.body.deleted
                ? req.body.deleted
                : perforDocument.deleted,
              apUser1HasDownload: req.body.apUser1HasDownload
                ? req.body.apUser1HasDownload
                : perforDocument.apUser1HasDownload,
              apUser2HasDownload: req.body.apUser2HasDownload
                ? req.body.apUser2HasDownload
                : perforDocument.apUser2HasDownload,
              apUser3HasDownload: req.body.apUser3HasDownload
                ? req.body.apUser3HasDownload
                : perforDocument.apUser3HasDownload,
              updatedBy: req.user._id,
              updatedDate: new Date().setHours(0, 0, 0, 0),
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
                //27-May-20201 update performancemng table if all the documents are downloaded by approver.
                let currentApprover = req.body.currentApprover
                  ? req.body.currentApprover
                  : "";

                if (currentApprover == "approverUser1") {
                  //check perf doc table if any record with download as false
                  let checkAp1 = await PerformanceDocuments.find(
                    {
                      performanceId: req.body.performanceId,
                      apUser1HasDownload: false,
                    },
                    { _id: 1 }
                  );

                  if (checkAp1.length === 0) {
                    //update perf mng table as all the records are downloaded
                    await PerformanceMng.findOneAndUpdate(
                      {
                        _id: req.body.performanceId,
                      },
                      {
                        apUser1HasDownload: true,
                      },
                      { new: true },
                      function (err, result) {
                        if (err) {
                        } else {
                        }
                      }
                    );
                  }
                } else if (currentApprover == "approverUser2") {
                  //check perf doc table if any record with download as false
                  let checkAp2 = await PerformanceDocuments.find(
                    {
                      performanceId: req.body.performanceId,
                      apUser2HasDownload: false,
                    },
                    { _id: 1 }
                  );

                  if (checkAp2.length === 0) {
                    //update perf mng table as all the records are downloaded
                    await PerformanceMng.findOneAndUpdate(
                      {
                        _id: req.body.performanceId,
                      },
                      {
                        apUser2HasDownload: true,
                      },
                      { new: true },
                      function (err, result) {
                        if (err) {
                        } else {
                        }
                      }
                    );
                  }
                } else if (currentApprover == "approverUser3") {
                  //check perf doc table if any record with download as false
                  let checkAp3 = await PerformanceDocuments.find(
                    {
                      performanceId: req.body.performanceId,
                      apUser3HasDownload: false,
                    },
                    { _id: 1 }
                  );

                  if (checkAp3.length === 0) {
                    //update perf mng table as all the records are downloaded
                    await PerformanceMng.findOneAndUpdate(
                      {
                        _id: req.body.performanceId,
                      },
                      {
                        apUser3HasDownload: true,
                      },
                      { new: true },
                      function (err, result) {
                        if (err) {
                        } else {
                        }
                      }
                    );
                  }
                }

                var result = JSON.parse(JSON.stringify(result));

                if (req.user._id)
                  loghistory(
                    req.user._id,
                    "Performance Document Update",
                    "Update",
                    "performance_documents",
                    "Update Performance Document",
                    req.get("referer"),
                    perforDocument,
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
    var perforDocumentObj = {
      performanceId: req.body.performanceId,
      name: req.body.name,
      fileName: req.body.fileName,
      uploadDate: req.body.uploadDate,
      deleted: req.body.deleted,
      createdBy: req.user._id,
      createdDate: new Date().setHours(0, 0, 0, 0),
    };
    var newPerforDocument = new PerformanceDocuments(perforDocumentObj);
    newPerforDocument.save(async function (err) {
      //console.log("errors", err);
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

      //check if all MOV (Means of Verification) are available
      let movs = req.body.movArray ? req.body.movArray : [];

      let checkCount = 0;
      for (let i = 0; i < movs.length; i++) {
        let checkMov = await PerformanceDocuments.find(
          { performanceId: req.body.performanceId, name: movs[i] },
          { name: 1, _id: 0 }
        );

        if (checkMov.length > 0) {
          checkCount++;
        }
      }

      //if all MOV (Means of Verification) are available, update performancemng hasdocuments to true
      if (checkCount !== 0 && movs.length === checkCount) {
        await PerformanceMng.findOneAndUpdate(
          {
            _id: req.body.performanceId,
          },
          {
            hasDocuments: true,
          },
          { new: true },
          function (err, result) {
            if (err) {
            } else {
            }
          }
        );
      }

      //also if any document added make sure approvers' has download to false in performancemng table
      await PerformanceMng.findOneAndUpdate(
        {
          _id: req.body.performanceId,
        },
        {
          apUser1HasDownload: false,
          apUser2HasDownload: false,
          apUser3HasDownload: false,
        },
        { new: true },
        function (err, result) {
          if (err) {
          } else {
          }
        }
      );

      var result = JSON.parse(JSON.stringify(newPerforDocument));
      if (req.user._id)
        loghistory(
          req.user._id,
          "Performance Document Add",
          "Add",
          "performance_documents",
          "Add Document",
          req.get("referer"),
          null,
          result
        );
      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "Performance added successfully.",
        result: result,
      });
    });
  }
});

/************End Contract Document ADD/UPDATE API ************************* */

/************Start Contract Document List API ************************* */

/************* Contract Documents LIST API****************/
router.get("/api/performance_document_list", auth, function (req, res) {
  /*********Search Query build ************/

  var dbquery = {};

  //console.log("perf" + req.query.perfid);
  dbquery.performanceId = req.query.perfid;

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
  PerformanceDocuments.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      //console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      PerformanceDocuments.find(dbquery, {})
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, docInfo) {
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
              result: docInfo,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});
/************End Contracts Documents List API ************************* */

/************* Get Single User API****************/
router.get("/api/perDocumentById", auth, function (req, res) {
  const _id = req.query.id;
  PerformanceDocuments.findById(_id).exec(function (err, docInfo) {
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
        result: docInfo,
        msg: "List fetching successfully",
      });
    }
  });
});
/************End Get Single User API ************************* */

//delete contract document
router.delete("/api/delete_perfdocument", auth, async (req, res) => {
  //first check if perf id is submit or approved, if so don't allow to delete

  //** get perf id */
  const obj = await PerformanceDocuments.findById(req.query.id);
  //console.log("doc obj : ", obj);

  if (!obj)
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "The document with the given ID was not found.",
    });

  const getCount_submitapprove = await PerformanceMng.countDocuments({
    _id: obj.performanceId,
    status: { $in: ["submit", "approved"] },
  });

  //console.log("getCount_submitapprove : ", getCount_submitapprove);

  if (getCount_submitapprove != 0) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Cannot delete, indicator already submitted",
    });
  }

  const perfDocObj = await PerformanceDocuments.findByIdAndRemove(req.query.id);

  if (!perfDocObj)
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "The document with the given ID was not found.",
    });

  //update performance table - hasDocuments field to false if all docs are deleted for that perfId
  //console.log("perf obj : ", perfDocObj);
  const getCount = await PerformanceDocuments.countDocuments({
    performanceId: perfDocObj.performanceId,
  });
  //console.log("perf getCount : ", getCount);

  if (getCount == 0) {
    await PerformanceMng.findByIdAndUpdate(perfDocObj.performanceId, {
      hasDocuments: false,
    });
  }
  // //
  loghistory(
    req.user._id,
    "PMS doc Deleted",
    "Delete",
    "PMS Documents",
    "Delete PMS doc",
    req.get("referer"),
    perfDocObj,
    null
  );
  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Document deleted sucessfully.",
    perfDocObj,
  });
});

module.exports = router;
