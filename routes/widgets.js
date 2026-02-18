const { Widgets, validate, iconPath } = require("../models/widget");
const { UserWidgets, validateUserWidget } = require("../models/userwidget");

const { User } = require("../models/User");
var Contracts = require("../models/Contracts");
const FarmerDetail = require("../models/FarmerDetail");
const FarmerProduction = require("../models/FarmerProduction");
const loghistory = require("./userhistory");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const uuidv4 = require("uuid/v4");
const uploadPath = path.join("public", iconPath);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });

// /**
//  * @swagger
//  * /api/widgetlst:
//  *   post:
//  *     tags:
//  *       -  List of Widgets
//  *     description: Returns a object of widget in system
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: An Object of the widget list
//  *         schema:
//  *            $ref: '#/definitions/widgetlst'
//  */

/*
 *
 * Get all widgets
 *
 * Send object of widgets
 *
 */
router.get("/api/widgetlst", async (req, res) => {
  //const widgets = await Widgets.find();
  let result = {};
  //const customer = await Customer.find({}).count();
  // const contracts = await Contracts.find({}).count();
  var farmerRegs = await FarmerDetail.find().count();
  var user = await User.find().count();
  var activeContracts = await Contracts.find({
    contractStatus: "5e831108f7f8f90045f3ac7a",
    status: 1,
  }).count();
  var inActiveContracts = await Contracts.find({
    contractStatus: "5e8311fff7f8f90045f3ac7c",
    status: 1,
  }).count();
  var planningContracts = await Contracts.find({
    contractStatus: "5e8310ebf7f8f90045f3ac79",
    status: 1,
  }).count();
  var onHoldContracts = await Contracts.find({
    contractStatus: "5e83111bf7f8f90045f3ac7b",
    status: 1,
  }).count();
  var disputeContracts = await Contracts.find({
    contractStatus: "5eb2a48eff37373d60696f05",
    status: 1,
  }).count();
  var totalContracts = await Contracts.find().count();
  result = {
    farmerCount: farmerRegs,
    userCount: user,
    activeContracts: activeContracts,
    inActiveContracts: inActiveContracts,
    planningContracts: planningContracts,
    onHoldContracts: onHoldContracts,
    disputeContracts: disputeContracts,
    totalContracts: totalContracts,
  };

  /*
  for (let value of widgets) {
    const widget = await UserWidgets.findOne({
      widgetID: value._id,
      user: req.user._id
    });
    let count = 0;
    let data = {};
    let select = "";
    if (widget) {
      select = true;
    }
    if (value.name.toLowerCase() == "customer") {
      count = customer.length;
    }
    if (value.name.toLowerCase() == "farmers") {
      count = farmerProduction.length;
    }
    if (value.type.toLowerCase() == "chart") {
      count = customer.length;
    }
    if (value.name.toLowerCase() == "farmers") {
      count = farmerProduction.length;
    }
    if (value.name.toLowerCase() == "users") {
      count = user.length;
    }
    result.push({
      _id: value._id,
      name: value.name,
      description: value.description,
      icon: value.icon,
      type: value.type,
      count: count,
      data: data,
      select: select
    });
  }
  */
  res.send(result);
});

////////////////Get all Widgets for dynamic binding * start * ///////////////////////////////

