import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import moment from "moment";
import auth from "../../../auth";
import { ApiEndPoints } from "../../../config";

import FormFunc from "../../../components/common/formfunc";

import FormGroup from "@material-ui/core/FormGroup";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardFooter from "../../../components/Card/CardFooter.js";
import Button from "../../../components/CustomButtons/Button.js";
import NumberFormat from "react-number-format";
const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractViewForm extends FormFunc {
  state = {
    //data: { contractName: "" },
    errors: {},

    responseError: "",

    cndlist: [],
    contractName: "",
    contractNumber: "",
    projectNumber: "",
    contractType: "",
    serviceProvider: "",
    startDate: currentDate,
    endDate: currentDate,
    contractValue: "",
    contractDetail: "",
    extension: "",
    contractStatus: "",
    variationApproved: "",
    id: "new",
    newform: false,
    // penalty: false,
    remarks: "",
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getcndData();
    await this.getOneContractData();

    ValidatorForm.addValidationRule("checkEndDate", (value) => {
      if (moment(value).isBefore(this.state.startDate)) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkEndDate");
  }
  //   handleCheck = (event) => {
  //     this.setState({ penalty: event.target.checked });
  //   };
  handleChange = (event) => {
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

  getOneContractData() {
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

          this.setState({
            //data: datax,
            contractName: data.result[0].contractName,
            // penalty: data.result[0].penalty,
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
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const { cndlist } = this.state;

    let contractStatus = cndlist
      ? cndlist.filter((data) => data.cndGroup === "ContractStatus")
      : [];

    let contractType = cndlist
      ? cndlist.filter((data) => data.cndGroup === "ContractType")
      : [];

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Contract Details
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
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Contract Name"
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
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Contract Number"
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
                              label="Contract Type"
                              helperText=" "
                              onChange={this.handleChange}
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
                              label="Project Number"
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
                      <div className="form-group row">
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
                              label="Contract Value"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={this.state.contractValue}
                              thousandSeparator={true}
                              prefix={"R"}
                              onValueChange={(values) => {
                                const { value } = values;
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
                              label="Start Date"
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
                              label="End Date"
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
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Service Provider"
                              helperText=" "
                              onChange={this.handleChange}
                              name="serviceProvider"
                              value={this.state.serviceProvider}
                              validators={["required"]}
                              errorMessages={["Service Provider is mandatory"]}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Variation Approved %"
                              helperText=" "
                              onChange={this.handleChange}
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

                      <div className="form-group row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Contract Status"
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
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="form-group row">
                        {/* <div className="col-sm-4">
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
                              label="Penalty"
                            />
                          </FormGroup>
                        </div> */}
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
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          color="warning"
                          onClick={this.handleCancel.bind(this)}
                        >
                          Back
                        </Button>
                      </div>

                      {/*</form>*/}
                    </div>
                  </div>
                </ValidatorForm>
              </GridContainer>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
export default ContractViewForm;
