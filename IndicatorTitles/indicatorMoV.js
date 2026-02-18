import React from "react";
import { NotificationManager } from "react-notifications";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import { ApiEndPoints } from "../../config";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import { createStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import auth from "../../auth";

class IndicatorMoV extends React.Component {
  state = {
    movId: "new",
    name: "",
    errors: {},
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("mov submit");
    const formpojo = {};

    if (this.state.movId !== "new") formpojo.id = this.state.movId;
    else formpojo.id = null;
    formpojo.name = this.state.name;

    console.log("MoV formpojo : ", formpojo);
    fetch(ApiEndPoints.addupdatemov, {
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
          if (this.state.movId !== "new")
            NotificationManager.success(
              "Means of Verification updated successfully"
            );
          else
            NotificationManager.success(
              "Means of Verification saved successfully"
            );
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
    const { name } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add Means of Verification
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  //onSubmit={this.handleSubmit}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Means of Verification *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="name"
                              value={name || ""}
                              validators={["required"]}
                              errorMessages={["This field is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          color="primary"
                          onClick={this.handleSubmit.bind(this)}
                        >
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
export default withStyles(styles)(IndicatorMoV);
