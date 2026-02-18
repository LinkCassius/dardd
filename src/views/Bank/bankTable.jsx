import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../components/common/Auth/Can";

class BankTable extends Component {
  columns = [
    {
      name: "Bank Name",
      title: "Bank Name",
      field: "name",
      options: {
        headerNoWrap: true,
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
                perform="Bank Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Update Bank Details"
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
    const { loading, banks, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Banks List"
          )
        }
        data={banks}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default BankTable;
