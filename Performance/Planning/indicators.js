import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import queryString from "query-string";
import { ApiEndPoints } from "../../../config";
import Can from "../../../components/common/Auth/Can";
import commonhelpers from "../../../helpers/commonHelper";
import IndicatorFilters from "./indicatorFilters";
import IndicatorsForm from "./indicatorsForm";
import IndicatorsFormAssign from "./indicatorsFormAssign";
import IndicatorsTable from "./indicatorsTable";
import DialogWrapper from "../../../components/common/Dialog";
import auth from "../../../auth";
import startOfWeek from "date-fns/startOfWeek";
import { makeJSDateObject } from "../helper.js";
import { createStyles } from "@material-ui/styles";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import { withStyles } from "@material-ui/core";
import CardHeader from "../../../components/Card/CardHeader.js";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardBody from "../../../components/Card/CardBody.js";
import AnnualPerformanceFilter from "./ExportPlan/annualPerformanceFilters";
import Modal from "../../../components/common/modalconfirm";
import { debounce } from "throttle-debounce";

class Indicators extends Component {
  constructor(props) {
    super(props);
    this.getDimenstionsList = this.getDimenstionsList.bind(this);

    this.state = {
      loading: true,
      indicators: [],
      id: "new",
      isOpen: false,
      isOpenAssign: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,

      filtersFlag: false,
      dimenstionlist: [],
      dimenstioncopy: [],
      reportingCycle: "Annually",
      //selectedDate: new Date(),
      selectedDate: "",
      pickerView: ["year"],
      pickerType: "year",
      dimensions: [],

      modal: false,
      indTitleObj: null,
      financialYear: "",
      quarter: "ALL",
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.search = debounce(1000, this.search);
  }
  getInitialData = (
    per_page,
    page,
    searchText,
    reportingCycle,
    selectedCDate,
    dimensions,
    finYear
  ) => {
    let selectedDate = "";
    console.log("selectedCDate :", selectedCDate);
    // if (selectedCDate != "")
    //   selectedDate = this.getDateFormatString(
    //     new Date(selectedCDate),
    //     reportingCycle
    //   );
    if (selectedCDate === "ALL") selectedDate = "";
    else {
      if (selectedCDate === "Jan Feb Mar")
        selectedDate = Number(finYear) + 1 + ": " + selectedCDate;
      else selectedDate = finYear + ": " + selectedCDate;
    }

    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    if (dimensions == "undefined" || dimensions == undefined) dimensions = "";

    fetch(
      ApiEndPoints.indicatorsList +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText +
        "&cycleValue=" +
        selectedDate.trim() +
        "&dimensions=" +
        dimensions +
        "&finYear=" +
        finYear,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            indicators: data.result,
            totalRecCount: data.totalRecCount,
            loading: false,
          });

          if (reportingCycle != "") {
            this.setState({ reportingCycle });
          }
          if (selectedDate != "") {
            this.setState({ selectedDate });
          }
          if (dimensions != "") {
            this.setState({ dimensions });
          }
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else if (data && data.success === false) {
          NotificationManager.error("Something went wrong");
        }
      })
      .catch(console.log);
  };
  async componentDidMount() {
    await this.getDimenstionsList();

    // await this.getInitialData(
    //   this.state.per_page,
    //   1,
    //   this.state.searchText,
    //   "",
    //   "",
    //   "",
    //   this.state.financialYear
    // );
  }

  changePage = (page) => {
    this.setState({ page });
    this.getInitialData(
      this.state.per_page,
      page,
      this.state.searchText,
      this.state.reportingCycle,
      this.state.quarter,
      this.state.dimensions,
      this.state.financialYear
    );
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page });
    this.getInitialData(
      per_page,
      this.state.page,
      this.state.searchText,
      this.state.reportingCycle,
      this.state.quarter,
      this.state.dimensions,
      this.state.financialYear
    );
  };

  search = (searchText) => {
    this.setState({ searchText });

    if (searchText) {
      this.getInitialData(
        this.state.per_page,
        1,
        searchText,
        this.state.reportingCycle,
        this.state.quarter,
        this.state.dimensions,
        this.state.financialYear
      );
    }
    if (!searchText)
      this.getInitialData(
        this.state.per_page,
        1,
        searchText,
        this.state.reportingCycle,
        this.state.quarter,
        this.state.dimensions,
        this.state.financialYear
      );
  };

  assignChildren(objChild) {
    const childarray = [];
    objChild.map((value, index) => {
      value.id = value._id;
      if (value.children.length > 0) {
        value.children = this.assignChildren(value.children);
      }
      childarray.push(value);
    });

    return childarray;
  }

  getDimenstionsList = async () => {
    await fetch(ApiEndPoints.programList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          const dlist = [];

          data.result.map((value, index) => {
            value.id = value._id;
            if (value.children.length > 0) {
              value.children = this.assignChildren(value.children);
            }

            dlist.push(value);
          });

          this.setState({
            dimenstionlist: dlist,
            dimenstioncopy: data.result,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else if (data && data.success === false) {
          NotificationManager.error("Something went wrong");
        }
      })
      .catch(console.log);
  };

  getDateFormatString(date, reportingCycle) {
    let dateClone = makeJSDateObject(date);
    let PickerType = reportingCycle;
    let pickerFormat = "MMM do";
    let weekLable = "";

    const quarterly1 = ["Jan", "Feb", "Mar"];
    const quarterly2 = ["Apr", "May", "Jun"];
    const quarterly3 = ["Jul", "Aug", "Sep"];
    const quarterly4 = ["Oct", "Nov", "Dec"];

    if (PickerType == "Weekly") {
      pickerFormat = "MMM do";
      weekLable = "Week of";
    } else if (PickerType == "Monthly") {
      pickerFormat = "yyyy MMM";
    } else if (PickerType == "Quarterly") {
      pickerFormat = "MMM";
      var monthName = `${format(startOfWeek(dateClone), pickerFormat)}`;
      var yearstring = `${format(startOfWeek(dateClone), "yyyy")}`;
      var index1 = quarterly1.indexOf(monthName);
      if (index1 !== -1) {
        return (
          yearstring +
          ": " +
          quarterly1[0] +
          " " +
          quarterly1[1] +
          " " +
          quarterly1[2]
        );
      } else {
        var index2 = quarterly2.indexOf(monthName);
        if (index2 !== -1) {
          return (
            yearstring +
            ": " +
            quarterly2[0] +
            " " +
            quarterly2[1] +
            " " +
            quarterly2[2]
          );
        } else {
          var index3 = quarterly3.indexOf(monthName);
          if (index3 !== -1) {
            return (
              yearstring +
              ": " +
              quarterly3[0] +
              " " +
              quarterly3[1] +
              " " +
              quarterly3[2]
            );
          } else {
            var index4 = quarterly4.indexOf(monthName);
            if (index4 !== -1) {
              return (
                yearstring +
                ": " +
                quarterly4[0] +
                " " +
                quarterly4[1] +
                " " +
                quarterly4[2]
              );
            }
          }
        }
      }
    } else if (PickerType == "Annually") {
      pickerFormat = "yyyy";
    } else {
      pickerFormat = "MMM do";
    }

    return dateClone && isValid(dateClone)
      ? weekLable + ` ${format(startOfWeek(dateClone), pickerFormat)} `
      : "";
  }

  handleCycleChange = (event) => {
    let picType = "date";
    let picView = ["date"];
    if (event.target.value == "Weekly") {
      picType = "date";
      picView = ["date"];
    } else if (
      event.target.value == "Monthly" ||
      event.target.value == "Quarterly"
    ) {
      picType = "month";
      picView = ["year", "month"];
    } else if (event.target.value == "Annually") {
      picType = "year";
      picView = ["year"];
    }

    this.setState({
      [event.target.name]: event.target.value,
      pickerView: picView,
      pickerType: picType,
      selectedDate: new Date(),
    });
  };

  refreshScreen = () => {
    this.setState({ reportingCycle: "", selectedDate: "", dimension: "" });
    this.getInitialData(
      this.state.per_page,
      1,
      this.state.searchText,
      "",
      this.state.quarter,
      "",
      this.state.financialYear
    );
    this.setState({ filtersFlag: false });
  };

  handleToggle = (indTitleObj) => {
    this.setState({ modal: !this.state.modal, indTitleObj });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
  };

  handleDelete = async (indTitleObj) => {
    const originalIndicators = this.state.indicators;
    const indicators = originalIndicators.filter(
      (m) => m._id !== indTitleObj._id
    );
    this.setState({
      //indicators,
      modal: false,
      totalRecCount: this.state.totalRecCount - 1,
    });
    if (indicators.length <= this.state.per_page) {
      this.setState({
        page: 1,
      });
    }
    try {
      fetch(ApiEndPoints.deleteIndicator + "?id=" + indTitleObj._id, {
        method: "DELETE",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            NotificationManager.success(data.msg);

            this.getInitialData(
              this.state.per_page,
              this.state.page,
              this.state.searchText,
              this.state.reportingCycle,
              this.state.quarter,
              this.state.dimensions,
              this.state.financialYear
            );
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
          } else if (data && data.success === false) {
            NotificationManager.error("Something went wrong");
          }
        })
        .catch(console.log);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        NotificationManager.error("Indicator Title has already been deleted");

      this.setState({ indicators: originalIndicators });
    }
  };

  getFinancialYear = (finYear, quarter) => {
    this.setState({ financialYear: finYear, quarter: quarter });

    this.getInitialData(
      this.state.per_page,
      1,
      this.state.searchText,
      "",
      quarter,
      "",
      finYear
    );
  };

  render() {
    const tableOptions = {
      filterType: "multiselect",
      print: false,
      viewColumns: false,
      sort: false,
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      count: this.state.totalRecCount,
      rowsPerPage: this.state.per_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.changePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.changeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.search(tableState.searchText);
            break;
        }
      },
      customToolbar: () => {
        return (
          <Can
            perform="Indicators Add Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add Indicator Target
              </button>
            )}
          />
        );
      },
    };

    const { indicators, dimenstionlist, indTitleObj } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader
                color="primary"
                style={{ padding: "2px 0px 2px 15px", textAlign: "left" }}
              >
                <div className="row">
                  <div className="col-sm-5">
                    <h4 className="cardCategoryWhite cardTitlePerm">
                      Performance Plan
                    </h4>
                  </div>
                  <div className="col-sm-6">
                    {
                      <Can
                        perform="Annual Report View Access"
                        yes={() => <AnnualPerformanceFilter />}
                      />
                    }
                  </div>
                </div>
              </CardHeader>

              <CardBody>
                <IndicatorFilters
                  refreshScreen={this.refreshScreen}
                  dimenstionlist={dimenstionlist}
                  getIndicators={this.getInitialData}
                  //radioOnChildChange={this.radioOnChildChange}
                  getFY={this.getFinancialYear}
                />

                <IndicatorsTable
                  loading={this.state.loading}
                  indicators={indicators}
                  onEdit={(id) => {
                    this.setState({ isOpen: true, id: id });
                  }}
                  onAssign={(id) => {
                    this.setState({ isOpenAssign: true, id: id });
                  }}
                  tableOptions={tableOptions}
                  onDelete={this.handleToggle}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <IndicatorsForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() =>
              this.getInitialData(
                this.state.per_page,
                this.state.page,
                this.state.searchText,
                "",
                this.state.quarter,
                "",
                this.state.financialYear
              )
            }
          />
        </DialogWrapper>
        <DialogWrapper
          isOpen={this.state.isOpenAssign}
          toggle={() =>
            this.setState({ isOpenAssign: !this.state.isOpenAssign })
          }
          size="lg"
          className="customeModel"
        >
          <IndicatorsFormAssign
            toggle={() =>
              this.setState({ isOpenAssign: !this.state.isOpenAssign })
            }
            id={this.state.id}
            updateList={() =>
              this.getInitialData(
                this.state.per_page,
                this.state.page,
                this.state.searchText,
                "",
                this.state.quarter,
                "",
                this.state.financialYear
              )
            }
          />
        </DialogWrapper>

        <Modal
          modalflag={this.state.modal}
          toggle={this.handleToggle}
          cancelToggle={this.handleCanceltoggle}
          onModalSubmit={this.handleDelete}
          deleteObject={indTitleObj}
          modalBody={indTitleObj && " - " + indTitleObj.indicatorTitle}
        />
      </div>
    );
  }
}

const styles = createStyles((theme) => ({
  dayWrapper: {
    position: "relative",
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit",
  },
  customDayHighlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "2px",
    right: "2px",
    border: `1px solid ${theme.palette.secondary.main} `,
    borderRadius: "50%",
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: "#676767",
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  firstHighlight: {
    extend: "highlight",
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  },
  endHighlight: {
    extend: "highlight",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  },
}));

export default withStyles(styles)(Indicators);
