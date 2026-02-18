const Config = require("../config/config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
const UserGroup = require("./UserGroup");

const userImagePath = "images/users";
const { port, secretKey, expiredAfter, masterConst } = Config;

/**
 * @swagger
 * definitions:
 *  User:
 *    type: object
 *    properties:
 *      firstName:
 *        type: string
 *      lastName:
 *        type: string
 *      userName:
 *        type: string
 *      phone:
 *        type: string
 *      email:
 *        type: string
 *      userGroup:
 *        type: string
 *      parentCustomer:
 *        type: string
 *      isAdmin:
 *        type: boolean
 *      status:
 *        type: number
 *      deleted:
 *        type: number
 *
 */
var UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    default: null,
  },
  createdDate: {
    type: "number",
    default: new Date().getTime(),
  },
  updatedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  deletedDate: {
    type: "number",
    default: new Date().getTime(),
  },
  status: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.active,
  },
  userGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserGroup",
    required: true,
  },
  parentCustomer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    default: null,
  },
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },
  imageName: {
    type: String,
  },
  loginDate: { type: Number, default: null },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  district: {
    type: String,
    default: null,
  },
  municipality: {
    type: String,
    default: null,
  },
  stationedAt: {
    type: String,
    default: null,
  },
  metroDistrict: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  municipalRegion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  metroDistrictObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  municipalRegionObj: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  supervisorRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserGroup",
    default: null,
  },
  signature: {
    type: String,
    default: "",
  },
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (user.password) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      //console.log(user.password);
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;

        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.pre("findOneAndUpdate", function (next) {
  var user = this._update;
  if (user.password) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      //console.log(user.password);
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;

        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

/*
UserSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      //mobilenumber: this.mobilenumber,
      email: this.email,
      // name: this.name,
      exp: parseInt(expiry.getTime() / 1000)
    },
    secretKey
  ); // DO NOT KEEP YOUR SECRET IN THE CODE!
};
*/
/////

UserSchema.methods.generateAuthToken = async function () {
  var ObjectId = mongoose.Types.ObjectId;
  let userG = await UserGroup.findOne({ _id: new ObjectId(this.userGroup) });
  const token = jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      parentCustomer: this.parentCustomer,
      userGroup: this.userGroup,
      role: userG.groupName,
      permission: userG.permission,
      expiredAt: Date.now() + expiredAfter,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: config.get("tokenLife") }
  );
  const refreshToken = jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
    },
    config.get("jwtRefreshPrivateKey"),
    { expiresIn: config.get("refreshTokenLife") }
  );
  const response = {
    token: token,
    refreshToken: refreshToken,
  };
  return response;
};

UserSchema.methods.genUploadToken = async function () {
  const uploadToken = jwt.sign(
    {
      email: this.email,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "5000d" } // empty {} means expiry time is not mentioned, infinite time
  );

  const response = {
    uploadToken: uploadToken,
  };
  return response;
};

UserSchema.methods.generateFarmerToken = async function () {
  const farmersToken = jwt.sign(
    {
      email: this.email,
      expiredAt: Date.now() + expiredAfter,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: config.get("tokenLife") }
  );

  const response = {
    farmersToken: farmersToken,
  };
  return response;
};

///////

const User = mongoose.model("users", UserSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().min(5).max(50).required(),
    password: Joi.string().required(),
    // .regex(
    //   /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@])(?!.*[iIoO])\S{6,12}$/
    // )
  };

  return Joi.validate(user, schema);
}
exports.userImagePath = userImagePath;
//exports.User = User;
exports.validate = validateUser;
exports.UserSchema = UserSchema;

//module.exports = mongoose.model("users", UserSchema);

exports.User = User;
