const express = require("express");
var ContractDocuments = require("../models/ContractDocuments");

const upploadFilefunction = async (
  contractId,
  name,
  docCollection,
  isFolder,
  uploadDate,
  parent,
  refId,
  refType
) => {
  try {
    let uploadfile = new ContractDocuments({
      contractId: contractId,
      name: name,
      docCollection: docCollection,
      isFolder: isFolder,
      uploadDate: uploadDate,
      parent: parent,
      refId: refId,
      refType: refType,
    });
    uploadfile = await uploadfile.save();
  } catch (error) {
    console.log(error);
  }
};
module.exports = upploadFilefunction;
