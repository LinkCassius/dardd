import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";

import Can from "./../../../components/common/Auth/Can";

class ContractTaskTable extends Component {
  taskColumns = [
    {
      name: "Task Name",
      title: "Task Name",
      field: "taskName",
      options: {
        headerNoWrap: true,
      },
    },

    {
      name: "Person Responsible",
      title: "Person Responsible",
      field: "personResponsible",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value.personResponsible.firstName +
            " " +
            value.personResponsible.lastName
          );
        },
      },
    },
    {
      name: "Target Date",
      title: "Target Date",
      field: "taskTargetDate",
      key: "taskTargetDate",
      options: {
        width: 150,
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.taskTargetDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "Person Remarks",
      title: "Person Remarks",
      field: "remarks",
      options: {
        width: 300,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div>
              {rowData.remarks === null || rowData.remarks === ""
                ? "Not Available"
                : rowData.remarks}
            </div>
          );
        },
      },
    },
    {
      name: "Task Status",
      title: "Task Status",
      options: {
        width: 120,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              {rowData.taskStatus && rowData.taskStatus !== null
                ? rowData.taskStatus.cndName
                : "Not Yet Started"}
            </div>
          );
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: 120,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Contract Task Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "15px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Task Update"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <a
                target="_blank"
                href={
                  "#/contract-document/" +
                  rowData.contract +
                  //  this.props.contractId +
                  "?refId=" +
                  rowData._id +
                  "&refType=Task"
                }
              >
                <i
                  style={{
                    fontSize: "15px",
                    color: "#2196f3",
                  }}
                  title="Documents"
                  className="fa fa-folder"
                ></i>
              </a>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, tasks, tableOptions } = this.props;
    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Tasks"
          )
        }
        data={tasks}
        columns={this.taskColumns}
        options={tableOptions}
      />
    );
  }
}

export default ContractTaskTable;
