import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
import auth from "../../auth";
import { ApiEndPoints, siteConfig } from "../../config";
import FormFunc from "../../components/common/formfunc";
import FileCrop from "../../components/common/FileCrop";
import SelectInput from "../../components/Inputs/SelectInput";

const imagePathUrl = siteConfig.userImagesPath;

//const imagePathUrl = "https://tdapwebapi.azurewebsites.net/images/" + "users/";
//const imagePathUrl = "http://localhost:5008/images/" + "users/";

class UserForm extends FormFunc {
  state = {
    usergroups: [],
    supervisors: [],
    responseError: "",
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    confirm_password: "",
    phone: "",
    email: "",
    // isAdmin: "",
    userGroup: "",
    file: null,
    imageUrl: "",
    id: "new",
    newform: false,
    savedisabled: false,

    district: "",
    municipality: "",
    stationedAt: "",
    supervisor: "",
    roleName: "",

    status: false,

    cndlist: [],
    metroDistrict: "",
    municipalRegion: "",
    municipalRegionObj: {},
    metroDistrictObj: {},
    municipalRegionName: "",
    metroDistrictName: "",

    supervisorRole: "",
    supervisorUsers: [],
  };

  async componentDidMount() {
    await Promise.all([
      this.getCndList(),
      this.getUserGroups(),
      this.getUsers(),
    ]);
    await this.getOneUserData();
  }

  getCndList() {
    fetch(ApiEndPoints.cndList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndlist: data.result });
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

    if (event.target.name === "municipalRegion") {
      this.setState({
        municipalRegionName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "metroDistrict") {
      this.setState({
        metroDistrictName: event._targetInst.pendingProps.data_id,
      });
    }
  };
  handleCheckStatus = (event) => {
    this.setState({ status: event.target.checked });
  };
  roleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.setState({ roleName: event.nativeEvent.target.text });
  };

