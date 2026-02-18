import React from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
import { ApiEndPoints } from "../../config";
import FormFunc from "../../components/common/formfunc";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import { JsonToTable } from "react-json-to-table";
import moment from "moment";
import auth from "../../auth";
import { NotificationManager } from "react-notifications";

class ActivityForm extends FormFunc {
  state = {
    errors: {},

    responseError: "",
    activityType: "",
    newValues: {},
    oldValues: {},
    module: "",
    id: "new",
    newform: false,
  };

  async componentDidMount() {
    await this.getAuditData();
  }

  getAuditData() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.activityList + "?id=" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            id: data.result[0]._id,
            activityType: data.result[0].activityType,
            module: data.result[0].module,
            newValues:
              data.result[0].newValues === undefined ||
              data.result[0].newValues === null ||
              data.result[0].newValues === "undefined"
                ? data.result[0].oldValues
                : data.result[0].newValues,
            oldValues: data.result[0].oldValues,
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

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const { activityType, module, newValues, oldValues } = this.state;

    var Obj = {};

    // find keys
    var oldKeyObj = Object.keys(oldValues ? oldValues : { xid: "xid" });
    var newKeyObj = Object.keys(newValues);

    // find values
    var oldValueObj = Object.values(oldValues ? oldValues : { xid: "xid" });
    var newValueObj = Object.values(newValues);

    // console.log("valueObj1: ", oldValueObj);

    for (var i = 0; i < newKeyObj.length; i++) {
      if (
        newKeyObj[i] != "deleted" &&
        newKeyObj[i] != "__v" &&
        newKeyObj[i] != "status" &&
        newKeyObj[i] != "password" &&
        newKeyObj[i] != "_id" &&
        newKeyObj[i] != "parentCustomer" &&
        newKeyObj[i] != "createdDate" &&
        newKeyObj[i] != "updatedDate" &&
        newKeyObj[i] != "loginDate" &&
        newKeyObj[i] != "isAdmin" &&
        newKeyObj[i] != "deletedDate" &&
        newKeyObj[i] != "contractStatus_ApprValue" &&
        newKeyObj[i] != "contractStatus_LastUpdated" &&
        newKeyObj[i] != "endDate_ApprValue" &&
        newKeyObj[i] != "endDate_LastUpdated" &&
        newKeyObj[i] != "contractPerformance" &&
        newKeyObj[i] != "contractRating"
      ) {
        if (newKeyObj[i] == oldKeyObj[i] && newValueObj[i] != oldValueObj[i]) {
          if (
            newKeyObj[i] == "startDate" ||
            newKeyObj[i] == "endDate" ||
            newKeyObj[i] == "taskTargetDate"
          ) {
            Obj[newKeyObj[i]] =
              moment(newValueObj[i] * 1000).format("DD/MM/YYYY") +
              " ( This field is changed from " +
              moment(oldValueObj[i] * 1000).format("DD/MM/YYYY") +
              ")";
          } else
            Obj[newKeyObj[i]] =
              newValueObj[i] +
              " ( This field is changed from " +
              oldValueObj[i] +
              ")";
        } else {
          if (
            newKeyObj[i] == "startDate" ||
            newKeyObj[i] == "endDate" ||
            newKeyObj[i] == "taskTargetDate"
          ) {
            Obj[newKeyObj[i]] = moment(newValueObj[i] * 1000).format(
              "DD/MM/YYYY"
            );
          } else Obj[newKeyObj[i]] = newValueObj[i];
        }
      }
    }

    function sortKeys(obj_1) {
      var key = Object.keys(obj_1).sort(function order(key1, key2) {
        if (key1 < key2) return -1;
        else if (key1 > key2) return +1;
        else return 0;
      });

      var temp = {};

      for (var i = 0; i < key.length; i++) {
        temp[key[i]] = obj_1[key[i]];
        delete obj_1[key[i]];
      }

      for (var i = 0; i < key.length; i++) {
        obj_1[key[i]] = temp[key[i]];
      }
      return obj_1;
    }

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                View Audit Information
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleCancel}
                  style={{
                    width: "100%",
                    paddingBottom: "-15px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <JsonToTable json={sortKeys(Obj)} />

                  <br />
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="text-center">
                        <Button
                          color="warning"
                          onClick={this.handleCancel.bind(this)}
                        >
                          Close
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
export default ActivityForm;
