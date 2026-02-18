import React, { Component } from "react";
//import ReactDOM from "react-dom";
import { NotificationManager } from "react-notifications";
import ProgressChart from "../../../components/widgets/progressChart";
import { ApiEndPoints } from "../../../config";
import FetchRequest from "../../../components/Http/FetchRequest";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loader from "react-loader-spinner";
import CardHeader from "../../../components/Card/CardHeader.js";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";

import ReportTypes from "./farmerReportTypes.json";
import pptxgen from "pptxgenjs";
import saveAs from "file-saver";
const Excel = require("exceljs");
var domToPdf = require("dom-to-pdf");

const MaterialSelect = ({ name, label, options, error, onChange, ...rest }) => {
  return (
    <div>
      <FormControl variant="outlined">
        <InputLabel id={name}>{label}</InputLabel>
        <Select
          labelId={name}
          id={name}
          name={name}
          {...rest}
          label={label}
          onChange={onChange}
        >
          {/* <option className="custom-option" value="-1">
            ALL
          </option> */}
          {options.map((option, i) => {
            return (
              <option className="custom-option" key={i} value={option.id}>
                {option.name}
              </option>
            );
          })}
        </Select>
      </FormControl>
      {error && <div className="text-danger">{error}</div>}
    </div>
  );
};

class FarmerReporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,

      reportType: "",
    };
    this.generatePPT = this.generatePPT.bind(this);
    this.generateExcel = this.generateExcel.bind(this);
  }

  async getInitialData(id) {
    const data = await FetchRequest({
      url: ApiEndPoints.farmerreporting + "?id=" + id,
      method: "GET",
    });

    console.log("data", data);
    if (data && data.success === true) {
      this.setState({
        data: data.result,
        loading: false,
      });
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    }

    window.scrollTo(0, 0);
  }

  async componentDidMount() {
    await this.getInitialData("0");
  }

  generatePDF() {
    let element = document.getElementById("report");
    let options = {
      filename: "report.pdf",
      overrideWidth: 1500,
    };

    return domToPdf(element, options, function () {
      console.log("done");
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      loading: true,
    });
    this.getInitialData(event.target.value);
  };

  generatePPT(e) {
    e.preventDefault();
    let pptx = new pptxgen();

    // pptx.tableToSlides("report", { x: 1.0, y: 1.0, w: 10 });

    // // STEP 3: Create Presentation
    // pptx.writeFile({ fileName: "table2slides_demo.pptx" });

    this.state.data.map(function (valueX) {
      let slide = pptx.addSlide();
      //slide header
      slide.addText(valueX.name, {
        x: 0.5,
        y: 0.1,
        h: 0.5,
        align: "center",
        bold: true,
        color: "B22828",
      });

      let arrRows = [];
      //table header
      arrRows.push([
        {
          text: valueX.name,
          options: {
            fill: { color: "05440A" },
            color: "ffffff",
            valign: "middle",
            bold: true,
          },
        },
        {
          text: "VALUE",
          options: {
            fill: { color: "05440A" },
            color: "ffffff",
            valign: "middle",
            bold: true,
          },
        },
        {
          text: "PERCENT",
          options: {
            fill: { color: "05440A" },
            color: "ffffff",
            valign: "middle",
            bold: true,
          },
        },
      ]);

      Object.entries(valueX.values).map(function (value) {
        //table data
        if (value[0] !== "Total")
          arrRows.push([
            { text: value[0], options: { align: "left" } },
            { text: value[1][0], options: { align: "center" } },
            { text: value[1][1], options: { align: "center" } },
          ]);
        else
          arrRows.push([
            { text: value[0], options: { align: "left", color: "FF0000" } },
            {
              text: value[1][0],
              options: { align: "center", color: "FF0000" },
            },
            {
              text: value[1][1],
              options: { align: "center", color: "FF0000" },
            },
          ]);
      });
      slide.addTable(arrRows, {
        x: 0.5,
        y: 0.9,
        w: 3,
        colW: [1.8, 0.7, 0.9],
        rowH: 0.4,
        border: { color: "CFCFCF" },
        autoPage: true,
        verbose: true,
      });
      //table creation end

      //chart creation
      let label = [];
      let chartdata = [];
      if (valueX) {
        for (let [key, value] of Object.entries(valueX.values)) {
          if (key !== "Total") {
            label.push(key);
            chartdata.push(isNaN(value[1]) === true ? 0 : parseInt(value[1]));
          }
        }
      }
      let chartName = "bar";
      chartName =
        valueX.chartType === "Bar"
          ? "bar"
          : valueX.chartType === "Pie"
          ? "pie"
          : valueX.chartType === "Doughnut"
          ? "doughnut"
          : "bar";

      let dataChart = [
        {
          name: valueX.name,
          labels: label,
          values: chartdata,
        },
      ];
      slide.addChart(chartName, dataChart, {
        x: 4.5,
        y: 0.8,
        w: 5.0,
        rowH: 0.45,
        //fill: { color: "F7F7F7" },
        color: "FFFFFF",
        fontSize: 12,
        valign: "middle",
        align: "center",
        border: { pt: 1, color: "FFFFFF" },
        showLegend: true,
        showLeaderLines: true,
        showPercent: false,
        showValue: true,
        chartColors: [
          "5363F2",
          "F25388",
          "F2F253",
          "8DF253",
          "E253F2",
          "F2C853",
          "53F2F2",
        ],
        chartColorsOpacity: 50,
      });
    });
    // console.log("arrRows : ", arrRows);

    pptx
      .writeFile({ fileName: "FarmerReport" })
      .then((fileName) => console.log(`writeFile: ${fileName}`));
  }

  generateExcel(e) {
    e.preventDefault();

    const workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("FarmersReport");
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;

    this.state.data.map(function (valueX) {
      let headerRow = worksheet.addRow();
      let cellHead = headerRow.getCell(2);
      cellHead.value = valueX.name;

      headerRow.getCell(2).font = {
        name: "Calibri",
        color: { argb: "FFFFFFFF" },
        family: 4,
        size: 12,

        bold: true,
      };
      headerRow.getCell(2).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "05440A" },
      };

      let cellValue = headerRow.getCell(3);
      cellValue.value = "VALUE";
      headerRow.getCell(3).font = {
        name: "Calibri",
        color: { argb: "FFFFFFFF" },
        family: 4,
        size: 12,

        bold: true,
      };
      headerRow.getCell(3).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "05440A" },
      };
      headerRow.getCell(3).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      let cellPercent = headerRow.getCell(4);
      cellPercent.value = "PERCENT";
      headerRow.getCell(4).font = {
        name: "Calibri",
        color: { argb: "FFFFFFFF" },
        family: 4,
        size: 12,

        bold: true,
      };
      headerRow.getCell(4).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "05440A" },
      };
      headerRow.getCell(4).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      Object.entries(valueX.values).map(function (value) {
        var dataRow = worksheet.addRow();

        //name
        let cell1 = dataRow.getCell(2);
        cell1.value = value[0];

        //value
        let cell2 = dataRow.getCell(3);
        cell2.value = value[1][0];

        dataRow.getCell(3).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        //percent
        let cell3 = dataRow.getCell(4);
        cell3.value = value[1][1];

        dataRow.getCell(4).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        //apply red to total field
        if (value[0] === "Total") {
          dataRow.getCell(2).font = {
            name: "Calibri",
            color: { argb: "FF0000" },
            family: 4,
            size: 12,
            bold: true,
          };
          dataRow.getCell(3).font = {
            name: "Calibri",
            color: { argb: "FF0000" },
            family: 4,
            size: 12,
            bold: true,
          };
          dataRow.getCell(4).font = {
            name: "Calibri",
            color: { argb: "FF0000" },
            family: 4,
            size: 12,
            bold: true,
          };
        }
      });
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "farmersReport.xlsx"
      );
    });
  }

  render() {
    const { data } = this.state;
    console.log("ee", ReportTypes.data);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader
              color="primary"
              style={{
                padding: "2px 0px 2px 15px",
                textAlign: "left",
                height: 35,
              }}
            >
              <div className="row">
                <div className="col-sm-5">
                  <h5 className="cardCategoryWhite cardTitlePerm">
                    Farmer Reporting
                  </h5>
                </div>
              </div>
            </CardHeader>

            <div style={{ width: "100%", textAlign: "center" }}>
              <strong>
                {this.state.loading === true ? (
                  <Loader type="Rings" color="#00BFFF" height={80} width={80} />
                ) : (
                  ""
                )}
              </strong>
            </div>
            <CardBody>
              <div className="row">
                <div className="col-sm-5">
                  {!this.state.loading && (
                    <MaterialSelect
                      label="Report Type"
                      onChange={this.handleChange}
                      name="reportType"
                      value={this.state.reportType}
                      options={ReportTypes.data}
                    />
                  )}
                </div>
                <div className="col-sm-2">
                  {!this.state.loading && (
                    <div>
                      <i
                        style={{
                          cursor: "pointer",
                          color: "red",
                        }}
                        className="fa fa-file-pdf-o fa-lg mt-4"
                        onClick={this.generatePDF}
                        title="Export To PDF"
                      ></i>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <i
                        style={{
                          cursor: "pointer",
                          color: "red",
                        }}
                        className="fa fa-file-powerpoint-o fa-lg mt-4"
                        onClick={this.generatePPT}
                        title="Export To PPT"
                      ></i>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <i
                        style={{
                          cursor: "pointer",
                        }}
                        className="fa fa-file-excel-o fa-lg mt-4"
                        onClick={this.generateExcel}
                        title="Export To Excel"
                      ></i>
                    </div>
                  )}
                </div>
                {/* <div className="col-sm-5">
                  <div>
                    <Button
                      color="primary"
                      onClick={() => this.getInitialData()}
                    >
                      Search
                    </Button>
                  </div>
                </div> */}
              </div>
              <hr />
              {!this.state.loading && (
                <div className="col-sm-12" id="report">
                  {data.map(function (value) {
                    let label = [];
                    let chartdata = [];
                    if (value) {
                      console.log("va : ", value);
                      for (let [key, value] of Object.entries(value.values)) {
                        if (key !== "Total") {
                          label.push(key);
                          chartdata.push(value[1]);
                        }
                      }

                      return (
                        <React.Fragment>
                          <div className="row">
                            {/* <p
                          className="p-1 mb-3 bg-success text-white"
                          style={{ textAlign: "left" }}
                        >
                          {value.name}
                        </p>
                        <br /> */}
                            <div className="col-sm-4">
                              <div
                                style={{
                                  //paddingLeft: "10px",
                                  paddingTop: "25px",
                                }}
                              >
                                <Table size="small" aria-label="a dense table">
                                  <TableHead className="MuiTableHead-root MuiTableCell-head">
                                    <TableRow>
                                      <TableCell>{value.name}</TableCell>
                                      <TableCell>{"VALUE"}</TableCell>
                                      <TableCell>{"PERCENT"}</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {Object.entries(value.values).map(function (
                                      value
                                    ) {
                                      return (
                                        <TableRow>
                                          <TableCell
                                            style={
                                              value[0] === "Total"
                                                ? { color: "red" }
                                                : {}
                                            }
                                          >
                                            {value[0]}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              value[0] === "Total"
                                                ? { color: "red" }
                                                : {}
                                            }
                                          >
                                            {value[1][0]}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              value[0] === "Total"
                                                ? { color: "red" }
                                                : {}
                                            }
                                          >
                                            {value[1][1]}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>

                            <div className="col-sm-5">
                              <ProgressChart
                                label={label}
                                chartdata={chartdata}
                                type={value.chartType ? value.chartType : "Bar"}
                                backgroundColor={[
                                  "rgba(255, 99, 132, 0.2)",
                                  "rgba(54, 162, 235, 0.2)",
                                  "rgba(255, 206, 86, 0.2)",
                                  "rgba(75, 192, 192, 0.2)",
                                  "rgba(153, 102, 255, 0.2)",
                                  "rgba(255, 159, 64, 0.2)",
                                ]}
                                borderColor={[
                                  "rgba(255, 99, 132, 1)",
                                  "rgba(54, 162, 235, 1)",
                                  "rgba(255, 206, 86, 1)",
                                  "rgba(75, 192, 192, 1)",
                                  "rgba(153, 102, 255, 1)",
                                  "rgba(255, 159, 64, 1)",
                                ]}
                                hoverBackgroundColor={"rgba(255,99,132,0.4)"}
                                hoverBorderColor={"rgba(255,99,132,1)"}
                                title={value.name}
                                key={"1"}
                                heading={value.name} //value.name
                              />
                            </div>
                          </div>
                          <br />
                          <hr />
                          <br />
                        </React.Fragment>
                      );
                    }
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default FarmerReporting;
