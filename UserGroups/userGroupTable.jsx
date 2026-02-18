import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../components/common/Auth/Can";

class UserGroupTable extends Component {
  columns = [
    {
      name: "Role Name",
      title: "Role Name",
      field: "groupName",
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
                perform="Update Role Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Role Update"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
              {/* <span>&nbsp;&nbsp;</span>
              <Can
                perform="Update Role Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Widget"
                    onClick={() => this.props.onEdit(rowData._id)}
                    className="fa fa-th-large"
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
    const { loading, usergroups, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Roles"
          )
        }
        data={usergroups}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default UserGroupTable;
