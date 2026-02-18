import React, { Component } from "react";
import MaterialTable from "material-table";
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
class FarmerTableInteraction extends Component {
  tableRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = { searchText: "" };
  }

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
      name: "Action",
      title: "Action",
      width: 100,
      render: (rowData) => {
        return (
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => this.props.onSelect(rowData._id)}
            >
              {/* <i className="fa fa-check"></i> */}
              Select
            </button>
          </div>
        );
      },
    },
  ];

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

    return (
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          tableRef={this.tableRef}
          title="Farmers List"
          columns={this.tableColumns}
          data={farmers}
          isLoading={loading}
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
            draggable: true,
            search: true,
            searchFieldAlignment: "right",
            padding: "dense",
            pageSize: per_page,
            showFirstLastPageButtons: false,
            loadingType: "overlay",
            //emptyRowsWhenPaging: false,
          }}
          components={{
            Pagination: (props) => (
              <TablePagination
                {...props}
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
          }}
          onSearchChange={() => {
            this.props.onSearchChange(this.tableRef.current.state.searchText);
          }}
        />
      </MuiThemeProvider>
    );
  }
}

export default FarmerTableInteraction;
