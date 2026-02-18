import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";

import auth from "../../auth";
import { ApiEndPoints } from "../../config";

import FormFunc from "../../components/common/formfunc";

class ProgramForm extends FormFunc {
  state = {
    errors: {},

    responseError: "",
    id: "new",
    cndName: "",
    cndCode: "",
    cndGroup: "",
    purpose: "",
    priority: "",
    cndlist: [],
    parent: "",
    options: [],

    newform: false,
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getcndData();
    await this.getOneCndData();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getcndData() {
    //get Cnd
    fetch(ApiEndPoints.programList + "?cndGroup=Dimension", {
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

    if (id === "new") {
      return;
    }
    this.setState({ newform: true });

    fetch(ApiEndPoints.allProgramList + "/" + id, {
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
            purpose: data.result.desc,
            parent: data.result.parent,
            priority: data.result.priority,
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
      formpojo.cndGroup = "Dimension";
    } else {
      formpojo.id = null;
      formpojo.cndGroup = "Dimension";
    }
    formpojo.desc = this.state.purpose;

    fetch(ApiEndPoints.AddUpdateProgram, {
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

  render() {
    const { options, cndlist } = this.state;
    options.sort(auth.sortValues("name"));
    cndlist.sort(auth.sortValues("cndName"));

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Programme
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
                        <div className="col-sm-12">
                          <TextValidator
                            label="Programme Type *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="cndName"
                            value={this.state.cndName}
                            validators={["required"]}
                            errorMessages={["Field is mandatory"]}
                            variant="outlined"
                          />
                        </div>

                        <div className="col-sm-12">
                          <TextValidator
                            label="Programme/SubProgramme *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="cndCode"
                            value={this.state.cndCode}
                            validators={["required"]}
                            errorMessages={["Field is mandatory"]}
                            variant="outlined"
                          />
                        </div>
                        <div className="col-sm-12">
                          <TextValidator
                            label="Purpose *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="purpose"
                            value={this.state.purpose}
                            validators={["required"]}
                            errorMessages={["Field is mandatory"]}
                            variant="outlined"
                            multiline
                            type="textarea"
                            size="medium"
                          />
                        </div>
                        <div className="col-sm-12">
                          <TextValidator
                            variant="outlined"
                            helperText=" "
                            label="Order"
                            name="priority"
                            value={this.state.priority}
                            validators={["required"]}
                            errorMessages={["Field is mandatory"]}
                            onChange={this.handleChange}
                            type="number"
                          />
                        </div>
                        <div className="col-sm-12">
                          <SelectValidator
                            variant="outlined"
                            label="Parent Programme"
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
                                  {value.cndName + " - " + value.cndCode}
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
export default ProgramForm;
