import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import NumberFormat from "react-number-format";

class ContractReportTable extends Component {
  columns = [
    {
      name: "Contract Name",
      title: "Contract Name",
      field: "contractName",
      key: "contractName",
      options: {
        // width: 220,

        headerNoWrap: true,
        // customBodyRender: (value, tableMeta, updateValue) => {
        // return (
        //   <Link
        //     to={"/contract-detail/" + value._id}
        //     style={{ fontSize: "12px" }}
        //   >
        // {
        //   value.contractName;
        // }
        //   </Link>
        // );
        //},
      },
    },
    // {
    //   name: "Contract No.",
    //   title: "Contract Number",
    //   field: "contractNumber",
    //   key: "contractNumber",
    //   options: {
    //     //width: 180,
    //     headerNoWrap: true,
    //   },
    // },
    {
      name: "Project No.",
      title: "Project Number",
      field: "projectNumber",
      key: "projectNumber",
      options: {
        // width: 180,
        headerNoWrap: true,
      },
    },
    // {
    //   name: "Service Provider",
    //   title: "Service Provider",
    //   field: "serviceProvider",
    //   key: "serviceProvider",
    //   options: {
    //     //width: 220,
    //     headerNoWrap: true,
    //   },
    // },
    {
      name: "Contract Value",
      title: "Contract Value",
      field: "contractValue",
      key: "contractValue",
      options: {
        headerNoWrap: true,
        // width: 200,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <NumberFormat
              value={value.contractValue}
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
      name: "Start Date",
      title: "Start Date",
      field: "startDate",
      key: "startDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.startDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "End Date",
      title: "End Date",
      field: "endDate",
      key: "endDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.endDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },

    {
      name: "Contract Type",
      title: "Contract Type",
      field: "contractType",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.contractType.cndName;
        },
      },
    },
    // {
    //   name: "Variation Approved",
    //   title: "Variation Approved",
    //   field: "variationApproved",
    //   key: "variationApproved",
    //   options: {
    //     width: 150,
    //   },
    // },
    // {
    //   name: "Extension",
    //   title: "Extension",
    //   field: "extension",
    //   key: "extension",
    //   options: {
    //     width: 150
    //   }
    // },
    {
      name: "Status",
      title: "Status",
      field: "status",
      key: "status",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //   return `${masterConstants.status[value.status]}`;
          return value.contractStatus.cndName;
        },
      },
    },

    {
      name: "Action",
      title: "Action",
      options: {
        width: 150,
        headerNoWrap: true,
        download: false,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <i
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Contract Details"
                onClick={() => this.props.viewContract(rowData._id)}
                className="material-icons"
              >
                info
              </i>
              <span>&nbsp;&nbsp;</span>
              <i
                className="material-icons"
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Contract Variations"
                onClick={() => this.props.viewVariations(rowData._id)}
              >
                vertical_split
              </i>
              <span>&nbsp;&nbsp;</span>
              <i
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Contract Milestones"
                onClick={() => this.props.viewMilestones(rowData._id)}
                className="material-icons"
              >
                outlined_flag
              </i>
              <span>&nbsp;&nbsp;</span>
              <i
                className="material-icons"
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Contract Payments"
                onClick={() => this.props.viewPayments(rowData._id)}
              >
                payment
              </i>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, contracts, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Contracts Report"
          )
        }
        data={contracts}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default ContractReportTable;
