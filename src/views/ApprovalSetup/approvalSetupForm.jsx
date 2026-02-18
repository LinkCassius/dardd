import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import auth from "../../auth";
import { ApiEndPoints } from "../../config";
import FormFunc from "../../components/common/formfunc";
import AutoCompleteDDL from "../../components/common/AutoCompleteDDL";

class ApprovalSetupForm extends FormFunc {
  constructor(props) {
    super(props);
    this.onAutoCompleteChange = this.onAutoCompleteChange.bind(this);
  }
  state = {
    errors: {},

    userslist: [],
    usergroups: [],
    approvalLevel: "User",
    approveeUser: "",
    approveeRole: "",
    responseError: "",
    updateSequence: 0,

    id: "new",
    newform: false,
    savedisabled: false,

    selectedText: "",
  };

  async componentDidMount() {
    await Promise.all([this.getUserList(), this.getUserGroupList()]);
    // await this.getUserList();
    // await this.getUserGroupList();
    await this.getOneApprovalLevelData();

    this.setState({ updateSequence: this.props.newSequence });

    ValidatorForm.addValidationRule("checkRole", (value) => {
      if (this.state.approvalLevel === "Role") {
        return true;
      }
      return false;
    });
    ValidatorForm.addValidationRule("checkUser", (value) => {
      if (this.state.approvalLevel === "User") {
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkRole");
    ValidatorForm.removeValidationRule("checkUser");
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

  getUserGroupList() {
    fetch(ApiEndPoints.userGroupList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ usergroups: data.result, loading: false });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          //  NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  handleChange = (event) => {
    if (event.target.value === "User") {
      this.setState({
        selectedText: "",
      });
    }

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getOneApprovalLevelData() {
    const id = this.props.id;

    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.approvalsetupList + "?approvalsetupid=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          let approveeRole = "",
            approveeUser = "";
          if (data.result[0].approvalLevel === "Role") {
            approveeRole = data.result[0].ddl;
            approveeUser = "";
          } else if (data.result[0].approvalLevel === "User") {
            approveeUser = data.result[0].ddl;
            approveeRole = "";
          }
          this.setState({
            updateSequence: data.result[0].sequence,
            approvalLevel: data.result[0].approvalLevel,
            id: data.result[0]._id,
            approveeUser,
            approveeRole,
            selectedText: data.result[0].approverIdObj,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          //NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;

    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;

    formpojo.approvalArea = this.props.selectedApprovalArea._id;
    formpojo.approvalLevel = this.state.approvalLevel;

    if (this.state.approvalLevel === "Role")
      formpojo.approverId = this.state.approveeRole;
    if (this.state.approvalLevel === "User") {
      //formpojo.approverId = this.state.approveeUser;
      formpojo.approverId = this.state.selectedText._id; //this.state.approveeUser;
    }
    formpojo.approvalType = this.props.selectedApprovalArea.approvalAreaCode;

    formpojo.sequence = this.state.updateSequence;

    fetch(
      ApiEndPoints.AddUpdateApprovalSetup +
        "?userid=" +
        auth.getCurrentUser()._id,
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
          NotificationManager.success(data.msg);
          this.props.toggle();
          this.props.updateList();
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else {
          this.setState({ responseError: data.msg });
          this.setState({ savedisabled: false });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }
  onAutoCompleteChange = (value) => {
    //console.log("xxn2", value);
    this.setState({
      selectedText: value,
    });
  };
  render() {
    const {
      userslist,
      usergroups,
      updateSequence,
      approvalLevel,
      selectedText,
    } = this.state;
    userslist.sort(auth.sortValues("firstName"));
    usergroups.sort(auth.sortValues("groupName"));

    const styleUser = approvalLevel === "Role" ? "none" : "block";
    const styleRole = approvalLevel === "User" ? "none" : "block";

    const options = userslist.map((option) => {
      const firstLetter = option.firstName[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    });
    console.log("selected text : ", selectedText);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Approval Level
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                {/* <span className="error-msg">{this.state.responseError}</span> */}
                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit}
                  style={{ width: "100%" }}
                >
                  <div className="row">
                    <div className="col-md-10 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              helperText=" "
                              label="Approver Sequence"
                              name="sequence"
                              value={updateSequence}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Approval Level"
                              helperText=" "
                              onChange={this.handleChange}
                              name="approvalLevel"
                              validators={["required"]}
                              errorMessages={["Please Select Approval Level"]}
                              value={this.state.approvalLevel}
                            >
                              <option className="custom-option" value="Role">
                                Role
                              </option>
                              <option className="custom-option" value="User">
                                User
                              </option>
                            </SelectValidator>
                          </FormGroup>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-12">
                          <div style={{ display: styleUser }}>
                            <FormGroup>
                              {/* <SelectValidator
                                variant="outlined"
                                label="Approver"
                                helperText=" "
                                onChange={this.handleChange}
                                name="approveeUser"
                                //   validators={["required", "checkUser"]}
                                //   errorMessages={["required", "Please Select User"]}
                                value={this.state.approveeUser}
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
                                id="approveeUser"
                                name="approveeUser"
                                onAutoCompleteChange={this.onAutoCompleteChange}
                                selectedText={selectedText}
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
                                label="Approver *"
                                placeholder="Select/Search Approver"
                              />
                            </FormGroup>
                          </div>
                          <div style={{ display: styleRole }}>
                            <FormGroup>
                              <SelectValidator
                                variant="outlined"
                                label="Approver *"
                                helperText=" "
                                onChange={this.handleChange}
                                name="approveeRole"
                                //   validators={["required", "checkRole"]}
                                //   errorMessages={["required", "Please Select Role"]}
                                value={this.state.approveeRole}
                              >
                                {usergroups.map((value, index) => {
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
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <span className="mandatory">
                            All (*) marked fields are mandatory
                          </span>
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
export default ApprovalSetupForm;
