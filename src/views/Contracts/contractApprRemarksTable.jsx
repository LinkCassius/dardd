import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";

class ContractApprovalRemarksTable extends Component {
  tableColumns = [
    {
      name: "Date",
      title: "Date",
      field: "approvalDate",
      key: "approvalDate",
      options: {
        headerNoWrap: true,
        width: 110,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.approvalDate).toLocaleDateString("en-GB")}`;
        },
      },
    },
    {
      name: "Approver",
      title: "Approver",
      options: {
        headerNoWrap: true,
        // width: 120,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let sts = "";
          if (rowData.approverId && rowData.approverId !== null) {
            sts =
              rowData.approverId.firstName + " " + rowData.approverId.lastName;
          } else {
            sts = "N/A, in progress";
          }

          return (
            <div>
              <span>{sts}</span>
            </div>
          );
        },
      },
    },

    {
      name: "Approval Status",
      title: "Approval Status",

      options: {
        headerNoWrap: true,
        // width: 120,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let sts = "";
          if (rowData.approvalStatus && rowData.approvalStatus !== null) {
            sts = rowData.approvalStatus.cndName;
          } else {
            sts = "Initiated";
          }

          return (
            <div>
              <span>{sts}</span>
            </div>
          );
        },
      },
    },
    {
      name: "Approval Level",
      title: "Approval Level",
      options: {
        headerNoWrap: true,
        // width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{value.sequence}</div>;
        },
      },
    },
    {
      name: "Approver Remarks",
      title: "Approver Remarks",
      options: {
        headerNoWrap: true,
        // width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              {value.approverRemarks != null || value.approverRemarks != ""
                ? value.approverRemarks
                : "N/A"}
            </div>
          );
        },
      },
    },
  ];

  handleBack(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const { loading, apprHistById, tableOptions } = this.props;

    return (
      <Card>
        <MaterialDatatable
          striped
          title={
            loading === true ? (
              <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
            ) : (
              "Approval Remarks"
            )
          }
          data={apprHistById}
          columns={this.tableColumns}
          options={tableOptions}
        />

        <div className="text-right">
          <Button color="warning" onClick={this.handleBack.bind(this)}>
            Back
          </Button>
        </div>
      </Card>
    );
  }
}

export default ContractApprovalRemarksTable;
