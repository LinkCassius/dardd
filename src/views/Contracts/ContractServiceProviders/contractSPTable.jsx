import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../../components/common/Auth/Can";

class spTable extends Component {
  columns = [
    {
      name: "Firm Name",
      field: "serviceProviderFirmName",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Contact Person Name",
      field: "contactPersonName",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Contact Number",
      field: "contactNumber",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "E-mail",
      field: "email",
      options: {
        headerNoWrap: true,
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
                perform="Contract-ServiceProvider Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Edit Service Provider"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Can
                perform="Contract-ServiceProvider Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    title="Delete Service Provider"
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
    const { loading, data, tableOptions } = this.props;
    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Service Providers"
          )
        }
        data={data}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default spTable;
