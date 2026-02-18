import React, { Component } from "react";

import { ApiEndPoints } from "../../config";
import ProgramForm from "./programForm";
import CndTable from "./programTable";
import DialogWrapper from "../../components/common/Dialog";
import { NotificationManager } from "react-notifications";
import auth from "../../auth";
import Modal from "../../components/common/modalconfirm";

class ProgramList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      cnds: [],
      isOpen: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,
      modal: false,
      programObj: null,
    };
    this.getInitialData = this.getInitialData.bind(this);
  }

  componentDidMount() {
    this.getInitialData(this.state.per_page, 1, this.state.searchText);
  }

  getInitialData(per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.allProgramList +
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
        if (data && data.success === true) {
          this.setState({
            cnds: data.result,
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

  handleDelete = async (programObj) => {
    const originalPrograms = this.state.cnds;
    
    try {
      fetch(ApiEndPoints.deleteProgram + "?id=" + programObj._id, {
        method: "DELETE",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            const programs = originalPrograms.filter((m) => m._id !== programObj._id);
            this.setState({
              cnds: programs,
              modal: false,
              totalRecCount: programs.length,
            });
            if (programs.length <= this.state.per_page) this.state.page = 1;
            NotificationManager.success(data.msg);
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 401
          ) {
            this.setState({
              modal: false,
            });
            NotificationManager.error(data.msg);
            localStorage.clear();
            return (window.location.href = "/");
          } else if (
            data &&
            data.success === false &&
            data.responseCode === 400
          ) {
            this.setState({
              modal: false,
            });
            NotificationManager.error(data.msg);
          } else if (data && data.success === false) {
            this.setState({
              modal: false,
            });
            NotificationManager.error("Something went wrong");
          }
        })
        .catch(console.log);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        NotificationManager.error(
          "Programme/SubProgramme has already been deleted"
        );

      this.setState({ indicators: originalPrograms });
    }
  };

  handleToggle = (programObj) => {
    this.setState({ modal: !this.state.modal, programObj });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
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
      print: false,
      viewColumns: false,
      sort: false,
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
          <button
            onClick={() => this.setState({ isOpen: true, id: "new" })}
            type="button"
            className="btn btn-success"
          >
            <i className="icon-diff"></i> Add New Record
          </button>
        );
      },
    };

    return (
      <div>
        <CndTable
          loading={this.state.loading}
          cnds={this.state.cnds}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          tableOptions={tableOptions}
          onDelete={this.handleToggle}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="md"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <ProgramForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() =>
              this.getInitialData(this.state.per_page, 1, this.state.searchText)
            }
          />
        </DialogWrapper>
        <Modal
          modalflag={this.state.modal}
          toggle={this.handleToggle}
          cancelToggle={this.handleCanceltoggle}
          onModalSubmit={this.handleDelete}
          deleteObject={this.state.programObj}
          modalBody={
            this.state.programObj && " - " + this.state.programObj.cndCode
          }
        />
      </div>
    );
  }
}

export default ProgramList;
