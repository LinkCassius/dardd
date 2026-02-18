import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { TablePagination } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";

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
class RetentionTable extends Component {
  tableRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = { 
      searchText: "", 
      pageSize: "10" , 
      asAtBeforeStartDate: this.props.asAtBeforeStartDate, 
      asAtStartDate:this.props.asAtStartDate,
      expandedRows: {}
    };
  }
   
  tableColumns = [
    {
      title: "Contract Number",
      field: "contractNumber",
      width: 150,
    },
    {
      title: "Description",
      field: "contractName",
      width: 300,
      cellStyle: {
        maxWidth: "300px", // Limit the cell width
        whiteSpace: "normal", // Allow wrapping of text
        wordWrap: "break-word", // Break long words if necessary
        fontSize:"12px"
      },
      render: (rowData) => {
        const { expandedRows } = this.state;
        const isExpanded = expandedRows[rowData.tableData.id]; // Use unique id to track expansion state
        return (
          <span>
            {isExpanded
              ? rowData.contractName
              : `${rowData.contractName.substring(0, 80)} `}
            {rowData.contractName.length > 80 && (
              <span
                onClick={() => {
                  this.setState((prevState) => ({
                    expandedRows: {
                      ...prevState.expandedRows,
                      [rowData.tableData.id]: !isExpanded,
                    },
                  }));
                }}
                style={{ color: "blue", cursor: "pointer" }}
              >
                {isExpanded ? " Show Less" : "..."}
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: "Service Provider",
      field: "serviceProvider",
      width: 230,
    },

    {
      title: "Start Date",
      field: "startDate",
      width: 100,
      render:(rowData)=>{
        return `${new Date(rowData.startDate * 1000).toLocaleDateString(
          "en-GB"
        )}`;
      }
      // render: (rowData) => {
      //   if (!rowData.startDate) {
      //     return ""; // Handle case where startDate might be missing
      //   }
    
      //   const timestamp = rowData.startDate; // Assuming startDate is a Unix timestamp in seconds
      //   const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    
      //   // Extract day, month, and year
      //   const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
      //   const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      //   const year = date.getFullYear();
    
      //   // Format to dd/mm/yyyy
      //   const formattedDate = `${day}/${month}/${year}`;
    
      //   return formattedDate;
      // }
    },
    {
      title: "End Date",
      field: "endDate",
      width: 100,
      render:(rowData)=>{
        return `${new Date(rowData.endDate * 1000).toLocaleDateString(
          "en-GB"
        )}`;
      }
    },
    {
      title: "Contract Period",
      field: "contractPeriod",
      width: 140,
    },
    {
      title: "Extension(s) Granted",
      field: "extension",
      width: 180,
    },
    {
      title: "Bid Amount",
      field: "contractValue",
      width: 98,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.contractValue}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>
        );
      }
    },
    {
      title: "Approved Variation Order Amount",
      field: "variationApprovedAmount",
      width: 240,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.variationApprovedAmount}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>

        );
      }
    },
    {
      title: "Total Contract Amt (including Variation)",
      field: "totalContractAmount",
      width: 275,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.totalContractAmount}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>

        );
      }
    },
    {
      title: "TotalPaidBeforeOpeningBalance",
      field: "TotalPaidBeforeOpeningBalance",
      width: 190,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.TotalPaidBeforeOpeningBalance}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>

        );
      }

    },
    {
      title: "RetentionOpeningBalance",
      field: "retentionOpeningBalance",
      width: 273,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.retentionOpeningBalance}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>

        );
      }
    },
    {
      title: "Total Paid (Selected Period)",
      field: "retentionTotalPaid",
      width: 192,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.retentionTotalPaid}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>

        );
      }
    },
    {
      title: "Retention Closing Bal",
      field: "retentionClosingBalance",
      width: 153,
      render: (rowData)=>{
        return (
          <div style={{ textAlign: 'right' }}>
          <NumberFormat
            value={rowData.retentionClosingBalance}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"R"}
            decimalScale={2}
            renderText={(rowData) => (
              <span>
                {rowData.includes(".") === true ? rowData : rowData + ".00"}
              </span>
            )}
          />
          </div>

        );
      }
    }
  ];
 
  render() {
    const {
      loading,
      retentionContracts,
      // tableOptions,
      // matTableOptions,
      totalRecCount,
      firstLoad,
      per_page,
      page,
      dateBeforeOpenBal,
      startDateOpenBal
    } = this.props;
     
    const target1 = this.tableColumns.find((item) => item.title === "TotalPaidBeforeOpeningBalance");
    if(target1)
      target1.title = `Total paid as at ${dateBeforeOpenBal}`; 

    const target2 = this.tableColumns.find((item) => item.title === "RetentionOpeningBalance");
    if(target2)
      target2.title = `Retention opening bal as at ${startDateOpenBal}`; 

    return (
       
      <MuiThemeProvider theme={theme}>
       <div  >
        <MaterialTable
          tableRef={this.tableRef}
          title="Retention Register"
          columns={this.tableColumns}
          data={retentionContracts}
          isLoading={loading}
         
          localization={{
            toolbar: {
              searchPlaceholder:
                "Search by Contract Number or Description or Service Provider",
            },
          }}
          options={{
            rowStyle: {
              fontSize: "12px",  // Set the font size for the rows
            },
            exportButton: false,
            headerStyle: {
              backgroundColor: "#02501e",
              color: "#FFF",
              
            },
            sorting: false,
            //draggable: true,
            fixedColumns: {
              left: 2
            },
            search: true,
            searchFieldAlignment: "right",
            //searchFieldStyle: { paddingLeft: "100px" },
            padding: "dense",
            pageSize: per_page,
            showFirstLastPageButtons: true,
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
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => this.props.exportRetentionContracts()}
                      disabled={this.props.exportDisabled}
                    >
                      {this.props.exportDisabled
                        ? "Downloading..."
                        : "Export Retention Register"}
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
        </div>
      </MuiThemeProvider>
    );
  }
}

export default RetentionTable;
