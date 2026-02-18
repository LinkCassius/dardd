const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");

const { masterConst, port, secretKey, expiredAfter } = Config;

var FarmerDetailDumpSchema = new mongoose.Schema({
  TimeStamp: {
    type: String,
    default: null,
  },
  FormDate: {
    type: String,
    default: null,
  },
  FormTime: {
    type: String,
    default: null,
  },
  PenUserDetails: {
    type: String,
    default: null,
  },
  PenUserEmail: { type: String, default: null },
  Geography: {
    type: String,
    default: null,
  },
  GPS: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  PgcFormGUID: {
    type: String,
    default: null,
  },
  GeographyID: {
    type: String,
    default: null,
  },
  ReferenceNumber: {
    type: String,
    default: null,
  },
  FirstStrokeTimeStamp: {
    type: String,
    default: null,
  },
  LastStrokeTimeStamp: {
    type: String,
    default: null,
  },
  damagedform: {
    type: String,
    default: null,
  },
  reference_number: {
    type: String,
    default: null,
  },
  sgcode: {
    type: String,
    default: null,
  },
  longitude: {
    type: String,
    default: null,
  },
  latitude: {
    type: String,
    default: null,
  },
  gpscoordinates: {
    type: String,
    default: null,
  },
  otherspecify1: {
    type: String,
    default: null,
  },
  generalinfo: {
    type: String,
    default: null,
  },
  surname1: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  contactnumber: {
    type: String,
    default: null,
  },
  identitynumber: {
    type: String,
    default: null,
  },
  emailaddress: {
    type: String,
    default: null,
  },
  farmresidentialaddress1: {
    type: String,
    default: null,
  },
  farmresidentialaddress2: {
    type: String,
    default: null,
  },
  postalcode1: {
    type: String,
    default: null,
  },
  farmresidentialaddress3: {
    type: String,
    default: null,
  },
  section2postaladdress1: {
    type: String,
    default: null,
  },
  section2postaladdress2: {
    type: String,
    default: null,
  },
  ua_postalcode2: {
    type: String,
    default: null,
  },
  section2postaladdress3: {
    type: String,
    default: null,
  },
  pwds: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
  demographicsage: {
    type: String,
    default: null,
  },
  populationgroup: {
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: null,
  },
  runningfarm: {
    type: String,
    default: null,
  },
  farmregistered: {
    type: String,
    default: null,
  },
  ownershipoffarm: {
    type: String,
    default: null,
  },
  otherspecify2: {
    type: String,
    default: null,
  },
  farmland: {
    type: String,
    default: null,
  },
  otherspecify3: {
    type: String,
    default: null,
  },
  redistribution: {
    type: String,
    default: null,
  },
  otherspecify4: {
    type: String,
    default: null,
  },
  supportprogramme: {
    type: String,
    default: null,
  },
  otherspecify5: {
    type: String,
    default: null,
  },
  nameoffarm: {
    type: String,
    default: null,
  },
  commonname: {
    type: String,
    default: null,
  },
  farmsizetotal: {
    type: String,
    default: null,
  },
  arable: {
    type: String,
    default: null,
  },
  nonarable: {
    type: String,
    default: null,
  },
  provincefarm: {
    type: String,
    default: null,
  },
  metrodistrict: {
    type: String,
    default: null,
  },
  metropolitanmunicipality: {
    type: String,
    default: null,
  },
  localmunicipality: {
    type: String,
    default: null,
  },
  wardnumber: {
    type: String,
    default: null,
  },
  nearesttown: {
    type: String,
    default: null,
  },
  livestock_3: {
    type: String,
    default: null,
  },
  livestock_4: {
    type: String,
    default: null,
  },
  livestock_5: {
    type: String,
    default: null,
  },
  livestock_1: {
    type: String,
    default: null,
  },
  livestock_2: {
    type: String,
    default: null,
  },
  livestockno3: {
    type: String,
    default: null,
  },
  livestockno4: {
    type: String,
    default: null,
  },
  livestockno5: {
    type: String,
    default: null,
  },
  livestockno1: {
    type: String,
    default: null,
  },
  livestockno2: {
    type: String,
    default: null,
  },
  otherspecify6: {
    type: String,
    default: null,
  },
  horticulture1: {
    type: String,
    default: null,
  },
  horticulture2: {
    type: String,
    default: null,
  },
  horticulture3: {
    type: String,
    default: null,
  },
  horticulture4: {
    type: String,
    default: null,
  },
  otherspecify7: {
    type: String,
    default: null,
  },
  fieldcrops2: {
    type: String,
    default: null,
  },
  fieldcrops3: {
    type: String,
    default: null,
  },
  fieldcrops4: {
    type: String,
    default: null,
  },
  fieldcrops1: {
    type: String,
    default: null,
  },
  fieldcrops5: {
    type: String,
    default: null,
  },
  otherspecify8: {
    type: String,
    default: null,
  },
  forestry1: {
    type: String,
    default: null,
  },
  forestry3: {
    type: String,
    default: null,
  },
  forestry2: {
    type: String,
    default: null,
  },
  forestry4: {
    type: String,
    default: null,
  },
  forestry5: {
    type: String,
    default: null,
  },
  forestry8: {
    type: String,
    default: null,
  },
  forestry6: {
    type: String,
    default: null,
  },
  forestry7: {
    type: String,
    default: null,
  },
  otherspecify9: {
    type: String,
    default: null,
  },
  aquaculture1: {
    type: String,
    default: null,
  },
  aquaculture2: {
    type: String,
    default: null,
  },
  aquaculture3: {
    type: String,
    default: null,
  },
  aquaculture4: {
    type: String,
    default: null,
  },
  otherspecify10: {
    type: String,
    default: null,
  },
  seafishing4: {
    type: String,
    default: null,
  },
  seafishing5: {
    type: String,
    default: null,
  },
  seafishing6: {
    type: String,
    default: null,
  },
  seafishing1: {
    type: String,
    default: null,
  },
  seafishing2: {
    type: String,
    default: null,
  },
  seafishing3: {
    type: String,
    default: null,
  },
  otherspecify11: {
    type: String,
    default: null,
  },
  gamefarming1: {
    type: String,
    default: null,
  },
  gamefarming3: {
    type: String,
    default: null,
  },
  gamefarming4: {
    type: String,
    default: null,
  },
  gamefarming5: {
    type: String,
    default: null,
  },
  gamefarming2: {
    type: String,
    default: null,
  },
  gamefarming6: {
    type: String,
    default: null,
  },
  otherspecify12: {
    type: String,
    default: null,
  },
  production1: {
    type: String,
    default: null,
  },
  production2: {
    type: String,
    default: null,
  },
  production3: {
    type: String,
    default: null,
  },
  otherspecify13: {
    type: String,
    default: null,
  },
  packaging1: {
    type: String,
    default: null,
  },
  packaging2: {
    type: String,
    default: null,
  },
  approximate: {
    type: String,
    default: null,
  },
  fixedstructures7: {
    type: String,
    default: null,
  },
  fixedstructures1: {
    type: String,
    default: null,
  },
  fixedstructures2: {
    type: String,
    default: null,
  },
  fixedstructures3: {
    type: String,
    default: null,
  },
  PigSties: {
    type: String,
    default: null,
  },
  fixedstructures5: {
    type: String,
    default: null,
  },
  fixedstructures6: {
    type: String,
    default: null,
  },
  otherspecify14: {
    type: String,
    default: null,
  },
  machinery1: {
    type: String,
    default: null,
  },
  machinery2: {
    type: String,
    default: null,
  },
  machinery5: {
    type: String,
    default: null,
  },
  machinery3: {
    type: String,
    default: null,
  },
  machinery4: {
    type: String,
    default: null,
  },
  otherspecify15: {
    type: String,
    default: null,
  },
  irrigationsystems5: {
    type: String,
    default: null,
  },
  irrigationsystems2: {
    type: String,
    default: null,
  },
  irrigationsystems3: {
    type: String,
    default: null,
  },
  irrigationsystems4: {
    type: String,
    default: null,
  },
  irrigationsystems6: {
    type: String,
    default: null,
  },
  irrigationsystems1: {
    type: String,
    default: null,
  },
  otherspecify16: {
    type: String,
    default: null,
  },
  waterinfrastructure4: {
    type: String,
    default: null,
  },
  waterinfrastructure1: {
    type: String,
    default: null,
  },
  BoreholesWindmills: {
    type: String,
    default: null,
  },
  waterinfrastructure3: {
    type: String,
    default: null,
  },
  waterinfrastructure5: {
    type: String,
    default: null,
  },
  otherspecify17: {
    type: String,
    default: null,
  },
  ua_implements5: {
    type: String,
    default: null,
  },
  ua_implements3: {
    type: String,
    default: null,
  },
  ua_implements4: {
    type: String,
    default: null,
  },
  implements6: {
    type: String,
    default: null,
  },
  ua_implements1: {
    type: String,
    default: null,
  },
  ua_implements2: {
    type: String,
    default: null,
  },
  otherspecify18: {
    type: String,
    default: null,
  },
  section4other1: {
    type: String,
    default: null,
  },
  section4other2: {
    type: String,
    default: null,
  },
  section4other3: {
    type: String,
    default: null,
  },
  section4other4: {
    type: String,
    default: null,
  },
  otherspecify19: {
    type: String,
    default: null,
  },
  diptank: {
    type: String,
    default: null,
  },
  diptankifyes: {
    type: String,
    default: null,
  },
  whichdoyouuse: {
    type: String,
    default: null,
  },
  veterinaryservices: {
    type: String,
    default: null,
  },
  comments: {
    type: String,
    default: null,
  },
  personname: {
    type: String,
    default: null,
  },
  positiontitle: {
    type: String,
    default: null,
  },
  personpostaladdress_1: {
    type: String,
    default: null,
  },
  personpostaladdress_2: {
    type: String,
    default: null,
  },
  postaladdress_3: {
    type: String,
    default: null,
  },
  postalcode3: {
    type: String,
    default: null,
  },
  physicaladdress1: {
    type: String,
    default: null,
  },
  physicaladdress2: {
    type: String,
    default: null,
  },
  ua_physicaladdress3: {
    type: String,
    default: null,
  },
  postalcode4: {
    type: String,
    default: null,
  },
  Telephone1: {
    type: String,
    default: null,
  },
  mobilephone: {
    type: String,
    default: null,
  },
  fax1: {
    type: String,
    default: null,
  },
  emailadress2: {
    type: String,
    default: null,
  },
  preferredcom: {
    type: String,
    default: null,
  },
  farmername: {
    type: String,
    default: null,
  },
  surname2: {
    type: String,
    default: null,
  },
  farmerdate: {
    type: String,
    default: null,
  },
  signature: {
    type: String,
    default: null,
  },
  extensionofficername: {
    type: String,
    default: null,
  },
  surname3: {
    type: String,
    default: null,
  },
  mobilephone2: {
    type: String,
    default: null,
  },
  telephone2: {
    type: String,
    default: null,
  },
  emailaddress3: {
    type: String,
    default: null,
  },
  extensionofficerdate: {
    type: String,
    default: null,
  },
  ExtensionSignature: {
    type: String,
    default: null,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByObj: { type: mongoose.Schema.Types.Mixed, default: null },
});

module.exports = mongoose.model("farmers2017", FarmerDetailDumpSchema);
