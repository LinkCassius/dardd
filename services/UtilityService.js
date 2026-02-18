var mongoose = require("mongoose");
var express = require("express");
var User = require("../models/User");
const Config = require("../config/config");
var AWS = require("aws-sdk");

const {
  port,
  secretKey,
  expiredAfter,
  masterConst,
  accessKeyId,
  secretAccessKey
} = Config;
module.exports = {
  sendSms: function(mobileNumber, msg) {
    AWS.config.region = "ap-southeast-1";
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    });

    var sns = new AWS.SNS();
    var params = {
      Message: msg,
      MessageStructure: "string",
      PhoneNumber: mobileNumber,
      Subject: "TT-DON'T DISTURB"
    };

    sns.publish(params, function(err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data); // successful response
    });
  }
};
