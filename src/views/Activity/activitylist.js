import React, { Component } from "react";
import { ApiEndPoints } from "../../config";
import ActivityForm from "./activityForm";
import ActivityTable from "./activityTable";
import DialogWrapper from "../../components/common/Dialog";

import { NotificationManager } from "react-notifications";

class ActivityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activityData: [],
      id: "new",
      isOpen: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,
    };
  }

  componentDidMount() {
    this.getInitialData(this.state.per_page, 1, this.state.searchText);
  }

  getInitialData(per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.activityList +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        // headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            activityData: data.result,
            totalRecCount:
              searchText !== "" ? data.result.length : data.totalRecCount,
            loading: false,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
    window.scrollTo(0, 0);
  }

  changePage = (page) => {
    this.setState({ page });
    this.getInitialData(this.state.per_page, page, this.state.searchText);
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page });
    this.getInitialData(per_page, this.state.page, this.state.searchText);
  };

  search = (searchText) => {
    this.setState({ searchText });
    this.getInitialData(this.state.per_page, 1, searchText);
  };

  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      print: false,
      viewColumns: false,
      sort: false,
      count: this.state.totalRecCount,
      rowsPerPage: this.state.per_page,
      rowsPerPageOptions: [10, 20, 50, 75, 100],
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
    };

    return (
      <div>
        <ActivityTable
          loading={this.state.loading}
          activityData={this.state.activityData}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          tableOptions={tableOptions}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <ActivityForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
          />
        </DialogWrapper>
      </div>
    );
  }
}
export default ActivityList;
