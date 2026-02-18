import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import Can from "../../components/common/Auth/Can";

class IndicatorTitlesTable extends Component {
  columns = [
    {
      name: "Programme",
      title: "Programme",
      field: "programmeName",

      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Sub-Programme",
      title: "Sub-Programme",
      field: "subProgrammeName",

      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Indicator Title",
      title: "Indicator Title",
      field: "indicatorTitle",
      key: "indicatorTitle",
      options: {
        headerNoWrap: true,
      },
    },
    // {
    //   name: "Programme-SubProgramme",
    //   title: "Program-SubProgram",
    //   field: "programNames",
    //   key: "programNames",
    //   options: {
    //     headerNoWrap: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return value.programNames ? (
    //         <div>
    //           <span
    //             style={{
    //               fontWeight: "Bold",
    //             }}
    //           >
    //             {value.programNames[0]}
    //           </span>
    //           {" - "}
    //           {value.programNames[1]}
    //           {value.programNames[2] !== undefined ? ", ... " : ""}
    //         </div>
    //       ) : (
    //         ""
    //       );
    //     },
    //   },
    // },
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
                    title="Indicator Title Update"
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
                    title="Delete Indicator Title"
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
    const { loading, indicators, tableOptions } = this.props;
    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Indicator Titles"
          )
        }
        data={indicators}
        columns={this.columns}
        options={tableOptions}
      />
    );
  }
}

export default IndicatorTitlesTable;
