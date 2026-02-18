import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import moment from "moment";
import momentzone from "moment-timezone";

class ActivityTable extends Component {
  columns = [
    {
      name: "Activity Name",
      title: "Activity Name",
      field: "activityName",
      key: "activityName",
      options: {
        width: 200,
        headerNoWrap: true,
      },
    },
    {
      name: "Activity Type",
      title: "Activity Type",
      field: "activityType",
      key: "activityType",
      options: {
        headerNoWrap: true,
      },
    },
    // {
    //   name: "Module",
    //   title: "Module",
    //   field: "module",
    //   key: "module",
    //   options: {
    //     headerNoWrap: true,
    //   },
    // },
    // {
    //   name: "Section",
    //   title: "Section",
    //   field: "section",
    //   key: "section",
    //   options: {
    //     headerNoWrap: true,
    //     width: 160,
    //   },
    // },
    {
      name: "Url",
      title: "Url",
      field: "url",
      key: "url",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.url === undefined ? "Android App" : value.url;
        },
        customValue: (dataObject) => {
          return dataObject.url;
        },
      },
    },
    {
      name: "User Name",
      title: "User Name",
      field: "userName",
      key: "userName",
      options: {
        width: 150,
        headerNoWrap: true,
      },
    },
    {
      name: "ip Address",
      title: "ip Address",
      field: "ipAddress",
      key: "ipAddress",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Activity Date",
      title: "Activity Date",
      field: "activityDate",
      key: "activityDate",
      options: {
        headerNoWrap: true,
        width: 150,
        customBodyRender: (value, tableMeta, updateValue) => {
          let CatZone = moment.tz(value.activityDate, moment.tz.guess());
          return <div> {CatZone.format("DD/MM/YYYY H:mm")}</div>;
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
            <div style={{ textAlign: "center" }}>
              <i
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="View Info"
                onClick={() => this.props.onEdit(rowData._id)}
                className="fa fa-eye"
              ></i>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, activityData, tableOptions } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Audit Log"
          )
        }
        data={activityData}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default ActivityTable;
