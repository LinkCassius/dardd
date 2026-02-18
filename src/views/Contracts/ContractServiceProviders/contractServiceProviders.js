import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { ApiEndPoints } from "../../../config";
import Can from "../../../components/common/Auth/Can";
import ContractSPForm from "./contractSPForm";
import ContractSPTable from "./contractSPTable";
import DialogWrapper from "../../../components/common/Dialog";
import auth from "../../../auth";
import { createStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core";
import Modal from "../../../components/common/modalconfirm";
import { debounce } from "throttle-debounce";

class ServiceProviders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      serviceProviders: [],
      id: "new",
      isOpen: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 1,

      modal: false,
      delObj: null,
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.search = debounce(1000, this.search);
  }
  getInitialData = (per_page, page, searchText) => {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.serviceproviderslist +
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
            serviceProviders: data.result,
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
    await this.getInitialData(this.state.per_page, 1, this.state.searchText);
  }

  changePage = (page) => {
    this.setState({ page, loading: true });
    this.getInitialData(this.state.per_page, page, this.state.searchText);
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page, loading: true });
    this.getInitialData(per_page, this.state.page, this.state.searchText);
  };

  search = (searchText) => {
    this.setState({ searchText, loading: true });
    this.getInitialData(this.state.per_page, 1, searchText);
  };

  handleToggle = (delObj) => {
    this.setState({ modal: !this.state.modal, delObj });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
  };

  handleDelete = async (delObj) => {
    const originalserviceProviders = this.state.serviceProviders;
    const serviceProviders = originalserviceProviders.filter(
      (m) => m._id !== delObj._id
    );
    this.setState({ serviceProviders, modal: false });
    if (serviceProviders.length <= this.state.per_page) this.state.page = 1;
    try {
      fetch(ApiEndPoints.deleteserviceprovider + "?id=" + delObj._id, {
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
        NotificationManager.error("Service Provider has already been deleted");

      this.setState({ serviceProviders: originalserviceProviders });
    }
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
            perform="Contract-ServiceProvider Add Access"
            yes={() => (
              <button
                onClick={() => this.setState({ isOpen: true, id: "new" })}
                type="button"
                className="btn btn-success"
              >
                <i className="icon-diff"></i> Add Service Provider
              </button>
            )}
          />
        );
      },
    };
    //const classes = useStyles();

    const { serviceProviders, delObj, loading } = this.state;
    return (
      <div>
        <div
          className="card"
          style={{
            backgroundColor: "blue",
            position: "relative", //don't forget this
          }}
        >
          <ContractSPTable
            loading={loading}
            data={serviceProviders}
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
          size="md"
          //style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <ContractSPForm
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
          deleteObject={delObj}
          modalBody={delObj && " - " + delObj.serviceProviderFirmName}
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

export default withStyles(styles)(ServiceProviders);
