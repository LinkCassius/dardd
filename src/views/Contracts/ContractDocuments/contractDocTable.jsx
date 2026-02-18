import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import { siteConfig } from "../../../config";

class ContractDocTable extends Component {
  documentcolumns = [
    {
      name: "Type",
      title: "Type",
      field: "isFolder",
      key: "isFolder",
      options: {
        headerNoWrap: true,
        width: 80,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          const cls = rowData.isFolder === "Y" ? "fa fa-folder" : "fa fa-file";

          return (
            <div>
              {rowData.isFolder === "Y" ? (
                <i
                  style={{
                    fontSize: "20px",
                    color: "#f7df05",
                    paddingLeft: "20px",
                  }}
                  className={cls}
                ></i>
              ) : (
                <i
                  style={{
                    fontSize: "17px",
                    color: "#2196f3",
                    paddingLeft: "20px",
                  }}
                  className={cls}
                ></i>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "Name",
      title: "Name",
      field: "name",
      key: "name",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return rowData.isFolder === "Y" ? (
            <a
              href={
                "#/contract-document/" +
                this.props.contractId +
                "/" +
                rowData._id +
                "?refId=" +
                this.props.refId +
                "&refType=" +
                this.props.refType
              }
              target="_blank"
            >
              {rowData.name}
            </a>
          ) : (
            rowData.name
          );

          /*
          return (
            <div>
              {rowData.isFolder === "Y" ? (
                <a
                  href={
                    "/contract-document/" +
                    contractId +
                    "/" +
                    rowData._id +
                    "?refId=" +
                    refId +
                    "&refType=" +
                    refType
                  }
                >
                  {`${rowData.name}`}
                </a>
              ) : (
                <span>{`${rowData.name}`}</span>
              )}
            </div>
          );
          */
          //`${new Date(value.uploadDate * 1000).toLocaleDateString("en-GB")}`;
        },
      },
      customValue: (rowData, tableMeta, updateValue) => rowData.name,
      customSortValue: (rowData, tableMeta, updateValue) => rowData.name,
    },
    {
      name: "Uploaded Date",
      title: "Uploaded Date",
      field: "uploadDate",
      key: "uploadDate",
      options: {
        width: 120,
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.uploadDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    // {
    //   name: "Status",
    //   title: "Status",
    //   field: "status",
    //   key: "status",
    //   options: {
    //     width: 150,
    //     headerNoWrap: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return `${masterConstants.status[value.status]}`;
    //     },
    //   },
    // },
    {
      name: "Download",
      title: "Download",
      field: "docCollection",
      options: {
        width: 80,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          const filename = rowData.docCollection;
          return (
            <div>
              {rowData.isFolder === "Y" ? (
                ""
              ) : (
                <a
                  target="_blank"
                  href={
                    siteConfig.imagesPath +
                    filename +
                    "?token=" +
                    localStorage.getItem("uploadToken")
                  }
                >
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      paddingLeft: "40px",
                    }}
                    className="fa fa-download"
                  ></i>
                </a>
              )}
            </div>
          );
        },
      },
    },

    {
      name: "Action",
      title: "Action",
      options: {
        width: 80,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div>
              {rowData.isFolder === "Y" ? (
                <i
                  style={{
                    fontSize: "20px",
                    color: "#2196f3",
                    paddingLeft: "25px",
                    cursor: "pointer",
                  }}
                  title="Document Update"
                  onClick={() => this.props.onFolderEdit(rowData._id)}
                  className="fa fa-edit"
                ></i>
              ) : (
                <i
                  style={{
                    fontSize: "20px",
                    color: "#2196f3",
                    paddingLeft: "25px",
                    cursor: "pointer",
                  }}
                  title="Document Update"
                  onClick={() => this.props.onEdit(rowData._id)}
                  className="fa fa-edit"
                ></i>
              )}
            </div>
          );
        },
      },
    },
  ];

  render() {
    const {
      loading,
      documents,
      contractName,
      refType,
      tableOptions,
    } = this.props;
    let docType = refType === "" ? "All" : refType;
    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            contractName + " - (" + docType + ") Documents"
          )
        }
        data={documents}
        columns={this.documentcolumns}
        options={tableOptions}
      />
    );
  }
}

export default ContractDocTable;
