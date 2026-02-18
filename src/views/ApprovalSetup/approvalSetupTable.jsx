import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../components/common/Auth/Can";

class ApprovalSetupTable extends Component {
  columns = [
    {
      name: "Approval Level",
      title: "Approval Level",
      field: "approvalLevel",
      options: {
        headerNoWrap: true,
        width: 120,
      },
    },
    {
      name: "Approver",
      title: "Approver",
      field: "approverId",
    },
    {
      name: "Sequence",
      title: "Sequence",
      field: "sequence",
      options: {
        headerNoWrap: true,
        width: 120,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return <div style={{ textAlign: "center" }}>{rowData.sequence}</div>;
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        headerNoWrap: true,
        width: 120,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="ApprovalSetup Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Update Approval Level"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              {/* <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Can
                perform="ApprovalSetup Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    title="Delete Approval Level"
                    onClick={() => {
                      this.props.onDelete(rowData);
                    }}
                    className="fa fa-trash"
                  ></i>
                )}
              /> */}
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, approvalsetups, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Approval Levels"
          )
        }
        data={approvalsetups}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default ApprovalSetupTable;
