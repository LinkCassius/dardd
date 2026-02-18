var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var IndicatorTitles = require("../models/IndicatorsTitle");
var Programs = require("../models/Programs");
var MoVs = require("../models/MeansOfVerification");
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
const func = require("joi/lib/types/func");
// /**
//  * @swagger
//  * /api/Indicatorst:
//  *   post:
//  *     tags:
//  *       - Add / Update, List Indicatorst
//  *     description: Returns a object of Indicatorst
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: IndicatorstName
//  *         description: name of Indicatorst
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: startDate
//  *         description: start Date of Indicatorst
//  *         in: formData
//  *         required: true
//  *         type: number
//  *       - name: endDate
//  *         description: end Date of Indicatorst
//  *         in: formData
//  *         required: true
//  *         type: number
//  *       - name: serviceProvider
//  *         description: name of service provider
//  *         in: formData
//  *         type: string
//  *       - name: IndicatorstDetail
//  *         description: details of Indicatorst
//  *         in: formData
//  *         type: string
//  *       - name: file
//  *         description: url of file attached with  Indicatorst
//  *         in: formData
//  *         type: string
//  *       - name: status
//  *         description: description of cnd
//  *         in: formData
//  *         type: number
//  *     responses:
//  *       200:
//  *         description: An Object of Indicatorst
//  *         schema:
//  *            $ref: '#/definitions/Indicatorst'
//  */

