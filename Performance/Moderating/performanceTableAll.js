import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import Button from "../../../components/CustomButtons/Button.js";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Modal from "../Confirm";

const options = {
  filterType: "multiselect",
  responsive: "scroll",
  selectableRows: false,
  message: "",
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  sort: false,
};

class PerformanceTableAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      perList: this.props.performance,
      modal: false,
      file_isOpen: false,
      message: "",
      submitType: "",
      disableflag: this.props.disabled,
    };
  }

  handleCanceltoggle = () => {
    this.setState({ modal: false, disableflag: false });

    // this.props.refreshGrid(
    //   this.props.quarter,
    //   this.props.finYear,
    //   this.props.dimensions,
    //   this.props.reviewType
    // );
  };

  handleToggle = (stype, docFlag) => {
    let message = "";
    let submitType = "draft";

    let countSelect = 0,
      countDoc = 0,
      countActual = 0,
      countRemarks = 0,
      countIntervention = 0,
      countApprovalRemarks = 0,
      countRespPerson = 0;

    console.log("this.props.performance MOD : ", this.props.performance);

    this.props.performance.forEach((item) => {
      if (item.checkedFlag === true) {
        countSelect++;
      }
      if (item.checkedFlag === true && item.hasDocuments === false) {
        countDoc++;
      }
      if (item.checkedFlag === true && item.actualPerformance == "") {
        countActual++;
      }
      if (
        item.checkedFlag === true &&
        item.remarks == "" &&
        this.props.reviewType == "self"
      ) {
        countRemarks++;
      }
      if (item.checkedFlag === true && item.intervention == "") {
        countIntervention++;
      }

      if (item.checkedFlag === true && this.props.reviewType == "approvals") {
        if (
          item.currentApprovar === "approverUser1" &&
          !item.approverUser1Remarks
        ) {
          countApprovalRemarks++;
        } else if (
          item.currentApprovar === "approverUser2" &&
          !item.approverUser2Remarks
        ) {
          countApprovalRemarks++;
        } else if (
          item.currentApprovar === "approverUser3" &&
          !item.approverUser3Remarks
        ) {
          countApprovalRemarks++;
        }
      }

      if (
        item.checkedFlag === true &&
        (item.responsibleUser == null || item.responsibleUser == "")
      ) {
        countRespPerson++;
      }
    });

    if (countSelect === 0) {
      NotificationManager.error("Indicator(s) not selected");
      return;
    }

    if (countDoc > 0) {
      NotificationManager.error(
        "Upload Documents for the selected indicator(s)"
      );
      return;
    }

    if (countActual > 0) {
      NotificationManager.error(
        "Pleaes fill actuals for the selected indicator(s)"
      );
      return;
    }
    if (countRemarks > 0) {
      NotificationManager.error(
        "Please fill challenges for the selected indicator(s)"
      );
      return;
    }
    if (countIntervention > 0) {
      NotificationManager.error(
        "Please fill intervention for the selected indicator(s)"
      );
      return;
    }

    if (countApprovalRemarks > 0) {
      NotificationManager.error(
        "Please fill remarks for the selected indicator(s)"
      );
      return;
    }
    if (countRespPerson > 0) {
      NotificationManager.error(
        "Responsible person not assigned for the selected indicator(s)"
      );
      return;
    }
    if (stype === "submit") {
      submitType = "submit";
      message = "Do you want to submit the changes in reporting";
    }

    this.setState({
      modal: !this.state.modal,
      message,
      submitType,
      disableflag: true,
    });
  };

  onModalSubmit = () => {
    this.props.OnSaveClick(this.props.performance, this.state.submitType);
    this.props.refreshGrid(
      this.props.quarter,
      this.props.finYear,
      this.props.dimensions,
      this.props.reviewType
    );
    this.setState({ modal: false, disableflag: false });
  };

  disableRecord = (value) => {
    let returnVal = false;

    if (value.status === "submit") {
      if (this.props.reviewType === "approvals") {
        if (value.currentApprovarStatus !== "pending") returnVal = true;
        else returnVal = false;
      } else returnVal = true;
    } else returnVal = false;

    return returnVal;
  };

  columns = [
    {
      name: "Select",
      field: "checkedFlag",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <form autoComplete="off">
              <Checkbox
                name="status"
                key={value._id}
                size="small"
                //disabled={this.disableRecord(value)}
                // style={{
                //   display: !this.disableRecord(value) ? "block" : "none",
                // }}
                onChange={(event) => {
                  updateValue((value.checkedFlag = event.target.checked));
                  const plist = this.props.performance;
                  for (var obj in plist) {
                    if (plist[obj]._id === value._id) {
                      this.props.performance[obj].checkedFlag =
                        value.checkedFlag;
                      break;
                    }
                  }
                }}
                label="Submit"
                variant="outlined"
                checked={value.checkedFlag || false}
              />
            </form>
          );
        },
      },
    },
    {
      name: "Indicator Title",
      title: "Indicator Title",
      field: "indicatorTitle",
      key: "indicatorTitle",
      options: {
        headerNoWrap: true,
        width: 200,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.indicatorTitle;
        },
      },
    },
    {
      name: "Annual Trgt",
      title: "Target",
      field: "annualTarget",
      key: "Target",
      options: {
        headerNoWrap: true,

        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div className="col-xs-4 text-center">{value.annualTarget}</div>
          );
        },
      },
    },
    {
      name: "Target",
      title: "Target",
      field: "target",
      key: "Target",
      options: {
        headerNoWrap: true,

        customBodyRender: (value, tableMeta, updateValue) => {
          return <div className="col-xs-4 text-center">{value.target}</div>;
        },
      },
    },
    {
      name: "Actuals",
      title: "Actual Performance",
      field: "actualPerformance",
      key: "actualPerformance",
      options: {
        headerNoWrap: true,
        width: 170,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <form autoComplete="off">
              <TextField
                name="actualPerformance"
                key={value.id}
                //id="actualPerformance"
                type="number"
                inputProps={{ min: "0", max: "1000000000", step: "1" }}
                //disabled={value.status === "submit" ? true : false}
                onChange={(event) => {
                  updateValue((value.actualPerformance = event.target.value));
                  const plist = this.props.performance;
                  for (var obj in plist) {
                    if (plist[obj]._id === value._id) {
                      this.props.performance[obj].actualPerformance =
                        value.actualPerformance;
                      break;
                    }
                  }
                }}
                value={value.actualPerformance || ""}
                label="Actual"
                variant="outlined"
              />
            </form>
          );
        },
      },
    },
    {
      name:
        this.props.reviewType == "approvals"
          ? "Remarks"
          : "Challenges/Comments",
      title: "Remarks",
      field: "remarks",
      key: "remarks",
      options: {
        headerNoWrap: true,
        width: 185,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <form noValidate autoComplete="off">
              <TextField
                name="remarks"
                // id="remarks"
                key={value.id}
                // disabled={
                //   value.status === "submit"
                //     ? this.props.reviewType === "approvals"
                //       ? value.currentApprovarStatus !== "pending"
                //         ? true
                //         : false
                //       : true
                //     : false
                // }
                onChange={(event) => {
                  updateValue((value.remarks = event.target.value));
                  const plist = this.props.performance;
                  for (var obj in plist) {
                    if (plist[obj]._id === value._id) {
                      if (this.props.reviewType == "approvals") {
                        if (
                          this.props.performance[obj].currentApprovar ===
                          "approverUser1"
                        )
                          this.props.performance[obj].approverUser1Remarks =
                            value.remarks;
                        else if (
                          this.props.performance[obj].currentApprovar ===
                          "approverUser2"
                        )
                          this.props.performance[obj].approverUser2Remarks =
                            value.remarks;
                        else if (
                          this.props.performance[obj].currentApprovar ===
                          "approverUser3"
                        )
                          this.props.performance[obj].approverUser3Remarks =
                            value.remarks;
                      } else
                        this.props.performance[obj].remarks = value.remarks;
                      break;
                    }
                  }
                }}
                value={value.remarks || ""}
                label={
                  this.props.reviewType == "approvals"
                    ? "Remarks"
                    : "Challenges/Comments"
                }
                variant="outlined"
                multiline
              />
            </form>
          );
        },
      },
    },
    {
      name: "Intervention",
      title: "Intervention",
      field: "intervention",
      key: "intervention",
      options: {
        display: this.props.reviewType === "self" ? true : false,
        headerNoWrap: true,
        width: 180,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <form noValidate autoComplete="off">
              <TextField
                name="intervention"
                key={value.id}
                //disabled={value.status === "submit" ? true : false}
                onChange={(event) => {
                  updateValue((value.intervention = event.target.value));
                  const plist = this.props.performance;
                  for (var obj in plist) {
                    if (plist[obj]._id === value._id) {
                      this.props.performance[obj].intervention =
                        value.intervention;
                      break;
                    }
                  }
                }}
                value={value.intervention || ""}
                label="Intervention"
                variant="outlined"
                multiline
              />
            </form>
          );
        },
      },
    },
    {
      name: "Responsibility",
      title: "Indicator Responsibility",
      field: "responsibleUser",
      key: "responsibleUser",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value.responsibleUser !== null &&
            value.responsibleUser.length > 0
            ? value.responsibleUser[0].firstName +
                " " +
                value.responsibleUser[0].lastName
            : "Not Assigned";
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: 80,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let folderColor = "#2196f3";
          if (!rowData.hasDocuments) folderColor = "red";
          return (
            <div style={{ textAlign: "center" }}>
              <i
                style={{
                  fontSize: "16px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Remarks"
                onClick={() => this.props.onRemarksOpen(rowData)}
                className="fa fa-comments"
              ></i>

              <i
                style={{
                  fontSize: "16px",
                  color: folderColor,
                  paddingLeft: "15px",
                  cursor: "pointer",
                }}
                title="Documents"
                onClick={() =>
                  this.props.onFileOpen(rowData.perId, this.props.performance)
                }
                className="fa fa-folder"
              ></i>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, performance } = this.props;
    let docFlag = false;
    const dList = performance.find((o) => o.hasDocuments === false);
    if (typeof dList != "undefined") {
      docFlag = true;
    }

    let approvalsStatusFlag;
    let selfStatusFlag;
    if (this.props.reviewType === "self") {
      selfStatusFlag = performance.find(
        (e) => e.status === "draft" || e.status === "Pending"
      );
    } else {
      approvalsStatusFlag = performance.find(
        (e) => e.currentApprovarStatus === "pending"
      );
    }

    return (
      <div>
        <MaterialDatatable
          striped
          title={
            loading === true ? (
              <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
            ) : (
              //"Performance Review " +
              this.props.headerText
            )
          }
          data={performance}
          columns={this.columns}
          options={options}
        />

        <div className="text-right">
          <div>
            <span>&nbsp;&nbsp;</span>
            <Button
              //disabled={this.state.disableflag}
              color="warning"
              onClick={() => this.handleToggle("submit", docFlag)}
            >
              Submit
            </Button>
          </div>

          <Modal
            name="ireview"
            modalflag={this.state.modal}
            toggle={this.handleToggle}
            // toggle={() =>
            //   this.setState({ modal: !this.state.modal })
            // }
            cancelToggle={this.handleCanceltoggle}
            onModalSubmit={this.onModalSubmit}
            modalBody={this.state.message}
            reviewType={this.props.reviewType}
          />
        </div>
      </div>
    );
  }
}

export default PerformanceTableAll;
