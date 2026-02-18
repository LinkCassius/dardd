import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";

import Can from "./../../../components/common/Auth/Can";

const options = {
  filterType: "multiselect",
  responsive: "scroll",
  selectableRows: false,
};

class ContractPayTable extends Component {
  paymentColumns = [
    {
      name: "Milestone",
      title: "Milestone",
      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              {value.milestone === null ? "NA" : value.milestone.milestoneName}
            </div>
          );
        },
      },
    },

    {
      name: "Amount",
      title: "Amount",
      field: "amount",
      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          // const nf = new Intl.NumberFormat("en-za", {
          //   style: "currency",
          //   currency: "ZAR",
          //   minimumFractionDigits: 2,
          //   maximumFractionDigits: 2,
          // });
          // return nf.format(value.amount);
          return (
            <NumberFormat
              value={value.amount}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"R"}
              decimalScale={2}
              renderText={(value) => (
                <span>
                  {value.includes(".") === true ? value : value + ".00"}
                </span>
              )}
            />
          );
        },
      },
    },
    {
      name: "Payment Date",
      title: "Payment Date",
      field: "paymentDate",
      key: "paymentDate",
      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value.paymentDate &&
            `${new Date(value.paymentDate * 1000).toLocaleDateString("en-GB")}`
          );
        },
      },
    },
    {
      name: "Remarks",
      title: "Remarks",
      field: "transRefno",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Approval Status",
      title: "Approval Status",

      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let clr = "";
          let sts = "";
          if (rowData.approvalStatus && rowData.approvalStatus !== null) {
            clr =
              rowData.approvalStatus.cndName === "Approved" ? "green" : "red";
            sts = rowData.approvalStatus.cndName;
          } else {
            sts = "Initiated";
          }

          return (
            <div style={{ textAlign: "center" }}>
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
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>{value.approvalSequence}</div>
          );
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: 100,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          // let dsp = "";

          // if (rowData.approvalStatus && rowData.approvalStatus !== null) {
          //   dsp =
          //     rowData.approvalStatus.cndName === "Approved" ||
          //     rowData.approvalStatus.cndName === "Rejected"
          //       ? "none"
          //       : "inline";
          // } else {
          //   dsp = "inline";
          // }
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Contract Payment Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "15px",
                      color: "#2196f3",
                      cursor: "pointer",
                      //display: dsp,
                    }}
                    title="Update"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              <span>&nbsp;&nbsp;</span>
              <i
                style={{
                  fontSize: "15px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Approver Comments"
                onClick={() => this.props.onRemarksOpen(rowData._id)}
                className="fa fa-comments"
              ></i>
              <span>&nbsp;&nbsp;</span>
              <a
                target="_blank"
                href={
                  "#/contract-document/" +
                  rowData.contract._id +
                  "?refId=" +
                  rowData._id +
                  "&refType=Payment"
                }
              >
                <i
                  style={{
                    fontSize: "15px",
                    color: "#2196f3",
                    cursor: "pointer",
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
    const { loading, payments, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Payments"
          )
        }
        data={payments}
        columns={this.paymentColumns}
        options={tableOptions}
      />
    );
  }
}

export default ContractPayTable;
