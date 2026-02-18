import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../components/common/Auth/Can";

class UserTable extends Component {
  columns = [
    {
      name: "First Name",
      title: "First Name",
      field: "firstName",
    },
    {
      name: "Last Name",
      title: "Last Name",
      field: "lastName",
    },
    // {
    //   name: "User Name",
    //   title: "User Name",
    //   field: "userName",
    // },
    {
      name: "Phone",
      title: "Phone",
      field: "phone",
    },
    {
      name: "Email",
      title: "Email",
      field: "email",
    },
    // {
    //   name: "Is Admin",
    //   title: "Is Admin",
    //   field: "isAdmin",
    //   options: {
    //     headerNoWrap: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return value.isAdmin === true ? "Yes" : "No";
    //     }
    //   }
    // },
    {
      name: "Role",
      title: "Role",
      field: "userGroup",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.userGroup.groupName;
        },
      },
      //  path: "user_group.groupName"
    },
    {
      name: "Supervisor",
      title: "Supervisor",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //console.log("vla : ", value);
          return value.supervisor
            ? value.supervisor.firstName + " " + value.supervisor.lastName
            : "NA";
        },
      },
      //  path: "user_group.groupName"
    },
    {
      name: "Action",
      title: "Action",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Update User Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="User Update"
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
    const { loading, users, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Users"
          )
        }
        data={users}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default UserTable;
