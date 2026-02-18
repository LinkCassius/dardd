import React, { Component } from "react";
import moment from "moment";

import { NotificationManager } from "react-notifications";
import { ApiEndPoints } from "../../../config";
import ContractReportTable from "./contractReportTable";
import exportFromJSON from "export-from-json";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ContractReportFilters from "./contractReportFilters";
import auth from "../../../auth";
import ContractViewForm from "./contractViewForm";
import ContractVarTable from "./contractVarTable";
import ContractMileTable from "./contractMileTable";
import ContractPayTable from "./contractPayTable";
import DialogWrapper from "../../../components/common/Dialog";
import saveAs from "file-saver";
const Excel = require("exceljs");

const fileName = "Contracts";
const exportType = "csv";
const contractReportColumns = [
  {
    header: "Contract Name",
    key: "contractName",
    width: 80,
    color: "blue",
  },
  {
    header: "Contract Number",
    key: "contractNumber",
    width: 25,
  },
  {
    header: "Project Number",
    key: "projectNumber",
    width: 25,
  },
  {
    header: "Contract Type",
    key: "contractType",
    width: 30,
  },
  {
    header: "ServiceProvider",
    key: "serviceProvider",
    width: 25,
  },
  {
    header: "Start Date",
    key: "startDate",
    width: 12,
  },
  {
    header: "End Date",
    key: "endDate",
    width: 12,
  },
  {
    header: "Contract Value",
    key: "contractValue",
    width: 15,
  },
  {
    header: "variationApproved",
    key: "variationApproved",
    width: 20,
  },
  {
    header: "extension",
    key: "extension",
    width: 20,
  },
  {
    header: "Contract Status",
    key: "contractStatus",
    width: 16,
  },
];

class ContractReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cndlist: [],
      contracts: [],

      isOpen: false,
      isOpenVariation: false,
      isOpenMilestone: false,
      isOpenPayment: false,
      id: "new",
    };
    this.generateExcel = this.generateExcel.bind(this);
  }

  componentDidMount() {
    this.getcndData();
    this.getInitialData();
  }

  getInitialData() {
    fetch(ApiEndPoints.contractList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ contracts: data.result, loading: false });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  getcndData() {
    fetch(ApiEndPoints.cndList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndlist: data.result });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handlePDFClick = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = "Contracts List";
    const headers = [
      [
        "Contract Name",
        "Contract Number",
        "Project Number",
        "Service Provider",
        "Start Date",
        "End Date",
        "Contract Value (R)",
        "Variation",
        "Extension",
        "Contract Status",
      ],
    ];

    const data = this.state.contracts.map((elt) => [
      elt.contractName,
      elt.contractNumber,
      elt.projectNumber,
      elt.serviceProvider,
      new Date(elt.startDate * 1000).toLocaleDateString("en-GB"),
      new Date(elt.endDate * 1000).toLocaleDateString("en-GB"),
      elt.contractValue,
      elt.variationApproved,
      elt.extension,
      elt.contractStatus.cndName,
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("contract-report.pdf");
  };

  getSearchData = (
    contractType,
    contractStatus,
    startDate,
    endDate,
    hasVariation
  ) => {
    let stDt = startDate !== "" ? moment(startDate).format("X") : "";
    let enDt = endDate !== "" ? moment(endDate).format("X") : "";

    fetch(
      ApiEndPoints.contractList +
        "?contractType=" +
        contractType +
        "&contractStatus=" +
        contractStatus +
        "&startDate=" +
        stDt +
        "&endDate=" +
        enDt +
        "&hasVariation=" +
        hasVariation,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ contracts: data.result, loading: false });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  };

  handleRefresh = () => {
    this.getInitialData();
  };

  handleExcel = () => {
    const { contracts } = this.state;

    let data = [];

    contracts.map((elt) => {
      const obj = {
        ContractName: elt.contractName,
        ContractNumber: elt.contractNumber,
        projectNumber: elt.projectNumber,
        contractType: elt.contractType.cndName,
        serviceProvider: elt.serviceProvider,
        startDate: new Date(elt.startDate * 1000).toLocaleDateString("en-GB"),
        endDate: new Date(elt.endDate * 1000).toLocaleDateString("en-GB"),
        contractValue: elt.contractValue,
        variationApproved: elt.variationApproved,
        extension: elt.extension,
        ContractStatus: elt.contractStatus.cndName,
      };

      data.push(obj);
    });
    console.log("excel data : ", data);
    exportFromJSON({ data, fileName, exportType, withBOM: true });
  };

  generateExcel(e) {
    e.preventDefault();
    const { contracts } = this.state;
    const workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("ContractsList", {
      views: [{ state: "frozen", xSplit: 2, ySplit: 1 }],
    });
    worksheet.properties.defaultRowHeight = 20;
    worksheet.properties.defaultColWidth = 25;
    worksheet.columns = contractReportColumns;

    worksheet.getRow(1).font = {
      name: "Calibri",
      color: { argb: "FFFFFFFF" },
      family: 4,
      size: 12,
      bold: true,
    };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "05440A" },
    };

    for (let i = 0; i < contracts.length; i++) {
      let obj = {};
      obj["contractName"] = contracts[i].contractName;
      obj["contractNumber"] = contracts[i].contractNumber;
      obj["projectNumber"] = contracts[i].projectNumber;
      obj["contractType"] = contracts[i].contractType.cndName;
      obj["serviceProvider"] = contracts[i].serviceProvider;
      obj["startDate"] = new Date(
        contracts[i].startDate * 1000
      ).toLocaleDateString("en-GB");
      obj["endDate"] = new Date(contracts[i].endDate * 1000).toLocaleDateString(
        "en-GB"
      );
      obj["contractValue"] = contracts[i].contractValue;
      obj["variationApproved"] = contracts[i].variationApproved;
      obj["extension"] = contracts[i].extension;
      obj["contractStatus"] = contracts[i].contractStatus.cndName;
      worksheet.addRow(obj);
    }

    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "ContractsList.xlsx"
      );
    });
  }

  render() {
    const { cndlist } = this.state;

    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      selectableRows: false,
      print: false,
      viewColumns: false,
      sort: false,
      customToolbar: () => {
        return (
          <React.Fragment>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

            <i
              style={{
                cursor: "pointer",
              }}
              className="fa fa-file-excel-o fa-lg mt-4"
              //onClick={this.handleExcel}
              onClick={this.generateExcel}
              title="Export To Excel"
            ></i>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <i
              style={{
                cursor: "pointer",
                color: "red",
              }}
              className="fa fa-file-pdf-o fa-lg mt-4"
              onClick={this.handlePDFClick}
              title="Export To PDF"
            ></i>
          </React.Fragment>
        );
      },
    };

    const variationsTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      selectableRows: false,
      print: false,
      viewColumns: false,
      sort: false,
    };

    const milestonesTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      selectableRows: false,
      print: false,
      viewColumns: false,
      sort: false,
    };

    const paymentsTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      print: false,
      viewColumns: false,
      sort: false,
      selectableRows: false,
    };

    return (
      <div>
        <div className="card">
          <ContractReportFilters
            cndlist={cndlist}
            getSearchData={this.getSearchData}
            handleRefresh={this.handleRefresh}
            handleExcel={this.handleExcel}
            handlePDFClick={this.handlePDFClick}
          />

          <ContractReportTable
            loading={this.state.loading}
            contracts={this.state.contracts}
            viewContract={(id) => {
              this.setState({ isOpen: true, id: id });
            }}
            viewVariations={(id) => {
              this.setState({ isOpenVariation: true, id: id });
            }}
            viewMilestones={(id) => {
              this.setState({ isOpenMilestone: true, id: id });
            }}
            viewPayments={(id) => {
              this.setState({ isOpenPayment: true, id: id });
            }}
            tableOptions={tableOptions}
          />
        </div>
        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <ContractViewForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
          />
        </DialogWrapper>

        <DialogWrapper
          isOpen={this.state.isOpenVariation}
          toggle={() =>
            this.setState({ isOpenVariation: !this.state.isOpenVariation })
          }
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <ContractVarTable
            loading={this.state.loading}
            contractId={this.state.id}
            tableOptions={variationsTableOptions}
            toggle={() =>
              this.setState({ isOpenVariation: !this.state.isOpenVariation })
            }
          />
        </DialogWrapper>

        <DialogWrapper
          isOpen={this.state.isOpenMilestone}
          toggle={() =>
            this.setState({ isOpenMilestone: !this.state.isOpenMilestone })
          }
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <ContractMileTable
            loading={this.state.loading}
            contractId={this.state.id}
            tableOptions={milestonesTableOptions}
            toggle={() =>
              this.setState({ isOpenMilestone: !this.state.isOpenMilestone })
            }
          />
        </DialogWrapper>

        <DialogWrapper
          isOpen={this.state.isOpenPayment}
          toggle={() =>
            this.setState({ isOpenPayment: !this.state.isOpenPayment })
          }
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <ContractPayTable
            loading={this.state.loading}
            contractId={this.state.id}
            tableOptions={paymentsTableOptions}
            toggle={() =>
              this.setState({ isOpenPayment: !this.state.isOpenPayment })
            }
          />
        </DialogWrapper>
      </div>
    );
  }
}
export default ContractReport;
