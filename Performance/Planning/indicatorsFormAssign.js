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
import FormFunc from "../../../components/common/formfunc";
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
import AutoCompleteDDL from "../../../components/common/AutoCompleteDDL";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

const ApproverDropDown = (props) => {
  return (
    <div className="col-sm-4">
      <FormGroup>
        <SelectValidator
          variant="outlined"
          label={props.labelText}
          helperText=" "
          onChange={props.handleChange}
          name={props.name}
          validators={props.validators}
          errorMessages={props.errorMessages}
          value={props.indicatorUser || ""}
        >
          <option className="custom-option" key="-1" value="">
            {""}
          </option>
          {props.roleUsersList.map((value, index) => {
            return (
              <option className="custom-option" key={index} value={value._id}>
                {value.firstName + " " + value.lastName}
              </option>
            );
          })}
        </SelectValidator>
      </FormGroup>
    </div>
  );
};

class IndicatorFormAssign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indicatorId: "new",
      indicatorTitle: "",
      indicatorStartDate: currentDate,
      indicatorEndDate: currentDate,
      selectedDate: new Date(),
      reportingCycle: "Annually",

      indicatorResponsibility: "",

      indicatorRole: "",
      userslist: [],
      roleUsersList: [],
      roleslist: [],

      ApproverUser1: "",
      ApproverUser2: "",
      ApproverUser3: "",
      dimensions: [],

      errors: {},
      partialMatchError: false,
      partialMatchErrorText: "",

      isTargetCummulative: false,
      target: "",

      selectedText_RespUser: "",
      selectedText_Appr1: "",
      selectedText_Appr2: "",
      selectedText_Appr3: "",
      savedisabled: false,
    };
    this.onAutoCompleteChange_RespUser =
      this.onAutoCompleteChange_RespUser.bind(this);
    this.onAutoCompleteChange_Appr1 =
      this.onAutoCompleteChange_Appr1.bind(this);
    this.onAutoCompleteChange_Appr2 =
      this.onAutoCompleteChange_Appr2.bind(this);
    this.onAutoCompleteChange_Appr3 =
      this.onAutoCompleteChange_Appr3.bind(this);
  }

  getUserList() {
    fetch(ApiEndPoints.activeusers, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ userslist: data.result, loading: false });
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
  getRolesList() {
    fetch(ApiEndPoints.userGroupList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ roleslist: data.result });
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

  getUserGroupUsers(id) {
    if (id == null || id == "") return;
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
            NotificationManager.error("Users not found for selected role");
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

              selectedDate: moment(IFData.startDate * 1000).format(
                "YYYY-MM-DD"
              ),
              indicatorEndDate: moment(IFData.endDate * 1000).format(
                "YYYY-MM-DD"
              ),
              reportingCycle: IFData.reportingCycle,
              // indicatorResponsibility:
              //   IFData.responsibleRole == null ? "" : IFData.responsibleRole,
              indicatorUser:
                IFData.responsibleUser == null
                  ? ""
                  : IFData.responsibleUser._id,

              ApproverUser1:
                IFData.approverUser1 == null ? "" : IFData.approverUser1._id,
              ApproverUser2:
                IFData.approverUser2 == null ? "" : IFData.approverUser2._id,
              ApproverUser3:
                IFData.approverUser3 == null ? "" : IFData.approverUser3._id,
              isTargetCummulative: IFData.isTargetCummulative,
              target: IFData.target,

              selectedText_RespUser:
                IFData.responsibleUser == null ? "" : IFData.responsibleUser,
              selectedText_Appr1:
                IFData.approverUser1 == null ? "" : IFData.approverUser1,
              selectedText_Appr2:
                IFData.approverUser2 == null ? "" : IFData.approverUser2,
              selectedText_Appr3:
                IFData.approverUser3 == null ? "" : IFData.approverUser3,
            });
            //this.getUserGroupUsers(IFData.responsibleRole);
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

  async componentDidMount() {
    //await Promise.all([this.getRolesList(), this.getUserList()]);
    await this.getUserList();

    await this.getIndicatorById();
  }

  validateDropdowns(name, value) {
    if (value != "") {
      if (name === "ApproverUser1") {
        if (
          value === this.state.ApproverUser2 ||
          value === this.state.ApproverUser3
        ) {
          NotificationManager.error("Same Approver user is selected");
          return true;
        } else if (value === this.state.indicatorUser) {
          NotificationManager.error(
            "Approver should not be same as responsible user"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Approver should not be same as logged in user"
          );
          return true;
        }
      } else if (name === "ApproverUser2") {
        if (
          value === this.state.ApproverUser1 ||
          value === this.state.ApproverUser3
        ) {
          NotificationManager.error("Same Approver user is selected");
          return true;
        } else if (value === this.state.indicatorUser) {
          NotificationManager.error(
            "Approver should not be same to responsible user"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Approver should not be same as logged in user"
          );
          return true;
        }
      } else if (name === "ApproverUser3") {
        if (
          value === this.state.ApproverUser2 ||
          value === this.state.ApproverUser1
        ) {
          NotificationManager.error("Same Approver user is selected");
          return true;
        } else if (value === this.state.indicatorUser) {
          NotificationManager.error(
            "Approver should not be same as responsible user"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Approver should not be same as logged in user"
          );
          return true;
        }
      } else if (name === "indicatorUser") {
        if (
          value === this.state.ApproverUser1 ||
          value === this.state.ApproverUser2 ||
          value === this.state.ApproverUser1
        ) {
          NotificationManager.error(
            "Responsible user should not be same as approvers"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Responsible user should not be same as logged in user"
          );
          return true;
        }
      }
    }

    return false;
  }
  handleChange = (event) => {
    // if (event.target.name === "indicatorResponsibility") {
    //   this.getUserGroupUsers(event.target.value);
    // }
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

  getcndData() {
    //get Cnd
    fetch(ApiEndPoints.cndList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ cndlist: data.result });
      })
      .catch(console.log);
  }
  handleSubmit = (event) => {
    event.preventDefault();

    const {
      indicatorTitle,
      reportingCycle,
      selectedDate,
      indicatorEndDate,
      savedisabled,
      indicatorId,
      selectedText_RespUser,
      selectedText_Appr1,
      selectedText_Appr2,
      selectedText_Appr3,
    } = this.state;
    if (
      this.validateDropdowns_AutoComplete(
        "ApproverUser1",
        selectedText_Appr1._id
      ) ||
      this.validateDropdowns_AutoComplete(
        "ApproverUser2",
        selectedText_Appr2._id
      ) ||
      this.validateDropdowns_AutoComplete(
        "ApproverUser3",
        selectedText_Appr3._id
      ) ||
      this.validateDropdowns_AutoComplete(
        "indicatorUser",
        selectedText_RespUser._id
      )
    ) {
      return;
    }
    if (savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = {};
    formpojo.startDate = moment(selectedDate).format("X");
    formpojo.endDate = moment(indicatorEndDate).format("X");
    if (indicatorId !== "new") formpojo.id = indicatorId;
    else formpojo.id = null;

    formpojo.indicatorTitle = indicatorTitle;
    formpojo.reportingCycle = reportingCycle;
    formpojo.responsibleUser = selectedText_RespUser._id; // indicatorUser;
    formpojo.approverUser1 = selectedText_Appr1._id;
    formpojo.approverUser2 = selectedText_Appr2._id;
    formpojo.approverUser3 = selectedText_Appr3._id;
    formpojo.responsibleRole = null; //indicatorResponsibility;
    formpojo.AddPersonFlag = "Person";

    fetch(
      ApiEndPoints.indicators_assign + "?userid=" + auth.getCurrentUser()._id,
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
          this.props.updateList();
          this.props.toggle();
          NotificationManager.success("Assigned successfully");
        } else {
          this.setState({ responseError: data.msg, savedisabled: false });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };
  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }
  handleClear(event) {
    event.preventDefault();
    this.setState({
      selectedText_RespUser: "",
      selectedText_Appr1: "",
      selectedText_Appr2: "",
      selectedText_Appr3: "",
    });
  }
  validateDropdowns_AutoComplete(name, value) {
    const {
      selectedText_RespUser,
      selectedText_Appr1,
      selectedText_Appr2,
      selectedText_Appr3,
    } = this.state;

    if (value != "") {
      if (name === "ApproverUser1") {
        if (
          value === selectedText_Appr2._id ||
          value === selectedText_Appr3._id
        ) {
          NotificationManager.error("Same Approver user is selected");
          return true;
        } else if (value === selectedText_RespUser._id) {
          NotificationManager.error(
            "Approver should not be same as responsible user"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Approver should not be same as logged in user"
          );
          return true;
        }
      } else if (name === "ApproverUser2") {
        if (
          value === selectedText_Appr1._id ||
          (value === selectedText_Appr3 && selectedText_Appr3._id)
        ) {
          NotificationManager.error("Same Approver user is selected");
          return true;
        } else if (value === selectedText_RespUser._id) {
          NotificationManager.error(
            "Approver should not be same to responsible user"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Approver should not be same as logged in user"
          );
          return true;
        }
      } else if (name === "ApproverUser3") {
        if (
          (value === selectedText_Appr2 && selectedText_Appr2._id) ||
          value === selectedText_Appr1._id
        ) {
          NotificationManager.error("Same Approver user is selected");
          return true;
        } else if (value === selectedText_RespUser._id) {
          NotificationManager.error(
            "Approver should not be same as responsible user"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Approver should not be same as logged in user"
          );
          return true;
        }
      } else if (name === "indicatorUser") {
        if (
          value === selectedText_Appr1._id ||
          value === selectedText_Appr2._id
        ) {
          NotificationManager.error(
            "Responsible user should not be same as approvers"
          );
          return true;
        } else if (value === auth.getCurrentUser()._id) {
          NotificationManager.error(
            "Responsible user should not be same as logged in user"
          );
          return true;
        }
      }
    }
    return false;
  }

  onAutoCompleteChange_RespUser = (value) => {
    const validate = this.validateDropdowns_AutoComplete(
      "indicatorUser",
      value._id
    );
    if (validate) {
      return;
    }

    this.setState({
      selectedText_RespUser: value,
    });
  };
  onAutoCompleteChange_Appr1 = (value) => {
    const validate = this.validateDropdowns_AutoComplete(
      "ApproverUser1",
      value._id
    );
    if (validate) {
      return;
    }
    this.setState({
      selectedText_Appr1: value,
    });
  };
  onAutoCompleteChange_Appr2 = (value) => {
    const validate = this.validateDropdowns_AutoComplete(
      "ApproverUser2",
      value._id
    );
    if (validate) {
      return;
    }
    this.setState({
      selectedText_Appr2: value,
    });
  };
  onAutoCompleteChange_Appr3 = (value) => {
    const validate = this.validateDropdowns_AutoComplete(
      "ApproverUser3",
      value._id
    );
    if (validate) {
      return;
    }
    this.setState({
      selectedText_Appr3: value,
    });
  };

  render() {
    const {
      // ApproverUser1,
      // ApproverUser2,
      // ApproverUser3,
      userslist,
      //roleslist,

      //roleUsersList,
      //indicatorUser,

      selectedText_RespUser,
      selectedText_Appr1,
      selectedText_Appr2,
      selectedText_Appr3,
    } = this.state;

    //roleslist.sort(auth.sortValues("groupName"));
    // userslist.sort(auth.sortValues("firstName"));
    // roleUsersList.sort(auth.sortValues("firstName"));

    const options = userslist.map((option) => {
      const firstLetter = option.firstName[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    });

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Assign Person Responsible
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
                        {/* <div className="col-sm-6">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Select a Role *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="indicatorResponsibility"
                              validators={["required"]}
                              errorMessages={["Please Select Role"]}
                              value={this.state.indicatorResponsibility || ""}
                            >
                              {roleslist.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.groupName}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </FormGroup>
                        </div> */}
                        <div className="col-sm-6">
                          <FormGroup>
                            {/* <SelectValidator
                              variant="outlined"
                              label="Person Responsible *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="indicatorUser"
                              validators={["required"]}
                              errorMessages={[
                                "Please Select Person Responsible",
                              ]}
                              value={indicatorUser || ""}
                            >
                              {userslist.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.firstName + " " + value.lastName}
                                  </option>
                                );
                              })}
                            </SelectValidator> */}
                            <AutoCompleteDDL
                              id="indicatorUser"
                              name="indicatorUser"
                              onAutoCompleteChange={
                                this.onAutoCompleteChange_RespUser
                              }
                              selectedText={selectedText_RespUser}
                              options={options.sort(
                                (a, b) =>
                                  -b.firstLetter.localeCompare(a.firstLetter)
                              )}
                              groupBy={(option) => option.firstLetter}
                              getOptionLabel={(option) =>
                                option &&
                                option.firstName + " " + option.lastName
                              }
                              getOptionSelected={(option, value) =>
                                value._id === option._id
                              }
                              validators={["required"]}
                              errorMessages={[
                                "Please Select Person Responsible",
                              ]}
                              label="Person Responsible *"
                              placeholder="Select/Search Person Responsible"
                            />
                          </FormGroup>
                        </div>

                        {/* <ApproverDropDown
                          name={"ApproverUser1"}
                          handleChange={this.handleChange}
                          roleUsersList={userslist}
                          labelText={"Approver 1"}
                          indicatorUser={ApproverUser1}
                          validators={["required"]}
                          errorMessages={["Please Select the Approver"]}
                        ></ApproverDropDown> */}
                        <div className="col-sm-6">
                          <FormGroup>
                            <AutoCompleteDDL
                              id="ApproverUser1"
                              name="ApproverUser1"
                              onAutoCompleteChange={
                                this.onAutoCompleteChange_Appr1
                              }
                              selectedText={selectedText_Appr1}
                              options={options.sort(
                                (a, b) =>
                                  -b.firstLetter.localeCompare(a.firstLetter)
                              )}
                              groupBy={(option) => option.firstLetter}
                              getOptionLabel={(option) =>
                                option &&
                                option.firstName + " " + option.lastName
                              }
                              getOptionSelected={(option, value) =>
                                value._id === option._id
                              }
                              validators={["required"]}
                              errorMessages={["Please Select the Approver"]}
                              label="Approver 1 *"
                              placeholder="Select/Search Approver"
                            />
                          </FormGroup>
                        </div>

                        {/* <ApproverDropDown
                          name={"ApproverUser2"}
                          handleChange={this.handleChange}
                          roleUsersList={userslist}
                          labelText={"Approver 2"}
                          indicatorUser={ApproverUser2}
                        ></ApproverDropDown> */}
                        <div className="col-sm-6">
                          <FormGroup>
                            <AutoCompleteDDL
                              id="ApproverUser2"
                              name="ApproverUser2"
                              onAutoCompleteChange={
                                this.onAutoCompleteChange_Appr2
                              }
                              selectedText={selectedText_Appr2}
                              options={options.sort(
                                (a, b) =>
                                  -b.firstLetter.localeCompare(a.firstLetter)
                              )}
                              groupBy={(option) => option.firstLetter}
                              getOptionLabel={(option) =>
                                option &&
                                option.firstName + " " + option.lastName
                              }
                              getOptionSelected={(option, value) =>
                                value._id === option._id
                              }
                              // validators={["required"]}
                              // errorMessages={["Please Select the Approver"]}
                              label="Approver 2"
                              placeholder="Select/Search Approver"
                            />
                          </FormGroup>
                        </div>
                        {/* <ApproverDropDown
                          name={"ApproverUser3"}
                          handleChange={this.handleChange}
                          roleUsersList={userslist}
                          labelText={"Approver 3"}
                          indicatorUser={ApproverUser3}
                        ></ApproverDropDown> */}
                        <div className="col-sm-6">
                          <FormGroup>
                            <AutoCompleteDDL
                              id="ApproverUser3"
                              name="ApproverUser3"
                              onAutoCompleteChange={
                                this.onAutoCompleteChange_Appr3
                              }
                              selectedText={selectedText_Appr3}
                              options={options.sort(
                                (a, b) =>
                                  -b.firstLetter.localeCompare(a.firstLetter)
                              )}
                              groupBy={(option) => option.firstLetter}
                              getOptionLabel={(option) =>
                                option &&
                                option.firstName + " " + option.lastName
                              }
                              getOptionSelected={(option, value) =>
                                value._id === option._id
                              }
                              // validators={["required"]}
                              // errorMessages={["Please Select the Approver"]}
                              label="Approver 3"
                              placeholder="Select/Search Approver"
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button
                          color="primary"
                          type="submit"
                          disabled={this.state.savedisabled}
                        >
                          {this.state.savedisabled ? "Please wait..." : "Save"}
                        </Button>
                        <span>&nbsp;&nbsp;</span>
                        <Button
                          color="info"
                          onClick={this.handleClear.bind(this)}
                        >
                          Clear
                        </Button>
                        <span>&nbsp;&nbsp;</span>
                        <Button
                          color="warning"
                          onClick={this.handleCancel.bind(this)}
                        >
                          Close
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
export default withStyles(styles)(IndicatorFormAssign);
