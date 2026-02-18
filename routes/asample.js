var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Contracts = require("../models/Contracts");
var ContractPayments = require("../models/ContractPayments");
var multer = require("multer");
const path = require("path");
const Config = require("../config/config");
const auth = require("../middleware/auth");

const { masterConst } = Config;

router.get("/api/lettest", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  var columns = {};

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
  //console.log("query================", dbquery);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  Contracts.aggregate([
    { $match: dbquery },
    {
      $lookup: {
        from: "contract_payments" /* underlying collection for jobSchema */,
        localField: "_id",
        foreignField: "contract",

        as: "contractPayments",
      },
    },
    { $unwind: "$contractPayments" },
  ])
    .sort({ [sort_field]: sort_mode })
    .skip(query.skip)
    .limit(query.limit ? query.limit : 1000000)
    .exec(async function (err, docs) {
      if (err) throw err;
      var totalDoc = await Contracts.find(dbquery, {});
      var totalCount = totalDoc.length;

      res.status(200).json({
        success: true,
        responseCode: 200,
        msg: "List fetched successfully",
        result: docs,
        totalRecCount: docs.length,
      });
    });
});
/************End Activites List API ************************* */

module.exports = router;
