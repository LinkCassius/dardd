import React, { Component } from "react";
import Can from "../../components/common/Auth/Can";
import MaterialTable, { MTableToolbar } from "material-table";
import { TablePagination } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#ff9100",
    },
  },
});
class farmerInteractionTable extends Component {
  tableRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = { searchText: "", pageSize: "10" };
  }
  /*columns = [
    {
      name: "Extension Practitioner",
      title: "Extension Practitioner",
      field: "createdBy",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //console.log("vvaall : ", value);
          //return value.users[0]?.firstName + " " + value.users[0]?.lastName;
          //return value.createdByObj?.name;
          return value.createdByObj ? value.createdByObj?.name : "NA";
        },
      },
    },
    // {
    //   name: "Supervisor",
    //   title: "Supervisor",
    //   field: "supervisor",
    //   options: {
    //     headerNoWrap: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       // console.log("vvaall : ", value);
    //       // return (
    //       //   value.supervisors[0]?.firstName +
    //       //   " " +
    //       //   value.supervisors[0]?.lastName
    //       // );
    //       //return value.supervisorObj?.name;
    //       return "";
    //     },
    //   },
    // },
    {
      name: "Farmer Name",
      title: "Farmer Name",
      field: "farmerId",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerObj?.surname
            ? value.farmerObj?.surname + " " + value.farmerObj?.name
            : "NA";
        },
      },
    },
    {
      name: "Service Type",
      title: "Service Type",
      field: "serviceType",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Service Date",
      title: "Service Date",
      field: "serviceDate",
      key: "serviceDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.serviceDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "Service Description",
      title: "serviceDescription",
      field: "serviceDescription",
      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.serviceDescription;
        },
      },
    },
    {
      name: "Status",
      title: "approverStatus",
      field: "approverStatus",
      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.approverStatus ? value.approverStatus : "Pending";
        },
      },
    },
    {
      name: "Action",

      filter: false,
      sort: false,
      options: {
        headerNoWrap: true,
        filter: false,
        sort: false,
        width: 100,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Interaction Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Interaction Update"
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
*/
  tableColumns = [
    {
      title: "Extension Officer",
      field: "createdBy",
      width: 150,
      render: (rowData) => {
        return rowData.createdByObj ? rowData.createdByObj?.name : "NA";
      },
    },
    {
      title: "Farmer",
      //field: "farmerObj.surname",
      width: 200,
      render: (rowData) =>
        rowData.farmerObj.surname + " " + rowData.farmerObj.name,
      customFilterAndSearch: (term, rowData) => {
        return (
          (rowData.farmerObj.surname + " " + rowData.farmerObj.name).indexOf(
            term
          ) !== -1
        );
      },
    },

    {
      title: "Identity Number",
      field: "identityNumber",
      width: 150,
    },
    {
      title: "Service Type",
      field: "serviceType",
      width: 210,
    },
    {
      title: "Service Date",
      field: "serviceDate",
      width: 120,

      render: (rowData) => {
        return `${new Date(rowData.serviceDate * 1000).toLocaleDateString(
          "en-GB"
        )}`;
      },
    },
    {
      title: "Service Description",
      field: "serviceDescription",
      width: 200,
      render: (rowData) => {
        return rowData.serviceDescription;
      },
      customFilterAndSearch: (term, rowData) => {
        return rowData.serviceDescription.indexOf(term) !== -1;
      },
    },
    {
      title: "Services Requested",
      field: "additionalServices",
      width: 150,
    },
    {
      title: "Proposals",
      field: "proposals",
      width: 150,
    },
    {
      title: "Horticulture",
      field: "commodity.Horticulture",
      width: 150,
    },
    {
      title: "Cotton",
      field: "commodity.Cotton",
      width: 150,
    },
    {
      title: "Sugarcane",
      field: "commodity.Sugarcane",
      width: 150,
    },
    {
      title: "Vegetables",
      field: "commodity.Vegetables",
      width: 150,
    },
    {
      title: "Grain Crops",
      field: "commodity[Grain Crops]",
      width: 150,
    },
    {
      title: "Large Stock",
      field: "commodity[Large Stock]",
      width: 150,
    },
    {
      title: "Small Stock",
      field: "commodity[Small Stock]",
      width: 150,
    },
    {
      title: "Poultry",
      field: "commodity.Poultry",
      width: 150,
    },
    {
      title: "Fodder",
      field: "commodity.Fodder",
      width: 150,
    },
    {
      title: "Commidity Other",
      field: "commodity.Other",
      width: 150,
    },
    {
      title: "Other Value",
      field: "commodityOther",
      width: 150,
    },
    {
      title: "Status",
      field: "approverStatus",
      width: 130,
      render: (rowData) => {
        return rowData.approverStatus ? rowData.approverStatus : "Pending";
      },
    },
    {
      title: "Action",
      width: 100,

      render: (rowData) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Can
              perform="Interaction Edit Access"
              yes={() => (
                <i
                  style={{
                    fontSize: "20px",
                    color: "#2196f3",
                    cursor: "pointer",
                  }}
                  title="Interaction Update"
                  onClick={() => this.props.onEdit(rowData._id)}
                  className="fa fa-edit"
                ></i>
              )}
            />
          </div>
        );
      },
    },
  ];
  render() {
    const {
      loading,
      interactions,
      //tableOptions
      totalRecCount,
      firstLoad,
      per_page,
      page,
    } = this.props;
    //console.log("Interaction table : ", interactions);
    // console.log("totalRecCount Interaction table : ", totalRecCount);
    // console.log(" page Interaction table : ", page);
    // console.log(" firstLoad Interaction table : ", firstLoad);

    return (
      // <MaterialDatatable
      //   striped
      //   title={
      //     loading === true ? (
      //       <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
      //     ) : (
      //       "Interactions List"
      //     )
      //   }
      //   data={interactions}
      //   columns={this.columns}
      //   options={tableOptions}
      // />

      <MuiThemeProvider theme={theme}>
        <MaterialTable
          tableRef={this.tableRef}
          title="Interactions"
          data={interactions}
          columns={this.tableColumns}
          //options={matTableOptions}
          isLoading={loading}
          // actions={[
          //   {
          //     icon: "add",
          //     tooltip: "Add Farmer",
          //     isFreeAction: true,
          //     onClick: (event) => alert("You want to add a new row"),
          //   },
          // ]}
          localization={{
            toolbar: {
              searchPlaceholder: "Search by Farmer name, Identity number",
            },
          }}
          options={{
            exportButton: false,
            headerStyle: {
              backgroundColor: "#02501e",
              color: "#FFF",
            },
            sorting: false,
            //draggable: true,
            fixedColumns: {
              left: 2,
              right: 1,
            },
            search: true,
            searchFieldAlignment: "right",
            //searchFieldStyle: { paddingLeft: "100px" },
            padding: "dense",
            pageSize: per_page,
            showFirstLastPageButtons: false,
            loadingType: "overlay",
            emptyRowsWhenPaging: false,
          }}
          components={{
            Pagination: (props) => (
              <TablePagination
                {...props}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                rowsPerPageOptions={[]}
                rowsPerPage={per_page}
                count={totalRecCount}
                page={firstLoad ? page : page - 1}
                onChangePage={(e, page) => {
                  /* handle page changes */
                  this.props.onChangePage(page + 1);
                  //this.setState({ pageNumber: page + 1 });
                }}
                onChangeRowsPerPage={(event) => {
                  /* handle page size change : event.target.value */
                  this.props.onChangeRowsPerPage(event.target.value);
                }}
              />
            ),
            Toolbar: (props) => {
              return (
                <div>
                  <MTableToolbar {...props} />
                  <div
                    style={{ padding: "0px 5px 5px 5px", textAlign: "right" }}
                  >
                    {/* <a href="#/farmer-registration">
                    <button type="button" className="btn btn-success">
                      <i className="icon-diff"></i> Add New Interaction
                    </button>
                  </a>
                  <span>&nbsp;&nbsp;</span>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => this.props.exportFarmers()}
                    disabled={this.props.exportDisabled}
                  >
                    {this.props.exportDisabled
                      ? "Downloading..."
                      : "Export Interactions"}
                  </button> */}
                    <React.Fragment>
                      <Can
                        perform="Interaction Add Access"
                        yes={() => (
                          <button
                            onClick={
                              () => this.props.onClickAddInteraction()
                              //this.setState({ isOpen: true, id: "new" })
                            }
                            type="button"
                            className="btn btn-success"
                          >
                            <i className="icon-diff"></i> Add New Interaction
                          </button>
                        )}
                      />
                      <span>&nbsp;&nbsp;</span>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => this.props.exportFarmerInteractions()}
                        disabled={this.props.exportDisabled}
                      >
                        {this.props.exportDisabled
                          ? "Downloading..."
                          : "Export Interactions"}
                      </button>
                    </React.Fragment>
                  </div>
                </div>
              );
            },
          }}
          onSearchChange={() => {
            this.props.onSearchChange(this.tableRef.current.state.searchText);
          }}
        />
      </MuiThemeProvider>
    );
  }
}

export default farmerInteractionTable;
