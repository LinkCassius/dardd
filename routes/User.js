var mongoose = require("mongoose");
var express = require("express");
var jwt = require("jsonwebtoken");
var { User, userImagePath } = require("../models/User");
var UserGroup = require("../models/UserGroup");
var nodeMailer = require("nodemailer");
const Config = require("../config/config");
const multer = require("multer");
const path = require("path");
const { checkUserGroupPermission } = require("../helpers/auth");
//var utilityService = require("../services/UtilityService");
//var bcrypt = require('bcrypt-nodejs');
const loghistory = require("./userhistory");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const uploadPath = path.join("public", userImagePath);

const uuidv4 = require("uuid/v4");

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
var router = express.Router();

const { port, secretKey, expiredAfter, masterConst, mailSettings } = Config;
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - User Admin/Agent Registration
 *     description: Returns a object of User in system
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: firstName
 *         description: firstName of user going to register
 *         in: formData
 *         required: true
 *         type: string
 *       - name: lastName
 *         description: lastName of user going to register
 *         in: formData
 *         required: true
 *         type: string
 *       - name: userName
 *         description: userName of user for login
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         description: phone of user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: email, attached with account
 *         in: formData
 *         required: true
 *         type: string
 *         format: email
 *       - name: password
 *         description: password
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *       - name: confirm_password
 *         description: confirm password
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *       - name: userGroup
 *         description: group of user like agent, farmer, admin, superadmin, objectId from UserGroup Collection
 *         in: formData
 *         type: string
 *       - name: parentCustomer
 *         description: customer id of parent customer , objectId from customers collection
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: An Object of registered user
 *         schema:
 *            $ref: '#/definitions/User'
 */

