import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
} from "react-material-ui-form-validator";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import auth from "../../auth";
import { ApiEndPoints } from "../../config";
import FormFunc from "../../components/common/formfunc";
import Can from "../../components/common/Auth/Can";
import Loader from "react-loader-spinner";
import MaterialDatatable from "material-datatable";
import FormGroup from "@material-ui/core/FormGroup";

const options = {
  filterType: "multiselect",
  responsive: "stacked",
  selectableRows: false,
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
};
class BankForm extends FormFunc {
  state = {
    errors: {},
    bankBranchList: [],
    bankName: "",
    bankBranchName: "",
    address: "",
    responseError: "",

    id: "new",
    bankBranchId: "new",
    newform: false,
    savedisabled: false,
    savedisabledBranch: false,

    btnText_Bank: "Add",
    btnText_Branch: "Add",
  };

  columns = [
    {
      name: "Branch Name",
      title: "Branch Name",
      field: "name",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Address",
      title: "Address",
      field: "address",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        headerNoWrap: true,
        width: 80,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Can
                perform="Bank Edit Access"
                yes={() => (
                  <i
                    style={{
                      fontSize: "20px",
                      color: "#2196f3",
                      cursor: "pointer",
                    }}
                    title="Update Branch Details"
                    onClick={() => this.getBankBranchData(rowData._id)}
                    className="fa fa-edit"
                  ></i>
                )}
              />
            </div>
          );
        },
      },
    },
  ];

  async componentDidMount() {
    await this.getBankBranchList();
    await this.getBankData();
  }

  getBankBranchList() {
    const id = this.props.id;
    console.log("bank id : ", id);
    fetch(ApiEndPoints.bankList + "?parent=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ bankBranchList: data.result, loading: false });
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getBankData() {
    const id = this.props.id;

    if (id === "new") {
      this.setState({ btnText_Bank: "Add", btnText_Branch: "Add" });
      return;
    } else {
      this.setState({ btnText_Bank: "Update", btnText_Branch: "Add" });
    }
    this.setState({ newform: true });

    fetch(ApiEndPoints.bankList + "?id=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            bankName: data.result[0].name,
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

  getBankBranchData(id) {
    this.setState({ btnText_Branch: "Update" });
    fetch(ApiEndPoints.bankList + "?id=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            bankBranchName: data.result[0].name,
            address: data.result[0].address,
            bankBranchId: data.result[0]._id,
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

  handleBankNameSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;

    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;

    formpojo.name = this.state.bankName;

    fetch(ApiEndPoints.addUpdateBank, {
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

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.id === "new") {
      NotificationManager.error("Please add bank before adding branch");
      return;
    }
    if (this.state.savedisabledBranch) {
      return;
    }
    this.setState({ savedisabledBranch: true });

    const formpojo = this.state;

    if (this.state.bankBranchId !== "new")
      formpojo.id = this.state.bankBranchId;
    else formpojo.id = null;

    formpojo.name = this.state.bankBranchName;
    formpojo.address = this.state.address;
    formpojo.parent = this.props.id;

    fetch(ApiEndPoints.addUpdateBank, {
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
          //this.props.toggle();
          // this.props.updateList();
          this.getBankBranchList();
          this.setState({ savedisabledBranch: false });
          this.setState({
            bankBranchName: "",
            address: "",
            bankBranchId: "new",
            btnText_Branch: "Add",
          });
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
          this.setState({ savedisabledBranch: false });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
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
                Add/Update Bank {"&"} Branches
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
                        <div className="col-sm-10">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Bank Name"
                              name="bankName"
                              value={this.state.bankName}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-2">
                          <Button
                            color="primary"
                            disabled={this.state.savedisabled}
                            onClick={this.handleBankNameSubmit.bind(this)}
                          >
                            {this.state.savedisabled
                              ? "Please wait..."
                              : this.state.btnText_Bank}
                          </Button>
                        </div>
                      </div>
                      <hr />
                      <div className="form-group row">
                        <div className="col-sm-5">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Bank Branch Name"
                              name="bankBranchName"
                              value={this.state.bankBranchName}
                              onChange={this.handleChange}
                              validators={["required"]}
                              errorMessages={["Please Enter Branch Name"]}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-5">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Address"
                              name="address"
                              value={this.state.address}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-2">
                          <Button
                            color="primary"
                            type="submit"
                            disabled={this.state.savedisabledBranch}
                          >
                            {this.state.savedisabledBranch
                              ? "Please wait..."
                              : this.state.btnText_Branch}
                          </Button>
                        </div>
                      </div>

                      <MaterialDatatable
                        striped
                        title={
                          this.state.loading === true ? (
                            <Loader
                              type="ThreeDots"
                              color="#00BFFF"
                              height={60}
                              width={60}
                            />
                          ) : (
                              "Bank Branches List"
                            )
                        }
                        data={this.state.bankBranchList}
                        columns={this.columns}
                        options={options}
                      />

                      <br />
                      <div className="text-center">
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
export default BankForm;