/************Start Indicatorst ADD/UPDATE API ************************* */
router.post("/api/IndicatorTitles", auth, async function (req, res) {
  // console.log(req.body);
  if (!req.body.indicatorTitle) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Indicator Title.",
    });
  } else if (!req.body.subProgramme) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please select Sub-Programme.",
    });
  } else {
    if (req.body.id) {
      /** Update CND **/
      IndicatorTitles.findOne(
        {
          _id: req.body.id,
        },
        function (err, IndicatorObj) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!IndicatorObj) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "indicator with given id not exists!",
            });
          } else {
            IndicatorTitles.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                indicatorTitle: req.body.indicatorTitle
                  ? req.body.indicatorTitle.trim()
                  : IndicatorObj.indicatorTitle,
                // dimensions: req.body.dimensions
                //   ? req.body.dimensions
                //   : IndicatorObj.dimensions,
                // programNames: req.body.programNames
                //   ? req.body.programNames
                //   : IndicatorObj.programNames,

                dimensions: [
                  req.body.subProgramme
                    ? req.body.subProgramme
                    : IndicatorObj.subProgramme,
                  req.body.programme
                    ? req.body.programme
                    : IndicatorObj.programme,
                ],
                programme: req.body.programme
                  ? req.body.programme
                  : IndicatorObj.programme,
                programmeNo: req.body.programmeNo
                  ? req.body.programmeNo
                  : IndicatorObj.programmeNo,
                programmeName: req.body.programmeName
                  ? req.body.programmeName
                  : IndicatorObj.programmeName,
                subProgramme: req.body.subProgramme
                  ? req.body.subProgramme
                  : IndicatorObj.subProgramme,

                subProgrammeNo: req.body.subProgrammeNo
                  ? req.body.subProgrammeNo
                  : IndicatorObj.subProgrammeNo,

                subProgrammeName: req.body.subProgrammeName
                  ? req.body.subProgrammeName
                  : IndicatorObj.subProgrammeName,

                outcome: req.body.outcome
                  ? req.body.outcome
                  : IndicatorObj.outcome,
                outputs: req.body.outputs
                  ? req.body.outputs
                  : IndicatorObj.outputs,
                movArray: req.body.movArray
                  ? req.body.movArray
                  : IndicatorObj.movArray,

                updatedDate: new Date().getTime(),
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
                    "Indicator Updated",
                    "Update",
                    "Indicator Title",
                    "Indicator Title edit",
                    req.get("referer"),
                    IndicatorObj,
                    result
                  );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Indicator Title Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Indicatorst **/

      var indicatorObj = {
        indicatorTitle: req.body.indicatorTitle.trim(),
        // dimensions: req.body.dimensions,
        // programNames: req.body.programNames,

        dimensions: [req.body.subProgramme, req.body.programme],
        programme: req.body.programme,
        programmeNo: req.body.programmeNo,
        programmeName: req.body.programmeName,
        subProgramme: req.body.subProgramme,
        subProgrammeNo: req.body.subProgrammeNo,
        subProgrammeName: req.body.subProgrammeName,
        outcome: req.body.outcome,
        outputs: req.body.outputs,
        movArray: req.body.movArray,

        createdDate: new Date().getTime(),
      };
      var newIndicatore = new IndicatorTitles(indicatorObj);
      newIndicatore.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "indicator Name already exist!, please try with another.",
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
        var result = JSON.parse(JSON.stringify(indicatorObj));

        loghistory(
          req.user._id,
          "Indicator Title Added",
          "Add",
          "Indicator Titles",
          "Add Indicator Title",
          req.get("referer"),
          null,
          result
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Indicator Title added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Indicatorst ADD/UPDATE API ************************* */

/************Start Indicatorst List API ************************* */
// /**
//  * @swagger
//  * /api/Indicatorstlist:
//  *   get:
//  *     tags:
//  *       - Add / Update, List Indicatorst
//  *     description: Returns a Indicatorst list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: IndicatorstName
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
//  *             $ref: '#/definitions/Indicatorst'
//  *
//  *
//  */
/************* Indicatorsts LIST API****************/

router.get("/api/IndicatorTitleslist", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.indicatorTitle) {
    dbquery.indicatorTitle = req.query.indicatorTitle;
  }
  if (req.query.indicatorId) {
    dbquery._id = req.query.indicatorId;
  }
  if (req.query.programNames) {
    dbquery.programNames = req.query.programNames;
  }
  if (req.query.dimensions) {
    var dimArr = req.query.dimensions.split(",");
    // console.log("dimensions: ", dimArr);

    dbquery.dimensions = { $in: dimArr };
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
  IndicatorTitles.find({
    $and: [
      { status: { $ne: "Deleted" } },
      dbquery,
      {
        $or: [
          { indicatorTitle: { $regex: dbquery_search + "", $options: "i" } },
          { programmeName: { $regex: dbquery_search + "", $options: "i" } },
          { subProgrammeName: { $regex: dbquery_search, $options: "i" } },
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
      IndicatorTitles.find({
        $and: [
          { status: { $ne: "Deleted" } },
          dbquery,
          {
            $or: [
              {
                indicatorTitle: { $regex: dbquery_search + "", $options: "i" },
              },
              { programmeName: { $regex: dbquery_search + "", $options: "i" } },
              { subProgrammeName: { $regex: dbquery_search, $options: "i" } },
            ],
          },
        ],
      })
        .sort({ programmeNo: 1 })
        .skip(query.skip)
        .limit(query.limit)
        .exec(async function (err, indicatorinfo) {
          if (err) {
            console.log("eer : ", err);
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
            });
          } else {
            // let finalResult = [];

            // for (let index = 0; index < indicatorinfo.length; index++) {
            //   let Obj = {};

            //   let progs = await Programs.find({
            //     _id: indicatorinfo[index].dimensions,
            //   });

            //   Obj.indicatorTitle = indicatorinfo[index].indicatorTitle;
            //   Obj.dimensions = indicatorinfo[index].dimensions;
            //   Obj._id = indicatorinfo[index]._id;
            //   Obj.programme = indicatorinfo[index].programme;
            //   Obj.subProgramme = indicatorinfo[index].subProgramme;
            //   Obj.programmeNo = indicatorinfo[index].programmeNo;
            //   Obj.subProgrammeNo = indicatorinfo[index].subProgrammeNo;
            //   Obj.programmeName = indicatorinfo[index].programmeName;
            //   Obj.subProgrammeName = indicatorinfo[index].subProgrammeName;
            //   Obj.outcome = indicatorinfo[index].outcome;
            //   Obj.outputs = indicatorinfo[index].outputs;
            //   Obj.movArray = indicatorinfo[index].movArray;
            //   let pArray = [];
            //   for (let pIndex = 0; pIndex < progs.length; pIndex++) {
            //     pArray.push(progs[pIndex].cndCode);
            //   }
            //   Obj.programNames = pArray;
            //   finalResult.push(Obj);
            // }

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
/************End Indicatorsts List API ************************* */

/***************Indicators DDL *******************/
router.get("/api/indicatorsddl", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.indicatorTitle) {
    dbquery.indicatorTitle = req.query.indicatorTitle;
  }
  if (req.query.indicatorId) {
    dbquery._id = req.query.indicatorId;
  }
  if (req.query.programNames) {
    dbquery.programNames = req.query.programNames;
  }
  if (req.query.dimensions) {
    var dimArr = req.query.dimensions.split(",");
    // console.log("dimensions: ", dimArr);

    dbquery.dimensions = { $in: dimArr };
  }
  var dbquery_search = "";
  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo ? req.query.pageNo : 1); //req.query.pageNo
  var size = parseInt(req.query.per_page ? req.query.per_page : 1000); //

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
  IndicatorTitles.find({
    $and: [
      dbquery,
      { indicatorTitle: { $regex: dbquery_search, $options: "i" } },
      { status: { $ne: "Deleted" } },
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
      IndicatorTitles.find({
        $and: [
          dbquery,
          { indicatorTitle: { $regex: dbquery_search, $options: "i" } },
          { status: { $ne: "Deleted" } },
        ],
      })
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(async function (err, indicatorinfo) {
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
              result: indicatorinfo,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});
/***************End of Indicators DDL ************/

router.delete("/api/DeleteIndicatorTitle", auth, async (req, res) => {
  const title = await IndicatorTitles.findByIdAndUpdate(req.query.id, {
    deleteddate: Date.now(),
    status: "Deleted",
  });

  if (!title) return res.status(400).send("Indicator Title is not found");
  const oldData = await IndicatorTitles.findById(req.query.id);
  //loghistory(req.params.userid, "Delete", "areas", null, oldData);
  loghistory(
    req.user._id,
    "Indicator Title Deleted",
    "Delete",
    "Indicator Titles",
    "Delete Indicator Title",
    req.get("referer"),
    oldData,
    null
  );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Indicator Title deleted sucessfully.",
    oldData,
  });
});

router.get("/api/movlist", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.name) {
    dbquery.name = req.query.name;
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
  MoVs.find({
    $and: [
      dbquery,
      {
        $or: [{ name: { $regex: dbquery_search, $options: "i" } }],
      },
      { status: { $ne: "Deleted" } },
    ],
  })
    .countDocuments()
    .exec(function (err, totalCount) {
      if (err) {
        console.log("eer : ", err);
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      MoVs.find(
        {
          $and: [
            dbquery,
            {
              $or: [{ name: { $regex: dbquery_search, $options: "i" } }],
            },
            { status: { $ne: "Deleted" } },
          ],
        },
        {}
      )
        // .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, cndInfo) {
          if (err) {
            console.log("eer : ", err);
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
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});

router.get("/api/updateprogams", async function (req, res) {
  const indicatorinfo = await IndicatorTitles.find({});

  for (let index = 0; index < indicatorinfo.length; index++) {
    let Obj = {};

    let progs = await Programs.find({
      _id: indicatorinfo[index].dimensions,
    });

    // console.log("proo : ", progs);
    // Obj.indicatorTitle = indicatorinfo[index].indicatorTitle;
    // Obj.dimensions = indicatorinfo[index].dimensions;
    // Obj._id = indicatorinfo[index]._id;
    //let pArray = [];
    // for (let pIndex = 0; pIndex < progs.length; pIndex++) {
    //   pArray.push(progs[pIndex].cndCode);
    // }
    // Obj.programNames = pArray;
    // finalResult.push(Obj);

    if (progs.length > 0) {
      await IndicatorTitles.updateOne(
        { indicatorTitle: indicatorinfo[index].indicatorTitle },
        {
          $set: {
            programme: progs[0]._id,
            programmeNo: progs[0].cndName,
            programmeName: progs[0].cndCode,
            subProgramme: progs[1]._id,
            subProgrammeNo: progs[1].cndName,
            subProgrammeName: progs[1].cndCode,
          },
        }
      );
    }
    // await IndicatorTitles.bulkWrite([
    //   {
    //     updateOne: {
    //       filter: { indicatorTitle: indicatorinfo[index].indicatorTitle },
    //       update: {
    //         $set: {
    //           programme: progs[0]._id,
    //           programmeNo: progs[0].cndName,
    //           programmeName: progs[0].cndCode,
    //           subProgramme: progs[1]._id,
    //           subProgrammeNo: progs[1].cndName,
    //           subProgrammeName: progs[1].cndCode,
    //         },
    //       },
    //     },
    //   },
    // ]);
  }

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "List fetched successfully",
  });
});

//add/update means of verification
router.post("/api/addupdatemov", auth, async function (req, res) {
  // console.log(req.body);
  if (!req.body.name) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Means of Verification",
    });
  } else {
    if (req.body.id) {
      /** Update CND **/
      MoVs.findOne(
        {
          _id: req.body.id,
        },
        function (err, movObj) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!movObj) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Means of Verification with given id not exists!",
            });
          } else {
            MoVs.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                namr: req.body.name ? req.body.name.trim() : movObj.name,
                updatedDate: new Date().getTime(),
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
                    "Means of Verification Updated",
                    "Update",
                    "Means of Verification",
                    "Means of Verification edit",
                    req.get("referer"),
                    movObj,
                    result
                  );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Means of Verification Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Indicatorst **/
      ////check if mov already exist
      let checkMov = await MoVs.find({ name: req.body.name.trim() });

      if (checkMov.length > 0) {
        return res.status(400).json({
          success: false,
          responseCode: 400,
          msg: "Data Already Exists !!",
        });
      }
      //////////

      var movObj = {
        name: req.body.name.trim(),

        createdDate: new Date().getTime(),
      };
      var newMov = new MoVs(movObj);
      newMov.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Means of Verification Name already exist!, please try with another.",
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
        var result = JSON.parse(JSON.stringify(movObj));

        loghistory(
          req.user._id,
          "Means of Verification Added",
          "Add",
          "Means of Verification",
          "Add Means of Verification",
          req.get("referer"),
          null,
          result
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Means of Verification added successfully.",
          result: result,
        });
      });
    }
  }
});

module.exports = router;
