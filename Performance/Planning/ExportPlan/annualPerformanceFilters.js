import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import { ApiEndPoints, siteConfig } from "../../../../config";
import GridContainer from "../../../../components/Grid/GridContainer.js";
import { makeJSDateObject } from "../../helper.js";
import Button from "../../../../components/CustomButtons/Button.js";
import DateFnsUtils from "@date-io/date-fns";
import startOfWeek from "date-fns/startOfWeek";
import auth from "../../../../auth";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { createStyles } from "@material-ui/styles";
import clsx from "clsx";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import isSameDay from "date-fns/isSameDay";
import endOfWeek from "date-fns/endOfWeek";
import isWithinInterval from "date-fns/isWithinInterval";
import { IconButton, withStyles } from "@material-ui/core";
import "../../../report-filters/performance-report-styles.scss";
import {
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class AnnualPerformanceFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responseError: "",
      startDate: currentDate,
      endDate: currentDate,
      dimenstionlist: [],
      reportingCycle: "Annually",
      selectedDate: new Date(),
      pickerView: ["year"],
      pickerType: "year",
      dimensions: [],
      Pid: "",
      loading: false,
      filtersFlag: false,
      reviewType: "self",
      // selectedYear: "",
      // yearsArray: [],
    };
  }

  handleCycleChange = (event) => {
    let picType = "date";
    let picView = ["date"];
    let dt = new Date();
    if (event.target.value == "Weekly") {
      picType = "date";
      picView = ["date"];
    } else if (event.target.value == "Monthly") {
      picType = "month";
      picView = ["year", "month"];
    } else if (event.target.value == "Annually") {
      picType = "year";
      picView = ["year"];
    } else if (event.target.value == "Quarterly") {
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

  async componentDidMount() {
    // this.handleSelectedYear();
  }

  handleSelectedYear() {
    let dt = new Date();
    let y = dt.getFullYear();
    let m = dt.getMonth();
    let selectedYear = y;

    let yearsArray = [];
    for (var i = y - 1; i <= y + 1; i++) {
      let yearObj = {};
      yearObj.value = i;
      yearObj.text = i + " - " + (i + 1);
      yearsArray.push(yearObj);
    }

    if (m === 1 || m === 2 || m === 3) {
      selectedYear = y - 1;
    }
    this.setState({ yearsArray, selectedYear });
  }

  componentWillReceiveProps(nextProps) {}

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

    if (PickerType == "Weekly") {
      pickerFormat = "MMM do";
      weekLable = "Week of";
    } else if (PickerType == "Monthly") {
      pickerFormat = "yyyy MMM";
    } else if (PickerType == "Quarterly") {
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
    } else if (PickerType == "Annually") {
      pickerFormat = "yyyy";
      var yearstring = `${format(startOfWeek(dateClone), "yyyy")}`;
      var yearNext = parseInt(yearstring) + 1;
      return yearstring + " - " + yearNext;
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

    if (PickerType == "Weekly") {
      pickerFormat = "MMM do";
      weekLable = "Week of";
    } else if (PickerType == "Monthly") {
      pickerFormat = "yyyy MMM";
    } else if (PickerType == "Quarterly") {
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
    } else if (PickerType == "Annually") {
      pickerFormat = "yyyy";
      var yearstring = `${format(startOfWeek(dateClone), "yyyy")}`;
      var yearNext = parseInt(yearstring) + 1;
      return yearstring + " - " + yearNext;
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
    }, 100);
  }
  documentDownload = () => {
    fetch(
      ApiEndPoints.annualPlan +
        "?year=" +
        this.state.selectedDate +
        "&cycle=" +
        this.state.reportingCycle,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          console.log(data.result);
          this.download(
            siteConfig.imagesPath +
              data.result +
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
        } else if (data && data.success === false) {
          NotificationManager.error(data.msg);
        }
      })
      .catch(console.log);
  };
  handleSubmit = (event) => {
    event.preventDefault();
    //state changing logic here
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      selectedDate,
      reportingCycle,
      pickerType,
      pickerView,
      selectedYear,
      yearsArray,
    } = this.state;

    return (
      <GridContainer>
        <span className="error-msg">{this.state.responseError}</span>
        <ValidatorForm
          ref="form"
          onError={(errors) => console.log(errors)}
          style={{
            padding: "0px 5px 0px 15px",
            width: "100%",
          }}
          onSubmit={this.handleSubmit}
        >
          <div className="row">
            <div className="col-sm-4">
              <SelectValidator
                variant="outlined"
                onChange={this.handleCycleChange}
                name="reportingCycle"
                // validators={["required"]}
                value={reportingCycle || ""}
                className="calenderBack"
              >
                {/* <option className="custom-option" value="Weekly">Weekly</option> */}
                {/* <option className="custom-option" value="Monthly">
                  Monthly
                </option>
                <option className="custom-option" value="Quarterly">
                  Quarterly
                </option> */}
                <option className="custom-option" value="Annually">
                  Annual Plan
                </option>
              </SelectValidator>
            </div>
            <div className="col-sm-4">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
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
              </MuiPickersUtilsProvider>

              {/* <SelectValidator
                variant="outlined"
                onChange={this.handleChange}
                name="selectedYear"
                // validators={["required"]}
                value={selectedYear || ""}
                className="calenderBack"
              >
                {yearsArray.map((value, index) => {
                  return (
                    <option
                      className="custom-option"
                      key={index}
                      value={value.value}
                    >
                      {value.text}
                    </option>
                  );
                })}
              </SelectValidator> */}
            </div>
            <div className="col-sm-4">
              <Button color="warning" onClick={this.documentDownload}>
                Export to word
              </Button>
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
export default withStyles(styles)(AnnualPerformanceFilters);
