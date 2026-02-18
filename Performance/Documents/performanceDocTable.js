import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { masterConstants, siteConfig } from "../../../config";
import { ApiEndPoints } from "../../../config";
import Can from "../../../components/common/Auth/Can";
import Button from "../../../components/CustomButtons/Button.js";

class PerformanceDocTable extends Component {
  iconColor = (value) => {
    let returnVal = "#2196f3";
    let perfRecord = this.props.perfRecord;

    let currentApprover = perfRecord[0]?.currentApprovar;

    if (this.props.reviewType === "approvals") {
      if (perfRecord[0]?.currentApprovarStatus === "pending") {
        if (
          currentApprover == "approverUser1" &&
          (value.apUser1HasDownload == undefined ||
            value.apUser1HasDownload == null ||
            !value.apUser1HasDownload)
        )
          returnVal = "red";
        else if (
          currentApprover == "approverUser2" &&
          (value.apUser2HasDownload == undefined ||
            value.apUser2HasDownload == null ||
            !value.apUser2HasDownload)
        )
          returnVal = "red";
        else if (
          currentApprover == "approverUser3" &&
          (value.apUser3HasDownload == undefined ||
            value.apUser3HasDownload == null ||
            !value.apUser3HasDownload)
        )
          returnVal = "red";
      } else returnVal = "#2196f3";
    } else returnVal = "#2196f3";

    return returnVal;
  };
  documentcolumns = [
    {
      name: "Name",
      title: "Name",
      field: "name",
      key: "name",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return rowData.isFolder === "Y" ? (
            <a href={"/performance-document/" + this.props.performanceId}>
              {rowData.name}
            </a>
          ) : (
            rowData.name
          );
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
        width: 200,
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.uploadDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "Download",
      title: "Download",
      field: "docCollection",
      options: {
        width: 80,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          const filename = rowData.fileName;
          return (
            <div>
              {rowData.isFolder === "Y" ? (
                ""
              ) : (
                <i
                  onClick={() =>
                    this.props.download(
                      siteConfig.imagesPath +
                        filename +
                        "?token=" +
                        localStorage.getItem("uploadToken"),
                      rowData._id
                    )
                  }
                  style={{
                    fontSize: "20px",
                    color: this.iconColor(rowData),
                    paddingLeft: "40px",
                    cursor: "pointer",
                  }}
                  className="fa fa-download"
                ></i>
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
        display: this.props.reviewType === "self" ? true : false,
        width: 100,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
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
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>

              <i
                style={{
                  fontSize: "20px",
                  color: "red",
                  cursor: "pointer",
                }}
                title="Delete Document"
                onClick={() => {
                  this.props.onDelete(rowData._id);
                }}
                className="fa fa-trash"
              ></i>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, documents, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Documents"
          )
        }
        data={documents}
        columns={this.documentcolumns}
        options={tableOptions}
      />
    );
  }
}

export default PerformanceDocTable;

{
  /* <a
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
                </a> */
}
