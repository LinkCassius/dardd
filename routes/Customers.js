var mongoose = require("mongoose");
var Customer = require("../models/Customers");
const express = require("express");
const multer = require("multer");
const path = require("path");
//const uploadPath = path.join("public", customerLogoPath);
const router = express.Router();
// const auth = require("../middleware/auth");
const uuidv4 = require("uuid/v4");
const parentId = "5d44581e80b4dc41e48e9c3f";

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
/*
router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/api/customers", upload.single("custLogo"), async (req, res) => {
  const fileName =
    typeof req.file !== "undefined"
      ? req.file != null
        ? req.file.filename
        : "default"
      : "default";
  delete req.body.custLogo;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const parentcustomer = await Customer.findById(req.body.customerId);
  if (!parentcustomer) return res.status(400).send("Invalid Parent Customer.");
  const country = await Country.findById(req.body.countryId);
  if (!country) return res.status(400).send("Invalid Country.");

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    customer: parentcustomer,
    customerpath: "customerpath",
    logoName: fileName,
    country: country,
    fax: req.body.fax,
    externalref: req.body.externalref,
    zipcode: req.body.zipcode,
    address: req.body.address,
    addressextended: req.body.addressextended
  });

  customer = await customer.save();
  if (!customer) return res.status(400).send("No details available.");
  let editcustomer = await Customer.findByIdAndUpdate(
    customer._id,
    {
      customerpath:
        parentcustomer.customerpath.toString() + customer._id.toString() + "/"
    },
    { new: true }
  );
  loghistory(req.params.userid, "Insert", "Customers", customer, null);
  res.send(customer);
});
*/

// /**
//  * @swagger
//  * /api/customer:
//  *   post:
//  *     tags:
//  *       - Add / Update, List customers
//  *     description: Returns a object of Customer
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: customerName
//  *         description: name of customer
//  *         in: formData
//  *         required: true
//  *         type: string
//  *       - name: phone
//  *         description: phone of customer
//  *         in: formData
//  *         type: string
//  *       - name: email
//  *         description: email of customer
//  *         in: formData
//  *         required: true
//  *         type: string
//  *         format: email
//  *       - name: customerpath
//  *         description: path of customer
//  *         in: formData
//  *         type: string
//  *       - name: logoPath
//  *         description: logo path of customer
//  *         in: formData
//  *         type: string
//  *       - name: logoName
//  *         description: logo Name of customer
//  *         in: formData
//  *         type: string
//  *       - name: zipcode
//  *         description: zipcode of customer
//  *         in: formData
//  *         type: string
//  *       - name: externalref
//  *         description: zipcode of customer
//  *         in: formData
//  *         type: string
//  *       - name: fax
//  *         description: fax of customer
//  *         in: formData
//  *         type: string
//  *       - name: country
//  *         description: fax of customer
//  *         in: formData
//  *         type: string
//  *       - name: address
//  *         description: fax of customer
//  *         in: formData
//  *         type: string
//  *       - name: addressextended
//  *         description: fax of customer
//  *         in: formData
//  *         type: string
//  *       - name: addressextended
//  *         description: fax of customer
//  *         in: formData
//  *         type: string
//  *       - name: status
//  *         description: status of customer
//  *         in: formData
//  *         type: number
//  *       - name: deleted
//  *         description: customer is deleted or not [0-> not deleted,1->deleted]
//  *         in: formData
//  *         type: number
//  *       - name: parent
//  *         description: objectId of parent customer
//  *         in: formData
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: An Object of registered user
//  *         schema:
//  *            $ref: '#/definitions/Customer'
//  */

