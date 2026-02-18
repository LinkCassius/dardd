var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Banks = require("../models/Banks");
const loghistory = require("./userhistory");
var { User } = require("../models/User");
var UserGroup = require("../models/UserGroup");
const auth = require("../middleware/auth");
/************Start Bank ADD / CAPTURE API ************************* */
router.post("/api/bank", auth, async function (req, res) {
  if (!req.body.name) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter name.",
    });
  } else {
    if (req.body.id) {
      Banks.findOne(
        {
          _id: req.body.id,
        },
        function (err, resObj) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!resObj) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Bank with given id not exists!",
            });
          } else {
            Banks.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                name: req.body.name ? req.body.name : resObj.name,
                address: req.body.address ? req.body.address : resObj.address,
                parent: req.body.parent ? req.body.parent : resObj.parent,
                deleted: req.body.deleted ? req.body.deleted : resObj.deleted,
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
                  if (req.user._id)
                    loghistory(
                      req.user._id,
                      "Bank Updated",
                      "Update",
                      "banks",
                      "Bank edit",
                      req.get("referer"),
                      resObj,
                      result
                    );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Bank Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD Bank **/

      var Obj = {
        name: req.body.name,
        address: req.body.address,
        parent: req.body.parent,
      };
      var newObj = new Banks(Obj);
      newObj.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Name already exist!, please try with another.",
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
        var result = JSON.parse(JSON.stringify(newObj));

        if (req.user._id)
          loghistory(
            req.user._id,
            "Bank Add",
            "Add",
            "banks",
            "Add Bank",
            req.get("referer"),
            null,
            result
          );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg:
            req.body.parent !== null
              ? "Bank added successfully."
              : "Branch added successfully.",
          result: result,
        });
      });
    }
  }
});
/************End ApprovalSetup API ************************* */

/************* Approval Setup LIST API****************/
router.get("/api/banklist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.name) {
    dbquery.name = req.query.name;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }
  
  if (req.query.parent) {
    if (req.query.parent == "bank") dbquery = { parent: null };
    else if (req.query.parent == "new") {
      //dummy parent id to avoid error
      dbquery = { parent: "537eed02ed345b2e039652d2" };
    } else dbquery.parent = req.query.parent;
  }
  /************total count query start here ********/
  // Find some documents

  Banks.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      if (err) {
        console.log("Err : ", err);
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      Banks.find(dbquery, {})
        .populate({
          path: "parent",
          model: "banks",
        })
        .exec(async function (err, info) {
          if (err) {
            console.log("bank Err : ", err);
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "error",
            });
          } else {
            // console.log("Infoxxxx : ", info);
            // let aHResult = [];

            // for (var i = 0; i < info.length; i++) {
            //   let bank = await Banks.find({
            //     parent: info[i]._id,
            //   });
            //   for (var i = 0; i < bank.length; i++) {
            //     let obj = {};

            //     obj["bankId"] = info[i]._id;
            //     obj["bankName"] = info[i].name;
            //     obj["branches"] = JSON.stringify(bank);
            //     aHResult.push(obj);
            //   }
            // }
            // console.log("Infoxxxx aHResult : ", aHResult);

            res.status(200).json({
              success: true,
              responseCode: 200,
              result: info,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});
/************End Approval Setup List API ************************* */

module.exports = router;
