import React, { Component } from "react";
import queryString from "query-string";
import { ApiEndPoints } from "../../config";
import Can from "../../components/common/Auth/Can";
import ContractForm from "./contractForm";
import ContractTable from "./contractTable";
import DialogWrapper from "../../components/common/Dialog";
import { NotificationManager } from "react-notifications";
import auth from "../../auth";
import CustomToolbar from "../../components/common/CustomToolbar";
import Modal from "../../components/common/modalconfirm";
import { debounce } from "throttle-debounce";

class ContractList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      contracts: [],
      id: "new",
      isOpen: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,

      modal: false,
      contractObj: null,
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.search = debounce(1000, this.search);
  }

  componentDidMount() {
    this.getInitialData(this.state.per_page, 1, this.state.searchText);
  }

  getInitialData(per_page, page, searchText) {
    // commonhelpers.captureLogActivity(
    //   "Contract List Viewed",
    //   "View",
    //   "Contracts",
    //   "Contract List",
    //   window.location.href,
    //   "Contract list viewed by " + localStorage.getItem("userName")
    // );

    let contractStatusX = "";
    const values = queryString.parse(this.props.location.search);

    if (Object.getOwnPropertyNames(values).length === 0) {
      contractStatusX = "";
    } else {
      contractStatusX = values.contractStatus;
    }

    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.contractList +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText +
        "&contractStatus=" +
        contractStatusX,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            contracts: data.result,
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
    this.getInitialData(this.state.per_page, 1, searchText); //page is 1 as search should start from page 1
  };

  handleToggle = (contractObj) => {
    this.setState({ modal: !this.state.modal, contractObj });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
  };

  handleDelete = async (contractObj) => {
    const originalContracts = this.state.contracts;
    const contracts = originalContracts.filter(
      (m) => m._id !== contractObj._id
    );
    this.setState({
      modal: false,
      totalRecCount: this.state.totalRecCount - 1,
    });
    if (contracts.length <= this.state.per_page) {
      this.setState({
        page: 1,
      });
    }
    try {
      fetch(ApiEndPoints.deletecontract + "?id=" + contractObj._id, {
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
              this.state.searchText
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
        NotificationManager.error("Contract has already been deleted");

      this.setState({ contracts: originalContracts });
    }
  };

  render() {
    const tableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      print: false,
      viewColumns: false,
      sort: false,
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
            perform="Contract Add Access"
            yes={() => (
              <CustomToolbar
                title="Add New Contract"
                onClick={() => this.setState({ isOpen: true, id: "new" })}
              />
            )}
          />
        );
      },
    };
    const { contractObj } = this.state;
    return (
      <div>
        <ContractTable
          loading={this.state.loading}
          contracts={this.state.contracts}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          tableOptions={tableOptions}
          onDelete={this.handleToggle}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <ContractForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() =>
              this.getInitialData(
                this.state.per_page,
                this.state.page, //1
                this.state.searchText
              )
            }
          />
        </DialogWrapper>

        <Modal
          modalflag={this.state.modal}
          toggle={this.handleToggle}
          cancelToggle={this.handleCanceltoggle}
          onModalSubmit={this.handleDelete}
          deleteObject={contractObj}
          modalBody={contractObj && " - " + contractObj.contractName}
        />
      </div>
    );
  }
}
export default ContractList;
