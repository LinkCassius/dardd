import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { ApiEndPoints } from "../../config";
import FarmerTableInteraction from "./farmersListTableInteraction";
import auth from "../../auth";
class FarmersListInteraction extends Component {
  state = {
    loading: true,
    id: "new",
    farmers: [],

    totalRecCount: 0,
    searchText: "",
    per_page: 10,
    page: 0,
    exportDisabled: false,
    firstLoad: false,
    farmerId: "",
  };

  componentDidMount() {
    this.getInitialData(this.state.per_page, 1, this.state.searchText);
    this.setState({ firstLoad: true });
  }

  getInitialData(per_page, page, searchText) {
    // commonhelpers.captureLogActivity('Farmers List Viewed','View','Farmers KYC','Farmers List',window.location.href,'Farmer list viewed by '+ localStorage.getItem("userName"))

    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    fetch(
      ApiEndPoints.farmersDDL +
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
        console.log("data", data);
        if (data && data.success === true) {
          this.setState({
            farmers: data.result,
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
    this.setState({ page, loading: true, firstLoad: false });
    this.getInitialData(this.state.per_page, page, this.state.searchText);
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page, loading: true, firstLoad: false, page: 1 });
    this.getInitialData(per_page, 1, this.state.searchText);
    console.log("per_page : ", per_page);
  };

  search = (searchText) => {
    this.setState({ searchText, loading: true, firstLoad: false, page: 1 });
    this.getInitialData(this.state.per_page, 1, searchText);
  };

  render() {
    console.log("farmer Id : ", this.state.farmerId);
    return (
      <FarmerTableInteraction
        loading={this.state.loading}
        farmers={this.state.farmers}
        onSelect={(id) => {
          this.setState({ farmerId: id });
          this.props.onFarmerSelect(id);
        }}
        totalRecCount={this.state.totalRecCount}
        onSearchChange={this.search}
        onChangePage={this.changePage}
        onChangeRowsPerPage={this.changeRowsPerPage}
        firstLoad={this.state.firstLoad}
        per_page={this.state.per_page}
        page={this.state.page}
      />
    );
  }
}
export default FarmersListInteraction;
