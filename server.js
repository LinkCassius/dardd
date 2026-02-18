//import express from "express";
const express = require("express");
//import bodyParser from "body-parser";
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const config = require("config");

//import cors from "cors";
const cors = require("cors");
//import Config from "./config/config";
const Config = require("./config/config");
//import Database from "./config/db";
const Database = require("./config/db");
var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");
var register = require("./routes/FarmerDetail");
var cnds = require("./routes/Cnds");
var customer = require("./routes/Customers");
var contract = require("./routes/Contracts");
var contractDeliverables = require("./routes/ContractDeliverables");
var user = require("./routes/User");
var userGroup = require("./routes/UserGroup");
var screens = require("./routes/screencategories");
var farmerProduction = require("./routes/FarmerProduction");
var farmAssetsServices = require("./routes/FarmAssetsServices");
var farmerReporting = require("./routes/FarmerReporting");
var widgets = require("./routes/widgets");
var kpi = require("./routes/Kpi");
var activity = require("./routes/Activities");
var contractTask = require("./routes/ContractTasks");
var contractVariation = require("./routes/ContractVariations");
var contractMilestone = require("./routes/ContractMilestones");
var contractPayment = require("./routes/ContractPayments");
var contractDimension = require("./routes/ContractDimensions");
var contractDocument = require("./routes/ContractDocuments");
var contractServiceProviders = require("./routes/ContractServiceProviders");
var contractRetentionReport = require("./routes/ContractRetentionReport");

var performanceDocument = require("./routes/PerformanceDocuments");
var LiveStockDetails = require("./routes/LiveStockDetails");

var approvalAreas = require("./routes/ApprovalAreas");
var approvalSetup = require("./routes/ApprovalSetup");
var approvalHistory = require("./routes/ApprovalHistory");

var Programs = require("./routes/Programs");
var IndicatorTitles = require("./routes/indicatorsTitle");
var PerforanceMng = require("./routes/PerformanceMng");
var bank = require("./routes/Banks");
var Interactions = require("./routes/farmerInteraction");
var UploadFarmers = require("./routes/UploadFarmersJSON");
var exportFarmers = require("./routes/exportExcel");
//var testSendACS = require("./routes/TestSendACS");

//var asample = require("./routes/asample");

//var swaggerJSDoc = require("swagger-jsdoc");
//var swaggerUi = require("swagger-ui-express"),
//  swaggerDocument = require("./swagger.json");
//swaggerDocument = require('./swaggers.json');

var app = express();

const { port } = Config;

mongoose.Promise = require("bluebird");
mongoose
  .connect(Database.database, { useNewUrlParser: true })
  .then(() => {
    // if all is ok we will be here
    console.log("Starttttttttttttttttt");
  })
  .catch((err) => {
    // if error we will be here
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ status: "OK, API RUNNING" });
});

app.get("/uploads/*", function (req, res, next) {
  let access_token =
    (req.query.token && req.query.token !== "") ||
    req.query.token != null ||
    req.query.token != undefined
      ? req.query.token
      : "";

  userIsAllowed(access_token, function (allowed) {
    if (allowed) {
      next(); // call the next handler, which in this case is express.static
    } else {
      res.end("You are not allowed!");
    }
  });
});

///////////

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "http://djitalagri.azurewebsites.net"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,x-auth-token,x-refresh-token"
  );
  next();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,x-auth-token,x-refresh-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  next();
});

//////////

//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//app.use('/api-docs', swaggerDocCreate);
//app.use('/api/v1', router);

//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

function userIsAllowed(access_token, callback) {
  // this function would contain your logic, presumably asynchronous,
  // about whether or not the user is allowed to see files in the
  // protected directory; here, we'll use a default value of "false"
  try {
    jwt.verify(access_token, config.get("jwtPrivateKey"));
    callback(true);
  } catch (ex) {
    callback(false);
  }
}

app.use(cors());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use("/", register);
app.use("/", cnds);
app.use("/", user);
app.use("/", customer);
app.use("/", contract);
app.use("/", contractDeliverables);
app.use("/", userGroup);
app.use("/", screens);
app.use("/", farmerProduction);
app.use("/", farmAssetsServices);
app.use("/", farmerReporting);
app.use("/", widgets);
app.use("/", kpi);
app.use("/", activity);
app.use("/", contractTask);
app.use("/", contractVariation);
app.use("/", contractMilestone);
app.use("/", contractPayment);
app.use("/", contractDimension);
app.use("/", contractDocument);
app.use("/", contractServiceProviders);
app.use("/", contractRetentionReport);

app.use("/", performanceDocument);
app.use("/", LiveStockDetails);
app.use("/", approvalAreas);
app.use("/", approvalSetup);
app.use("/", approvalHistory);
app.use("/", Programs);
app.use("/", IndicatorTitles);
app.use("/", PerforanceMng);
app.use("/", bank);
app.use("/", Interactions);
app.use("/", UploadFarmers);
app.use("/", exportFarmers);
// app.use("/", asample);

// Start the server
app.listen(port, function () {
  console.log("Server is running on Port: ", port);
});
//app.timeout = 360000;

module.exports = app;
