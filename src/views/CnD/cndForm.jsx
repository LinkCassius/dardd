import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
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

class CndForm extends FormFunc {
  state = {
    errors: {},

    responseError: "",
    id: "new",
    cndName: "",
    cndCode: "",
    cndGroup: "",
    cndGroupX: "",
    cndGroupE: "",
    cndlist: [],
    parent: "",
    options: [
      // { id: idSeq++, name: "Select/Add New Item" },
      // { id: idSeq++, name: "Item A" },
      // { id: idSeq++, name: "Item B" },
      // { id: idSeq++, name: "Item C" }
    ],
    editable: false,
    newform: false,
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getcndData();
    await this.getcndGroup();
    await this.getOneCndData();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getcndGroup() {
    fetch(ApiEndPoints.cndgroup, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          var options = [{ id: 0, name: "Select/Add New Item" }];
          for (var i in data.result) {
            options.push({ id: data.result[i], name: data.result[i] });
          }

          this.setState({ options });
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
          //NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  getOneCndData() {
    const id = this.props.id;
    const editable = false;
    if (id === "new") {
      return;
    } else {
      this.setState({ editable });
    }
    this.setState({ newform: true });

    fetch(ApiEndPoints.cnd + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            id: data.result._id,
            cndCode: data.result.cndCode,
            cndName: data.result.cndName,

            cndGroupX: data.result.cndGroup,
            cndGroupE: data.result.cndGroup,
            parent: data.result.parent,
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

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;

    if (this.state.id !== "new") {
      formpojo.id = this.state.id;
      formpojo.cndGroup = this.state.cndGroupX;
    } else {
      formpojo.id = null;

      if (this.state.editable === false)
        formpojo.cndGroup = this.state.cndGroupX;
      else formpojo.cndGroup = this.state.cndGroupE;
    }

    fetch(ApiEndPoints.AddUpdateCnd, {
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
          NotificationManager.success("Record Saved Successfully");
          this.props.toggle();
          this.props.updateList();
          this.setState({ editable: false, cndGroupE: "", cndGroupX: "" });
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

  handleToggle(event) {
    event.preventDefault();
    this.setState({ editable: !this.state.editable });
  }

  render() {
    const { options, cndlist } = this.state;
    options.sort(auth.sortValues("name"));
    cndlist.sort(auth.sortValues("cndName"));

    console.log("cnd list : ", cndlist);
    const styleX = this.state.editable === true ? "none" : "block";
    const styleE = this.state.editable === false ? "none" : "block";
    const toggleE = this.state.editable === false ? "fa fa-edit" : "fa fa-list";
    const Title = this.state.editable === false ? "Type" : "List";

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update CnD
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
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <TextValidator
                            label="CnD Name"
                            helperText=" "
                            onChange={this.handleChange}
                            name="cndName"
                            value={this.state.cndName}
                            validators={["required"]}
                            errorMessages={["CnD Name is mandatory"]}
                            variant="outlined"
                          />
                        </div>

                        <div className="col-sm-6">
                          <TextValidator
                            label="CnD Value"
                            helperText=" "
                            onChange={this.handleChange}
                            name="cndCode"
                            value={this.state.cndCode}
                            validators={["required"]}
                            errorMessages={["CnD Value is mandatory"]}
                            variant="outlined"
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-11">
                          <div style={{ display: styleX }}>
                            <SelectValidator
                              variant="outlined"
                              label="Group"
                              helperText=" "
                              onChange={this.handleChange}
                              name="cndGroupX"
                              errorMessages={["Please Select Group"]}
                              value={this.state.cndGroupX}
                            >
                              {options.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value.id}
                                  >
                                    {value.name}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </div>

                          <div style={{ display: styleE }}>
                            <TextValidator
                              label="Group Name"
                              helperText=" "
                              onChange={this.handleChange}
                              name="cndGroupE"
                              value={this.state.cndGroupE}
                              errorMessages={["CnD Group is mandatory"]}
                              variant="outlined"
                            />
                          </div>
                        </div>
                        <div className="col-sm-1">
                          <i
                            style={{
                              fontSize: "25px",
                              color: "#2196f3",
                              paddingRight: 5,
                              paddingTop: 5,
                              cursor: "pointer",
                            }}
                            title={Title}
                            onClick={this.handleToggle.bind(this)}
                            className={toggleE}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <SelectValidator
                            variant="outlined"
                            label="Parent"
                            helperText=""
                            onChange={this.handleChange}
                            name="parent"
                            value={this.state.parent}
                          >
                            {cndlist.map((value, index) => {
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
                      <br />
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
export default CndForm;
