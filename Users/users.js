import React, { Component } from "react";
import { ApiEndPoints } from "../../config";
import Footer from "../../components/Footer/footer";
import TopNavbar from "../../components/Header/top.navbar";
import DialogWrapper from "../../components/common/Dialog";
import Can from "../../components/common/Auth/Can";
import UserForm from "./userForm";
import UserTable from "./userTable";
import auth from "../../auth";
import { NotificationManager } from "react-notifications";

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      id: "new",
      users: [],
      isOpen: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,
    };
    this.getInitialData = this.getInitialData.bind(this);
  }

  getInitialData(per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.usersList +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("user data :", data);
        if (data && data.success === true) {
          this.setState({
            users: data.result,
            totalRecCount: data.totalRecCount,
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

  componentDidMount() {
    this.getInitialData(this.state.per_page, 1, this.state.searchText);
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
    this.getInitialData(this.state.per_page, 1, searchText); //page is 1 as search should start from page 1
  };

  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      count: this.state.totalRecCount,
      rowsPerPage: this.state.per_page,

      viewColumns: false,
      sort: false,
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
            perform="Create User Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add New User
              </button>
            )}
          />
        );
      },
    };

    return (
      <div>
        <UserTable
          loading={this.state.loading}
          users={this.state.users}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          tableOptions={tableOptions}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          className="customeModel"
        >
          <UserForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() =>
              this.getInitialData(this.state.per_page, 1, this.state.searchText)
            }
          />
        </DialogWrapper>
      </div>
    );
  }
}

export default Users;
