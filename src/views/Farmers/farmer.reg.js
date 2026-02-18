import React, { Component } from "react";
import { ApiEndPoints } from "../../config";
import TopNavbar from "../../components/Header/top.navbar";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import momentzone from "moment-timezone";
import Footer from "../../components/Footer/footer";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import auth from "../../auth";
import Button from "../../components/CustomButtons/Button.js";
import GridItem from "./../../components/Grid/GridItem.js";
import GridContainer from "./../../components/Grid/GridContainer.js";
import Card from "./../../components/Card/Card.js";
import CardHeader from "./../../components/Card/CardHeader.js";
import CardBody from "./../../components/Card/CardBody.js";

import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";

//import Button from "@material-ui/core/Button";
import commonhelpers from "../../helpers/commonHelper";

const steps = [
  "Producer Personal Details",
  "Farm Production",
  "Assets & Services",
];
class FarmerRegistration extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      action: "",
      tab: 0,
      responseError: "",
      cndlist: [],
      historyDates: [],
      history: "LATEST",
      farmerType: "",
      surname: "",
      name: "",
      identityNumber: "",
      contactNumber: "",
      nationality: "",
      email: "",
      residentialAddress: "",
      residentialPostalcode: "",
      postalAddress: "",
      postalcode: "",
      farmingExperience: "",
      farmingExperienceYears: "",
      ageGroups: "",
      gender: "",
      populationGroup: "",
      populationGroupOther: "",
      populationGroupOtherField: false,
      homeLanguage: "",
      homeLanguageOther: "",
      homeLanguageOtherField: false,
      education: "",
      operationType: "",
      isOwner: "",
      ownershipType: "",
      ownershipTypeOtherField: false,
      landAquisition: "",
      landAquisitionOther: null,
      landAquisitionOtherField: false,
      programmeRedistribution: "",
      programmeRedistributionOther: null,
      programmeRedistributionOtherField: null,
      totalEmp: "",
      maleEmp: "",
      femaleEmp: "",
      youthEmp: "",
      disableEmp: "",

      malePermanent: "",
      femalePermanent: "",
      youthMalePermanent: "",
      youthFemalePermanent: "",

      maleSeasonal: "",
      femaleSeasonal: "",
      youthMaleSeasonal: "",
      youthFemaleSeasonal: "",

      maleContract: "",
      femaleContract: "",
      youthMaleContract: "",
      youthFemaleContract: "",

      noOfEmployees: {},
      parmanentEmployment: {},
      seasonalEmployment: {},
      contractEmployment: {},

      nationalityObj: {},
      ageGroupsObj: {},
      populationGroupObj: {},
      homeLanguageObj: {},
      educationObj: {},
      ownershipTypeObj: {},
      landAquisitionObj: {},
      programmeRedistributionObj: {},

      nationalityName: "",
      ageGroupsName: "",
      populationGroupName: "",
      homeLanguageName: "",
      educationName: "",
      ownershipTypeName: "",
      landAquisitionName: "",
      programmeRedistributionName: "",

      activeStep: 0,

      savedisabled: false,
      saveBtnVisible: true,
      nextBtnVisible: false,

      isDisabled: false,
    };
  }
  handleChange = (event) => {
    var targetStateSet = event.target.name + "OtherField";
    if (
      event.target.name === "populationGroup" ||
      event.target.name === "homeLanguage" ||
      event.target.name === "ownershipType" ||
      event.target.name === "landAquisition" ||
      event.target.name === "programmeRedistribution"
    ) {
      if (event._targetInst.pendingProps.data_id === "Other") {
        this.setState({
          [targetStateSet]: true,
        });
      } else {
        this.setState({
          [targetStateSet]: false,
        });
      }
    }

    if (event.target.name === "maleEmp") {
      const { femaleEmp } = this.state;

      this.setState({
        totalEmp:
          parseInt(femaleEmp == "" ? 0 : femaleEmp) +
          parseInt(event.target.value == "" ? 0 : event.target.value),
      });
    }
    if (event.target.name === "femaleEmp") {
      const { maleEmp } = this.state;

      this.setState({
        totalEmp:
          parseInt(maleEmp == "" ? 0 : maleEmp) +
          parseInt(event.target.value == "" ? 0 : event.target.value),
      });
    }

    //below condition added on 19-mar-2021 by sandesh for ddl names to state

    if (event.target.name === "nationality") {
      this.setState({
        nationalityName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "ageGroups") {
      this.setState({
        ageGroupsName: event._targetInst.pendingProps.data_id,
      });
    }

    if (event.target.name === "populationGroup") {
      this.setState({
        populationGroupName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "homeLanguage") {
      this.setState({
        homeLanguageName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "education") {
      this.setState({
        educationName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "ownershipType") {
      this.setState({
        ownershipTypeName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "landAquisition") {
      this.setState({
        landAquisitionName: event._targetInst.pendingProps.data_id,
      });
    }
    if (event.target.name === "programmeRedistribution") {
      this.setState({
        programmeRedistributionName: event._targetInst.pendingProps.data_id,
      });
    }

    if (event._targetInst.pendingProps.data_id === "Other") {
      this.setState({
        [targetStateSet]: true,
      });
    } else {
      this.setState({
        [targetStateSet]: false,
      });
    }

    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeHistory = (event) => {
    this.getHistoryData(event.target.value);
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /*handlettabChange = (event, newValue) => {
    console.log("event", event);
    this.setState({
      tab: newValue
    });
  };
  */

  changeActionState(value) {
    this.setState({
      action: value,
    });
  }

  handleSubmit = (event) => {
    //this.props.history.push("/farmer-production/dfdfdfd");
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = this.state;
    formpojo.parentCustomer = "5e380d7aa2eee117b4d423ad"; // need to get from Agen login data
    // formpojo.password = Math.random().toString(36).substring(7);
    formpojo.password = "dardlea@123";
    //console.log("formpojo", formpojo);
    formpojo.noOfEmployees = {
      totalEmp: formpojo.totalEmp ? formpojo.totalEmp : 0,
      Male: formpojo.maleEmp ? formpojo.maleEmp : 0,
      Female: formpojo.femaleEmp ? formpojo.femaleEmp : 0,
      Youth: formpojo.youthEmp ? formpojo.youthEmp : 0,
      "With Disability": formpojo.disableEmp ? formpojo.disableEmp : 0,
    };
    formpojo.parmanentEmployment = {
      Male: formpojo.malePermanent ? formpojo.malePermanent : 0,
      Female: formpojo.femalePermanent ? formpojo.femalePermanent : 0,
      "Youth Male": formpojo.youthMalePermanent
        ? formpojo.youthMalePermanent
        : 0,
      "Youth Female": formpojo.youthFemalePermanent
        ? formpojo.youthFemalePermanent
        : 0,
    };

    formpojo.seasonalEmployment = {
      Male: formpojo.maleSeasonal ? formpojo.maleSeasonal : 0,
      Female: formpojo.femaleSeasonal ? formpojo.femaleSeasonal : 0,
      "Youth Male": formpojo.youthMaleSeasonal ? formpojo.youthMaleSeasonal : 0,
      "Youth Female": formpojo.youthFemaleSeasonal
        ? formpojo.youthFemaleSeasonal
        : 0,
    };
    formpojo.contractEmployment = {
      Male: formpojo.maleContract ? formpojo.maleContract : 0,
      Female: formpojo.femaleContract ? formpojo.femaleContract : 0,
      "Youth Male": formpojo.youthMaleContract ? formpojo.youthMaleContract : 0,
      "Youth Female": formpojo.youthFemaleContract
        ? formpojo.youthFemaleContract
        : 0,
    };
    if (formpojo.landAquisition === "") formpojo.landAquisition = null;

    if (formpojo.programmeRedistribution === "")
      formpojo.programmeRedistribution = null;

    if (formpojo.ownershipType === "") formpojo.ownershipType = null;

    formpojo.nationalityObj = {
      _id: formpojo.nationality,
      cndName: formpojo.nationalityName,
    };
    formpojo.ageGroupsObj = {
      _id: formpojo.ageGroups,
      cndName: formpojo.ageGroupsName,
    };
    formpojo.populationGroupObj = {
      _id: formpojo.populationGroup,
      cndName: formpojo.populationGroupName,
    };
    formpojo.homeLanguageObj = {
      _id: formpojo.homeLanguage,
      cndName: formpojo.homeLanguageName,
    };
    formpojo.educationObj = {
      _id: formpojo.education,
      cndName: formpojo.educationName,
    };
    formpojo.ownershipTypeObj = {
      _id: formpojo.ownershipType,
      cndName: formpojo.ownershipTypeName,
    };
    formpojo.landAquisitionObj = {
      _id: formpojo.landAquisition,
      cndName: formpojo.landAquisitionName,
    };
    formpojo.programmeRedistributionObj = {
      _id: formpojo.programmeRedistribution,
      cndName: formpojo.programmeRedistributionName,
    };

    console.log("formpojoUpdate", formpojo);
    fetch(ApiEndPoints.farmerRegistration, {
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
          console.log("data for prod :xxx x : ", data);
          var farmerId = this.props.match.params.farmerId;
          console.log("farmerId :xxx x : ", farmerId);
          if (!farmerId) {
            this.props.history.push("/farmer-production/" + data.result._id);
          } else {
            this.props.history.push("/farmer-production/" + farmerId);
          }
          //this.props.history.push("/farmers-data");
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

  getHistoryDates() {
    var farmerId = this.props.match.params.farmerId;
    if (farmerId) {
      fetch(ApiEndPoints.farmerDetailsHistory + "?farmerId=" + farmerId, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success === true) {
            this.setState({ historyDates: data.result });
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

  getHistoryData(value) {
    console.log("history Id : ", value);
    if (value && value === "LATEST") {
      this.setState({ saveBtnVisible: true });
      //get farmer by id
      var farmerId = this.props.match.params.farmerId;
      if (farmerId) {
        fetch(ApiEndPoints.farmersList + "?farmerId=" + farmerId, {
          method: "GET",
          headers: { "x-auth-token": auth.getJwt() },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("farmer data:", data.result[0].farmerType);

            if (data && data.success === true && data.result.length > 0) {
              this.setState({
                farmerType: data.result[0].farmerType,
                surname: data.result[0].surname,
                name: data.result[0].name,
                identityNumber: data.result[0].identityNumber,
                contactNumber: data.result[0].contactNumber,
                nationality: data.result[0].nationality,
                email: data.result[0].email,
                residentialAddress: data.result[0].residentialAddress,
                residentialPostalcode: data.result[0].residentialPostalcode,
                postalAddress: data.result[0].postalAddress,
                postalcode: data.result[0].postalcode,
                farmingExperience: data.result[0].farmingExperience,
                farmingExperienceYears: data.result[0].farmingExperienceYears,
                ageGroups: data.result[0].ageGroups,
                gender: data.result[0].gender,
                populationGroup: data.result[0].populationGroup,
                populationGroupOther: data.result[0].populationGroupOther,
                populationGroupOtherField:
                  data.result[0].populationGroupOtherField,
                homeLanguage: data.result[0].homeLanguage,
                homeLanguageOther: data.result[0].homeLanguageOther,
                homeLanguageOtherField: data.result[0].homeLanguageOtherField,
                education: data.result[0].education,
                operationType: data.result[0].operationType,
                isOwner: data.result[0].isOwner,
                ownershipType: data.result[0].ownershipType,
                ownershipTypeOtherField: data.result[0].ownershipTypeOtherField,
                landAquisition: data.result[0].landAquisition,
                landAquisitionOther: data.result[0].landAquisitionOther,
                landAquisitionOtherField:
                  data.result[0].landAquisitionOtherField,
                programmeRedistribution: data.result[0].programmeRedistribution,
                programmeRedistributionOther:
                  data.result[0].programmeRedistributionOther,
                programmeRedistributionOtherField:
                  data.result[0].programmeRedistributionOtherField,

                maleEmp: data.result[0].noOfEmployees.Male,
                femaleEmp: data.result[0].noOfEmployees.Female,
                totalEmp: data.result[0].noOfEmployees.totalEmp,
                youthEmp: data.result[0].noOfEmployees.Youth,
                disableEmp: data.result[0].noOfEmployees["With Disability"],

                malePermanent: data.result[0].parmanentEmployment.Male,
                femalePermanent: data.result[0].parmanentEmployment.Female,
                youthMalePermanent:
                  data.result[0].parmanentEmployment["Youth Male"],
                youthFemalePermanent:
                  data.result[0].parmanentEmployment["Youth Female"],

                maleSeasonal: data.result[0].seasonalEmployment.Male,
                femaleSeasonal: data.result[0].seasonalEmployment.Female,
                youthMaleSeasonal:
                  data.result[0].seasonalEmployment["Youth Male"],
                youthFemaleSeasonal:
                  data.result[0].seasonalEmployment["Youth Female"],

                maleContract: data.result[0].contractEmployment.Male,
                femaleContract: data.result[0].contractEmployment.Female,
                youthMaleContract:
                  data.result[0].contractEmployment["Youth Male"],
                youthFemaleContract:
                  data.result[0].contractEmployment["Youth Female"],

                id: data.result[0]._id,

                nationalityName:
                  data.result[0].nationalityObj &&
                  data.result[0].nationalityObj !== null &&
                  data.result[0].nationalityObj !== undefined
                    ? data.result[0].nationalityObj.cndName
                    : "",
                ageGroupsName:
                  data.result[0].ageGroupsObj &&
                  data.result[0].ageGroupsObj !== null &&
                  data.result[0].ageGroupsObj !== undefined
                    ? data.result[0].ageGroupsObj.cndName
                    : "",
                populationGroupName:
                  data.result[0].populationGroupObj &&
                  data.result[0].populationGroupObj !== null &&
                  data.result[0].populationGroupObj !== undefined
                    ? data.result[0].populationGroupObj.cndName
                    : "",
                homeLanguageName:
                  data.result[0].homeLanguageObj &&
                  data.result[0].homeLanguageObj !== null &&
                  data.result[0].homeLanguageObj !== undefined
                    ? data.result[0].homeLanguageObj.cndName
                    : "",
                educationName:
                  data.result[0].educationObj &&
                  data.result[0].educationObj !== null &&
                  data.result[0].educationObj !== undefined
                    ? data.result[0].educationObj.cndName
                    : "",
                ownershipTypeName:
                  data.result[0].ownershipTypeObj &&
                  data.result[0].ownershipTypeObj !== null &&
                  data.result[0].ownershipTypeObj !== undefined
                    ? data.result[0].ownershipTypeObj.cndName
                    : "",
                landAquisitionName:
                  data.result[0].landAquisitionObj &&
                  data.result[0].landAquisitionObj !== null &&
                  data.result[0].landAquisitionObj !== undefined
                    ? data.result[0].landAquisitionObj.cndName
                    : "",
                programmeRedistributionName:
                  data.result[0].programmeRedistributionObj &&
                  data.result[0].programmeRedistributionObj !== null &&
                  data.result[0].programmeRedistributionObj !== undefined
                    ? data.result[0].programmeRedistributionObj.cndName
                    : "",
                isDisabled: data.result[0].isDisabled,
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
    } else if (value && value !== "LATEST") {
      this.setState({ saveBtnVisible: false });

      fetch(ApiEndPoints.farmerDetailsHistory + "?id=" + value, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data history : ", data);
          if (data && data.success === true && data.result.length > 0) {
            this.setState({
              farmerType: data.result[0].farmerType,
              surname: data.result[0].surname,
              name: data.result[0].name,
              identityNumber: data.result[0].identityNumber,
              contactNumber: data.result[0].contactNumber,
              nationality: data.result[0].nationality,
              email: data.result[0].email,
              residentialAddress: data.result[0].residentialAddress,
              residentialPostalcode: data.result[0].residentialPostalcode,
              postalAddress: data.result[0].postalAddress,
              postalcode: data.result[0].postalcode,
              farmingExperience: data.result[0].farmingExperience,
              farmingExperienceYears: data.result[0].farmingExperienceYears,
              ageGroups: data.result[0].ageGroups,
              gender: data.result[0].gender,
              populationGroup: data.result[0].populationGroup,
              populationGroupOther: data.result[0].populationGroupOther,
              populationGroupOtherField:
                data.result[0].populationGroupOtherField,
              homeLanguage: data.result[0].homeLanguage,
              homeLanguageOther: data.result[0].homeLanguageOther,
              homeLanguageOtherField: data.result[0].homeLanguageOtherField,
              education: data.result[0].education,
              operationType: data.result[0].operationType,
              isOwner: data.result[0].isOwner,
              ownershipType: data.result[0].ownershipType,
              ownershipTypeOtherField: data.result[0].ownershipTypeOtherField,
              landAquisition: data.result[0].landAquisition,
              landAquisitionOther: data.result[0].landAquisitionOther,
              landAquisitionOtherField: data.result[0].landAquisitionOtherField,
              programmeRedistribution: data.result[0].programmeRedistribution,
              programmeRedistributionOther:
                data.result[0].programmeRedistributionOther,
              programmeRedistributionOtherField:
                data.result[0].programmeRedistributionOtherField,

              maleEmp: data.result[0].noOfEmployees.Male,
              femaleEmp: data.result[0].noOfEmployees.Female,
              totalEmp: data.result[0].noOfEmployees.totalEmp,
              youthEmp: data.result[0].noOfEmployees.Youth,
              disableEmp: data.result[0].noOfEmployees["With Disability"],

              malePermanent: data.result[0].parmanentEmployment.Male,
              femalePermanent: data.result[0].parmanentEmployment.Female,
              youthMalePermanent:
                data.result[0].parmanentEmployment["Youth Male"],
              youthFemalePermanent:
                data.result[0].parmanentEmployment["Youth Female"],

              maleSeasonal: data.result[0].seasonalEmployment.Male,
              femaleSeasonal: data.result[0].seasonalEmployment.Female,
              youthMaleSeasonal:
                data.result[0].seasonalEmployment["Youth Male"],
              youthFemaleSeasonal:
                data.result[0].seasonalEmployment["Youth Female"],

              maleContract: data.result[0].contractEmployment.Male,
              femaleContract: data.result[0].contractEmployment.Female,
              youthMaleContract:
                data.result[0].contractEmployment["Youth Male"],
              youthFemaleContract:
                data.result[0].contractEmployment["Youth Female"],

              id: data.result[0].farmerId,

              nationalityName:
                data.result[0].nationalityObj &&
                data.result[0].nationalityObj !== null &&
                data.result[0].nationalityObj !== undefined
                  ? data.result[0].nationalityObj.cndName
                  : "",
              ageGroupsName:
                data.result[0].ageGroupsObj &&
                data.result[0].ageGroupsObj !== null &&
                data.result[0].ageGroupsObj !== undefined
                  ? data.result[0].ageGroupsObj.cndName
                  : "",
              populationGroupName:
                data.result[0].populationGroupObj &&
                data.result[0].populationGroupObj !== null &&
                data.result[0].populationGroupObj !== undefined
                  ? data.result[0].populationGroupObj.cndName
                  : "",
              homeLanguageName:
                data.result[0].homeLanguageObj &&
                data.result[0].homeLanguageObj !== null &&
                data.result[0].homeLanguageObj !== undefined
                  ? data.result[0].homeLanguageObj.cndName
                  : "",
              educationName:
                data.result[0].educationObj &&
                data.result[0].educationObj !== null &&
                data.result[0].educationObj !== undefined
                  ? data.result[0].educationObj.cndName
                  : "",
              ownershipTypeName:
                data.result[0].ownershipTypeObj &&
                data.result[0].ownershipTypeObj !== null &&
                data.result[0].ownershipTypeObj !== undefined
                  ? data.result[0].ownershipTypeObj.cndName
                  : "",
              landAquisitionName:
                data.result[0].landAquisitionObj &&
                data.result[0].landAquisitionObj !== null &&
                data.result[0].landAquisitionObj !== undefined
                  ? data.result[0].landAquisitionObj.cndName
                  : "",
              programmeRedistributionName:
                data.result[0].programmeRedistributionObj &&
                data.result[0].programmeRedistributionObj !== null &&
                data.result[0].programmeRedistributionObj !== undefined
                  ? data.result[0].programmeRedistributionObj.cndName
                  : "",
              isDisabled: data.result[0].isDisabled,
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

  componentDidMount() {
    window.scrollTo(0, 0);

    //  commonhelpers.captureLogActivity('Farmers Registeration : Basic Info','Add','Farmers KYC','Farmer Basic Info',window.location.href,'Farmer Basic Info section accessed by '+ localStorage.getItem("userName"))
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

    this.getHistoryDates();

    //get farmer by id
    var farmerId = this.props.match.params.farmerId;
    if (farmerId) {
      fetch(ApiEndPoints.farmersListById + "/" + farmerId, {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("farmer data:", data);
          // console.log("data.result[0].education :", data.result[0].education);
          if (data && data.success === true && data.result.length > 0) {
            this.setState({ nextBtnVisible: true });

            this.setState({
              farmerType: data.result[0].farmerType,
              surname: data.result[0].surname,
              name: data.result[0].name,
              identityNumber: data.result[0].identityNumber,
              contactNumber: data.result[0].contactNumber,
              nationality: data.result[0].nationality,
              email: data.result[0].email,
              residentialAddress: data.result[0].residentialAddress,
              residentialPostalcode: data.result[0].residentialPostalcode,
              postalAddress: data.result[0].postalAddress,
              postalcode: data.result[0].postalcode,
              farmingExperience: data.result[0].farmingExperience,
              farmingExperienceYears: data.result[0].farmingExperienceYears,
              ageGroups: data.result[0].ageGroups,
              gender: data.result[0].gender,
              populationGroup: data.result[0].populationGroup,
              populationGroupOther: data.result[0].populationGroupOther,
              populationGroupOtherField:
                data.result[0].populationGroupOtherField,
              homeLanguage: data.result[0].homeLanguage,
              homeLanguageOther: data.result[0].homeLanguageOther,
              homeLanguageOtherField: data.result[0].homeLanguageOtherField,
              education: data.result[0].education,
              operationType: data.result[0].operationType,
              isOwner: data.result[0].isOwner,
              ownershipType: data.result[0].ownershipType,
              ownershipTypeOtherField: data.result[0].ownershipTypeOtherField,
              landAquisition: data.result[0].landAquisition,
              landAquisitionOther: data.result[0].landAquisitionOther,
              landAquisitionOtherField: data.result[0].landAquisitionOtherField,
              programmeRedistribution: data.result[0].programmeRedistribution,
              programmeRedistributionOther:
                data.result[0].programmeRedistributionOther,
              programmeRedistributionOtherField:
                data.result[0].programmeRedistributionOtherField,

              maleEmp: data.result[0].noOfEmployees.Male,
              femaleEmp: data.result[0].noOfEmployees.Female,
              totalEmp: data.result[0].noOfEmployees.totalEmp,

              youthEmp: data.result[0].noOfEmployees.Youth,
              disableEmp: data.result[0].noOfEmployees["With Disability"],

              malePermanent: data.result[0].parmanentEmployment.Male,
              femalePermanent: data.result[0].parmanentEmployment.Female,
              youthMalePermanent:
                data.result[0].parmanentEmployment["Youth Male"],
              youthFemalePermanent:
                data.result[0].parmanentEmployment["Youth Female"],

              maleSeasonal: data.result[0].seasonalEmployment.Male,
              femaleSeasonal: data.result[0].seasonalEmployment.Female,
              youthMaleSeasonal:
                data.result[0].seasonalEmployment["Youth Male"],
              youthFemaleSeasonal:
                data.result[0].seasonalEmployment["Youth Female"],

              maleContract: data.result[0].contractEmployment.Male,
              femaleContract: data.result[0].contractEmployment.Female,
              youthMaleContract:
                data.result[0].contractEmployment["Youth Male"],
              youthFemaleContract:
                data.result[0].contractEmployment["Youth Female"],

              id: data.result[0]._id,

              nationalityName:
                data.result[0].nationalityObj &&
                data.result[0].nationalityObj !== null &&
                data.result[0].nationalityObj !== undefined
                  ? data.result[0].nationalityObj.cndName
                  : "",
              ageGroupsName:
                data.result[0].ageGroupsObj &&
                data.result[0].ageGroupsObj !== null &&
                data.result[0].ageGroupsObj !== undefined
                  ? data.result[0].ageGroupsObj.cndName
                  : "",
              populationGroupName:
                data.result[0].populationGroupObj &&
                data.result[0].populationGroupObj !== null &&
                data.result[0].populationGroupObj !== undefined
                  ? data.result[0].populationGroupObj.cndName
                  : "",
              homeLanguageName:
                data.result[0].homeLanguageObj &&
                data.result[0].homeLanguageObj !== null &&
                data.result[0].homeLanguageObj !== undefined
                  ? data.result[0].homeLanguageObj.cndName
                  : "",
              educationName:
                data.result[0].educationObj &&
                data.result[0].educationObj !== null &&
                data.result[0].educationObj !== undefined
                  ? data.result[0].educationObj.cndName
                  : "",
              ownershipTypeName:
                data.result[0].ownershipTypeObj &&
                data.result[0].ownershipTypeObj !== null &&
                data.result[0].ownershipTypeObj !== undefined
                  ? data.result[0].ownershipTypeObj.cndName
                  : "",
              landAquisitionName:
                data.result[0].landAquisitionObj &&
                data.result[0].landAquisitionObj !== null &&
                data.result[0].landAquisitionObj !== undefined
                  ? data.result[0].landAquisitionObj.cndName
                  : "",
              programmeRedistributionName:
                data.result[0].programmeRedistributionObj &&
                data.result[0].programmeRedistributionObj !== null &&
                data.result[0].programmeRedistributionObj !== undefined
                  ? data.result[0].programmeRedistributionObj.cndName
                  : "",
              isDisabled: data.result[0].isDisabled,
            });

            // this.setState(prevState => ({
            //   noOfEmployees: {
            //     // object that we want to update
            //     ...prevState.noOfEmployees, // keep all other key-value pairs
            //     totalEmp: data.result[0].noOfEmployees.Total // update the value of specific key
            //   }
            // }));
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
    } else {
      this.setState({ nextBtnVisible: false });
    }
  }

  handleNext(event) {
    event.preventDefault();

    var farmerId = this.props.match.params.farmerId;

    this.props.history.push("/farmer-production/" + farmerId);
  }

  render() {
    const { /*email, password,*/ cndlist } = this.state;
    let nationality = cndlist
      ? cndlist.filter((data) => data.cndGroup === "Nationality")
      : [];
    nationality.sort(auth.sortValues("cndName"));

    let ageGroups = cndlist.filter((data) => data.cndGroup === "AgeGroups");
    ageGroups.sort(auth.sortValues("cndName"));

    let populationGroup = cndlist.filter(
      (data) => data.cndGroup === "PopulationGroup"
    );
    populationGroup.sort(auth.sortValues("cndName"));

    let homeLanguage = cndlist
      ? cndlist.filter((data) => data.cndGroup === "HomeLanguage")
      : [];
    homeLanguage.sort(auth.sortValues("cndName"));

    let education = cndlist.filter((data) => data.cndGroup === "Education");
    education.sort(auth.sortValues("cndName"));

    let ownershipType = cndlist.filter(
      (data) => data.cndGroup === "OwnershipType"
    );
    ownershipType.sort(auth.sortValues("cndName"));

    let programmeRedistribution = cndlist.filter(
      (data) => data.cndGroup === "ProgrammeRedistribution"
    );
    programmeRedistribution.sort(auth.sortValues("cndName"));

    let landAquisition = cndlist.filter(
      (data) => data.cndGroup === "LandAquisition"
    );
    landAquisition.sort(auth.sortValues("cndName"));

    let saveBtnStyle =
      this.state.saveBtnVisible === true
        ? { display: "block" }
        : { display: "none" };

    let nextBtnStyle =
      this.state.nextBtnVisible === true
        ? { display: "block" }
        : { display: "none" };

    //console.log("nationality", nationality);
    //console.log("populationGroup", populationGroup);
    // console.log("ageGroups", ageGroups);
    let totalEmpMax = this.state.totalEmp == "" ? 0 : this.state.totalEmp;

    return (
      <div className="card container py-3">
        <ValidatorForm
          ref="form"
          instantValidate
          //onError={errors => console.log(errors)}
          onSubmit={this.handleSubmitHistory}
        >
          <div className="headerP">
            <span className="farmerTitle">Farmer Registration</span>
          </div>

          <SelectValidator
            style={{ width: 200 }}
            label="History"
            //helperText="Enter your nationality*"
            variant="outlined"
            onChange={this.handleChangeHistory}
            name="history"
            value={this.state.history}
            className="select headerSelect"
          >
            <option className="custom-option" value="LATEST">
              LATEST
            </option>
            {this.state.historyDates.map((value, index) => {
              return (
                <option className="custom-option" key={index} value={value._id}>
                  {moment
                    .tz(value.createdDate, moment.tz.guess())
                    .format("DD/MM/YYYY H:mm")}
                  {/* {moment(value.createdDate).format("DD/MM/YYYY H:mm")} */}
                </option>
              );
            })}
          </SelectValidator>
        </ValidatorForm>
        <span className="error-msg">{this.state.responseError}</span>
        <Stepper activeStep={this.state.activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            return (
              <Step key={index} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <ValidatorForm
          ref="form"
          instantValidate
          //onError={errors => console.log(errors)}
          onSubmit={this.handleSubmit}
        >
          <div className="row">
            <div className="col-md-12 mx-auto">
              <p
                className="p-1 mb-3 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Section 1 - Producer Personal Details
              </p>

              <div className="form-group row">
                <div className="col-sm-4">
                  <TextValidator
                    label="Surname *"
                    variant="outlined"
                    helperText=" "
                    onChange={this.handleChange}
                    //onBlur={this.handleChange}
                    name="surname"
                    value={this.state.surname}
                    validators={["required"]}
                    errorMessages={["Surname is mandatory"]}
                  />
                </div>
                <div className="col-sm-4">
                  <TextValidator
                    label="Name *"
                    helperText=" "
                    variant="outlined"
                    onChange={this.handleChange}
                    name="name"
                    value={this.state.name}
                    validators={["required"]}
                    errorMessages={["Name is mandatory"]}
                  />
                </div>
                <div className="col-sm-4">
                  <TextValidator
                    label="Email"
                    variant="outlined"
                    helperText=" "
                    onChange={this.handleChange}
                    name="email"
                    value={this.state.email}
                    validators={["isEmail"]}
                    errorMessages={["Please enter valid email format"]}
                  />
                </div>

                <div className="col-sm-3">
                  <TextValidator
                    label="Identity Number *"
                    helperText=" "
                    variant="outlined"
                    onChange={this.handleChange}
                    name="identityNumber"
                    value={this.state.identityNumber}
                    validators={["required", "matchRegexp:^[a-zA-Z0-9]{13}$"]}
                    errorMessages={[
                      "Identity Number is mandatory",
                      "Identity number should be 13 digits",
                    ]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Contact No *"
                    helperText=" "
                    variant="outlined"
                    onChange={this.handleChange}
                    name="contactNumber"
                    value={this.state.contactNumber}
                    validators={["required", "isNumber"]}
                    errorMessages={[
                      "Contact Number is mandatory",
                      "It Should be numeric",
                    ]}
                  />
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    label="Nationality *"
                    helperText=" "
                    variant="outlined"
                    onChange={this.handleChange}
                    name="nationality"
                    value={this.state.nationality}
                    validators={["required"]}
                    className="select"
                    errorMessages={["Nationality is mandatory"]}
                  >
                    {nationality.map((value, index) => {
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

                <div className="col-sm-3">
                  <SelectValidator
                    label="Farmer Type *"
                    variant="outlined"
                    helperText=" "
                    onChange={this.handleChange}
                    name="farmerType"
                    validators={["required"]}
                    errorMessages={["Please select farmer type"]}
                    value={this.state.farmerType}
                  >
                    <option className="custom-option" value="Commercial">
                      Commercial
                    </option>
                    <option className="custom-option" value="Smallholder">
                      Smallholder
                    </option>
                    <option className="custom-option" value="Subsistence">
                      Subsistence
                    </option>
                  </SelectValidator>
                </div>
              </div>

              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Farm/Residential Address
              </h6>
              <div className="form-group row">
                <div className="col-sm-10">
                  <TextValidator
                    label="Farm/Residential Address *"
                    onChange={this.handleChange}
                    variant="outlined"
                    name="residentialAddress"
                    value={this.state.residentialAddress}
                    validators={["required"]}
                    errorMessages={["Please enter Farm/Residential Address"]}
                    helperText=" "
                  />
                </div>
                <div className="col-sm-2">
                  <TextValidator
                    label="Postal Code *"
                    onChange={this.handleChange}
                    variant="outlined"
                    name="residentialPostalcode"
                    value={this.state.residentialPostalcode}
                    validators={["required"]}
                    errorMessages={["Please enter Postal Code"]}
                    helperText=" "
                  />
                </div>
              </div>

              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Postal Address
              </h6>
              <div className="form-group row">
                <div className="col-sm-10">
                  <TextValidator
                    variant="outlined"
                    label="Postal Address *"
                    onChange={this.handleChange}
                    name="postalAddress"
                    value={this.state.postalAddress}
                    validators={["required"]}
                    errorMessages={["Please enter Postal Address"]}
                    helperText=" "
                  />
                </div>
                <div className="col-sm-2">
                  <TextValidator
                    label="Postal Code *"
                    onChange={this.handleChange}
                    variant="outlined"
                    name="postalcode"
                    value={this.state.postalcode}
                    validators={["required"]}
                    errorMessages={["Please enter Postal Code"]}
                    helperText=" "
                  />
                </div>
              </div>
              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Farming Experience
              </h6>
              <div className="form-group row">
                <div className="col-sm-10">
                  <TextValidator
                    label="Farming Experience *"
                    variant="outlined"
                    onChange={this.handleChange}
                    name="farmingExperience"
                    value={this.state.farmingExperience}
                    validators={["required"]}
                    errorMessages={["Please enter Farming Experience"]}
                    helperText=" "
                  />
                </div>
                <div className="col-sm-2">
                  <TextValidator
                    label="Years *"
                    onChange={this.handleChange}
                    variant="outlined"
                    name="farmingExperienceYears"
                    value={this.state.farmingExperienceYears}
                    validators={["required"]}
                    errorMessages={["Please enter Years"]}
                    type="number"
                    helperText=" "
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Select Age Group *"
                    helperText="Select your Age Group *"
                    onChange={this.handleChange}
                    name="ageGroups"
                    validators={["required"]}
                    errorMessages={["Please select Age Group"]}
                    value={this.state.ageGroups}
                  >
                    {ageGroups.map((value, index) => {
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
                <div className="col-sm-3">
                  <SelectValidator
                    label="Gender *"
                    variant="outlined"
                    helperText="Select your gender *"
                    onChange={this.handleChange}
                    name="gender"
                    validators={["required"]}
                    errorMessages={["Please select gender"]}
                    value={this.state.gender}
                  >
                    <option className="custom-option" value="Male">
                      Male
                    </option>
                    <option className="custom-option" value="Female">
                      Female
                    </option>
                  </SelectValidator>
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Is Disabled *"
                    helperText="Are you disabled *"
                    onChange={this.handleChange}
                    name="isDisabled"
                    validators={["required"]}
                    errorMessages={["Please select yes or no"]}
                    value={this.state.isDisabled}
                  >
                    <option className="custom-option" value={true}>
                      Yes
                    </option>
                    <option className="custom-option" value={false}>
                      No
                    </option>
                  </SelectValidator>
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Population Group *"
                    helperText="Select your Population Group *"
                    onChange={this.handleChange}
                    name="populationGroup"
                    validators={["required"]}
                    errorMessages={["Please select population group"]}
                    value={this.state.populationGroup}
                  >
                    {populationGroup.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          data_id={value.cndName}
                          value={value._id}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>

                {this.state.populationGroupOtherField &&
                this.state.populationGroupOtherField === true ? (
                  <div className="col-sm-3">
                    <TextValidator
                      variant="outlined"
                      label="Population Group(Other, Specify)"
                      onChange={this.handleChange}
                      name="populationGroupOther"
                      value={this.state.populationGroupOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="form-group row">
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Home Language *"
                    helperText="Select your Home Language *"
                    onChange={this.handleChange}
                    name="homeLanguage"
                    validators={["required"]}
                    errorMessages={["Please select Home Language"]}
                    value={this.state.homeLanguage}
                  >
                    {homeLanguage.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          data_id={value.cndName}
                          value={value._id}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>
                {this.state.homeLanguageOtherField &&
                this.state.homeLanguageOtherField === true ? (
                  <div className="col-sm-3">
                    <TextValidator
                      variant="outlined"
                      label="Home Language (Other, Specify)"
                      onChange={this.handleChange}
                      name="homeLanguageOther"
                      value={this.state.homeLanguageOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Education *"
                    helperText="Highest level of formal education obtained *"
                    onChange={this.handleChange}
                    name="education"
                    validators={["required"]}
                    errorMessages={["Please select education"]}
                    value={this.state.education}
                  >
                    {education.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          data_id={value.cndName}
                          value={value._id}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Operating Type *"
                    helperText="Operating the farm on a full-time or part-time
                            basis? *"
                    onChange={this.handleChange}
                    name="operationType"
                    validators={["required"]}
                    errorMessages={["Please select Operating Type"]}
                    value={this.state.operationType}
                  >
                    <option className="custom-option" value="Full-time">
                      Full-time{" "}
                    </option>
                    <option className="custom-option" value="Part-time">
                      Part-time
                    </option>
                  </SelectValidator>
                </div>

                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Is Owner *"
                    helperText="Are you the owner of
                            the farm or land*"
                    onChange={this.handleChange}
                    name="isOwner"
                    validators={["required"]}
                    errorMessages={["Please select yes or no"]}
                    value={this.state.isOwner}
                  >
                    <option className="custom-option" value={true}>
                      Yes
                    </option>
                    <option className="custom-option" value={false}>
                      No
                    </option>
                  </SelectValidator>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Ownership Type"
                    helperText="Select your Ownership Type"
                    onChange={this.handleChange}
                    name="ownershipType"
                    /* validators={["required"]}
                            errorMessages={["Please select Ownership Type"]} */
                    value={this.state.ownershipType}
                  >
                    {/* <option value={null}>Select</option>; */}
                    {ownershipType.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          data_id={value.cndName}
                          value={value._id}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>
                {this.state.ownershipTypeOtherField &&
                this.state.ownershipTypeOtherField === true ? (
                  <div className="col-sm-3">
                    <TextValidator
                      variant="outlined"
                      label="Ownership Type (Other, Specify)"
                      onChange={this.handleChange}
                      name="otherOwnerShip"
                      value={this.state.otherOwnerShip}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Land Aquisition"
                    helperText="How was this farm or land acquired "
                    onChange={this.handleChange}
                    name="landAquisition"
                    /* validators={["required"]}
                            errorMessages={["Please select Land Aquisition"]}
                            */
                    value={this.state.landAquisition}
                  >
                    {/* <option value={""}>Select</option>; */}
                    {landAquisition.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          data_id={value.cndName}
                          value={value._id}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>

                <div className="col-sm-3">
                  <SelectValidator
                    variant="outlined"
                    label="Redistribution programme"
                    helperText="If by redistribution,
                            which programme?"
                    onChange={this.handleChange}
                    name="programmeRedistribution"
                    /* validators={["required"]}
                            errorMessages={[
                              "Please select Redistribution programme"
                            ]}
                            */
                    value={this.state.programmeRedistribution}
                  >
                    {/* <option value={""}>Select</option>; */}
                    {programmeRedistribution.map((value, index) => {
                      return (
                        <option
                          className="custom-option"
                          key={index}
                          data_id={value.cndName}
                          value={value._id}
                        >
                          {value.cndName}
                        </option>
                      );
                    })}
                  </SelectValidator>
                </div>

                {this.state.landAquisitionOtherField &&
                this.state.landAquisitionOtherField === true ? (
                  <div className="col-sm-3">
                    <TextValidator
                      variant="outlined"
                      label="Land Aquisition (Other, Specify)"
                      onChange={this.handleChange}
                      name="landAquisitionOther"
                      value={this.state.landAquisitionOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                ) : (
                  ""
                )}

                {this.state.programmeRedistributionOtherField &&
                this.state.programmeRedistributionOtherField === true ? (
                  <div className="col-sm-3">
                    <TextValidator
                      variant="outlined"
                      label="Redistribution programme (Other, Specify)"
                      onChange={this.handleChange}
                      name="programmeRedistributionOther"
                      value={this.state.programmeRedistributionOther}
                      /*validators={["required"]}
                            errorMessages={["Please enter Postal Address"]}*/
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>

              <hr />
              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Number of Employees
              </h6>

              <div className="form-group row">
                <div className="col  mx-10">
                  <TextValidator
                    variant="outlined"
                    label="Total "
                    helperText="Total no of employees"
                    onChange={this.handleChange}
                    //defaultValue="0"
                    name="totalEmp"
                    value={this.state.totalEmp || 0}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                    disabled
                  />
                </div>
                <div className="col  mx-10">
                  <TextValidator
                    label="Male"
                    variant="outlined"
                    helperText="Total no of male employees"
                    onChange={this.handleChange}
                    name="maleEmp"
                    value={this.state.maleEmp || 0}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col  mx-10">
                  <TextValidator
                    label="Female"
                    variant="outlined"
                    helperText="Total no of female employees"
                    onChange={this.handleChange}
                    name="femaleEmp"
                    value={this.state.femaleEmp || 0}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col  mx-10">
                  <TextValidator
                    label="Youth"
                    variant="outlined"
                    helperText="(18-35 Years)"
                    onChange={this.handleChange}
                    name="youthEmp"
                    value={this.state.youthEmp || 0}
                    validators={["isNumber", "maxNumber:" + totalEmpMax]}
                    errorMessages={[
                      "It Should be numeric",
                      "Number is greater than total no. of employees",
                    ]}
                  />
                </div>
                <div className="col  mx-10">
                  <TextValidator
                    variant="outlined"
                    label="With Disability"
                    helperText="Total no of employees with disability"
                    onChange={this.handleChange}
                    name="disableEmp"
                    value={this.state.disableEmp || 0}
                    validators={["isNumber", "maxNumber:" + totalEmpMax]}
                    errorMessages={[
                      "It Should be numeric",
                      "Number is greater than total no. of employees",
                    ]}
                  />
                </div>
              </div>

              <p
                className="p-1 mb-2 bg-success text-white"
                style={{ textAlign: "left" }}
              >
                Type of Employment
              </p>
              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Permanent
              </h6>
              <div className="form-group row">
                <div className="col-sm-3">
                  <TextValidator
                    variant="outlined"
                    label="Male"
                    helperText="Total parmanent male employees"
                    onChange={this.handleChange}
                    name="malePermanent"
                    value={this.state.malePermanent}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Female"
                    variant="outlined"
                    helperText="Total parmanent female employees"
                    onChange={this.handleChange}
                    name="femalePermanent"
                    value={this.state.femalePermanent}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Youth Male"
                    variant="outlined"
                    helperText="(18-35 Years)"
                    onChange={this.handleChange}
                    name="youthMalePermanent"
                    value={this.state.youthMalePermanent}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Youth Female"
                    variant="outlined"
                    helperText="(18-35 Years) *"
                    onChange={this.handleChange}
                    name="youthFemalePermanent"
                    value={this.state.youthFemalePermanent}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
              </div>

              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Seasonal{" "}
              </h6>
              <div className="form-group row mt-20">
                <div className="col-sm-3">
                  <TextValidator
                    label="Male"
                    variant="outlined"
                    helperText="Total seasonal male employees"
                    onChange={this.handleChange}
                    name="maleSeasonal"
                    value={this.state.maleSeasonal}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Female"
                    variant="outlined"
                    helperText="Total seasonal female employees"
                    onChange={this.handleChange}
                    name="femaleSeasonal"
                    value={this.state.femaleSeasonal}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Youth Male"
                    variant="outlined"
                    helperText="(18-35 Years) "
                    onChange={this.handleChange}
                    name="youthMaleSeasonal"
                    value={this.state.youthMaleSeasonal}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Youth Female"
                    variant="outlined"
                    helperText="(18-35 Years)"
                    onChange={this.handleChange}
                    name="youthFemaleSeasonal"
                    value={this.state.youthFemaleSeasonal}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
              </div>

              <h6 style={{ textAlign: "left", fontWeight: "bold" }}>
                Contract{" "}
              </h6>
              <div className="form-group row mt-20">
                <div className="col-sm-3">
                  <TextValidator
                    label="Male"
                    variant="outlined"
                    helperText="Total contract male employees"
                    onChange={this.handleChange}
                    name="maleContract"
                    value={this.state.maleContract}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Female"
                    variant="outlined"
                    helperText="Total contract female employees"
                    onChange={this.handleChange}
                    name="femaleContract"
                    value={this.state.femaleContract}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Youth Male"
                    variant="outlined"
                    helperText="(18-35 Years)"
                    onChange={this.handleChange}
                    name="youthMaleContract"
                    value={this.state.youthMaleContract}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
                <div className="col-sm-3">
                  <TextValidator
                    label="Youth Female"
                    variant="outlined"
                    helperText="(18-35 Years) "
                    onChange={this.handleChange}
                    name="youthFemaleContract"
                    value={this.state.youthFemaleContract}
                    validators={["isNumber"]}
                    errorMessages={["It Should be numeric"]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <span className="mandatory">
                    All (*) marked fields are mandatory
                  </span>
                </div>
              </div>
              <div className="text-right" style={{ float: "right" }}>
                <Button
                  color="primary"
                  type="submit"
                  disabled={this.state.savedisabled}
                  style={saveBtnStyle}
                  className="farmerButtons"
                >
                  {this.state.savedisabled ? "Please wait..." : "Save and Next"}
                </Button>

                <Button
                  color="warning"
                  onClick={this.handleNext.bind(this)}
                  style={nextBtnStyle}
                  className="farmerButtons"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </ValidatorForm>
      </div>
    );
  }
}

export default FarmerRegistration;
