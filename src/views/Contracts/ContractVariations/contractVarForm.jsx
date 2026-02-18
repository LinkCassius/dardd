import React from "react";
import { NotificationManager } from "react-notifications";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import NumberFormat from "react-number-format";
import GridItem from "./../../../components/Grid/GridItem.js";
import GridContainer from "./../../../components/Grid/GridContainer.js";
import Card from "./../../../components/Card/Card.js";
import CardHeader from "./../../../components/Card/CardHeader.js";
import CardBody from "./../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import { ApiEndPoints, siteConfig, fileTypes } from "../../../config";
import auth from "../../../auth";
import FormFunc from "./../../../components/common/formfunc";
import mailhelpers from "../../../helpers/mailHelper";

class ContractVarForm extends FormFunc {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.removefile = this.removefile.bind(this);
  }
  state = {
    variationId: "new",
    subject: "",
    // unit: "",
    // rate: "",
    variationAmount: "",

    variationApprStatus: "",

    newform: false,

    docCollection: "",
    file: null,
    supportingDoc: null,
    uploading: false,
    fileName: "",
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getVariationById();
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
  getVariationById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.variationById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            variationId: data.result._id,
            subject: data.result.subject,
            // unit: data.result.unit,
            // rate: data.result.rate,
            variationAmount: data.result.amount,

            variationApprStatus: data.result.approvalStatus,

            contractName: data.result.contract.contractName,
            contractNumber: data.result.contract.contractNumber,

            supportingDoc: data.docCollection,
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

  handleSubmit_Variation = (event) => {
    event.preventDefault();

    if (this.state.variationAmount === "") {
      this.setState({ savedisabled: false });
      NotificationManager.warning("Please enter amount.");
      return;
    }

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    var contractId = this.props.contractId;

    const { subject, variationAmount } = this.state;

    let variationApprovedAmount =
      (this.props.contractValue * this.props.variationApproved) / 100;

    let totalVariationAmount = 0;
    this.props.variations.forEach(function (arrayItem) {
      totalVariationAmount =
        parseInt(totalVariationAmount) + parseInt(arrayItem.amount);
    });

    let total = parseInt(totalVariationAmount) + parseInt(variationAmount);

    if (parseInt(total) > parseInt(variationApprovedAmount)) {
      this.setState({ savedisabled: false });
      NotificationManager.warning(
        "Total Variations Amount Exceeds Approved %",
        "Condition"
      );
      return;
    }
    const formpojo = {};
    if (this.state.variationId !== "new") formpojo.id = this.state.variationId;
    else formpojo.id = null;

    formpojo.docCollection = this.state.supportingDoc;
    formpojo.fileName = this.state.fileName;

    formpojo.contract = contractId;
    formpojo.subject = subject;
    // formpojo.unit = unit;
    // formpojo.rate = rate;
    formpojo.amount = variationAmount;
    formpojo.approvalSequence = 1;
    formpojo.approvalStatus = "5e996a81c3f4c40045d3717b"; //approval status - Initiated
    formpojo.contractName = this.props.contractName;

    //Below code is commented as even though the record is initiated/rejected/approved, it can be modified and workflow re-initates..
    // if (this.state.variationApprStatus === "5e996a81c3f4c40045d3717b") {
    //   this.setState({ savedisabled: false });
    //   NotificationManager.error(
    //     "You cannot submit again as workflow is in progress",
    //     "Condition"
    //   );
    //   return;
    // } else {
    //   const requestOptions = { method: "get" };

    console.log("formpojo CV : ", formpojo);

    fetch(ApiEndPoints.approvalsetupList + "?approvalType=CV&sequence=1", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((response) => response.json())
      .then((res1) => {
        if (res1 && res1.success === true) {
          if (res1.result.length > 0) {
            //insert variation collection
            formpojo.approvalLevel = res1.result[0].approvalLevel;
            fetch(
              ApiEndPoints.AddUpdateContract_Variation +
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
                    "Request for Contract-Variation has been sent for approval"
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
                } else if (
                  data &&
                  data.success === false &&
                  data.responseCode === 444
                ) {
                  NotificationManager.error(data.msg);
                  this.setState({ savedisabled: false });
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
                        "You are requested to approve contract-variation : <br/>" +
                        "<b> Subject : " +
                        subject +
                        // "  <br/>" +
                        // "Units : " +
                        // unit +
                        // "  <br/>" +
                        // "Rate : " +
                        // rate +
                        "<br/>" +
                        "Amount : " +
                        variationAmount +
                        " </b> <br/>";

                      mailhelpers.sendMail(
                        res1.result[0].ddl,
                        "Request for approval - Contract Variation",
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
                        "You are requested to approve contract-variation : <br/>" +
                        "<b> Subject : " +
                        subject +
                        // "  <br/>" +
                        // "Units : " +
                        // unit +
                        // "  <br/>" +
                        // "Rate : " +
                        // rate +
                        "<br/>" +
                        "Amount : " +
                        variationAmount +
                        " </b> <br/>";

                      res2.result.forEach(function (user) {
                        mailhelpers.sendMail(
                          user._id,
                          "Request for approval - Contract Variation",
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

  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Variation
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Variation}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Subject *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="subject"
                              value={this.state.subject}
                              validators={["required"]}
                              errorMessages={["Subject is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>

                        {/* <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Unit *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="unit"
                              value={this.state.unit}
                              validators={["required", "isNumber"]}
                              errorMessages={[
                                "Unit is mandatory",
                                "It should be numeric",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Rate *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="rate"
                              value={this.state.rate}
                              validators={["required", "isNumber"]}
                              errorMessages={[
                                "Rate is mandatory",
                                "It should be numeric",
                              ]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div> */}
                        <div className="col-sm-12">
                          <FormGroup>
                            {/* <TextValidator
                            label="Amount *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="variationAmount"
                            value={this.state.variationAmount}
                            validators={["required", "isNumber"]}
                            errorMessages={[
                              "Amount is mandatory",
                              "It should be numeric",
                            ]}
                            variant="outlined"
                          /> */}
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Amount *"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={this.state.variationAmount}
                              thousandSeparator={true}
                              prefix={"R"}
                              onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                // formattedValue = $2,223
                                // value ie, 2223
                                this.setState({ variationAmount: value });
                              }}
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
export default ContractVarForm;
