import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { ApiEndPoints } from "../../../config";
import DropdownTreeSelect from "react-dropdown-tree-select";
import GridContainer from "../../../components/Grid/GridContainer.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "../../../components/CustomButtons/Button.js";

import startOfWeek from "date-fns/startOfWeek";
import auth from "../../../auth";
import { makeJSDateObject } from "../helper.js";

import { createStyles } from "@material-ui/styles";
import clsx from "clsx";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import isSameDay from "date-fns/isSameDay";
import endOfWeek from "date-fns/endOfWeek";
import isWithinInterval from "date-fns/isWithinInterval";
import { IconButton, withStyles } from "@material-ui/core";

import {
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class PerformanceFilters extends Component {
  constructor(props) {
    super(props);
    this.getDimenstionsList = this.getDimenstionsList.bind(this);
    this.state = {
      responseError: "",
      startDate: currentDate,
      endDate: currentDate,
      dimenstionlist: [],
      reportingCycle: "Quarterly",
      selectedDate: new Date(),
      pickerView: ["year", "month"],
      pickerType: "month",
      dimensions: [],
      Pid: "",
      loading: false,
      filtersFlag: false,
      reviewType: "self",
      financialYear: new Date().getFullYear() + "",
      reportingQuarter: "ALL",
    };
  }

  handleFYChange = (event) => {
    this.setState({ financialYear: event.target.value });
    this.props.getFY(
      this.state.reportingQuarter,
      event.target.value,
      this.state.dimensions,
      this.state.reviewType
    );
  };

  handleReportingQuarterChange = (event) => {
    this.setState({ reportingQuarter: event.target.value });
    this.props.getFY(
      event.target.value,
      this.state.financialYear,
      this.state.dimensions,
      this.state.reviewType
    );
  };

  handleCycleChange = (event) => {
    let picType = "date";
    let picView = ["date"];
    let dt = new Date();
    if (event.target.value === "Weekly") {
      picType = "date";
      picView = ["date"];
    } else if (event.target.value === "Monthly") {
      picType = "month";
      picView = ["year", "month"];
    } else if (event.target.value === "Annually") {
      picType = "year";
      picView = ["year"];
    } else if (event.target.value === "Quarterly") {
      picType = "month";
      picView = ["year", "month"];
      dt = dt.setMonth(3);
    }

    this.setState({
      [event.target.name]: event.target.value,
      pickerView: picView,
      pickerType: picType,
      selectedDate: new Date(dt),
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
          this.setState({ dimenstionlist: data.result });
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
    this.props.refreshScreen();
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
  componentDidMount() {
    // await this.getDimenstionsList();
    // this.getdimlist();
    this.props.getFY(
      this.state.reportingQuarter,
      this.state.financialYear,
      this.state.dimensions,
      this.state.reviewType
    );
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.dimenstionlist !== this.props.dimenstionlist) {
      this.setState({ dimenstionlist: nextProps.dimenstionlist });
    }
  }
  getdimlist() {
    this.setState({ dimensionlist: this.props.dimenstionlist });
  }
  handleWeekChange = (date) => {
    this.setState({ selectedDate: startOfWeek(makeJSDateObject(date)) });
  };
  handleDateChange = (sDate) => {
    this.setState({
      selectedDate: sDate,
    });
  };
  handleMonthChange = (sDate) => {};
  getDateFormatString(date) {
    let dateClone = makeJSDateObject(date);
    let PickerType = this.state.reportingCycle;
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
  formatWeekSelectLabel = (date, invalidLabel) => {
    let dateClone = makeJSDateObject(date);
    let PickerType = this.state.reportingCycle;
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
      : invalidLabel;
  };
  renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
    const { classes } = this.props;
    let dateClone = makeJSDateObject(date);
    let selectedDateClone = makeJSDateObject(selectedDate);
    const start = startOfWeek(selectedDateClone);
    const end = endOfWeek(selectedDateClone);
    const dayIsBetween = isWithinInterval(dateClone, { start, end });
    const isFirstDay = isSameDay(dateClone, start);
    const isLastDay = isSameDay(dateClone, end);

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, "d")} </span>
        </IconButton>
      </div>
    );
  };
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
        // dlist.push(currentNode.parent);
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
  handleSubmit = (event) => {
    event.preventDefault();
    //state changing logic here
  };
  radioOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });

    this.props.radioOnChildChange(
      this.state.reportingCycle,
      this.state.reportingQuarter,
      this.state.financialYear,
      this.state.dimensions,
      event.target.value
    );
  };
  render() {
    const {
      dimenstionlist,

      reportingCycle,

      dimensions,
      financialYear,
      reportingQuarter,
    } = this.state;
    return (
      <GridContainer>
        <span className="error-msg">{this.state.responseError}</span>
        <ValidatorForm
          ref="form"
          onError={(errors) => console.log(errors)}
          style={{
            padding: "10px 5px 0px 15px",
            width: "100%",
          }}
          onSubmit={this.handleSubmit}
        >
          <div className="form-group row">
            <div className="col-sm-2" style={{ textAlign: "left" }}>
              {/* <SelectValidator
                variant="outlined"
                label="Reporting Cycle *"
                onChange={this.handleCycleChange}
                name="reportingCycle"
                // validators={["required"]}
                value={reportingCycle || ""}
              >
                <option className="custom-option" value="Quarterly">
                  Quarterly
                </option>
              </SelectValidator> */}
              <SelectValidator
                variant="outlined"
                label="Financial Year *"
                onChange={this.handleFYChange}
                name="financialYear"
                value={financialYear || ""}
              >
                <option className="custom-option" value="2020">
                  2020 - 2021
                </option>
                <option className="custom-option" value="2021">
                  2021 - 2022
                </option>
                <option className="custom-option" value="2022">
                  2022 - 2023
                </option>
                <option className="custom-option" value="2023">
                  2023 - 2024
                </option>
                <option className="custom-option" value="2024">
                  2024 - 2025
                </option>
                <option className="custom-option" value="2025">
                  2025 - 2026
                </option>
                <option className="custom-option" value="2026">
                  2026 - 2027
                </option>
              </SelectValidator>
            </div>
            <div className="col-sm-3" ref={this.myRef}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  label="ReportingCycle"
                  value={selectedDate || new Date()}
                  onChange={this.handleWeekChange}
                  onMonthChange={this.handleMonthChange}
                  renderDay={this.renderWrappedWeekDay}
                  inputVariant="outlined"
                  minDate={new Date().setFullYear(
                    new Date().getFullYear() - 10
                  )}
                  maxDate={new Date().setFullYear(
                    new Date().getFullYear() + 10
                  )}
                  labelFunc={this.formatWeekSelectLabel}
                  openTo={pickerType}
                  views={pickerView}
                  clearable
                  autoOk
                  className="calenderBack"
                />
              </MuiPickersUtilsProvider> */}
              <SelectValidator
                variant="outlined"
                label="Reporting Quarter *"
                onChange={this.handleReportingQuarterChange}
                name="reportingQuarter"
                value={reportingQuarter || ""}
              >
                <option className="custom-option" value="ALL">
                  ALL
                </option>
                <option className="custom-option" value="Apr May Jun">
                  Q1 - Apr May Jun
                </option>
                <option className="custom-option" value="Jul Aug Sep">
                  Q2 - Jul Aug Sep
                </option>
                <option className="custom-option" value="Oct Nov Dec">
                  Q3 - Oct Nov Dec
                </option>
                <option className="custom-option" value="Jan Feb Mar">
                  Q4 - Jan Feb Mar
                </option>
              </SelectValidator>
            </div>
            <div className="col-sm-3" style={{ textAlign: "left" }}>
              <DropdownTreeSelect
                data={dimenstionlist}
                className="mdl-demo customPos"
                texts={{ placeholder: "Programs/SubPrograms" }}
                onChange={this.onTreeChange}
                keepTreeOnSearch
              />
            </div>
            <div className="col-half-offset">
              <div className="text-center">
                <Button
                  color="primary"
                  onClick={() =>
                    this.props.getChildIndicators(
                      reportingCycle,
                      reportingQuarter,
                      dimensions,
                      financialYear
                    )
                  }
                >
                  Get Indicators
                </Button>
                <span>&nbsp;&nbsp;</span>
                <Button color="primary" onClick={this.props.refreshScreen}>
                  Refresh
                </Button>
              </div>
            </div>
            <div className="col-half-offset">
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="reviewType"
                  name="reviewType"
                  onChange={this.radioOnChange}
                  value={this.state.reviewType || ""}
                  defaultValue="top"
                  row={true}
                >
                  <FormControlLabel
                    value={"self"}
                    control={<Radio color="primary" />}
                    label={"Assigned to me"}
                  />
                  <FormControlLabel
                    value={"approvals"}
                    control={<Radio color="primary" />}
                    label={"Approvals"}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </ValidatorForm>
      </GridContainer>
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
export default withStyles(styles)(PerformanceFilters);
