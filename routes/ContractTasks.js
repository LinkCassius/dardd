var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Tasks = require("../models/ContractTasks");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/************Start task ADD/UPDATE API ************************* */
router.post("/api/task", auth, async function (req, res) {
  if (!req.body.taskName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter taskName.",
    });
  } else {
    if (req.body.id) {
      Tasks.findOne(
        {
          _id: req.body.id,
        },
        function (err, task) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!task) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Tasks with given id not exists!",
            });
          } else {
            Tasks.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                contract: req.body.contract ? req.body.contract : task.contract,
                taskName: req.body.taskName ? req.body.taskName : task.taskName,
                personResponsible: req.body.personResponsible
                  ? req.body.personResponsible
                  : task.personResponsible,
                taskTargetDate: req.body.taskTargetDate
                  ? req.body.taskTargetDate
                  : task.taskTargetDate,
                taskStatus: req.body.taskStatus
                  ? req.body.taskStatus
                  : task.taskStatus,
                supportingDoc: req.body.supportingDoc
                  ? req.body.supportingDoc
                  : task.supportingDoc,
                read: req.body.read ? req.body.read : task.read,
                remarks: req.body.remarks ? req.body.remarks : task.remarks,
                status: req.body.status ? req.body.status : task.status,
                deleted: req.body.deleted ? req.body.deleted : task.deleted,
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
                      "Contract Task Update",
                      "Update",
                      "contract_tasks",
                      "Update Contract Task",
                      req.get("referer"),
                      task,
                      result
                    );

                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Task updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Task **/
      var taskObj = {
        contract: req.body.contract,
        taskName: req.body.taskName,
        personResponsible: req.body.personResponsible,
        taskTargetDate: req.body.taskTargetDate,

        status: req.body.status,
        deleted: req.body.deleted,
      };
      var newTask = new Tasks(taskObj);
      newTask.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Task Name already exist!, plz try with another.",
            });
          } else {
            if (err.errors && err.errors.taskName)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.taskName.message,
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
            "Contract Task Add",
            "Add",
            "contract_tasks",
            "Add Task",
            req.get("referer"),
            null,
            result
          );
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Task added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Task ADD/UPDATE API ************************* */

/************Start Task List API ************************* */

/************* Contracts LIST API****************/
router.get("/api/tasklist/:contractId?", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.params.contractId) dbquery.contract = req.params.contractId;

  if (req.query.taskName) {
    dbquery.taskName = req.query.taskName;
  }

  if (req.query.personResponsible) {
    dbquery.personResponsible = req.query.personResponsible;
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
  Tasks.find({
    $and: [
      dbquery,
      {
        $or: [{ taskName: { $regex: dbquery_search, $options: "i" } }],
      },
    ],
  })
    .countDocuments()
    .exec(function (err, totalCount) {
      // console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      Tasks.find(
        {
          $and: [
            dbquery,
            {
              $or: [{ taskName: { $regex: dbquery_search, $options: "i" } }],
            },
          ],
        },
        {}
      )
        .populate({
          path: "personResponsible",
          model: "users",
        })
        .populate({
          path: "taskStatus",
          model: "cnds",
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
router.get("/api/taskbyid/:taskId", auth, function (req, res) {
  Tasks.findById(req.params.taskId)
    .populate({
      path: "personResponsible",
      model: "users",
      select: "_id firstName lastName",
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
String.prototype.toObjectId = function () {
  var ObjectId = require("mongoose").Types.ObjectId;
  return new ObjectId(this.toString());
};

module.exports = router;