/************REGISTER/SIGNUP API************************* */
router.post(
  "/api/register",
  upload.single("userImage"),
  auth,
  async function (req, res) {
    const fileName =
      typeof req.file !== "undefined"
        ? req.file != null
          ? req.file.filename
          : "default.png"
        : "default.png";

    delete req.body.userImage;
    if (!req.body.email) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter email." });
    } else if (!req.body.password || !req.body.confirm_password) {
      return res.status(400).json({
        success: false,
        msg: "Please enter password and confirm password.",
      });
    } else if (req.body.password != req.body.confirm_password) {
      return res.status(400).json({
        success: false,
        msg: "Password and confirm password should be same",
      });
    } else {
      if (req.body.id != "null") {
        var userData = await User.findOne({
          email: req.body.email,
          _id: { $ne: req.body.id },
        });
        if (userData) {
          res.status(400).json({
            success: false,
            msg: "Email - '" + req.body.email + "' is already registered.",
          });
        } else {
          /** Update User  **/
          User.findOne(
            {
              _id: req.body.id,
            },
            function (err, user) {
              if (err) {
                console.log(err);

                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "Internal Server Error.",
                });
              }
              if (!user) {
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: "User with given id not exists!",
                });
              } else {
                User.findOneAndUpdate(
                  {
                    _id: req.body.id,
                  },
                  {
                    firstName: req.body.firstName
                      ? req.body.firstName
                      : user.firstName,
                    lastName: req.body.lastName
                      ? req.body.lastName
                      : user.lastName,
                    userName: req.body.userName
                      ? req.body.userName
                      : user.userName,
                    phone: req.body.phone ? req.body.phone : user.phone,
                    email: req.body.email ? req.body.email : user.email,
                    // isAdmin: req.body.isAdmin ? req.body.isAdmin : user.isAdmin,
                    userGroup: req.body.userGroup
                      ? req.body.userGroup
                      : user.userGroup,
                    password: req.body.password
                      ? req.body.password
                      : user.password,
                    imageName:
                      fileName != "default.png" ? fileName : user.imageName,
                    district: req.body.district
                      ? req.body.district
                      : user.district,
                    municipality: req.body.municipality
                      ? req.body.municipality
                      : user.municipality,
                    metroDistrict: req.body.metroDistrict
                      ? req.body.metroDistrict
                      : user.metroDistrict,
                    municipalRegion: req.body.municipalRegion
                      ? req.body.municipalRegion
                      : user.municipalRegion,
                    metroDistrictObj: req.body.metroDistrictObj_id
                      ? {
                          _id: req.body.metroDistrictObj_id,
                          cndName: req.body.metroDistrictObj_cndName,
                        }
                      : user.metroDistrictObj,
                    municipalRegionObj: req.body.municipalRegionObj_id
                      ? {
                          _id: req.body.municipalRegionObj_id,
                          cndName: req.body.municipalRegionObj_cndName,
                        }
                      : user.municipalRegionObj,
                    stationedAt: req.body.stationedAt
                      ? req.body.stationedAt
                      : user.stationedAt,
                    supervisor: req.body.supervisor
                      ? req.body.supervisor
                      : null,
                    status: req.body.status ? req.body.status : user.status,
                    supervisorRole: req.body.supervisorRole
                      ? req.body.supervisorRole
                      : null,
                  },
                  { new: true },
                  function (err, result) {
                    if (err) {
                      return res.status(400).json({
                        success: false,
                        responseCode: 400,
                        msg: "Internal Server Error.",
                        error: err,
                      });
                    } else {
                      var result = JSON.parse(JSON.stringify(result));

                      if (req.user._id)
                        loghistory(
                          req.user._id,
                          "User Update",
                          "Update",
                          "users",
                          "Update User",
                          req.get("referer"),
                          user,
                          result
                        );

                      res.status(200).json({
                        success: true,
                        responseCode: 200,
                        msg: "User updated sucessfully.",
                        result,
                      });
                    }
                  }
                );
                if (fileName != "default.png") {
                  User.findByIdAndUpdate(
                    req.body.id,
                    {
                      imageName: fileName,
                    },
                    { new: true }
                  );
                }
              }
            }
          );
        }
      } else {
        var userData = await User.findOne({
          email: req.body.email,
          deleted: masterConst.not_deleted,
        });
        if (userData) {
          res.status(400).json({
            success: false,
            msg: "Email already registered!, please try with another.",
          });
        } else {
          var signupObj = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            phone: req.body.phone,
            password: req.body.password,
            email: req.body.email,
            // isAdmin: req.body.isAdmin,
            userGroup: req.body.userGroup,
            parentCustomer: req.body.parentCustomer,
            status: req.body.status,
            created: new Date().getTime(),
            updated: new Date().getTime(),
            deleted: req.body.deleted,
            imageName: fileName,

            district: req.body.district,
            municipality: req.body.municipality,

            metroDistrict: req.body.metroDistrict
              ? req.body.metroDistrict
              : null,
            municipalRegion: req.body.municipalRegion
              ? req.body.municipalRegion
              : null,
            metroDistrictObj: {
              _id: req.body.metroDistrictObj_id,
              cndName: req.body.metroDistrictObj_cndName,
            },
            municipalRegionObj: {
              _id: req.body.municipalRegionObj_id,
              cndName: req.body.municipalRegionObj_cndName,
            },

            stationedAt: req.body.stationedAt,
            supervisor: req.body.supervisor ? req.body.supervisor : null,
            supervisorRole: req.body.supervisorRole
              ? req.body.supervisorRole
              : null,
          };

          var newUser = new User(signupObj);

          newUser.save(function (err) {
            console.log("errors", err);
            if (err) {
              if (
                (err.name === "BulkWriteError" || err.name === "MongoError") &&
                err.code === 11000
              ) {
                return res.status(400).json({
                  success: false,
                  msg: "Email already exist!, please try with another.",
                });
              } else {
                if (err.errors && err.errors.mobilenumber)
                  return res.status(400).json({
                    success: false,
                    msg: err.errors.mobilenumber.message,
                  });
                else
                  return res.status(400).json({
                    success: false,
                    msg: "Some thing is wrong.",
                    error: err.errors,
                  });
              }
            }
            var result = JSON.parse(JSON.stringify(newUser));
            if (req.user._id)
              loghistory(
                req.user._id,
                "User Add",
                "Add",
                "users",
                "Add User",
                req.get("referer"),
                null,
                result
              );
            //delete result.service_category;
            /*utilityService.sendSms(
          "91" + req.body.mobilenumber,
          "Thanks for Registering on Transporter App."
        );
        */
            res.status(200).json({
              success: true,
              msg: "User added successfully.",
              result: result,
            });
          });
        }
      }
    }
  }
);

