import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import Can from "../../components/common/Auth/Can";

class ContractTable extends Component {
  columns = [
    {
      name: "Contract Name",
      title: "Contract Name",
      field: "contractName",
      key: "contractName",
      options: {
        // width: 220,

        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Link to={"/contract-detail/" + value._id}>
              {value.contractName}
            </Link>
          );
        },
        customValue: (dataObject) => {
          return dataObject.contractName;
        },
      },
    },
    {
      name: "Contract No.",
      title: "Contract Number",
      field: "contractNumber",
      key: "contractNumber",
      options: {
        // width: 180,
        headerNoWrap: true,
      },
    },
    // {
    //   name: "Project No.",
    //   title: "Project Number",
    //   field: "projectNumber",
    //   key: "projectNumber",
    //   options: {
    //     // width: 180,
    //     headerNoWrap: true,
    //   },
    // },
    {
      name: "Service Provider",
      field: "serviceProviderId",
      options: {
        // width: 220,
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.serviceProviderId?.serviceProviderFirmName;
        },
      },
    },
    {
      name: "Contract Value",
      title: "Contract Value",
      field: "contractValue",
      key: "contractValue",
      options: {
        headerNoWrap: true,
        width: 200,
        customBodyRender: (value, tableMeta, updateValue) => {
          // const nf = new Intl.NumberFormat("en-za", {
          //   style: 'currency',
          //   currency: 'ZAR',
          //   minimumFractionDigits: 2,
          //   maximumFractionDigits: 2,
          // });
          // return nf.format(value.contractValue);
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
      //render: rowData => new Date(rowData.endDate * 1000).toLocaleString()
    },

    // {
    //   name: "Contract Type",
    //   title: "Contract Type",
    //   field: "contractType",
    //   options: {
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return value.contractType.cndName;
    //     },
    //   },

    // },
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
        customValue: (dataObject) => {
          return dataObject.contractStatus.cndName;
        },
      },
    },

    {
      name: "Action",
      title: "Action",
      options: {
        width: "80px",
        headerNoWrap: true,
        download: false,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          // console.log("rowData._id: ", rowData._id);
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Contract Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Contract Update"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Can
                perform="Contract Delete Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    title="Delete Contract"
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
    const { loading, contracts, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Project and Contract Management"
          )
        }
        data={contracts}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default ContractTable;