/************Start Customer ADD/UPDATE API ************************* */
router.post(
  "/api/customer",
  upload.single("custLogo"),
  async function (req, res) {
    console.log("body", req.body);
    if (!req.body.customerName) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter customerName.",
      });
    } else if (!req.body.email) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Please enter email.",
      });
    } else {
      if (req.body.id) {
        /** Update Customer **/
        Customer.findOne(
          {
            _id: req.body.id,
          },
          function (err, customer) {
            if (err) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Internal Server Error.",
              });
            }
            if (!customer) {
              return res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Customer with given id not exists!",
              });
            } else {
              Customer.findOneAndUpdate(
                {
                  _id: req.body.id,
                },
                {
                  customerName: req.body.customerName,
                  //email: req.body.email,
                  phone: req.body.phone ? req.body.phone : customer.phone,
                  customerpath: req.body.customerpath
                    ? req.body.phone
                    : customer.customerpath,
                  logoPath: req.body.logoPath
                    ? req.body.logoPath
                    : customer.logoPath,
                  parent: req.body.parent ? req.body.parent : customer.parent,
                  logoName: req.body.logoName
                    ? req.body.logoName
                    : customer.logoName,
                  zipcode: req.body.zipcode
                    ? req.body.zipcode
                    : customer.zipcode,
                  externalref: req.body.externalref
                    ? req.body.externalref
                    : customer.externalref,
                  fax: req.body.fax ? req.body.fax : customer.fax,
                  country: req.body.country
                    ? req.body.country
                    : customer.country,
                  address: req.body.address
                    ? req.body.address
                    : customer.address,
                  addressextended: req.body.addressextended
                    ? req.body.addressextended
                    : customer.addressextended,
                  deleted: req.body.deleted
                    ? req.body.deleted
                    : customer.deleted,
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
                      msg: "Customer Updated sucessfully.",
                      result,
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        /** ADD Customer **/
        var customerObj = {
          customerName: req.body.customerName,
          email: req.body.email,
          phone: req.body.phone,
          customerpath: req.body.customerpath,
          logoPath: req.body.logoPath,
          parent: req.body.parent,
          logoName: req.body.logoName,
          zipcode: req.body.zipcode,
          externalref: req.body.externalref,
          fax: req.body.fax,
          country: req.body.country,
          address: req.body.address,
          addressextended: req.body.addressextended,
          deleted: req.body.deleted,
        };
        var newCustomer = new Customer(customerObj);
        newCustomer.save(function (err) {
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
              if (err.errors && err.errors.customerName)
                return res.status(400).json({
                  success: false,
                  responseCode: 400,
                  msg: err.errors.customerName.message,
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
          var result = JSON.parse(JSON.stringify(newCustomer));

          res.status(200).json({
            success: true,
            responseCode: 200,
            msg: req.body.customerName + " added successfully.",
            result: result,
          });
        });
      }
    }
  }
);

/************End Customer ADD/UPDATE API ************************* */

/************Start Customer List API ************************* */
// /**
//  * @swagger
//  * /api/customerlist:
//  *   get:
//  *     tags:
//  *       - Add / Update, List customers
//  *     description: Returns a customer list according to params
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: customerName
//  *         in:  query
//  *         type: string
//  *       - name: parent
//  *         in:  query
//  *         type: string
//  *       - name: country
//  *         in:  query
//  *         type: string
//  *       - name: status
//  *         in:  query
//  *         type: number
//  *       - name: deleted
//  *         in:  query
//  *         type: number
//  *     responses:
//  *       200:
//  *         description: Array list of customers
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
//  *             $ref: '#/definitions/Customer'
//  *
//  *
//  */
/************* Customers LIST API****************/
router.get("/api/customerlist", function (req, res) {
  /*********Search Query build ************/
  var dbquery = {};
  if (req.query.customerName) {
    dbquery.customerName = req.query.customerName;
  }

  if (req.query.country) {
    dbquery.country = req.query.country;
  }

  if (req.query.parent) {
    dbquery.parent = req.query.parent;
  }

  if (req.query.status) {
    dbquery.status = req.query.status;
  }

  if (req.query.deleted) {
    dbquery.status = req.query.deleted;
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
      message: "invalid page number, should start with 1",
    };
    return res.status(400).json(response);
  }
  query.skip = size * (pageNo - 1);
  query.limit = size;
  console.log("query================", query);

  /******* pagination query end here****************/

  /************total count query start here ********/
  // Find some documents
  Customer.find(dbquery)
    .count()
    .exec(function (err, totalCount) {
      console.log("totalCount", totalCount);
      if (err) {
        res.json({ success: false, result: "Error fetching data" });
      }
      Customer.find(dbquery, {})
        .sort({ [sort_field]: sort_mode })
        .skip(query.skip)
        .limit(query.limit)
        .exec(function (err, info) {
          if (err) {
            res.json({ success: false, result: "error" });
          } else {
            var results = [];

            //  var totalPages = Math.ceil(totalCount / size)
            res.status(200).json({
              success: true,
              result: info,
              responseCode: 200,
              msg: "List fetched successfully",
              totalRecCount: totalCount,
            });
          }
        });
    });
});
/************End Customer List API ************************* */
module.exports = router;
