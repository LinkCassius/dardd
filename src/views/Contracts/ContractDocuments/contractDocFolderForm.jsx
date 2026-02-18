import React from "react";
import { NotificationManager } from "react-notifications";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import GridItem from "./../../../components/Grid/GridItem.js";
import GridContainer from "./../../../components/Grid/GridContainer.js";
import Card from "./../../../components/Card/Card.js";
import CardHeader from "./../../../components/Card/CardHeader.js";
import CardBody from "./../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";
import moment from "moment";
import { ApiEndPoints } from "../../../config";
import FormFunc from "./../../../components/common/formfunc";
import auth from "../../../auth";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class ContractDocFolderForm extends FormFunc {
  state = {
    contractId: "",
    name: "",
    docCollection: "",
    isFolder: "",
    parent: "",
    taskId: "",
    variationId: "",
    milestoneId: "",
    paymentId: "",
    status: "",
    id: "new",

    file: null,
    supportingDoc: null,
    uploading: false,

    uploadDate: currentDate,
    newform: false,
  };

  async componentDidMount() {
    await this.getDocumentById();
  }

  getDocumentById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.documentById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            id: data.result._id,
            name: data.result.name,
            docCollection: data.result.docCollection,
            supportingDoc: data.result.docCollection,
            contractId: data.result.contractId,
            parent: data.result.parent,
            isFolder: data.result.isFolder,
            taskId: data.result.taskId,
            variationId: data.result.variationId,
            milestoneId: data.result.milestoneId,
            paymentId: data.result.paymentId,
            status: data.result.status,
            uploadDate: moment(data.result.uploadDate * 1000).format(
              "YYYY-MM-DD"
            ),
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit_Folder = (event) => {
    event.preventDefault();
    const { contractId, parent, refId, refType } = this.props;

    const parentId = parent ? parent : "";
    const {
      name,
      docCollection,
      taskId,
      variationId,
      milestoneId,
      paymentId,
      uploadDate,
    } = this.state;

    const formpojo = {};
    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;

    formpojo.contractId = contractId;
    formpojo.name = name;
    formpojo.docCollection = docCollection;
    formpojo.isFolder = "Y";
    formpojo.parent = parentId;
    formpojo.refId = refId;
    formpojo.refType = refType;
    formpojo.taskId = taskId;
    formpojo.variationId = variationId;
    formpojo.milestoneId = milestoneId;
    formpojo.paymentId = paymentId;
    formpojo.uploadDate = moment(uploadDate).format("X");

    fetch(
      ApiEndPoints.AddUpdateContract_Document +
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
            <CardHeader color="primary" >
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Folder
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Folder}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              label="Folder Name*"
                              helperText=" "
                              onChange={this.handleChange}
                              name="name"
                              value={this.state.name}
                              validators={["required"]}
                              errorMessages={["Folder Name is mandatory"]}
                            />
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

                      {/*</form>*/}
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
export default ContractDocFolderForm;