//method created on 21-Jun-2021, to get reporting users
const getUserHierarchy = async (supervisor, childArray) => {
  const getChildren = await User.find(
    { supervisor: supervisor },
    { _id: 1, metroDistrictObj: 1, municipalRegionObj: 1 }
  );
  if (getChildren) {
    for (let i = 0; i < getChildren.length; i++) {
      //console.log("getChildren[i] : ", getChildren[i]);
      let obj = {};
      obj._id = getChildren[i]._id;
      obj.district = getChildren[i].metroDistrictObj
        ? getChildren[i].metroDistrictObj._id
        : "";
      obj.municipality = getChildren[i].municipalRegionObj
        ? getChildren[i].municipalRegionObj._id
        : "";
      childArray.push(obj);
      await getUserHierarchy(getChildren[i]._id, childArray);
    }
  }
};

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *      - Login
 *     description: Returns a object of User registered in system
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: Email from User Registered
 *         in: formData
 *       - name: password
 *         descriptionn: password
 *         in: formData
 *         required: true
 *         type: string
 *         format: password
 *     responses:
 *       200:
 *         description: Completed Object of user number with JWT token
 *         schema:
 *            $ref: '#/definitions/User'
 */

/**************Login API*************/
router.post("/api/login", async (req, res) => {
  const response = {};
  /*
  if (!req.body.userName && !req.body.email) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Email/Username Number for login"
    });
  }
  const update_login_date = {};
  update_login_date.loginDate = new Date().getTime();
  //var userName = new RegExp(["^", req.body.username, "$"].join(""), "i");
User.findOne(
    {
      //mobilenumber: req.body.mobilenumber,
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
      deleted: masterConst.not_deleted
    },
    function(err, user) {
      if (err) {
        console.log("err", err);
        res.status(400).json({ success: false, msg: "Internal Server Error." });
      }
      if (!user || user.deleted == 1) {
        return res.status(400).json({
          responseCode: 400,
          success: false,
          msg: "Authentication failed. User not found."
        });
        // res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        //console.log(user);
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            response.token = jwt.sign(
              {
                expiredAt: Date.now() + expiredAfter,
                //mobilenumber: user.mobilenumber,
                email: user.email,
                //name: user.name,
                id: user._id
              },
              secretKey
            );
            User.findOneAndUpdate(
              { _id: user._id },
              { login_date: update_login_date },
              { new: true }
            )
              .populate({
                path: "userGroup",
                model: "user_groups"
              })
              .exec(function(err, user) {
                if (err) {
                  return res.status(400).json({
                    err: err,
                    responseCode: 400,
                    success: false,
                    msg: "Authentication failed. Wrong creditinals."
                  });
                }
                // Clone object and append token 
                var result = JSON.parse(JSON.stringify(user));
                result.token = response.token;

                res.status(200).json({
                  success: true,
                  responseCode: 200,
                  msg: "Logged in successfully.",
                  loginResult: result
                });
              });
          } else {
            //response.error = 'Authentication failed. Wrong Password.';
            //res.json(response);
            return res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Authentication failed.Incorrect Email or Password."
            });
          }
        });
      }
    }
  );
  */

  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  if (!req.body.userName && !req.body.email) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Email/Username Number for login",
    });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    //return res.status(400).send("Invalid email or password.");
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Authentication failed. Invalid Email or Password.",
    });
  }
  if (user && user.status === 0) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Inactive Account, please contact System Admin",
    });
  }

  let userGroup = await UserGroup.findById(user.userGroup);

  if (!checkUserGroupPermission(userGroup.permission, "Login Access")) {
    //return res.status(400).send("You are not authorized.");
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "You are not authorized, please contact System Admin to have login access",
    });
  }
  if (!checkUserGroupPermission(userGroup.permission, "Dashboard")) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Authorized User, please contact System Admin to have dashboard access",
    });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    //   return res.status(400).send("Invalid email or password.");
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Authentication failed. Invalid Email or Password.",
    });
  }

  //let response;

  var result = JSON.parse(JSON.stringify(user));

  await user.generateAuthToken().then((data) => {
    result.token = data.token;
  });
  await user.genUploadToken().then((data) => {
    result.uploadToken = data.uploadToken;
  });

  let childArray = [];
  await getUserHierarchy(user._id, childArray);
  result.childArray = childArray;

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Logged in successfully.",
    loginResult: result,
  });

  // res.send(response);
});

function validate(req) {
  const schema = {
    email: Joi.string().max(255).required(),
    password: Joi.string().max(255).required(),
  };

  return Joi.validate(req, schema);
}
/**************END LOGIN API****************/

