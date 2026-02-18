import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import NumberFormat from "react-number-format";
import { NotificationManager } from "react-notifications";
import { ApiEndPoints } from "../../../config";
import auth from "../../../auth";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import CardFooter from "../../../components/Card/CardFooter.js";

class ContractMileTable extends Component {
  state = { milestones: [] };

  async componentDidMount() {
    await this.getMilestonesList();
  }

  getMilestonesList() {
    fetch(ApiEndPoints.contract_Milestone_List + "/" + this.props.contractId, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            milestones: data.result,
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

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  milestoneColumns = [
    {
      name: "Milestone Name",
      title: "Milestone Name",
      field: "milestoneName",
      options: {
        headerNoWrap: true,

        customBodyRender: (value, tableMeta, updateValue) => {
          let fontColor =
            value.milestoneName == "Totals" ? { color: "blue" } : { color: "" };

          return <span style={fontColor}>{value.milestoneName}</span>;
        },
      },
    },
    // {
    //   name: "Details",
    //   title: "Milestone Details",
    //   field: "milestoneDetails",
    //   options: {
    //     headerNoWrap: true,
    //   },
    // },
    {
      name: "Start Date",
      title: "Start Date",
      field: "startDate",
      key: "startDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value.startDate &&
            `${new Date(value.startDate * 1000).toLocaleDateString("en-GB")}`
          );
        },
      },
    },
    {
      name: "End Date",
      title: "End Date",
      field: "endDate",
      key: "endDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value.endDate &&
            `${new Date(value.endDate * 1000).toLocaleDateString("en-GB")}`
          );
        },
      },
    },
    {
      name: "Milestone Value",
      title: "Milestone Value",
      field: "milestoneValue",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          let fontColor =
            value.milestoneName == "Totals" ? { color: "blue" } : { color: "" };

          return (
            <NumberFormat
              value={value.milestoneValue}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"R"}
              decimalScale={2}
              renderText={(value) => (
                <span style={fontColor}>
                  {value.includes(".") === true ? value : value + ".00"}
                </span>
              )}
            />
          );
        },
      },
    },
    {
      name: "Retention %",
      title: "Retention %",
      field: "retentionPercentage",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Retention Amount",
      title: "Retention Amount",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          let fontColor =
            value.milestoneName == "Totals" ? { color: "blue" } : { color: "" };
          return (
            <NumberFormat
              //value={(value.milestoneValue * value.retentionPercentage) / 100}
              value={value.retentionAmount}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"R"}
              decimalScale={2}
              renderText={(value) => (
                <span style={fontColor}>
                  {value.includes(".") === true ? value : value + ".00"}
                </span>
              )}
            />
          );
        },
      },
    },
    {
      name: "Value Before Retention",
      title: "Milestone Value Before Retention",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          let fontColor =
            value.milestoneName == "Totals" ? { color: "blue" } : { color: "" };
          return (
            <NumberFormat
              // value={
              //   !value.isRetentionMilestone
              //     ? value.milestoneValue +
              //       (value.milestoneValue * value.retentionPercentage) / 100
              //     : 0
              // }
              value={value.valueBeforeRetention}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"R"}
              decimalScale={2}
              renderText={(value) => (
                <span style={fontColor}>
                  {value.includes(".") === true ? value : value + ".00"}
                </span>
              )}
            />
          );
        },
      },
    },
    {
      name: "Person Responsible",
      title: "Person Responsible",
      field: "personResponsible",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value.personResponsible &&
            value.personResponsible?.firstName +
              " " +
              value.personResponsible?.lastName
          );
        },
      },
    },
    // {
    //   name: "Approver",
    //   title: "Approver",
    //   field: "approver",
    //   options: {
    //     headerNoWrap: true,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return value.approver.firstName + " " + value.approver.lastName;
    //     },
    //   },
    // },
    {
      name: "Approval Status",
      title: "Approval Status",

      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let clr = "";
          let sts = "";
          if (rowData.approvalStatus && rowData.approvalStatus !== null) {
            clr =
              rowData.approvalStatus.cndName === "Approved" ? "green" : "red";
            sts = rowData.approvalStatus.cndName;
          } else {
            sts = "Initiated";
          }

          return (
            <div style={{ textAlign: "center" }}>
              <span>{sts}</span>
            </div>
          );
        },
      },
    },
    // {
    //   name: "Approval Level",
    //   title: "Approval Level",
    //   options: {
    //     headerNoWrap: true,
    //     width: 100,
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //       return (
    //         <div style={{ textAlign: "center" }}>{value.approvalSequence}</div>
    //       );
    //     },
    //   },
    // },
    {
      name: "Milestone Status",
      title: "Milestone Status",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              {rowData.milestoneStatus && rowData.milestoneStatus !== null
                ? rowData.milestoneStatus.cndName
                : "Not Yet Started"}
            </div>
          );
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: 180,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let dsp = "";

          if (rowData.approvalStatus && rowData.approvalStatus !== null) {
            dsp =
              rowData.approvalStatus.cndName === "Approved" ||
              rowData.approvalStatus.cndName === "Rejected"
                ? "none"
                : "inline";
          } else {
            dsp = "inline";
          }
          return (
            rowData.approvalStatus != "totals" && (
              <div style={{ textAlign: "center" }}>
                <a
                  target="_blank"
                  href={
                    "#/contract-document/" +
                    rowData.contract._id +
                    "?refId=" +
                    rowData._id +
                    "&refType=Milestone"
                  }
                >
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Documents"
                    className="fa fa-folder"
                  ></i>
                </a>
              </div>
            )
          );
        },
      },
    },
  ];

  milestoneColumns1 = [
    {
      name: "Milestone Name",
      title: "Milestone Name",
      field: "milestoneName",
      options: {
        headerNoWrap: true,
      },
    },

    {
      name: "Start Date",
      title: "Start Date",
      field: "startDate",
      key: "startDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.startDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "End Date",
      title: "End Date",
      field: "endDate",
      key: "endDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.endDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "Milestone Value",
      title: "Milestone Value",
      field: "milestoneValue",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <NumberFormat
              value={value.milestoneValue}
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
          );
        },
      },
    },

    {
      name: "Person Responsible",
      title: "Person Responsible",
      field: "personResponsible",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            value.personResponsible?.firstName +
            " " +
            value.personResponsible?.lastName
          );
        },
      },
    },

    {
      name: "Approval Status",
      title: "Approval Status",

      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let clr = "";
          let sts = "";
          if (rowData.approvalStatus && rowData.approvalStatus !== null) {
            clr =
              rowData.approvalStatus.cndName === "Approved" ? "green" : "red";
            sts = rowData.approvalStatus.cndName;
          } else {
            sts = "Initiated";
          }

          return (
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: "12px",
                  // color: clr,
                }}
              >
                {sts}
              </span>
            </div>
          );
        },
      },
    },
    {
      name: "Approval Level",
      title: "Approval Level",
      options: {
        headerNoWrap: true,
        width: 100,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>{value.approvalSequence}</div>
          );
        },
      },
    },
    {
      name: "Milestone Status",
      title: "Milestone Status",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              {rowData.milestoneStatus && rowData.milestoneStatus !== null
                ? rowData.milestoneStatus.cndName
                : "Not Yet Started"}
            </div>
          );
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        width: 180,
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let dsp = "";

          if (rowData.approvalStatus && rowData.approvalStatus !== null) {
            dsp =
              rowData.approvalStatus.cndName === "Approved" ||
              rowData.approvalStatus.cndName === "Rejected"
                ? "none"
                : "inline";
          } else {
            dsp = "inline";
          }
          return (
            <div style={{ textAlign: "center" }}>
              <a
                target="_blank"
                href={
                  "#/contract-document/" +
                  rowData.contract._id +
                  "?refId=" +
                  rowData._id +
                  "&refType=Milestone"
                }
              >
                <i
                  style={{
                    fontSize: "20px",
                    color: "#2196f3",
                    cursor: "pointer",
                  }}
                  title="Documents"
                  className="fa fa-folder"
                ></i>
              </a>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, tableOptions } = this.props;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Milestone Details
              </h4>
            </CardHeader>
            <CardBody>
              <MaterialDatatable
                striped
                title={
                  loading === true ? (
                    <Loader
                      type="ThreeDots"
                      color="#00BFFF"
                      height={60}
                      width={60}
                    />
                  ) : (
                    "Milestones"
                  )
                }
                data={this.state.milestones}
                columns={this.milestoneColumns}
                options={tableOptions}
              />
            </CardBody>
            <CardFooter style={{ display: "block", textAlign: "center" }}>
              <Button color="warning" onClick={this.handleCancel.bind(this)}>
                Back
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default ContractMileTable;
