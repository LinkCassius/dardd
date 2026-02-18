import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import GridItem from "./../../../components/Grid/GridItem.js";
import GridContainer from "./../../../components/Grid/GridContainer.js";
import Card from "./../../../components/Card/Card.js";
import CardHeader from "./../../../components/Card/CardHeader.js";
import CardBody from "./../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import AutoCompleteDDL from "../../../components/common/AutoCompleteDDL";
import moment from "moment";
import { ApiEndPoints } from "../../../config";
import auth from "../../../auth";

import FormFunc from "./../../../components/common/formfunc";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractTaskForm extends FormFunc {
  constructor(props) {
    super(props);
    this.state = {
      //userslist: [],
      //Tasks start

      taskId: "new",
      taskName: "",
      taskTargetDate: currentDate,
      taskPersonResp: "",
      //Tasks end
      newform: false,
      savedisabled: false,

      selectedText: "",
      options: [], //userslist
    };
    this.onAutoCompleteChange = this.onAutoCompleteChange.bind(this);
  }
  async componentDidMount() {
    await this.getUserList();
    await this.getTaskById();

    ValidatorForm.addValidationRule("checkContractDates", (value) => {
      if (
        moment(value).isBefore(this.props.startDate_Extension) ||
        moment(value).isAfter(this.props.endDate_Extension)
      ) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkContractDates");
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  getUserList() {
    fetch(ApiEndPoints.activeusers, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          if (data.result.length > 0) {
            this.setState({
              //userslist: data.result,
              loading: false,
              options: data.result,
            });
          } else {
            this.setState({
              options: [""],
            });
            NotificationManager.error("Users not found");
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

  getTaskById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.taskById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            taskName: data.result.taskName,
            taskPersonResp: data.result.personResponsible._id,
            taskTargetDate: moment(data.result.taskTargetDate * 1000).format(
              "YYYY-MM-DD"
            ),
            taskId: data.result._id,

            selectedText: data.result.personResponsible,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          // NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  handleSubmit_Task = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    var contractId = this.props.contractId;

    const formpojo = {};
    if (this.state.taskId !== "new") formpojo.id = this.state.taskId;
    else formpojo.id = null;

    formpojo.contract = contractId;
    formpojo.taskName = this.state.taskName;
    formpojo.taskTargetDate = moment(this.state.taskTargetDate).format("X");
    formpojo.personResponsible = this.state.selectedText._id; //this.state.taskPersonResp;

    fetch(ApiEndPoints.AddUpdateTask + "?userid=" + auth.getCurrentUser()._id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": auth.getJwt(),
      },
      body: JSON.stringify(formpojo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          NotificationManager.success(data.msg);

          this.props.toggle();
          this.props.updateList();
          this.sendMail(
            formpojo.personResponsible,
            "Task Assignment",
            formpojo.taskName,
            "Person Responsible"
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

  sendMail(id, mailSubject, mailBody, msgx) {
    const formpojo = {};
    formpojo.mailSubject = mailSubject;
    formpojo.mailBody = mailBody;
    formpojo.msgx = msgx;
    fetch(ApiEndPoints.sendMail + "/" + id + "?activeIndex=1", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formpojo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          NotificationManager.success("Mail Sent Successfully to " + msgx);
        } else {
          this.setState({ responseError: data.msg });
        }
      })
      .catch("error", console.log);
  }

  onAutoCompleteChange = (value) => {
    //console.log("xxn2", value);
    this.setState({
      selectedText: value,
    });
  };

  render() {
    const { selectedText, options } = this.state;
    //userslist.sort(auth.sortValues("firstName"));
    const optionsX = options.map((option) => {
      const firstLetter = option.firstName[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    });
    // console.log("optionsX : ", optionsX);
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Task
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                {/* <span className="error-msg">{this.state.responseError}</span> */}

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Task}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Task Description *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="taskName"
                              value={this.state.taskName}
                              validators={["required"]}
                              errorMessages={["Task Description is mandatory"]}
                              variant="outlined"
                            />
                            {/* {this.renderInput(
                              "taskName",
                              "Task Description *",
                              "text",
                              " ",
                              "required", 
                              "outlined",
                              "Task Description is mandatory"
                            )} */}
                          </FormGroup>
                        </div>

                        <div className="col-sm-6">
                          <FormGroup>
                            {/* <SelectValidator
                              variant="outlined"
                              label="Person Responsible *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="taskPersonResp"
                              validators={["required"]}
                              errorMessages={[
                                "Please Select Person Responsible",
                              ]}
                              value={this.state.taskPersonResp}
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
                          </FormGroup>
                          <FormGroup>
                            <AutoCompleteDDL
                              id="taskPersonResp"
                              name="taskPersonResp"
                              onAutoCompleteChange={this.onAutoCompleteChange}
                              selectedText={selectedText}
                              options={optionsX.sort(
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

                        <div className="col-sm-6">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Target Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="taskTargetDate"
                              type="date"
                              value={this.state.taskTargetDate}
                              validators={["checkContractDates", "required"]}
                              errorMessages={[
                                "Date should be in between Contract Dates",
                                "Target Date is mandatory",
                              ]}
                            />
                          </FormGroup>
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

                      {/*</form>*/}
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
export default ContractTaskForm;
