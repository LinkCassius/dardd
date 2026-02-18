const Joi = require("joi");
const mongoose = require("mongoose");
const Config = require("../config/config");
const { masterConst } = Config;

/**
 * @swagger
 * definitions:
 *  Contract:
 *    type: object
 *    properties:
 *      contractName:
 *        type: string
 *      startDate:
 *        type: number
 *      endDate:
 *        type: number
 *      serviceProvider:
 *        type: string
 *      contractDetail:
 *        type: string
 *      file:
 *        type: string
 *      status:
 *        type: number
 *      createdDate:
 *        type: number
 *      updatedDate:
 *        type: number
 *      deleted:
 *        type: number
 *
 */

var AnnualSchema = new mongoose.Schema({
    indicatorTitle: {
        type: "string",
        required: true
    },
    target: {
        type: "string",
        required: true
    },
    reportingCycle: {
        type: String,
        required: true
    },
    createdDate: {
        type: "number",
        default: new Date().getTime()
    },
    dimensions: {
        type: Array,
        default: null
    },
    actualPerformance: {
        type: String,
        required: ""
    }
});

module.exports = mongoose.model("annualreport", AnnualSchema);
