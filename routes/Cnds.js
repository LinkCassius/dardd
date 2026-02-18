var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var multer = require("multer");
const path = require("path");
var nodeMailer = require("nodemailer");
var moment = require("moment");

var Cnds = require("../models/Cnds");
var { User } = require("../models/User");
var Contracts = require("../models/Contracts");
var Tasks = require("../models/ContractTasks");
var ContractMilestones = require("../models/ContractMilestones");

const Config = require("../config/config");
const { EmailClient } = require("@azure/communication-email");

const { mailSettings, alertSettings, siteUrl, acsEmail } = Config;
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");

// Set Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");

    cb(
      null,
      //      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      fileName + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ auth, storage: storage }).single("file");
/**
 * @swagger
 * /api/cnd:
 *   post:
 *     tags:
 *       - Add / Update, List Cnd
 *     description: Returns a object of cnd
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cndName
 *         description: name of cnd
 *         in: formData
 *         required: true
 *         type: string
 *       - name: cndCode
 *         description: unique code of cnd
 *         in: formData
 *         required: true
 *         type: string
 *       - name: cndGroup
 *         description: Group cnd belongs to
 *         in: formData
 *         required: true
 *         type: string
 *       - name: desc
 *         description: description of cnd
 *         in: formData
 *         type: string
 *       - name: status
 *         description: description of cnd
 *         in: formData
 *         type: number
 *       - name: priority
 *         description: priority of cnd
 *         in: formData
 *         type: number
 *       - name: parent
 *         description: objectId of parent cnd
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: An Object of registered user
 *         schema:
 *            $ref: '#/definitions/Cnd'
 */

/************Start Cnd ADD/UPDATE API ************************* */
router.post("/api/cnd", auth, async function (req, res) {
  if (!req.body.cndName) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter cndName.",
    });
  } else if (!req.body.cndCode) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter cndCode.",
    });
  } else if (!req.body.cndGroup) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter cndGroup.",
    });
  } else {
    if (req.body.parent === "") req.body.parent = null;
    if (req.body.id) {
      var userData = await Cnds.findOne({
        cndCode: req.body.cndCode,
        _id: { $ne: req.body.id },
      });
      if (userData) {
        res.status(400).json({
          success: false,
          msg: "CnD Value - '" + req.body.cndCode + "' is already available.",
        });
      } else {
        /** Update CND **/
        Cnds.findOne(
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
                msg: "Cnd with given id not exists!",
              });
            } else {
              Cnds.findOneAndUpdate(
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
                        "CnD Update",
                        "Update",
                        "CnDs",
                        "Update CnD",
                        req.get("referer"),
                        cnd,
                        result
                      );

                    var result = JSON.parse(JSON.stringify(result));
                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: "Cnd Updated sucessfully.",
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
      var newCnd = new Cnds(cndObj);
      newCnd.save(function (err) {
        console.log("errors", err);
        if (err) {
          if (
            (err.name === "BulkWriteError" || err.name === "MongoError") &&
            err.code === 11000
          ) {
            return res.status(400).json({
              success: false,
              msg: "Cnd value already available!, please try with another.",
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
            "Cnd Add",
            "Add",
            "cnds",
            "Add Cnd",
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
/**
 * @swagger
 * /api/cndlist:
 *   get:
 *     tags:
 *       - Add / Update, List Cnd
 *     description: Returns a cnd list according to params
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: cndGroup
 *         in:  query
 *         type: string
 *       - name: parent
 *         in:  query
 *         type: string
 *     responses:
 *       200:
 *         description: Array list of cnds
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
 *             $ref: '#/definitions/Cnd'
 *
 *
 */
/************* Cnds LIST API****************/
router.get("/api/cndlist", auth, function (req, res) {
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
  Cnds.find({
    $and: [
      dbquery,
      {
        $or: [
          { cndName: { $regex: dbquery_search, $options: "i" } },
          { cndCode: { $regex: dbquery_search, $options: "i" } },
          { cndGroup: { $regex: dbquery_search, $options: "i" } },
        ],
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
      Cnds.find(
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
          ],
        },
        {}
      )
        .populate({
          path: "parent",
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

/** Upload File Api **/
router.post("/api/uploadfile", async function (req, res) {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Error fetching data",
        result: err,
      });
    } else {
      res.status(200).json({
        success: true,
        url: req.file.filename,
        responseCode: 200,
        msg: "file uploaded successfully",
      });
    }
  });
  //res.send("test");
  //console.log("req.file", req.file);
});

/************* Get Single cnd API****************/
router.get("/api/cndlist/:id", auth, function (req, res) {
  Cnds.findById(req.params.id).exec(function (err, cndInfo) {
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

/************* Get CnD Group API****************/
router.get("/api/cndgroup", auth, function (req, res) {
  Cnds.distinct("cndGroup").exec(function (err, cndInfo) {
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
        result: cndInfo.sort(),
        msg: "List fetching successfully",
      });
    }
  });
});
/************End Get CnD Group API ************************* */

/************* send mail API****************/
router.post("/api/sendmailold/:id", async (req, res) => {
  let activeIndex = 0; //for dashboard tabs
  if (req.query.activeIndex) activeIndex = req.query.activeIndex;

  let hrf = siteUrl + "/?activeIndex=" + activeIndex;

  let link = ""; //for approver has to be change after approval workflow
  //if (req.body.msgx && req.body.msgx !== "Approver")
  // link = "<a href='" + hrf + "'>Click here to view</a>";

  User.findById(req.params.id).exec(function (err, userInfo) {
    if (err) {
      res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Error fetching data",
        result: "error",
      });
    } else {
      // res.status(200).json({
      //   success: true,
      //   responseCode: 200,
      //   result: userInfo,
      //   msg: "User data fetched successfully",
      // });

      let transporter = nodeMailer.createTransport({
        host: mailSettings.host,
        port: mailSettings.port,
        secure: mailSettings.secure,
        auth: {
          user: mailSettings.mailId,
          pass: mailSettings.mailPwd,
        },
      });
      let mailOptions = {
        from: '"DARDLEA Notification"' + mailSettings.mailId, // sender address
        to: userInfo.email, // list of receivers
        subject: req.body.mailSubject, // Subject line
        //text:  req.body.subject, // plain text body
        html:
          "<div style='font-family: Trebuchet MS;font-size:14px; color:darkblue'>" +
          "Dear " +
          userInfo.firstName +
          " " +
          userInfo.lastName +
          ", <br/>" +
          "Please see the below details: <br/>" +
          "<b>" +
          req.body.mailBody +
          "</b><br/>" +
          link +
          "<br/><br/>- Thank you" +
          "</div>", // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          //return console.log(error);
          return res.status(400).json({
            success: false,
            responseCode: 400,
            msg: "Error fetching data",
            result: error,
          });
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
        //res.render('index');
        res.status(200).json({
          success: true,
          responseCode: info.response,
          //result: userInfo,
          msg: info.messageId,
        });
      });

      ///
    }
  });
});

router.post("/api/sendmail/:id", async (req, res) => {
  let activeIndex = 0;
  if (req.query.activeIndex) activeIndex = req.query.activeIndex;

  let hrf = siteUrl + "/?activeIndex=" + activeIndex;
  let link = ""; // can reuse if needed

  try {
    const userInfo = await User.findById(req.params.id).lean();

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        responseCode: 404,
        msg: "User not found",
        result: null,
      });
    }

    const emailClient = new EmailClient(acsEmail.primaryConnectionString);

    const message = {
      senderAddress: acsEmail.senderAddress,
      recipients: {
        to: [
          {
            address: userInfo.email,
            displayName: `${userInfo.firstName} ${userInfo.lastName}`,
          },
        ],
      },
      content: {
        subject: req.body.mailSubject,
        html: `
          <div style="font-family: Trebuchet MS; font-size:14px; color:darkblue">
            Dear ${userInfo.firstName} ${userInfo.lastName},<br/>
            Please see the below details:<br/>
            <b>${req.body.mailBody}</b><br/>
            ${link}<br/><br/>
            - Thank you
          </div>
        `,
      },
      userEngagementTrackingDisabled: acsEmail.userEngagementTrackingDisabled,
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    res.status(200).json({
      success: true,
      responseCode: result && result.id || "Message sent",
      msg: "Email sent successfully via ACS",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      responseCode: 500,
      msg: "Failed to send email",
      result: error.message,
    });
  }
});

/************End send mail API ************************* */

/************* Get Alerts API****************/
function search(nameKey, myArray) {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i].cndName === nameKey) {
      return myArray[i];
    }
  }
}

function daysRemaining(num) {
  var eventdate = moment(num * 1000);
  var todaysdate = moment();
  return eventdate.diff(todaysdate, "days") + 1;
}

router.get("/api/alerts/:contractId?", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.params.contractId) {
    dbquery._id = req.params.contractId;
  }

  //get days from CnD table
  var dbquery_Cnds = {};
  dbquery_Cnds.cndGroup = "Alerts";

  var dbquery_Tasks = {};
  if (req.query.id) {
    dbquery_Tasks.personResponsible = req.query.id;
  }

  var dbquery_Milestones = {};
  if (req.query.id) {
    dbquery_Milestones.personResponsible = req.query.id;
  }
  var results = [];
  Cnds.find(dbquery_Cnds, {}).exec(function (err, cndInfo) {
    if (err) {
      res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Error fetching data",
        result: "error",
      });
    } else {
      var contractObject = search("Contract", cndInfo);
      var TaskObject = search("Task", cndInfo);
      var milestoneObject = search("Milestone", cndInfo);

      let contract_days = contractObject.cndCode;
      let task_days = TaskObject.cndCode;
      let milestone_days = milestoneObject.cndCode;

      let contract_cutoff = new Date();
      contract_cutoff.setDate(
        contract_cutoff.getDate() + parseInt(contract_days)
      );

      let milestone_cutoff = new Date();
      milestone_cutoff.setDate(
        milestone_cutoff.getDate() + parseInt(milestone_days)
      );

      let task_cutoff = new Date();
      task_cutoff.setDate(task_cutoff.getDate() + parseInt(task_days));

      dbquery.endDate = {
        $lte: moment(contract_cutoff).format("X"),
      };

      dbquery_Tasks.taskTargetDate = {
        $lte: moment(task_cutoff).format("X"),
      };
      dbquery_Milestones.endDate = {
        $lte: moment(milestone_cutoff).format("X"),
      };

      //if task/milestone is with completed status, no need to show alert
      dbquery_Tasks.taskStatus = { $ne: "5eb3c61de4f563501020b856" };
      dbquery_Milestones.milestoneStatus = { $ne: "5eb3c61de4f563501020b856" };

      Contracts.find(dbquery)
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
          Contracts.find(dbquery, {})
            .populate({
              path: "contractType",
              model: "cnds",
            })
            .populate({
              path: "contractStatus",
              model: "cnds",
            })
            .exec(function (err, contractInfo) {
              if (err) {
                res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "Error fetching data",
                  result: "error",
                });
              } else {
                for (var i = 0; i < contractInfo.length; i++) {
                  var obj = {};
                  if (daysRemaining(contractInfo[i].endDate) >= 0) {
                    (obj["alertType"] = "Contract"),
                      (obj["alertDays"] = daysRemaining(
                        contractInfo[i].endDate
                      )),
                      (obj["alertDesc"] =
                        "Below Contract is about to expire in " +
                        daysRemaining(contractInfo[i].endDate) +
                        " days"),
                      (obj["contractName"] = contractInfo[i].contractName),
                      (obj["contractNumber"] = contractInfo[i].contractNumber),
                      (obj["projectNumber"] = contractInfo[i].projectNumber),
                      (obj["startDate"] = contractInfo[i].startDate),
                      (obj["endDate"] = contractInfo[i].endDate),
                      (obj["serviceProvider"] =
                        contractInfo[i].serviceProvider),
                      (obj["contractValue"] = new Intl.NumberFormat("en-za", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(contractInfo[i].contractValue)),
                      (obj["contractType"] = contractInfo[i].contractType),
                      (obj["contractStatus"] = contractInfo[i].contractStatus),
                      (obj["status"] =
                        daysRemaining(contractInfo[i].endDate) <=
                        alertSettings.contractAlert
                          ? "red"
                          : "green");
                    results.push(obj);
                  }
                }

                //Task Alerts Start
                Tasks.find(dbquery_Tasks, {})
                  .populate({
                    path: "contract",
                    model: "contracts",
                  })
                  .populate({
                    path: "personResponsible",
                    model: "users",
                  })
                  .exec(function (err, taskInfo) {
                    if (err) {
                      res.status(400).json({
                        success: false,
                        responseCode: 400,
                        msg: "Error fetching data",
                        result: "error",
                      });
                    } else {
                      for (var i = 0; i < taskInfo.length; i++) {
                        var obj = {};
                        if (daysRemaining(taskInfo[i].taskTargetDate) >= 0) {
                          (obj["alertType"] = "Task"),
                            (obj["alertDays"] = daysRemaining(
                              taskInfo[i].taskTargetDate
                            )),
                            (obj["alertDesc"] =
                              "Below task is expected to complete in " +
                              daysRemaining(taskInfo[i].taskTargetDate) +
                              " days."),
                            (obj["taskName"] = taskInfo[i].taskName),
                            (obj["contractName"] =
                              taskInfo[i].contract.contractName),
                            (obj["personResponsible"] =
                              taskInfo[i].personResponsible.firstName +
                              " " +
                              taskInfo[i].personResponsible.lastName),
                            (obj["taskTargetDate"] =
                              taskInfo[i].taskTargetDate),
                            (obj["status"] =
                              daysRemaining(taskInfo[i].taskTargetDate) <=
                              alertSettings.taskAlert
                                ? "red"
                                : "green");
                          results.push(obj);
                        }
                      }
                      // Task Alert End

                      //Milestone Alerts Start
                      ContractMilestones.find(dbquery_Milestones, {})
                        .populate({
                          path: "contract",
                          model: "contracts",
                        })
                        .populate({
                          path: "personResponsible",
                          model: "users",
                        })
                        .exec(function (err, milestoneInfo) {
                          if (err) {
                            res.status(400).json({
                              success: false,
                              responseCode: 400,
                              msg: "Error fetching data",
                              result: "error",
                            });
                          } else {
                            for (var i = 0; i < milestoneInfo.length; i++) {
                              var obj = {};
                              if (
                                daysRemaining(milestoneInfo[i].endDate) >= 0
                              ) {
                                (obj["alertType"] = "Milestone"),
                                  (obj["alertDays"] = daysRemaining(
                                    milestoneInfo[i].endDate
                                  )),
                                  (obj["alertDesc"] =
                                    "Below Milestone is about to expire in " +
                                    daysRemaining(milestoneInfo[i].endDate) +
                                    " days"),
                                  (obj["contractName"] =
                                    milestoneInfo[i].contract.contractName),
                                  (obj["milestoneName"] =
                                    milestoneInfo[i].milestoneName),
                                  (obj["startDate"] =
                                    milestoneInfo[i].startDate),
                                  (obj["endDate"] = milestoneInfo[i].endDate),
                                  (obj["milestoneValue"] =
                                    new Intl.NumberFormat("en-za", {
                                      style: "currency",
                                      currency: "ZAR",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(milestoneInfo[i].milestoneValue)),
                                  (obj["personResponsible"] =
                                    milestoneInfo[i].personResponsible
                                      .firstName +
                                    " " +
                                    milestoneInfo[i].personResponsible
                                      .lastName),
                                  (obj["status"] =
                                    daysRemaining(milestoneInfo[i].endDate) <=
                                    alertSettings.milestoneAlert
                                      ? "red"
                                      : "green");
                                results.push(obj);
                              }
                            }

                            res.status(200).json({
                              success: true,
                              responseCode: 200,
                              result: results,
                              totalRecCount: results.length,
                              msg: "List fetching successfully",
                            });
                          }
                        });
                    }
                  });
              }
            });
        });
    } //else end
  });

  /************total count query start here ********/
  // Find some documents
});
/************End Get Alerts API ************************* */