function encrypt(text) {
  var cipher = crypto.createCipher("aes-256-cbc", "d6F3Efeq");
  var crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

/**************END LOGIN API****************/

/**
 * @swagger
 * /api/userlist:
 *   get:
 *     tags:
 *      - Userlist
 *     description: Returns a list Users in system
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in:  query
 *         type: string
 *       - name: userGroup
 *         in:  query
 *         type: string
 *       - name: parentCustomer
 *         in:  query
 *         type: string
 *     responses:
 *       200:
 *         description: Array list of Users's
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
 *             $ref: '#/definitions/User'
 *
 *
 */
/************* USER LIST API****************/
router.get("/api/userlist", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.firstName) {
    // dbquery.name  =new RegExp(req.query.name, "i");
    dbquery.firstName = new RegExp(req.query.firstName, "i");
  }

  if (req.query.lastName) {
    // dbquery.name  =new RegExp(req.query.name, "i");
    dbquery.lastName = new RegExp(req.query.lastName, "i");
  }
  if (req.query.phone) {
    dbquery.phone = req.query.phone;
  }

  if (req.query.email) {
    dbquery.email = req.query.email;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }
  if (req.query.userGroup) {
    dbquery.userGroup = req.query.userGroup;
  }

  if (req.query.parentCustomer) {
    dbquery.parentCustomer = req.query.parentCustomer;
  }

  var dbquery_search = "";
  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  /*  var sortby = "_id"; 
    var sortorder = -1; 

    if(req.query.sortby)
      sortby = req.query.sortby;
    
    if(req.query.sortorder)
      sortorder = req.query.sortorder; */

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
  User.find({
    $and: [
      dbquery,
      {
        $or: [
          { firstName: { $regex: dbquery_search, $options: "i" } },
          { lastName: { $regex: dbquery_search, $options: "i" } },
          { email: { $regex: dbquery_search, $options: "i" } },
          { phone: { $regex: dbquery_search, $options: "i" } },
        ],
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
      User.find(
        {
          $and: [
            dbquery,
            {
              $or: [
                { firstName: { $regex: dbquery_search, $options: "i" } },
                { lastName: { $regex: dbquery_search, $options: "i" } },
                { email: { $regex: dbquery_search, $options: "i" } },
                { phone: { $regex: dbquery_search, $options: "i" } },
              ],
            },
          ],
        },
        {}
      )
        .populate({
          path: "userGroup",
          model: "user_groups",
          select: "_id groupName",
        })
        .populate({
          path: "supervisor",
          model: "users",
          select: "_id firstName lastName",
        })
        .populate({
          path: "supervisorRole",
          model: "user_groups",
          select: "_id groupName",
        })
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, userInformation) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "Error fetching data",
            });
          } else {
            //    var totalPages = Math.ceil(totalCount / size)
            res.status(200).json({
              success: true,
              responseCode: 200,
              msg: "List fetched successfully",
              result: userInformation,
              totalRecCount: totalCount,
            });
          }
        });
    });
});

// router.get("/api/users", async (req, res) => {
//   // const {id} = req.params
//   const user = await User.find()
//     .populate({
//       path: "userGroup",
//       model: "user_groups"
//     })
//     .select("-password");
//   res.send(user);
//   //console.log(user);
// });

