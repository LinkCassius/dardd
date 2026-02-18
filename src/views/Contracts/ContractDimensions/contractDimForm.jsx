import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  SelectValidator,
} from "react-material-ui-form-validator";
import { ApiEndPoints } from "../../../config";
import auth from "../../../auth";
import GridItem from "./../../../components/Grid/GridItem.js";
import GridContainer from "./../../../components/Grid/GridContainer.js";
import Card from "./../../../components/Card/Card.js";
import CardHeader from "./../../../components/Card/CardHeader.js";
import CardBody from "./../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import FormFunc from "./../../../components/common/formfunc";
import FormGroup from "@material-ui/core/FormGroup";

class ContractDimForm extends FormFunc {
  state = {
    userslist: [],
    dimensionId: "new",
    dimensionName: "",
    dimensionValue: "",
    dText: "",
    newform: false,
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getCnDList();
    await this.getDimensionById();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  dimensionChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.setState({ dText: event.nativeEvent.target.text });
  };

  getCnDList() {
    fetch(ApiEndPoints.allProgramList + "?cndGroup=Dimension", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndlist: data.result, loading: false });
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

  getDimensionById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.dimensionById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            dimensionId: data.result._id,
            dimensionName: data.result.dimension._id,
            dimensionValue: data.result.dimension._id,
            dText: data.result.dimension.cndName,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          // NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  handleSubmit_Dimension = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    var contractId = this.props.contractId;

    const formpojo = {};
    if (this.state.dimensionId !== "new") formpojo.id = this.state.dimensionId;
    else formpojo.id = null;

    formpojo.contract = contractId;
    formpojo.dimension = this.state.dimensionValue;
    fetch(
      ApiEndPoints.AddUpdateContract_Dimension +
        "?userid=" +
        auth.getCurrentUser()._id,
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
          // this.setState({ responseError: data.msg });
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
    const { cndlist, dimensionValue } = this.state;

    let dimensionlst = cndlist
      ? cndlist.filter((data) => data.cndGroup === "Dimension")
      : [];

    // let dimensionValuelst = cndlist
    //   ? cndlist.filter((data) => data.cndName === this.state.dText)
    //   : [];

    let dimensionValuelst = cndlist
      ? cndlist.filter((data) => data.cndGroup === "Dimension")
      : [];

    dimensionlst.sort(auth.sortValues("cndName"));
    dimensionValuelst.sort(auth.sortValues("cndName"));

    //let mymap = new Map();

    // let unique = dimensionlst.filter((el) => {
    //   const val = mymap.get(el.cndName);

    //   if (val) {
    //     if (el._id == val) {
    //       mymap.delete(el.cndName);
    //       mymap.set(el.cndName, el._id);
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    //   mymap.set(el.cndName, el._id);
    //   return true;
    // });

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
                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Dimension}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="form-group row">
                        {/* <div className="col-sm-6">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Dimension Name *"
                              helperText=" "
                              onChange={this.dimensionChange}
                              name="dimensionName"
                              validators={["required"]}
                              errorMessages={["Please Select Dimension Name"]}
                              value={dimensionName}
                            >
                              {dimensionlst.map((value, index) => {
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
                          </FormGroup>
                        </div> */}
                        <div className="col-sm-12">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Programme *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="dimensionValue"
                              validators={["required"]}
                              errorMessages={["Please Select Programme"]}
                              value={dimensionValue}
                            >
                              {dimensionValuelst.map((value, index) => {
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
                          </FormGroup>
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
export default ContractDimForm;
