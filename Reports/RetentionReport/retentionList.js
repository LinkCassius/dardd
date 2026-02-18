import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { ApiEndPoints, siteConfig } from "../../../config";
import FetchRequest from "../../../components/Http/FetchRequest";
import RetentionTable from "./retentionTable";
import auth from "../../../auth";
//import moment from "moment";
import moment from "moment-timezone";
import RetentionReportFilters from "../../report-filters/retentionReportFilters";
import { debounce } from "throttle-debounce";

class RetentionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      id: "new",
      retentionContracts: [],

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 0,
      exportDisabled: false,
      firstLoad: false,

      body: {
        startDate: "",
        endDate: "",
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
        ApiEndPoints.retentionReport +
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
        retentionContracts: data.result,
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
      retentionContracts: [],
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

  fetchRetentionContracts = async (fileName, searchText, Obj) => {
    const data = await FetchRequest({
      url:
        ApiEndPoints.retentionExcelReport +
        "?fileName="+ fileName + "&searchTable=" + searchText,
      method: "POST",
      body: Obj,
    });

    if (data && data.success === true) {
      this.setState({
        loading: false,
      });
      this.download(
        siteConfig.imagesPath +
          fileName +
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

  exportRetentionContracts = async () => {
    //console.log("export retentionContracts started");
    if (this.state.exportDisabled) {
      return;
    }
    this.setState({ exportDisabled: true });

    let getDate = await this.transformDate();

    let file = "RetentionRegister_" + getDate + ".xlsx"
    await this.fetchRetentionContracts(file, this.state.searchText, this.state.body);
  };

  getSearchData = (SearchObj) => {
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
    

      this.setState((prevState) => ({
        loading: true,
        body: {
          // object that we want to update
          ...prevState.body, // keep all other key-value pairs
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
      },
    }));

    this.getInitialData(this.state.per_page, 1, "", null);
  };

  render() {
    let dateBeforeOpenBal = this.state.body.startDate ? 
      new Date(parseInt(this.state.body.startDate)- 86400000).toLocaleDateString(
      "en-GB"): new Date(Date.now()- 86400000).toLocaleDateString("en-GB"); //86400000 - millisecs in 24hrs

      let startDateOpenBal = this.state.body.startDate ? 
      new Date(parseInt(this.state.body.startDate)).toLocaleDateString(
      "en-GB"): new Date(Date.now()).toLocaleDateString("en-GB");

    // console.log("start date2:", new Date(1732518000000).toLocaleDateString("en-GB"));
    // console.log("paidBeforeOpenBal :", paidBeforeOpenBal);
    
    return (
      <div className="card">
        <RetentionReportFilters
          getSearchData={this.getSearchData}
          handleRefresh={this.handleRefresh}
        />
        <RetentionTable
          loading={this.state.loading}
          retentionContracts={this.state.retentionContracts}
          totalRecCount={this.state.totalRecCount}
          onSearchChange={this.search}
          onChangePage={this.changePage}
          onChangeRowsPerPage={this.changeRowsPerPage}
          firstLoad={this.state.firstLoad}
          per_page={this.state.per_page}
          page={this.state.page}
          exportRetentionContracts={this.exportRetentionContracts}
          exportDisabled={this.state.exportDisabled}
          dateBeforeOpenBal={dateBeforeOpenBal}
          startDateOpenBal={startDateOpenBal}
        />
 
      </div>
    );
  }
}
export default RetentionsList;