/************* Get Single User API****************/
router.get("/api/userlist/:id", auth, function (req, res) {
  User.findById(req.params.id).exec(function (err, cndInfo) {
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

/************* Get Active Users ******************/
router.get("/api/activeusers", auth, function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.firstName) {
    // dbquery.name  =new RegExp(req.query.name, "i");
    dbquery.firstName = new RegExp(req.query.firstName, "i");
  }

  if (req.query.lastName) {
    // dbquery.name  =new RegExp(req.query.name, "i");
    dbquery.lastName = new RegExp(req.query.lastName, "i");
  }
  if (req.query.phone) {
    dbquery.phone = req.query.phone;
  }

  if (req.query.email) {
    dbquery.email = req.query.email;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }
  if (req.query.userGroup) {
    dbquery.userGroup = req.query.userGroup;
  }

  if (req.query.parentCustomer) {
    dbquery.parentCustomer = req.query.parentCustomer;
  }

  var dbquery_search = "";
  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  /******* pagination query started here ***********/
  var pageNo = parseInt(req.query.pageNo); //req.query.pageNo
  var size = parseInt(req.query.per_page); //

  /*  var sortby = "_id"; 
    var sortorder = -1; 

    if(req.query.sortby)
      sortby = req.query.sortby;
    
    if(req.query.sortorder)
      sortorder = req.query.sortorder; */

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
  User.find({
    $and: [
      { status: 1 },
      dbquery,
      {
        $or: [
          { firstName: { $regex: dbquery_search, $options: "i" } },
          { lastName: { $regex: dbquery_search, $options: "i" } },
          { email: { $regex: dbquery_search, $options: "i" } },
          { phone: { $regex: dbquery_search, $options: "i" } },
        ],
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
      User.find(
        {
          $and: [
            { status: 1 },
            dbquery,
            {
              $or: [
                { firstName: { $regex: dbquery_search, $options: "i" } },
                { lastName: { $regex: dbquery_search, $options: "i" } },
                { email: { $regex: dbquery_search, $options: "i" } },
                { phone: { $regex: dbquery_search, $options: "i" } },
              ],
            },
          ],
        },
        { _id: 1, firstName: 1, lastName: 1 }
      )
      /*
        .populate({
          path: "userGroup",
          model: "user_groups",
          select: "_id groupName",
        })
        .populate({
          path: "supervisor",
          model: "users",
          select: "_id firstName lastName",
        })
        .populate({
          path: "supervisorRole",
          model: "user_groups",
          select: "_id groupName",
        })
        */
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, userInformation) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "Error fetching data",
            });
          } else {
            //    var totalPages = Math.ceil(totalCount / size)
            res.status(200).json({
              success: true,
              responseCode: 200,
              msg: "List fetched successfully",
              result: userInformation,
              totalRecCount: totalCount,
            });
          }
        });
    });
});

router.post("/api/changePassword", auth, async (req, res) => {
  const response = {};
  if (!req.body.userid) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Unknown UserID",
    });
  }

  if (!req.body.currentPassword) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Current Password",
    });
  }
  if (!req.body.newPassword) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter New Password",
    });
  }
  let user = await User.findOne({ _id: req.body.userid });
  if (!user) {
    //return res.status(400).send("Invalid email or password.");
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Invalid UserID.",
    });
  }

  const validPassword = await bcrypt.compare(
    req.body.currentPassword,
    user.password
  );

  if (!validPassword) {
    //   return res.status(400).send("Invalid email or password.");
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Invalid Current Password.",
    });
  }

  const samePassword = await bcrypt.compare(
    req.body.newPassword,
    user.password
  );

  if (samePassword) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Current Password & New Password are same, try another one.",
    });
  }

  const newuser = await User.findByIdAndUpdate(
    req.body.userid,
    {
      password: req.body.newPassword,
    },
    { new: true }
  );

  var result = JSON.parse(JSON.stringify(user));
  // await user.generateAuthToken().then((data) => {
  //   result.token = data.token;
  // });

  if (req.body.userid)
    loghistory(
      req.body.userid,
      "User Password Update",
      "Add",
      "users",
      "Update User",
      req.get("referer"),
      user,
      newuser
    );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Password changed successfully.",
    result: result,
  });

  // res.send(response);
});

router.post("/api/forgotPassword", async (req, res) => {
  //should not change for admin@dmin.com //super user
  if (req.body.email === "admin@admin.com")
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "You cannot update super admin password.",
    });
  const response = {};

  if (!req.body.email) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Please enter Email",
    });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    //return res.status(400).send("Invalid email or password.");
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "This email id is not registered with us, Please enter your registered email!.",
    });
  }

  const randpassword = "dardlea@" + Math.floor(1000 + Math.random() * 9000);

  const newuser = await User.findByIdAndUpdate(
    user._id,
    {
      password: randpassword,
    },
    { new: true }
  );

  var result = JSON.parse(JSON.stringify(user));
  // await user.generateAuthToken().then((data) => {  //   result.token = data.token;
  // });

  if (req.body.userid)
    loghistory(
      req.body.userid,
      "Forgot Password",
      "Edit",
      "users",
      "Update User",
      req.get("referer"),
      user,
      newuser
    );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "New Password sent to the mail.",
    result: result,
  });

  ///sending mail
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
    to: req.body.email, // list of receivers
    subject: "New Password", // Subject line
    //text:  req.body.subject, // plain text body
    html:
      "<div style='font-family: Trebuchet MS;font-size:14px; color:darkblue'>" +
      "Dear " +
      user.firstName +
      " " +
      user.lastName +
      ", <br/>" +
      "Please see the below newly generated password: <br/>" +
      "<b>" +
      randpassword +
      "</b><br/><br/>- Thank you" +
      "</div>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    //res.render('index');
  });

  ////send mail
});

