import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";

class CndTable extends Component {
  columns = [
    {
      name: "Name",
      title: "Name",
      field: "cndName",
    },
    {
      name: "Value",
      title: "Value",
      field: "cndCode",
    },
    {
      name: "Parent",
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
      name: "Group",
      title: "Group",
      field: "cndGroup",
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: "80px",
        headerNoWrap: true,

        customBodyRender: (rowData, tableMeta, updateValue) => {
          // console.log("rowData._id: ", rowData._id);
          return (
            <div style={{ textAlign: "center" }}>
              {/* <Can
                perform="Contract Edit Access"
                yes={() => ( */}
              <i
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="CnD Update"
                onClick={() => this.props.onEdit(rowData._id)}
                className="fa fa-edit"
                //   ></i>
                // )}
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
            "Configuration Master"
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
