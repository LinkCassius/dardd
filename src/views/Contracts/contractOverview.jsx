import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  SelectValidator,
  TextValidator,
} from "react-material-ui-form-validator";
import moment from "moment";
import NumberFormat from "react-number-format";
import { ApiEndPoints } from "../../config";
import FormFunc from "../../components/common/formfunc";
import Can from "../../components/common/Auth/Can";
import auth from "../../auth";
import mailhelpers from "../../helpers/mailHelper";
import { Table } from "reactstrap";

class ContractOverview extends FormFunc {
  constructor(props) {
    super(props);
    this.state = {
      cndContractStatuslist: [],
      mailList: [],
      contractStatusX: props.contractStatus,
      startDate_Extension: props.startDate_Extension,
      endDate_Extension: props.endDate_Extension,

      contractStatus_ApprValue: props.contractStatus_ApprValue,
      contractStatus_LastUpdated: props.contractStatus_LastUpdated,
      contractStatus_ApprStatus: props.contractStatus_ApprStatus,
      contractStatus_ApprSequence: props.contractStatus_ApprSequence,
      endDate_ApprValue: props.endDate_ApprValue,
      endDate_LastUpdated: props.endDate_LastUpdated,
      endDate_ApprStatus: props.endDate_ApprStatus,
      endDate_ApprSequence: props.endDate_ApprSequence,

      contractStatusTxtMail: "",
      savedisabled_status: false,
      savedisabled_enddate: false,
    };
  }
  async componentDidMount() {
    await this.getCnDContractStatusList();

    ValidatorForm.addValidationRule("checkEndDate", (value) => {
      if (moment(value).isBefore(this.props.startDate_Extension)) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkEndDate");
  }

  componentWillReceiveProps(props) {
    this.setState({
      contractStatusX: props.contractStatus,
      startDate_Extension: props.startDate_Extension,
      endDate_Extension: props.endDate_Extension,

      contractStatus_ApprValue: props.contractStatus_ApprValue,
      contractStatus_LastUpdated: props.contractStatus_LastUpdated,
      contractStatus_ApprStatus: props.contractStatus_ApprStatus,
      contractStatus_ApprSequence: props.contractStatus_ApprSequence,
      endDate_ApprValue: props.endDate_ApprValue,
      endDate_LastUpdated: props.endDate_LastUpdated,
      endDate_ApprStatus: props.endDate_ApprStatus,
      endDate_ApprSequence: props.endDate_ApprSequence,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  statusChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.setState({ contractStatusTxtMail: event.nativeEvent.target.text });
  };

  getCnDContractStatusList() {
    fetch(ApiEndPoints.cndList + "?cndGroup=ContractStatus", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndContractStatuslist: data.result, loading: false });
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

  handleSubmit_StatusUpdate = (event) => {
    event.preventDefault();

    if (this.state.savedisabled_status) {
      return;
    }
    this.setState({ savedisabled_status: true });

    var contractId = this.props.contractId;

    const pojo = {};
    pojo.contractName = this.props.contractName;
    pojo.contractStatus_ApprValue = this.state.contractStatus_ApprValue;
    pojo.contractStatus_ApprStatus = "5e996a81c3f4c40045d3717b"; //approval status - Initiated
    pojo.id = contractId;
    pojo.contractStatus_ApprSequence = 1;
    pojo.fromStatus = this.props.contractStatusName;
    pojo.toStatus = this.state.contractStatusTxtMail;

    if (this.props.contractStatus_ApprValue !== "") {
      this.setState({ savedisabled_status: false });
      NotificationManager.error(
        "You cannot submit again as workflow is in progress"
      );
      return;
    } else {
      if (
        this.state.contractStatusTxtMail === this.props.contractStatusName ||
        this.state.contractStatus_ApprValue === ""
      ) {
        this.setState({ savedisabled_status: false });
        NotificationManager.warning(
          "Please check, cannot submit with the existing contract-status"
        );
        return;
      } else {
        //const requestOptions = { method: "get" };

        fetch(ApiEndPoints.approvalsetupList + "?approvalType=CS&sequence=1", {
          method: "GET",
          headers: { "x-auth-token": auth.getJwt() },
        })
          .then((response) => response.json())
          .then((res1) => {
            if (res1 && res1.success === true) {
              if (res1.result.length > 0) {
                //update contract collection
                pojo.approvalLevel = res1.result[0].approvalLevel;
                fetch(
                  ApiEndPoints.AddUpdateContract +
                    "?userid=" +
                    auth.getCurrentUser()._id,
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "x-auth-token": auth.getJwt(),
                    },
                    body: JSON.stringify(pojo),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    if (data && data.success === true) {
                      NotificationManager.success(
                        "Request for Contract-Status change has been sent for approval"
                      );
                      this.props.updateList();
                      this.setState({ savedisabled_status: false });
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
                            "Contract Name:" +
                            this.props.contractName +
                            "<br/>" +
                            "Contract Number:" +
                            this.props.contractNumber +
                            "<br/>" +
                            "You are requested to approve contract-status change from : <br/><b>" +
                            this.props.contractStatusName +
                            " </b>" +
                            "to " +
                            "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                            this.state.contractStatusTxtMail +
                            "</span><br/>";

                          mailhelpers.sendMail(
                            res1.result[0].ddl,
                            "Request for approval - Contract-Status",
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
                            "Contract Name:" +
                            this.props.contractName +
                            "<br/>" +
                            "Contract Number:" +
                            this.props.contractNumber +
                            "<br/>" +
                            "You are requested to approve contract-status change from : <br/><b>" +
                            this.props.contractStatusName +
                            " </b>" +
                            "to " +
                            "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                            this.state.contractStatusTxtMail +
                            "</span><br/>";

                          res2.result.forEach(function (user) {
                            mailhelpers.sendMail(
                              user._id,
                              "Request for approval - Contract-Status",
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
                this.setState({ savedisabled_status: false });
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
      }
    }
  };

  handleSubmit_ExtensionUpdate = (event) => {
    event.preventDefault();

    if (this.state.savedisabled_enddate) {
      return;
    }
    this.setState({ savedisabled_enddate: true });

    var contractId = this.props.contractId;

    const pojo = {};
    pojo.contractName = this.props.contractName;
    pojo.endDate_ApprValue = moment(this.state.endDate_ApprValue).format("X");
    pojo.endDate_ApprStatus = "5e996a81c3f4c40045d3717b"; //approval status - Initiated
    pojo.id = contractId;
    pojo.endDate_ApprSequence = 1;
    pojo.fromEndDate = this.props.endDate;
    pojo.toEndDate = moment(this.state.endDate_ApprValue).format("DD/MM/YYYY");

    if (this.props.endDate_ApprValue !== "") {
      this.setState({ savedisabled_enddate: false });
      NotificationManager.error(
        "You cannot submit again as workflow is in progress"
      );
      return;
    } else {
      if (
        this.state.endDate_ApprValue === this.props.endDate_Extension ||
        this.state.endDate_ApprValue == ""
      ) {
        this.setState({ savedisabled_enddate: false });
        NotificationManager.warning(
          "Please check, cannot submit with the existing contract End-Date"
        );
        return;
      } else {
        const requestOptions = { method: "get" };

        fetch(ApiEndPoints.approvalsetupList + "?approvalType=CE&sequence=1", {
          method: "GET",
          headers: { "x-auth-token": auth.getJwt() },
        })
          .then((response) => response.json())
          .then((res1) => {
            if (res1 && res1.success === true) {
              if (res1.result.length > 0) {
                //update contract collection
                pojo.approvalLevel = res1.result[0].approvalLevel;
                fetch(
                  ApiEndPoints.AddUpdateContract +
                    "?userid=" +
                    auth.getCurrentUser()._id,
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "x-auth-token": auth.getJwt(),
                    },
                    body: JSON.stringify(pojo),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    if (data && data.success === true) {
                      NotificationManager.success(
                        "Request for Contract-Extension has been sent for approval"
                      );
                      this.props.updateList();
                      this.setState({ savedisabled_enddate: false });
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
                            "Contract Name:" +
                            this.props.contractName +
                            "<br/>" +
                            "Contract Number:" +
                            this.props.contractNumber +
                            "<br/>" +
                            "You are requested to approve contract-extension from : <br/><b>" +
                            this.props.endDate +
                            " </b>" +
                            "to " +
                            "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                            moment(this.state.endDate_ApprValue).format(
                              "DD/MM/YYYY"
                            ) +
                            "</span><br/>";

                          mailhelpers.sendMail(
                            res1.result[0].ddl,
                            "Request for approval - Contract Extension",
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
                            "Contract Name:" +
                            this.props.contractName +
                            "<br/>" +
                            "Contract Number:" +
                            this.props.contractNumber +
                            "<br/>" +
                            "You are requested to approve contract-extension from : <br/><b>" +
                            this.props.endDate +
                            " </b>" +
                            "to " +
                            "<span style='font-family: Trebuchet MS;font-size:14px; color:red'>" +
                            moment(this.state.endDate_ApprValue).format(
                              "DD/MM/YYYY"
                            ) +
                            "</span><br/>";

                          res2.result.forEach(function (user) {
                            mailhelpers.sendMail(
                              user._id,
                              "Request for approval - Contract Extension",
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
                this.setState({ savedisabled_enddate: false });
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
      }
    }
  };

  render() {
    const {
      cndContractStatuslist,
      contractStatusX,
      contractStatus_ApprValue,
      contractStatus_LastUpdated,
      contractStatus_ApprStatus,
      contractStatus_ApprSequence,
      endDate_Extension,
      endDate_ApprValue,
      endDate_LastUpdated,
      endDate_ApprStatus,
      endDate_ApprSequence,
    } = this.state;
    cndContractStatuslist.sort(auth.sortValues("cndName"));

    const {
      contractNumber,
      projectNumber,
      serviceProvider,
      startDate,
      endDate,
      contractValue,
      contractType,
      variationApproved,
      contractStatusName,
    } = this.props;

    return (
      <ValidatorForm
        ref="form"
        instantValidate
        onError={(errors) => console.log(errors)}
        onSubmit={this.handleSubmit_StatusUpdate}
      >
        <div
          className="row"
          style={{
            textAlign: "center",
            paddingLeft: "10px",
            paddingTop: "10px",
            border: "2px solid #1a7104",
            borderRadius: "8px",
            margin: "1px",
            borderStyle: "inset",
          }}
        >
          {/* <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Contract Name : </strong> {contractName}
            </p>
          </div> */}
          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Contract No : </strong> {contractNumber}
            </p>
          </div>
          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Project No : </strong> {projectNumber}
            </p>
          </div>

          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Start Date : </strong> {startDate}
            </p>
          </div>
          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>End Date : </strong> {endDate}
            </p>
          </div>

          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Contract Value : </strong>
              {
                <NumberFormat
                  value={contractValue}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"R"}
                  decimalScale={2}
                  renderText={(value) => (
                    <span>
                      {value.includes(".") === true ? value : value + ".00"}
                    </span>
                  )}
                />
              }
            </p>
          </div>
          <div
            className="col-sm-4 custom-MuiSelect"
            style={{ textAlign: "left" }}
          >
            <p>
              <strong>Contract Type : </strong> {contractType}
            </p>
          </div>
          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Variation Approved % : </strong>
              {variationApproved}
            </p>
          </div>
          <div
            className="col-sm-4 custom-MuiSelect"
            style={{ textAlign: "left" }}
          >
            <p>
              <strong> Contract Status : </strong> {contractStatusName}
            </p>
          </div>
          <div className="col-sm-4" style={{ textAlign: "left" }}>
            <p>
              <strong>Service Provider : </strong>
              {serviceProvider}
            </p>
          </div>
        </div>
        <hr />
        <h5>Contract Approvals</h5>
        <Table responsive>
          <thead className="MuiTableHead-root MuiTableCell-head">
            <tr>
              <th>Sno.</th>
              <th>Transaction</th>
              <th>Requested Value</th>
              <th>Last Updated Date</th>
              <th>Action</th>
              <th>Approval Status</th>
              <th>Approval Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Contract Status</td>
              <td>
                <SelectValidator
                  style={{
                    width: "240px",
                    fontSize: "10",
                  }}
                  variant="outlined"
                  //  label="Status *"
                  // helperText=" "
                  onChange={this.statusChange}
                  name="contractStatus_ApprValue"
                  validators={["required"]}
                  errorMessages={["Please Select Contract Status"]}
                  value={
                    contractStatus_ApprValue
                      ? contractStatus_ApprValue
                      : contractStatusX
                  }
                >
                  {cndContractStatuslist.map((value, index) => {
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
              </td>
              <td>
                {contractStatus_LastUpdated === "NA"
                  ? "NA"
                  : moment(contractStatus_LastUpdated).format("DD/MM/YYYY")}
              </td>
              <td>
                <Can
                  perform="Contract Add Access"
                  yes={() => (
                    <button
                      className="btn btn-success"
                      type="submit"
                      disabled={this.state.savedisabled_status}
                    >
                      {this.state.savedisabled_status
                        ? "Please wait..."
                        : "Send For Approval"}
                    </button>
                  )}
                />
              </td>
              <td>{contractStatus_ApprStatus}</td>
              <td>{contractStatus_ApprSequence}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Contract Extension</td>
              <td>
                <TextValidator
                  style={{
                    width: "240px",
                    fontSize: "10",
                  }}
                  variant="outlined"
                  label="End Date"
                  // helperText=" "
                  onChange={this.handleChange}
                  name="endDate_ApprValue"
                  type="date"
                  value={
                    endDate_ApprValue ? endDate_ApprValue : endDate_Extension
                  }
                  validators={["checkEndDate", "required"]}
                  errorMessages={[
                    "End Date should be greater than Start Date",
                    "End Date is mandatory",
                  ]}
                />
              </td>
              <td>
                {endDate_LastUpdated === "NA"
                  ? "NA"
                  : moment(endDate_LastUpdated).format("DD/MM/YYYY")}
              </td>
              <td>
                <Can
                  perform="Contract Add Access"
                  yes={() => (
                    <button
                      className="btn btn-success"
                      onClick={this.handleSubmit_ExtensionUpdate}
                      disabled={this.state.savedisabled_enddate}
                    >
                      {this.state.savedisabled_enddate
                        ? "Please wait..."
                        : "Send For Approval"}
                    </button>
                  )}
                />
              </td>
              <td>{endDate_ApprStatus}</td>
              <td>{endDate_ApprSequence}</td>
            </tr>
          </tbody>
        </Table>
      </ValidatorForm>
    );
  }
}
export default ContractOverview;
