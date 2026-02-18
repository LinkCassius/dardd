import React, { Component } from "react";

import { NotificationManager } from "react-notifications";
import moment from "moment";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Button from "../../components/CustomButtons/Button.js";
import { makeStyles } from "@material-ui/core/styles";
import TopNavbar from "../../components/Header/top.navbar";
import Footer from "../../components/Footer/footer";
import { ApiEndPoints } from "../../config";
import auth from "../../auth";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardAvatar from "./../../components/Card/CardAvatar.js";
import CardBody from "./../../components/Card/CardBody.js";
import CardFooter from "./../../components/Card/CardFooter.js";
class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      responseError: "",
    };
  }

  componentDidMount() {
    ValidatorForm.addValidationRule("passwordMismatch", (value) => {
      if (this.state.newPassword !== this.state.confirmPassword) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("passwordMismatch");
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { currentPassword, newPassword } = this.state;
    const formpojo = {};

    formpojo.userid = auth.getCurrentUser()._id;
    formpojo.currentPassword = currentPassword;
    formpojo.newPassword = newPassword;

    fetch(ApiEndPoints.changePassword, {
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
          NotificationManager.success("Password Changed Successfully");

          this.setState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            responseError: "",
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
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };

  render() {
    const { contractId, parent } = this.props.match.params;

    const { responseError } = this.state;

    return (
      <div className="card">
        <GridContainer justify={"center"}>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className="cardCategoryWhite cardTitleWhite">
                  Change Password
                </h4>
                {/* <p className={classes.cardCategoryWhite}>Card</p> */}
              </CardHeader>
              <CardBody>
                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit}
                >
                  <div className="row">
                    <div className="col-md-6 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <TextValidator
                            variant="outlined"
                            label="Current Password *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="currentPassword"
                            value={this.state.currentPassword}
                            validators={["required"]}
                            errorMessages={["Current Password is mandatory"]}
                            type="password"
                          />
                        </div>

                        <div className="col-sm-12">
                          <TextValidator
                            variant="outlined"
                            label="New Password *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="newPassword"
                            value={this.state.newPassword}
                            validators={[
                              "required",
                              "matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
                            ]}
                            errorMessages={[
                              "New Password is mandatory",
                              "Password should contain atleast 1 lowercase & uppercase alphabets, numeric, special character, minimum 8 characters",
                            ]}
                            type="password"
                          />
                        </div>

                        <div className="col-sm-12">
                          <TextValidator
                            variant="outlined"
                            label="Confirm Password *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="confirmPassword"
                            value={this.state.confirmPassword}
                            validators={["required", "passwordMismatch"]}
                            errorMessages={[
                              "Confirm Password is mandatory",
                              "New Password & Confirm Password are not same",
                            ]}
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <span className="mandatory">
                            All (*) marked fields are mandatory
                          </span>
                        </div>
                      </div>
                      <Button type="submit" color="primary">
                        Change Password
                      </Button>
                      {/* <button
                                  className="btn btn-primary"
                                  type="submit"
                                >
                                  Change Password
                        </button> */}

                      {/*</form>*/}
                    </div>
                  </div>
                </ValidatorForm>
              </CardBody>
              <CardFooter>
                {/* <Button color="primary">Update Profile</Button> */}
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default ChangePassword;