router.get("/api/widgetsList", auth, async (req, res) => {
  const widgets = await Widgets.find();
  let result = [];

  var farmerRegs = await FarmerDetail.find().count();
  var userCount = await User.find().count();
  var activeContracts = await Contracts.find({
    contractStatus: "5e831108f7f8f90045f3ac7a",
  }).count();
  var inActiveContracts = await Contracts.find({
    contractStatus: "5e8311fff7f8f90045f3ac7c",
  }).count();
  var planningContracts = await Contracts.find({
    contractStatus: "5e8310ebf7f8f90045f3ac79",
  }).count();
  var onHoldContracts = await Contracts.find({
    contractStatus: "5e83111bf7f8f90045f3ac7b",
  }).count();
  var totalContracts = await Contracts.find().count();

  for (let value of widgets) {
    const widget = await UserWidgets.findOne({
      widgetID: value._id,
      user: req.user._id,
    });
    let count = 0;
    let data = {};
    let select = "";
    if (widget) {
      select = true;
    }

    if (value.name.toLowerCase() == "active contracts") {
      count = activeContracts;
    }
    if (value.name.toLowerCase() == "contracts on-planning") {
      count = planningContracts;
    }
    if (value.name.toLowerCase() == "contracts on-hold") {
      count = onHoldContracts;
    }
    if (value.name.toLowerCase() == "contracts inactive") {
      count = inActiveContracts;
    }
    if (value.name.toLowerCase() == "total contracts") {
      count = totalContracts;
    }
    if (value.name.toLowerCase() == "total farmers") {
      count = farmerRegs;
    }
    if (value.name.toLowerCase() == "total users") {
      count = userCount;
    }

    // if (value.name.toLowerCase() == "device" && value.type.toLowerCase() == "chart") {
    //   count = customer.length;
    // }

    result.push({
      _id: value._id,
      name: value.name,
      description: value.description,
      icon: value.icon,
      type: value.type,
      count: count,
      data: data,
      select: select,
    });
  }
  res.send(result);
});
//////////////////Get all Widgets for dynamic binding * end * /////////////////////////////

// /**
//  * @swagger
//  * /api/widget:
//  *   post:
//  *     tags:
//  *       -  Add / Update widget
//  *     description: Returns a object of widget in system
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: name
//  *         description: name of the widget
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: description
//  *         description: description of the widget
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: icon
//  *         description: icon of the widget
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: type
//  *         description: type of the widget
//  *         in: formData
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of the widget
//  *         schema:
//  *            $ref: '#/definitions/widget'
//  */

/************Start Widget ADD/UPDATE API ************************* */
router.post(
  "/api/widget",
  upload.single("custLogo"),
  async function (req, res) {
    // console.log("body", req.body);
    if (!req.body.name) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter Widget Name.",
      });
    } else if (!req.body.description) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter description.",
      });
    } else {
      if (req.body.id) {
        /** Update Widget **/
        Widgets.findOne(
          {
            _id: req.body.id,
          },
          function (err, widget) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            if (!widget) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Widget with given id not exists!",
              });
            } else {
              Widgets.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                {
                  name: req.body.name,
                  description: req.body.description,
                  icon: req.body.icon,
                  type: req.body.type,
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
                    res.status(200).json({
                      success: true,
                      responseCode: 200,
                      msg: "Widget Updated sucessfully.",
                      result,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        /** ADD Widget **/
        var widgetObj = {
          name: req.body.name,
          description: req.body.description,
          icon: req.body.icon,
          type: req.body.type,
        };
        var newWidget = new Widgets(widgetObj);
        newWidget.save(function (err) {
          console.log("errors", err);
          if (err) {
            if (
              (err.name === "BulkWriteError" || err.name === "MongoError") &&
              err.code === 11000
            ) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "code already exist!, plz try with another.",
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
          var result = JSON.parse(JSON.stringify(newWidget));

          res.status(200).json({
            success: true,
            responseCode: 200,
            msg: req.body.name + " added successfully.",
            result: result,
          });
        });
      }
    }
  }
);

/*
 *
 *  Save widget against user
 *
 * Params: widgetID
 *
 */

// /**
//  * @swagger
//  * /api/userwidget:
//  *   post:
//  *     tags:
//  *       -  Add / Update User Widget
//  *     description: Returns a object of User widget in system
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: Widget ID
//  *         description: ID of the widget
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: User ID
//  *         description: ID of the widget
//  *         in: formData
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of the user widget
//  *         schema:
//  *            $ref: '#/definitions/userwidget'
//  */

router.post("/api/userwidget", auth, async (req, res) => {
  // const { error } = validateUserWidget(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  await UserWidgets.deleteMany({ user: req.user._id });
  let data = [];
  for (let val of req.body.widgetID) {
    data.push({
      user: req.user._id,
      widgetID: JSON.parse(val)._id,
    });
  }
  let Widgetsservice = await UserWidgets.insertMany(data);
  //res.send(Widgetsservice);
  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Widget updated successfully.",
    result: Widgetsservice,
  });
});

module.exports = router;
