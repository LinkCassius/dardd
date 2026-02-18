import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { ApiEndPoints, siteConfig } from "../../config";
import FetchRequest from "../../components/Http/FetchRequest";
import Footer from "../../components/Footer/footer";
import TopNavbar from "../../components/Header/top.navbar";
import commonhelpers from "../../helpers/commonHelper";
import FarmerTable from "./farmerTable";
import auth from "../../auth";
import CustomToolbar from "../../components/common/CustomToolbar";
import Can from "../../components/common/Auth/Can";
import Modal from "../../components/common/modalconfirm";
//import moment from "moment";
import moment from "moment-timezone";
import FarmerFilters from "../report-filters/FarmerFilters";
import { debounce } from "throttle-debounce";

class FarmersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      id: "new",
      farmers: [],

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 0,
      exportDisabled: false,
      firstLoad: false,

      modal: false,
      farmerObj: null,

      body: {
        startDate: "",
        endDate: "",
        childArray: "",
        approvalStatus: "",
      },
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.search = debounce(1000, this.search);
  }

  componentDidMount() {
    this.setState({ firstLoad: true });
    this.getInitialData(
      this.state.per_page,
      1,
      this.state.searchText,
      this.state.body
    );
  }

  async getInitialData(per_page, page, searchText, Obj) {
    // commonhelpers.captureLogActivity('Farmers List Viewed','View','Farmers KYC','Farmers List',window.location.href,'Farmer list viewed by '+ localStorage.getItem("userName"))
    console.log("get obj : ", Obj);
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    const data = await FetchRequest({
      url:
        ApiEndPoints.farmerslistnew +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      method: "POST",
      body: Obj,
    });

    console.log("data", data);
    if (data && data.success === true) {
      this.setState({
        farmers: data.result,
        totalRecCount: data.totalRecCount,
        loading: false,
      });
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    }

    window.scrollTo(0, 0);
  }

  changePage = (page) => {
    this.setState({ page, loading: true, firstLoad: false });
    this.getInitialData(
      this.state.per_page,
      page,
      this.state.searchText,
      this.state.body
    );
  };

  changeRowsPerPage = (per_page) => {
    this.setState({ per_page, loading: true, firstLoad: false, page: 1 });
    this.getInitialData(per_page, 1, this.state.searchText, this.state.body);
  };

  search = (searchText) => {
    this.setState({
      searchText,
      loading: true,
      firstLoad: false,
      page: 1,
      farmers: [],
    });
    this.getInitialData(this.state.per_page, 1, searchText, this.state.body);
  };

  download(filePath) {
    // fake server request, getting the file url as response
    setTimeout(() => {
      const response = {
        file: filePath,
      };
      // server sent the url to the file!
      // now, let's download:
      window.open(response.file);
      // you could also do:
      // window.location.href = response.file;
      // this.setState({
      //   exportDisabled: false,
      // });
    }, 25000);
  }

  fetch5kFarmers = async (fileName) => {
    //////1st doc

    const res = await fetch(
      ApiEndPoints.exportfarmers +
        "?skipRecords=0&sheetName=Sheet1&fileName=" +
        fileName,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    );
    const data = await res.json();

    if (data && data.success === true) {
      this.setState({
        loading: false,
      });
      // this.download(
      //   siteConfig.imagesPath +
      //     data.fileName +
      //     "?token=" +
      //     localStorage.getItem("uploadToken")
      // );
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    } else {
      this.setState({ exportDisabled: false });
    }
  };

  fetch10kFarmers = async (fileName) => {
    //////2nd doc
    const res = await fetch(
      ApiEndPoints.exportfarmers +
        "?skipRecords=5000&sheetName=Sheet2&fileName=" +
        fileName,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    );
    const data = await res.json();

    if (data && data.success === true) {
      //console.log("Farmers Data Success - EXCEL", data.fileName);
      this.setState({
        loading: false,
      });
      // this.download(
      //   siteConfig.imagesPath +
      //     data.fileName +
      //     "?token=" +
      //     localStorage.getItem("uploadToken")
      // );
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    } else {
      this.setState({ exportDisabled: false });
    }
  };

  fetch15kFarmers = async (fileName) => {
    //////3rd doc
    const res = await fetch(
      ApiEndPoints.exportfarmers +
        "?skipRecords=10000&sheetName=Sheet3&fileName=" +
        fileName,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    );
    const data = await res.json();

    //console.log("data", data);
    if (data && data.success === true) {
      //console.log("Farmers Data Success - EXCEL", data.fileName);
      this.setState({
        loading: false,
      });
      // this.download(
      //   siteConfig.imagesPath +
      //     data.fileName +
      //     "?token=" +
      //     localStorage.getItem("uploadToken")
      // );
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    } else {
      this.setState({ exportDisabled: false });
    }
  };

  fetch20kFarmers = async (fileName) => {
    //////4th doc
    const res = await fetch(
      ApiEndPoints.exportfarmers +
        "?skipRecords=15000&sheetName=Sheet4&fileName=" +
        fileName,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    );
    const data = await res.json();

    if (data && data.success === true) {
      //console.log("Farmers Data Success - EXCEL", data.fileName);
      this.setState({
        loading: false,
        //exportDisabled: false,
      });
      // this.download(
      //   siteConfig.imagesPath +
      //     data.fileName +
      //     "?token=" +
      //     localStorage.getItem("uploadToken")
      // );
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    } else {
      this.setState({ exportDisabled: false });
    }
  };

  mergeExcel = async (file) => {
    //////merge all docs
    //console.log("merging started");
    const res = await fetch(ApiEndPoints.mergeExcel + "?fileName=" + file, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    });
    const data = await res.json();
    console.log("Merge Excel data : ", data);
    if (data && data.success === true) {
      //console.log("Excel Merged successfully", data.newFile);
      this.setState({
        loading: false,
        exportDisabled: false,
      });
      this.download(
        siteConfig.imagesPath +
          data.newFile +
          "?token=" +
          localStorage.getItem("uploadToken")
      );
    } else if (data && data.success === false && data.responseCode === 401) {
      NotificationManager.error(data.msg);
      localStorage.clear();
      return (window.location.href = "/");
    } else {
      this.setState({ exportDisabled: false });
    }
  };

  transformDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    let hrs = today.getHours();
    let mins = today.getMinutes();
    let secs = today.getSeconds();

    today = dd + "-" + mm + "-" + yyyy + "_" + hrs + mins + secs;
    return today;
  };

  exportFarmers = async () => {
    //console.log("export farmers started");
    if (this.state.exportDisabled) {
      return;
    }
    this.setState({ exportDisabled: true });

    let getDate = await this.transformDate();

    let files = [
      "Farmers_" + getDate + "_1.xlsx",
      "Farmers_" + getDate + "_2.xlsx",
      "Farmers_" + getDate + "_3.xlsx",
      "Farmers_" + getDate + "_4.xlsx",
    ];
    await this.fetch5kFarmers(files[0]);
    await this.fetch10kFarmers(files[1]);
    await this.fetch15kFarmers(files[2]);
    await this.fetch20kFarmers(files[3]);
    // await Promise.all([
    //   this.fetch5kFarmers(files[0]),
    //   this.fetch10kFarmers(files[1]),
    // ]);

    // await Promise.all([
    //   this.fetch15kFarmers(files[2]),
    //   this.fetch20kFarmers(files[3]),
    // ]);
    // await this.fetch15kFarmers(files[2]);
    // await this.fetch20kFarmers(files[3]);

    await setTimeout(() => {
      //console.log("waiting for 20 seconds  for excel data to load");
      this.mergeExcel("Farmers_" + getDate);
    }, 20000);
    // await this.mergeExcel("Farmers_11-06-2021_161847");
    //this.setState({ exportDisabled: false });
  };

  handleToggle = (farmerObj) => {
    this.setState({ modal: !this.state.modal, farmerObj });
  };
  handleCanceltoggle = () => {
    this.setState({ modal: false });
  };

  handleDelete = (farmerObj) => {
    const originalfarmers = this.state.farmers;
    const farmers = originalfarmers.filter((m) => m._id !== farmerObj._id);
    this.setState({
      //farmers,
      modal: false,
      totalRecCount: this.state.totalRecCount - 1,
    });
    //console.log("farmers.length, page : ", farmers.length, this.state.page);
    if (farmers.length <= this.state.per_page) {
      this.setState({
        page: 1,
      });
    }
    try {
      fetch(ApiEndPoints.deletefarmer + "?id=" + farmerObj._id, {
        method: "DELETE",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data && data.success === true) {
            await this.getInitialData(
              this.state.per_page,
              this.state.page,
              this.state.searchText
            );
            NotificationManager.info("Farmer deletion in progress..");
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
        NotificationManager.error("Farmer has already been deleted");

      this.setState({ farmers: originalfarmers });
    }
  };

  getFarmerSearchData = (SearchObj) => {
    let Obj = {};
    try {
      console.log("SearchObj : ", SearchObj);
      console.log("moment.tz.guess() : ", moment.tz.guess());

      let timeZone = moment.tz.guess(),
        addOffset = 0;
      if (timeZone === "Asia/Calcutta") addOffset = 19800;
      if (timeZone === "Africa/Johannesburg") addOffset = 7200;

      Obj.startDate = SearchObj.startDate
        ? parseInt(moment(SearchObj.startDate).format("X")) + addOffset + "000"
        : "";
      Obj.endDate = SearchObj.endDate
        ? parseInt(moment(SearchObj.endDate).format("X")) + addOffset + "000"
        : "";
      //moment.tz(value.createdDate, moment.tz.guess()).format("DD/MM/YYYY H:mm")
      Obj.approvalStatus = SearchObj.approvalStatus
        ? SearchObj.approvalStatus
        : "";
      Obj.childArray =
        SearchObj.selectedUser !== ""
          ? [{ _id: SearchObj.selectedUser }]
          : SearchObj.childArray;

      this.setState((prevState) => ({
        loading: true,
        body: {
          // object that we want to update
          ...prevState.body, // keep all other key-value pairs
          childArray: Obj.childArray, // update the value of specific key
          approvalStatus: Obj.approvalStatus,
          startDate: Obj.startDate,
          endDate: Obj.endDate,
        },
      }));
      this.getInitialData(this.state.per_page, 1, this.state.searchText, Obj);
    } catch (e) {
      console.log(e);
    }
  };

  handleRefresh = async () => {
    this.setState((prevState) => ({
      loading: true,
      body: {
        ...prevState.body,
        startDate: "",
        endDate: "",
        childArray: "",
        approvalStatus: "",
      },
    }));

    this.getInitialData(this.state.per_page, 1, "", null);
  };

  render() {
    return (
      <div className="card">
        <FarmerFilters
          getSearchData={this.getFarmerSearchData}
          handleRefresh={this.handleRefresh}
          url={ApiEndPoints.farmerusers}
        />
        <FarmerTable
          loading={this.state.loading}
          farmers={this.state.farmers}
          onEdit={(id) => {
            this.setState({ id: id });
          }}
          //tableOptions={tableOptions}
          //matTableOptions={matTableOptions}
          totalRecCount={this.state.totalRecCount}
          onSearchChange={this.search}
          onChangePage={this.changePage}
          onChangeRowsPerPage={this.changeRowsPerPage}
          firstLoad={this.state.firstLoad}
          per_page={this.state.per_page}
          page={this.state.page}
          exportFarmers={this.exportFarmers}
          exportDisabled={this.state.exportDisabled}
          onDelete={this.handleToggle}
        />

        <Modal
          modalflag={this.state.modal}
          toggle={this.handleToggle}
          cancelToggle={this.handleCanceltoggle}
          onModalSubmit={this.handleDelete}
          deleteObject={this.state.farmerObj}
          modalBody={
            this.state.farmerObj &&
            " - " +
              this.state.farmerObj.surname +
              " " +
              this.state.farmerObj.name
          }
        />
      </div>
    );
  }
}
export default FarmersList;
