var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var Contracts = require("../models/Contracts");
const auth = require("../middleware/auth");
const ExcelJS = require("exceljs");

router.post(
    "/api/retentionreport", auth, async (req, res) =>  {
        //generate contract retention report
        try {
            const report = await generateRetentionReport(req);
            //console.log("Retention Report : -- ", report);
            const reportData = report[0].data || [];
            const totalRecords = report[0].totalRecords || 0;
           // res.json(report);
            res.status(200).json({
                success: true,
                responseCode: 200,
                result: reportData,
                totalRecCount: totalRecords,
                msg: "List fetching successfully",
              });
          } catch (error) {
            //res.status(500).send('Error generating retention report');
            res.status(400).json({
                success: false,
                responseCode: 400,
                msg: "Error generating retention report",
                result: "error",
              });
          }
    }
);

async function generateRetentionReport(req) {
    /********* Search Query Build ************/
  
    var dbquery_search = "";
    if (req.query.searchTable) dbquery_search = req.query.searchTable;
  
    /******* Pagination Query *******/
    var pageNo = parseInt(req.query.pageNo) || 1;
    var size = parseInt(req.query.per_page) || 10;
  
    var sort_field = "_id";
    var sort_mode = -1;
  
    if (req.query.sort_field) {
      sort_field = req.query.sort_field;
    }
    if (req.query.sort_mode) {
      var var_sort_mode = req.query.sort_mode;
      sort_mode = var_sort_mode === "descend" ? -1 : 1;
    }
  
    var query = {};
    if (pageNo < 1) {
      return res.status(400).json({
        success: false,
        responseCode: 400,
        msg: "Invalid page number, should start with 1",
      });
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
  
  //const fiscalYearEnd = new Date("2024-03-31");
 
  const reportStartDate = req.body.startDate  
  ? parseInt(req.body.startDate) // Convert Unix timestamp (seconds) to milliseconds
  : new Date().getTime();

  const oneDayInMs = 24 * 60 * 60 * 1000;
  const previousDate = reportStartDate - oneDayInMs;
  // const previousDate = new Date(reportStartDate);
  // previousDate.setDate(previousDate.getDate() - 1);

  const reportEndDate = req.body.endDate
  ? parseInt(req.body.endDate)
  : new Date().getTime();
// console.log("startDate  : ", req.body.startDate );
// console.log("endDate  : ", req.body.endDate );
// console.log("reportStartDate, previousDate, reportEndDate : ", reportStartDate, previousDate, reportEndDate);
// console.log("reportStartDate, previousDate, reportEndDate : ", new Date(reportStartDate), new Date(previousDate), new Date(reportEndDate));
    try {
      const report = await Contracts.aggregate([
        {
          $match: {
            $and: [
              { status: 1 },
              {
                $or: [
                  { contractDetail: { $regex: dbquery_search, $options: "i" } },
                  { contractNumber: { $regex: dbquery_search, $options: "i" } },
                  { serviceProvider: { $regex: dbquery_search, $options: "i" } }
                ]
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'contract_milestones',
            localField: '_id',
            foreignField: 'contract',
            as: 'milestones'
          }
        },
        {
          $addFields: {
            withRetentionPercentageMilestones: {
              $filter: {
                input: "$milestones",
                as: "milestone",
                cond: { $gt: ["$$milestone.retentionPercentage", 0] }
              }
            },
            isRetentionMilestones: {
              $filter: {
                input: "$milestones",
                as: "milestone",
                cond: { $eq: ["$$milestone.isRetentionMilestone", true] }
              }
            }
          }
        },
        {
          $match: {
            "withRetentionPercentageMilestones.0": { $exists: true }
          }
        },
        {
          $lookup: {
            from: "contract_payments", // Lookup from ContractPayments collection
            localField: "isRetentionMilestones._id", // Match milestoneId in payments
            foreignField: "milestone", // Field in ContractPayments
            as: "retentionPayments" // Output field
          }
        },
        {
          $addFields: {
            contractPeriod: {
              $concat: [
                {
                  $toString: {
                    $add: [
                      {
                        $multiply: [
                          { $subtract: [{ $year: { $toDate: { $multiply: ["$endDate", 1000] } } }, { $year: { $toDate: { $multiply: ["$startDate", 1000] } } }] },
                          12
                        ]
                      },
                      { $subtract: [{ $month: { $toDate: { $multiply: ["$endDate", 1000] } } }, { $month: { $toDate: { $multiply: ["$startDate", 1000] } } }] }
                    ]
                  }
                },
                " months"
              ]
            },
            variationApprovedAmount: {
              $ifNull: [
                { $multiply: ['$contractValue', { $divide: [{ $toDouble: '$variationApproved'}, 100] }] },
                0
              ]
            },
            totalContractAmount: {
              $ifNull: [
                { $add: ['$contractValue', { $multiply: ['$contractValue', { $divide: [{ $toDouble: '$variationApproved'}, 100] }] }] },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            paymentsBeforeOpeningBalance: {
              $filter: {
                input: "$retentionPayments",
                as: "payment",
                cond: {
                  $lte: ["$$payment.paymentDate", { $divide: [previousDate, 1000] }]
                }
              }
            }
          }
        },
        {
          $addFields: {
            paymentsDuringSelectedPeriod: {
              $filter: {
                input: "$retentionPayments",
                as: "payment",
                cond: {
                  $and: [
                    { $gte: ["$$payment.paymentDate", { $divide: [reportStartDate, 1000]}] },
                    { $lte: ["$$payment.paymentDate", { $divide: [reportEndDate, 1000]}] }
                  ]
                }
              }
            }
          }
        },
        {
          $addFields: {
            TotalPaidBeforeOpeningBalance: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: "$paymentsBeforeOpeningBalance",
                    as: "payment",
                    in: "$$payment.amount"
                  }
                }
              },
              0
            ]
          },
          retentionOpeningBalance: {
            $ifNull: [
              {
                $subtract: [
                  {
                    $ifNull: [
                      {
                        $sum: {
                          $map: {
                            input: "$withRetentionPercentageMilestones",
                            as: "milestone",
                            in: {
                              $multiply: [
                                "$$milestone.milestoneValue",
                                { $divide: ["$$milestone.retentionPercentage", 100] }
                              ]
                            }
                          }
                        }
                      },
                      0
                    ]
                  },
                  {
                    $ifNull: [
                      {
                        $sum: {
                          $map: {
                            input: "$paymentsBeforeOpeningBalance",
                            as: "payment",
                            in: "$$payment.amount"
                          }
                        }
                      },
                      0
                    ]
                  }
                ]
              },
              0
            ]
          }
          }
        },
        {
          $addFields: {
            retentionTotalPaid: {
              $ifNull: [
                {
                  $sum: {
                    $map: {
                      input: "$paymentsDuringSelectedPeriod",
                      as: "payment",
                      in: "$$payment.amount"
                    }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            retentionClosingBalance: {
              $ifNull: [
                {
                  $subtract: [
                    "$retentionOpeningBalance",
                    "$retentionTotalPaid"
                  ]
                },
                0
              ]
            }
          }
        },
        {
          $facet: {
            metadata: [{ $count: "totalRecords" }],
            data: [
              { $sort: { [sort_field]: sort_mode } },
              { $skip: query.skip },
              { $limit: query.limit },
              {
                $project: {
                  _id: 0,
                  contractNumber: 1,
                  contractName: 1,
                  serviceProvider: 1,
                  startDate: 1,
                  endDate: 1,
                  contractPeriod: 1,
                  extension: 1,
                  contractValue: { $ifNull: ['$contractValue', 0] },
                  variationApprovedAmount: { $ifNull: [{ $round: ['$variationApprovedAmount', 2] }, 0] },
                  totalContractAmount: { $ifNull: [{ $round: ['$totalContractAmount', 2] }, 0] },
                  TotalPaidBeforeOpeningBalance: { $ifNull: [{ $round: ['$TotalPaidBeforeOpeningBalance', 2] }, 0] }, 
                  retentionOpeningBalance: { $ifNull: [ { $round: ['$retentionOpeningBalance', 2] }, 0] },
                  retentionTotalPaid: { $ifNull: [ { $round: ['$retentionTotalPaid', 2] }, 0] },
                  retentionClosingBalance: { $ifNull: [{ $round: ['$retentionClosingBalance', 2] }, 0] }
                }
               
              }
            ]
          }
        },
        {
          $project: {
            totalRecords: { $arrayElemAt: ["$metadata.totalRecords", 0] },
            data: 1
          }
        }
      ]);
  
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
}

router.post(
  "/api/retentionexcelreport", auth, async (req, res) =>  {
      //generate contract retention report
      try {
          const report = await generateRetentionExcelReport(req);
          
          res.status(200).json({
              success: true,
              responseCode: 200,
           
              msg: "List fetching successfully",
            });
        } catch (error) {
         
          res.status(400).json({
              success: false,
              responseCode: 400,
              msg: "Error generating retention report",
              result: "error",
            });
        }
  }
);

async function generateRetentionExcelReport(req, res) {
  /********* Search Query Build ************/
  var dbquery_search = "";
  if (req.query.searchTable) dbquery_search = req.query.searchTable;

  const reportStartDate = req.body.startDate
    ? parseInt(req.body.startDate)
    : new Date().getTime();

  const oneDayInMs = 24 * 60 * 60 * 1000;
  const previousDate = reportStartDate - oneDayInMs;

  const reportEndDate = req.body.endDate
    ? parseInt(req.body.endDate)
    : new Date().getTime();

  try {
    const report = await Contracts.aggregate([
      {
        $match: {
          $and: [
            { status: 1 },
            {
              $or: [
                { contractDetail: { $regex: dbquery_search, $options: "i" } },
                { contractNumber: { $regex: dbquery_search, $options: "i" } },
                { serviceProvider: { $regex: dbquery_search, $options: "i" } }
              ]
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'contract_milestones',
          localField: '_id',
          foreignField: 'contract',
          as: 'milestones'
        }
      },
      {
        $addFields: {
          withRetentionPercentageMilestones: {
            $filter: {
              input: "$milestones",
              as: "milestone",
              cond: { $gt: ["$$milestone.retentionPercentage", 0] }
            }
          },
          isRetentionMilestones: {
            $filter: {
              input: "$milestones",
              as: "milestone",
              cond: { $eq: ["$$milestone.isRetentionMilestone", true] }
            }
          }
        }
      },
      {
        $match: {
          "withRetentionPercentageMilestones.0": { $exists: true }
        }
      },
      {
        $lookup: {
          from: "contract_payments", // Lookup from ContractPayments collection
          localField: "isRetentionMilestones._id", // Match milestoneId in payments
          foreignField: "milestone", // Field in ContractPayments
          as: "retentionPayments" // Output field
        }
      },
      {
        $addFields: {
          contractPeriod: {
            $concat: [
              {
                $toString: {
                  $add: [
                    {
                      $multiply: [
                        { $subtract: [{ $year: { $toDate: { $multiply: ["$endDate", 1000] } } }, { $year: { $toDate: { $multiply: ["$startDate", 1000] } } }] },
                        12
                      ]
                    },
                    { $subtract: [{ $month: { $toDate: { $multiply: ["$endDate", 1000] } } }, { $month: { $toDate: { $multiply: ["$startDate", 1000] } } }] }
                  ]
                }
              },
              " months"
            ]
          },
          variationApprovedAmount: {
            $ifNull: [
              { $multiply: ['$contractValue', { $divide: [{ $toDouble: '$variationApproved'}, 100] }] },
              0
            ]
          },
          totalContractAmount: {
            $ifNull: [
              { $add: ['$contractValue', { $multiply: ['$contractValue', { $divide: [{ $toDouble: '$variationApproved'}, 100] }] }] },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          paymentsBeforeOpeningBalance: {
            $filter: {
              input: "$retentionPayments",
              as: "payment",
              cond: {
                $lte: ["$$payment.paymentDate", { $divide: [previousDate, 1000] }]
              }
            }
          }
        }
      },
      {
        $addFields: {
          paymentsDuringSelectedPeriod: {
            $filter: {
              input: "$retentionPayments",
              as: "payment",
              cond: {
                $and: [
                  { $gte: ["$$payment.paymentDate", { $divide: [reportStartDate, 1000]}] },
                  { $lte: ["$$payment.paymentDate", { $divide: [reportEndDate, 1000]}] }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          TotalPaidBeforeOpeningBalance: {
          $ifNull: [
            {
              $sum: {
                $map: {
                  input: "$paymentsBeforeOpeningBalance",
                  as: "payment",
                  in: "$$payment.amount"
                }
              }
            },
            0
          ]
        },
        retentionOpeningBalance: {
          $ifNull: [
            {
              $subtract: [
                {
                  $ifNull: [
                    {
                      $sum: {
                        $map: {
                          input: "$withRetentionPercentageMilestones",
                          as: "milestone",
                          in: {
                            $multiply: [
                              "$$milestone.milestoneValue",
                              { $divide: ["$$milestone.retentionPercentage", 100] }
                            ]
                          }
                        }
                      }
                    },
                    0
                  ]
                },
                {
                  $ifNull: [
                    {
                      $sum: {
                        $map: {
                          input: "$paymentsBeforeOpeningBalance",
                          as: "payment",
                          in: "$$payment.amount"
                        }
                      }
                    },
                    0
                  ]
                }
              ]
            },
            0
          ]
        }
        }
      },
      {
        $addFields: {
          retentionTotalPaid: {
            $ifNull: [
              {
                $sum: {
                  $map: {
                    input: "$paymentsDuringSelectedPeriod",
                    as: "payment",
                    in: "$$payment.amount"
                  }
                }
              },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          retentionClosingBalance: {
            $ifNull: [
              {
                $subtract: [
                  "$retentionOpeningBalance",
                  "$retentionTotalPaid"
                ]
              },
              0
            ]
          }
        }
      },
      {
        $facet: {
          metadata: [{ $count: "totalRecords" }],
          data: [
            {
              $project: {
                _id: 0,
                contractNumber: 1,
                contractName: 1,
                serviceProvider: 1,
                startDate: 1,
                endDate: 1,
                contractPeriod: 1,
                extension: 1,
                contractValue: { $ifNull: ['$contractValue', 0] },
                variationApprovedAmount: { $ifNull: [{ $round: ['$variationApprovedAmount', 2] }, 0] },
                totalContractAmount: { $ifNull: [{ $round: ['$totalContractAmount', 2] }, 0] },
                TotalPaidBeforeOpeningBalance: { $ifNull: [{ $round: ['$TotalPaidBeforeOpeningBalance', 2] }, 0] }, 
                retentionOpeningBalance: { $ifNull: [ { $round: ['$retentionOpeningBalance', 2] }, 0] },
                retentionTotalPaid: { $ifNull: [ { $round: ['$retentionTotalPaid', 2] }, 0] },
                retentionClosingBalance: { $ifNull: [{ $round: ['$retentionClosingBalance', 2] }, 0] }
              }
             
            }
          ]
        }
      },
      {
        $project: {
          totalRecords: { $arrayElemAt: ["$metadata.totalRecords", 0] },
          data: 1
        }
      }
    ]);

     // Check if the report data is empty
     if (!report[0].data || report[0].data.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "No data found!" });
    }

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Retention Register");

// Preprocess data to include formatted date strings
const processedData = report[0].data.map((item) => 
  Object.assign({}, item, 
  {
    formattedStartDate: new Date(item.startDate * 1000).toLocaleDateString(),
    formattedEndDate: new Date(item.endDate * 1000).toLocaleDateString(),
    formattedContractValue: formatCurrency(item.contractValue),
    formattedvariationApprovedAmount: formatCurrency(item.variationApprovedAmount),
    formattedtotalContractAmount: formatCurrency(item.totalContractAmount),
    formattedTotalPaidBeforeOpeningBalance: formatCurrency(item.TotalPaidBeforeOpeningBalance),
    formattedretentionOpeningBalance: formatCurrency(item.retentionOpeningBalance),
    formattedretentionTotalPaid: formatCurrency(item.retentionTotalPaid),
    formattedretentionClosingBalance: formatCurrency(item.retentionClosingBalance)
})
);

let excelColumns = [
  { header: "Contract Number", key: "contractNumber", width: 17 },
  { header: "Contract Name", key: "contractName", width: 50 },
  { header: "Service Provider", key: "serviceProvider", width: 30 },
  { header: "Start Date", key: "formattedStartDate", width: 15, style: { alignment: { horizontal: "center" } }  },
  { header: "End Date", key: "formattedEndDate", width: 15, style: { alignment: { horizontal: "center" } }  },
  { header: "Contract Period", key: "contractPeriod", width: 16, style: { alignment: { horizontal: "center" } }  },
  { header: "Extension", key: "extension", width: 15, style: { alignment: { horizontal: "center" } }  },
  { header: "Contract Value", key: "formattedContractValue", width: 30, style: { alignment: { horizontal: "right" } } },
  { header: "Variation Approved Amount", key: "formattedvariationApprovedAmount", width: 30 , style: { alignment: { horizontal: "right" } }},
  { header: "Total Contract Amount", key: "formattedtotalContractAmount", width: 30, style: { alignment: { horizontal: "right" } } },
  { header: "TotalPaidBeforeOpeningBalance", key: "formattedTotalPaidBeforeOpeningBalance", width: 30 , style: { alignment: { horizontal: "right" } }},
  { header: "RetentionOpeningBalance", key: "formattedretentionOpeningBalance", width: 35 , style: { alignment: { horizontal: "right" } }},
  { header: "Retention Total Paid", key: "formattedretentionTotalPaid", width: 30 , style: { alignment: { horizontal: "right" } }},
  { header: "Retention Closing Balance", key: "formattedretentionClosingBalance", width: 30, style: { alignment: { horizontal: "right" } } }
];

updateHeader(
  excelColumns,
  "TotalPaidBeforeOpeningBalance",
  `Total paid as at ${new Date(previousDate).toLocaleDateString("en-GB")}`
);

updateHeader(
  excelColumns,
  "RetentionOpeningBalance",
  `Retention opening balance as at ${new Date(reportStartDate).toLocaleDateString( "en-GB")}`
);

// Set column
worksheet.columns = excelColumns;

// Add the preprocessed data
worksheet.addRows(processedData);

  // Freeze the first row
  worksheet.views = [
    { state: "frozen", xSplit: 3, ySplit: 1 }, // Freeze the first row
  ];

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" } }; // Bold white text
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4472C4" }, // Blue background
      };
      cell.alignment = { horizontal: "center" }; // Center alignment
    });

  let fileName = req.query.fileName;
 
  // Write Excel to a file or stream it
    const excelFilePath = "public/uploads/"+ fileName;

  // Write and send the file
  await workbook.xlsx.writeFile(excelFilePath);

  console.log("Excel file generated at:", excelFilePath);
 
  } catch (error) {
    console.error("Error generating Excel report:", error);
    res
      .status(500)
      .json({ success: false, msg: "Error generating Excel report" });
  }
}

function formatCurrency(value) {
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return `R${formattedValue}`;
}

function updateHeader(columns, headerName, newHeader) {
  const target = columns.find((item) => item.header === headerName);
  if (target) {
    target.header = newHeader;
  } else {
    console.error(`Column with header '${headerName}' not found.`);
  }
}

  module.exports = router;