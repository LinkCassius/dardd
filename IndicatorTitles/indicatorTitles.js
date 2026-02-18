import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { ApiEndPoints } from "../../config";
import Can from "../../components/common/Auth/Can";
import IndicatorTitlesForm from "./indicatorTitlesForm";
import IndicatorTitlesTable from "./indicatorTitlesTable";
import DialogWrapper from "../../components/common/Dialog";
import auth from "../../auth";
import { createStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core";

import Modal from "../../components/common/modalconfirm";
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

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,

      filtersFlag: false,
      dimenstionlist: [],
      dimenstioncopy: [],

      dimensions: [],
      modal: false,
      indTitleObj: null,
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.search = debounce(1000, this.search);
  }
  getInitialData = (per_page, page, searchText, dimensions) => {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    if (dimensions === "undefined" || dimensions === undefined) dimensions = "";

    fetch(
      ApiEndPoints.IndicatorTitleslist +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText +
        "&dimensions=" +
        dimensions,
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

          if (dimensions !== "") {
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
    //await this.getDimenstionsList();

    await this.getInitialData(
      this.state.per_page,
      1,
      this.state.searchText,
      ""
    );
  }

  changePage = (page) => {
    this.setState({ page, loading: true });
    this.getInitialData(
      this.state.per_page,
      page,
      this.state.searchText,

      this.state.dimensions
    );
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page, loading: true });
    this.getInitialData(
      per_page,
      this.state.page,
      this.state.searchText,

      this.state.dimensions
    );
  };

  search = (searchText) => {
    this.setState({ searchText, loading: true });
    this.getInitialData(
      this.state.per_page,
      1,
      searchText,
      this.state.dimensions
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
    this.setState({ indicators, modal: false });
    if (indicators.length <= this.state.per_page) this.state.page = 1;
    try {
      fetch(ApiEndPoints.deleteIndicatorTitle + "?id=" + indTitleObj._id, {
        method: "DELETE",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            NotificationManager.success(data.msg);
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

  refreshScreen = () => {
    this.setState({ dimension: "" });
    this.getInitialData(
      this.state.per_page,
      1,
      this.state.searchText,

      ""
    );
    this.setState({ filtersFlag: false });
  };
  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      sort: false,
      viewColumns: false,
      print: false,
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
            perform="IndicatorTitles Add Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add Indicator
              </button>
            )}
          />
        );
      },
    };
    //const classes = useStyles();

    const { indicators, indTitleObj } = this.state;
    return (
      <div>
        <div
          className="card"
          style={{
            backgroundColor: "blue",
            position: "relative", //don't forget this
          }}
        >
          {/* <IndicatorTitleFilters
            refreshScreen={this.refreshScreen}
            dimenstionlist={dimenstionlist}
            getIndicators={this.getInitialData}
            //radioOnChildChange={this.radioOnChildChange}
          /> */}

          <IndicatorTitlesTable
            loading={this.state.loading}
            indicators={indicators}
            onEdit={(id) => {
              this.setState({ isOpen: true, id: id });
            }}
            tableOptions={tableOptions}
            onDelete={this.handleToggle}
          />
        </div>
        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <IndicatorTitlesForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() =>
              this.getInitialData(
                this.state.per_page,
                1,
                this.state.searchText,
                ""
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
