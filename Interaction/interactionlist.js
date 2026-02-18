import React, { Component } from "react";

import { ApiEndPoints, siteConfig } from "../../config";
import TopNavbar from "../../components/Header/top.navbar";
import FetchRequest from "../../components/Http/FetchRequest";
import Footer from "../../components/Footer/footer";
import Can from "../../components/common/Auth/Can";
import InteractionForm from "./farmerInteractionForm";
import InteractionTable from "./farmerInteractionTable";
import DialogWrapper from "../../components/common/Dialog";
import { NotificationManager } from "react-notifications";
import auth from "../../auth";
import FarmerFilters from "../report-filters/FarmerFilters";
import moment from "moment-timezone";
import { debounce } from "throttle-debounce";

class InteractionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      interactions: [],
      id: "new",
      isOpen: false,

      totalRecCount: 0,
      searchText: "",
      per_page: 10,
      page: 0,

      farmerlist: [],
      exportDisabled: false,
      firstLoad: false,

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
    console.log(
      "params : ",
      this.state.per_page,
      this.state.page,
      this.state.searchText,
      this.state.body
    );
    console.log("search text interaction : ", searchText);
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    // if (!Obj || Obj.childArray === "") {
    //   const childArray = JSON.parse(
    //     localStorage.getItem("userData").split(",")
    //   ).childArray;
    //   const loggedId = JSON.parse(
    //     localStorage.getItem("userData").split(",")
    //   )._id;
    //   childArray.push({ _id: loggedId });
    //   Obj = { childArray };
    //   this.setState((prevState) => ({
    //     body: {
    //       // object that we want to update
    //       ...prevState.body, // keep all other key-value pairs
    //       childArray: childArray, // update the value of specific key
    //     },
    //   }));
    // }
    //searchText = "";
    const data = await FetchRequest({
      url:
        ApiEndPoints.interactionlist_web +
        "?per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      method: "POST",
      body: Obj,
    });

    console.log("ddata : ", data);
    if (data && data.success === true) {
      this.setState({
        interactions: data.result,
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

  // getInitialDataOld(per_page, page, searchText) {
  //   if (searchText === null) searchText = "";
  //   if (per_page === null) per_page = 10;
  //   if (page === null) page = 1;

  //   fetch(
  //     ApiEndPoints.interactionlist_web +
  //       "?per_page=" +
  //       per_page +
  //       "&pageNo=" +
  //       page +
  //       "&searchTable=" +
  //       searchText,
  //     {
  //       method: "post",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         "x-auth-token": auth.getJwt(),
  //       },
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data && data.success === true) {
  //         this.setState({
  //           interactions: data.result,
  //           totalRecCount: data.totalRecCount,
  //           loading: false,
  //         });
  //       } else if (
  //         data &&
  //         data.success === false &&
  //         data.responseCode === 401
  //       ) {
  //         NotificationManager.error(data.msg);
  //         localStorage.clear();
  //         return (window.location.href = "/");
  //       }
  //     })
  //     .catch(console.log);
  //   window.scrollTo(0, 0);
  // }

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
    this.getInitialData(
      per_page,
      this.state.page,
      this.state.searchText,
      this.state.body
    );
  };

  search = (searchText) => {
    this.setState({
      searchText,
      loading: true,
      firstLoad: false,
      page: 1,
      //interactions: [],
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
    }, 5000);
  }

  exportFarmerInteractions = async () => {
    console.log("export interactions method");
    if (this.state.exportDisabled) {
      return;
    }
    this.setState({ exportDisabled: true });
    //////1st doc
    await fetch(ApiEndPoints.farmerInteractions, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log("data", data);
        if (data && data.success === true) {
          console.log("Farmer Interactions - EXCEL", data.fileName);
          this.setState({
            loading: false,
            exportDisabled: false,
          });
          this.download(
            siteConfig.imagesPath +
              data.fileName +
              "?token=" +
              localStorage.getItem("uploadToken")
          );
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else {
          this.setState({ exportDisabled: false });
        }
      })
      .catch(console.log);
  };

  getInteractionSearchData = async (SearchObj) => {
    let Obj = {};

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
  };

  handleRefresh = async () => {
    // const childArray = JSON.parse(
    //   localStorage.getItem("userData").split(",")
    // ).childArray;

    // const loggedId = JSON.parse(
    //   localStorage.getItem("userData").split(",")
    // )._id;
    // childArray.push({ _id: loggedId });

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

  onClickAddInteraction = () => {
    this.setState({ isOpen: true, id: "new" });
  };

  render() {
    return (
      <div className="card">
        <FarmerFilters
          getSearchData={this.getInteractionSearchData}
          handleRefresh={this.handleRefresh}
          url={ApiEndPoints.interactionusers}
        />

        <InteractionTable
          loading={this.state.loading}
          interactions={this.state.interactions}
          onEdit={(id) => {
            this.setState({ isOpen: true, id: id });
          }}
          //tableOptions={tableOptions}
          totalRecCount={this.state.totalRecCount}
          onSearchChange={this.search}
          onChangePage={this.changePage}
          onChangeRowsPerPage={this.changeRowsPerPage}
          firstLoad={this.state.firstLoad}
          per_page={this.state.per_page}
          page={this.state.page}
          exportFarmerInteractions={this.exportFarmerInteractions}
          exportDisabled={this.state.exportDisabled}
          onClickAddInteraction={this.onClickAddInteraction}
        />

        <DialogWrapper
          isOpen={this.state.isOpen}
          toggle={() => this.setState({ isOpen: !this.state.isOpen })}
          size="lg"
          style={{ width: 900, height: 300, paddingTop: "10px" }}
          className="customeModel customeModelMargin"
        >
          <InteractionForm
            toggle={() => this.setState({ isOpen: !this.state.isOpen })}
            id={this.state.id}
            updateList={() =>
              this.getInitialData(this.state.per_page, 1, "", this.state.body)
            }
          />
        </DialogWrapper>
      </div>
    );
  }
}
export default InteractionList;

// const InteractionList = () => {
//   return <FarmerFilters />;
// };

// export default InteractionList;
