import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { makeJSDateObject } from "../helper.js";
import { ApiEndPoints } from "../../../config";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DropdownTreeSelect from "react-dropdown-tree-select";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import startOfWeek from "date-fns/startOfWeek";
import clsx from "clsx";
import format from "date-fns/format";
import isValid from "date-fns/isValid";
import { createStyles } from "@material-ui/styles";
import { IconButton, withStyles } from "@material-ui/core";
import isWithinInterval from "date-fns/isWithinInterval";
import isSameDay from "date-fns/isSameDay";
import endOfWeek from "date-fns/endOfWeek";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import auth from "../../../auth";
import IndicatorAutocomplete from "./IndicatorAutocomplete";
// import InputLabel from "@material-ui/core/InputLabel";
// import FormControl from "@material-ui/core/FormControl";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import MultiSelectCheckbox from "../../../components/common/MultiSelectCheckbox";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class IndicatorForm extends React.Component {
  state = {
    indicatorId: "new",
    indicatorTitle: "",
    target: "",
    indicatorStartDate: currentDate,
    indicatorEndDate: currentDate,
    reportingCycle: "Quarterly",
    meansOfVerification: "",
    dimenstionlist: [],
    dimensions: [],
    selectedDate: new Date(),
    pickerView: ["year", "month"],
    pickerType: "month",
    outcome: "",
    outputs: "",
    titlevalue: "",
    titleinputvalue: "",
    errors: {},
    partialMatchError: false,
    partialMatchErrorText: "",
    options: [""],
    dimensionsFromIndicator: [],

    isTargetCummulative: false,

    movData: [],
    movArray: [],
    hasMOV: false,
  };

  assignChildren(objChild) {
    const childarray = [];
    objChild.map((value, index) => {
      value.id = value._id;
      if (value.children.length > 0) {
        value.children = this.assignChildren(value.children);
      }
      childarray.push(value);
    });

    return childarray;
  }
  getUserGroupUsers(id) {
    fetch(ApiEndPoints.userGroupUsers + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          if (data.result.length > 0) {
            this.setState({
              roleUsersList: data.result,
            });
          } else {
            this.setState({
              roleUsersList: [],
            });
          }
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
  }
  getDimenstionsList() {
    fetch(ApiEndPoints.programList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          const dlist = [];
          data.result.map((value, index) => {
            value.id = value._id;
            if (value.children.length > 0) {
              value.children = this.assignChildren(value.children);
            }
            dlist.push(value);
          });
          this.setState({ dimenstionlist: dlist });
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
  }
  async getIndicatorById() {
    const id = this.props.id;
    if (id !== "new") {
      fetch(ApiEndPoints.indicatorsList + "?indicatorId=" + id, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            const IFData = data.result[0];

            this.setState({
              indicatorId: IFData._id,
              indicatorTitle: IFData.indicatorTitle,
              target: IFData.target,
              selectedDate: moment(IFData.startDate * 1000).format(
                "YYYY-MM-DD"
              ),
              indicatorEndDate: moment(IFData.endDate * 1000).format(
                "YYYY-MM-DD"
              ),
              reportingCycle: IFData.reportingCycle,

              dimensions: IFData.dimensions,
              dimensionsFromIndicator: IFData.dimensions,
              //meansOfVerification: IFData.meansOfVerification,
              //movArray: IFData.movArray,
              //outcome: IFData.outcome,
              //outputs: IFData.outputs,
              isTargetCummulative:
                IFData.isTargetCummulative !== null &&
                IFData.isTargetCummulative != undefined
                  ? IFData.isTargetCummulative
                  : false,
            });
            this.getUserGroupUsers("5f6b22921c3f6f0034f5a4ff"); //dummy id

            const dlist = this.state.dimensions;
            const dimenstionlist = this.state.dimenstionlist;
            dimenstionlist.map((value) => {
              var index = dlist.indexOf(value.id);
              if (index !== -1) {
                value.checked = true;
                value.expanded = true;
              }
              if (value.children.length > 0) {
                value.children.map((child) => {
                  var childList = [];
                  childList.push(child);
                  childList = this.assignDimenstionsFromDB(childList, dlist);
                  var index1 = dlist.indexOf(child.id);
                  if (index1 !== -1) {
                    value.expanded = true;
                  }
                  child = childList[0];
                });
              }
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
    }
  }
  assignDimenstionsFromDB = (list, currentNode) => {
    list.map((value) => {
      var index = currentNode.indexOf(value.id);
      if (index !== -1) {
        value.checked = true;
        value.expanded = true;
      }
      if (value.children.length > 0) {
        value.children.map((child) => {
          var childList = [];
          childList.push(child);
          childList = this.changeTreeState(childList, currentNode);
          var index1 = currentNode.indexOf(child.id);
          if (index1 !== -1) {
            value.expanded = true;
          }
          child = childList[0];
        });
      }
    });
    return list;
  };
  async componentDidMount() {
    await Promise.all([
      this.getcndData(),
      this.getIndicatorTitlesByProg(""),
      this.getDimenstionsList(),
      this.getIndicatorTitles(),
    ]);
    // await this.getcndData();
    // await this.getIndicatorTitlesByProg("");
    // await this.getDimenstionsList();
    // await this.getIndicatorTitles();
    await this.getIndicatorById();
  }

  async getIndicatorTitles() {
    await fetch(ApiEndPoints.indicatorsddl, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          if (data.result.length > 0) {
            this.setState({
              options: data.result,
            });
          } else {
            this.setState({
              options: [""],
            });
            NotificationManager.error("Indicators not found");
          }
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
  }

  validateDropdowns(name, value) {
    if (value != "") {
    }

    return false;
  }
  handleChange = (event) => {
    const validate = this.validateDropdowns(
      event.target.name,
      event.target.value
    );
    if (validate) {
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  // handleChangeMov = (event) => {
  //   this.setState({ movArray: event.target.value });
  // };

  handleCheck = (event) => {
    this.setState({ isTargetCummulative: event.target.checked });
  };
  /*
  changeTreeState = (list, currentNode) => {
    list.map((value) => {
      if (value.id == currentNode.id) {
        if (currentNode.checked) {
          value.checked = true;
          value.expanded = true;
          return list;
        } else {
          value.checked = false;
          return list;
        }
      } else {
        if (value.children.length > 0) {
          value.children.map((child) => {
            var childList = [];
            childList.push(child);
            childList = this.changeTreeState(childList, currentNode);
            if (child.id == currentNode.id) {
              value.expanded = true;
            }
            child = childList[0];
          });
        }
      }
    });
    return list;
  };
  */

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
      if (value.id == currentNode.id) {
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
            if (child.id == currentNode.id) {
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
    const list = this.changeTreeState(this.state.dimenstionlist, currentNode); //checked/unchecked
    const dlist = [...this.state.dimensions]; //selected dimensions

    if (currentNode.checked) {
      dlist.push(currentNode.id);
      if (currentNode.parent != null) {
        // dlist.push(currentNode.parent);
      }
      // this.setState({ dimensions: dlist });
      else {
        if (currentNode._children.length > 0) {
          currentNode._children.map((child) => {
            dlist.push(child);
          });
        }
      }
    } else {
      if (currentNode.parent != null) {
        var index2 = dlist.indexOf(currentNode.parent);
        if (index2 !== -1) {
          dlist.splice(index2, 1);
        }
      } else {
        var index = dlist.indexOf(currentNode.id);

        if (index !== -1) {
          dlist.splice(index, 1);
        }

        if (currentNode._children.length > 0) {
          currentNode._children.map((child) => {
            let indx = dlist.indexOf(child);

            if (indx !== -1) {
              dlist.splice(indx, 1);
            }
          });
        }
      }
      // var index = dlist.indexOf(currentNode.id);

      // if (index !== -1) {
      //   dlist.splice(index, 1);
      // }
    }

    const uniqueIds = dlist.filter(
      (val, id, array) => array.indexOf(val) == id
    );

    let uniqueIdsNew = selectedNodes.length === 0 ? [] : uniqueIds;

    this.getIndicatorTitlesByProg(uniqueIdsNew);

    this.setState({
      dimenstionlist: list,
      dimensions: uniqueIds,
    });
  };

  getIndicatorTitlesByProg(progs) {
    //get indicator by dimensions

    if (progs == "undefined" || progs == undefined || progs == []) progs = "";

    fetch(ApiEndPoints.indicatorsddl + "?dimensions=" + progs, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ options: data.result });
      })
      .catch(console.log);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // this.setState((state) => ({
    //   hasMOV: state.movArray.length > 0 ? false : true,
    // }));

    // if (this.state.hasMOV) return;

    let updateDate = new Date(this.state.selectedDate);
    var month = updateDate.getMonth() + 1;

    var mnts = [4, 7, 10, 1];
    if (mnts.indexOf(month) !== -1) {
      updateDate = new Date(updateDate.setMonth(updateDate.getMonth() + 1));
    }

    if (this.validateDropdowns("dimensions", this.state.dimensions)) {
      return;
    }

    if (this.state.dimensionsFromIndicator.length === 0) {
      NotificationManager.error("Please select Indicator");
      return;
    }

    const formpojo = {};
    formpojo.startDate = moment(updateDate).format("X");
    formpojo.endDate = moment(this.state.indicatorEndDate).format("X");
    if (this.state.indicatorId !== "new") formpojo.id = this.state.indicatorId;
    else formpojo.id = null;
    formpojo.indicatorTitle = this.state.indicatorTitle;
    formpojo.target = this.state.target;
    formpojo.reportingCycle = this.state.reportingCycle;
    //formpojo.meansOfVerification = this.state.meansOfVerification;

    // formpojo.movArray = this.state.movArray;
    // formpojo.movCount =
    //   this.state.movArray && this.state.movArray.length > 0
    //     ? this.state.movArray.length
    //     : 0;
    // formpojo.outcome = this.state.outcome;
    // formpojo.outputs = this.state.outputs;
    formpojo.dimensions = this.state.dimensionsFromIndicator;
    formpojo.isTargetCummulative = this.state.isTargetCummulative;
    fetch(
      ApiEndPoints.AddUpdateIndicator + "?userid=" + auth.getCurrentUser()._id,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": auth.getJwt(),
        },
        body: JSON.stringify(formpojo),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          if (this.state.indicatorId !== "new")
            NotificationManager.success("Indicator updated successfully");
          else NotificationManager.success("Indicator saved successfully");
          this.props.updateList();

          this.props.toggle();
        } else {
          this.setState({ responseError: data.msg });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };
  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }
  handleWeekChange = (date) => {
    this.setState({ selectedDate: startOfWeek(makeJSDateObject(date)) });
  };
  handleMonthChange = (sDate) => {};
  handleCycleChange = (event) => {
    let picType = "date";
    let picView = ["date"];
    if (event.target.value == "Weekly") {
      picType = "date";
      picView = ["date"];
    } else if (
      event.target.value == "Monthly" ||
      event.target.value == "Quarterly"
    ) {
      picType = "month";
      picView = ["year", "month"];
    } else if (event.target.value == "Annually") {
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
    } else {
      pickerFormat = "MMM do";
    }

    return dateClone && isValid(dateClone)
      ? weekLable + ` ${format(startOfWeek(dateClone), pickerFormat)} `
      : invalidLabel;
  };
  getIndicatorTitle = (indicatorTitle) => {
    this.setState({ indicatorTitle });
  };
  getIndicatorTitleDimensions = (dimensionsFromIndicator) => {
    this.setState({ dimensionsFromIndicator });
  };

  getcndData() {
    //get Cnd
    fetch(ApiEndPoints.cndList + "?cndGroup=PoE", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ movData: data.result });
      })
      .catch(console.log);
  }

  render() {
    const {
      dimenstionlist,
      selectedDate,
      pickerType,
      pickerView,
      indicatorTitle,
      options,
      movData,
      movArray,
      hasMOV,
    } = this.state;

    const movDataNew = movData.map(({ cndName: name, ...rest }) => ({
      name,
      ...rest,
    }));

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add Indicator Target
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <DropdownTreeSelect
                            data={dimenstionlist}
                            className="mdl-demo"
                            texts={{
                              placeholder: "Programs/SubPrograms ...",
                            }}
                            onChange={this.onTreeChange}
                            keepTreeOnSearch
                          />
                          <p className="MuiFormHelperText-root MuiFormHelperText-contained">
                            <span>&nbsp;</span>
                          </p>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup>
                            <IndicatorAutocomplete
                              getIndicatorTitle={this.getIndicatorTitle}
                              getIndicatorTitleDimensions={
                                this.getIndicatorTitleDimensions
                              }
                              indicatorTitle={indicatorTitle}
                              options={options}
                            />
                          </FormGroup>
                        </div>

                        {/* <div className="col-sm-6">
                          <FormGroup>
                            <TextValidator
                              label="Outcome *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="outcome"
                              value={this.state.outcome || ""}
                              validators={["required"]}
                              errorMessages={["Outcome is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-6">
                          <FormGroup>
                            <TextValidator
                              label="Output *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="outputs"
                              value={this.state.outputs || ""}
                              validators={["required"]}
                              errorMessages={["Outputs is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div> */}

                        <div className="col-sm-4">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Frequency of Reporting *"
                              helperText=" "
                              onChange={this.handleCycleChange}
                              name="reportingCycle"
                              validators={["required"]}
                              errorMessages={["Please Select Reporting Cycle"]}
                              value={this.state.reportingCycle}
                            >
                              {/* <option className="custom-option" value="Weekly">Weekly</option> */}
                              {/* <option className="custom-option" value="Monthly">
                                Monthly
                              </option> */}
                              <option
                                className="custom-option"
                                value="Quarterly"
                              >
                                Quarterly
                              </option>
                              {/* <option
                                className="custom-option"
                                value="Annually"
                              >
                                Annually
                              </option> */}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                helperText=" "
                                label="Reporting Cycle Value"
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
                              />
                            </MuiPickersUtilsProvider>
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Target *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="target"
                              value={this.state.target}
                              validators={[
                                "required",
                                "minNumber:0",
                                "maxNumber:1000000000",
                              ]}
                              type="number"
                              errorMessages={[
                                "Target is mandatory",
                                "Input must be a valid number",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        {/* <div className="col-sm-8">
                          <FormGroup>
                            {/* <TextValidator
                              label="Means of Verification *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="meansOfVerification"
                              value={this.state.meansOfVerification || ""}
                              validators={["required"]}
                              errorMessages={[
                                "Means of verification is mandatory",
                              ]}
                              variant="outlined"
                            /> //end

                            <FormControl variant="outlined" error={hasMOV}>
                              <InputLabel id="demo-mutiple-checkbox-label">
                                Means of Verification *
                              </InputLabel>
                              <MultiSelectCheckbox
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox-label"
                                label="Means of Verification *"
                                name="movArray"
                                multiple
                                value={movArray}
                                onChange={this.handleChangeMov}
                                MenuProps={MenuProps}
                                data={movDataNew}
                              />
                              {hasMOV && (
                                <FormHelperText>
                                  This field is required!
                                </FormHelperText>
                              )}
                            </FormControl>
                          </FormGroup>
                        </div> */}
                        <div className="col-sm-4">
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.isTargetCummulative}
                                  onChange={this.handleCheck}
                                  name="checkedB"
                                  color="primary"
                                />
                              }
                              label="Is Target Cummulative"
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button color="primary" type="submit">
                          Save
                        </Button>
                        <span>&nbsp;&nbsp;</span>
                        <Button
                          color="warning"
                          onClick={this.handleCancel.bind(this)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </ValidatorForm>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
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
export default withStyles(styles)(IndicatorForm);
