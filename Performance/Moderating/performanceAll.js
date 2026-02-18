import React, { Component } from "react";
import cloneDeep from "lodash.clonedeep";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { ApiEndPoints } from "../../../config";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import Can from "../../../components/common/Auth/Can";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "../../../components/CustomButtons/Button.js";
import startOfWeek from "date-fns/startOfWeek";
import auth from "../../../auth";
import { makeJSDateObject } from "../helper.js";
import { createStyles } from "@material-ui/styles";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import { withStyles } from "@material-ui/core";
import PerformanceTableAll from "./performanceTableAll";
import PerformanceFiltersAll from "./performanceFiltersAll";
import PerformanceDocs from "../../Performance/Documents/performance.documents";
import PerformanceReportFilter from "../../report-filters/performance-report-filters";
import DialogWrapper from "../../../components/common/Dialog";
import Loader from "react-loader-spinner";

const currentDate = moment(new Date()).format("YYYY-MM-DD");
const CustomeTableCell = (props) => {
  let color = "";
  let status = props.status;
  if (props.status === "submit") {
    color = "green";
    status = "Submitted";
  } else if (props.status === "approved") {
    color = "blue";
    status = "Approved";
  } else if (props.status === "draft") {
    color = "#0b72f1";
    status = "Drafted";
  } else if (props.status === "rejected") {
    color = "red";
    status = "Rejected";
  } else {
    color = "orange";
    status = "Pending";
  }

  return <TableCell style={{ color, fontWeight: 600 }}>{status}</TableCell>;
};

