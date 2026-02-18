import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../components/common/Auth/Can";

class CndTable extends Component {
  columns = [
    {
      name: "Programme Type",
      title: "Programme Type",
      field: "cndName",
      options: {
        width: "145px",
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.parent !== null || value.parent !== undefined ? (
            value.cndName
          ) : (
            <div>
              <span
                style={{
                  fontWeight: "Bold",
                }}
              >
                {value.cndName}
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "Title/Sub-Title",
      title: "Title",
      field: "cndCode",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Purpose",
      title: "Purpose",
      field: "desc",
    },
    {
      name: "Order",
      title: "Order",
      field: "priority",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Parent Title",
      title: "Parent",
      field: "parent",
      key: "status",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.parent ? value.parent.cndCode : "";
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: "80px",
        headerNoWrap: true,

        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="IndicatorTitles Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Edit"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Can
                perform="IndicatorTitles Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Delete Programme"
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
    const { loading, cnds, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Programme/SubProgramme List"
          )
        }
        data={cnds}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default CndTable;
