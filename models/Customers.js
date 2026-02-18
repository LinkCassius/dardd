const Joi = require("joi");
const mongoose = require("mongoose");
const customerLogoPath = "images/customers";
const Config = require("../config/config");
const { masterConst } = Config;

// /**
//  * @swagger
//  * definitions:
//  *  Customer:
//  *    type: object
//  *    properties:
//  *      customerName:
//  *        type: string
//  *      phone:
//  *        type: string
//  *      email:
//  *        type: string
//  *      customerpath:
//  *        type: string
//  *      logoPath:
//  *        type: string
//  *      logoName:
//  *        type: string
//  *      zipcode:
//  *        type: string
//  *      externalref:
//  *        type: string
//  *      fax:
//  *        type: string
//  *      country:
//  *        type: string
//  *      address:
//  *        type: string
//  *      addressextended:
//  *        type: string
//  *      status:
//  *        type: number
//  *      priority:
//  *        type: number
//  *      parent:
//  *        type: string
//  *      createdDate:
//  *        type: number
//  *      updatedDate:
//  *        type: number
//  *      deleted:
//  *        type: number
//  *
//  */

const customerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  customerpath: {
    type: String,
    minlength: 5,
    maxlength: 50,
    default: null,
  },
  logoPath: {
    type: String,
    default: null,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    default: null,
  },
  logoName: {
    type: String,
    default: null,
  },
  children: [],
  zipcode: {
    type: String,
    default: null,
  },
  externalref: {
    type: String,
    default: null,
  },
  fax: {
    type: String,
    default: null,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cnds",
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  addressextended: {
    type: String,
    default: null,
  },

  status: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.active,
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
  deleted: {
    type: "number",
    isIn: [0, 1],
    default: masterConst.not_deleted,
  },
});

const Customer = mongoose.model("customers", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required(),
    customerId: Joi.objectId().required(),
    countryId: Joi.objectId().required(),
    customerpath: Joi.string().min(5).max(255),
    fax: Joi.string(),
    zipcode: Joi.string(),
    externalref: Joi.string(),
    address: Joi.string(),
    addressextended: Joi.string(),
  };

  return Joi.validate(customer, schema);
}

exports.customerLogoPath = customerLogoPath;
exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;

module.exports = mongoose.model("customers", customerSchema);
