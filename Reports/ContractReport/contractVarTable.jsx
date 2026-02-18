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
import CardFooter from "../../../components/Card/CardFooter.js";
import Button from "../../../components/CustomButtons/Button.js";

class ContractTaskTable extends Component {
  state = { variations: [] };

  async componentDidMount() {
    await this.getVariationsList();
  }

  getVariationsList() {
    fetch(ApiEndPoints.contract_Variation_List + "/" + this.props.contractId, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            variations: data.result,
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

  variationColumns = [
    {
      name: "Subject",
      title: "Subject",
      field: "subject",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Amount",
      title: "Amount",
      field: "amount",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <NumberFormat
              value={value.amount}
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
      name: "Approval Status",
      title: "Approval Status",

      options: {
        headerNoWrap: true,
        width: 120,
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
      name: "Action",
      title: "Action",
      options: {
        width: 120,
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
                  "&refType=Variation"
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
                Variation Details
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
                    "Variations"
                  )
                }
                data={this.state.variations}
                columns={this.variationColumns}
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

export default ContractTaskTable;
