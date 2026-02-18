/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";

// material ui icons
import MailOutline from "@material-ui/icons/MailOutline";
import Contacts from "@material-ui/icons/Contacts";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardText from "../../components/Card/CardText.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";
import TopNavbar from "../../components/Header/top.navbar";
import Footer from "../../components/Footer/footer";
// style for this view

import styles from "./../../assets/Styles/validationFormsStyle.js";

const useStyles = makeStyles(styles);

export default function ValidationForms() {
  // register form
  const [registerEmail, setregisterEmail] = React.useState("");
  const [registerEmailState, setregisterEmailState] = React.useState("");
  const [registerPassword, setregisterPassword] = React.useState("");
  const [registerPasswordState, setregisterPasswordState] = React.useState("");
  const [registerOldPassword, setregisterOldPassword] = React.useState("");
  const [registerOldPasswordState, setregisterOldPasswordState] = React.useState("");
  const [registerConfirmPassword, setregisterConfirmPassword] = React.useState(
    ""
  );
  const [
    registerConfirmPasswordState,
    setregisterConfirmPasswordState
  ] = React.useState("");
  const [registerCheckbox, setregisterCheckbox] = React.useState(false);
  const [registerCheckboxState, setregisterCheckboxState] = React.useState("");
  // login form
  const [loginEmail, setloginEmail] = React.useState("");
  const [loginEmailState, setloginEmailState] = React.useState("");
  const [loginPassword, setloginPassword] = React.useState("");
  const [loginPasswordState, setloginPasswordState] = React.useState("");
  // type validation
  const [required, setrequired] = React.useState("");
  const [requiredState, setrequiredState] = React.useState("");
  const [typeEmail, settypeEmail] = React.useState("");
  const [typeEmailState, settypeEmailState] = React.useState("");
  const [number, setnumber] = React.useState("");
  const [numberState, setnumberState] = React.useState("");
  const [url, seturl] = React.useState("");
  const [urlState, seturlState] = React.useState("");
  const [equalTo, setequalTo] = React.useState("");
  const [whichEqualTo, setwhichEqualTo] = React.useState("");
  const [equalToState, setequalToState] = React.useState("");
  // range validation
  const [minLength, setminLength] = React.useState("");
  const [minLengthState, setminLengthState] = React.useState("");
  const [maxLength, setmaxLength] = React.useState("");
  const [maxLengthState, setmaxLengthState] = React.useState("");
  const [range, setrange] = React.useState("");
  const [rangeState, setrangeState] = React.useState("");
  const [minValue, setminValue] = React.useState("");
  const [minValueState, setminValueState] = React.useState("");
  const [maxValue, setmaxValue] = React.useState("");
  const [maxValueState, setmaxValueState] = React.useState("");
  // function that returns true if value is email, false otherwise
  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  // verifies if value is a valid URL
  const verifyUrl = value => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  };
  const registerClick = () => {

    var validflag = true;

    if (registerEmailState === "") {
      setregisterEmailState("error");
      validflag = false;
    }
    if (registerPasswordState === "") {
      setregisterPasswordState("error");
      validflag = false;
    }
    if (registerOldPasswordState === "") {
      setregisterOldPasswordState("error");
      validflag = false;
    }
    if (registerConfirmPasswordState === "") {
      setregisterConfirmPasswordState("error");
      validflag = false;
    }
    if (registerCheckboxState === "") {
      setregisterCheckboxState("error");
      validflag = false;
    }
    if (validflag) {
      console.log("submit")
    }
    else {
      return;
    }
  };
  const loginClick = () => {
    if (loginEmailState === "") {
      setloginEmailState("error");
    }
    if (loginPasswordState === "") {
      setloginPasswordState("error");
    }
  };
  const typeClick = () => {
    if (requiredState === "") {
      setrequiredState("error");
    }
    if (typeEmailState === "") {
      settypeEmailState("error");
    }
    if (numberState === "") {
      setnumberState("error");
    }
    if (urlState === "") {
      seturlState("error");
    }
    if (equalToState === "") {
      setequalToState("error");
    }
  };
  const rangeClick = () => {
    if (minLengthState === "") {
      setminLengthState("error");
    }
    if (maxLengthState === "") {
      setmaxLengthState("error");
    }
    if (rangeState === "") {
      setrangeState("error");
    }
    if (minValueState === "") {
      setminValueState("error");
    }
    if (maxValueState === "") {
      setmaxValueState("error");
    }
  };
  const classes = useStyles();
  return (
    < div >
      <TopNavbar />

      {/* Page content */}
      <div className="page-content">
        <div className="content-wrapper">
          <div className="content">
            <div className="card">
              <div className="card-body">
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <Card>
                      <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>Change Password</h4>
                      </CardHeader>
                      <CardBody>
                        <form>
                          <CustomInput
                            success={registerOldPasswordState === "success"}
                            error={registerOldPasswordState === "error"}
                            labelText="Old Password *"
                            id="oldpassword"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: event => {
                                if (verifyLength(event.target.value, 1)) {
                                  setregisterOldPasswordState("success");
                                } else {
                                  setregisterOldPasswordState("error");
                                }
                                setregisterOldPassword(event.target.value);
                              },
                              type: "password",
                              autoComplete: "off"
                            }}
                          />
                          <CustomInput
                            success={registerPasswordState === "success"}
                            error={registerPasswordState === "error"}
                            labelText="New Password *"
                            id="registerpassword"
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              onChange: event => {
                                if (verifyLength(event.target.value, 1)) {
                                  setregisterPasswordState("success");
                                } else {
                                  setregisterPasswordState("error");
                                }
                                setregisterPassword(event.target.value);
                              },
                              type: "password",
                              autoComplete: "off"
                            }}
                          />
                          <CustomInput
                            success={registerConfirmPasswordState === "success"}
                            error={registerConfirmPasswordState === "error"}
                            labelText="Confirm New Password *"
                            id="registerconfirmpassword"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              onChange: event => {
                                if (registerPassword === event.target.value) {
                                  setregisterConfirmPasswordState("success");
                                } else {
                                  setregisterConfirmPasswordState("error");
                                }
                                setregisterConfirmPassword(event.target.value);
                              },
                              type: "password",
                              autoComplete: "off"

                            }}
                          />
                          <div className={classes.formCategory}>
                            <small>*</small> Required fields
                           </div>
                          <Button color="primary"
                            onClick={registerClick}
                            className={classes.registerButton}
                          >
                            Reset Password
                         </Button>
                        </form>
                      </CardBody>
                    </Card>
                  </GridItem>
                </GridContainer>
              </div>
            </div>
          </div>
          {/* /content area */}
          {/* Footer */}
          <Footer />
          {/* /footer */}
        </div>
        {/* /main content */}
      </div>
      {/* /page content */}
    </div >

  );
}
