var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var ServiceProviders = require("../models/ContractServiceProviders");
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");

/************Start Service Provider ADD/UPDATE API ************************* */
router.post("/api/serviceproviders", auth, async function (req, res) {
  if (!req.body.serviceProviderFirmName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter firm name",
    });
  } else {
    if (req.body.id) {
      /** Update **/
      ServiceProviders.findOne(
        {
          _id: req.body.id,
        },
        function (err, obj) {
          if (err) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Internal Server Error.",
            });
          }
          if (!obj) {
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "record does not exists!",
            });
          } else {
            ServiceProviders.findOneAndUpdate(
              {
                _id: req.body.id,
              },
              {
                serviceProviderFirmName: req.body.serviceProviderFirmName
                  ? req.body.serviceProviderFirmName
                  : obj.serviceProviderFirmName,
                contactPersonName: req.body.contactPersonName
                  ? req.body.contactPersonName
                  : obj.contactPersonName,

                contactNumber: req.body.contactNumber
                  ? req.body.contactNumber
                  : obj.contactNumber,

                email: req.body.email ? req.body.email : obj.email,
                updatedDate: new Date().getTime(),
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
                    "Service Provider Updated",
                    "Update",
                    "Service Provider",
                    "Service Provider edit",
                    req.get("referer"),
                    obj,
                    result
                  );

                  var result = JSON.parse(JSON.stringify(result));
                  res.status(200).json({
                    success: true,
                    responseCode: 200,
                    msg: "Service Provider Updated sucessfully.",
                    result,
                  });
                }
              }
            );
          }
        }
      );
    } else {
      /** ADD **/

      var obj = {
        serviceProviderFirmName: req.body.serviceProviderFirmName,
        contactPersonName: req.body.contactPersonName,

        contactNumber: req.body.contactNumber,

        email: req.body.email,
        createdDate: new Date().getTime(),
        createdBy: req.user._id,
      };
      var newServiceProvider = new ServiceProviders(obj);
      newServiceProvider.save(function (err) {
        console.log("errors", err);
        if (err)
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Some thing is wrong.",
            error: err.errors,
          });

        var result = JSON.parse(JSON.stringify(obj));

        loghistory(
          req.user._id,
          "Service Provider Added",
          "Add",
          "Service Provider",
          "Add Service Provider",
          req.get("referer"),
          null,
          result
        );

        res.status(200).json({
          success: true,
          responseCode: 200,
          msg: "Service Provider added successfully.",
          result: result,
        });
      });
    }
  }
});

/************End Service Provider ADD/UPDATE API ************************* */

/************Start Service Provider List API ************************* */

router.get("/api/serviceproviderslist", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.serviceProviderFirmName) {
    dbquery.serviceProviderFirmName = req.query.serviceProviderFirmName;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
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
  ServiceProviders.find({
    $and: [
      { deleted: { $ne: 1 } },
      dbquery,
      {
        $or: [
          {
            serviceProviderFirmName: {
              $regex: dbquery_search + "",
              $options: "i",
            },
          },
          {
            contactPersonName: {
              $regex: dbquery_search + "",
              $options: "i",
            },
          },

          { contactNumber: { $regex: dbquery_search, $options: "i" } },

          { email: { $regex: dbquery_search, $options: "i" } },
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
      ServiceProviders.find({
        $and: [
          { deleted: { $ne: 1 } },
          dbquery,
          {
            $or: [
              {
                serviceProviderFirmName: {
                  $regex: dbquery_search + "",
                  $options: "i",
                },
              },
              {
                contactPersonName: {
                  $regex: dbquery_search + "",
                  $options: "i",
                },
              },

              { contactNumber: { $regex: dbquery_search, $options: "i" } },
              { contact2: { $regex: dbquery_search, $options: "i" } },
              { contact3: { $regex: dbquery_search, $options: "i" } },
              { email: { $regex: dbquery_search, $options: "i" } },
            ],
          },
        ],
      })
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(async function (err, obj) {
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
              result: obj,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});
/************End Service Providers List API ************************* */

router.delete("/api/deleteserviceprovider", auth, async (req, res) => {
  const title = await ServiceProviders.findByIdAndUpdate(req.query.id, {
    deleteddate: Date.now(),
    deleted: 1,
  });

  if (!title) return res.status(400).send("service provider not found");
  const oldData = await ServiceProviders.findById(req.query.id);
  loghistory(
    req.user._id,
    "Service Provider Deleted",
    "Delete",
    "Service Provider",
    "Delete Service Provider",
    req.get("referer"),
    oldData,
    null
  );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Service Provider deleted sucessfully.",
    oldData,
  });
});

module.exports = router;
