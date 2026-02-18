import React from "react";
import { NotificationManager } from "react-notifications";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import { ApiEndPoints } from "../../config";
import DropdownTreeSelect from "react-dropdown-tree-select";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import { createStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import auth from "../../auth";
import SelectInput from "../../components/Inputs/SelectInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import MultiSelectCheckbox from "../../components/common/MultiSelectCheckbox";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import IndicatorMoV from "./indicatorMoV";
import DialogWrapper from "../../components/common/Dialog";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class IndicatorTitlesForm extends React.Component {
  state = {
    indicatorId: "new",
    indicatorTitle: "",
    errors: {},

    programsList: [],
    programme: "",
    programmeNo: "",
    programmeName: "",
    subProgramme: "",
    subProgrammeNo: "",
    subProgrammeName: "",
    outcome: "",
    outputs: "",
    movData: [],
    movArray: [],
    hasMOV: false,

    isOpen: false,
  };

  getAllProgramsList() {
    fetch(ApiEndPoints.allProgramList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ programsList: data.result });
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

  async getIndicatorById() {
    const id = this.props.id;

    if (id !== "new") {
      fetch(ApiEndPoints.IndicatorTitleslist + "?indicatorId=" + id, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            const IFData = data.result[0];
            this.setState({
              indicatorId: IFData._id,
              indicatorTitle: IFData.indicatorTitle,

              programme: IFData.programme,
              subProgramme: IFData.subProgramme,
              programmeNo: IFData.programmeNo,
              subProgrammeNo: IFData.subProgrammeNo,
              programmeName: IFData.programmeNo + "-" + IFData.programmeName,
              subProgrammeName:
                IFData.subProgrammeNo + "-" + IFData.subProgrammeName,
              outcome: IFData.outcome,
              outputs: IFData.outputs,
              movArray: IFData.movArray,
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
    await Promise.all([this.getMov(), this.getAllProgramsList()]);
    await this.getIndicatorById();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "programme") {
      this.setState({
        programmeName: event._targetInst.pendingProps.data_id,
      });
    } else if (event.target.name === "subProgramme") {
      this.setState({
        subProgrammeName: event._targetInst.pendingProps.data_id,
      });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState((state) => ({
      hasMOV: state.movArray.length > 0 ? false : true,
    }));

    if (this.state.hasMOV) return;

    const formpojo = {};

    if (this.state.indicatorId !== "new") formpojo.id = this.state.indicatorId;
    else formpojo.id = null;
    formpojo.indicatorTitle = this.state.indicatorTitle;

    formpojo.movArray = this.state.movArray;
    formpojo.movCount =
      this.state.movArray && this.state.movArray.length > 0
        ? this.state.movArray.length
        : 0;
    formpojo.outcome = this.state.outcome;
    formpojo.outputs = this.state.outputs;
    formpojo.programme = this.state.programme;
    formpojo.subProgramme = this.state.subProgramme;
    formpojo.programmeName = this.state.programmeName;
    formpojo.subProgrammeName = this.state.subProgrammeName;

    let pArr = this.state.programmeName.split("-");
    let sArr = this.state.subProgrammeName.split("-");
    formpojo.programmeNo = pArr[0].trim();
    formpojo.programmeName = pArr[1].trim();
    formpojo.subProgrammeNo = sArr[0].trim();
    formpojo.subProgrammeName = sArr[1].trim();

    console.log("ind title formpojo : ", formpojo);
    fetch(ApiEndPoints.addUpdateIndicatorTitles, {
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
          if (this.state.indicatorId !== "new")
            NotificationManager.success("Indicator Title updated successfully");
          else
            NotificationManager.success("Indicator Title saved successfully");
          this.props.updateList();

          this.props.toggle();
        } else {
          this.setState({ responseError: data.msg });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };

  handleChangeMov = (event) => {
    this.setState({ movArray: event.target.value });
  };
  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }
  getMov() {
    //get Cnd
    fetch(ApiEndPoints.movlist, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ movData: data.result });
      })
      .catch(console.log);
  }

  handleAddMoV = () => {};

  render() {
    const { indicatorTitle, programsList, movData, movArray, hasMOV } =
      this.state;

    //console.log("movData : ", movData);
    let programmeArr = programsList
      ? programsList
          .filter((data) => data.parent === null)
          .map((item) => {
            return {
              name: item.cndName + "-" + item.cndCode,
              _id: item._id,
            };
          })
      : [];

    let subProgrammeArr = programsList
      ? programsList
          .filter(
            (data) => data.parent && data.parent._id == this.state.programme
          )
          .map((item) => {
            return {
              name: item.cndName + "-" + item.cndCode,
              _id: item._id,
            };
          })
      : [];

    const movDataNew = movData.map(({ name: name, ...rest }) => ({
      name,
      ...rest,
    }));

    movDataNew.sort(auth.sortValues("name"));

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add Indicator
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
                          <SelectInput
                            label="Programme"
                            helperText=" "
                            onChange={this.handleChange}
                            name="programme"
                            value={this.state.programme}
                            data={programmeArr}
                            validators={["required"]}
                          />
                        </div>
                        <div className="col-sm-12">
                          <SelectInput
                            label="Sub-Programme"
                            helperText=" "
                            onChange={this.handleChange}
                            name="subProgramme"
                            value={this.state.subProgramme}
                            data={subProgrammeArr}
                            validators={["required"]}
                          />
                        </div>

                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Indicator Title *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="indicatorTitle"
                              value={indicatorTitle || ""}
                              validators={["required"]}
                              errorMessages={["Indicator Title is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Outcome *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="outcome"
                              value={this.state.outcome || ""}
                              validators={["required"]}
                              errorMessages={["Outcome is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Output *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="outputs"
                              value={this.state.outputs || ""}
                              validators={["required"]}
                              errorMessages={["Outputs is mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-10">
                          <FormGroup>
                            <FormControl variant="outlined" error={hasMOV}>
                              <InputLabel id="demo-mutiple-checkbox-label">
                                Means of Verification *
                              </InputLabel>
                              <MultiSelectCheckbox
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox-label"
                                label="Means of Verification *"
                                name="movArray"
                                multiple
                                value={movArray}
                                onChange={this.handleChangeMov}
                                MenuProps={MenuProps}
                                data={movDataNew}
                              />
                              {hasMOV && (
                                <FormHelperText>
                                  This field is required!
                                </FormHelperText>
                              )}
                            </FormControl>
                          </FormGroup>
                        </div>
                        <div className="col-sm-2">
                          <FormGroup>
                            <button
                              type="button"
                              className="btn btn-success"
                              onClick={() =>
                                this.setState({ isOpen: !this.state.isOpen })
                              }
                            >
                              <i className="fa fa-plus" aria-hidden="true"></i>
                            </button>
                          </FormGroup>
                        </div>
                        <DialogWrapper
                          isOpen={this.state.isOpen}
                          toggle={() =>
                            this.setState({ isOpen: !this.state.isOpen })
                          }
                          size="lg"
                          style={{
                            width: 900,
                            height: 300,
                            paddingTop: "10px",
                          }}
                          className="customeModel customeModelMargin"
                        >
                          <IndicatorMoV
                            toggle={() =>
                              this.setState({ isOpen: !this.state.isOpen })
                            }
                            id={this.state.id}
                            updateList={() => this.getMov()}
                          />
                        </DialogWrapper>
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
export default withStyles(styles)(IndicatorTitlesForm);
