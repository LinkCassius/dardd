import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import NumberFormat from "react-number-format";
import GridItem from "./../../../components/Grid/GridItem.js";
import GridContainer from "./../../../components/Grid/GridContainer.js";
import Card from "./../../../components/Card/Card.js";
import CardHeader from "./../../../components/Card/CardHeader.js";
import CardBody from "./../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import moment from "moment";
import { ApiEndPoints, siteConfig, fileTypes } from "../../../config";

import FormFunc from "./../../../components/common/formfunc";
import auth from "../../../auth";
import mailhelpers from "../../../helpers/mailHelper";
import AutoCompleteDDL from "../../../components/common/AutoCompleteDDL";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractMileForm extends FormFunc {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.removefile = this.removefile.bind(this);
    this.onAutoCompleteChange = this.onAutoCompleteChange.bind(this);
  }
  state = {
    userslist: [],
    milestoneId: "new",
    milestoneName: "",
    milestoneDetails: "",
    milestoneStartDate: currentDate,
    milestoneendDate: currentDate,
    milestoneValue: "",
    milestoneRevision: "",
    milestonePersonResp: "",
    milestoneApprStatus: "",
    newform: false,

    personResponsibleName: "",

    docCollection: "",
    file: null,
    supportingDoc: null,
    uploading: false,
    fileName: "",
    savedisabled: false,

    retentionPerc: "",
    penalty: false,

    dateError: "",

    selectedText: "",
    options: [], //userslist

    isRetentionMilestone: false,
    remainingRetentionAmount: 0,
    showRetentionAmount: false,
  };

  async componentDidMount() {
    await this.getUserList();
    await this.getMilestoneById();

    ValidatorForm.addValidationRule("checkEndDate", (value) => {
      if (moment(value).isBefore(this.state.milestoneStartDate)) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkContractDates", (value) => {
      console.log("this.props.isRetentionApplicable");
      if (this.props.isRetentionApplicable) {
        if (moment(value).isBefore(this.props.startDate_Extension)) {
          this.setState({
            dateError: "Dates should be after Contract Start Date",
          });
          return false;
        } else return true;
      } else if (
        moment(value).isBefore(this.props.startDate_Extension) ||
        moment(value).isAfter(this.props.endDate_Extension)
      ) {
        this.setState({
          dateError: "Dates should be in between Contract Dates",
        });
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkEndDate");
    ValidatorForm.removeValidationRule("checkContractDates");
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleCheck = (event) => {
    this.setState({ penalty: event.target.checked });
  };
  retentionChange = (event) => {
    let { value } = event.target;

    if (value <= 100 && value >= 0) {
      // % should be in between 1 - 100
      this.setState({ retentionPerc: value });
    } else return;
  };

  onChange(e) {
    this.setState({
      uploading: true,
      fileName: e.target.files[0].name,
    });

    const url = ApiEndPoints.uploadfile;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    if (fileTypes.includes(e.target.files[0].type))
      fetch(url, {
        method: "POST",
        body: formData,
        "x-auth-token": auth.getJwt(),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res && res.success === true) {
            NotificationManager.success("File Uploaded Successfully");
            this.setState({
              uploading: false,
              supportingDoc: res.url,
            });
          } else if (res && res.success === false && res.responseCode === 401) {
            NotificationManager.error(res.msg);
            localStorage.clear();
            return (window.location.href = "/");
          }
        })
        .catch((rejected) => {
          console.log("rejected", rejected);
          this.setState({
            uploading: false,
          });
        });
    else {
      this.setState({
        uploading: false,
      });
      NotificationManager.warning(
        "Accepts only PDF/Excel/Word/Excel/ JPEG/PNG/PPT/ZIP/Text"
      );
    }
  }

  removefile(e) {
    NotificationManager.success("File Removed Successfully");
    this.setState({
      supportingDoc: null,
    });
  }
  personResponsibleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.setState({ personResponsibleName: event.nativeEvent.target.text });
  };

  getUserList() {
    fetch(ApiEndPoints.activeusers, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            userslist: data.result,
            loading: false,
            options: data.result,
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

  getMilestoneById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.milestoneById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          console.log("mile id : ", data.result);
          this.setState({
            milestoneId: data.result._id,
            milestoneName: data.result.milestoneName,
            milestoneDetails: data.result.milestoneDetails,
            milestoneStartDate: moment(data.result.startDate * 1000).format(
              "YYYY-MM-DD"
            ),
            milestoneendDate: moment(data.result.endDate * 1000).format(
              "YYYY-MM-DD"
            ),
            milestoneValue: data.result.milestoneValue,
            milestoneRevision: data.result.Revision,
            milestonePersonResp: data.result.personResponsible._id,
            personResponsibleName:
              data.result.personResponsible.firstName +
              " " +
              data.result.personResponsible.lastName,
            milestoneApprStatus: data.result.approvalStatus,

            supportingDoc: data.docCollection,
            retentionPerc: data.result.retentionPercentage,
            penalty: data.result.penalty,
            selectedText: data.result.personResponsible,
            isRetentionMilestone: data.result.isRetentionMilestone,
            remainingRetentionAmount: data.remainingRetentionAmount,
            showRetentionAmount: data.result.isRetentionMilestone
              ? true
              : false,
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

  handleSubmit_Milestone = (event) => {
    event.preventDefault();
    const { milestoneId, isRetentionMilestone, retentionPerc, milestoneValue } =
      this.state;
    if (milestoneValue === "") {
      this.setState({ savedisabled: false });
      NotificationManager.warning("Please enter milestone value.");
      return;
    }

    var contractId = this.props.contractId;

    let totalMilestoneAmount = 0,
      finalMilestoneValue = 0,
      totalRetentionAmount = 0,
      retentionAmountMilestone = 0;

    //for loop start
    this.props.milestones.forEach(function (arrayItem) {
      console.log("ms arrayitem : ", arrayItem);

      if (
        arrayItem.approvalStatus?.cndName !== "Rejected" &&
        arrayItem._id != milestoneId &&
        arrayItem.milestoneName !== "Totals"
      ) {
        if (!arrayItem.isRetentionMilestone) {
          //if this is not ret milestone, then skip summation for ret amt

          //inorder to allow milestone for ret perc amt, add ret perc from milestone's value
          let retAmount =
            parseFloat(arrayItem.milestoneValue) *
            parseFloat(arrayItem.retentionPercentage / 100).toFixed(2);

          totalMilestoneAmount =
            parseFloat(totalMilestoneAmount) +
            parseFloat(arrayItem.milestoneValue) +
            parseFloat(retAmount);

          totalRetentionAmount =
            parseFloat(totalRetentionAmount) + parseFloat(retAmount);
        }
        if (arrayItem.isRetentionMilestone) {
          //check for all ret milestone to get ret amt
          retentionAmountMilestone =
            parseFloat(retentionAmountMilestone) +
            parseFloat(arrayItem.milestoneValue);
        }
      }
    });
    //for loop end

    console.log(
      "totalRetentionAmount, totalMilestoneAmount : ",
      totalRetentionAmount,
      totalMilestoneAmount
    );

    if (!isRetentionMilestone) {
      //get ret amt for the current milestone value
      let retAmount_currentMS =
        parseFloat(milestoneValue) * parseFloat(retentionPerc / 100).toFixed(2);

      finalMilestoneValue =
        parseFloat(totalMilestoneAmount) +
        parseFloat(milestoneValue) +
        parseFloat(retAmount_currentMS);

      totalRetentionAmount =
        parseFloat(totalRetentionAmount) + parseFloat(retAmount_currentMS);

      //check if already available ms value (which is ret ms) > when current ms (which is not ret ms) has reduced ms value// while editing
      if (milestoneId != "new") {
        //available ret amt ms + curr ret amt

        if (
          parseFloat(retentionAmountMilestone) >
          parseFloat(totalRetentionAmount)
        ) {
          NotificationManager.warning(
            "Can't modify, available retention milestone value is greater than actual retention amount",
            "Condition"
          );
          return;
        }
      }
      console.log(
        "totalRetentionAmount, finalMilestoneValue ms , contract val : ",
        totalRetentionAmount,
        finalMilestoneValue,
        this.props.contractValue
      );
    }

    // if retention milestone start
    if (isRetentionMilestone) {
      //if the milestone is retention
      let final_retAmount =
        parseFloat(retentionAmountMilestone) + parseFloat(milestoneValue);
      if (retentionPerc > 0) {
        // retention % should be zero
        NotificationManager.warning(
          "Retention % should be zero if it is retention milestone",
          "Condition"
        );
        return;
      } else if (totalRetentionAmount == 0) {
        //if the milestone is retention, ret amt should be > 0
        NotificationManager.warning(
          "Please check, retention amount is not available",
          "Condition"
        );
        return;
      } else if (
        parseFloat(final_retAmount.toFixed(2)) >
        parseFloat(totalRetentionAmount.toFixed(2))
      ) {
        //check for remaining ret amount
        NotificationManager.warning(
          "Please check, milestone value is greater than retention amount",
          "Condition"
        );
        return;
      }
    }
    // if retention milestone end

    if (
      parseFloat(finalMilestoneValue) > parseFloat(this.props.contractValue)
    ) {
      this.setState({ savedisabled: false });
      NotificationManager.warning(
        "Total Milestones Value Exceeds Contract Value",
        "Condition"
      );
      return;
    }
    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });
    const formpojo = {};
    if (this.state.milestoneId !== "new") formpojo.id = this.state.milestoneId;
    else formpojo.id = null;

    formpojo.docCollection = this.state.supportingDoc;
    formpojo.fileName = this.state.fileName;

    formpojo.contract = contractId;
    formpojo.milestoneName = this.state.milestoneName;
    formpojo.milestoneDetails = this.state.milestoneDetails;
    formpojo.startDate = moment(this.state.milestoneStartDate).format("X");
    formpojo.endDate = moment(this.state.milestoneendDate).format("X");
    formpojo.milestoneValue = this.state.milestoneValue;
    formpojo.Revision = this.state.milestoneRevision;
    //formpojo.personResponsible = this.state.milestonePersonResp;
    formpojo.personResponsible = this.state.selectedText._id;

    formpojo.approvalSequence = 1;
    formpojo.approvalStatus = "5e996a81c3f4c40045d3717b"; //approval status - Initiated

    formpojo.contractName = this.props.contractName;
    formpojo.personResponsibleName =
      this.state.selectedText.firstName +
      " " +
      this.state.selectedText.lastName; //this.state.personResponsibleName;
    formpojo.milestoneStartDate = this.state.milestoneStartDate;
    formpojo.milestoneendDate = this.state.milestoneendDate;
    formpojo.retentionPercentage = this.state.retentionPerc;
    formpojo.penalty = this.state.penalty;
    formpojo.isRetentionMilestone = this.state.isRetentionMilestone;

    //Below code is commented as even though the record is initiated/rejected/approved, it can be modified and workflow re-initates..
    // if (this.state.milestoneApprStatus === "5e996a81c3f4c40045d3717b") {
    //   this.setState({ savedisabled: false });
    //   NotificationManager.error(
    //     "You cannot submit again as workflow is in progress"
    //   );
    //   return;
    // } else {
    //   const requestOptions = { method: "get" };

    fetch(ApiEndPoints.approvalsetupList + "?approvalType=CM&sequence=1", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((response) => response.json())
      .then((res1) => {
        if (res1 && res1.success === true) {
          if (res1.result.length > 0) {
            //insert milestone collection
            formpojo.approvalLevel = res1.result[0].approvalLevel;
            fetch(
              ApiEndPoints.AddUpdateContract_Milestone +
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
                  NotificationManager.success(
                    "Request for Contract-Milestone has been sent for approval"
                  );

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
                  NotificationManager.error(data.msg);
                  this.setState({ responseError: data.msg });
                  this.setState({ savedisabled: false });
                }
              })
              .catch("error", console.log);

            //get mails
            if (res1.result[0].approvalLevel === "User") {
              fetch(ApiEndPoints.usersList + "?id=" + res1.result[0].ddl, {
                method: "GET",
                headers: { "x-auth-token": auth.getJwt() },
              })
                .then((response) => response.json())
                .then((res2) => {
                  if (res2 && res2.success === true) {
                    if (res2.result.length > 0) {
                      var mailBody =
                        "Contract Name : " +
                        this.props.contractName +
                        "<br/>" +
                        "Contract Number : " +
                        this.props.contractNumber +
                        "<br/>" +
                        "You are requested to approve contract-milestone : <br/>" +
                        "<b> Milestone Name : " +
                        this.state.milestoneName +
                        "  <br/>" +
                        "Start Date : " +
                        this.state.milestoneStartDate +
                        "  <br/>" +
                        "End Date:" +
                        this.state.milestoneendDate +
                        "<br/>" +
                        "Milestone Value : " +
                        this.state.milestoneValue +
                        "<br/>" +
                        "Retention % : " +
                        this.state.retentionPerc +
                        "<br/>" +
                        "Person Responsible : " +
                        this.state.personResponsibleName +
                        " </b> <br/>";

                      mailhelpers.sendMail(
                        res1.result[0].ddl,
                        "Request for approval - Contract Milestone",
                        mailBody,
                        "Approver",
                        3
                      );
                    }
                  } else if (
                    res2 &&
                    res2.success === false &&
                    res2.responseCode === 401
                  ) {
                    NotificationManager.error(res2.msg);
                    localStorage.clear();
                    return (window.location.href = "/");
                  }
                })
                .catch(console.log);
            } else if (res1.result[0].approvalLevel === "Role") {
              fetch(
                ApiEndPoints.usersList + "?userGroup=" + res1.result[0].ddl,
                {
                  method: "GET",
                  headers: { "x-auth-token": auth.getJwt() },
                }
              )
                .then((response) => response.json())
                .then((res2) => {
                  if (res2 && res2.success === true) {
                    if (res2.result.length > 0) {
                      var mailBody =
                        "Contract Name : " +
                        this.props.contractName +
                        "<br/>" +
                        "Contract Number : " +
                        this.props.contractNumber +
                        "<br/>" +
                        "You are requested to approve contract-milestone : <br/>" +
                        "<b> Milestone Name : " +
                        this.state.milestoneName +
                        "  <br/>" +
                        "Start Date : " +
                        this.state.milestoneStartDate +
                        "  <br/>" +
                        "End Date:" +
                        this.state.milestoneendDate +
                        "<br/>" +
                        "Milestone Value : " +
                        this.state.milestoneValue +
                        "<br/>" +
                        "Retention % : " +
                        this.state.retentionPerc +
                        "<br/>" +
                        "Person Responsible : " +
                        this.state.personResponsibleName +
                        " </b> <br/>";

                      res2.result.forEach(function (user) {
                        mailhelpers.sendMail(
                          user._id,
                          "Request for approval - Contract Milestone",
                          mailBody,
                          "Approver",
                          3
                        );
                      });
                    }
                  } else if (
                    res2 &&
                    res2.success === false &&
                    res2.responseCode === 401
                  ) {
                    NotificationManager.error(res2.msg);
                    localStorage.clear();
                    return (window.location.href = "/");
                  }
                })
                .catch(console.log);
            }
          } else {
            this.setState({ savedisabled: false });
            NotificationManager.warning(
              "Approver has not been defined, please contact Admin"
            );
          }
        } else if (
          res1 &&
          res1.success === false &&
          res1.responseCode === 401
        ) {
          NotificationManager.error(res1.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }
  onAutoCompleteChange = (value) => {
    this.setState({
      selectedText: value,
    });
  };

  handleCheckRetention = (event) => {
    const { milestoneId, retentionPerc, milestoneValue } = this.state;
    if (retentionPerc > 0) {
      NotificationManager.warning(
        "Retention % should be zero if it is retention milestone",
        "Condition"
      );
      return;
    }
    this.setState({
      isRetentionMilestone: event.target.checked,
      showRetentionAmount: event.target.checked,
    });

    if (event.target.checked) {
      let retentionAmountMilestone = 0,
        totalRetentionAmountPerc = 0;
      //for loop start
      this.props.milestones.forEach(function (arrayItem) {
        console.log("ms arrayitem : ", arrayItem);

        if (
          arrayItem.approvalStatus?.cndName !== "Rejected" &&
          arrayItem._id != milestoneId &&
          arrayItem.milestoneName !== "Totals"
        ) {
          if (!arrayItem.isRetentionMilestone) {
            //if this is not ret milestone, then skip summation for ret amt

            //inorder to allow milestone for rec perc amt, add rec perc from milestone's value
            let retAmount =
              parseFloat(arrayItem.milestoneValue) *
              parseFloat(arrayItem.retentionPercentage / 100).toFixed(2);

            totalRetentionAmountPerc =
              parseFloat(totalRetentionAmountPerc) + parseFloat(retAmount);
          }
          if (arrayItem.isRetentionMilestone) {
            //check for all ret milestone to get ret amt
            retentionAmountMilestone =
              parseFloat(retentionAmountMilestone) +
              parseFloat(arrayItem.milestoneValue);
          }
        }
      });
      //for loop end

      //remaining ret amt = total retention % amount - already available milestone retention values
      console.log(
        "totalRetentionAmountPerc , retentionAmountMilestone : ",
        totalRetentionAmountPerc,
        retentionAmountMilestone
      );
      let remainingRetentionAmount =
        parseFloat(totalRetentionAmountPerc) -
        parseFloat(retentionAmountMilestone);
      this.setState({
        remainingRetentionAmount,
      });
    }
  };

  render() {
    const {
      userslist,
      milestoneName,
      milestoneDetails,
      milestoneStartDate,
      milestoneendDate,
      milestoneValue,
      milestoneRevision,
      milestonePersonResp,
      retentionPerc,
      dateError,
      selectedText,
      options,
      remainingRetentionAmount,
      showRetentionAmount,
    } = this.state;
    //userslist.sort(auth.sortValues("firstName"));
    const optionsX = options.map((option) => {
      const firstLetter = option.firstName[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option,
      };
    });

    let showRetAmt = showRetentionAmount ? "block" : "none";
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Milestone
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Milestone}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Milestone Name *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneName"
                              value={milestoneName}
                              validators={["required"]}
                              errorMessages={["Milestone Name is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-8">
                          <FormGroup>
                            <TextValidator
                              label="Milestone Details"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneDetails"
                              value={milestoneDetails}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-4">
                          <FormGroup>
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Milestone Value *"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={milestoneValue}
                              thousandSeparator={true}
                              prefix={"R"}
                              onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                // formattedValue = $2,223
                                // value ie, 2223
                                this.setState({ milestoneValue: value });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Start Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneStartDate"
                              type="date"
                              value={milestoneStartDate}
                              validators={["checkContractDates", "required"]}
                              errorMessages={[
                                dateError,
                                "Start Date is mandatory",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="End Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneendDate"
                              type="date"
                              value={milestoneendDate}
                              validators={[
                                "checkEndDate",
                                "checkContractDates",
                                "required",
                              ]}
                              errorMessages={[
                                "End Date should be greater than Start Date",
                                dateError,
                                "End Date is mandatory",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Retention % *"
                              helperText=" "
                              onChange={this.retentionChange}
                              name="retentionPerc"
                              value={retentionPerc}
                              validators={["required", "isNumber"]}
                              errorMessages={[
                                "Retention % is mandatory",
                                "It Should be numeric",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Milestone Revision"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneRevision"
                              value={milestoneRevision}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            {/* <SelectValidator
                              variant="outlined"
                              label="Person Responsible *"
                              helperText=" "
                              onChange={this.personResponsibleChange}
                              name="milestonePersonResp"
                              validators={["required"]}
                              errorMessages={[
                                "Please Select Person Responsible",
                              ]}
                              value={milestonePersonResp}
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
                              id="responsiblePerson"
                              name="responsiblePerson"
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
                              validators={["required"]}
                              errorMessages={[
                                "Please Select Person Responsible",
                              ]}
                              label="Person Responsible *"
                              placeholder="Select/Search Person Responsible"
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-8" style={{ textAlign: "left" }}>
                          <FormGroup>
                            {this.state.supportingDoc ? (
                              <span>
                                <a
                                  target="_blank"
                                  href={
                                    siteConfig.imagesPath +
                                    this.state.supportingDoc +
                                    "?token=" +
                                    localStorage.getItem("uploadToken")
                                  }
                                >
                                  <i
                                    style={{
                                      fontSize: "25px",
                                    }}
                                    className="fa fa-file"
                                  ></i>
                                </a>
                                <span>&nbsp;&nbsp;</span>
                                {this.state.supportingDoc}
                                <span>&nbsp;&nbsp;</span>

                                <i
                                  style={{
                                    textAlign: "left",
                                  }}
                                  className="fa fa-remove"
                                  onClick={this.removefile}
                                ></i>
                              </span>
                            ) : (
                              <TextValidator
                                variant="outlined"
                                helperText=" "
                                onChange={this.onChange}
                                name="file"
                                type="file"
                                value={this.state.file}
                                validators={["required"]}
                                errorMessages={["File is mandatory"]}
                              />
                            )}

                            {this.state.uploading === true ? (
                              <i className="fa fa-circle-o-notch fa-spin"></i>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>

                        <div className="col-sm-4">
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.penalty}
                                  onChange={this.handleCheck}
                                  name="checkedB"
                                  color="primary"
                                />
                              }
                              label="Is Penalty Applicable"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.isRetentionMilestone}
                                  onChange={this.handleCheckRetention}
                                  name="checkedR"
                                  color="primary"
                                />
                              }
                              label="Is this Retention Milestone"
                            />
                          </FormGroup>
                        </div>
                        <div
                          className="col-sm-4"
                          style={{ display: showRetAmt }}
                        >
                          <FormGroup>
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Retention Amount"
                              helperText="Milestone Value should be less/equal to this value"
                              allowNegative={true}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={remainingRetentionAmount}
                              thousandSeparator={true}
                              prefix={"R"}
                              disabled
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup row>
                            <span className="fa fa-info-circle">
                              Retention marked as{" "}
                              {this.props.isRetentionApplicable == false
                                ? "NO"
                                : "YES"}{" "}
                              for this contract, if it is NO means, can't add
                              milestone beyond contract-end date.
                            </span>
                            {/* <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.props.isRetentionApplicable}
                                  //onChange={this.handleCheck}
                                  name="isRetentionApplicable"
                                  color="primary"
                                  disabled
                                />
                              }
                              label="Is Retention Applicable"
                            /> */}
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
export default ContractMileForm;