/************Start Global Search API */

router.get("/api/globalsearch", auth, function (req, res) {
  /*********Search Query build ************/

  var dbquery = "";
  if (req.query.search) dbquery = req.query.search;
  /************total count query start here ********/

  // Find some documents
  Contracts.find()
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
      Contracts.find({
        $or: [
          { contractName: { $regex: dbquery, $options: "i" } },
          { contractNumber: { $regex: dbquery, $options: "i" } },
          { projectNumber: { $regex: dbquery, $options: "i" } },
          { contractDetail: { $regex: dbquery, $options: "i" } },
          { serviceProvider: { $regex: dbquery, $options: "i" } },
        ],
      })
        .populate({
          path: "contractType",
          model: "cnds",
        })
        .populate({
          path: "contractStatus",
          model: "cnds",
        })

        .exec(function (err, results) {
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
              result: results,
              totalRecCount: totalCount,
              msg: "List fetching successfully",
            });
          }
        });
    });
});

/************End Global Search API */

router.get("/api/getdimensions", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  dbquery.cndGroup = "Dimension";

  // Find some documents
  Cnds.find(dbquery)
    .select({ children: 1, parent: 1, cndCode: 1, cndName: 1, _id: 1 })
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

router.get("/api/samplemail", async (req, res) => {
  let transporter = nodeMailer.createTransport({
    host: "10.169.157.240", //"10.169.157.240" //"mail.mpg.gov.za"//163.195.18.142 //smtp.office365.com //smtp.gmail.com
    port: 25, //25 //587 //1677
    secure: true,
    auth: {
      user: "dardleasystem@mpg.gov.za", //"wdasi@technobraingroup.com",
      pass: "dec.2021", //dec.2021 //"djital@092021"
    },
  });
  let mailOptions = {
    from: '"DARDLEA Notification"' + "dardleasystem@mpg.gov.za", // sender address
    to: "wesleysandesh@gmail.com", // list of receivers
    subject: "sample mail", // Subject line
    html: "<div style='font-family: Trebuchet MS;font-size:14px; color:darkblue'> Dear Sandesh, <br/> Please see the below details: <br/> <b> This is test sample mail <br/><br/>- Thank you </div>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("mail error : ", error);
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Error fetching data",
        result: error,
      });
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    res.status(200).json({
      success: true,
      responseCode: info.response,
      msg: info.messageId,
    });
  });
});

module.exports = router;
