import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import moment from "moment";
import auth from "../../auth";
import { ApiEndPoints, siteConfig, fileTypes } from "../../config";

import Checkbox from "@material-ui/core/Checkbox";
import FormFunc from "../../components/common/formfunc";

import FormGroup from "@material-ui/core/FormGroup";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";
import Button from "../../components/CustomButtons/Button.js";
//import Select from "react-dropdown-select";
import LocationMap from "../../components/Map/locationMap";
import DialogWrapper from "../../components/common/Dialog";

import FarmersListInteraction from "./farmersListInteraction";
import FetchRequest from "../../components/Http/FetchRequest";

const imagePathUrl = siteConfig.imagesPath;

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class InteractionForm extends FormFunc {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.removefile = this.removefile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: { contractName: "" },
      errors: {},

      responseError: "",

      cndlist: [],
      farmerlist: [],
      userlist: [],

      farmerId: "",
      userId: "",

      supervisor: "",
      surName: "",
      name: "",
      identityNumber: "",
      farmerType: "",
      contactNumber: "",
      farmName: "",
      projectName: "",
      Total: "",
      wardNumber: "",
      landOwnership: "",
      ownershipType: "",

      serviceType: "",
      serviceDate: "",
      serviceSignature: "",
      serviceDescription: "",

      additionalServices: "",
      proposals: "",
      referralDetails: "",
      commodity: {},
      commodityOtherField: false,
      commodityOther: "",
      extensionSignature: "",
      managerSignature: "",

      id: "new",
      newform: false,

      savedisabled: false,

      docCollection: "",
      file: null,
      supportingDoc: null,
      uploading: false,
      fileName: "",

      latitude: "",
      longitude: "",

      isOpen: false,
      //clientSignature: "",

      farmerName: "",
      isOpenFarmer: false,

      ageGroup: "",
      gender: "",
      isDisabled: false,
      farmerDocId: "",
    };
  }

  async componentDidMount() {
    await Promise.all([this.getcndData(), this.getUsers(), this.getFarmers()]);
    await this.getOneInteractionData();

    ValidatorForm.addValidationRule("checkServiceDate", (value) => {
      console.log("selected Date : ", value);
      console.log("currentDate : ", currentDate);
      if (moment(value).isBefore(currentDate) && this.state.id === "new") {
        return false;
      }
      return true;
    });
  }
  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkServiceDate");
  }

  handleCheckChange = (name) => (event) => {
    this.setState({ ...this.state, [name]: event.target.checked });
  };

  getCheckboxInitiatValuesByGroup(groupName) {
    var valuesObj = {};
    this.state.cndlist.map(function (data) {
      if (data.cndGroup === groupName) {
        valuesObj[data.cndName] = false;
      }
    });
    return valuesObj;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleCheck = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };
  handleCheckboxChange(ObjectName, event) {
    var targetStateSet = ObjectName + "OtherField";
    this.setState({
      [targetStateSet]:
        event.target.name === "Other" && event.target.checked === true
          ? true
          : false,
    });

    let objectValues = {},
      name = "";
    if (
      //this.state[ObjectName] === null ||
      Object.keys(this.state[ObjectName]).length === 0
    ) {
      if (ObjectName === "commodity") name = "CommodityInteraction";
      objectValues = this.getCheckboxInitiatValuesByGroup(name);
    } else {
      objectValues = this.state[ObjectName];
    }

    objectValues[event.target.name] = event.target.checked;

    this.setState({
      [ObjectName]: objectValues,
    });
  }

  getcndData() {
    //get Cnd
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

  getUsers() {
    fetch(ApiEndPoints.activeusers, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ userlist: data.result });
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

  getFarmers() {
    fetch(ApiEndPoints.farmersDDL + "?per_page=100", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ farmerlist: data.result, loading: false });
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

  async getOneInteractionData() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });

    const data = await FetchRequest({
      url: ApiEndPoints.interactionlist_web + "?id=" + id,
      method: "POST",
    });

    console.log("interaction : ", data);
    if (data && data.success === true) {
      this.setState({
        /*
            farmerId: data.result[0].farmerDetails[0]._id,
            //////////////////////////////////////
            farmerName:
              data.result[0].farmerDetails[0].name +
              " - " +
              data.result[0].farmerDetails[0].identityNumber,
            surName: data.result[0].farmerDetails[0].surname,
            name: data.result[0].farmerDetails[0].name,
            identityNumber: data.result[0].farmerDetails[0].identityNumber,
            contactNumber: data.result[0].farmerDetails[0].contactNumber,
            farmerType: data.result[0].farmerDetails[0].farmerType,
            farmName: data.result[0].farmerProduction[0]?.farmName,
            projectName:
              data.result[0].farmerProduction[0]?.projectLegalEntityName,
            Total: data.result[0].farmerProduction[0]?.totalFarmSize?.Total,
            wardNumber: data.result[0].farmerProduction[0]?.wardNumber,
            ownershipType:
              data.result[0].farmerDetails[0]?.ownershipTypeObj.cndName,

            latitude: data.result[0].farmerProduction[0]?.farmLatitude,
            longitude: data.result[0].farmerProduction[0]?.farmLongitude,
            /////////////////////////////////////

            supervisor: data.result[0].supervisor,

            serviceType: data.result[0].serviceType,
            serviceDate:
              data.result[0].serviceDate === null
                ? ""
                : moment(data.result[0].serviceDate * 1000).format(
                    "YYYY-MM-DD"
                  ),
            serviceDescription: data.result[0].serviceDescription,
            serviceSignature:
              data.result[0].serviceSignature !== null &&
              data.result[0].serviceSignature != undefined
                ? data.result[0].serviceSignature
                : "",

            additionalServices: data.result[0].additionalServices,
            proposals: data.result[0].proposals,
            referralDetails: data.result[0].referralDetails,
            commodity: data.result[0].commodity,
            commodityOtherField:
              data.result[0].commodityOther != "" &&
              data.result[0].commodityOther != null
                ? true
                : false,
            commodityOther: data.result[0].commodityOther,
            extensionSignature: data.result[0].extensionSignature,
            managerSignature: data.result[0].managerSignature,
            supportingDoc: data.result[0].docCollection,

            id: data.result[0]._id,

            ageGroup: data.result[0].farmerDetails[0]?.ageGroupsObj?.cndName,
            gender: data.result[0].farmerDetails[0]?.gender,
            isDisabled: data.result[0].farmerDetails[0]?.isDisabled
              ? data.result[0].farmerDetails[0]?.isDisabled === false
                ? "No"
                : "Yes"
              : "No",

            farmerDocId: data.result[0].farmerAssetsServices[0]?.docCollection,
            */
        //below lines added after changing API
        farmerId: data.result[0].farmerId,
        farmerName:
          data.result[0].farmerObj?.name +
          " - " +
          data.result[0].identityNumber,
        surName: data.result[0].farmerObj?.surname,
        name: data.result[0].farmerObj?.name,
        identityNumber: data.result[0].identityNumber,
        contactNumber: data.result[0].farmerObj?.contactNumber,
        farmerType: data.result[0].farmerObj?.farmerType,
        farmName: data.result[0].farmerObj?.farmName,
        projectName: data.result[0].farmerObj?.projectLegalEntityName,
        Total: data.result[0].farmerObj?.totalFarmSize?.Total,
        wardNumber: data.result[0].farmerObj?.wardNumber,
        ownershipType: data.result[0].farmerObj?.ownershipTypeObj.cndName,

        latitude: data.result[0].farmerObj?.farmLatitude,
        longitude: data.result[0].farmerObj?.farmLongitude,
        /////////////////////////////////////

        //supervisor: data.result[0].supervisor,

        serviceType: data.result[0].serviceType,
        serviceDate:
          data.result[0].serviceDate === null
            ? ""
            : moment(data.result[0].serviceDate * 1000).format("YYYY-MM-DD"),
        serviceDescription: data.result[0].serviceDescription,
        serviceSignature:
          data.result[0].serviceSignature !== null &&
          data.result[0].serviceSignature !== undefined
            ? data.result[0].serviceSignature
            : "",

        additionalServices: data.result[0].additionalServices,
        proposals: data.result[0].proposals,
        referralDetails: data.result[0].referralDetails,
        commodity: data.result[0].commodity,
        commodityOtherField:
          data.result[0].commodityOther !== "" &&
          data.result[0].commodityOther != null
            ? true
            : false,
        commodityOther: data.result[0].commodityOther,
        extensionSignature: data.result[0].extensionSignature,
        managerSignature: data.result[0].managerSignature,
        supportingDoc: data.result[0].docCollection,

        id: data.result[0]._id,

        ageGroup: data.result[0].farmerObj?.ageGroupsObj?.cndName,
        gender: data.result[0].farmerObj?.gender,
        isDisabled: data.result[0].farmerObj?.isDisabled
          ? data.result[0].farmerObj?.isDisabled === false
            ? "No"
            : "Yes"
          : "No",

        farmerDocId: data.result[0].farmerObj?.docCollection,
      });
    } else if (data && data.success === false && data.responseCode === 401) {
      localStorage.clear();
      return (window.location.href = "/");
    }
  }

  onChange(e) {
    this.setState({
      uploading: true,
      fileName: e.target.files[0].name,
    });

    const url = ApiEndPoints.uploadfile;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    if (fileTypes.includes(e.target.files[0].type))
      fetch(url, {
        method: "POST",
        body: formData,
        "x-auth-token": auth.getJwt(),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res && res.success === true) {
            NotificationManager.success("File Uploaded Successfully");
            this.setState({
              uploading: false,
              supportingDoc: res.url,
              farmerDocId: res.url,
            });

            ///////////////update farmer ID//////////////////
            const formpojo = {};
            formpojo.farmerId = this.state.farmerId;
            formpojo.docCollection = res.url;
            fetch(ApiEndPoints.farmerAssetsServices, {
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
                  this.setState({ savedisabled: false });
                  NotificationManager.error(data.msg);
                }
              })
              .catch("error", console.log);
            /////////////////////////////
          } else if (res && res.success === false && res.responseCode === 401) {
            NotificationManager.error(res.msg);
            localStorage.clear();
            return (window.location.href = "/");
          }
        })
        .catch((rejected) => {
          console.log("rejected", rejected);
          this.setState({
            uploading: false,
          });
        });
    else {
      this.setState({
        uploading: false,
      });
      NotificationManager.warning(
        "Accepts only PDF/Excel/Word/Excel/ JPEG/PNG/PPT/ZIP/Text"
      );
    }
  }

  removefile(e) {
    NotificationManager.success("File Removed Successfully");
    this.setState({
      supportingDoc: null,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    if (this.state.farmerDocId === "") {
      NotificationManager.error("Please upload Farmers' ID");
      return;
    }
    this.setState({ savedisabled: true });

    //const formpojo = this.state;
    const formpojo = {};
    if (this.state.id !== "new") formpojo.id = this.state.id;
    else formpojo.id = null;

    console.log("this.state.id : ", this.state.id);
    if (this.state.id === null || this.state.id === "new")
      formpojo.approverStatus = "Pending";

    formpojo.commodity =
      Object.keys(this.state.commodity).length === 0
        ? this.getCheckboxInitiatValuesByGroup("CommodityInteraction")
        : this.state.commodity;
    formpojo.commodityOther = this.state.commodityOther;
    formpojo.farmerId = this.state.farmerId;
    formpojo.identityNumber = this.state.identityNumber;
    formpojo.serviceType = this.state.serviceType;
    formpojo.serviceDescription = this.state.serviceDescription;
    formpojo.serviceDate =
      this.state.serviceDate === ""
        ? null
        : moment(this.state.serviceDate).format("X");

    formpojo.docCollection = this.state.supportingDoc;

    formpojo.additionalServices = this.state.additionalServices;
    formpojo.proposals = this.state.proposals;
    formpojo.referralDetails = this.state.referralDetails;

    console.log("interaction forpojo :", formpojo);
    fetch(ApiEndPoints.addUpdateInteraction, {
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

  filterFromCnd(cndGroupName) {
    const { cndlist } = this.state;
    let filtervalues = cndlist.filter((data) => data.cndGroup === cndGroupName);
    return filtervalues;
  }

  getDataByFarmerID(farmerID) {
    fetch(ApiEndPoints.farmerbyid + "/" + farmerID, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("selected farmer data : ", data);
        if (data && data.success === true) {
          this.setState({
            surName: data.result[0].surname,
            name: data.result[0].name,
            identityNumber: data.result[0].identityNumber,
            contactNumber: data.result[0].contactNumber,
            farmerType: data.result[0].farmerType,
            farmName: data.result[0].farmerProduction?.farmName,
            projectName:
              data.result[0].farmerProduction?.projectLegalEntityName,
            Total: data.result[0].farmerProduction?.totalFarmSize.Total,
            wardNumber: data.result[0].farmerProduction?.wardNumber,
            ownershipType: data.result[0]?.ownershipTypeObj?.cndName,

            latitude: data.result[0].farmerProduction?.farmLatitude,
            longitude: data.result[0].farmerProduction?.farmLongitude,
            ageGroup: data.result[0]?.ageGroupsObj?.cndName,
            gender: data.result[0]?.gender,
            isDisabled: data.result[0]?.isDisabled
              ? data.result[0]?.isDisabled === false
                ? "No"
                : "Yes"
              : "No",
            farmerDocId: data.result[0]?.farmerAsset.docCollection,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  getFarmerId = (farmerId) => {
    this.setState({ farmerId });
  };
  getFarmerName = (farmerName) => {
    console.log("get farmer name : ", farmerName);
    this.setState({ farmerName });
  };
  onFarmerSelect(id) {
    this.setState({ farmerId: id, isOpenFarmer: false });
    this.getDataByFarmerID(id);
    console.log("farrrrmmeeerrr Id : ", id);
  }
  render() {
    const { latitude, longitude } = this.state;
    console.log("this.state.id : ", this.state.id);
    let Latitude = latitude === null || latitude === undefined ? "" : latitude;
    let Longitude =
      longitude === null || longitude === undefined ? "" : longitude;

    let commodityList = this.filterFromCnd("CommodityInteraction");

    //let ownershipTypeList = this.filterFromCnd("OwnershipType");

    let farmersUpdated = [];
    this.state.farmerlist.forEach(function (farmer) {
      let obj = {};
      obj._id = farmer._id;
      obj.name = farmer.name;
      obj.nameIdentiyNumber = farmer.name + " - " + farmer.identityNumber;
      farmersUpdated.push(obj);
    });

    // let editFarmerObj = farmersUpdated.filter(
    //   (data) => data._id === this.state.farmerId
    // );

    //console.log("farmerDocId : ", this.state.farmerDocId);

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Add/Update Interaction
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
                  style={{
                    width: "100%",
                    paddingBottom: "-15px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      {/* <p
                        className="p-1 mb-3 bg-success text-white"
                        style={{ textAlign: "left" }}
                      >
                        Supervisor
                      </p>
                      <div className="form-group row">
                        <div className="col-sm-8">
                          <FormGroup>
                            <SelectValidator
                              label="Supervisor *"
                              helperText=" "
                              variant="outlined"
                              onChange={this.handleChange}
                              name="supervisor"
                              value={this.state.supervisor}
                              validators={["required"]}
                              className="select"
                              errorMessages={["Supervisor is mandatory"]}
                            >
                              {this.state.userlist.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.firstName +
                                      " " +
                                      value.lastName +
                                      " [ Contact Number - " +
                                      value.phone +
                                      " ]"}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                      </div> */}
                      <p
                        className="p-1 mb-3 bg-success text-white"
                        style={{ textAlign: "left" }}
                      >
                        Client Information
                      </p>
                      <div className="form-group row">
                        <div className="col-sm-8">
                          {/* <SelectValidator
                            label="Farmer Name *"
                            variant="outlined"
                            onChange={this.handleChange}
                            name="farmerId"
                            value={this.state.farmerId}
                            validators={["required"]}
                            className="select"
                            errorMessages={["Farmer is mandatory"]}
                          >
                            {this.state.farmerlist.map((value, index) => {
                              return (
                                <option
                                  className="custom-option"
                                  key={index}
                                  value={value._id}
                                >
                                  {value.surname + " " + value.name}
                                </option>
                              );
                            })}
                          </SelectValidator> 
                            <Select
                              options={farmersUpdated}
                              onChange={(values) => {
                                this.getDataByFarmerID(
                                  values && values.length > 0
                                    ? values[0]._id
                                    : ""
                                );
                                this.setState({
                                  farmerId:
                                    values && values.length > 0
                                      ? values[0]._id
                                      : "",
                                });
                              }}
                              labelField="nameIdentiyNumber"
                              valueField="_id"
                              searchable={true}
                              searchBy="nameIdentiyNumber"
                              addPlaceholder="Farmer"
                              keepSelectedInList={true}
                              values={editFarmerObj}
                              placeholder="Select Farmer *"
                              clearable={true}
                              noDataLabel="No matches found"
                              clearOnSelect={true}
                            />
                            <p className="MuiFormHelperText-root MuiFormHelperText-contained">
                              <span>&nbsp;</span>
                            </p>
                          */}
                          {/* <AutoCompleteDDL
                            getTitleName={this.getFarmerName}
                            getTitleId={this.getFarmerId}
                            titleName={farmerName}
                            options={farmersUpdated}
                            getFarmerById={this.getDataByFarmerID.bind(this)}
                          /> */}
                          <button
                            onClick={() => {
                              console.log("clicked");
                              this.setState({
                                isOpenFarmer: true,
                                farmerId: "new",
                              });
                            }}
                            type="button"
                            className="btn btn-primary"
                          >
                            <i className="icon-diff"></i> Select Farmer
                          </button>
                          {/* <Select
                            styles={selectStyles}
                            //value={this.state.setRegion}
                            onChange={this.onchangeSelect}
                            options={municipalityList}
                            getOptionValue={(option) => option._id}
                            getOptionLabel={(option) => option.cndName}
                          /> */}
                          {/* <SelectAsyncPaginate
                            //regionName="The Reach"
                            value={this.state.setFarmerId}
                            onChange={(country) => {
                              console.log("ccc country : ", country);
                              this.setState({ setFarmerId: country._id });
                            }}
                          /> */}
                        </div>
                      </div>
                      <DialogWrapper
                        isOpen={this.state.isOpenFarmer}
                        toggle={() =>
                          this.setState({
                            isOpenFarmer: !this.state.isOpenFarmer,
                          })
                        }
                        size="lg"
                        className="customeModel"
                      >
                        <FarmersListInteraction
                          toggle={() =>
                            this.setState({
                              isOpenFarmer: !this.state.isOpenFarmer,
                            })
                          }
                          farmerId={this.state.farmerId}
                          onFarmerSelect={this.onFarmerSelect.bind(this)}
                        />
                      </DialogWrapper>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <TextValidator
                            label="Surname"
                            variant="outlined"
                            helperText=" "
                            name="surName"
                            value={this.state.surName || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            label="Name"
                            helperText=" "
                            variant="outlined"
                            name="name"
                            value={this.state.name || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            label="Identity Number"
                            helperText=" "
                            variant="outlined"
                            name="identityNumber"
                            value={this.state.identityNumber || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Gender"
                            helperText=" "
                            name="gender"
                            value={this.state.gender || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Age Group"
                            helperText=" "
                            name="ageGroup"
                            value={this.state.ageGroup || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Is Disabled"
                            helperText=" "
                            name="isDisabled"
                            value={this.state.isDisabled || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            label="Farmer Type"
                            helperText=" "
                            variant="outlined"
                            name="farmerType"
                            value={this.state.farmerType || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            label="Contact No"
                            helperText=" "
                            variant="outlined"
                            name="contactNumber"
                            value={this.state.contactNumber || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Farm Name"
                            helperText=" "
                            name="farmName"
                            value={this.state.farmName || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Project Name"
                            helperText=" "
                            name="projectName"
                            value={this.state.projectName || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Total Area"
                            helperText=" "
                            onChange={this.handleChange}
                            name="Total"
                            value={this.state.Total || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-3">
                          <TextValidator
                            variant="outlined"
                            label="Ward Number"
                            helperText=" "
                            name="wardNumber"
                            value={this.state.wardNumber || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-8">
                          <TextValidator
                            variant="outlined"
                            label="Land Ownership"
                            helperText=" "
                            name="ownershipType"
                            value={this.state.ownershipType || ""}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                        <div className="col-sm-4">
                          <button
                            onClick={() => this.setState({ isOpen: true })}
                            type="button"
                            className="btn btn-primary"
                          >
                            <i className="icon-diff"></i> Location -
                            Farm/Project/Household
                          </button>
                        </div>

                        <DialogWrapper
                          isOpen={this.state.isOpen}
                          toggle={() =>
                            this.setState({ isOpen: !this.state.isOpen })
                          }
                          size="lg"
                          className="customeModel"
                        >
                          <LocationMap
                            toggle={() =>
                              this.setState({ isOpen: !this.state.isOpen })
                            }
                            Latitude={Latitude}
                            Longitude={Longitude}
                            mapHeader="Data Captured Location"
                          />
                        </DialogWrapper>
                      </div>
                      <p
                        className="p-1 mb-3 bg-success text-white"
                        style={{ textAlign: "left" }}
                      >
                        Services Rendered
                      </p>
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <FormGroup row>
                            <SelectValidator
                              label="Service Type"
                              variant="outlined"
                              helperText=" "
                              onChange={this.handleChange}
                              name="serviceType"
                              value={this.state.serviceType}
                            >
                              <option
                                className="custom-option"
                                value="Technical Advice"
                              >
                                Technical Advice
                              </option>
                              <option
                                className="custom-option"
                                value="Demonstration"
                              >
                                Demonstration
                              </option>
                              <option
                                className="custom-option"
                                value="Functional Commodity Group"
                              >
                                Functional Commodity Group
                              </option>
                            </SelectValidator>
                            {/*                   
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.state.isTechnicalAdvice}
                                  onChange={this.handleCheck}
                                  name="isTechnicalAdvice"
                                  color="primary"
                                />
                              }
                              label={
                                <span
                                  style={{ color: "black", fontWeight: "bold" }}
                                >
                                  {"Is Technical Advice"}
                                </span>
                              }
                            /> */}
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              // label="Follow-Up Date"
                              helperText="Service Date"
                              onChange={this.handleChange}
                              name="serviceDate"
                              type="date"
                              value={this.state.serviceDate}
                              validators={["checkServiceDate"]}
                              errorMessages={["You have selected past date"]}
                            />
                            {/* <TextValidator
                              variant="outlined"
                              // label="Follow-Up Date"
                              helperText="Technical Advice Date"
                              onChange={this.handleChange}
                              name="technicalAdviceDate"
                              type="date"
                              value={this.state.technicalAdviceDate}
                              // validators={["required"]}
                              // errorMessages={["Start Date is mandatory"]}
                            /> */}
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <span style={{ fontWeight: "bold" }}>
                            Client Signature
                          </span>
                          <FormGroup>
                            {this.state.serviceSignature === "" ? (
                              <img
                                alt=""
                                src={
                                  imagePathUrl +
                                  "NoSignature.png" +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                              ></img>
                            ) : (
                              <img
                                alt=""
                                src={
                                  imagePathUrl +
                                  this.state.serviceSignature +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                                width={"150px"}
                              ></img>
                            )}
                            {/* <img
                              src={
                                this.state.serviceSignature === ""
                                  ? imagePathUrl +
                                    "NoSignature.png" +
                                    "?token=" +
                                    localStorage.getItem("uploadToken")
                                  : imagePathUrl +
                                    this.state.serviceSignature +
                                    "?token=" +
                                    localStorage.getItem("uploadToken")
                              }
                            /> */}
                            {/* <img
                              src={
                                this.state.tdfarmerSignature === ""
                                  ? imagePathUrl +
                                    "NoSignature.png" +
                                    "?token=" +
                                    localStorage.getItem("uploadToken")
                                  : imagePathUrl +
                                    this.state.tdfarmerSignature +
                                    "?token=" +
                                    localStorage.getItem("uploadToken")
                              }
                            /> */}
                          </FormGroup>
                        </div>
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              helperText=" "
                              label="Service Description"
                              onChange={this.handleChange}
                              name="serviceDescription"
                              size="medium"
                              type="textarea"
                              value={this.state.serviceDescription}
                              multiline
                            />
                            {/* <TextValidator
                              variant="outlined"
                              helperText=" "
                              label="Description of Technical Advice"
                              onChange={this.handleChange}
                              name="tdDescription"
                              size="medium"
                              type="textarea"
                              value={this.state.tdDescription}
                              multiline
                            /> */}
                          </FormGroup>
                        </div>
                      </div>

                      <hr />
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              helperText=" "
                              label="Additional Service(s) required/requested"
                              onChange={this.handleChange}
                              name="additionalServices"
                              size="medium"
                              type="textarea"
                              value={this.state.additionalServices}
                              multiline
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <hr />
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              helperText=" "
                              label="Recommendations/Proposals"
                              onChange={this.handleChange}
                              name="proposals"
                              size="medium"
                              type="textarea"
                              value={this.state.proposals}
                              multiline
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <hr />
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              variant="outlined"
                              helperText=" "
                              label="Referral Details (if applicable)"
                              onChange={this.handleChange}
                              name="referralDetails"
                              size="medium"
                              type="textarea"
                              value={this.state.referralDetails}
                              multiline
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <p
                            className="p-1 mb-3 bg-success text-white"
                            style={{ textAlign: "left" }}
                          >
                            Commodity
                          </p>

                          {commodityList.map((value, index) => {
                            return (
                              <label key={index}>
                                <Checkbox
                                  // id={value.cndCode}
                                  name={value.cndName}
                                  onChange={this.handleCheckboxChange.bind(
                                    this,
                                    "commodity"
                                  )}
                                  checked={
                                    this.state.commodity[value.cndName] || false
                                  }
                                  color="primary"
                                />
                                <span>{value.cndName}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      {this.state.commodityOtherField &&
                      this.state.commodityOtherField === true ? (
                        <div className="form-group row">
                          <div className="col-sm-12">
                            <TextValidator
                              variant="outlined"
                              label="Other Specify"
                              onChange={this.handleChange}
                              name="commodityOther"
                              value={this.state.commodityOther}
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <hr />
                      <p
                        className="p-1 mb-2 bg-success text-white"
                        style={{ textAlign: "left" }}
                      >
                        Farmer ID
                      </p>
                      <div className="form-group row">
                        <div
                          className="col-sm-12"
                          style={{ textAlign: "left" }}
                        >
                          <FormGroup>
                            {this.state.farmerDocId ? (
                              <span>
                                <a
                                  target="_blank"
                                  href={
                                    siteConfig.imagesPath +
                                    this.state.farmerDocId +
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
                                {this.state.farmerDocId}
                                <span>&nbsp;&nbsp;</span>
                              </span>
                            ) : (
                              <div>
                                <span style={{ fontWeight: "bold" }}>
                                  {"Farmer ID not available"}
                                </span>
                                <TextValidator
                                  variant="outlined"
                                  // helperText="Required *"
                                  onChange={this.onChange}
                                  name="file"
                                  type="file"
                                  value={this.state.file}
                                />
                              </div>
                            )}
                            {this.state.uploading === true ? (
                              <i className="fa fa-circle-o-notch fa-spin"></i>
                            ) : (
                              ""
                            )}
                          </FormGroup>
                        </div>
                      </div>
                      <hr />
                      <p
                        className="p-1 mb-2 bg-success text-white"
                        style={{ textAlign: "left" }}
                      >
                        Signatures
                      </p>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <span style={{ fontWeight: "bold" }}>
                            Extension Practitioners Signature
                          </span>
                          <FormGroup>
                            {this.state.extensionSignature === "" ? (
                              <img
                                alt=""
                                src={
                                  imagePathUrl +
                                  "NoSignGeneral.png" +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                              />
                            ) : (
                              <img
                                alt=""
                                src={
                                  imagePathUrl +
                                  this.state.extensionSignature +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                                width={"150px"}
                              />
                            )}
                          </FormGroup>
                        </div>
                        <div className="col-sm-6">
                          <span style={{ fontWeight: "bold" }}>
                            Sectional Head’s/Agricultural Manager’s Signature
                          </span>
                          <FormGroup>
                            {this.state.managerSignature === "" ? (
                              <img
                                alt=""
                                src={
                                  imagePathUrl +
                                  "NoSignGeneral.png" +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                              />
                            ) : (
                              <img
                                alt=""
                                src={
                                  imagePathUrl +
                                  this.state.managerSignature +
                                  "?token=" +
                                  localStorage.getItem("uploadToken")
                                }
                                width={"150px"}
                              />
                            )}
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
                        {this.state.id === "new" && (
                          <Button
                            color="primary"
                            type="submit"
                            disabled={this.state.savedisabled}
                          >
                            {this.state.savedisabled
                              ? "Please wait..."
                              : "Save"}
                          </Button>
                        )}
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
export default InteractionForm;
