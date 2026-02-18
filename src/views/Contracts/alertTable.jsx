import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";

const options = {
  filterType: "multiselect",
  filter: false,
  download: false,
  responsive: "scroll",
  print: false,
  search: false,
  selectableRows: false,
  viewColumns: false,
};

class AlertTable extends Component {
  alertColumns = [
    {
      name: "Alert Type",
      title: "Alert Type",
      field: "alertType",
      options: {
        width: 100,
        headerNoWrap: true,
      },
    },
    {
      name: "Alert Description",
      title: "Alert Description",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          if (rowData.alertType === "Contract")
            return (
              <div style={{ font: 12 }}>
                <div>{rowData.alertDesc}</div>
                <div style={{ color: "green" }}>
                  <b>Contract Details</b>
                </div>
                <div>
                  <span>
                    <b>Contract Name : </b>
                  </span>
                  {rowData.contractName}&nbsp; | &nbsp;
                  <span>
                    <b>Contract Number : </b>
                  </span>
                  {rowData.contractNumber}&nbsp; | &nbsp;
                  <span>
                    <b>Project Number : </b>
                  </span>
                  {rowData.projectNumber}&nbsp; | &nbsp;
                  <span>
                    <b>Start Date : </b>
                  </span>
                  {new Date(rowData.startDate * 1000).toLocaleDateString(
                    "en-GB"
                  )}
                  &nbsp; | &nbsp;
                  <span>
                    <b>End Date : </b>
                  </span>
                  {new Date(rowData.endDate * 1000).toLocaleDateString("en-GB")}
                  &nbsp; | &nbsp;
                  <span>
                    <b>Service Provider : </b>
                  </span>
                  {rowData.serviceProvider}&nbsp; | &nbsp;
                  <span>
                    <b>Contract Value : </b>
                  </span>
                  {rowData.contractValue}&nbsp; | &nbsp;
                  <span>
                    <b>Contract Type : </b>
                  </span>
                  {rowData.contractType.cndName}&nbsp; | &nbsp;
                  <span>
                    <b>Contract Status : </b>
                  </span>
                  {rowData.contractStatus.cndName}
                </div>
              </div>
            );
          else if (rowData.alertType === "Task")
            return (
              <div style={{ font: 12 }}>
                <div>{rowData.alertDesc}</div>
                <div style={{ color: "green" }}>
                  <b>Task Details</b>
                </div>
                <div>
                  <span>
                    <b>Task Name : </b>
                  </span>
                  {rowData.taskName}&nbsp; | &nbsp;
                  <span>
                    <b>Person Responsible : </b>
                  </span>
                  {rowData.personResponsible}&nbsp; | &nbsp;
                  <span>
                    <b>Task Target Date : </b>
                  </span>
                  {new Date(rowData.taskTargetDate * 1000).toLocaleDateString(
                    "en-GB"
                  )}
                  &nbsp; | &nbsp;
                  <span>
                    <b>Contract Name : </b>
                  </span>
                  {rowData.contractName}
                </div>
              </div>
            );
          else if (rowData.alertType === "Milestone")
            return (
              <div style={{ font: 12 }}>
                <div>{rowData.alertDesc}</div>
                <div style={{ color: "green" }}>
                  <b>Milestone Details</b>
                </div>
                <div>
                  <span>
                    <b>Milestone Name : </b>
                  </span>
                  {rowData.milestoneName}&nbsp; | &nbsp;
                  <span>
                    <b>Start Date : </b>
                  </span>
                  {new Date(rowData.startDate * 1000).toLocaleDateString(
                    "en-GB"
                  )}
                  &nbsp; | &nbsp;
                  <span>
                    <b>End Date : </b>
                  </span>
                  {new Date(rowData.endDate * 1000).toLocaleDateString("en-GB")}
                  &nbsp; | &nbsp;
                  <span>
                    <b>Milestone Value : </b>
                  </span>
                  {rowData.milestoneValue}&nbsp; | &nbsp;
                  <span>
                    <b>Person Responsible : </b>
                  </span>
                  {rowData.personResponsible}&nbsp; | &nbsp;
                  <span>
                    <b>Contract Name : </b>
                  </span>
                  {rowData.contractName}
                </div>
              </div>
            );
        },
      },
    },
    {
      name: "Days Remaining",
      title: "Days Remaining",
      field: "alertDays",
      options: {
        width: 100,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return <div style={{ textAlign: "center" }}>{rowData.alertDays}</div>;
        },
      },
    },
    {
      name: "Status",
      title: "Status",
      field: "status",
      options: {
        width: 100,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <i
                className="fa fa-bell"
                style={{
                  fontSize: "20px",
                  color: rowData.status,
                }}
              ></i>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, alerts } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Alerts"
          )
        }
        data={alerts}
        columns={this.alertColumns}
        options={options}
      />
    );
  }
}

export default AlertTable;
