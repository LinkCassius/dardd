import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";

import Can from "./../../../components/common/Auth/Can";

class ContractDimTable extends Component {
  dimensionColumns = [
    {
      name: "Type",
      title: "Type",
      field: "dimension",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.dimension.cndName;
        },
      },
    },
    {
      name: "Programme Name",
      title: "Value",
      field: "dimension",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.dimension.cndCode;
        },
      },
    },

    {
      name: "Action",
      title: "Action",
      options: {
        headerNoWrap: true,
        width: 80,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Contract Dimension Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "15px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Programme Update"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
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
    const { loading, dimensions, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Programmes/SubProgrammes"
          )
        }
        data={dimensions}
        columns={this.dimensionColumns}
        options={tableOptions}
      />
    );
  }
}

export default ContractDimTable;
