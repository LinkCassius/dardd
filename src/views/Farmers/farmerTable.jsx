import React, { Component } from "react";
import Can from "../../components/common/Auth/Can";
import MaterialTable, { MTableToolbar } from "material-table";
import { TablePagination } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
    },
    secondary: {
      main: "#ff9100",
    },
  },
});
class FarmerTable extends Component {
  tableRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = { searchText: "", pageSize: "10" };
  }
  /*
  columns = [
    {
      name: "Surname",
      title: "Surname",
      field: "surname",
      filterPlaceholder: "Search By Surame",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Name",
      title: "Name",
      field: "name",
      filterPlaceholder: "Search By Name",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Identity Number",
      title: "Identity Number",
      field: "identityNumber",
      key: "title",
      filterPlaceholder: "Search By Identity Number",
      options: {
        headerNoWrap: true,
      },
    },

    {
      name: "Contact No",
      title: "Contact No",
      field: "contactNumber",
      key: "contactNumber",
      filterPlaceholder: "Search By Contact No",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Farmer Type",
      title: "farmer type",
      field: "farmerType",
      filterPlaceholder: "Search By Farmer Type",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Municipality",
      title: "Municipality",
      field: "farmMuncipalRegion",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //console.log("municipality : ", value.farmMuncipalRegion[0].cndName);
          return value.farmerProduction.farmMuncipalRegion.cndName;
        },
      },
    },
    {
      name: "Farm Name",
      title: "Farm Name",
      field: "farmName",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.farmName;
        },
      },
    },
    {
      name: "Total Farm Size (ha)",
      title: "Total Farm Size",
      field: "Total",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.totalFarmSize.Total;
        },
      },
    },
    {
      name: "Arable Farm Size (ha)",
      title: "Arable Farm Size",
      field: "Arable",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.totalFarmSize.Arable;
        },
      },
    },
    {
      name: "Non-arable Farm Size (ha)",
      title: "Non-arable Farm",
      field: "Non-arable",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.totalFarmSize["Non-arable"];
        },
      },
    },
    {
      name: "Layers",
      title: "Layers",
      field: "Layers",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Layers;
        },
      },
    },
    {
      name: "Broilers",
      title: "Broilers",
      field: "Broilers",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Broilers;
        },
      },
    },
    {
      name: "Cattle",
      title: "Cattle",
      field: "Cattle",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Cattle;
        },
      },
    },
    {
      name: "Goat",
      title: "Goat",
      field: "Goat",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Goat;
        },
      },
    },
    {
      name: "Sheep",
      title: "Sheep",
      field: "Sheep",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Sheep;
        },
      },
    },
    {
      name: "Pigs",
      title: "Pigs",
      field: "Pigs",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Pigs;
        },
      },
    },
    {
      name: "Ostrich",
      title: "Ostrich",
      field: "Ostrich",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Ostrich;
        },
      },
    },
    {
      name: "Rabbit",
      title: "Rabbit",
      field: "Rabbit",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Rabbit;
        },
      },
    },
    {
      name: "Livestock Other",
      title: "Livestock Other",
      field: "Other",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.Other == null ||
            value.farmerProduction.liveStock.Other == undefined
            ? ""
            : value.farmerProduction.liveStock.Other;
        },
      },
    },
    {
      name: "Livestock Other Specify",
      title: "Livestock Other Specify",
      field: "liveStockOther",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.farmerProduction.liveStock.liveStockOther == null ||
            value.farmerProduction.liveStock.liveStockOther == undefined
            ? ""
            : value.farmerProduction.liveStock.liveStockOther;
        },
      },
    },
    // {
    //   name: "Is Owner",
    //   title: "Is Owner",
    //   field: "isOwner",
    //   options: {
    //     headerNoWrap: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return value.isOwner === true ? "Yes" : "No";
    //     },
    //   },
    // },
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
                perform="Farmer Edit Access"
                yes={() => (
                  <a href={"#/update-farmer-data/" + rowData._id}>
                    <i
                      style={{
                        fontSize: "20px",
                        color: "#2196f3",
                      }}
                      title="Edit Farmer Details"
                      className="fa fa-edit"
                    ></i>
                  </a>
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
      title: "Surname",
      field: "surname",
      width: 130,
    },
    {
      title: "Name",
      field: "name",
      width: 180,
    },
    {
      title: "Identity Number",
      field: "identityNumber",
      width: 160,
    },

    {
      title: "Contact No",
      field: "contactNumber",

      width: 130,
    },
    {
      title: "Is Disabled",
      field: "isDisabled",
      width: 130,
      render: (rowData) => {
        return rowData.isDisabled ? "Yes" : "No";
      },
    },
    {
      title: "Residential Address",
      field: "residentialAddress",
      width: 360,
      render: (rowData) => {
        return rowData.residentialAddress.toLowerCase();
      },
    },
    {
      title: "Postal Code",
      field: "residentialPostalcode",
      width: 130,
    },
    {
      title: "Farmer type",
      field: "farmerType",
      width: 130,
    },
    {
      title: "Ownership Type",
      field: "ownershipTypeObj.cndName",
      width: 350,
    },
    {
      title: "Land Aquisition",
      field: "landAquisitionObj.cndName",
      width: 200,
    },
    {
      title: "Redistribution",
      field: "programmeRedistributionObj.cndName",
      width: 120,
    },
    {
      title: "Farm Name",
      field: "farmerProduction[0].farmName",
      width: 250,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.farmName
          ? rowData.farmerProduction[0].farmName
          : "NA";
      },
    },
    {
      title: "District",
      field: "farmerProduction[0].metroDistrictObj.cndName",
      width: 150,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.metroDistrictObj.cndName
          ? rowData.farmerProduction[0].metroDistrictObj.cndName
          : "NA";
      },
    },
    {
      title: "Municipality",
      field: "farmerProduction[0].farmMuncipalRegionObj.cndName",
      width: 200,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.farmMuncipalRegionObj.cndName
          ? rowData.farmerProduction[0].farmMuncipalRegionObj.cndName
          : "NA";
      },
    },
    {
      title: "Ward Number",
      field: "farmerProduction[0].wardNumber",
      width: 150,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.wardNumber
          ? rowData.farmerProduction[0].wardNumber
          : "NA";
      },
    },
    {
      title: "Town Or Village",
      field: "farmerProduction[0].townVillage",
      width: 170,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.townVillage
          ? rowData.farmerProduction[0].townVillage
          : "NA";
      },
    },
    {
      title: "Total Farm Size",
      field: "farmerProduction[0].totalFarmSize.Total",
      width: 160,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.totalFarmSize.Total
          ? rowData.farmerProduction[0].totalFarmSize.Total
          : "0";
      },
    },
    {
      title: "Grazing Farm Size",
      field: "farmerProduction[0].totalFarmSize.Grazing",
      width: 170,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.totalFarmSize.Grazing
          ? rowData.farmerProduction[0].totalFarmSize.Grazing
          : "0";
      },
    },
    {
      title: "Arable Farm Size",
      field: "farmerProduction[0].totalFarmSize.Arable",
      width: 160,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.totalFarmSize.Arable
          ? rowData.farmerProduction[0].totalFarmSize.Arable
          : "0";
      },
    },
    {
      title: "Non-arable Farm",
      field: 'farmerProduction[0].totalFarmSize["Non-arable"]',
      width: 160,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.totalFarmSize["Non-arable"]
          ? rowData.farmerProduction[0].totalFarmSize["Non-arable"]
          : "0";
      },
    },
    {
      title: "Layers",
      field: "farmerProduction[0].liveStock.Layers",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Layers
          ? rowData.farmerProduction[0].liveStock.Layers
          : "0";
      },
    },
    {
      title: "Broilers",
      field: "farmerProduction[0].liveStock.Broilers",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Broilers
          ? rowData.farmerProduction[0].liveStock.Broilers
          : "0";
      },
    },
    {
      title: "Cattle",
      field: "farmerProduction[0].liveStock.Cattle",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Cattle
          ? rowData.farmerProduction[0].liveStock.Cattle
          : "0";
      },
    },
    {
      title: "Goat",
      field: "farmerProduction[0].liveStock.Goat",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Goat
          ? rowData.farmerProduction[0].liveStock.Goat
          : "0";
      },
    },
    {
      title: "Sheep",
      field: "farmerProduction[0].liveStock.Sheep",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Sheep
          ? rowData.farmerProduction[0].liveStock.Sheep
          : "0";
      },
    },
    {
      title: "Pigs",
      field: "farmerProduction[0].liveStock.Pigs",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Pigs
          ? rowData.farmerProduction[0].liveStock.Pigs
          : "0";
      },
    },
    {
      title: "Ostrich",
      field: "farmerProduction[0].liveStock.Ostrich",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Ostrich
          ? rowData.farmerProduction[0].liveStock.Ostrich
          : "0";
      },
    },
    {
      title: "Rabbit",
      field: "farmerProduction[0].liveStock.Rabbit",
      width: 130,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Rabbit
          ? rowData.farmerProduction[0].liveStock.Rabbit
          : "0";
      },
    },
    {
      title: "Livestock Other",
      field: "farmerProduction[0].liveStock.Other",
      width: 150,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.Other
          ? rowData.farmerProduction[0].liveStock.Other
          : "0";
      },
    },
    {
      title: "Livestock Other Specify",
      field: "farmerProduction[0].liveStock.liveStockOther",
      width: 210,
      render: (rowData) => {
        return rowData.farmerProduction[0]?.liveStock.liveStockOther
          ? rowData.farmerProduction[0].liveStock.liveStockOther
          : "NA";
      },
    },
    {
      title: "Annual Turn Over",
      field: "farmerAssetsServices[0].annualTurnoverObj.cndName",
      width: 350,
      render: (rowData) => {
        return rowData.farmerAssetsServices[0]?.annualTurnoverObj?.cndName
          ? rowData.farmerAssetsServices[0].annualTurnoverObj.cndName
          : "NA";
      },
    },
    {
      title: "Preferred Communication",
      field: "farmerAssetsServices[0].preferredcommunicationObj.cndName",
      width: 230,
      render: (rowData) => {
        return rowData.farmerAssetsServices[0]?.preferredcommunicationObj
          ?.cndName
          ? rowData.farmerAssetsServices[0].preferredcommunicationObj.cndName
          : "NA";
      },
    },
    {
      title: "Status",
      field: "approverStatus",
      width: 130,
      render: (rowData) => {
        return rowData.approverStatus ? rowData.approverStatus : "Pending";
      },
      customFilterAndSearch: (term, rowData) => {
        return rowData.approverStatus.indexOf(term) !== -1;
      },
    },
    {
      name: "Action",
      title: "Action",
      width: 100,
      render: (rowData) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Can
              perform="Farmer Edit Access"
              yes={() => (
                <a href={"#/update-farmer-data/" + rowData._id}>
                  <i
                    style={{
                      fontSize: "17px",
                      color: "#2196f3",
                    }}
                    title="Edit Farmer Details"
                    className="fa fa-edit"
                  ></i>
                </a>
              )}
            />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Can
              perform="Farmer Edit Access"
              yes={() => (
                <i
                  style={{
                    fontSize: "17px",
                    color: "red",
                    cursor: "pointer",
                  }}
                  title="Delete Farmer"
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
  ];

  componentDidUpdate(prevProps) {
    // if (this.props.per_page !== prevProps.per_page) {
    //   this.setState({ pageSize: this.props.per_page });
    // }
  }

  render() {
    const {
      loading,
      farmers,
      // tableOptions,
      // matTableOptions,
      totalRecCount,
      firstLoad,
      per_page,
      page,
    } = this.props;
    //console.log("state search text : ", this.state.searchText);

    // console.log(" perPage Interaction table : ", per_page);
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
      //       "Farmers List"
      //     )
      //   }
      //   data={farmers}
      //   columns={this.columns}
      //   options={tableOptions}
      // />
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          tableRef={this.tableRef}
          title="Farmers List"
          columns={this.tableColumns}
          data={farmers}
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
              searchPlaceholder:
                "Search by Surname or name or identity no or contact no",
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
                //variant="outlined"
                shape="rounded"
                rowsPerPageOptions={[]}
                rowsPerPage={per_page}
                count={totalRecCount}
                page={Math.max(0, firstLoad ? page : page - 1)}
                onPageChange={(e, page) => {
                  /* handle page changes */
                  this.props.onChangePage(page + 1);
                  //this.setState({ pageNumber: page + 1 });
                }}
                onRowsPerPageChange={(event) => {
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
                    <a href="#/farmer-registration">
                      <button type="button" className="btn btn-success">
                        <i className="icon-diff"></i> Add New Farmer
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
                        : "Export Farmers"}
                    </button>
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

export default FarmerTable;