class Performance extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.getDimenstionsList = this.getDimenstionsList.bind(this);
    this.getPerformanceList = this.getPerformanceList.bind(this);
    this.state = {
      action: "",
      perList: [],
      perListDb: [],
      responseError: "",
      startDate: currentDate,
      endDate: currentDate,
      dimenstionlist: [],
      dimenstioncopy: [],
      reportingCycle: "Annually",
      selectedDate: new Date(),
      pickerView: ["year"],
      pickerType: "year",
      dimensions: [],
      file_isOpen: false,
      Pid: "",
      loading: true,
      filtersFlag: false,
      reviewType: "ALL",
      remarks_isOpen: false,
      indicator: "",
      selectedYear: new Date(),
      financialYear: "",
      quarter: "ALL",
      performanceForDocs: [],
    };
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  getDateFormatString(date, reportingCycle) {
    let dateClone = makeJSDateObject(date);
    let PickerType = reportingCycle;
    let pickerFormat = "MMM do";
    let weekLable = "";

    const quarterly1 = ["Jan", "Feb", "Mar"];
    const quarterly2 = ["Apr", "May", "Jun"];
    const quarterly3 = ["Jul", "Aug", "Sep"];
    const quarterly4 = ["Oct", "Nov", "Dec"];

    if (PickerType === "Weekly") {
      pickerFormat = "MMM do";
      weekLable = "Week of";
    } else if (PickerType === "Monthly") {
      pickerFormat = "yyyy MMM";
    } else if (PickerType === "Quarterly") {
      pickerFormat = "MMM";
      var monthName = `${format(startOfWeek(dateClone), pickerFormat)}`;
      var yearstring = `${format(startOfWeek(dateClone), "yyyy")}`;
      var index1 = quarterly1.indexOf(monthName);
      if (index1 !== -1) {
        return (
          yearstring +
          ": " +
          quarterly1[0] +
          " " +
          quarterly1[1] +
          " " +
          quarterly1[2]
        );
      } else {
        var index2 = quarterly2.indexOf(monthName);
        if (index2 !== -1) {
          return (
            yearstring +
            ": " +
            quarterly2[0] +
            " " +
            quarterly2[1] +
            " " +
            quarterly2[2]
          );
        } else {
          var index3 = quarterly3.indexOf(monthName);
          if (index3 !== -1) {
            return (
              yearstring +
              ": " +
              quarterly3[0] +
              " " +
              quarterly3[1] +
              " " +
              quarterly3[2]
            );
          } else {
            var index4 = quarterly4.indexOf(monthName);
            if (index4 !== -1) {
              return (
                yearstring +
                ": " +
                quarterly4[0] +
                " " +
                quarterly4[1] +
                " " +
                quarterly4[2]
              );
            }
          }
        }
      }
    } else if (PickerType === "Annually") {
      pickerFormat = "yyyy";
    } else {
      pickerFormat = "MMM do";
    }

    return dateClone && isValid(dateClone)
      ? weekLable + ` ${format(startOfWeek(dateClone), pickerFormat)} `
      : "";
  }
  getIndicators = (event) => {
    event.preventDefault();
    const reportingCycle = this.state.reportingCycle;
    const selectedDate = this.getDateFormatString(
      this.state.selectedDate,
      reportingCycle
    );
    const dList = this.state.dimensions;
    let perListObj = cloneDeep(this.state.perListDb);
    this.setState({
      filtersFlag: true,
      perList: this.getPerList(perListObj, reportingCycle, selectedDate, dList),
    });
  };

  performanceListByCycle = (
    reportingCycle,
    selectedCDate,
    dimensions,
    finYear
  ) => {
    let selectedDate = "";
    if (selectedCDate === "ALL") selectedDate = "";
    else {
      if (selectedCDate === "Jan Feb Mar")
        selectedDate = Number(finYear) + 1 + ": " + selectedCDate;
      else selectedDate = finYear + ": " + selectedCDate;
    }

    fetch(
      ApiEndPoints.performanceListByCycle +
        "?userid=" +
        auth.getCurrentUser()._id +
        "&reviewType=" +
        this.state.reviewType +
        "&cycleValue=" +
        selectedDate,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          console.log(data);
          let dulist;
          if (data.result.length > 0) {
            dulist = this.getPerformanceDimensions(
              this.state.dimenstioncopy,
              data.result
            );
          } else {
            dulist = [];
            NotificationManager.info("Indicators Not Found!");
          }

          this.setState({
            //selectedDate: new Date(selectedCDate),
            quarter: selectedCDate,
            dimensions,
            dimenstionlist: dulist,
            reportingCycle,
            filtersFlag: true,
            perList: this.getChildPerList(data.result, dimensions),
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
        } else if (data && data.success === false) {
          NotificationManager.error("Something went wrong");
        }
      })
      .catch(console.log);
  };

  performanceListByYear = (selectedCDate, finYear, dimensions, reviewType) => {
    let selectedDate = "";
    if (selectedCDate === "ALL") selectedDate = "";
    else {
      if (selectedCDate === "Jan Feb Mar")
        selectedDate =
          Number(this.state.financialYear) + 1 + ": " + selectedCDate;
      else selectedDate = this.state.financialYear + ": " + selectedCDate;
    }
    fetch(
      ApiEndPoints.performanceList +
        "?userid=" +
        auth.getCurrentUser()._id +
        "&reviewType=" +
        reviewType +
        "&finYear=" +
        finYear,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          let dulist;
          if (data.result.length > 0) {
            dulist = this.getPerformanceDimensions(
              this.state.dimenstioncopy,
              data.result
            );
          } else {
            dulist = [];
            NotificationManager.info("Indicators Not Found!");
          }

          this.setState({
            reviewType,
            //selectedDate: new Date(selectedCDate),
            quarter: selectedCDate,
            dimensions,

            dimenstionlist: dulist,
            perList: data.result,
            perListDb: data.result,
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
        } else if (data && data.success === false) {
          NotificationManager.error("Something went wrong");
        }
      })
      .catch(console.log);
  };

  getChildIndicators = (reportingCycle, selectedCDate, dimensions, finYear) => {
    if (selectedCDate !== "ALL")
      this.performanceListByCycle(
        reportingCycle,
        selectedCDate,
        dimensions,
        finYear
      );

    if (selectedCDate === "ALL")
      this.performanceListByYear(
        selectedCDate,
        finYear,
        dimensions,
        this.state.reviewType
      );
  };
  getChildPerList = (objP, dimensions) => {
    if (dimensions.length > 0) {
      objP.map((list) => {
        const headervalue = Object.keys(list).map((obj) => obj);
        const pvalue = Object.keys(list).map((obj1) => list[obj1]);
        const PerList = pvalue;
        const gPerList = Object.keys(PerList).map((obj) => PerList[obj]);
        const PsList = gPerList[0];
        const childvalue = Object.keys(PsList).map((obj) => obj);
        let arrayS = [];

        for (let iobj in childvalue) {
          if (list[headervalue[0]][childvalue[iobj]].length > 0) {
            for (let i in list[headervalue[0]][childvalue[iobj]]) {
              const demeOBj =
                list[headervalue[0]][childvalue[iobj]][i].dimensions;
              for (let d of dimensions) {
                if (demeOBj.indexOf(d) >= 0) {
                  arrayS.push(list[headervalue[0]][childvalue[iobj]][i]._id);
                  break;
                } else {
                }
              }
            }
            if (dimensions.length > 0) {
              const listvalues = Object.assign(
                [],
                list[headervalue[0]][childvalue[iobj]]
              );
              for (let x = 0; x < listvalues.length; x++) {
                let indexa = arrayS.indexOf(listvalues[x]._id);
                if (indexa < 0) {
                  listvalues.splice(x--, 1);
                }
              }
              list[headervalue[0]][childvalue[iobj]] = listvalues;
            }
          }
        }
        console.log(arrayS);
      });
    }
    return objP;
  };

  getPerList = (objP, reportingCycle, selectedDate, dimensions) => {
    const reportArray = ["Weekly", "Monthly", "Quarterly", "Annually"];

    for (const p in reportArray) {
      if (reportingCycle.trim() !== reportArray[p].trim()) {
        let index = objP.findIndex(
          (x) => Object.keys(x).map((obj) => obj)[0] === reportArray[p]
        );
        if (index >= 0) objP.splice(index, 1);
      }
    }
    objP.map((list) => {
      const headervalue = Object.keys(list).map((obj) => obj);
      const pvalue = Object.keys(list).map((obj1) => list[obj1]);
      const PerList = pvalue;
      const gPerList = Object.keys(PerList).map((obj) => PerList[obj]);
      const PsList = gPerList[0];
      const childvalue = Object.keys(PsList).map((obj) => obj);
      let arrayS = [];

      for (let iobj in childvalue) {
        if (childvalue[iobj].trim() !== selectedDate.trim()) {
          delete list[headervalue[0]][childvalue[iobj]];
        } else {
          if (list[headervalue[0]][childvalue[iobj]].length > 0) {
            for (let i in list[headervalue[0]][childvalue[iobj]]) {
              const demeOBj =
                list[headervalue[0]][childvalue[iobj]][i].dimensions;
              for (let d of dimensions) {
                if (demeOBj.indexOf(d) >= 0) {
                  arrayS.push(list[headervalue[0]][childvalue[iobj]][i]._id);
                  break;
                } else {
                }
              }
            }
            if (dimensions.length > 0) {
              const listvalues = Object.assign(
                [],
                list[headervalue[0]][childvalue[iobj]]
              );
              for (let x = 0; x < listvalues.length; x++) {
                let indexa = arrayS.indexOf(listvalues[x]._id);
                if (indexa < 0) {
                  listvalues.splice(x--, 1);
                }
              }
              list[headervalue[0]][childvalue[iobj]] = listvalues;
            }
          }
        }
      }
    });
    return objP;
  };
  handleCycleChange = (event) => {
    let picType = "date";
    let picView = ["date"];
    if (event.target.value === "Weekly") {
      picType = "date";
      picView = ["date"];
    } else if (
      event.target.value === "Monthly" ||
      event.target.value === "Quarterly"
    ) {
      picType = "month";
      picView = ["year", "month"];
    } else if (event.target.value === "Annually") {
      picType = "year";
      picView = ["year"];
    }

    this.setState({
      [event.target.name]: event.target.value,
      pickerView: picView,
      pickerType: picType,
      selectedDate: new Date(),
    });
  };

  assignChildren(objChild, userDimensions) {
    const childarray = [];
    objChild.map((value, index) => {
      value.id = value._id;
      if (value.children.length > 0) {
        value.children = this.assignChildren(value.children);
      }
      if (userDimensions.indexOf(value._id) >= 0) childarray.push(value);
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
          this.setState({
            dimenstionlist: data.result,
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
  refreshScreen = () => {
    this.getPerformanceList(
      this.state.quarter,
      this.state.financialYear,
      this.state.dimensions,
      this.state.reviewType
    );
    this.setState({ filtersFlag: false });
  };

  getPerformanceDimensions(dimension, objP) {
    let userDimensions = [];
    objP.map((list) => {
      const headervalue = Object.keys(list).map((obj) => obj);
      const pvalue = Object.keys(list).map((obj1) => list[obj1]);
      const PerList = pvalue;
      const gPerList = Object.keys(PerList).map((obj) => PerList[obj]);
      const PsList = gPerList[0];
      const childvalue = Object.keys(PsList).map((obj) => obj);

      for (let iobj in childvalue) {
        if (list[headervalue[0]][childvalue[iobj]].length > 0) {
          for (let i in list[headervalue[0]][childvalue[iobj]]) {
            const demeOBj =
              list[headervalue[0]][childvalue[iobj]][i].dimensions;
            for (let d of demeOBj) {
              userDimensions.push(d);
            }
          }
        }
      }
    });
    userDimensions.filter((val, id, array) => array.indexOf(val) === id);

    const dlist = [];

    dimension.map((value, index) => {
      value.id = value._id;
      if (value.children.length > 0) {
        value.children = this.assignChildren(value.children, userDimensions);
      }
      if (userDimensions.indexOf(value._id) >= 0) {
        dlist.push(value);
      }
    });

    return dlist;
  }
  async componentDidMount() {
    await this.getDimenstionsList();
    //await this.getPerformanceList();
  }
  checktreenodes = (list, checkedflag) => {
    list.map((value) => {
      value.checked = checkedflag;
      value.expanded = checkedflag;
      if (value.children.length > 0) {
        value.children.map((child) => {
          var childList = [];
          childList.push(child);
          childList = this.checktreenodes(childList, checkedflag);

          child = childList[0];
        });
      }
    });
    return list;
  };
  changeTreeState = (list, currentNode) => {
    list.map((value) => {
      if (value.id === currentNode.id) {
        const boolflag = currentNode.checked;
        value.checked = boolflag;
        value.expanded = boolflag;
        if (value.children.length > 0) {
          value.children.map((child) => {
            var childList = [];
            childList.push(child);
            childList = this.checktreenodes(childList, boolflag);
            child = childList[0];
          });
        }
        return list;
      } else {
        if (value.children.length > 0) {
          value.children.map((child) => {
            var childList = [];
            childList.push(child);
            childList = this.changeTreeState(childList, currentNode);
            if (child.id === currentNode.id) {
              value.expanded = true;
            }

            child = childList[0];
          });
        }
      }
    });
    return list;
  };
  onTreeChange = (currentNode, selectedNodes) => {
    const list = this.changeTreeState(this.state.dimenstionlist, currentNode);
    const dlist = [...this.state.dimensions];
    if (currentNode.checked) {
      dlist.push(currentNode.id);
      if (currentNode.parent != null) {
        dlist.push(currentNode.parent);
      }
      this.setState({ dimensions: dlist });
    } else {
      if (currentNode.parent != null) {
        var index2 = dlist.indexOf(currentNode.parent);
        if (index2 !== -1) {
          dlist.splice(index2, 1);
        }
      }
      var index = dlist.indexOf(currentNode.id);

      if (index !== -1) {
        dlist.splice(index, 1);
      }
    }
    const uniqueIds = dlist.filter(
      (val, id, array) => array.indexOf(val) === id
    );
    this.setState({
      dimenstionlist: list,
      dimensions: uniqueIds,
    });
  };
  OnSaveClick = (Plist, status) => {
    //var validationflag = false;
    // for (var item in Plist) {
    //   if (Plist[item].actualPerformance === "") {
    //     validationflag = true;
    //     break;
    //   }
    // }
    // if (validationflag) {
    //   NotificationManager.error("Please fill Actual performance");
    //   return;
    // }
    let PlistFilter = Plist.filter((el) => el.checkedFlag === true);
    console.log("PlistFilter Moderate : ", PlistFilter);

    fetch(
      ApiEndPoints.AddUpdatePerformance +
        "?userid=" +
        auth.getCurrentUser()._id +
        "&status=" +
        status +
        "&moderate=yes",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": auth.getJwt(),
        },
        body: JSON.stringify(PlistFilter),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          const notiMessage =
            status === "submit" ? "Performance updated successfully" : "";
          NotificationManager.success(notiMessage);

          if (this.state.filtersFlag) {
            this.getChildIndicators(
              this.state.reportingCycle,
              this.state.quarter,
              this.state.dimensions,
              this.state.financialYear
            );
          } else {
            this.getPerformanceList(
              this.state.quarter,
              this.state.financialYear,
              this.state.dimensions,
              this.state.reviewType
            );
          }
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
        } else {
          this.setState({ responseError: data.msg });
        }
      })
      .catch("error", console.log);
  };

  getPerformanceList = (quarter, finYear, dimensions, reviewType) => {
    if (quarter !== "ALL")
      this.performanceListByCycle(
        this.state.reportingCycle,
        quarter,
        dimensions,
        finYear
      );
    if (quarter === "ALL")
      this.performanceListByYear(quarter, finYear, dimensions, reviewType);
  };

  radioOnChildChange = (
    reportingCycle,
    selectedCDate,
    finYear,
    dimensions,
    reviewType
  ) => {
    if (selectedCDate !== "ALL")
      this.performanceListByCycle(
        reportingCycle,
        selectedCDate,
        dimensions,
        finYear
      );

    if (selectedCDate === "ALL")
      this.performanceListByYear(
        selectedCDate,
        finYear,
        dimensions,
        reviewType
      );
  };

  getIndicatorById(value) {
    fetch(ApiEndPoints.PerformanceListById + "?indicatorId=" + value._id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          const IFData = data.result[0];
          this.setState({
            indicator: IFData,
            remarks_isOpen: true,
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
  }
  docToggle = (docflg) => {
    if (!docflg) this.setState({ file_isOpen: !this.state.file_isOpen });
    else {
      this.setState({ file_isOpen: !this.state.file_isOpen });
      this.getPerformanceList(
        this.state.quarter,
        this.state.financialYear,
        this.state.dimensions,
        this.state.reviewType
      );
    }
  };
  getFinancialYear = (quarter, finYear, dimensions, reviewType) => {
    this.setState({
      financialYear: finYear,
      quarter,
      dimensions,
      reviewType,
      loading: true,
    });

    this.getPerformanceList(quarter, finYear, dimensions, reviewType);
  };
  render() {
    const StyledTableCell = withStyles((theme) => ({
      head: {
        backgroundColor: "#5b556d",
        color: theme.palette.common.white,
      },
      body: {
        fontSize: 14,
      },
    }))(TableCell);

    const {
      dimenstionlist,
      perList,
      indicator,

      loading,
      performanceForDocs,
    } = this.state;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader
                color="primary"
                style={{ padding: "2px 0px 2px 15px", textAlign: "left" }}
              >
                <div className="row">
                  <div className="col-sm-5">
                    <h4 className="cardCategoryWhite cardTitlePerm">
                      Performance Moderating
                    </h4>
                  </div>
                  <div className="col-sm-6">
                    {
                      <Can
                        perform="Annual Report View Access"
                        yes={() => <PerformanceReportFilter />}
                      />
                    }
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <PerformanceFiltersAll
                  refreshScreen={this.refreshScreen}
                  dimenstionlist={dimenstionlist}
                  getChildIndicators={this.getChildIndicators}
                  radioOnChildChange={this.radioOnChildChange}
                  getFY={this.getFinancialYear}
                />
                {loading === true ? (
                  <Loader
                    type="ThreeDots"
                    color="#00BFFF"
                    height={60}
                    width={60}
                  />
                ) : (
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      {perList.map((list) => {
                        const headervalue = Object.keys(list).map((obj) => obj);
                        const pvalue = Object.keys(list).map(
                          (obj1) => list[obj1]
                        );
                        const PerList = pvalue;
                        const gPerList = Object.keys(PerList).map(
                          (obj) => PerList[obj]
                        );
                        const PsList = gPerList[0];
                        const gPerList1 = Object.keys(PsList).map(
                          (obj) => PsList[obj]
                        );
                        const PsList1 = gPerList1;
                        const childvalue = Object.keys(PsList).map(
                          (obj) => obj
                        );
                        return PsList1.map((ilist, index) => {
                          if (ilist.length > 0) {
                            return (
                              <PerformanceTableAll
                                loading={this.state.loading}
                                performance={ilist}
                                handleChange={this.handleChange}
                                headerText={
                                  headervalue + ":  " + childvalue[index] + " "
                                }
                                OnSaveClick={this.OnSaveClick}
                                refreshGrid={this.getPerformanceList}
                                onFileOpen={(id, perfList) => {
                                  this.setState({
                                    file_isOpen: true,
                                    Pid: id,
                                    performanceForDocs: perfList,
                                  });
                                }}
                                reviewType={this.state.reviewType}
                                onRemarksOpen={(indicator) =>
                                  this.getIndicatorById(indicator)
                                }
                                finYear={this.state.financialYear}
                                quarter={this.state.quarter}
                                dimensions={this.state.dimensions}
                              />
                            );
                          }
                        });
                      })}
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <DialogWrapper
          isOpen={this.state.file_isOpen}
          toggle={() => this.setState({ file_isOpen: !this.state.file_isOpen })}
          size="lg"
          className="customeModel"
        >
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card style={{ width: 900 }}>
                <CardHeader
                  color="primary"
                  style={{ padding: "2px 0px 13px 15px", textAlign: "left" }}
                >
                  <h4 className="cardCategoryWhite cardTitlePerm">
                    Document List
                  </h4>
                </CardHeader>
                <CardBody>
                  <GridContainer>
                    <span className="error-msg">
                      {this.state.responseError}
                    </span>

                    <GridItem xs={12} sm={12} md={12}>
                      <PerformanceDocs
                        docToggle={(docflg) => this.docToggle(docflg)}
                        performanceId={this.state.Pid}
                        reviewType={this.state.reviewType}
                        performance={performanceForDocs}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </DialogWrapper>

        <DialogWrapper
          isOpen={this.state.remarks_isOpen}
          toggle={() =>
            this.setState({ remarks_isOpen: !this.state.remarks_isOpen })
          }
          size="lg"
          className="customeModel"
        >
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader
                  color="primary"
                  style={{ padding: "2px 0px 13px 15px", textAlign: "left" }}
                >
                  <h4 className="cardCategoryWhite cardTitlePerm">Remarks</h4>
                </CardHeader>
                <CardBody>
                  <GridContainer component={Paper}>
                    <span className="error-msg">
                      {this.state.responseError}
                    </span>

                    <GridItem xs={12} sm={12} md={12}>
                      {indicator && (
                        <TableContainer>
                          <Table responsive>
                            <thead>
                              <TableRow>
                                {/* <StyledTableCell>Role</StyledTableCell> */}
                                <StyledTableCell style={{ width: 180 }}>
                                  Name
                                </StyledTableCell>
                                <StyledTableCell style={{ width: 180 }}>
                                  Level
                                </StyledTableCell>
                                <StyledTableCell style={{ width: 100 }}>
                                  Status
                                </StyledTableCell>
                                <StyledTableCell>Remarks</StyledTableCell>
                                <StyledTableCell>Intervention</StyledTableCell>
                              </TableRow>
                            </thead>
                            <TableBody>
                              <TableRow
                                key={
                                  indicator.responsibleUser &&
                                  indicator.responsibleUser.firstName
                                }
                              >
                                {/* <TableCell component="th" scope="row">
                                  Responsible User
                              </TableCell> */}
                                <TableCell>
                                  {indicator.responsibleUser &&
                                    indicator.responsibleUser.firstName +
                                      " " +
                                      indicator.responsibleUser.lastName}
                                </TableCell>
                                <TableCell>Performance Reporting</TableCell>
                                {/* <TableCell >{indicator.status == "submit" ? "Submited" : "Drafted"}</TableCell> */}
                                <CustomeTableCell status={indicator.status} />
                                <TableCell>{indicator.remarks}</TableCell>
                                <TableCell>{indicator.intervention}</TableCell>
                              </TableRow>
                              <TableRow
                                key={
                                  indicator.approverUser1 &&
                                  indicator.approverUser1.firstName
                                }
                              >
                                {/* <TableCell component="th" scope="row">
                                  Approvar
                              </TableCell> */}
                                <TableCell>
                                  {indicator.approverUser1 &&
                                    indicator.approverUser1.firstName +
                                      " " +
                                      indicator.approverUser1.lastName}
                                </TableCell>
                                <TableCell>Approval Level 1</TableCell>
                                <CustomeTableCell
                                  status={indicator.approverUser1Status}
                                />
                                <TableCell>
                                  {indicator.approverUser1Remarks}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              {indicator.approverUser2 && (
                                <TableRow
                                  key={indicator.approverUser2.firstName}
                                >
                                  {/* <TableCell component="th" scope="row">
                                    Approvar
                              </TableCell> */}
                                  <TableCell>
                                    {indicator.approverUser2.firstName +
                                      " " +
                                      indicator.approverUser2.lastName}
                                  </TableCell>
                                  <TableCell>Approval Level 2</TableCell>
                                  <CustomeTableCell
                                    status={indicator.approverUser2Status}
                                  />
                                  <TableCell>
                                    {indicator.approverUser2Remarks}
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              )}
                              {indicator.approverUser3 && (
                                <TableRow
                                  key={indicator.approverUser3.firstName}
                                >
                                  {/* <TableCell component="th" scope="row">
                                    Approvar
                              </TableCell> */}
                                  <TableCell>
                                    {indicator.approverUser3.firstName +
                                      " " +
                                      indicator.approverUser3.lastName}
                                  </TableCell>
                                  <TableCell>Approval Level 3</TableCell>
                                  <CustomeTableCell
                                    status={indicator.approverUser3Status}
                                  />
                                  <TableCell>
                                    {indicator.approverUser3Remarks}
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      <div className="text-right">
                        <Button
                          color="warning"
                          onClick={() =>
                            this.setState({
                              remarks_isOpen: !this.state.remarks_isOpen,
                            })
                          }
                        >
                          Back
                        </Button>
                      </div>
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </DialogWrapper>
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
export default withStyles(styles)(Performance);
