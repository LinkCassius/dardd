import React from "react";
import { NotificationManager } from "react-notifications";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { createStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import { ApiEndPoints } from "../../../config";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import auth from "../../../auth";

class ServiceProvidersForm extends React.Component {
  state = {
    id: "new",
    serviceProviderFirmName: "",
    errors: {},
    contactPersonName: "",
    contactNumber: "",

    email: "",
  };

  async getSPById() {
    const id = this.props.id;

    if (id !== "new") {
      fetch(ApiEndPoints.serviceproviderslist + "?id=" + id, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            const resData = data.result[0];
            this.setState({
              id: resData._id,
              serviceProviderFirmName: resData.serviceProviderFirmName,
              contactPersonName: resData.contactPersonName,
              contactNumber: resData.contactNumber,

              email: resData.email,
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
  }

  async componentDidMount() {
    await this.getSPById();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      id,
      serviceProviderFirmName,
      contactPersonName,
      contactNumber,

      email,
    } = this.state;

    const formpojo = {};

    if (id !== "new") formpojo.id = id;
    else formpojo.id = null;
    formpojo.serviceProviderFirmName = serviceProviderFirmName;
    formpojo.contactPersonName = contactPersonName;
    formpojo.contactNumber = contactNumber;

    formpojo.email = email;

    console.log("svc pro formpojo : ", formpojo);
    fetch(ApiEndPoints.serviceproviders, {
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
          if (id !== "new")
            NotificationManager.success("record updated successfully");
          else NotificationManager.success("record saved successfully");
          this.props.updateList();

          this.props.toggle();
        } else {
          this.setState({ responseError: data.msg });
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
    const {
      serviceProviderFirmName,
      contactPersonName,
      contactNumber,

      email,
    } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Service Provider
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

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
                            label="Firm Name *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="serviceProviderFirmName"
                            value={serviceProviderFirmName || ""}
                            validators={["required"]}
                            errorMessages={["Firm Name is mandatory"]}
                            variant="outlined"
                          />
                        </div>
                        <div className="col-sm-12">
                          <TextValidator
                            label="Contact Person First Name *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="contactPersonName"
                            value={contactPersonName || ""}
                            validators={["required"]}
                            errorMessages={["First Name is mandatory"]}
                            variant="outlined"
                          />
                        </div>

                        <div className="col-sm-12">
                          <TextValidator
                            label="Contact Number *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="contactNumber"
                            value={contactNumber || ""}
                            validators={["required"]}
                            errorMessages={["Contact number is mandatory"]}
                            variant="outlined"
                          />
                        </div>

                        <div className="col-sm-12">
                          <TextValidator
                            label="Email *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="email"
                            value={email || ""}
                            validators={["required"]}
                            errorMessages={["Email is mandatory"]}
                            variant="outlined"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <Button color="primary" type="submit">
                          Save
                        </Button>
                        <span>&nbsp;&nbsp;</span>
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
const styles = createStyles((theme) => ({
  dayWrapper: {
    position: "relative",
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: "0 2px",
    color: "inherit",
  },
  customDayHighlight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "2px",
    right: "2px",
    border: `1px solid ${theme.palette.secondary.main} `,
    borderRadius: "50%",
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled,
  },
  highlightNonCurrentMonthDay: {
    color: "#676767",
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  firstHighlight: {
    extend: "highlight",
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  },
  endHighlight: {
    extend: "highlight",
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  },
}));
export default withStyles(styles)(ServiceProvidersForm);
