import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../../components/common/Auth/Can";

class IndicatorsTable extends Component {
  columns = [
    {
      name: "Indicator",
      title: "Indicator Title",
      field: "indicatorTitle",
      key: "indicatorTitle",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Annual Tgt",
      field: "annualTarget",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Target",
      title: "Target",
      field: "target",
      key: "Target",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Quarter",
      title: "Reporting Cycle",
      field: "reportingCycle",
      key: "ReportingCycle",
      options: {
        headerNoWrap: true,
        width: "170px",
        customBodyRender: (value, tableMeta, updateValue) => {
          //return value.reportingCycle + " " + value.cycleValue;
          let quarter = value.cycleValue.includes("Apr")
            ? "Q1"
            : value.cycleValue.includes("Jul")
            ? "Q2"
            : value.cycleValue.includes("Oct")
            ? "Q3"
            : value.cycleValue.includes("Jan")
            ? "Q4"
            : "";
          return value.cycleValue + " (" + quarter + ")";
        },
      },
    },
    {
      name: "Cumulative",
      field: "isTargetCummulative",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="col-xs-4 text-center">
              {value.isTargetCummulative === false ? "No" : "Yes"}
            </div>
          );
        },
      },
    },
    {
      name: "Responsible",
      title: "Indicator Responsibility",
      field: "responsibleUser",
      key: "responsibleUser",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.responsibleUser !== null
            ? value.responsibleUser.firstName +
                " " +
                value.responsibleUser.lastName
            : "Not Assigned";
        },
      },
    },
    {
      name: "Approver",
      title: "Approver",
      field: "approverUser1.firstname",
      key: "Approver",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            (value.approverUser1 !== null //|| value.approverUser3 !== null
              ? "1. " +
                value.approverUser1.firstName +
                " " +
                value.approverUser1.lastName
              : "Not Assigned") +
            // value.approverUser1.firstName +
            // " " +
            // value.approverUser1.lastName
            (value.approverUser2 !== null
              ? ", 2. " +
                value.approverUser2.firstName +
                " " +
                value.approverUser2.lastName
              : "") +
            (value.approverUser3 !== null
              ? ", 3. " +
                value.approverUser3.firstName +
                " " +
                value.approverUser3.lastName
              : "")
          );
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        headerNoWrap: true,
        width: 120,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              {/* {rowData.status === "Pending" && ( */}
              <Can
                perform="Indicators Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Indicators Update"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Can
                perform="Indicators Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Assign Person Responsible"
                    onClick={() => this.props.onAssign(rowData._id)}
                    className="fa fa-user"
                  ></i>
                )}
              />
              {/* )} */}
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Can
                perform="Indicators Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    title="Delete Indicator"
                    onClick={() => {
                      this.props.onDelete(rowData);
                    }}
                    className="fa fa-trash"
                  ></i>
                )}
              />
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, indicators, tableOptions } = this.props;
    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Indicator Targets"
          )
        }
        data={indicators}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default IndicatorsTable;
