var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var UserGroup = require("../models/UserGroup");
const auth = require("../middleware/auth");
const loghistory = require("./userhistory");
var { User } = require("../models/User");

/**
 * @swagger
 * /api/usergroup:
 *   post:
 *     tags:
 *       - Add / Update, List User Groups
 *     description: Returns a object of user groups
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: groupName
 *         description: name of group
 *         in: formData
 *         required: true
 *         type: string
 *       - name: status
 *         description: description
 *         in: formData
 *         type: number
 *     responses:
 *       200:
 *         description: An Object of user group
 *         schema:
 *            $ref: '#/definitions/UserGroup'
 */

/************Start UserGroup ADD/UPDATE API ************************* */
router.post("/api/usergroup", auth, async function (req, res) {
  if (!req.body.groupName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter role name.",
    });
  } else {
    if (req.body.id) {
      var userData = await UserGroup.findOne({
        groupName: req.body.groupName,
        _id: { $ne: req.body.id },
      });
      if (userData) {
        res.status(400).json({
          success: false,
          msg: "Role Name - '" + req.body.groupName + "' is already available.",
        });
      } else {
        /** Update User group **/
        UserGroup.findOne(
          {
            _id: req.body.id,
          },
          function (err, usergroup) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            if (!usergroup) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Role with given id not exists!",
              });
            } else {
              UserGroup.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                {
                  groupName: req.body.groupName
                    ? req.body.groupName
                    : usergroup.groupName,
                  permission: req.body.permission
                    ? req.body.permission
                    : usergroup.permission,
                  status: req.body.status ? req.body.status : usergroup.status,
                  deleted: req.body.deleted
                    ? req.body.deleted
                    : usergroup.deleted,
                },
                { new: true },
                function (err, result) {
                  if (err) {
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
                        "Role Update",
                        "Update",
                        "roles",
                        "Update role",
                        req.get("referer"),
                        usergroup,
                        result
                      );

                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: "Role updated sucessfully.",
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
      var userData = await UserGroup.findOne({
        groupName: req.body.groupName,
      });
      if (userData) {
        res.status(400).json({
          success: false,
          msg: "Role Name - '" + req.body.groupName + "' is already available.",
        });
      } else {
        /** ADD User Group **/
        var usergroupObj = {
          groupName: req.body.groupName,
          permission: req.body.permission,
          status: req.body.status,
          deleted: req.body.deleted,
        };
        var newGroup = new UserGroup(usergroupObj);
        newGroup.save(function (err) {
          if (err) {
            if (
              (err.name === "BulkWriteError" || err.name === "MongoError") &&
              err.code === 11000
            ) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Role already exist!, please try with another.",
              });
            } else {
              if (err.errors && err.errors.groupName)
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: err.errors.groupName.message,
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
          var result = JSON.parse(JSON.stringify(newGroup));
          if (req.user._id)
            loghistory(
              req.user._id,
              "Role Add",
              "Add",
              "roles",
              "Add Role",
              req.get("referer"),
              null,
              result
            );
          res.status(200).json({
            success: true,
            responseCode: 200,
            msg: "Role - '" + req.body.groupName + "' added successfully.",
            result: result,
          });
        });
      }
    }
  }
});

/************Start User Group List API ************************* */
/**
 * @swagger
 * /api/userGrouplist:
 *   get:
 *     tags:
 *       - Add / Update, List User Groups
 *     description: Returns a User group list according to params
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: groupName
 *         in:  query
 *         type: string
 *       - name: status
 *         in:  query
 *         type: string
 *       - name: deleted
 *         in:  query
 *         type: string
 *     responses:
 *       200:
 *         description: Array list of User Groups
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
 *             $ref: '#/definitions/UserGroup'
 *
 *
 */
/************* User group LIST API****************/
router.get("/api/userGrouplist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.groupName) {
    dbquery.groupName = req.query.groupName;
  }

  if (req.query.deleted) {
    dbquery.deleted = req.query.deleted;
  }

  if (req.query.status) {
    dbquery.status = req.query.status;
  }

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
  console.log("query================", dbquery);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  UserGroup.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      }
      UserGroup.find(dbquery, {})
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, groupInfo) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              result: "Error fetching data",
              msg: "Error fetching data",
            });
          } else {
            var results = [];

            //    var totalPages = Math.ceil(totalCount / size)
            res.status(200).json({
              success: true,
              responseCode: 200,
              msg: "List fetched successfully",
              result: groupInfo,
              totalRecCount: totalCount,
            });
          }
        });
    });
});
/************End User Group List API ************************* */

/************* Get Single usergroup API****************/
router.get("/api/usergrouplist/:id", auth, function (req, res) {
  UserGroup.findById(req.params.id).exec(function (err, cndInfo) {
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
/************End Get Single User Group API ************************* */

/************ Get User by User group API ************************* */

router.get("/api/usersbyusergroup/:id", auth, function (req, res) {
  var dbquery = {};
  dbquery.status = 1;
  if (req.params.id) {
    dbquery.userGroup = req.params.id;
  }
  User.find(dbquery)
    .select({ firstName: 1, lastName: 1, _id: 1 })
    .exec(function (err, users) {
      // console.log("totalCount", totalCount);
      if (err) {
        res.status(400).json({
          success: false,
          responseCode: 400,
          result: "Error fetching data",
          msg: "Error fetching data",
        });
      } else {
        res.status(200).json({
          success: true,
          responseCode: 200,
          result: users,
          msg: "List fetching successfully",
        });
      }
    });
});
/************End Get User by User group API ************************* */

module.exports = router;
