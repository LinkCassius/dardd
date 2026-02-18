var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var moment = require("moment");
var Programs = require("../models/Programs");
var IndicatorTitles = require("../models/IndicatorsTitle");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

/************Start Cnd ADD/UPDATE API ************************* */
router.post("/api/program", auth, async function (req, res) {
  if (!req.body.cndName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Name.",
    });
  } else if (!req.body.cndCode) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Programme/SubProgramme.",
    });
  } else {
    if (req.body.parent === "") req.body.parent = null;
    if (req.body.id) {
      var userData = await Programs.findOne({
        cndCode: req.body.cndCode,
        _id: { $ne: req.body.id },
      });
      if (userData) {
        res.status(400).json({
          success: false,
          msg: "Name - '" + req.body.cndCode + "' is already available.",
        });
      } else {
        /** Update CND **/
        Programs.findOne(
          {
            _id: req.body.id,
          },
          function (err, cnd) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            if (!cnd) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Programme with given id not exists!",
              });
            } else {
              Programs.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                {
                  cndName: req.body.cndName,
                  cndCode: req.body.cndCode,
                  cndGroup: req.body.cndGroup,
                  desc: req.body.desc ? req.body.desc : cnd.desc,
                  status: req.body.status ? req.body.status : cnd.status,
                  priority: req.body.priority
                    ? req.body.priority
                    : cnd.priority,
                  parent: req.body.parent ? req.body.parent : cnd.parent,
                  deleted: req.body.deleted ? req.body.deleted : cnd.deleted,
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
                    if (req.user._id)
                    await loghistory(
                        req.user._id,
                        "Pragramme Update",
                        "Update",
                        "Programmes",
                        "Update Pragramme",
                        req.get("referer"),
                        cnd,
                        result
                      );

                      // If the updated program is a parent
                if (!cnd.parent) {
                  await IndicatorTitles.updateMany(
                    { programme: req.body.id },
                    { $set: { programmeName: req.body.cndCode } }
                  );
                }

                // Always update subProgrammeName where applicable
                await IndicatorTitles.updateMany(
                  { subProgramme: req.body.id },
                  { $set: { subProgrammeName: req.body.cndCode } }
                );

                    var result = JSON.parse(JSON.stringify(result));
                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: req.body.cndName + " updated successfully.",
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
      /** ADD CND **/
      var cndObj = {
        cndName: req.body.cndName,
        cndCode: req.body.cndCode,
        cndGroup: req.body.cndGroup,
        desc: req.body.desc,
        status: req.body.status,
        priority: req.body.priority,
        parent: req.body.parent,
        deleted: req.body.deleted,
      };
      var newCnd = new Programs(cndObj);
      newCnd.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Programme already available!, please try with another.",
            });
          } else {
            if (err.errors && err.errors.cndCode)
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: err.errors.cndCode.message,
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
        var result = JSON.parse(JSON.stringify(newCnd));

        if (req.user._id)
          loghistory(
            req.user._id,
            "Programme Add",
            "Add",
            "Programme",
            "Add Programme",
            req.get("referer"),
            null,
            result
          );
        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: req.body.cndName + " added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Cnd ADD/UPDATE API ************************* */

/************Start Cnd List API ************************* */

/************* Cnds LIST API****************/
router.get("/api/programlist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.cndGroup) {
    dbquery.cndGroup = req.query.cndGroup;
  }
  if (req.query.cndName) {
    dbquery.cndName = req.query.cndName;
  }
  if (req.query.parent) {
    dbquery.parent = req.query.parent;
  }

  var dbquery_search = "";
  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  var sort_field = "priority";
  var sort_mode = 1;

  if (req.query.sort_field) {
    sort_field = req.query.sort_field;
  }

  if (req.query.sort_mode) {
    var var_sort_mode = req.query.sort_mode;
    if (var_sort_mode == "ascend") {
      sort_mode = 1;
    } else {
      sort_mode = -1;
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
  Programs.find({
    $and: [
      dbquery,
      {
        $or: [
          { cndName: { $regex: dbquery_search, $options: "i" } },
          { cndCode: { $regex: dbquery_search, $options: "i" } },
          { cndGroup: { $regex: dbquery_search, $options: "i" } },
        ],
      },
      { status: { $ne: "Deleted" } },
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
      Programs.find(
        {
          $and: [
            dbquery,
            {
              $or: [
                { cndName: { $regex: dbquery_search, $options: "i" } },
                { cndCode: { $regex: dbquery_search, $options: "i" } },
                { cndGroup: { $regex: dbquery_search, $options: "i" } },
              ],
            },
            { status: { $ne: "Deleted" } },
          ],
        },
        {}
      )
        .populate({
          path: "parent",
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
/************End Cnd List API ************************* */

/************* Get Single cnd API****************/
router.get("/api/programlist/:id", auth, function (req, res) {
  Programs.findById(req.params.id).exec(function (err, cndInfo) {
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
/************End Get Single cnd API ************************* */

router.get("/api/getprograms", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  dbquery.cndGroup = "Dimension";
  dbquery.status = { $ne: "Deleted" };
  // Find some documents
  Programs.find(dbquery)
    .select({ children: 1, parent: 1, cndCode: 1, cndName: 1, _id: 1 })
    .sort({ ["priority"]: 1 })
    .exec(function (err, cndInfo) {
      if (err) {
        console.log(err);
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      } else {
        const objectresult1 = list_to_tree(cndInfo);
        res.status(200).json({
          success: true,
          responseCode: 200,
          result: objectresult1,
          msg: "List fetching successfully",
        });
      }
    });
});

function list_to_tree(list) {
  var map = {},
    node,
    roots = [],
    i;
  for (i = 0; i < list.length; i += 1) {
    map[list[i]._id] = i; // initialize the map
    list[i].children = []; // initialize the children
  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    node.checked = "";
    node.expanded = "";
    node.label = list[i].cndName + ": " + list[i].cndCode;
    if (node.parent !== null) {
      // if you have dangling branches check that map[node.parentId] exists
      list[map[node.parent]].children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

router.delete("/api/DeleteProgram", auth, async (req, res) => {

  // Check if the program or sub-program is referenced in the indicatortitles table
  const indicatorTitleReference = await IndicatorTitles.findOne({
    $or: [
      { programme: req.query.id },       // Check if it's used as programme
      { subProgramme: req.query.id }     // Check if it's used as subProgramme
    ],
    status: { $ne: "Deleted" }  
  });

  // If there's a reference, prevent the deletion
  if (indicatorTitleReference) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Cannot delete. The Programme/SubProgramme is referenced in indicatortitles.",
    });
  }

    // Check if the program has any dependent subprograms
    const dependentSubprograms = await Programs.findOne(
      { 
        parent: req.query.id,
        status: { $ne: "Deleted" } 
      } );
  
    // If there are dependent subprograms, prevent deletion of the parent program
    if (dependentSubprograms) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Cannot delete. The parent program has dependent subprograms.",
      });
    }

  const program = await Programs.findByIdAndUpdate(req.query.id, {
    deleteddate: Date.now(),
    status: "Deleted",
  });

  if (!program)
    return res.status(400).send("Programme/SubProgramme is not found");
  const oldData = await Programs.findById(req.query.id);

  loghistory(
    req.user._id,
    "Programme Deleted",
    "Delete",
    "Programmes",
    "Delete Programme",
    req.get("referer"),
    oldData,
    null
  );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Programme/SubProgramme deleted sucessfully.",
    oldData,
  });
});

module.exports = router;
