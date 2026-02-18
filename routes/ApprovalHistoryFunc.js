const express = require("express");

var ApprovalHistory = require("../models/ApprovalHistory");

const approrvalhistoryfunction = async (
  approvalArea,
  applicationId,
  approvalLevel,
  approvalType,
  sequence,
  applicationObject
) => {
  try {
    let approvalhistory = new ApprovalHistory({
      approvalArea: approvalArea,
      applicationId: applicationId,
      approvalLevel: approvalLevel,
      approvalType: approvalType,
      sequence: sequence,
      approvalDate: new Date().getTime(),
      applicationObject: applicationObject ? applicationObject : null,
    });
    approvalhistory = await approvalhistory.save();
  } catch (error) {
    console.log(error);
  }
};
module.exports = approrvalhistoryfunction;
