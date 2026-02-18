import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import moment from "moment";
import NumberFormat from "react-number-format";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import auth from "../../auth";
import { ApiEndPoints } from "../../config";
import FormFunc from "../../components/common/formfunc";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import AutoCompleteDDL from "../../components/common/AutoCompleteDDL";
const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractForm extends FormFunc {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      responseError: "",
      cndlist: [],
      spList: [],
      contractName: "",
      contractNumber: "",
      projectNumber: "",
      contractType: "",
      serviceProvider: "",
      serviceProviderId: "",
      startDate: currentDate,
      endDate: currentDate,
      contractValue: "",
      contractDetail: "",
      extension: "",
      contractStatus: "",
      variationApproved: "",
      id: "new",
      newform: false,
      //penalty: false,
      remarks: "",
      savedisabled: false,

      contractTypeText: "",
      isRetentionApplicable: false,
      selectedText: "", //service provider
    };
    this.onAutoCompleteChange = this.onAutoCompleteChange.bind(this);
  }

  helpFunction(event) {
    if (event.keyCode === 112) {
      //Do whatever when F1 is pressed
      event.preventDefault();
      console.log("help");
    }
  }
  async componentDidMount() {
    await Promise.all([this.getcndData(), this.getSPList()]);
    await this.getOneContractData();

    ValidatorForm.addValidationRule("checkEndDate", (value) => {
      if (moment(value).isBefore(this.state.startDate)) {
        return false;
      }
      return true;
    });

    document.addEventListener("keydown", this.helpFunction, false);
    this.handleScrollPosition();
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkEndDate");

    document.removeEventListener("keydown", this.helpFunction, false);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  ddlChange = (event) => {
    if (event.target.name == "contractType")
      this.setState({ contractTypeText: event.nativeEvent.target.text });
    if (event.target.name == "serviceProviderId")
      this.setState({ serviceProvider: event.nativeEvent.target.text });

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  variationApprovedChange = (event) => {
    let { value } = event.target;

    if (this.state.contractTypeText === "Infrastructure") {
      if (value > 20) {
        NotificationManager.error(
          "Variation should not be greater than 20 %",
          "Condition"
        );
        return;
      }
    } else if (this.state.contractTypeText === "Goods and Services") {
      if (value > 15) {
        NotificationManager.error(
          "Variation should not be greater than 15 %",
          "Condition"
        );
        return;
      }
    }

    if (value <= 100 && value >= 0) {
      // % should be in between 1 - 100
      this.setState({ variationApproved: value });
    } else return;
  };

  getcndData() {
    //get Cnd
    fetch(ApiEndPoints.cndList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndlist: data.result });
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
  getSPList() {
    //get service providers
    fetch(ApiEndPoints.serviceproviderslist, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ spList: data.result });
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

  getOneContractData() {
    this.setState({ scrollPosition: window.pageYOffset });
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.contractList + "?contractId=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          // const datax = { ...this.state.data };
          // datax["contractName"] = data.result[0].contractName;
          console.log("edit contract : ", data.result);
          this.setState({
            //data: datax,
            contractName: data.result[0].contractName,
            //penalty: data.result[0].penalty,
            remarks: data.result[0].remarks,
            contractNumber: data.result[0].contractNumber,
            projectNumber: data.result[0].projectNumber,
            serviceProvider: data.result[0].serviceProvider,
            startDate: moment(data.result[0].startDate * 1000).format(
              "YYYY-MM-DD"
            ),
            endDate: moment(data.result[0].endDate * 1000).format("YYYY-MM-DD"),
            contractValue: data.result[0].contractValue,
            contractType: data.result[0].contractType._id,
            variationApproved: data.result[0].variationApproved,
            extension: data.result[0].extension,
            contractStatus: data.result[0].contractStatus._id,
            contractDetail: data.result[0].contractDetail,
            id: data.result[0]._id,
            isRetentionApplicable: data.result[0].isRetentionApplicable,
            selectedText: data.result[0].serviceProviderId,
            serviceProviderId: data.result[0].serviceProviderId?._id,
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

    ///////Check Variation Amount *Start*///////
    const { contractTypeText, variationApproved, contractValue } = this.state;

    let variationAmount = contractValue * (variationApproved / 100);

    if (contractTypeText === "Infrastructure") {
      //20% or R 20 Million whichever is lower
      if (variationAmount > 20000000) {
        NotificationManager.error(
          "Variation % amount is greater than R20,000,000",
          "Condition"
        );
        return;
      }
    } else if (this.state.contractTypeText === "Goods and Services") {
      //15% or R 15 Million whichever is lower
      if (variationAmount > 15000000) {
        NotificationManager.error(
          "Variation % amount is greater than R15,000,000",
          "Condition"
        );
        return;
      }
    }
    ///////Check Variation Amount *End*//////

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;
    //console.log("contract value : ", formpojo.contractValue);
    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;
    //formpojo.contractName = this.state.data.contractName;
    formpojo.startDate = moment(this.state.startDate).format("X");
    formpojo.endDate = moment(this.state.endDate).format("X");
    formpojo.isRetentionApplicable = this.state.isRetentionApplicable;
    formpojo.serviceProviderId = this.state.selectedText._id;
    formpojo.serviceProvider = this.state.selectedText.serviceProviderFirmName;

    fetch(
      ApiEndPoints.AddUpdateContract + "?userid=" + auth.getCurrentUser()._id,
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
          this.handleScrollPosition();
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

  handleCheck = (event) => {
    this.setState({ isRetentionApplicable: event.target.checked });
  };
  onAutoCompleteChange = (value) => {
    this.setState({
      selectedText: value,
    });
  };
  // handle scroll position after content load
  handleScrollPosition = () => {
    const scrollPosition = this.state.scrollPosition;
    console.log("scrollPosition : ", scrollPosition);
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition));
      sessionStorage.removeItem("scrollPosition");
    }
  };
  render() {
    const { cndlist, spList, selectedText } = this.state;

    let contractStatus = cndlist
      ? cndlist.filter((data) => data.cndGroup === "ContractStatus")
      : [];

    let contractType = cndlist
      ? cndlist.filter((data) => data.cndGroup === "ContractType")
      : [];
    contractType.sort(auth.sortValues("cndName"));
    contractStatus.sort(auth.sortValues("cndName"));
    //spList.sort(auth.sortValues("serviceProviderFirmName"));
    const optionsX = spList.map((option) => {
      const firstLetter = option.serviceProviderFirmName[0].toUpperCase();
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
                Add/Update Contract
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
                  style={{
                    width: "100%",
                    paddingBottom: "-15px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Contract Name *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="contractName"
                              value={this.state.contractName}
                              validators={["required"]}
                              errorMessages={["Contract Name is mandatory"]}
                            />
                          </FormGroup>
                          {/* 
                          {this.renderInput(
                            "contractName",
                            "Contract Name",
                            "text",
                            " ",
                            "required",
                            "outlined",
                            "Contract Name is mandatory"
                          )} */}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Contract Number *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="contractNumber"
                              value={this.state.contractNumber}
                              validators={["required"]}
                              errorMessages={["Contract Number is mandatory"]}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Contract Type *"
                              helperText=" "
                              onChange={this.ddlChange}
                              name="contractType"
                              validators={["required"]}
                              errorMessages={["Please Select Contract Type"]}
                              value={this.state.contractType}
                            >
                              {contractType.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.cndName}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Project Number *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="projectNumber"
                              value={this.state.projectNumber}
                              validators={["required"]}
                              errorMessages={["Project Number is mandatory"]}
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <FormGroup>
                            {/* <TextValidator
                            variant="outlined"
                            label="Contract Value"
                            helperText="Required (In ZAR) *"
                            onChange={this.handleChange}
                            name="contractValue"
                            value={this.state.contractValue}
                            validators={["required", "isNumber"]}
                            errorMessages={[
                              "Contract Value is mandatory",
                              "It Should be numeric",
                            ]}
                          /> */}
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Contract Value *"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={this.state.contractValue}
                              thousandSeparator={true}
                              prefix={"R"}
                              onValueChange={(values) => {
                                const { formattedValue, value } = values;
                                // formattedValue = $2,223
                                // value ie, 2223
                                this.setState({ contractValue: value });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Start Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              //defaultValue={currentDate}
                              //defaultValue={new Date()}
                              name="startDate"
                              type="date"
                              value={this.state.startDate}
                              validators={["required"]}
                              errorMessages={["Start Date is mandatory"]}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="End Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              //defaultValue={currentDate}
                              //defaultValue={new Date()}
                              name="endDate"
                              type="date"
                              value={this.state.endDate}
                              validators={["checkEndDate", "required"]}
                              errorMessages={[
                                "End Date should be greater than Start Date",
                                "End Date is mandatory",
                              ]}
                              disabled={this.state.id !== "new" ? true : false}
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="row">
                        {/* <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Service Provider *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="serviceProvider"
                              value={this.state.serviceProvider}
                              validators={["required"]}
                              errorMessages={["Service Provider is mandatory"]}
                            />
                          </FormGroup>
                        </div> */}
                        <div className="col-sm-4">
                          <FormGroup>
                            <AutoCompleteDDL
                              id="serviceProviderId"
                              name="serviceProviderId"
                              onAutoCompleteChange={this.onAutoCompleteChange}
                              selectedText={selectedText}
                              options={optionsX.sort(
                                (a, b) =>
                                  -b.firstLetter.localeCompare(a.firstLetter)
                              )}
                              groupBy={(option) => option.firstLetter}
                              getOptionLabel={(option) =>
                                option && option.serviceProviderFirmName
                              }
                              getOptionSelected={(option, value) =>
                                value._id === option._id
                              }
                              validators={["required"]}
                              errorMessages={["Please Select Service Provider"]}
                              label="Service Provider *"
                              placeholder="Please Select Service Provider"
                            />
                            {/* <SelectValidator
                              variant="outlined"
                              label="Service Provider *"
                              helperText=" "
                              onChange={this.ddlChange}
                              name="serviceProviderId"
                              validators={["required"]}
                              errorMessages={["Please Select Service Provider"]}
                              value={this.state.serviceProviderId}
                            >
                              {spList.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.serviceProviderFirmName}
                                  </option>
                                );
                              })}
                            </SelectValidator> */}
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Variation Approved %"
                              helperText=" "
                              onChange={this.variationApprovedChange}
                              name="variationApproved"
                              value={this.state.variationApproved}
                              validators={["isNumber"]}
                              errorMessages={["It should be Numeric"]}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Extension"
                              helperText=" "
                              onChange={this.handleChange}
                              name="extension"
                              value={this.state.extension}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Contract Status *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="contractStatus"
                              validators={["required"]}
                              errorMessages={["Please Select Contract Status"]}
                              value={this.state.contractStatus}
                              disabled={this.state.id !== "new" ? true : false}
                            >
                              {contractStatus.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.cndName}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                        <div className="col-sm-8">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Contract Description"
                              onChange={this.handleChange}
                              name="contractDetail"
                              size="medium"
                              type="textarea"
                              value={this.state.contractDetail}
                              helperText=" "
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-4">
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.isRetentionApplicable}
                                  onChange={this.handleCheck}
                                  name="isRetentionApplicable"
                                  color="primary"
                                />
                              }
                              label="Is Retention Applicable"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Remarks"
                              onChange={this.handleChange}
                              name="remarks"
                              size="medium"
                              type="textarea"
                              value={this.state.remarks}
                              helperText=" "
                              multiline
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
export default ContractForm;
