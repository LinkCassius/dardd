import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import NumberFormat from "react-number-format";
import FormGroup from "@material-ui/core/FormGroup";
import moment from "moment";
import GridItem from "./../../../components/Grid/GridItem.js";
import GridContainer from "./../../../components/Grid/GridContainer.js";
import Card from "./../../../components/Card/Card.js";
import CardHeader from "./../../../components/Card/CardHeader.js";
import CardBody from "./../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import auth from "../../../auth";
import mailhelpers from "../../../helpers/mailHelper";

import { ApiEndPoints, siteConfig, fileTypes } from "../../../config";

import FormFunc from "./../../../components/common/formfunc";
const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractPayForm extends FormFunc {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.removefile = this.removefile.bind(this);
  }

  state = {
    milestones: [],
    milestone: "",
    milestoneName: "",
    paymentId: "new",
    // isRetention: "",

    amount: "",
    paymentTransRefno: "",
    approvalStatus: "",
    newform: false,
    contractId: "",

    docCollection: "",
    file: null,
    supportingDoc: null,
    uploading: false,
    fileName: "",
    savedisabled: false,

    milestoneValue: 0,
    retentionPerc: 0,
    retentionAmount: 0,
    paymentDate: currentDate,
    milestoneEndDate:"",
    dateError:""

  };

  async componentDidMount() {
    await this.getMilestonesList(this.props.contractId);
    await this.getPaymentById();

    ValidatorForm.addValidationRule("checkEndDate", (value) => {
      if (moment(value).isBefore(this.state.milestoneEndDate)) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkContractDates", (value) => {
     
        if (moment(value).isBefore(this.props.startDate_Extension)) {
          this.setState({
            dateError: "Dates should be after Contract Start Date",
          });
          return false;
        } else return true;
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

  milestoneChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.setState({ milestoneName: event.nativeEvent.target.text });

    let selectedMilestone = this.state.milestones
      ? this.state.milestones.filter((data) => data._id === event.target.value)
      : [];

    console.log("selectedMilestone  : ", selectedMilestone);
    // console.log("milestone  : ", selectedMilestone[0].milestoneValue);

    let milestoneValue =
      selectedMilestone && selectedMilestone.length > 0
        ? selectedMilestone[0].milestoneValue
        : 0;

    let retentionPerc =
      selectedMilestone && selectedMilestone.length > 0
        ? selectedMilestone[0].retentionPercentage
        : 0;

    let retentionAmount = milestoneValue * (retentionPerc / 100);

   let milestoneEndDateCon= selectedMilestone && selectedMilestone.length > 0
   ? selectedMilestone[0].milestoneendDate : "";
   
   let milestoneEndDate = moment(milestoneEndDateCon * 1000).format("YYYY-MM-DD")
    this.setState({ milestoneValue, retentionPerc, retentionAmount, milestoneEndDate });
  };

  getMilestonesList(contractId) {
    fetch(
      ApiEndPoints.contract_Milestone_List + "/" + contractId + "?payflag=1",
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          let milestones = data.result
            ? data.result.filter((data) => data.milestoneName !== "Totals")
            : [];
          this.setState({ milestones });
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

  getPaymentById = async () => {
    const id = this.props.id;
    const contractId = this.props.contractId;
    if (id === "new") return;
    this.setState({ newform: true });
    this.setState({ contractId: contractId });

    await fetch(ApiEndPoints.paymentById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          console.log("data result : ", data.result);
          this.setState({
            milestone: data.result.milestone._id,
            paymentId: data.result._id,
            // isRetention: data.result.isRetention,
            // retentionPerc: data.result.retentionPercentage,
            amount: data.result.amount,
            paymentTransRefno: data.result.transRefno,
            approvalStatus: data.result.approvalStatus,

            supportingDoc: data.docCollection,
            paymentDate: moment(data.result.paymentDate * 1000).format(
              "YYYY-MM-DD"
            )
          });

          ///////
          //get milestone value and set the state
          // let selectedMilestone = this.state.milestones
          //   ? this.state.milestones.filter(
          //       (item) => item._id === data.result.milestone
          //     )
          //   : [];

          //console.log("selectedMilestone  : ", selectedMilestone);
          // console.log("milestone  : ", selectedMilestone[0].milestoneValue);

          // let milestoneValue =
          //   selectedMilestone && selectedMilestone.length > 0
          //     ? selectedMilestone[0].milestoneValue
          //     : 0;
          let milestoneValue = data.result.milestone.milestoneValue;
          // let retentionPerc =
          //   selectedMilestone && selectedMilestone.length > 0
          //     ? selectedMilestone[0].retentionPercentage
          //     : 0;
          let retentionPerc = data.result.milestone.retentionPercentage;

          let retentionAmount = milestoneValue * (retentionPerc / 100);

          this.setState({
            milestoneValue,
            retentionPerc,
            retentionAmount,
          });
          ///////
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
  };

  handleSubmit_Payment = (event) => {
    event.preventDefault();

    if (this.state.amount === "") {
      this.setState({ savedisabled: false });
      NotificationManager.warning("Please enter amount.");
      return;
    }

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    var contractId = this.props.contractId;

    //////////payments should not be greater than milestone value//////////////
    const { milestoneValue, amount, retentionAmount, paymentId, milestone } =
      this.state;

    let totalPayments = 0;
    this.props.payments.forEach(function (arrayItem) {
      console.log("arr item , payment ID : ", arrayItem, paymentId);
      if (
        arrayItem.approvalStatus?.cndName !== "Rejected" &&
        arrayItem.milestone._id === milestone && //check sum for same milestone
        arrayItem._id !== paymentId //while on edit, current amt shouldn't be summed as it is adding later
      )
        totalPayments =
          parseFloat(totalPayments) + parseFloat(arrayItem.amount);
    });

    let total = parseFloat(totalPayments) + parseFloat(amount);
    console.log(
      "ms val, curr amt, ret amt, tot, ms : ",
      milestoneValue,
      amount,
      retentionAmount,
      total,
      this.state.milestone
    );
    if (parseFloat(total) > parseFloat(milestoneValue)) {
      this.setState({ savedisabled: false });
      NotificationManager.warning(
        "Total Payments Exceeds Milestone Value",
        "Condition"
      );
      return;
    }
    ///////////////////////

    const formpojo = {};
    if (this.state.paymentId !== "new") formpojo.id = this.state.paymentId;
    else formpojo.id = null;

    formpojo.docCollection = this.state.supportingDoc;
    formpojo.fileName = this.state.fileName;

    formpojo.contract = contractId;
    formpojo.milestone = this.state.milestone;
    // formpojo.isRetention = this.state.isRetention;
    // formpojo.retentionPercentage = this.state.retentionPerc;
    formpojo.amount = this.state.amount;
    formpojo.transRefno = this.state.paymentTransRefno;
    formpojo.approvalSequence = 1;
    formpojo.approvalStatus = "5e996a81c3f4c40045d3717b"; //approval status - Initiated

    formpojo.contractName = this.props.contractName;
    formpojo.milestoneName = this.state.milestoneName;
    formpojo.paymentDate = moment(this.state.paymentDate).format("X");

    //Below code is commented as even though the record is initiated/rejected/approved, it can be modified and workflow re-initates..
    // if (this.state.approvalStatus === "5e996a81c3f4c40045d3717b") {
    //   this.setState({ savedisabled: false });
    //   NotificationManager.error(
    //     "You cannot submit again as workflow is in progress"
    //   );
    //   return;
    // } else {
    fetch(ApiEndPoints.approvalsetupList + "?approvalType=CP&sequence=1", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((response) => response.json())
      .then((res1) => {
        if (res1 && res1.success === true) {
          if (res1.result.length > 0) {
            formpojo.approvalLevel = res1.result[0].approvalLevel;
            fetch(
              ApiEndPoints.AddUpdateContract_Payment +
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
                    "Request for Payment has been sent for approval"
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
                      const nf = new Intl.NumberFormat("en-za", {
                        style: "currency",
                        currency: "ZAR",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });

                      var mailBody =
                        "Contract Name : " +
                        this.props.contractName +
                        "<br/>" +
                        "Contract Number : " +
                        this.props.contractNumber +
                        "<br/>" +
                        "You are requested to approve payment : <br/>" +
                        "<b> Milestone Name : " +
                        this.state.milestoneName +
                        // "  <br/>" +
                        // "Retention % : " +
                        // this.state.retentionPerc +
                        "  <br/>" +
                        "Amount:" +
                        nf.format(this.state.amount) +
                        "<br/>" +
                        "Remarks : " +
                        this.state.paymentTransRefno +
                        "<br/>" +
                        "Payment Date : " +
                        this.state.paymentDate +
                        " </b> <br/>";

                      mailhelpers.sendMail(
                        res1.result[0].ddl,
                        "Request for approval - Payment",
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
                        "You are requested to approve payment for: <br/>" +
                        "<b> Milestone Name : " +
                        this.state.milestoneName +
                        // "  <br/>" +
                        // "Retention % : " +
                        // this.state.retentionPerc +
                        "  <br/>" +
                        "Amount:" +
                        this.state.amount +
                        "<br/>" +
                        "Remarks : " +
                        this.state.paymentTransRefno +
                        "<br/>" +
                        "Payment Date : " +
                        this.state.paymentDate +
                        " </b> <br/>";

                      res2.result.forEach(function (user) {
                        mailhelpers.sendMail(
                          user._id,
                          "Request for approval - Payment",
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
    //}
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const {
      milestones,
      milestone,
      // isRetention,
      // retentionPerc,
      amount,
      paymentTransRefno,
      paymentDate,
      dateError
    } = this.state;
    milestones.sort(auth.sortValues("milestoneName"));

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Payment
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>
                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Payment}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Milestone *"
                              helperText=" "
                              onChange={this.milestoneChange}
                              name="milestone"
                              validators={["required"]}
                              errorMessages={["Please Select Milestone"]}
                              value={milestone}
                            >
                              {milestones.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.milestoneName}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                        
                        <div className="col-sm-12">
                          <FormGroup>
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Milestone value"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={this.state.milestoneValue}
                              // thousandSeparator=" "
                              thousandSeparator={true}
                              prefix={"R"}
                              disabled
                            />
                          </FormGroup>
                        </div>
                         
                        <div className="col-sm-12">
                          <FormGroup>
                            
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Amount *"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={amount}
                              // thousandSeparator=" "
                              thousandSeparator={true}
                              prefix={"R"}
                              onValueChange={(values) => {
                                const { value } = values;
                                // formattedValue = $2,223
                                // value ie, 2223
                                this.setState({ amount: value });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Payment Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="paymentDate"
                              type="date"
                              value={paymentDate}
                              validators={[ "checkEndDate", "checkContractDates", "required"]}
                              errorMessages={[
                                dateError,
                                "Payment Date is mandatory",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Remarks *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="paymentTransRefno"
                              value={paymentTransRefno}
                              validators={["required"]}
                              errorMessages={["Remarks are mandatory"]}
                              variant="outlined"
                              multiline
                              type="textarea"
                              size="medium"
                            />
                          </FormGroup>
                        </div>

                        <div
                          className="col-sm-12"
                          style={{ textAlign: "left" }}
                        >
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
export default ContractPayForm;
