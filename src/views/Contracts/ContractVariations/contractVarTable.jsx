import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import NumberFormat from "react-number-format";
import Can from "./../../../components/common/Auth/Can";

class ContractTaskTable extends Component {
  variationColumns = [
    {
      name: "Subject",
      title: "Subject",
      field: "subject",
      options: {
        headerNoWrap: true,
      },
    },
    // {
    //   name: "Unit",
    //   title: "Unit",
    //   field: "unit",
    //   options: {
    //     headerNoWrap: true,
    //   },
    // },
    // {
    //   name: "Rate",
    //   title: "Rate",
    //   field: "rate",
    //   options: {
    //     headerNoWrap: true,
    //   },
    // },
    {
      name: "Amount",
      title: "Amount",
      field: "amount",
      options: {
        width: 150,
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
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
      name: "Approval Status",
      title: "Approval Status",

      options: {
        headerNoWrap: true,
        width: 120,
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
        width: 120,
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
                perform="Contract Variation Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "15px",
                      color: "#2196f3",
                      cursor: "pointer",
                      //display: dsp,
                    }}
                    title="Variation Update"
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
                  "&refType=Variation"
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
    const { loading, variations, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Variations"
          )
        }
        data={variations}
        columns={this.variationColumns}
        options={tableOptions}
      />
    );
  }
}

export default ContractTaskTable;