  supervisorRoleChange = (event) => {
    this.getUserGroupUsers(event.target.value);
    if (!event.target.value) {
      this.setState({
        supervisorUsers: [],
      });
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getUserGroups() {
    fetch(ApiEndPoints.userGroupList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ usergroups: data.result });
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

  getUsers() {
    fetch(ApiEndPoints.usersList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          //console.log("users list : ", data.result);
          this.setState({ supervisors: data.result });
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

  getOneUserData() {
    console.log("supervisors getOneUserData: ", this.state.supervisors);

    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    fetch(ApiEndPoints.user + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("user id : ", data.result);
        if (data && data.success === true) {
          const imagerl =
            typeof data.result.imageName === "undefined"
              ? "default.png"
              : data.result.imageName;
          this.setState({
            firstName: data.result.firstName,
            lastName: data.result.lastName,
            userName: data.result.userName,
            password: data.result.password,
            confirm_password: data.result.password,
            phone: data.result.phone,
            email: data.result.email,
            // isAdmin: data.result.isAdmin,
            userGroup: data.result.userGroup,
            imageUrl: imagePathUrl + imagerl,
            id: data.result._id,
            district:
              data.result.district && data.result.district !== null
                ? data.result.district
                : "",
            municipality:
              data.result.municipality && data.result.municipality !== null
                ? data.result.municipality
                : "",
            metroDistrict:
              data.result.metroDistrict && data.result.metroDistrict !== null
                ? data.result.metroDistrict
                : "",
            municipalRegion:
              data.result.municipalRegion &&
              data.result.municipalRegion !== null
                ? data.result.municipalRegion
                : "",
            metroDistrictName:
              data.result.metroDistrictObj &&
              data.result.metroDistrictObj !== null
                ? data.result.metroDistrictObj.cndName
                : "",
            municipalRegionName:
              data.result.municipalRegionObj &&
              data.result.municipalRegionObj !== null
                ? data.result.municipalRegionObj.cndName
                : "",
            stationedAt:
              data.result.stationedAt && data.result.stationedAt !== null
                ? data.result.stationedAt
                : "",
            supervisor:
              data.result.supervisor && data.result.supervisor !== null
                ? data.result.supervisor
                : "",
            status: data.result.status === 0 ? false : true,
            supervisorRole:
              data.result.supervisorRole && data.result.supervisorRole !== null
                ? data.result.supervisorRole
                : "",
          });
          this.getUserGroupUsers(data.result.supervisorRole);
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

  onCropImage = async (file) => {
    this.setState({ file });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    if (this.state.supervisorRole && !this.state.supervisor) {
      NotificationManager.error("Please select supervisor name");
      return;
    }

    this.setState({ savedisabled: true });

    const formData = new FormData();
    formData.append("firstName", this.state.firstName);
    formData.append("lastName", this.state.lastName);
    formData.append("userName", this.state.userName);
    formData.append("password", this.state.password);
    formData.append("phone", this.state.phone);
    formData.append("email", this.state.email);
    formData.append("userGroup", this.state.userGroup);
    // formData.append("isAdmin", this.state.isAdmin);
    formData.append("confirm_password", this.state.confirm_password);
    formData.append("userImage", this.state.file);
    formData.append("district", this.state.district);
    formData.append("municipality", this.state.municipality);
    formData.append("metroDistrict", this.state.metroDistrict);
    formData.append("municipalRegion", this.state.municipalRegion);
    formData.append("metroDistrictObj_id", this.state.metroDistrict);
    formData.append("metroDistrictObj_cndName", this.state.metroDistrictName);
    formData.append("municipalRegionObj_id", this.state.municipalRegion);
    formData.append(
      "municipalRegionObj_cndName",
      this.state.municipalRegionName
    );

    formData.append("stationedAt", this.state.stationedAt);
    formData.append("supervisor", this.state.supervisor);
    formData.append("status", this.state.status === false ? 0 : 1);
    formData.append("supervisorRole", this.state.supervisorRole);

    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    if (this.state.id !== "new") formData.append("id", this.state.id);
    else {
      formData.append("id", null);
    }

    // if (
    //   this.state.roleName === "Extension Officer" &&
    //   this.state.supervisor === ""
    // ) {
    //   NotificationManager.error(
    //     "Please select supervisor for the Extension Officer"
    //   );
    //   this.setState({ savedisabled: false });
    //   return;
    // }
    if (this.state.id === this.state.supervisor) {
      NotificationManager.error("Please select different supervisor");
      this.setState({ savedisabled: false });
      return;
    }

    fetch(ApiEndPoints.AddUpdateUser + "?userid=" + auth.getCurrentUser()._id, {
      method: "POST",
      headers: { "x-auth-token": auth.getJwt() },
      body: formData,
    })
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

  getUserGroupUsers(id) {
    if (id === null || id === "") return;
    fetch(ApiEndPoints.userGroupUsers + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          if (data.result.length > 0) {
            this.setState({
              supervisorUsers: data.result,
            });
          } else {
            this.setState({
              supervisorUsers: [],
            });
            NotificationManager.error("Users not found for selected role");
          }
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

  render() {
    const { usergroups, supervisors, cndlist, supervisorUsers } = this.state;
    usergroups.sort(auth.sortValues("groupName"));
    supervisors.sort(auth.sortValues("firstName"));

    // const usergroupsArr = usergroups.map(({ groupName: name, ...rest }) => ({
    //   name,
    //   ...rest,
    // }));

    const usergroupsArr = usergroups.map((item) => {
      return {
        name: item.groupName,
        _id: item._id,
      };
    });

    const supervisorUsersArr = supervisorUsers.map((item) => {
      return {
        name: item.firstName + " " + item.lastName,
        _id: item._id,
      };
    });
    supervisorUsersArr.sort(auth.sortValues("name"));

    let districts = cndlist
      ? cndlist.filter((data) => data.cndGroup === "District")
      : [];
    districts.sort(auth.sortValues("cndName"));

    let municipalities = cndlist
      ? cndlist.filter(
          (data) =>
            data.cndGroup === "Municipality" &&
            data.parent._id === this.state.metroDistrict
        )
      : [];

    municipalities.sort(auth.sortValues("cndName"));

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update User
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
                  style={{ width: "100%", padding: "15px" }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      {/*<form onSubmit={this.handleSubmit}>*/}
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <TextValidator
                            label="First Name *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="firstName"
                            value={this.state.firstName}
                            validators={["required"]}
                            errorMessages={["First Name is mandatory"]}
                            variant="outlined"
                          />
                        </div>
                        <div className="col-sm-4">
                          <TextValidator
                            label="Last Name *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="lastName"
                            value={this.state.lastName}
                            validators={["required"]}
                            errorMessages={["Last Name is mandatory"]}
                            variant="outlined"
                          />
                        </div>

                        <div className="col-sm-4">
                          <TextValidator
                            label="Email *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                            validators={["required", "isEmail"]}
                            errorMessages={[
                              "Email is mandatory",
                              "email is not valid",
                            ]}
                            variant="outlined"
                          />
                        </div>
                        {/* <div className="col-sm-4">
                  <TextValidator
                    label="User Name"
                    helperText="Required *"
                    onChange={this.handleChange}
                    name="userName"
                    value={this.state.userName}
                    validators={["required"]}
                    errorMessages={["User Name is mandatory"]}
                    variant="outlined"
                  />
                </div> */}
                        <div className="col-sm-4">
                          <TextValidator
                            label="Password *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="password"
                            value={this.state.password}
                            validators={[
                              "required",
                              "matchRegexp:^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
                            ]}
                            errorMessages={[
                              "Password is mandatory",
                              "Password should contain atleast 1 lowercase & uppercase alphabets, numeric, special character, minimum 8 characters",
                            ]}
                            variant="outlined"
                            type="password"
                          />
                        </div>
                        <div className="col-sm-4">
                          <TextValidator
                            label="Confirm Password *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="confirm_password"
                            value={this.state.confirm_password}
                            validators={["required"]}
                            errorMessages={["Confirm Password is mandatory"]}
                            variant="outlined"
                            type="password"
                          />
                        </div>

                        <div className="col-sm-4">
                          <SelectValidator
                            variant="outlined"
                            label="Role *"
                            helperText=" "
                            onChange={this.roleChange}
                            name="userGroup"
                            value={this.state.userGroup}
                            validators={["required"]}
                            className="select"
                            errorMessages={["Role is mandatory"]}
                          >
                            {usergroupsArr.map((value, index) => {
                              return (
                                <option
                                  className="custom-option"
                                  key={index}
                                  value={value._id}
                                >
                                  {value.name}
                                </option>
                              );
                            })}
                          </SelectValidator>
                        </div>

                        <div className="col-sm-4">
                          <TextValidator
                            label="Phone *"
                            helperText=" "
                            onChange={this.handleChange}
                            name="phone"
                            value={this.state.phone}
                            validators={["required", "isNumber"]}
                            errorMessages={[
                              "Phone No. is mandatory",
                              "It should be numeric",
                            ]}
                            variant="outlined"
                          />
                        </div>

                        <div className="col-sm-4">
                          <SelectValidator
                            variant="outlined"
                            label="District"
                            helperText=" "
                            onChange={this.handleChange}
                            name="metroDistrict"
                            value={this.state.metroDistrict}
                            className="select"
                            // validators={["required"]}
                            // errorMessages={["Role is mandatory"]}
                          >
                            {districts.map((value, index) => {
                              return (
                                <option
                                  className="custom-option"
                                  key={index}
                                  value={value._id}
                                  data_id={value.cndName}
                                >
                                  {value.cndName}
                                </option>
                              );
                            })}
                          </SelectValidator>
                        </div>

                        <div className="col-sm-4">
                          <SelectValidator
                            variant="outlined"
                            label="Municipality"
                            helperText=" "
                            onChange={this.handleChange}
                            name="municipalRegion"
                            value={this.state.municipalRegion}
                            className="select"
                          >
                            {municipalities.map((value, index) => {
                              return (
                                <option
                                  className="custom-option"
                                  key={index}
                                  value={value._id}
                                  data_id={value.cndName}
                                >
                                  {value.cndName}
                                </option>
                              );
                            })}
                          </SelectValidator>
                        </div>
                        <div className="col-sm-4">
                          <TextValidator
                            label="Stationed At"
                            helperText=" "
                            onChange={this.handleChange}
                            name="stationedAt"
                            value={this.state.stationedAt}
                            variant="outlined"
                          />
                        </div>
                        <div className="col-sm-4">
                          <SelectInput
                            label="Supervisor Role"
                            helperText=" "
                            onChange={this.supervisorRoleChange}
                            name="supervisorRole"
                            value={this.state.supervisorRole}
                            data={usergroupsArr}
                          />
                        </div>
                        <div className="col-sm-4">
                          <SelectInput
                            label="Supervisor Name"
                            helperText=" "
                            onChange={this.handleChange}
                            name="supervisor"
                            value={this.state.supervisor}
                            //validators={[]}
                            className="select"
                            //errorMessages={[]}
                            data={supervisorUsersArr}
                          />
                          {/* <SelectValidator
                            variant="outlined"
                            label="Supervisor"
                            helperText=" "
                            onChange={this.handleChange}
                            name="supervisor"
                            value={this.state.supervisor}
                            // validators={["required"]}
                            className="select"
                            // errorMessages={["Role is mandatory"]}
                          >
                            {supervisorUsers.map((value, index) => {
                              return (
                                <option
                                  className="custom-option"
                                  key={index}
                                  value={value._id}
                                >
                                  {value.firstName + " " + value.lastName}
                                </option>
                              );
                            })}
                          </SelectValidator> */}
                        </div>

                        <div className="col-sm-4">
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.status}
                                  onChange={this.handleCheckStatus}
                                  name="status"
                                  color="primary"
                                />
                              }
                              label="Active"
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-4">
                          <div className="form-group row">
                            <div style={{ paddingLeft: "90px" }}>
                              <FileCrop
                                onCropImage={this.onCropImage}
                                defaultLogoUrl={
                                  this.state.imageUrl === ""
                                    ? imagePathUrl + "default.png"
                                    : this.state.imageUrl
                                }
                                avatarHeight={"100px"}
                                borderRadius={"50%"}
                                avatarWidth={"100px"}
                                croppedHeight={200}
                                croppedWidth={200}
                                croppedBorderRadius={100}
                                croppedBoarder={50}
                              />
                            </div>
                          </div>
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
                      <br />
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
export default UserForm;
