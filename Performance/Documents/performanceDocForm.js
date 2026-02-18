import React from "react";
import { NotificationManager } from "react-notifications";
import FormGroup from "@material-ui/core/FormGroup";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import moment from "moment";
import { ApiEndPoints, siteConfig } from "../../../config";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import FormFunc from "../../../components/common/formfunc";
import auth from "../../../auth";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractDocFileForm extends FormFunc {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.removefile = this.removefile.bind(this);
  }

  state = {
    performanceId: "",
    name: "",
    id: "new",
    file: null,
    uploading: false,
    uploadDate: currentDate,
    newform: false,
    supportingDoc: null,
  };

  async componentDidMount() {
    await this.getDocumentById();
  }

  getDocumentById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.perfDocumentById + "/?id=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            id: data.result._id,
            name: data.result.name,
            performanceId: data.result.performanceId,
            uploadDate: moment(data.result.uploadDate * 1000).format(
              "YYYY-MM-DD"
            ),
            supportingDoc: data.result.fileName,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else if (data && data.success === false) {
          NotificationManager.error("Something went wrong");
        }
      })
      .catch(console.log);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onChange(e) {
    this.setState({
      uploading: true,
    });

    const url = ApiEndPoints.uploadfile;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    fetch(url, {
      method: "POST",
      body: formData,
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((response) => response.json())
      .then((res) => {
        //NotificationManager.info("File Uploaded");
        this.setState({
          uploading: false,
          supportingDoc: res.url,
        });
      })
      .catch((rejected) => {
        console.log("rejected", rejected);
        this.setState({
          uploading: false,
        });
      });
  }

  removefile(e) {
    NotificationManager.success("File Removed Successfully");
    this.setState({
      supportingDoc: null,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { performanceId } = this.props;
    const { name, uploadDate, supportingDoc } = this.state;
    const formpojo = {};

    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;
    formpojo.performanceId = performanceId;
    formpojo.name = name;
    formpojo.uploadDate = moment(uploadDate).format("X");
    formpojo.fileName = supportingDoc;
    formpojo.movArray = this.props.movArray; //not inserting to db but checking cond in node
    fetch(
      ApiEndPoints.AddUpdatePerformance_Document +
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
          NotificationManager.success("Document Saved Successfully");
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
        } else if (data && data.success === false) {
          this.setState({ responseError: data.msg });
          NotificationManager.error("Something went wrong");
        } else {
          this.setState({ responseError: data.msg });
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
                Add/Update File
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
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
                          {/* <TextValidator
                            variant="outlined"
                            label="Document Name*"
                            helperText="Required *"
                            onChange={this.handleChange}
                            name="name"
                            value={this.state.name || ""}
                            validators={["required"]}
                            errorMessages={["Document Name is mandatory"]}
                          /> */}
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Document Name*"
                              helperText="Required *"
                              onChange={this.handleChange}
                              name="name"
                              validators={["required"]}
                              errorMessages={["This field is mandatory"]}
                              value={this.state.name || ""}
                            >
                              {this.props.movArray &&
                                this.props.movArray.map((value, index) => {
                                  return (
                                    <option
                                      className="custom-option"
                                      key={index}
                                      value={value}
                                    >
                                      {value}
                                    </option>
                                  );
                                })}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                        <div
                          className="col-sm-12"
                          style={{ textAlign: "left" }}
                        >
                          {this.state.supportingDoc ? (
                            <span>
                              <a
                                target="_blank"
                                href={
                                  siteConfig.imagesPath +
                                  this.state.supportingDoc +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                              >
                                <i
                                  style={{
                                    fontSize: "25px",
                                  }}
                                  className="fa fa-file"
                                ></i>
                              </a>
                              <span>&nbsp;&nbsp;</span>
                              {this.state.supportingDoc}
                              <span>&nbsp;&nbsp;</span>

                              <i
                                style={{
                                  //  padding: "10px"
                                  textAlign: "left",
                                }}
                                className="fa fa-remove"
                                onClick={this.removefile}
                              ></i>
                              {/* <img
                                  width="100px"
                                  height="100px"
                                  src={
                                    siteConfig.imagesPath +
                                    this.state.supportingDoc
                                  }
                                /> */}
                            </span>
                          ) : (
                            //   <input
                            //     type="file"
                            //     name="file"
                            //     onChange={this.onChange}
                            //   />
                            <TextValidator
                              variant="outlined"
                              helperText="Required *"
                              onChange={this.onChange}
                              name="file"
                              type="file"
                              value={this.state.file || ""}
                              validators={["required"]}
                              errorMessages={["File is mandatory"]}
                            />
                          )}
                          {this.state.uploading === true ? (
                            <i className="fa fa-circle-o-notch fa-spin"></i>
                          ) : (
                            ""
                          )}
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
export default ContractDocFileForm;