router.get("/api/getchildusers", async function (req, res) {
  let childArray = [];
  await getUserHierarchy(req.query.supervisor, childArray);

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Children Fetched Successfully",
    result: childArray,
  });
});

router.post("/api/userlist_hierarchy", auth, function (req, res) {
  /*********Search Query build ************/
  //console.log("xxx sss: ", req.body);
  let childUsersQuery = {};
  let childArray = [];
  if (req.body) {
    if (req.body.childArray) {
      childArray = req.body.childArray.map((a) => a._id);
    }
  }
  if (childArray.length > 0) {
    childUsersQuery._id = childArray;
  }
  var dbquery = {};
  if (req.query.firstName) {
    // dbquery.name  =new RegExp(req.query.name, "i");
    dbquery.firstName = new RegExp(req.query.firstName, "i");
  }

  if (req.query.lastName) {
    // dbquery.name  =new RegExp(req.query.name, "i");
    dbquery.lastName = new RegExp(req.query.lastName, "i");
  }
  if (req.query.phone) {
    dbquery.phone = req.query.phone;
  }

  if (req.query.email) {
    dbquery.email = req.query.email;
  }
  if (req.query.id) {
    dbquery._id = req.query.id;
  }
  if (req.query.userGroup) {
    dbquery.userGroup = req.query.userGroup;
  }

  if (req.query.parentCustomer) {
    dbquery.parentCustomer = req.query.parentCustomer;
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
  //console.log("query================", dbquery);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  User.find({
    $and: [
      dbquery,
      {
        $or: [
          { firstName: { $regex: dbquery_search, $options: "i" } },
          { lastName: { $regex: dbquery_search, $options: "i" } },
          { email: { $regex: dbquery_search, $options: "i" } },
          { phone: { $regex: dbquery_search, $options: "i" } },
        ],
      },
      childUsersQuery,
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
      User.find(
        {
          $and: [
            dbquery,
            {
              $or: [
                { firstName: { $regex: dbquery_search, $options: "i" } },
                { lastName: { $regex: dbquery_search, $options: "i" } },
                { email: { $regex: dbquery_search, $options: "i" } },
                { phone: { $regex: dbquery_search, $options: "i" } },
              ],
            },
            childUsersQuery,
          ],
        },
        {}
      )
        .populate({
          path: "userGroup",
          model: "user_groups",
          select: "_id groupName",
        })
        .populate({
          path: "supervisor",
          model: "users",
          select: "_id firstName lastName",
        })
        .populate({
          path: "supervisorRole",
          model: "user_groups",
          select: "_id groupName",
        })
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, userInformation) {
          if (err) {
            res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error fetching data",
              result: "Error fetching data",
            });
          } else {
            //    var totalPages = Math.ceil(totalCount / size)
            res.status(200).json({
              success: true,
              responseCode: 200,
              msg: "List fetched successfully",
              result: userInformation,
              totalRecCount: totalCount,
            });
          }
        });
    });
});

router.post("/api/update_usersignature", auth, async (req, res) => {
  if (!req.body.userid) {
    res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Unknown UserID",
    });
  }

  let user = await User.findOne({ _id: req.body.userid });
  if (!user) {
    return res.status(400).json({
      success: false,
      responseCode: 400,
      msg: "Invalid UserID.",
    });
  }

  const newuser = await User.findByIdAndUpdate(
    req.body.userid,
    {
      signature: req.body.signature,
    },
    { new: true }
  );

  var result = JSON.parse(JSON.stringify(user));

  if (req.body.userid)
    loghistory(
      req.body.userid,
      "User Signature Update",
      "Add",
      "users",
      "Update User",
      req.get("referer"),
      user,
      newuser
    );

  res.status(200).json({
    success: true,
    responseCode: 200,
    msg: "Signature updated successfully.",
    result: result,
  });
});

module.exports = router;
