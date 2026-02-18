import React from "react";
import { NotificationManager } from "react-notifications";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import CardFooter from "./../../components/Card/CardFooter.js";
import Button from "../../components/CustomButtons/Button.js";
import DualListBox from "react-dual-listbox";
import auth from "../../auth";
import { ApiEndPoints } from "../../config";
import FormFunc from "../../components/common/formfunc";
import "react-dual-listbox/lib/react-dual-listbox.css";

class UserGroupForm extends FormFunc {
  state = {
    data: { permission: [] },
    errors: {},

    responseError: "",
    groupName: "",
    cndlist: [],
    screens: [],
    selected: [],
    id: "new",
    newform: false,
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getScreensData();
    await this.getOneUgData();
  }

  getScreensData() {
    fetch(ApiEndPoints.screens, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ screens: data.result });
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

  onChange = (selected) => {
    this.setState({ selected });

    this.setState((prevState) => ({
      data: { ...prevState.data, permission: selected },
    }));
  };

  getOneUgData() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.userGroup + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          const selected = data.result.permission;

          this.setState({
            groupName: data.result.groupName,
            id: data.result._id,
            selected,
          });

          this.setState((prevState) => ({
            data: { ...prevState.data, permission: selected },
          }));
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

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;
    formpojo.permission = this.state.data.permission;

    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;

    fetch(
      ApiEndPoints.AddUpdateUserGroup + "?userid=" + auth.getCurrentUser()._id,
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
          NotificationManager.error(data.msg);
          this.setState({ savedisabled: false });
        }
      })
      .catch("error", console.log);
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const { groupName, screens, selected } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Role
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
                  style={{ width: "100%" }}
                >
                  <div className="row">
                    <div className="col-md-10 mx-auto">
                      {/*<form onSubmit={this.handleSubmit}>*/}
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <TextValidator
                            label="Role Name"
                            helperText="Required *"
                            onChange={this.handleChange}
                            name="groupName"
                            value={groupName}
                            validators={["required"]}
                            errorMessages={["Role Name is mandatory"]}
                            variant="outlined"
                            style={{ width: 500 }}
                          />
                        </div>
                      </div>
                      <div>
                        <DualListBox
                          showHeaderLabels
                          canFilter
                          options={screens}
                          selected={selected}
                          onChange={this.onChange}
                          icons={{
                            moveLeft: <span className="fa fa-chevron-left" />,
                            moveAllLeft: [
                              <span key={0} className="fa fa-chevron-left" />,
                              <span key={1} className="fa fa-chevron-left" />,
                            ],
                            moveRight: <span className="fa fa-chevron-right" />,
                            moveAllRight: [
                              <span key={0} className="fa fa-chevron-right" />,
                              <span key={1} className="fa fa-chevron-right" />,
                            ],
                            moveDown: <span className="fa fa-chevron-down" />,
                            moveUp: <span className="fa fa-chevron-up" />,
                          }}
                        />
                      </div>
                      <br />
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
            <CardFooter></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
export default UserGroupForm;
